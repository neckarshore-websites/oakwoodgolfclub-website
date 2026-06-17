# Cmd+K Blog+FAQ Search — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a client-side `Cmd/Ctrl+K` command-palette search over the Blog and FAQ, with a visible header search icon, lazy-loaded so it never touches initial page load.

**Architecture:** A build-time static JSON index (force-static route handler) is assembled from the existing blog + FAQ loaders. On first open, a client overlay lazy-imports MiniSearch + fetches the index, then searches in-browser. Results link to `/blog/<slug>` and `/faq#<slug>`. A small client helper opens the hash-targeted FAQ `<details>` so deep-links reveal the answer.

**Tech Stack:** Next.js 15 App Router, React, Tailwind, MiniSearch (headless), Playwright (e2e), `tsx` + `node:assert` (unit).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-06-17-blog-faq-search-design.md`.
- Exact dependency versions only — `npm install --save-exact` (no `^`/`~`).
- DSGVO: client-side only, no external service, no cookies; member data never indexed.
- Performance: MiniSearch + index load ONLY on first overlay open. Lighthouse floor 95+ must hold.
- Scope: Blog + FAQ only. OGC repo only (cross-site is a separate follow-up).
- Mobile-first; self-hosted assets; follow existing component/style conventions (Tailwind + `var(--color-*)`).
- Unit tests run via `tsx tests/search/<name>.test.ts` with `node:assert/strict` and the existing `check()`-counter convention; e2e via Playwright in `tests/e2e/`.
- Content pushes auto-deploy to prod on push to `main`; this is content+frontend (no member-flow). Build + lint + typecheck + e2e green before push; user does final prod visual acceptance.

---

### Task 1: Dependency, types, and markdown stripper

**Files:**
- Modify: `package.json` (add `minisearch` dep + `test:search:unit` script)
- Create: `lib/search/types.ts`
- Create: `lib/search/strip-markdown.ts`
- Test: `tests/search/strip-markdown.test.ts`

**Interfaces:**
- Produces: `type SearchDoc = { id: string; type: "blog" | "faq"; title: string; text: string; category: string; url: string }`
- Produces: `stripMarkdown(md: string): string`

- [ ] **Step 1: Install MiniSearch (exact version)**

```bash
npm install --save-exact minisearch
```

- [ ] **Step 2: Create the shared type**

`lib/search/types.ts`:
```ts
export type SearchDoc = {
  id: string;                 // `blog:<slug>` | `faq:<slug>`
  type: "blog" | "faq";
  title: string;              // post title | FAQ question
  text: string;               // excerpt+body (blog) | answer (faq), plaintext
  category: string;           // post category | FAQ category label
  url: string;                // /blog/<slug> | /faq#<slug>
};
```

- [ ] **Step 3: Write the failing test**

`tests/search/strip-markdown.test.ts`:
```ts
import assert from "node:assert/strict";
import { stripMarkdown } from "../../lib/search/strip-markdown";

let pass = 0, fail = 0;
function check(label: string, fn: () => void) {
  try { fn(); pass++; } catch (e) { fail++; console.error(`  ✗ ${label}\n    ${(e as Error).message.split("\n")[0]}`); }
}

check("strips headings, emphasis, keeps link text", () => {
  assert.equal(stripMarkdown("## Heading\n\nSome **bold** and [a link](/x)."), "Heading Some bold and a link.");
});
check("removes images entirely", () => {
  assert.equal(stripMarkdown("![alt](/img.png) text"), "text");
});
check("strips html tags", () => {
  assert.equal(stripMarkdown("<img src=x> hi <b>there</b>"), "hi there");
});

console.log(`strip-markdown: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npx tsx tests/search/strip-markdown.test.ts`
Expected: FAIL (module `lib/search/strip-markdown` not found).

- [ ] **Step 5: Implement the stripper**

`lib/search/strip-markdown.ts`:
```ts
/** Reduce Markdown/HTML to searchable plaintext. Lossy by design. */
export function stripMarkdown(md: string): string {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")     // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")  // links -> visible text
    .replace(/<[^>]+>/g, " ")                 // html tags
    .replace(/^#{1,6}\s+/gm, "")              // ATX headings
    .replace(/^>\s?/gm, "")                   // blockquotes
    .replace(/[*_`~]/g, "")                   // emphasis/code/strike marks
    .replace(/\s+/g, " ")                     // collapse whitespace
    .trim();
}
```

- [ ] **Step 6: Run test (pass) + add npm script**

Run: `npx tsx tests/search/strip-markdown.test.ts`
Expected: `strip-markdown: 3 passed, 0 failed`

Add to `package.json` `scripts` (above `test:e2e`):
```json
"test:search:unit": "NODE_ENV=production tsx tests/search/strip-markdown.test.ts && NODE_ENV=production tsx tests/search/index-data.test.ts",
```

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json lib/search/types.ts lib/search/strip-markdown.ts tests/search/strip-markdown.test.ts
git commit -m "feat(search): add minisearch dep, SearchDoc type, markdown stripper"
```

---

### Task 2: Search index builder

**Files:**
- Create: `lib/search/index-data.ts`
- Test: `tests/search/index-data.test.ts`

**Interfaces:**
- Consumes: `SearchDoc` (Task 1), `stripMarkdown` (Task 1), `getAllPosts`/`getPostBySlug` (`lib/blog/posts`), `getPublishedFaqs` (`lib/faqs/items`), `CATEGORY_LABEL` (`lib/faqs/types`).
- Produces: `buildSearchDocs(): SearchDoc[]`

- [ ] **Step 1: Write the failing test**

`tests/search/index-data.test.ts`:
```ts
import assert from "node:assert/strict";
import MiniSearch from "minisearch";
import { buildSearchDocs } from "../../lib/search/index-data";

let pass = 0, fail = 0;
function check(label: string, fn: () => void) {
  try { fn(); pass++; } catch (e) { fail++; console.error(`  ✗ ${label}\n    ${(e as Error).message.split("\n")[0]}`); }
}
const docs = buildSearchDocs();

check("has blog + faq docs", () => {
  assert.ok(docs.some((d) => d.type === "blog"));
  assert.ok(docs.some((d) => d.type === "faq"));
});
check("blog url is /blog/<slug>, faq url is /faq#<slug>", () => {
  assert.ok(docs.find((d) => d.id === "blog:kuerzester-golfwitz-der-welt")?.url === "/blog/kuerzester-golfwitz-der-welt");
  assert.ok(docs.find((d) => d.type === "faq")!.url.startsWith("/faq#"));
});
check("text is plaintext (no markdown link/heading syntax)", () => {
  assert.ok(!docs.some((d) => d.text.includes("](") || /(^|\s)#{1,6}\s/.test(d.text)));
});
check("drafts excluded under production", () => {
  assert.equal(docs.find((d) => d.id === "blog:was-soll-man-trainieren"), undefined);
});
check("minisearch finds the ballmarker post with a typo (fuzzy)", () => {
  const mini = new MiniSearch({ fields: ["title", "text"], storeFields: ["url", "type"] });
  mini.addAll(docs);
  const hits = mini.search("ballmarkr", { fuzzy: 0.2, prefix: true });
  assert.ok(hits.some((h) => String(h.url).includes("magnetischer-ballmarker")));
});

console.log(`index-data: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `NODE_ENV=production npx tsx tests/search/index-data.test.ts`
Expected: FAIL (module `lib/search/index-data` not found).

- [ ] **Step 3: Implement the builder**

`lib/search/index-data.ts`:
```ts
import { getAllPosts, getPostBySlug } from "@/lib/blog/posts";
import { getPublishedFaqs } from "@/lib/faqs/items";
import { CATEGORY_LABEL } from "@/lib/faqs/types";
import { stripMarkdown } from "./strip-markdown";
import type { SearchDoc } from "./types";

/** Build the full searchable document set from blog posts + published FAQs. */
export function buildSearchDocs(): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const meta of getAllPosts()) {
    const body = getPostBySlug(meta.slug)?.content ?? "";
    docs.push({
      id: `blog:${meta.slug}`,
      type: "blog",
      title: meta.title,
      text: stripMarkdown(`${meta.excerpt} ${body}`),
      category: meta.categories[0] ?? "Blog",
      url: `/blog/${meta.slug}`,
    });
  }

  for (const faq of getPublishedFaqs()) {
    docs.push({
      id: `faq:${faq.slug}`,
      type: "faq",
      title: faq.question,
      text: stripMarkdown(faq.answer),
      category: CATEGORY_LABEL[faq.category],
      url: `/faq#${faq.slug}`,
    });
  }

  return docs;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `NODE_ENV=production npx tsx tests/search/index-data.test.ts`
Expected: `index-data: 5 passed, 0 failed`
(If the `kuerzester-golfwitz-der-welt` slug assertion fails because that post was renamed/removed, swap it for any currently-published blog slug from `content/blog/`.)

- [ ] **Step 5: Commit**

```bash
git add lib/search/index-data.ts tests/search/index-data.test.ts
git commit -m "feat(search): build SearchDoc index from blog + FAQ sources"
```

---

### Task 3: Static index route handler

**Files:**
- Create: `app/api/search-index/route.ts`
- Test: `tests/search/route.test.ts`

**Interfaces:**
- Consumes: `buildSearchDocs` (Task 2).
- Produces: `GET()` returning `Response` with `SearchDoc[]` JSON at build-static `/api/search-index`.

- [ ] **Step 1: Write the failing test**

`tests/search/route.test.ts`:
```ts
import assert from "node:assert/strict";
import { GET } from "../../app/api/search-index/route";

let pass = 0, fail = 0;
const res = await GET();
const body = await res.json();
try { assert.ok(Array.isArray(body) && body.length > 0 && body[0].url); pass++; }
catch (e) { fail++; console.error((e as Error).message); }
console.log(`route: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `NODE_ENV=production npx tsx tests/search/route.test.ts`
Expected: FAIL (module `app/api/search-index/route` not found).

- [ ] **Step 3: Implement the route**

`app/api/search-index/route.ts`:
```ts
import { buildSearchDocs } from "@/lib/search/index-data";

// Statically generated at build time → served from the CDN, fetched
// lazily by the search overlay on first open. No runtime compute.
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildSearchDocs());
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `NODE_ENV=production npx tsx tests/search/route.test.ts`
Expected: `route: 1 passed, 0 failed`

- [ ] **Step 5: Commit**

```bash
git add app/api/search-index/route.ts tests/search/route.test.ts
git commit -m "feat(search): force-static /api/search-index JSON route"
```

---

### Task 4: SearchProvider context + Cmd+K listener

**Files:**
- Create: `components/search/SearchProvider.tsx`

**Interfaces:**
- Produces: `<SearchProvider>{children}</SearchProvider>` (renders children + the overlay) and `useSearch(): { open: boolean; setOpen: (v: boolean) => void }`.
- Consumes: `SearchOverlay` (Task 5) — import added in this task; Task 5 creates the file. Until Task 5 lands, temporarily render `null` in place of `<SearchOverlay/>` so the project compiles; wire the real import as Task 5's first step.

- [ ] **Step 1: Implement the provider**

`components/search/SearchProvider.tsx`:
```tsx
"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { SearchOverlay } from "./SearchOverlay";

type Ctx = { open: boolean; setOpen: (v: boolean) => void };
const SearchCtx = createContext<Ctx | null>(null);

export function useSearch(): Ctx {
  const ctx = useContext(SearchCtx);
  if (!ctx) throw new Error("useSearch must be used within <SearchProvider>");
  return ctx;
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return (
    <SearchCtx.Provider value={{ open, setOpen }}>
      {children}
      <SearchOverlay />
    </SearchCtx.Provider>
  );
}
```

- [ ] **Step 2: Typecheck/lint green**

Run: `npm run typecheck && npm run lint`
Expected: no errors. (Will fail on the `SearchOverlay` import until Task 5 — implement Task 5 next, then this resolves. If executing strictly task-by-task, stub `components/search/SearchOverlay.tsx` with `export function SearchOverlay() { return null; }` here and flesh it out in Task 5.)

- [ ] **Step 3: Commit**

```bash
git add components/search/SearchProvider.tsx
git commit -m "feat(search): SearchProvider context + Cmd/Ctrl+K global listener"
```

---

### Task 5: SearchOverlay (palette UI, lazy load, keyboard nav)

**Files:**
- Create/replace: `components/search/SearchOverlay.tsx`

**Interfaces:**
- Consumes: `useSearch` (Task 4), `SearchDoc` (Task 1), `minisearch`, `next/navigation` `useRouter`.
- Produces: `<SearchOverlay/>` (self-contained; reads open-state from context).

- [ ] **Step 1: Implement the overlay**

`components/search/SearchOverlay.tsx`:
```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type MiniSearch from "minisearch";
import { useSearch } from "./SearchProvider";
import type { SearchDoc } from "@/lib/search/types";

type Hit = SearchDoc;

export function SearchOverlay() {
  const { open, setOpen } = useSearch();
  const router = useRouter();
  const miniRef = useRef<MiniSearch<SearchDoc> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [ready, setReady] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  // Lazy-build index on first open.
  useEffect(() => {
    if (!open || miniRef.current) return;
    let cancelled = false;
    (async () => {
      const [{ default: MiniSearch }, res] = await Promise.all([
        import("minisearch"),
        fetch("/api/search-index"),
      ]);
      const docs: SearchDoc[] = await res.json();
      if (cancelled) return;
      const mini = new MiniSearch<SearchDoc>({
        fields: ["title", "text"],
        storeFields: ["title", "type", "category", "url"],
        searchOptions: { prefix: true, fuzzy: 0.2, boost: { title: 2 } },
      });
      mini.addAll(docs);
      miniRef.current = mini;
      setReady(true);
    })();
    return () => { cancelled = true; };
  }, [open]);

  useEffect(() => { if (open) inputRef.current?.focus(); else { setQ(""); setActive(0); } }, [open]);

  const results: Hit[] = q && ready && miniRef.current
    ? (miniRef.current.search(q) as unknown as Hit[]).slice(0, 20)
    : [];

  function go(hit: Hit) { setOpen(false); router.push(hit.url); }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") setOpen(false);
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && results[active]) { e.preventDefault(); go(results[active]); }
  }

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Suche"
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 p-4 pt-[12vh]"
      onClick={() => setOpen(false)}>
      <div className="w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()} onKeyDown={onKeyDown}>
        <input ref={inputRef} type="search" role="combobox" aria-expanded="true"
          aria-controls="search-results" aria-label="Blog und FAQ durchsuchen"
          value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }}
          placeholder="Blog & FAQ durchsuchen …"
          className="w-full border-b border-[var(--color-border)] px-5 py-4 text-base outline-none" />
        <ul id="search-results" role="listbox" className="max-h-[55vh] overflow-y-auto">
          {!q && <li className="px-5 py-6 text-sm text-[var(--color-muted)]">Tippe, um Blog &amp; FAQ zu durchsuchen.</li>}
          {q && results.length === 0 && ready && (
            <li className="px-5 py-6 text-sm text-[var(--color-muted)]">Nichts gefunden. Schreib uns gern direkt über die Kontaktseite.</li>
          )}
          {results.map((hit, i) => (
            <li key={hit.id} role="option" aria-selected={i === active}>
              <button type="button" onMouseEnter={() => setActive(i)} onClick={() => go(hit)}
                className={`flex w-full flex-col items-start gap-0.5 px-5 py-3 text-left ${i === active ? "bg-[var(--color-fairway)]/10" : ""}`}>
                <span className="flex items-center gap-2">
                  <span className="rounded-sm bg-[var(--color-ink)]/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                    {hit.type === "blog" ? "Blog" : "FAQ"}
                  </span>
                  <span className="font-medium text-[var(--color-ink)]">{hit.title}</span>
                </span>
                <span className="text-xs text-[var(--color-muted)]">{hit.category}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build + lint green**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: exit 0, no errors. (If you stubbed SearchOverlay in Task 4, this replaces the stub.)

- [ ] **Step 3: Commit**

```bash
git add components/search/SearchOverlay.tsx
git commit -m "feat(search): Cmd+K overlay UI with lazy MiniSearch + keyboard nav"
```

---

### Task 6: Header trigger button + Nav/layout wiring

**Files:**
- Create: `components/search/SearchButton.tsx`
- Modify: `components/Nav.tsx` (add the button in desktop nav + mobile bar)
- Modify: `app/layout.tsx` (wrap `<Nav/>` + `<main>` + `<Footer/>` in `<SearchProvider>`)

**Interfaces:**
- Consumes: `useSearch` (Task 4).
- Produces: `<SearchButton variant="desktop" | "mobile" />`.

- [ ] **Step 1: Implement the trigger button**

`components/search/SearchButton.tsx`:
```tsx
"use client";
import { useSearch } from "./SearchProvider";

export function SearchButton({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const { setOpen } = useSearch();
  return (
    <button type="button" onClick={() => setOpen(true)} aria-label="Suche öffnen"
      className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-3 py-2 text-sm text-white outline-offset-4 hover:border-white/40 focus-visible:outline-2 focus-visible:outline-[var(--color-fairway-hover)]">
      <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
      </svg>
      {variant === "desktop" && <span className="text-white/60">⌘K</span>}
    </button>
  );
}
```

- [ ] **Step 2: Wire into Nav.tsx**

In `components/Nav.tsx`, import at top: `import { SearchButton } from "@/components/search/SearchButton";`
Desktop: inside the `<nav aria-label="Hauptnavigation" …>` cluster, add `<SearchButton variant="desktop" />` before the "Jetzt Mitglied werden" link.
Mobile: directly before the `<details ref={detailsRef} …>` element, add `<div className="md:hidden"><SearchButton variant="mobile" /></div>` so the icon sits next to "Menü". Wrap the existing mobile `<details>` and this new div in a `<div className="flex items-center gap-2 md:hidden">` if needed to keep them inline.

- [ ] **Step 3: Wrap the app in SearchProvider**

In `app/layout.tsx`, import `import { SearchProvider } from "@/components/search/SearchProvider";` and wrap the existing `<Nav/> <main>…</main> <Footer/>` group:
```tsx
<SearchProvider>
  <Nav />
  <main id="main" className="flex-1">{children}</main>
  <Footer />
</SearchProvider>
```
(The `JsonLd` + Vercel `Analytics`/`SpeedInsights` siblings stay outside the provider, unchanged.)

- [ ] **Step 4: Build + lint green**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: exit 0. Manually `npm run dev` and confirm: header shows the 🔍 (desktop + mobile), `Cmd+K` opens the overlay, typing shows results, Enter navigates, Esc closes.

- [ ] **Step 5: Commit**

```bash
git add components/search/SearchButton.tsx components/Nav.tsx app/layout.tsx
git commit -m "feat(search): header search trigger (desktop + mobile) + provider mount"
```

---

### Task 7: FAQ deep-link auto-open (`/faq#slug` reveals answer)

**Files:**
- Create: `components/faq/FaqHashOpener.tsx`
- Modify: `app/faq/page.tsx` (render `<FaqHashOpener/>` once)

**Interfaces:**
- Produces: `<FaqHashOpener/>` — client effect that opens + scrolls to the `<details id={hash}>` matching `location.hash`.
- Note: keeps `FaqAccordion` a zero-JS server component (do NOT convert it to client).

- [ ] **Step 1: Implement the hash opener**

`components/faq/FaqHashOpener.tsx`:
```tsx
"use client";
import { useEffect } from "react";

/** Opens + scrolls to the <details id={hash}> targeted by location.hash.
 *  Makes /faq#<slug> deep-links (incl. search results) reveal the answer. */
export function FaqHashOpener() {
  useEffect(() => {
    function openTarget() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (el instanceof HTMLDetailsElement) {
        el.open = true;
        el.scrollIntoView({ block: "start" });
      }
    }
    openTarget();
    window.addEventListener("hashchange", openTarget);
    return () => window.removeEventListener("hashchange", openTarget);
  }, []);
  return null;
}
```

- [ ] **Step 2: Mount it on the FAQ page**

In `app/faq/page.tsx`, import `import { FaqHashOpener } from "@/components/faq/FaqHashOpener";` and render `<FaqHashOpener />` once inside the returned fragment (e.g., right after the opening `<>` / before the `<article>`).

- [ ] **Step 3: Build + lint green + manual check**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: exit 0. `npm run dev`, open `/faq#<some-slug>` directly → that question is expanded and scrolled into view.

- [ ] **Step 4: Commit**

```bash
git add components/faq/FaqHashOpener.tsx app/faq/page.tsx
git commit -m "feat(faq): auto-open hash-targeted FAQ on deep-link"
```

---

### Task 8: Playwright e2e + final gate

**Files:**
- Create: `tests/e2e/search.spec.ts`

**Interfaces:**
- Consumes: the wired app (Tasks 1–7). Runs against the Playwright-managed `npm run dev` on `localhost:3000`.

- [ ] **Step 1: Write the e2e spec**

`tests/e2e/search.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("Cmd+K opens search, finds a post, Enter navigates", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Meta+k");
  const input = page.getByRole("combobox", { name: /durchsuchen/i });
  await expect(input).toBeVisible();
  await input.fill("ballmarker");
  const firstOption = page.getByRole("option").first();
  await expect(firstOption).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/blog\//);
});

test("Escape closes the overlay", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("dialog", { name: "Suche" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Suche" })).toHaveCount(0);
});

test("mobile: header search icon opens the overlay", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Suche öffnen" }).click();
  await expect(page.getByRole("dialog", { name: "Suche" })).toBeVisible();
});

test("FAQ result deep-links and expands the answer", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Meta+k");
  await page.getByRole("combobox", { name: /durchsuchen/i }).fill("handicap");
  const faqHit = page.getByRole("option").filter({ hasText: "FAQ" }).first();
  await faqHit.click();
  await expect(page).toHaveURL(/\/faq#/);
  // the targeted <details> is open
  await expect(page.locator("details[open]")).toHaveCount(1, { timeout: 5000 });
});
```
(If "ballmarker"/"handicap" yield no hit because content changed, swap for any current term. Keep one blog-targeted and one faq-targeted assertion.)

- [ ] **Step 2: Run the e2e suite**

Run: `npm run test:e2e -- search`
Expected: all 4 tests pass (Playwright auto-starts `npm run dev`).

- [ ] **Step 3: Run the unit suite + full gate**

Run: `npm run test:search:unit && npm run typecheck && npm run lint && npm run build`
Expected: unit `… passed, 0 failed`; typecheck/lint clean; build exit 0.

- [ ] **Step 4: Performance sanity (Lighthouse floor holds)**

Run: `npm run lighthouse:mobile` (or `npm run lighthouse:quick`)
Expected: Performance ≥ 95 mobile (search assets are lazy → home/blog initial load unchanged). Record the score.

- [ ] **Step 5: Commit**

```bash
git add tests/e2e/search.spec.ts
git commit -m "test(search): Playwright e2e for Cmd+K open/search/navigate/escape/mobile/FAQ"
```

---

## Self-Review

**Spec coverage:** MiniSearch headless → T1/T5. Cmd+K + header icon → T4/T6. Static index route → T3. Per-post/per-FAQ-question URLs → T2. Lazy load (no Lighthouse hit) → T5 + T8.4. FAQ deep-link reveals answer → T7. Empty/no-result states → T5. Accessibility (dialog/combobox/listbox/Esc) → T5 + T8.2. Unit + e2e tests → T1/T2/T3 + T8. DSGVO (client-side, no member data) → architecture (index = blog+faq only). All spec sections covered.

**Placeholder scan:** No TBD/TODO; every code step has complete code; commands have expected output. The only conditional notes are deliberate fallbacks (swap a sample slug/term if content changed) — not placeholders.

**Type consistency:** `SearchDoc` shape identical across T1→T2→T3→T5. `buildSearchDocs(): SearchDoc[]` consistent (T2 def, T3 consume). `useSearch(): { open, setOpen }` consistent (T4 def, T5/T6 consume). `SearchButton` `variant` prop consistent (T6). MiniSearch config fields (`title`,`text`) match the indexed doc fields.

**Cross-task build ordering note:** T4 imports `SearchOverlay` (created in T5). When executing strictly task-by-task, stub `SearchOverlay` as `export function SearchOverlay(){return null;}` at the end of T4 and replace in T5 — called out in T4 Step 2 / T5 Step 1.
