#!/usr/bin/env node

/**
 * Local Lighthouse audit — runs against a prod build on localhost.
 *
 * Usage:
 *   npm run lighthouse           (builds, starts, audits all profiles, stops)
 *   npm run lighthouse:quick     (skips build, assumes server is running on :3000)
 *
 * Device Matrix (3 profiles):
 *   1. Desktop     — LAN baseline, 1x CPU, 40ms / 10 Mbps         [hard gate]
 *   2. Mobile 4G   — Lighthouse default mobile (Slow 4G)          [hard gate]
 *   3. Mobile Slow — Edge-of-coverage 5G / weak signal            [soft warn only]
 *
 * Gate Policy:
 *   - Hard profiles run RUNS_HARD times (default 3) and gate on the MEDIAN
 *     score — a single noisy CI run can't flip the build. Soft profiles run once.
 *   - Hard profiles exit 1 if any median score is below threshold.
 *   - Soft profiles report warnings but never fail the build.
 *   - Mobile Slow Stage 2 thresholds set 2026-04-13 after 5-run baseline
 *     (median 68, threshold = median − 5 = 63).
 *
 * Thresholds history:
 *   - Perf 85 was chosen historically because mobile Next.js framework JS
 *     overhead costs ~12 points on 4x CPU throttle. Raised to 90 (Mobile 4G)
 *     and 95 (Desktop) in 2026-04-10 to catch silent regressions.
 */

import { execFileSync, spawn } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ── Profile Definitions ──────────────────────────────────────────────

const PROFILES = [
  {
    name: "desktop",
    label: "Desktop",
    gate: "hard",
    lhArgs: ["--preset=desktop"],
    thresholds: {
      performance: 95,
      accessibility: 95,
      "best-practices": 95,
      seo: 95,
    },
    reportFile: "report-desktop.json",
  },
  {
    name: "mobile-4g",
    label: "Mobile 4G",
    gate: "hard",
    lhArgs: ["--form-factor=mobile", "--screenEmulation.mobile"],
    thresholds: {
      performance: 90,
      accessibility: 95,
      "best-practices": 95,
      seo: 95,
    },
    reportFile: "report-mobile-4g.json",
  },
  {
    name: "mobile-slow",
    label: "Mobile Slow (Edge-5G)",
    gate: "soft",
    lhArgs: [
      "--form-factor=mobile",
      "--screenEmulation.mobile",
      "--throttling-method=simulate",
      "--throttling.rttMs=400",
      "--throttling.throughputKbps=400",
      "--throttling.cpuSlowdownMultiplier=6",
    ],
    // Stage 2 thresholds (2026-04-13): baseline median 68, formula = baseline − 5.
    // 5 runs (local+CI): [67, 68, 68, 70, 71]. Variance ±4 pts, stable enough.
    thresholds: {
      performance: 63,
      accessibility: 95,
      "best-practices": 95,
      seo: 95,
    },
    reportFile: "report-mobile-slow.json",
  },
];

const URL = process.env.LIGHTHOUSE_URL || "http://localhost:3000";
const QUICK = process.argv.includes("--quick");
const MAX_RETRIES = 3;

// Flakiness control: hard-gate profiles run N times and the MEDIAN score is
// gated, so a single noisy run (e.g. a TBT spike on shared CI CPU) can't flip
// a green build red. (MAX_RETRIES above only re-runs on *errored* audits — a
// successful-but-low run still counts, which is exactly the flake we hit:
// Desktop Performance 83 on one runner vs 95 on another for identical code.)
// Soft profiles run once. Override with LIGHTHOUSE_RUNS (e.g. =1 for a fast
// local pass). Median of 3 is the web.dev-recommended baseline.
const RUNS_HARD = Math.max(1, Number(process.env.LIGHTHOUSE_RUNS) || 3);

// Optional: filter to a single profile via --profile=desktop|mobile-4g|mobile-slow
const profileArg = process.argv.find((a) => a.startsWith("--profile="));
const selectedProfile = profileArg ? profileArg.split("=")[1] : null;
const PROFILES_TO_RUN = selectedProfile
  ? PROFILES.filter((p) => p.name === selectedProfile)
  : PROFILES;

if (selectedProfile && PROFILES_TO_RUN.length === 0) {
  console.error(`Unknown profile: ${selectedProfile}`);
  console.error(`Available: ${PROFILES.map((p) => p.name).join(", ")}`);
  process.exit(2);
}

// ── Helpers ──────────────────────────────────────────────────────────

function log(msg) {
  console.log(`\n  ${msg}`);
}

function waitForServer(url, timeoutMs = 30_000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      try {
        execFileSync("curl", ["-sf", url], { stdio: "ignore" });
        resolve();
      } catch {
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Server did not start within ${timeoutMs}ms`));
        } else {
          setTimeout(check, 500);
        }
      }
    };
    check();
  });
}

function runLighthouse(lhBin, targetUrl, outputPath, extraArgs = []) {
  const args = [
    targetUrl,
    "--output=json",
    `--output-path=${outputPath}`,
    "--chrome-flags=--headless=new --no-sandbox",
    "--only-categories=performance,accessibility,best-practices,seo",
    "--quiet",
    ...extraArgs,
  ];

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      execFileSync(lhBin, args, { cwd: ROOT, stdio: "pipe" });
      const report = JSON.parse(readFileSync(outputPath, "utf-8"));
      if (report.categories?.performance?.score === null) {
        throw new Error("Performance score is null (likely NO_LCP trace error)");
      }
      return;
    } catch {
      if (attempt < MAX_RETRIES) {
        console.log(`  Attempt ${attempt} failed, retrying...`);
      } else {
        execFileSync(lhBin, args, { cwd: ROOT, stdio: "inherit" });
      }
    }
  }
}

function getScores(report) {
  const cats = report.categories || {};
  return {
    performance: Math.round((cats.performance?.score || 0) * 100),
    accessibility: Math.round((cats.accessibility?.score || 0) * 100),
    "best-practices": Math.round((cats["best-practices"]?.score || 0) * 100),
    seo: Math.round((cats.seo?.score || 0) * 100),
  };
}

function getMetrics(report) {
  const a = report.audits || {};
  return {
    lcp: a["largest-contentful-paint"]?.numericValue,
    fcp: a["first-contentful-paint"]?.numericValue,
    tbt: a["total-blocking-time"]?.numericValue,
    cls: a["cumulative-layout-shift"]?.numericValue,
    si: a["speed-index"]?.numericValue,
  };
}

function fmtMs(n) {
  if (n == null) return "—";
  return n >= 1000 ? `${(n / 1000).toFixed(1)}s` : `${Math.round(n)}ms`;
}

function fmtCls(n) {
  if (n == null) return "—";
  return n.toFixed(3);
}

function fmtDelta(current, previous) {
  if (previous == null) return "";
  const diff = current - previous;
  if (diff === 0) return " (±0)";
  const sign = diff > 0 ? "+" : "";
  return ` (${sign}${diff} vs last)`;
}

function capitalizeKey(key) {
  return key
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

// ── Main ─────────────────────────────────────────────────────────────

let server;

try {
  if (!QUICK) {
    log("Building production bundle...");
    execFileSync("npm", ["run", "build"], { cwd: ROOT, stdio: "inherit" });

    log("Starting production server...");
    server = spawn("npm", ["run", "start"], {
      cwd: ROOT,
      stdio: "pipe",
      detached: false,
    });

    await waitForServer(URL);
    log("Server ready.");
  } else {
    log("Quick mode — assuming server is running on :3000");
  }

  const reportDir = resolve(ROOT, ".lighthouse");
  mkdirSync(reportDir, { recursive: true });
  const lhBin = resolve(ROOT, "node_modules/.bin/lighthouse");

  const hardFailures = [];
  const softWarnings = [];
  const summary = [];

  for (const profile of PROFILES_TO_RUN) {
    const reportPath = resolve(reportDir, profile.reportFile);

    // Capture previous scores for delta-awareness BEFORE overwriting the file.
    let previousScores = null;
    if (existsSync(reportPath)) {
      try {
        previousScores = getScores(JSON.parse(readFileSync(reportPath, "utf-8")));
      } catch {
        // Ignore malformed previous report.
      }
    }

    // Hard gates run N times and gate on the median; soft profiles run once.
    const runs = profile.gate === "hard" ? RUNS_HARD : 1;
    const samples = [];
    for (let r = 1; r <= runs; r++) {
      log(
        runs > 1
          ? `Running Lighthouse audit (${profile.label}) — run ${r}/${runs}...`
          : `Running Lighthouse audit (${profile.label})...`
      );
      runLighthouse(lhBin, URL, reportPath, profile.lhArgs);
      const runReport = JSON.parse(readFileSync(reportPath, "utf-8"));
      samples.push({
        report: runReport,
        scores: getScores(runReport),
        metrics: getMetrics(runReport),
      });
    }

    // Gate on the MEDIAN run (by performance) — robust to single-run CI noise.
    const median = [...samples].sort(
      (a, b) => a.scores.performance - b.scores.performance
    )[Math.floor(samples.length / 2)];
    const scores = median.scores;
    const metrics = median.metrics;

    // Persist the median run as the report artifact (not whichever ran last).
    writeFileSync(reportPath, JSON.stringify(median.report));

    const runSpread =
      runs > 1 ? samples.map((s) => s.scores.performance).join(", ") : null;

    console.log(`\n── ${profile.label} [${profile.gate}] ──`);

    for (const [key, score] of Object.entries(scores)) {
      const delta = fmtDelta(score, previousScores?.[key]);
      const threshold = profile.thresholds?.[key];

      if (threshold != null) {
        const pass = score >= threshold;
        const icon = pass ? "  ✓" : "  ✗";
        console.log(
          `${icon} ${capitalizeKey(key)}: ${score} (threshold: ${threshold})${delta}`
        );
        if (!pass) {
          const failure = `${profile.label} ${capitalizeKey(key)}: ${score} < ${threshold}`;
          if (profile.gate === "hard") {
            hardFailures.push(failure);
          } else {
            softWarnings.push(failure);
          }
        }
      } else {
        // No threshold set (soft profile, Stage 2 pending) — report only.
        console.log(`  · ${capitalizeKey(key)}: ${score}${delta}`);
      }
    }

    console.log(
      `    LCP: ${fmtMs(metrics.lcp)} | FCP: ${fmtMs(metrics.fcp)} | ` +
        `TBT: ${fmtMs(metrics.tbt)} | CLS: ${fmtCls(metrics.cls)} | ` +
        `SI: ${fmtMs(metrics.si)}`
    );
    if (runSpread) {
      console.log(
        `    Performance runs: [${runSpread}] → median ${scores.performance} (gated)`
      );
    }

    summary.push({ profile: profile.label, gate: profile.gate, scores, metrics });
  }

  if (softWarnings.length > 0) {
    console.log("\n⚠ Soft warnings (reported, not blocking):");
    for (const w of softWarnings) console.log(`   - ${w}`);
  }

  if (hardFailures.length > 0) {
    console.log("\n✗ Lighthouse hard gate FAILED:");
    for (const f of hardFailures) console.log(`   - ${f}`);
    process.exit(1);
  }

  log("All hard gates passed. Ship it.");
  process.exit(0);
} finally {
  if (server) server.kill("SIGTERM");
}
