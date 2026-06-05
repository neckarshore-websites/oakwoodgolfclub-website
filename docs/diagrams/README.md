# Diagrams — oakwoodgolfclub-website

Internal diagrams for the Oakwood Golf Club website. Plain HTML with inline SVG/CSS, fully self-contained, brand-tokened from `app/globals.css` (fairway greens, gold, sand, parchment; Playfair Display + Inter).

Open any file directly in a browser — no build step, no server.

## Files

| File | Subject | Last updated |
|---|---|---|
| `launch-timeline.html` | Six-day launch timeline 17.–22. April 2026, with Engineering Gate (21 Apr) and Go Live (22 Apr) as gold milestones | 2026-04-23 |
| `architecture.html` | Technical architecture: Next.js 16 (App Router) on Vercel · Markdown content (gray-matter/marked) · Server Actions (kontakt / mitglied-werden / verlängern) · FriendlyCaptcha · SMTP. Full-editorial variant. | 2026-06-05 |
| `architecture.png` | Rendered raster export of `architecture.html` — **diagram region only** (clipped to the `<svg>`), embedded at the top of the root [`README.md`](../../README.md). | 2026-06-05 |
| `architecture-full.png` | Rendered raster export of `architecture.html` — **full editorial page** (diagram + stat cards + summary cards). For slides, briefings, or a hero placement. | 2026-06-05 |
| `launch-timeline-full.png` | Rendered raster export of `launch-timeline.html` — full page. Preview image for the timeline on the internal `/assets` page. | 2026-06-05 |

## Rendering

`render.mjs` regenerates the PNGs from the HTML via headless Chromium (Playwright, already a devDependency). Output is 2× for retina sharpness.

```bash
npx playwright install chromium     # one-time, if not already present
node docs/diagrams/render.mjs                    # all *.html → region PNGs
node docs/diagrams/render.mjs architecture.html  # one file, region only
node docs/diagrams/render.mjs --full             # all *.html → *-full.png
node docs/diagrams/render.mjs architecture.html --full
node docs/diagrams/render.mjs --publish          # copy html+png → public/diagrams/
# or: npm run render:diagrams [-- <file.html>] [-- --full | --publish]
```

Default mode clips to the first `<svg>`; HTML/CSS-only diagrams (e.g. `launch-timeline.html`, which has no `<svg>`) are skipped in region mode — render those with `--full`.

`--publish` does no rendering — it copies every `*.html` + `*.png` here into `public/diagrams/` so the Next.js app serves them. That is what makes the interactive diagrams reachable at `/diagrams/<file>.html` and the previews on the internal [`/assets`](../../app/assets/page.tsx) page work. Run it after re-rendering. `public/diagrams/` is a published copy — never edit it by hand; `docs/diagrams/` stays the source of truth.

## Conventions

- One diagram per HTML file, self-contained (no shared CSS yet).
- Brand tokens mirror `app/globals.css` production values (`--color-fairway`, `--color-gold`, `--color-sand`, etc.). When `globals.css` changes, update these files too.
- Not part of the Next.js build (outside `app/`, outside `public/`). Changes here do **not** affect the live site.
- Prefer subject-per-file over growing a single monolith.
- HTML is the source of truth. Any `.png` here is a **rendered export** of its `.html` sibling (Markdown can't embed interactive HTML, so GitHub READMEs use the PNG). When you change the HTML, re-render the PNG.

## Ideas for next entries

- Phase 2 member-portal roadmap (when scope firms up)
- Member journey swimlane (research → join → renew)
- Pricing tier pyramid
