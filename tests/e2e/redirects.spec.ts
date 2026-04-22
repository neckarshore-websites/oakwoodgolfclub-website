/**
 * Legacy-URL Redirect E2E — B10 / F-PL-1 regression guard.
 *
 * Context: James 2026-04-22 post-launch check found that all 59 legacy
 * WordPress redirects (`lib/redirects.ts`) were silently 404ing on prod.
 * Root-cause: Next.js 16 with default `trailingSlash: false` normalizes
 * trailing slashes BEFORE the redirects() config is consulted, so
 * sources written as `/foo/` never matched.
 *
 * These three tests pick one entry per category (page-mapping, blog-post,
 * faq-item) and drive the browser through the redirect chain. If the
 * generator ever regresses to writing trailing-slash sources, or a
 * Next.js minor update flips the order again, these break red.
 *
 * Kept as a separate spec file (not merged into forms/) because they
 * hit different routes and benefit from isolated reporting.
 */

import { expect, test } from "./fixtures/test";

test.describe("B10 — Legacy-URL Redirects (F-PL-1)", () => {
  test("legacy blog URL (/<slug>/) redirects to /blog/<slug>", async ({
    page,
  }) => {
    // Trailing slash is the important part — that's what WP indexed for 16y.
    const response = await page.goto("/lieblingsclub-in-thailand/");
    expect(response?.status()).toBe(200);
    // Exact pathname match proves the redirect fired (not just a same-path 200).
    expect(new URL(page.url()).pathname).toBe("/blog/lieblingsclub-in-thailand");
  });

  test("legacy FAQ URL (/faq-items/<slug>/) redirects to /faq#<slug>", async ({
    page,
  }) => {
    const slug = "wie-sieht-die-clubkarte-aus-aus-welchem-material-ist-sie";
    const response = await page.goto(`/faq-items/${slug}/`);
    expect(response?.status()).toBe(200);
    const finalUrl = new URL(page.url());
    expect(finalUrl.pathname).toBe("/faq");
    expect(finalUrl.hash).toBe(`#${slug}`);
  });

  test("legacy page URL (/info/impressum/) redirects to /impressum", async ({
    page,
  }) => {
    const response = await page.goto("/info/impressum/");
    expect(response?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe("/impressum");
  });

  test("sanity: canonical URL without trailing slash is also served 200", async ({
    page,
  }) => {
    // Proves that trailingSlash: false is still the config. If this
    // returns 404, someone flipped to trailingSlash: true and the
    // redirect sources need to be regenerated WITH trailing slashes.
    const response = await page.goto("/lieblingsclub-in-thailand");
    expect(response?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe("/blog/lieblingsclub-in-thailand");
  });
});
