import type { ProviderResult, QueryInput } from "../types";
import { emptyResult, postJson, requireKey } from "./http";

/**
 * OpenAI web-search-grounded answer via the `gpt-4o-search-preview` model.
 *
 * ⚠️ VERIFY AT ACTIVATION: written from the JK-15 brief + public API shape but
 * NOT run (no key available at build time). Before trusting the trend, do one
 * live smoke call with OPENAI_API_KEY and confirm the response path below
 * (content + url_citation annotations) against current OpenAI docs.
 */

const MODEL = "gpt-4o-search-preview";

interface ChatResponse {
  choices?: {
    message?: {
      content?: string;
      annotations?: { type?: string; url_citation?: { url?: string } }[];
    };
  }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number };
}

export async function callOpenAI(query: QueryInput): Promise<ProviderResult> {
  const out = emptyResult("openai", query);
  const start = Date.now();
  try {
    const data = (await postJson(
      "https://api.openai.com/v1/chat/completions",
      { authorization: `Bearer ${requireKey("OPENAI_API_KEY")}` },
      {
        model: MODEL,
        web_search_options: {},
        messages: [{ role: "user", content: query.text }],
      },
    )) as ChatResponse;

    const msg = data.choices?.[0]?.message;
    out.rawAnswer = msg?.content ?? "";
    out.citedUrls = (msg?.annotations ?? [])
      .map((a) => a.url_citation?.url)
      .filter((u): u is string => Boolean(u));
    out.serverSearchCount = out.citedUrls.length > 0 ? 1 : 0;
    out.inputTokens = data.usage?.prompt_tokens ?? 0;
    out.outputTokens = data.usage?.completion_tokens ?? 0;
  } catch (err) {
    out.error = (err as Error).message;
  }
  out.durationMs = Date.now() - start;
  return out;
}
