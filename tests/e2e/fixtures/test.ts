/**
 * Shared Playwright test-fixture mit zwei Cross-Test-Mechaniken:
 *
 * 1. **Per-Test Rate-Limit-Reset (lokal).** Der In-Memory-Rate-Limiter in
 *    `lib/ratelimit.ts` zählt 5 Submits pro IP pro Stunde. Die 23 E2E-Tests
 *    produzieren ~5 successful submits — exakt am Limit. Jeder zusätzliche
 *    Happy-Path-Test reißt die Grenze (CTX3 aus Session 2026-04-19-h).
 *    Lösung: `beforeEach` ruft `POST /api/test-hooks/reset-rate-limit` auf,
 *    welches in Dev-Mode den Counter leert. In Production retourniert der
 *    Endpoint 404 → Reset wirkt nur lokal/preview, nie auf Live-Traffic.
 *
 * 2. **Optionaler Post-Test-Throttle (nightly Prod-Run).** `test:e2e:nightly`
 *    schickt echte SMTP-Mails über IONOS. Ohne Per-Test-Delay rate-limited
 *    IONOS nach ~16 Mails in 52 s. `E2E_THROTTLE_MS=10000` spreizt die 23
 *    Tests auf ~4 min — under IONOS's burst-threshold. Local runs lassen
 *    die Var unset → null Overhead.
 *
 * Usage: specs importieren `{ expect, test }` von dieser Datei statt
 * direkt aus `@playwright/test`. Nichts sonst ändert sich.
 */

import { test as base, expect } from "@playwright/test";

const throttleMs = Number.parseInt(process.env.E2E_THROTTLE_MS ?? "0", 10);

export const test = base.extend({});

test.beforeEach(async ({ request }) => {
  const response = await request.post("/api/test-hooks/reset-rate-limit");
  if (!response.ok() && response.status() !== 404) {
    throw new Error(
      `Rate-limit reset hook failed: ${response.status()} ${response.statusText()}`,
    );
  }
});

if (Number.isFinite(throttleMs) && throttleMs > 0) {
  test.afterEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, throttleMs));
  });
}

export { expect };
