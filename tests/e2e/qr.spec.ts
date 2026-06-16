/**
 * QR splash E2E — /qr.html smoke test.
 *
 * Guards the QR-only entry point encoded on the printed membership card. The
 * card's QR code points at /qr.html forever, so this spec is the regression
 * net for the small pile of infra that keeps that URL alive and behaving:
 *
 *   1. /qr.html serves the splash 200 and the URL bar STAYS /qr.html — it is a
 *      next.config.ts rewrite, not a redirect. If the rewrite regresses, the
 *      printed card dead-ends in a 404.
 *   2. The placeholder content renders (heading + eyebrow + CTA).
 *   3. robots stays `noindex` — QR-only, must never enter the search index.
 *   4. The manual "Direkt zur Startseite" CTA navigates to the homepage.
 *   5. The page auto-forwards to the homepage after ~5s (RedirectHome timer).
 *   6. The canonical /qr route (the rewrite target) also serves 200.
 *
 * MAINTENANCE: when real content replaces the placeholder, update the copy
 * assertions (2). If the 5s auto-redirect is ever removed, delete test (5).
 */

import { expect, test } from "./fixtures/test";

const CTA = "Direkt zur Startseite";

test.describe("QR splash (/qr.html)", () => {
  test("serves the splash at the .html URL — rewrite alive, no redirect hop", async ({
    page,
  }) => {
    const response = await page.goto("/qr.html");
    expect(response?.status()).toBe(200);
    // URL bar stays /qr.html — rewrite, not redirect. This is the whole point
    // of the page existing at a .html URL.
    expect(new URL(page.url()).pathname).toBe("/qr.html");
    await expect(
      page.getByRole("heading", { level: 1, name: /neues Grün/i }),
    ).toBeVisible();
  });

  test("renders the placeholder copy + CTA", async ({ page }) => {
    await page.goto("/qr.html");
    await expect(page.getByText("Demnächst")).toBeVisible();
    await expect(page.getByText(/automatisch weitergeleitet/i)).toBeVisible();
    await expect(page.getByRole("link", { name: CTA })).toBeVisible();
  });

  test("is noindex — QR-only, must never be indexed", async ({ page }) => {
    await page.goto("/qr.html");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  });

  test("manual CTA navigates to the homepage", async ({ page }) => {
    await page.goto("/qr.html");
    // Click well inside the 5s auto-redirect window.
    await page.getByRole("link", { name: CTA }).click();
    await page.waitForURL((url) => url.pathname === "/");
    expect(new URL(page.url()).pathname).toBe("/");
  });

  test("auto-forwards to the homepage after ~5s", async ({ page }) => {
    await page.goto("/qr.html");
    // RedirectHome fires router.replace("/") 5000ms after hydration; allow
    // generous headroom over the 5s timer so this never flakes on a slow box.
    await page.waitForURL((url) => url.pathname === "/", { timeout: 12_000 });
    expect(new URL(page.url()).pathname).toBe("/");
  });

  test("canonical /qr route (rewrite target) also serves 200", async ({
    page,
  }) => {
    const response = await page.goto("/qr");
    expect(response?.status()).toBe(200);
  });
});
