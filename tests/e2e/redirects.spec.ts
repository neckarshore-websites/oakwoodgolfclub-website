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

test.describe("JK-9 — single-hop legacy redirects (proxy.ts)", () => {
  /**
   * The proxy maps BOTH source variants directly to the destination in ONE
   * 308, instead of the old 2-hop chain (slash-normalize → map). We assert
   * the FIRST response is already 308-to-destination, not 308-to-slashless.
   */
  const firstHop = async (
    request: import("@playwright/test").APIRequestContext,
    base: string,
    path: string,
  ) => {
    const res = await request.get(path, { maxRedirects: 0 });
    const loc = res.headers()["location"] ?? "";
    const u = new URL(loc, base);
    return { status: res.status(), path: u.pathname, hash: u.hash };
  };

  test("page mapping: 1 hop WITH and WITHOUT trailing slash", async ({
    request,
    baseURL,
  }) => {
    const base = baseURL ?? "http://localhost:3000";
    const withSlash = await firstHop(request, base, "/info/impressum/");
    expect(withSlash.status).toBe(308);
    expect(withSlash.path).toBe("/impressum"); // NOT "/info/impressum"

    const noSlash = await firstHop(request, base, "/info/impressum");
    expect(noSlash.status).toBe(308);
    expect(noSlash.path).toBe("/impressum");
  });

  test("blog mapping: trailing-slash variant is 1 hop", async ({
    request,
    baseURL,
  }) => {
    const base = baseURL ?? "http://localhost:3000";
    const hop = await firstHop(request, base, "/lieblingsclub-in-thailand/");
    expect(hop.status).toBe(308);
    expect(hop.path).toBe("/blog/lieblingsclub-in-thailand");
  });

  test("faq mapping: 1 hop preserves the #anchor", async ({
    request,
    baseURL,
  }) => {
    const base = baseURL ?? "http://localhost:3000";
    const slug = "wie-sieht-die-clubkarte-aus-aus-welchem-material-ist-sie";
    const hop = await firstHop(request, base, `/faq-items/${slug}/`);
    expect(hop.status).toBe(308);
    expect(hop.path).toBe("/faq");
    expect(hop.hash).toBe(`#${slug}`);
  });
});
