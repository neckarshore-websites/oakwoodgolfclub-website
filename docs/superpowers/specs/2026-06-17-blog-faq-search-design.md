# Design: Cmd+K Search for Blog + FAQ

**Date:** 2026-06-17
**Status:** Approved (brainstorm) — pending spec review → implementation plan
**Owner:** Linus (Frontend)
**Repo:** `oakwoodgolfclub-website` (reference implementation; cross-site rollout is separate — see § Out of Scope)

## Goal

Add an on-site search that lets visitors find content across the **Blog** and the **FAQ** from anywhere on the site, via a command-palette overlay (`Cmd/Ctrl+K`) plus a visible header search icon. Fully client-side, zero backend, DSGVO-clean (no external service, no cookies, data never leaves the browser), and with no measurable impact on initial page load / Lighthouse.

## Scope

- **In:** Blog posts (per post) + FAQ entries (per question). OGC repo only.
- **Out:** Other static pages (Über-uns, Greenfees, legal, forms), member data (never indexed), cross-site rollout (separate per-repo sessions), no-JS `/suche` fallback page.

## Decisions (locked in brainstorm)

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Library | **MiniSearch** (headless) | Full control over a branded Cmd+K overlay; index built directly from existing structured data → per-FAQ-question granularity; fuzzy/typo-tolerant; tiny; €0. |
| 2 | Trigger | **Header search icon** (desktop + mobile) **+ `Cmd/Ctrl+K`** | Discoverable everywhere; mobile has no keyboard so a tappable trigger is required. |
| 3 | Index delivery | **Static JSON via force-static route handler** | Built once at build time, CDN-cached, fetched lazily by the client on first open. |
| 4 | Loading | **Lazy** — MiniSearch lib + index fetched only on first overlay open | Zero bytes added to initial bundle → no Lighthouse regression. |
| 5 | Result granularity | Blog → per post (`/blog/<slug>`); FAQ → per question (`/faq#<slug>`) | Most precise; FAQ data is already per-question. |

## Architecture

**Build time:** `app/api/search-index/route.ts` (`export const dynamic = "force-static"`) renders a static JSON document built from `getAllPosts()` + `getPublishedFaqs()`. Each search document:

```ts
type SearchDoc = {
  id: string;        // `blog:<slug>` | `faq:<slug>`
  type: "blog" | "faq";
  title: string;     // post title | FAQ question
  text: string;      // plaintext body/excerpt | FAQ answer (markdown/HTML stripped)
  category: string;  // post category | FAQ category label
  url: string;       // /blog/<slug> | /faq#<slug>
};
```

**Runtime:** On first open, the overlay dynamic-imports `minisearch`, fetches `/api/search-index`, builds the MiniSearch index in-browser (≈30 docs → instant), and caches it in a ref. Typing runs `MiniSearch.search(query, { prefix: true, fuzzy: 0.2 })`; results are grouped Blog/FAQ and rendered. Selecting a result calls `router.push(url)` and closes the overlay.

## Components (all new unless noted)

| Unit | Type | Responsibility | Depends on |
|------|------|----------------|------------|
| `lib/search/index-data.ts` | server | Build the `SearchDoc[]` from posts + FAQs. Single source for the route + unit tests. Strips markdown/HTML to plaintext. | `lib/blog/posts`, `lib/faqs/items` |
| `app/api/search-index/route.ts` | server (force-static) | Serve `SearchDoc[]` as static JSON. | `lib/search/index-data` |
| `components/search/SearchProvider.tsx` | client | Context holding `open` state + global `Cmd/Ctrl+K` listener; renders `children` + `<SearchOverlay>`. Mounted in `layout.tsx` wrapping Nav + main. | — |
| `components/search/SearchOverlay.tsx` | client | The palette UI: input, grouped results, keyboard nav, lazy index load, empty/no-result states. | `minisearch` (dynamic), `SearchProvider` context |
| `components/search/SearchButton.tsx` | client | 🔍 trigger in the header (desktop with "⌘K" hint, mobile next to "Menü"); calls `useSearch().open()`. | `SearchProvider` context |
| `components/faq/FaqAccordion.tsx` | client (existing) | **Enhancement:** auto-open the `<details id={slug}>` matching `location.hash` on mount + `hashchange`, and scroll it into view. Makes `/faq#<slug>` deep-links (incl. search results) actually reveal the answer. | — |

## UX / States

- **Trigger:** header icon (always visible) + `Cmd/Ctrl+K`. `ESC` closes.
- **Results:** grouped **Blog** / **FAQ**; each row = title/question + short snippet + category badge. Keyboard `↑/↓` to move, `Enter` to open; mouse click works too.
- **Empty (no query yet):** v1 ships a brief hint only ("Tippe, um Blog & FAQ zu durchsuchen"). Category shortcuts are a deferred nice-to-have, not part of v1.
- **No results:** "Nichts gefunden" + a mailto hint (consistent with the FAQ page's "schreib uns" tone).

## Accessibility

`role="dialog"` (modal) with focus trap + scroll-lock; input as `combobox`; results as `listbox`/`option` with `aria-activedescendant` for keyboard nav; focus restored to the trigger on close. Trigger button has `aria-label="Suche öffnen"` and a visible focus ring. `Cmd/Ctrl+K` does not hijack when focus is in another input/textarea.

## Performance

MiniSearch (~6 KB gzip) and the index JSON (≈20–40 KB gzip for this corpus) load **only on first open** (dynamic import + fetch). Initial bundle and all prerendered pages are unchanged → Lighthouse floor (95+) holds. The index route is statically generated and CDN-cached.

## Testing

- **Unit:** `index-data` builds correct docs — both types present, correct URLs (`/blog/<slug>`, `/faq#<slug>`), drafts (blog) and `published:false` (FAQ) excluded, plaintext stripping works. MiniSearch returns expected hits for sample queries including a deliberate typo (fuzzy).
- **e2e (Playwright — repo CI gate):** `Cmd+K` opens the overlay; typing a known term shows grouped results; `Enter` navigates to the right URL; `ESC` closes; mobile: tapping the header search icon opens the overlay; a FAQ result lands on `/faq#<slug>` with the targeted item expanded.

## Out of Scope / Follow-ups

- **No-JS `/suche` fallback** — omitted (YAGNI; the site already requires JS for Nav/forms). Revisit only if needed.
- **Other static pages in the index** — Blog + FAQ only for v1.
- **Cross-site rollout (neckarshore, goldoni, rauhut)** — separate per-repo sessions. The **components** (`SearchProvider`/`SearchOverlay`/`SearchButton` + MiniSearch wiring) are reusable; the **index source** (`index-data.ts`) is per-site because each site's searchable content differs (neckarshore = marketing sections/blog, goldoni = menu/pages, rauhut = portfolio). Pattern: prove on OGC → port per site. Tracked as a FOR-MASCHIN backlog item.
