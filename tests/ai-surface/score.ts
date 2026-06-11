import type { ProviderResult, QueryInput, Rating, ScoredResult } from "./types";
import { FACTS, HALLUCINATIONS } from "./ground-truth";

/** Whether a fact's `requiredFor` ("all" | "Q1,Q5") applies to this query. */
function appliesTo(requiredFor: string, queryId: string): boolean {
  return (
    requiredFor === "all" ||
    requiredFor
      .split(",")
      .map((s) => s.trim())
      .includes(queryId)
  );
}

/** ~30 chars on either side of the first match, whitespace-collapsed. */
export function extractMatchContext(text: string, match: RegExp): string {
  const m = new RegExp(match.source, match.flags.replace("g", "")).exec(text);
  if (!m) return "";
  const start = Math.max(0, m.index - 30);
  const end = Math.min(text.length, m.index + m[0].length + 30);
  const slice = text.slice(start, end).replace(/\s+/g, " ").trim();
  return `${start > 0 ? "…" : ""}${slice}${end < text.length ? "…" : ""}`;
}

/**
 * Score one provider answer against the ground truth.
 *
 * Rating ladder (first match wins):
 *   refused  — empty/near-empty answer (< 50 non-space chars)
 *   fail     — any high-severity hallucination, OR < 50% of required facts
 *   partial  — 50–84% of required facts and no high hallucination
 *   pass     — ≥ 85% of required facts and no high hallucination
 *
 * This function is pure and provider-agnostic — it's the part validated
 * against JK-10 Lauf 1 (the ≥85%-agreement acceptance gate) and unit-tested
 * in score.test.ts. No network, no keys.
 */
export function scoreAnswer(result: ProviderResult, query: QueryInput): ScoredResult {
  if (!result.rawAnswer || result.rawAnswer.replace(/\s/g, "").length < 50) {
    return { ...result, rating: "refused", factsReproduced: {}, hallucinations: [] };
  }

  const factsReproduced: Record<string, boolean> = {};
  for (const [key, def] of Object.entries(FACTS)) {
    if (appliesTo(def.requiredFor, query.id)) {
      factsReproduced[key] = def.match.test(result.rawAnswer);
    }
  }

  const hallucinations = Object.entries(HALLUCINATIONS)
    .filter(([, def]) => def.match.test(result.rawAnswer))
    .map(([name, def]) => ({
      name,
      severity: def.severity,
      excerpt: extractMatchContext(result.rawAnswer, def.match),
    }));

  const checked = Object.values(factsReproduced);
  const factPassRate = checked.length === 0 ? 1 : checked.filter(Boolean).length / checked.length;

  const rating: Rating = hallucinations.some((h) => h.severity === "high")
    ? "fail"
    : factPassRate < 0.5
      ? "fail"
      : factPassRate < 0.85
        ? "partial"
        : "pass";

  return { ...result, factsReproduced, hallucinations, rating };
}

/** Per-provider score out of the number of queries (pass=1, partial=0.5). */
export function providerScore(results: ScoredResult[]): number {
  return results.reduce((sum, r) => sum + (r.rating === "pass" ? 1 : r.rating === "partial" ? 0.5 : 0), 0);
}
