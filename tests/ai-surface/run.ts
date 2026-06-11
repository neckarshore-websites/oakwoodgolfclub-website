/**
 * AI-Surface-Monitoring orchestrator (JK-15).
 *
 * Runs the 5 frozen queries across the 4 providers, scores each answer against
 * the ground truth, writes a Markdown report + raw JSON, diffs against the
 * previous run, and flags a regression for the GitHub Actions workflow.
 *
 * Run locally:  npm run test:ai-surface   (needs the 4 API keys in .env.local)
 * In CI:        .github/workflows/ai-surface-monitor.yml (Mondays 06:00 UTC)
 *
 * Cost cap: max_tokens 2048 + web-search max_uses 3 per call. ~0.70 USD/run.
 */

import { appendFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { QUERIES } from "./queries";
import { scoreAnswer } from "./score";
import { buildReport } from "./report";
import type { ProviderResult, RunArtifact, ScoredResult } from "./types";
import { callAnthropic } from "./providers/anthropic";
import { callOpenAI } from "./providers/openai";
import { callGoogle } from "./providers/google";
import { callPerplexity } from "./providers/perplexity";

const REPORT_DIR = join(dirname(fileURLToPath(import.meta.url)), "../../docs/reports/ai-surface");

const PROVIDERS: { key: string; call: (q: (typeof QUERIES)[number]) => Promise<ProviderResult> }[] = [
  { key: "anthropic", call: callAnthropic },
  { key: "openai", call: callOpenAI },
  { key: "google", call: callGoogle },
  { key: "perplexity", call: callPerplexity },
];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Most recent prior raw.json (strictly before `date`), parsed — or null. */
function loadPrevious(date: string): RunArtifact | null {
  let files: string[] = [];
  try {
    files = readdirSync(REPORT_DIR).filter((f) => f.endsWith("-raw.json") && f.slice(0, 10) < date);
  } catch {
    return null;
  }
  if (files.length === 0) return null;
  files.sort();
  const latest = files[files.length - 1];
  try {
    return JSON.parse(readFileSync(join(REPORT_DIR, latest), "utf8")) as RunArtifact;
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  const date = today();
  const results: ScoredResult[] = [];

  // Sequential across queries (politeness), parallel across providers per query.
  for (const query of QUERIES) {
    const round = await Promise.all(
      PROVIDERS.map(async ({ call }) => scoreAnswer(await call(query), query)),
    );
    results.push(...round);
    const line = round.map((r) => `${r.surface}:${r.rating}`).join("  ");
    console.log(`${query.id}  ${line}`);
  }

  const artifact: RunArtifact = { date, results };
  const previous = loadPrevious(date);
  const { markdown, summary, regression } = buildReport(artifact, previous);

  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(join(REPORT_DIR, `${date}-monitoring.md`), markdown);
  writeFileSync(join(REPORT_DIR, `${date}-raw.json`), JSON.stringify(artifact, null, 2));
  writeFileSync(join(REPORT_DIR, "_latest-summary.md"), summary);

  console.log(`\nReport written to docs/reports/ai-surface/${date}-monitoring.md`);
  console.log(`Regression: ${regression ? "YES" : "no"}`);

  if (process.env.GITHUB_ENV) {
    appendFileSync(process.env.GITHUB_ENV, `HAS_REGRESSION=${regression ? "true" : "false"}\n`);
  }
}

main().catch((err) => {
  console.error("ai-surface run failed:", err);
  process.exit(1);
});
