# Diagrams — oakwoodgolfclub-website

Internal diagrams for the Oakwood Golf Club website. Plain HTML with inline SVG/CSS, fully self-contained, brand-tokened from `app/globals.css` (fairway greens, gold, sand, parchment; Playfair Display + Inter).

Open any file directly in a browser — no build step, no server.

## Files

| File | Subject | Last updated |
|---|---|---|
| `launch-timeline.html` | Six-day launch timeline 17.–22. April 2026, with Engineering Gate (21 Apr) and Go Live (22 Apr) as gold milestones | 2026-04-23 |
| `architecture.html` | Technical architecture: Next.js 16 (App Router) on Vercel · Markdown content (gray-matter/marked) · Server Actions (kontakt / mitglied-werden / verlängern) · FriendlyCaptcha · SMTP. Full-editorial variant. | 2026-06-05 |

## Conventions

- One diagram per HTML file, self-contained (no shared CSS yet).
- Brand tokens mirror `app/globals.css` production values (`--color-fairway`, `--color-gold`, `--color-sand`, etc.). When `globals.css` changes, update these files too.
- Not part of the Next.js build (outside `app/`, outside `public/`). Changes here do **not** affect the live site.
- Prefer subject-per-file over growing a single monolith.

## Ideas for next entries

- Phase 2 member-portal roadmap (when scope firms up)
- Member journey swimlane (research → join → renew)
- Pricing tier pyramid
