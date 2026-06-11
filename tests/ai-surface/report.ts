import type { Rating, RunArtifact, ScoredResult } from "./types";
import { QUERIES } from "./queries";
import { providerScore } from "./score";

const SYMBOL: Record<Rating, string> = {
  pass: "✅",
  partial: "⚠️",
  fail: "❌",
  refused: "·",
};

const PROVIDERS = ["anthropic", "openai", "google", "perplexity"] as const;

function byProvider(results: ScoredResult[]): Map<string, Map<string, ScoredResult>> {
  const map = new Map<string, Map<string, ScoredResult>>();
  for (const r of results) {
    if (!map.has(r.surface)) map.set(r.surface, new Map());
    map.get(r.surface)!.set(r.queryId, r);
  }
  return map;
}

function summaryMatrix(results: ScoredResult[]): string {
  const grid = byProvider(results);
  const header = `|            | ${QUERIES.map((q) => q.id).join(" | ")} | Score |`;
  const divider = `|---|${QUERIES.map(() => "---").join("|")}|---|`;
  const rows = PROVIDERS.filter((p) => grid.has(p)).map((p) => {
    const row = grid.get(p)!;
    const cells = QUERIES.map((q) => SYMBOL[row.get(q.id)?.rating ?? "refused"]);
    const score = providerScore([...row.values()]);
    return `| ${p.padEnd(10)} | ${cells.join(" | ")} | ${score}/${QUERIES.length} |`;
  });
  return [header, divider, ...rows].join("\n");
}

/**
 * Regression = any provider score dropped, a new high-severity hallucination
 * appeared, or a query slipped from pass to fail/refused vs the prior run.
 */
export function detectRegression(
  current: ScoredResult[],
  previous: ScoredResult[] | null,
): { regression: boolean; notes: string[] } {
  if (!previous) return { regression: false, notes: ["No prior run — baseline only."] };
  const prev = byProvider(previous);
  const cur = byProvider(current);
  const notes: string[] = [];
  let regression = false;

  for (const p of PROVIDERS) {
    const c = cur.get(p);
    const pr = prev.get(p);
    if (!c || !pr) continue;
    const cScore = providerScore([...c.values()]);
    const pScore = providerScore([...pr.values()]);
    if (cScore < pScore) {
      regression = true;
      notes.push(`${p}: score ${pScore} → ${cScore} (down)`);
    }
    for (const q of QUERIES) {
      const cr = c.get(q.id);
      const prr = pr.get(q.id);
      if (!cr || !prr) continue;
      if (prr.rating === "pass" && (cr.rating === "fail" || cr.rating === "refused")) {
        regression = true;
        notes.push(`${p} ${q.id}: ${prr.rating} → ${cr.rating}`);
      }
      const prevHigh = new Set(prr.hallucinations.filter((h) => h.severity === "high").map((h) => h.name));
      for (const h of cr.hallucinations) {
        if (h.severity === "high" && !prevHigh.has(h.name)) {
          regression = true;
          notes.push(`${p} ${q.id}: NEW high hallucination "${h.name}"`);
        }
      }
    }
  }
  if (!regression) notes.push("No regression vs prior run.");
  return { regression, notes };
}

/** Builds the full monitoring report + a short summary for the GitHub issue. */
export function buildReport(
  artifact: RunArtifact,
  previous: RunArtifact | null,
): { markdown: string; summary: string; regression: boolean } {
  const { date, results } = artifact;
  const totalSearches = results.reduce((n, r) => n + r.serverSearchCount, 0);
  const errors = results.filter((r) => r.error);
  const { regression, notes } = detectRegression(results, previous?.results ?? null);

  const halluc = results.flatMap((r) =>
    r.hallucinations.map((h) => `- **${h.name}** (${h.severity}) — ${r.surface} ${r.queryId}: ${h.excerpt || "—"}`),
  );

  const summary = [
    `# AI-Surface-Monitoring — ${date}`,
    "",
    `Server searches: ${totalSearches} · Errors: ${errors.length} · Regression: ${regression ? "YES ⚠️" : "no"}`,
    "",
    "## Summary-Matrix",
    "",
    summaryMatrix(results),
    "",
    `## Drift vs ${previous?.date ?? "(none)"}`,
    "",
    notes.map((n) => `- ${n}`).join("\n"),
  ].join("\n");

  const details = results
    .map((r) => {
      const facts = Object.entries(r.factsReproduced)
        .map(([k, v]) => `${v ? "✅" : "❌"} ${k}`)
        .join(", ");
      return [
        `### ${r.surface} · ${r.queryId} — ${r.rating}`,
        r.error ? `> ERROR: ${r.error}` : "",
        `Facts: ${facts || "(none required)"}`,
        `Cited: ${r.citedUrls.slice(0, 5).join(", ") || "—"}`,
        `Tokens in/out: ${r.inputTokens}/${r.outputTokens} · searches: ${r.serverSearchCount} · ${r.durationMs}ms`,
        "",
        "Answer:",
        "",
        "> " + (r.rawAnswer || "(empty)").slice(0, 600).replace(/\n/g, "\n> "),
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  const markdown = [
    summary,
    "",
    "## Hallucination findings",
    "",
    halluc.length ? halluc.join("\n") : "_none_",
    "",
    "## Details",
    "",
    details,
  ].join("\n");

  return { markdown, summary, regression };
}
