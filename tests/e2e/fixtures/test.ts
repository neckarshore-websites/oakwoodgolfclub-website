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

import { test as base, expect, type Page } from "@playwright/test";

const throttleMs = Number.parseInt(process.env.E2E_THROTTLE_MS ?? "0", 10);

export const test = base.extend({});

/**
 * Wait for the Cloudflare Turnstile widget to inject a non-empty
 * `cf-turnstile-response` token into the form — but ONLY when the widget is
 * actually rendered (`NEXT_PUBLIC_CAPTCHA_ENABLED=true` + sitekey set). When
 * the captcha flag is off the `<Turnstile />` component renders nothing, so
 * this is a no-op and the same happy-path specs stay green in BOTH contexts:
 * captcha-off (default) and captcha-on (local/preview with test keys, prod
 * after activation).
 *
 * Why it is needed: real users spend seconds filling a form, by which point
 * the managed widget has long since auto-solved. The e2e happy-path tests
 * click submit instantly and otherwise race the async script-load — submitting
 * with an empty token, which the Server Action rejects as `missing-solution`
 * (see lib/captcha/verify.ts). Call this right before the submit click in any
 * test that expects a successful submission.
 */
export async function waitForTurnstileToken(page: Page): Promise<void> {
  const widget = page.locator(".cf-turnstile");
  if ((await widget.count()) === 0) return; // captcha off — nothing to await
  await expect(page.locator('input[name="cf-turnstile-response"]')).toHaveValue(
    /.+/,
    { timeout: 15_000 },
  );
}

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
