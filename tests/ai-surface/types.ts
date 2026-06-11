/**
 * Shared interfaces for the AI-surface monitoring tool (JK-15).
 *
 * The provider adapters all return a `ProviderResult`; the scorer turns that
 * into a `ScoredResult` against the frozen ground truth. Nothing here depends
 * on a specific AI provider — that isolation is what lets the scorer be
 * unit-tested without any API keys.
 */

export interface QueryInput {
  /** Stable id, frozen for trend comparability (Q1..Q5). */
  id: string;
  /** The exact search phrase sent to every provider. */
  text: string;
  /** The single fact this query primarily probes (documentation only). */
  fact: string;
}

export interface ProviderResult {
  /** Provider key: "anthropic" | "openai" | "google" | "perplexity". */
  surface: string;
  queryId: string;
  rawAnswer: string;
  citedUrls: string[];
  inputTokens: number;
  outputTokens: number;
  /** Server-side web-search invocations (cost signal). */
  serverSearchCount: number;
  durationMs: number;
  /** Set when the call failed (network/auth/rate-limit) — distinct from a refusal. */
  error?: string;
}

export type Rating = "pass" | "partial" | "fail" | "refused";

export interface Hallucination {
  name: string;
  severity: HallucinationSeverity;
  excerpt: string;
}

export interface ScoredResult extends ProviderResult {
  factsReproduced: Record<string, boolean>;
  hallucinations: Hallucination[];
  rating: Rating;
}

export type HallucinationSeverity = "high" | "medium" | "low";

export interface FactDef {
  match: RegExp;
  /** "all" or a comma-separated query-id list, e.g. "Q1,Q5". */
  requiredFor: string;
  critical?: boolean;
}

export interface HallucinationDef {
  match: RegExp;
  severity: HallucinationSeverity;
}

export interface RunArtifact {
  /** ISO date (YYYY-MM-DD) — passed in, never derived (cron-stamped). */
  date: string;
  results: ScoredResult[];
}
