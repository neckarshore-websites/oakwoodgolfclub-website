# OGC Backlog

Single source of truth for open items in this repo. Complements
`docs/phase-1-plan.md` (which tracks bau-block B1–B14) by tracking smaller
tasks, visual-review feedback, follow-ups, and things that don't fit a
build-block.

**Format per user's global CLAUDE.md §Status/Tracking Tables:** every row
carries Prio (P1/P2/P3/Backlog), Effort (XS/S/M/L/XL), Wer, Blocker?,
Status (Offen/In Progress/Blocked/Done), Impact. `#` is a reference ID,
not priority.

Completed items use `~~strikethrough~~`. Items move to the **Done** section
with the commit that closed them — never delete, keep history for audits.

---

## Open

| # | Item | Prio | Effort | Wer | Blocker? | Status | Impact |
|---|------|------|--------|-----|----------|--------|--------|
| 1 | **Visual-Review v0.2** (neue Farben + Copy) auf localhost | P1 | XS | User | — | Offen | "AI empfiehlt, Mensch entscheidet" — Linus kann Farbentscheidung nicht abnehmen |
| 2 | Sand-Wash Ticken dunkler (post-#2+#5 entscheidbar — User war "unsicher weil Gold dann untergeht") | P2 | XS | User+Linus | Visual-Review | Offen | Warmth/Depth auf Pricing-Section |
| 3 | Hero-Bild-Option — User liefert Asset (Golfplatz? Gründer? Mitgliederkarte?) | P3 | XS–S | User → Linus | User-Asset | Backlog | Wärme/Vertrautheit im Above-the-fold, Konvention in der Golf-Branche |
| 4 | Legal-Seiten mit echtem Text (Impressum, Datenschutz, AGB) — Pflicht vor DNS-Cutover | P2 | S | User+Linus | User-Content | Offen | Gesetzliche Pflicht beim Live-Gang |
| 5 | ~~B5 Forms mit IONOS SMTP~~ ✅ Code shipped (Server Actions + Zod + Nodemailer + 3 UI-Forms + Honeypot + `.env.example`). Bleibt offen: **User setzt `SMTP_*`-Env-Vars im Vercel-Projekt** — ohne Creds laufen die Server Actions in Dev-Log-Fallback (Success an User, Composition im Server-Log). Pre-prod Smoke-Test auf Vercel Preview sobald Creds live. | P1 | XS restant | User | SMTP_PASSWORD (IONOS-Mailbox) | In Progress | Signup/Renewal = Umsatz-Funnel |
| 6 | **B6 FAQs-Seite** — Accordion + FAQPage JSON-LD, 15 Q&A rewritten auf 120–150 Wörter mit direktem Eröffnungssatz (AI-Citation-Fenster) | P1 | S | Linus | WP-Content-Export (19 Pages) | Offen | Haupt-GEO-Asset, MASCHIN-Audit flagte altes Schema als "kaputt" |
| 7 | **B8 Blog-System** — Markdown-Reader, Post-Layout, Kategorie-Listing, Pagination | P1 | S | Linus | — | Offen | Vorarbeit für B9 Content-Migration |
| 8 | **B9 Content-Migration** — 20 Posts: WP-Export → Markdown + Frontmatter, SEO A+B+D, Cleanup Legacy-URLs + Avada-HTML | P1 | M | Linus | B8, WP-Export-Tool | Offen | Ranking-Erhalt + 5 Jahre Blog-Substanz |
| 9 | **B10 URL-Redirects** — `next.config.ts` redirects für alle alten WP-URLs | P1 | S | Linus | B9 (kennt die URLs) | Offen | Kein 404-Bleeding beim Cutover |
| 10 | **B13 Pre-Launch** — Lighthouse 95+ final pass, visual acceptance (User), form smoke tests | P1 | S | Linus+User | B5, B6, B8, B9 | Offen | Go/No-Go-Gate |
| 11 | **B14 DNS-Cutover** IONOS A+CNAME → Vercel (MX unberührt, rauhut.com-Pattern) | P1 | XS | User | B13 | Offen | Go-Live |
| 12 | IONOS Zone-Snapshot als Rollback-Versicherung vor B14 | P2 | XS | User | — | Offen | Sicherheit — analog rauhut.com pre-cutover |
| 13 | Mobile-LCP watch (aktuell 2.6–2.9 s, knapp an 2.5 s-Grenze) — nach B5 Forms ggf. Preload/Priority-Hint auf Hero-Element | P3 | XS | Linus | B5 done | Offen | Perf-Score stabil über 95 halten |
| 14 | `dateModified`-Signal sichtbar auf Homepage/FAQ/Über-uns (AI-Freshness-Signal, SEO-Must-Have aus MASCHIN-Audit) | P2 | XS | Linus | — | Offen | GEO/AI-Citability Frische-Marker |
| 15 | Vercel-Link (`vercel link`) + GitHub-Auto-Deploy-Integration für `oakwoodgolfclub-de/oakwoodgolfclub-website` | P2 | XS | User | Vercel-App-Permission auf dem Repo | Offen | Auto-Deploy statt manuelle `vercel deploy`-Runs |
| 16 | Vercel Analytics Dashboard aktivieren (Project > Analytics > Enable) — sonst sammelt der Client nichts | P2 | XS | User | Vercel-Link (#15) | Offen | Datenerfassung startet erst nach Klick im Dashboard |
| 17 | **Style-Guide & Ikonografie-Redesign** — User-Feedback 17.04: "wirkt 80er-Jahre flach und langweilig". Betrifft Farb-Swatches-Layout, Card-Ästhetik, Icon-Stil (aktuell stroke-basiert Lucide + Custom-Golf, zu nüchtern). Nicht für Launch-Pfad — eigene Design-Iteration, ggf. mit Moodboard/Referenz-Recherche vorher. | P3 | L | Linus | Design-Briefing-Session | Offen | Brand-Anmutung. Aktueller Stil ist safe, aber nicht distinctiv. |
| 18 | **Richtiges Favicon / Brand Mark** — aktuell temporär `GolfHole`-Icon auf Fairway-Grün (app/icon.svg). Ersetzen durch finalen Brand Mark sobald Logo-Entscheidung getroffen ist. Backup-Varianten Stern/Pin liegen in `public/style-guide/proposed-favicon-*.svg` als Arbeitsstand. | P2 | S | User+Linus | Logo-Entscheidung | Offen | Brand-Konsistenz Tab ↔ Site. Temporär OK, final nicht. |

## For MASCHIN

| # | Item | Session-Report-Hinweis |
|---|------|-------------------------|
| M1 | BRIEFING.md + phase-1-plan.md führen Handicap-Verwaltung stellenweise noch als Phase-1-Feature (nur Planning-Docs, keine User-Facing-Copy — UWG-Exposure daher nicht vorhanden) | Session `dd0d7bc` Commit-Trailer |
| M2 | Phase-1-Plan §Tech Stack sagt `next/font/local` — tatsächlich `next/font/google` (build-time self-hosted, DSGVO-äquivalent). Plan auf "next/font (google oder local)" aktualisieren | Session-Report `2026-04-17-linus-fe.md` (v0.1 scaffold) |
| M3 | Interview-Technik-Regel (eine Frage auf einmal) aus Senseis Agent-File in Linus-Agent-File propagieren — aktuell nur Sensei | Session-Report `2026-04-17-linus-fe-c.md` |

## Done

| # | Item | Commit | Session |
|---|------|--------|---------|
| ~~D1~~ | B1 Repo-Bootstrap (Next.js 16 + Tailwind v4 + ESLint 9 + self-hosted Fonts) | `6e0af5e` | 2026-04-17 |
| ~~D2~~ | B2 Design-Tokens v0.1 (Tailwind theme with 6-color palette) | `6e0af5e` | 2026-04-17 |
| ~~D3~~ | B3 Layout-Shell + SEO (Nav, Footer, robots.ts, sitemap.ts, llms.txt, Security Headers, Organization JSON-LD) | `6e0af5e` | 2026-04-17 |
| ~~D4~~ | B4 Homepage v0.1 (Hero, ValueProp, Pricing, FAQTeaser, CTASection + Offer/Product JSON-LD) | `6e0af5e` | 2026-04-17 |
| ~~D5~~ | B7 Über-uns Skeleton + B11 Legal Skeletons (no 404 in local review) | `6e0af5e` | 2026-04-17 |
| ~~D6~~ | Farb-Tuning v0.2 — Fairway chroma (#1b4332 → #1b6640), Gold prominence (#b7892a → #d4a12e), new gold-deep token, ValueProp line bump | `70af7de` | 2026-04-17 |
| ~~D7~~ | A11y Contrast-Fix — CTA H2 cascade, CTA eyebrow parchment/80, muted gray-600, `:where()` on h1-h4 | `d9f4c50` | 2026-04-17 |
| ~~D8~~ | Lighthouse-Baseline v0.2 — Desktop 100/100/100/100, Mobile 92-96/100/100/100 (LCP variance 2.6-2.9 s) | `d9f4c50`, `159889f` | 2026-04-17 |
| ~~D9~~ | Handicap-Copy removal (9 files) — UWG/DSGVO truth-align, new FAQ-3 "Warum verarbeitet ihr aktuell keine Handicaps?" | `dd0d7bc` | 2026-04-17 |
| ~~D10~~ | B12 Vercel Web Analytics + themeColor sync to new fairway | `22af342` | 2026-04-17 |
| ~~D11~~ | B5 Forms — 3 Server Actions (Kontakt/Signup/Renewal) + Zod schemas + Nodemailer SMTP client + honeypot + `.env.example`. Fallback: when SMTP_* missing, Server Action logs composition server-side and returns ok. Vercel-Analytics guarded on `process.env.VERCEL` to eliminate local console-404. | (pending this commit) | 2026-04-17 |

---

## Conventions

- **Move items promptly.** Done = stays in Done with commit ref, never back to Open.
- **Don't delete.** Strikethrough in-place for items that are retired but still referenced elsewhere.
- **One commit per closed item where practical** — makes the Done-table round-trip easy.
- **When in doubt, file it as Backlog.** Better to write down than forget.
