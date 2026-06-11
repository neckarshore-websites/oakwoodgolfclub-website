import type { ProviderResult, QueryInput } from "../types";
import { emptyResult, postJson, requireKey } from "./http";

/**
 * Perplexity Sonar (web search is the default — no tool to declare).
 *
 * ⚠️ VERIFY AT ACTIVATION: written from the JK-15 brief + public API shape but
 * NOT run (no key available at build time). Before trusting the trend, do one
 * live smoke call with PERPLEXITY_API_KEY and confirm the response path
 * (choices content + citations) against current Perplexity docs.
 */

const MODEL = "sonar-pro";

interface SonarResponse {
  choices?: { message?: { content?: string } }[];
  citations?: string[];
  usage?: { prompt_tokens?: number; completion_tokens?: number };
}

export async function callPerplexity(query: QueryInput): Promise<ProviderResult> {
  const out = emptyResult("perplexity", query);
  const start = Date.now();
  try {
    const data = (await postJson(
      "https://api.perplexity.ai/chat/completions",
      { authorization: `Bearer ${requireKey("PERPLEXITY_API_KEY")}` },
      {
        model: MODEL,
        messages: [{ role: "user", content: query.text }],
      },
    )) as SonarResponse;

    out.rawAnswer = data.choices?.[0]?.message?.content ?? "";
    out.citedUrls = data.citations ?? [];
    out.serverSearchCount = out.citedUrls.length > 0 ? 1 : 0;
    out.inputTokens = data.usage?.prompt_tokens ?? 0;
    out.outputTokens = data.usage?.completion_tokens ?? 0;
  } catch (err) {
    out.error = (err as Error).message;
  }
  out.durationMs = Date.now() - start;
  return out;
}
