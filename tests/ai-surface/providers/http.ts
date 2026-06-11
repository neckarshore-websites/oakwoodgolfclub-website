import type { ProviderResult, QueryInput } from "../types";

/** POST JSON with a hard timeout and exponential-backoff on 429. */
export async function postJson(
  url: string,
  headers: Record<string, string>,
  body: unknown,
  timeoutMs = 30000,
  maxRetries = 3,
): Promise<unknown> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json", ...headers },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
      if (res.status === 429 && attempt < maxRetries) {
        const wait = Number(res.headers.get("retry-after")) * 1000 || 2 ** attempt * 1000;
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
      return await res.json();
    } catch (err) {
      lastErr = err;
      if (attempt >= maxRetries) break;
      await new Promise((r) => setTimeout(r, 2 ** attempt * 500));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr;
}

/** Build a ProviderResult skeleton with sane zero values. */
export function emptyResult(surface: string, query: QueryInput): ProviderResult {
  return {
    surface,
    queryId: query.id,
    rawAnswer: "",
    citedUrls: [],
    inputTokens: 0,
    outputTokens: 0,
    serverSearchCount: 0,
    durationMs: 0,
  };
}

/** Read a required API key from env, or throw a clear activation error. */
export function requireKey(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set — activation blocked (see tests/ai-surface/README.md)`);
  return v;
}
