import { expect, test } from "@playwright/test";

/**
 * Browser chrome tint — exactly one theme-color tag, and it equals the background of the
 * sticky header that meets the browser bar. The site has no dark mode, so no media query.
 */
const PAGES = ["/", "/kontakt"];

function toHex(color: string): string {
  if (color.startsWith("#")) return color.toLowerCase();
  const m = color.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) throw new Error(`not a color: ${color}`);
  return "#" + m.slice(0, 3).map((n) => Math.round(Number(n)).toString(16).padStart(2, "0")).join("");
}

test("theme-color equals the sticky header on every page", async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path);
    const tags = page.locator('meta[name="theme-color"]');
    expect(await tags.count(), `${path}: theme-color tags`).toBe(1);
    const header = await page
      .locator("header")
      .first()
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(toHex((await tags.getAttribute("content")) ?? ""), `${path}: tag vs header`).toBe(toHex(header));
  }
});
