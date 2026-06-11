import type { ProviderResult, QueryInput } from "../types";
import { emptyResult, postJson, requireKey } from "./http";

/**
 * Google Gemini with `google_search` grounding.
 *
 * ⚠️ VERIFY AT ACTIVATION: written from the JK-15 brief + public API shape but
 * NOT run (no key available at build time). Before trusting the trend, do one
 * live smoke call with GOOGLE_API_KEY and confirm the response path (candidates
 * text + groundingMetadata) against current Gemini docs.
 */

const MODEL = "gemini-2.0-flash";

interface GeminiResponse {
  candidates?: {
    content?: { parts?: { text?: string }[] };
    groundingMetadata?: { groundingChunks?: { web?: { uri?: string } }[] };
  }[];
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
}

export async function callGoogle(query: QueryInput): Promise<ProviderResult> {
  const out = emptyResult("google", query);
  const start = Date.now();
  try {
    const key = requireKey("GOOGLE_API_KEY");
    const data = (await postJson(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
      {},
      {
        contents: [{ parts: [{ text: query.text }] }],
        tools: [{ google_search: {} }],
      },
    )) as GeminiResponse;

    const cand = data.candidates?.[0];
    out.rawAnswer = (cand?.content?.parts ?? []).map((p) => p.text ?? "").join("\n");
    const chunks = cand?.groundingMetadata?.groundingChunks ?? [];
    out.citedUrls = chunks.map((c) => c.web?.uri).filter((u): u is string => Boolean(u));
    out.serverSearchCount = chunks.length > 0 ? 1 : 0;
    out.inputTokens = data.usageMetadata?.promptTokenCount ?? 0;
    out.outputTokens = data.usageMetadata?.candidatesTokenCount ?? 0;
  } catch (err) {
    out.error = (err as Error).message;
  }
  out.durationMs = Date.now() - start;
  return out;
}
