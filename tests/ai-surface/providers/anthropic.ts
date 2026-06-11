import type { ProviderResult, QueryInput } from "../types";
import { emptyResult, postJson, requireKey } from "./http";

/**
 * Anthropic Claude + server-side web_search.
 *
 * Verified against the claude-api skill (2026-06-11):
 *   - model pinned to `claude-sonnet-4-6` (NOT a date-suffixed id)
 *   - web_search tool version `web_search_20260209` (dynamic filtering)
 *   - search count from `usage.server_tool_use.web_search_requests`
 *
 * Model + tool version are pinned on purpose: a floating "latest" would make
 * the trend jump on every Anthropic release. Raw HTTP (not @anthropic-ai/sdk)
 * keeps this dormant tool dependency-free; see README for the SDK swap.
 */

const MODEL = "claude-sonnet-4-6";
const SEARCH_TOOL = "web_search_20260209";

interface TextBlock {
  type: "text";
  text: string;
  citations?: { url?: string }[];
}
interface SearchResultBlock {
  type: "web_search_tool_result";
  content?: { url?: string }[];
}
type Block = TextBlock | SearchResultBlock | { type: string };

interface MessagesResponse {
  content?: Block[];
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    server_tool_use?: { web_search_requests?: number };
  };
}

export async function callAnthropic(query: QueryInput): Promise<ProviderResult> {
  const out = emptyResult("anthropic", query);
  const start = Date.now();
  try {
    const data = (await postJson(
      "https://api.anthropic.com/v1/messages",
      {
        "x-api-key": requireKey("ANTHROPIC_API_KEY"),
        "anthropic-version": "2023-06-01",
      },
      {
        model: MODEL,
        max_tokens: 2048,
        tools: [{ type: SEARCH_TOOL, name: "web_search", max_uses: 3 }],
        messages: [{ role: "user", content: query.text }],
      },
    )) as MessagesResponse;

    const blocks = data.content ?? [];
    out.rawAnswer = blocks
      .filter((b): b is TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    const urls = new Set<string>();
    for (const b of blocks) {
      if (b.type === "text" && "citations" in b) {
        for (const c of (b as TextBlock).citations ?? []) if (c.url) urls.add(c.url);
      }
      if (b.type === "web_search_tool_result") {
        for (const c of (b as SearchResultBlock).content ?? []) if (c.url) urls.add(c.url);
      }
    }
    out.citedUrls = [...urls];
    out.inputTokens = data.usage?.input_tokens ?? 0;
    out.outputTokens = data.usage?.output_tokens ?? 0;
    out.serverSearchCount = data.usage?.server_tool_use?.web_search_requests ?? 0;
  } catch (err) {
    out.error = (err as Error).message;
  }
  out.durationMs = Date.now() - start;
  return out;
}
