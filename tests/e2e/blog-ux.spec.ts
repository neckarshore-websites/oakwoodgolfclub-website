import { test, expect } from "@playwright/test";

/**
 * Blog UI/UX standard — the two a11y floors from docs/blog-ux-standard.md
 * that are CSS-enforceable (the rest of the standard is content discipline
 * verified at review):
 *
 *   1. Font-size floor: substantive/informative text on a blog reading
 *      surface is >= 14px. Guards the article-end "Bild- und Markenhinweis"
 *      legal note (was 12px, the real a11y gap for 45+ readers).
 *   2. Touch-target floor: every interactive entry in the category list is
 *      >= 44px tall (Apple HIG / WCAG generous target), so the mobile
 *      category nav is comfortably tappable (entries were ~22px).
 *
 * These run red against the pre-fix code (12px / ~22px) — that is the point:
 * it proves the locators hit the right element and the fix moves the needle.
 */

test("blog detail: the image/trademark legal note is >= 14px", async ({
  page,
}) => {
  // Navigate via the listing so we always land on a real (non-draft) post.
  await page.goto("/blog");
  await page.getByRole("link", { name: "Weiterlesen" }).first().click();
  await expect(page).toHaveURL(/\/blog\/[^/]+$/, { timeout: 15_000 });

  const hint = page
    .locator("aside")
    .filter({ hasText: "Bild- und Markenhinweis" });
  await expect(hint).toBeVisible();

  const fontSize = await hint.evaluate((el) =>
    parseFloat(getComputedStyle(el).fontSize),
  );
  expect(fontSize).toBeGreaterThanOrEqual(14);
});

test("mobile: every category-list entry is a >= 44px tap target", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/blog");

  const links = page
    .getByRole("navigation", { name: "Blog-Kategorien" })
    .getByRole("link");
  const count = await links.count();
  expect(count).toBeGreaterThan(1); // "Alle Beiträge" + >=1 category

  for (let i = 0; i < count; i++) {
    const box = await links.nth(i).boundingBox();
    if (!box) throw new Error(`category link ${i} has no bounding box`);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
});
