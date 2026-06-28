import { test, expect } from "@playwright/test";

/**
 * Markdown export (TC-EXP-*) — the "Als Markdown" download on blog posts.
 *
 * Ported from neckarshore.ai (design doc:
 * neckarshore-website/docs/superpowers/specs/2026-06-28-markdown-export-design.md).
 * On OGC the ONLY exportable surface is blog posts — hand-written JSX pages (home,
 * FAQ, Über-uns, legal) have no `.md` source and must NOT show the button or export.
 *
 * Asserts the button is present on a blog post, that /api/export serves clean source
 * markdown as a site-prefixed downloadable attachment, that the blog-only scope holds,
 * and the 404/400 contract for non-exportable paths.
 *
 * NOTE: this suite runs against the dev server, so it does NOT exercise the Vercel
 * file-tracing path (outputFileTracingIncludes). That is verified separately via a
 * production build + a preview/prod curl in the session.
 */

const BLOG_SLUG = "greenfees-als-fernmitglied";
const BLOG_PATH = `/blog/${BLOG_SLUG}`;
const EXPORT_HREF = `/api/export?path=${encodeURIComponent(BLOG_PATH)}`;
const EXPECTED_FILENAME = `oakwoodgolfclub.de - ${BLOG_SLUG}.md`;

test.describe("Markdown export (TC-EXP)", () => {
  test("TC-EXP-001: a blog post shows an export button linking to the export endpoint", async ({ page }) => {
    await page.goto(BLOG_PATH);
    const btn = page.locator(`a[href="${EXPORT_HREF}"]`);
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute("download", "");
  });

  test("TC-EXP-002: the export endpoint returns markdown as a site-prefixed downloadable attachment", async ({ page }) => {
    const res = await page.request.get(EXPORT_HREF);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("text/markdown");
    expect(res.headers()["content-disposition"]).toContain(`attachment; filename="${EXPECTED_FILENAME}"`);
  });

  test("TC-EXP-003: exported markdown carries frontmatter and the post body", async ({ page }) => {
    const res = await page.request.get(EXPORT_HREF);
    const body = await res.text();
    expect(body.startsWith("---\n")).toBeTruthy();
    expect(body).toContain(`source: "https://oakwoodgolfclub.de/blog/${BLOG_SLUG}"`);
    expect(body).toContain('site: "oakwoodgolfclub.de"');
    expect(body).toContain("# Greenfees als Fernmitglied"); // H1 from frontmatter title
  });

  test("TC-EXP-004: a non-exportable path (hand-written FAQ page) returns 404", async ({ page }) => {
    const res = await page.request.get(`/api/export?path=${encodeURIComponent("/faq")}`);
    expect(res.status()).toBe(404);
  });

  test("TC-EXP-005: a malformed path param returns 400", async ({ page }) => {
    const res = await page.request.get(`/api/export?path=not-a-path`);
    expect(res.status()).toBe(400);
  });

  test("TC-EXP-006: non-blog pages do NOT show the export button (blog-only scope)", async ({ page }) => {
    // The Founder scoped export to blog posts only. Hand-written pages and the blog
    // index must carry no export action.
    for (const path of ["/faq", "/blog"]) {
      await page.goto(path);
      await expect(page.locator('a[href^="/api/export"]')).toHaveCount(0);
    }
  });

  test("TC-EXP-007: clicking the button downloads the .md with the site-prefixed filename", async ({ page }) => {
    await page.goto(BLOG_PATH);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.locator(`a[href="${EXPORT_HREF}"]`).click(),
    ]);
    expect(download.suggestedFilename()).toBe(EXPECTED_FILENAME);
  });
});
