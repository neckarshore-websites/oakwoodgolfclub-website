# Blog UI/UX Standard

The central UI/UX standard every Neckarshore-estate blog should inherit. It is a
**documented contract**, not a shared code package — see [Status & Scope](#status--scope).

This repository (`oakwoodgolfclub-website`) is the **reference implementation**:
the standard below was extracted from the live OGC blog code, not invented. Where
the doc says "OGC ok", the reference impl already satisfies the rule.

## Status & Scope

| # | Aspect | State |
|---|--------|-------|
| 1 | Doc home | This file — reference-impl-local (Linus owns website repos, not planning-specs). |
| 2 | Reference impl | The OGC blog: tokens in `app/globals.css` `@theme` + the `.ogc-prose` type-scale + the shared `components/blog/*` set. |
| 3 | Shared code package | **Deliberately NOT built today** (rule-of-three: only one estate blog exists). The tokens promote into `site-quality` when that package publishes OR a second blog appears — see [Promotion](#promotion-to-site-quality). |
| 4 | Other estate blogs | `goldoni-website` and `neckarshore-website` have **no blog yet** — candidates, not in scope. |

> **Important:** Do not abstract this into a package pre-emptively. One consumer =
> premature abstraction. The promotion is an ADD/MOVE later, not a REPLACE — so
> building it now buys nothing and risks a wrong API.

## The Contract

A single estate cannot mandate identical fonts across differently-branded sites
(OGC = Playfair/Inter; neckarshore = Space Grotesk/Inter). The standard therefore
mandates the **contract** — roles, floors, and scale relationships — not specific
typefaces. The ten points are ordered by reading priority, not alphabetically.

1. **Self-hosted fonts** via `next/font` — no runtime CDN (DSGVO). *OGC ok.*
2. **Two-family system:** exactly one heading family + one body family. *OGC ok (Playfair + Inter).*
3. **Body size ≥ 16px** — recommend 17–18px for longform. *OGC ok (17px).*
4. **Line-height:** body 1.6–1.75; headings 1.05–1.25. *OGC ok (body 1.7).*
5. **Font-size floor:** no substantive/informative text < 14px on a blog reading
   surface. Decorative uppercase eyebrow micro-labels may stay 12px **if** they
   keep AA contrast. *This was the real OGC gap (the article-end legal note was
   12px) — now fixed.*
6. **Contrast floor:** body ≥ 7:1 (45+-friendly); secondary/meta ≥ 4.5:1 (AA).
   *OGC ok — guarded by the Lighthouse a11y hard gate at 95.*
7. **Heading hierarchy:** exactly one `H1`; `H2`/`H3` distinct via size + weight +
   colour; no skipped levels. *OGC ok.*
8. **Emphasis discipline (bold):** bold for ≤ ~2 key terms per block, never whole
   sentences — especially in the TL;DR. Content guideline + review, not
   CSS-enforceable.
9. **Measure (line length):** body 60–75ch. *OGC ok (`.ogc-prose` is 65ch).*
10. **Touch-target floor ≥ 44px** for every interactive entry on a reading/nav
    surface. *Implemented on the category list (was ~22px) — now ≥ 44px.*

## Design Tokens

Source of truth: `app/globals.css` `@theme`. Tailwind v4 generates utility classes
from these; reference them as `var(--token)` or via the generated utilities. Rows
sorted A→Z by token.

| # | Token | Value | Role |
|---|-------|-------|------|
| 1 | `--color-border` | `#e5e7eb` | Hairlines, dividers. |
| 2 | `--color-fairway` | `#1b6640` | Primary brand accent (links, H2). |
| 3 | `--color-fairway-bright` | `#52b27f` | Forest-mint highlight on dark / image backgrounds. |
| 4 | `--color-fairway-hover` | `#2a8a52` | Hover / secondary accent. |
| 5 | `--color-gold` | `#d4a12e` | Sparse premium accent line — never a fill. |
| 6 | `--color-gold-deep` | `#7a5a0e` | Dark gold for small text on light bg (AA 5.94:1 on parchment). |
| 7 | `--color-ink` | `#0a0a0a` | Base text, dark surfaces. |
| 8 | `--color-muted` | `#4b5563` | Secondary/meta text (AA 6.97:1 on parchment). |
| 9 | `--color-parchment` | `#fafafa` | Page background, cards. |
| 10 | `--color-sand` | `#f3ead4` | Warm background wash, inline `code` bg. |
| 11 | `--font-body` | Inter (`--font-inter`) | Body family. |
| 12 | `--font-heading` | Playfair Display (`--font-playfair`) | Heading family. |

## Type Scale (`.ogc-prose`)

The longform reading container. Hand-written (no `@tailwindcss/typography`, which
would add ~20kB and break Lighthouse 95+). Source: `app/globals.css` `.ogc-prose`.
Rows keep the heading hierarchy order (inherently ordered).

| # | Element | Size | Line-height | Colour |
|---|---------|------|-------------|--------|
| 1 | body | 17px (`1.0625rem`) | 1.7 | ink @ 88% |
| 2 | `h2` | 28px (`1.75rem`) | 1.25 | fairway |
| 3 | `h3` | ~21.6px (`1.35rem`) | 1.3 | ink |
| 4 | `h4` | 18px (`1.125rem`) | 1.35 | ink |
| 5 | `a` | inherit | — | fairway → fairway-hover on hover, 1px underline |
| 6 | `strong` | inherit | — | ink, weight 600 |
| 7 | `blockquote` | inherit | — | ink @ 75%, 3px fairway left border |
| 8 | `code` | `0.92em` | — | ink on sand |
| 9 | `pre` | `0.9em` | 1.55 | parchment on ink |
| 10 | `figcaption` | `0.875em` | 1.5 | muted |
| 11 | `.ogc-tldr__eyebrow` | 12px (`0.75rem`) | — | gold-deep, uppercase, 2px gold accent line above |

Measure: `max-width: 65ch`. Block rhythm: `* + * { margin-top: 1.1em }`.

## Shared Components

All blog UI flows through these — zero ad-hoc per-page styling. Source:
`components/blog/`. Rows sorted A→Z.

| # | Component | Responsibility |
|---|-----------|----------------|
| 1 | `CategoryList` | Sidebar nav of categories + post counts; highlights the active one. Each entry is a ≥ 44px tap target. |
| 2 | `PostCard` | Listing card on `/blog` and `/blog/kategorie/[slug]`: date + category → title link → excerpt → "Weiterlesen". Title is the single link target (clean for screen readers). |
| 3 | `PostNavigation` | Prev/next at the foot of a detail page, showing the neighbour's (truncated) title. Whole box is one `Link`. |
| 4 | `Prose` | Typography container for rendered Markdown — wraps sanitized HTML in `.ogc-prose`. HTML is sanitized at build time in `lib/blog/posts.ts` before it reaches `dangerouslySetInnerHTML`. |

## Content Discipline (review, not CSS)

These cannot be enforced by CSS — they are checked at editorial review:

1. **Bold restraint:** in the TL;DR (`wrapTldr()` in `lib/blog/posts.ts`, styled by
   `.ogc-tldr__body`) and in running text, bold ≤ ~2 key terms per block. Bolding
   whole sentences destroys the signal. Existing number-bolds are fine.
2. **One H1 per post**; never skip heading levels.
3. **Eyebrow vs reading text:** short decorative uppercase labels may sit at 12px;
   anything a reader must *read* (legal notes, captions with information) is ≥ 14px.

## Tests

| # | Floor | Enforcement |
|---|-------|-------------|
| 1 | Contrast (point 6) | Lighthouse a11y hard gate @ 95 (existing) — catches regressions automatically. |
| 2 | Font-size ≥ 14px (point 5) | `tests/e2e/blog-ux.spec.ts` — asserts the article-end legal note computes ≥ 14px. |
| 3 | Touch-target ≥ 44px (point 10) | `tests/e2e/blog-ux.spec.ts` — mobile viewport, asserts every category-list entry is ≥ 44px tall. |

Targeted, not exhaustive — the suite grows as later blocks (nav/layout, technical-UX)
of the standard land.

## Promotion to site-quality

When the shared [`site-quality`](https://github.com/neckarshore-websites/site-quality)
package publishes (or a second estate blog appears), promote the **tokens + the
`.ogc-prose` type-scale** into it so future blogs inherit the contract by dependency,
not by copy. Tracked as `L-SITEQUALITY-MIGRATE-PUBLIC-NPMJS`. Until then this doc is
the single source of truth and OGC is the worked example.
