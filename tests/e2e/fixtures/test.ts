/**
 * Shared Playwright test-fixture with optional post-test throttle.
 *
 * Why: the nightly prod E2E run (`test:e2e:nightly`) hits live IONOS SMTP
 * once per test (happy-path specs = 6 real mails per run). Without a
 * per-test delay, 23 tests × 2 mails in ~52 s triggers IONOS's burst
 * rate-limit and flakes the happy-path assertions. Sequential workers
 * alone aren't enough — the mails still land inside the burst window.
 *
 * The `E2E_THROTTLE_MS` env var, if set to a positive integer, causes
 * each test to sleep that many milliseconds *after* its assertions
 * finish. Local runs leave the var unset → zero overhead. The nightly
 * GHA workflow sets it to `10000` (10 s) — that spreads 23 tests over
 * ~4 min, well under IONOS's throttle threshold.
 *
 * Usage: specs import `{ expect, test }` from this file instead of
 * `@playwright/test` directly. Nothing else changes.
 */

import { test as base, expect } from "@playwright/test";

const throttleMs = Number.parseInt(process.env.E2E_THROTTLE_MS ?? "0", 10);

export const test = base.extend({});

if (Number.isFinite(throttleMs) && throttleMs > 0) {
  test.afterEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, throttleMs));
  });
}

export { expect };
