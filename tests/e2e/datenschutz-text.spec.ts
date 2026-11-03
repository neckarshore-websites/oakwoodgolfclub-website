import { expect, test } from "@playwright/test";

/**
 * Guards what the rendered /datenschutz page says about Cloudflare Turnstile.
 *
 * Until 2026-11-03 the page called Cloudflare only a processor (Art. 28) and said nothing
 * about the entry Turnstile writes into the browser's local storage. Cloudflare documents a
 * second role, as a controller in its own right for improving its bot detection.
 *
 * Wording: Dr. Sommer, report 2026-11-02-dr-sommer-25tinx-turnstile (texts.turnstile_du),
 * released for Oakwood by the Founder on 2026-11-03 (question tool, E3).
 *
 * Reads the RENDERED page, so it also runs against production in nightly-prod-e2e.yml
 * (E2E_BASE_URL), which makes it a check on the shipped page, not only on the source.
 */

const MUST_NOT_APPEAR = ["Cloudflare agiert als Auftragsverarbeiter"];

const MUST_APPEAR = [
  "cf.turnstile.u",
  "§ 25 Abs. 2 Nr. 2 TDDDG",
  "Rollen und Speicherdauer",
  "verarbeitet Cloudflare diese Daten außerdem in eigener Verantwortung",
];

test.describe("/datenschutz wording", () => {
  test("names Turnstile's storage entry and both of Cloudflare's roles", async ({ page }) => {
    await page.goto("/datenschutz");
    const text = (await page.locator("main").innerText()).replace(/\s+/g, " ");

    for (const phrase of MUST_NOT_APPEAR) {
      expect(text, `must not say: ${phrase}`).not.toContain(phrase);
    }
    for (const phrase of MUST_APPEAR) {
      expect(text, `must say: ${phrase}`).toContain(phrase);
    }
  });
});
