#!/usr/bin/env node
/**
 * Dependency CVE gate with an EXPIRING allowlist.
 *
 * Replaces a bare `npm audit --audit-level=high`, which had no way to say
 * "we know about this one and it has no forward fix". Without that, a single
 * unfixable transitive advisory turns a required check permanently red and
 * blocks every merge — including the merge that fixes the OTHER advisories.
 * That is exactly what happened on 2026-07-27: `sharp` (libvips) pinned this
 * repo shut while six Next.js advisories, among them SSRF in rewrites and
 * unauthenticated disclosure of internal Server Function endpoints, sat
 * waiting behind it.
 *
 * DESIGN RULES, in order of importance:
 *
 *  1. FAIL CLOSED. Every unexpected condition exits non-zero: malformed audit
 *     JSON, an empty payload, a missing `vulnerabilities` key, an allowlist
 *     entry whose shape is wrong, an unparseable date. A gate that fails open
 *     is worse than no gate, because it reports green.
 *  2. AN ENTRY EXPIRES. Past its date the build goes red EVEN IF the advisory
 *     is gone. That forces a human to look again instead of letting a
 *     temporary acceptance become permanent silence. This mirrors the sandbox
 *     repo's decay-check.yml, where a deadline is enforced by a job rather
 *     than by memory.
 *  3. MATCH ON ADVISORY ID, NEVER ON PACKAGE NAME. npm reports a parent
 *     package as high purely because a child is (`next` shows up "via: sharp"
 *     with no advisory of its own). Allowlisting by package name would
 *     therefore suppress far more than intended, and would silently keep
 *     suppressing it after the child was fixed. Collecting the distinct GHSA
 *     ids across the whole tree sidesteps that entirely.
 *  4. NO NEW DEPENDENCY. `audit-ci` and `better-npm-audit` both solve this,
 *     and both mean adding a dependency to the thing whose job is auditing
 *     dependencies. This is ~120 lines of zero-dep Node, in the same style as
 *     scripts/check-private-slug-leak.sh.
 *
 * Usage:  node scripts/audit-gate.mjs
 * Tests:  node scripts/audit-gate.test.mjs
 */

import { execFileSync } from "node:child_process";

/**
 * Advisories we consciously accept, each with a reason and a hard expiry.
 *
 * Adding a line here is a DECISION, not a formality. Two questions must both
 * be answered in the reason: why can this not be fixed today, and what would
 * have to change for it to be removed.
 */
export const ALLOWLIST = [
  {
    id: "GHSA-f88m-g3jw-g9cj",
    pkg: "sharp",
    devOnly: false,
    expires: "2026-10-31",
    reason:
      "sharp <0.35.0 inherits libvips CVEs. No forward fix inside Next's dependency range — " +
      "next@16.2.12 still resolves sharp to 0.34.5, and npm's proposed remedy is next@14.2.35, " +
      "a downgrade across two majors. Removable when Next widens its sharp range to >=0.35.0.",
  },
  {
    id: "GHSA-h67p-54hq-rp68",
    pkg: "js-yaml",
    devOnly: false,
    expires: "2026-10-31",
    reason:
      "js-yaml <=3.14.2 via gray-matter (blog front-matter). 3.14.2 is the LAST 3.x, so there is " +
      "no non-vulnerable 3.x, and gray-matter@4.0.3 — already the latest — declares js-yaml ^3.13.1 " +
      "and binds yaml.safeLoad at module load, which js-yaml 4 removed. An override to 4.x throws " +
      "at build time. Removable when gray-matter ships a js-yaml 4 release, or we replace it.",
  },
  {
    id: "GHSA-52cp-r559-cp3m",
    pkg: "js-yaml",
    devOnly: false,
    expires: "2026-10-31",
    reason: "Second js-yaml advisory, same package and same blocker as GHSA-h67p-54hq-rp68.",
  },
  {
    id: "GHSA-3jxr-9vmj-r5cp",
    pkg: "brace-expansion",
    devOnly: true,
    expires: "2026-10-31",
    reason:
      "DoS in brace-expansion, reached only via minimatch@3 under ESLint tooling — dev-only, not in " +
      "the production bundle. A global override to 5.x would force a four-major jump on minimatch@3 " +
      "and risks breaking lint for a lint-time glob matcher. Removable once the ESLint chain moves off " +
      "minimatch@3 (eslint 10 does).",
  },
  {
    id: "GHSA-mh99-v99m-4gvg",
    pkg: "brace-expansion",
    devOnly: true,
    expires: "2026-10-31",
    reason: "Second brace-expansion advisory, same package and same blocker as GHSA-3jxr-9vmj-r5cp.",
  },
];

const GATED = new Set(["high", "critical"]);

function die(message) {
  console.error(`\n[31mFAIL: ${message}[0m`);
  process.exit(1);
}

/** Runs npm audit and returns the parsed payload. npm exits non-zero when it finds
 *  anything, so a non-zero exit is expected and only the STDOUT matters. */
export function runAudit() {
  let raw;
  try {
    raw = execFileSync("npm", ["audit", "--json"], {
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
    });
  } catch (err) {
    raw = err.stdout;
    // No stdout at all means npm itself failed (offline, bad registry, no lockfile).
    // That is NOT "no vulnerabilities" — fail closed.
    if (!raw || !raw.trim()) {
      die(`npm audit produced no output (exit ${err.status}). Cannot verify — refusing to pass.`);
    }
  }
  return raw;
}

/** Extracts the distinct gated advisories from an npm-audit payload. Throws rather
 *  than returning empty on anything it does not recognise. */
export function collectAdvisories(raw) {
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("npm audit did not return valid JSON — refusing to pass.");
  }
  if (!data || typeof data !== "object") {
    throw new Error("npm audit JSON was not an object — refusing to pass.");
  }
  if (!("vulnerabilities" in data)) {
    throw new Error(
      "npm audit JSON has no `vulnerabilities` key — the format changed or the run failed. " +
        "Refusing to pass.",
    );
  }

  const found = new Map();
  for (const entry of Object.values(data.vulnerabilities)) {
    if (!entry || !GATED.has(entry.severity)) continue;
    for (const via of entry.via ?? []) {
      // Strings are parent-package pointers, not advisories. Only objects carry an id.
      if (typeof via !== "object" || via === null) continue;
      const id = String(via.url ?? "").split("/").pop();
      if (!id) continue;
      found.set(id, { id, title: via.title ?? "(no title)", pkg: entry.name ?? via.name ?? "?" });
    }
  }
  return found;
}

/** Validates allowlist shape and returns the entries that are past their date. */
export function findExpired(allowlist, today) {
  const expired = [];
  for (const entry of allowlist) {
    if (!entry?.id || !entry?.expires || !entry?.reason) {
      throw new Error(`allowlist entry is missing id/expires/reason: ${JSON.stringify(entry)}`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.expires)) {
      throw new Error(`allowlist entry ${entry.id} has a malformed expires date: ${entry.expires}`);
    }
    if (entry.expires < today) expired.push(entry);
  }
  return expired;
}

export function evaluate(raw, allowlist, today) {
  const found = collectAdvisories(raw);
  const expired = findExpired(allowlist, today);
  const allowed = new Map(allowlist.map((e) => [e.id, e]));

  const unlisted = [...found.values()].filter((a) => !allowed.has(a.id));
  const suppressed = [...found.values()].filter((a) => allowed.has(a.id));

  return { found, unlisted, suppressed, expired, allowed };
}

function main() {
  const today = new Date().toISOString().slice(0, 10);
  let result;
  try {
    result = evaluate(runAudit(), ALLOWLIST, today);
  } catch (err) {
    die(err.message);
    return;
  }

  console.log("=== Dependency CVE gate (high/critical, expiring allowlist) ===\n");

  if (result.suppressed.length) {
    console.log("Accepted advisories — each expires and will turn this gate red:");
    for (const a of result.suppressed) {
      const e = result.allowed.get(a.id);
      console.log(`  [33m~[0m ${a.id}  ${a.pkg}${e.devOnly ? "  [dev-only]" : ""}`);
      console.log(`      ${a.title}`);
      console.log(`      expires ${e.expires} — ${e.reason}`);
    }
    console.log("");
  }

  const staleEntries = ALLOWLIST.filter(
    (e) => !result.found.has(e.id) && !result.expired.includes(e),
  );
  if (staleEntries.length) {
    console.log("Listed but no longer reported — the advisory is gone, drop these lines:");
    for (const e of staleEntries) console.log(`  [36m·[0m ${e.id}  ${e.pkg}`);
    console.log("");
  }

  if (result.expired.length) {
    console.error("[31mEXPIRED allowlist entries — re-decide, do not just extend:[0m");
    for (const e of result.expired) {
      console.error(`  [31mx[0m ${e.id}  ${e.pkg}  expired ${e.expires}`);
      console.error(`      ${e.reason}`);
    }
  }

  if (result.unlisted.length) {
    console.error("[31mUNACCEPTED high/critical advisories:[0m");
    for (const a of result.unlisted) {
      console.error(`  [31mx[0m ${a.id}  ${a.pkg}`);
      console.error(`      ${a.title}`);
    }
  }

  if (result.expired.length || result.unlisted.length) {
    die(
      `${result.unlisted.length} unaccepted advisory/advisories, ` +
        `${result.expired.length} expired allowlist entry/entries.`,
    );
  }

  console.log(
    `[32mPASS[0m — ${result.found.size} gated advisory/advisories, all explicitly accepted and unexpired.`,
  );
}

// Only run when invoked directly, so the tests can import the pure helpers.
if (process.argv[1] && process.argv[1].endsWith("audit-gate.mjs")) main();
