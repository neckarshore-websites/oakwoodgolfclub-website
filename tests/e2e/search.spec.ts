import { test, expect, type Page } from "@playwright/test";

const dialog = (page: Page) => page.getByRole("dialog", { name: "Suche" });

// The Cmd/Ctrl+K listener attaches on client hydration (a useEffect). In dev
// the first page load is cold-compiled, so the listener can lag a beat behind
// first paint. Retry the keypress until the overlay opens — and only press
// while it's still closed, so we never toggle an already-open overlay shut.
async function openWithShortcut(page: Page, key: "Meta+k" | "Control+k") {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Suche öffnen" }).first()).toBeVisible();
  await expect(async () => {
    if (!(await dialog(page).isVisible())) await page.keyboard.press(key);
    await expect(dialog(page)).toBeVisible({ timeout: 500 });
  }).toPass({ timeout: 10_000 });
}

test("Cmd+K opens search, finds a post, Enter navigates", async ({ page }) => {
  await openWithShortcut(page, "Meta+k");
  const input = page.getByRole("combobox", { name: /durchsuchen/i });
  await input.fill("ballmarker");
  const firstOption = page.getByRole("option").first();
  await expect(firstOption).toBeVisible();
  await page.keyboard.press("Enter");
  // Dev compiles /blog/[slug] on first hit; client nav defers the URL change
  // until the RSC payload arrives. Generous timeout absorbs the cold compile.
  await expect(page).toHaveURL(/\/blog\//, { timeout: 15_000 });
});

test("Escape closes the overlay", async ({ page }) => {
  await openWithShortcut(page, "Control+k");
  await page.keyboard.press("Escape");
  await expect(dialog(page)).toHaveCount(0);
});

test("mobile: header search icon opens the overlay", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Suche öffnen" }).click();
  await expect(dialog(page)).toBeVisible();
});

test("FAQ result deep-links and expands the answer", async ({ page }) => {
  await openWithShortcut(page, "Meta+k");
  await page.getByRole("combobox", { name: /durchsuchen/i }).fill("handicap");
  const faqHit = page.getByRole("option").filter({ hasText: "FAQ" }).first();
  await faqHit.click();
  await expect(page).toHaveURL(/\/faq#/, { timeout: 15_000 });
  // the targeted <details> is open
  await expect(page.locator("details[open]")).toHaveCount(1, { timeout: 5000 });
});

const combo = (page: Page) => page.getByRole("combobox", { name: /durchsuchen/i });

test("Arrow keys move the active result; Enter opens the active one", async ({ page }) => {
  await openWithShortcut(page, "Meta+k");
  await combo(page).fill("golf"); // broad term → many results
  const options = page.getByRole("option");
  await expect(options.nth(1)).toBeVisible(); // need at least two
  // first result is active by default
  await expect(options.nth(0)).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowDown");
  await expect(options.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(options.nth(0)).toHaveAttribute("aria-selected", "false");
  await page.keyboard.press("ArrowUp");
  await expect(options.nth(0)).toHaveAttribute("aria-selected", "true");
  // Enter on the active result navigates to a blog/faq URL
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/(blog|faq)/, { timeout: 15_000 });
});

test("empty query shows the prompt placeholder", async ({ page }) => {
  await openWithShortcut(page, "Meta+k");
  // & renders as plain text — match a substring that avoids the entity
  await expect(page.getByText("Tippe, um Blog")).toBeVisible();
  await expect(page.getByRole("option")).toHaveCount(0);
});

test("gibberish query shows the no-results state", async ({ page }) => {
  await openWithShortcut(page, "Meta+k");
  await combo(page).fill("qzxqzxqzx");
  await expect(page.getByText("Nichts gefunden")).toBeVisible();
  await expect(page.getByRole("option")).toHaveCount(0);
});

test("clicking the backdrop closes the overlay", async ({ page }) => {
  await openWithShortcut(page, "Meta+k");
  // click the top-left of the full-screen dialog — backdrop, not the centered panel
  await dialog(page).click({ position: { x: 5, y: 5 } });
  await expect(dialog(page)).toHaveCount(0);
});

test("hovering a result makes it the active option", async ({ page }) => {
  await openWithShortcut(page, "Meta+k");
  await combo(page).fill("golf");
  const options = page.getByRole("option");
  await expect(options.nth(1)).toBeVisible();
  await expect(options.nth(1)).toHaveAttribute("aria-selected", "false");
  await options.nth(1).hover();
  await expect(options.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(options.nth(0)).toHaveAttribute("aria-selected", "false");
});
