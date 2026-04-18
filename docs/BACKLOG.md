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
| 1 | ~~**Visual-Review v0.2**~~ ✅ User-OK 2026-04-18: "Seht gut aus" | P1 | — | User | — | Done | Visual-Acceptance-Gate für aktuelle Farben + Copy |
| 2 | ~~Sand-Wash Ticken dunkler~~ — implizit OK durch User-Visual-Review (#1, 04-18). Sand-Wash bleibt wie ist (Gold würde sonst untergehen) | P2 | — | User | — | Done | Closed via #1 |
| 3 | Hero-Bild-Option — User liefert Asset (Golfplatz? Gründer? Mitgliederkarte?) | P3 | XS–S | User → Linus | User-Asset | Backlog | Wärme/Vertrautheit im Above-the-fold, Konvention in der Golf-Branche |
| 4 | Legal-Seiten mit echtem Text (Impressum, Datenschutz, AGB) — Pflicht vor DNS-Cutover | P2 | S | User+Linus | User-Content | Offen | Gesetzliche Pflicht beim Live-Gang |
| 5 | ~~B5 Forms mit IONOS SMTP~~ ✅ Code shipped (Server Actions + Zod + Nodemailer + 3 UI-Forms + Honeypot + `.env.example`). Bleibt offen: **User setzt `SMTP_*`-Env-Vars im Vercel-Projekt** — ohne Creds laufen die Server Actions in Dev-Log-Fallback (Success an User, Composition im Server-Log). Pre-prod Smoke-Test auf Vercel Preview sobald Creds live. | P1 | XS restant | User | SMTP_PASSWORD (IONOS-Mailbox) | In Progress | Signup/Renewal = Umsatz-Funnel |
| 6 | ~~**B6 FAQs-Seite MVP**~~ ✅ Gerüst gebaut — Accordion + FAQPage JSON-LD, 5 Kategorien, Deep-Link-Anchors, Contact-CTA. Content-Quelle: `content/faqs.ts` (Aggregator) → `faqs-wp.ts` (generated) + `faqs-curated.ts` (manual). Script `scripts/migrate-faqs.py` ist idempotent und re-runnable. **11 Antworten live** (2 curated, 9 WP). **Offen: B6.1** (siehe unten) — 8 Handicap-FAQs warten auf Content-Entscheidung. | P1 | — | Linus | — | Done | Haupt-GEO-Asset Gerüst steht |
| 6a | **B6.1 FAQ Content-Pass** — 8 Handicap-FAQs aus `content/faqs-wp.ts` (needsReview=true) entscheiden: rewrite in `faqs-curated.ts` (ehrlich zu D9-Truth-Alignment) oder droppen. Danach MASCHIN-Kriterium 120-150 Wörter + direkter Eröffnungssatz über alle 11+ FAQs. | P1 | M | User+Linus | User-Entscheidung pro FAQ | Offen | MASCHIN-Audit Compliance + AI-Citation-Fenster |
| 7 | ~~**B8 Blog-System**~~ ✅ Code shipped — `marked` + `gray-matter` + `sanitize-html` (alle pinned), Markdown-Loader in `lib/blog/posts.ts`, Prose-CSS in globals.css, Index + `[slug]` + `kategorie/[category]` als static-generated Routes, PostCard + CategoryList + Prose Komponenten, JSON-LD BlogPosting, Sitemap dynamisch. 2 Seed-Posts in `content/blog/`. **Pagination in v2** (20 Posts gehen noch auf eine Seite — kein P1-Blocker).  | P1 | — | Linus | — | Done | Vorarbeit für B9 fertig |
| 8 | ~~**B9 Content-Migration MVP**~~ ✅ `scripts/migrate-posts.py` (`markdownify` + `beautifulsoup4` + Avada-Fusion-Shortcode-Stripper + http→https) hat 20 WP-Posts nach `content/blog/*.md` migriert. Legacy-URLs bleiben absolut (Bild-Paths auf wp-content/uploads — siehe B9.1). Handicap-Posts (2× mygolf-app + mscorecard) automatisch auf `draft: true, needsReview` — D9-Truth-Align. 18 publish-Posts + 4 Kategorien live auf `/blog`. Seed-Posts aus B8 entfernt. **Polish offen:** Bild-Migration, Inline-`####`-Downgrade, SEO-Pass A+B+D (siehe B9.1). | P1 | — | Linus | — | Done | Ranking-Erhalt + 5 Jahre Blog-Substanz |
| 8a | **B9.1 Post Content-Polish** — SEO-Pass A+B+D auf 18 publish-Posts (Meta-Descriptions aus erster Absatz überarbeiten, H1→H2-Downgrade in Body, Link-Check gebrochene Legacy-URLs). Bild-Migration: 127 WP-Medien nach `public/blog/images/` runterladen + URLs im Markdown rewriten, damit wir nicht dauerhaft vom WP-Server abhängen. Handicap-Posts (2 draft) content-entscheiden: rewrite oder drop, parallel zu B6.1. | P2 | M | Linus+User | B9 done | Offen | Bilder-Ownership + Lighthouse auf Blog-Posts |
| 9 | ~~**B10 URL-Redirects**~~ ✅ `scripts/generate-redirects.py` + `lib/redirects.ts` + `next.config.ts` async redirects(). **59 Redirects generiert**: 20 Blog-Posts (`/<slug>/` → `/blog/<slug>`), 15 FAQ-Items (`/faq-items/<slug>/` → `/faq#<slug>`), 24 Page-Mappings (hand-kuratiert). Script ist idempotent, re-runnable. **Smoke-Test vor Launch:** `curl -I localhost:3000/lieblingsclub-in-thailand/` muss `308` + `Location: /blog/lieblingsclub-in-thailand` zurückgeben. | P1 | — | Linus | — | Done | Kein 404-Bleeding beim Cutover |
| 10 | **B13 Pre-Launch** — Lighthouse 95+ final pass, visual acceptance (User), form smoke tests | P1 | S | Linus+User | B5, B6, B8, B9 | Offen | Go/No-Go-Gate |
| 11 | **B14 DNS-Cutover** IONOS A+CNAME → Vercel (MX unberührt, rauhut.com-Pattern) | P1 | XS | User | B13 | Offen | Go-Live |
| 12 | IONOS Zone-Snapshot als Rollback-Versicherung vor B14 | P2 | XS | User | — | Offen | Sicherheit — analog rauhut.com pre-cutover |
| 13 | Mobile-LCP watch (aktuell 2.6–2.9 s, knapp an 2.5 s-Grenze) — nach B5 Forms ggf. Preload/Priority-Hint auf Hero-Element | P3 | XS | Linus | B5 done | Offen | Perf-Score stabil über 95 halten |
| 14 | `dateModified`-Signal sichtbar auf Homepage/FAQ/Über-uns (AI-Freshness-Signal, SEO-Must-Have aus MASCHIN-Audit) | P2 | XS | Linus | — | Offen | GEO/AI-Citability Frische-Marker |
| 15 | Vercel-Link (`vercel link`) + GitHub-Auto-Deploy-Integration für `oakwoodgolfclub-de/oakwoodgolfclub-website` | P2 | XS | User | Vercel-App-Permission auf dem Repo | Offen | Auto-Deploy statt manuelle `vercel deploy`-Runs |
| 16 | Vercel Analytics Dashboard aktivieren (Project > Analytics > Enable) — sonst sammelt der Client nichts | P2 | XS | User | Vercel-Link (#15) | Offen | Datenerfassung startet erst nach Klick im Dashboard |
| 17 | **Style-Guide & Ikonografie-Redesign** — User-Feedback 17.04: "wirkt 80er-Jahre flach und langweilig". Betrifft Farb-Swatches-Layout, Card-Ästhetik, Icon-Stil (aktuell stroke-basiert Lucide + Custom-Golf, zu nüchtern). Nicht für Launch-Pfad — eigene Design-Iteration, ggf. mit Moodboard/Referenz-Recherche vorher. | P3 | L | Linus | Design-Briefing-Session | Offen | Brand-Anmutung. Aktueller Stil ist safe, aber nicht distinctiv. |
| 18 | **Richtiges Favicon / Brand Mark** — aktuell temporär `GolfHole`-Icon auf Fairway-Grün (app/icon.svg). Ersetzen durch finalen Brand Mark sobald Logo-Entscheidung getroffen ist. Backup-Varianten Stern/Pin liegen in `public/style-guide/proposed-favicon-*.svg` als Arbeitsstand. | P2 | S | User+Linus | Logo-Entscheidung | Offen | Brand-Konsistenz Tab ↔ Site. Temporär OK, final nicht. |
| 19 | **Social-Strategie Instagram → auto-repost Facebook** — Ein Kanal (Instagram) als Source-of-Truth, Facebook bekommt automatisch Kopien. Hintergrund: User-Einschätzung 2026-04-17 — "Facebook ist sowieso nur eine Kopie von Instagram". Kombinierbar mit Product-Empfehlungen (z.B. StrokesIn) für organischeren Reach. **Phase 2** — nicht im Phase-1-Launch-Pfad. | P3 | M | User+Linus | Phase-1-Launch done | Backlog | Reach + SEO-Halo durch Content-Diversifikation |
| 20 | ~~**Blog-Post: Bushnell Launch Pro**~~ ✅ Draft geschrieben — `content/blog/bushnell-launch-pro-launch-monitor.md`, datiert 2026-04-02 (bewusst rückwirkend gestaffelt gegenüber StrokesIn 2026-03-15, damit nicht alles heute rausgeht). Bushnell-Fakten aus bushnellgolfeurope.com/product/launch-pro gefetched: Kamera-basiert, 13+ Datenpunkte, ~2.790 GBP, Subscription-Modell. Ehrliche Für-wen/Für-wen-nicht-Segmentierung. | P2 | — | Linus | — | Done | Equipment-Content-Serie-Start |
| 21 | **Newsletter-System** — Mitglieder-Opt-in, regelmäßiger Versand (z.B. monatlich). Pflegt Beziehung zu Bestandsmitgliedern + Lead-Nurturing für Noch-nicht-Mitglieder. Tool-Entscheidung offen (Buttondown, Mailjet, ConvertKit, eigenes auf IONOS SMTP). DSGVO-konform (Double-Opt-in). **Phase 2** — nicht im Phase-1-Launch-Pfad. | P3 | L | User+Linus | Phase-1-Launch done | Backlog | Retention + Content-Distribution |
| 22 | ~~**Formular-Autoresponder (Phase 1)**~~ ✅ Code shipped — 3 Templates (`composeContactAutoresponse`, `composeSignupAutoresponse`, `composeRenewalAutoresponse`) in `lib/email/templates.ts`, `sendAutoresponse(to, comp)` in `lib/email/send.ts` (Reply-To = info@, From = info@, To = User), in alle 3 Server Actions als Best-Effort-Send nach erfolgreicher Notification eingehängt — Failure logged, fail nicht das Form. Smoke-Script `scripts/smoke-autoresponse.ts` rendert alle 3 Templates lokal ohne SMTP. Live aktiviert sich per #5 (User SMTP-Creds in Vercel). | P1 | — | Linus | — | Done | User-Vertrauen + professioneller Eindruck vor Launch |
| 23 | **OGC Amazon-Partnerprogramm-Setup** — aktuell fremde Affiliate-Tags (z.B. `tag=thegolfinglad-20`) landen auf OGC-Blog, geben Provision an Dritte. Wenn OGC Amazon-Affiliate nutzen will: eigenes Tag anmelden (`tag=oakwoodgolf-XX`), alle Amazon-Links rewriten, Affiliate-Disclosure/Kennzeichnung "Werbung" per UWG + `rel="sponsored"` auf Links. Aktuell: Link im Ballmarker-Post ist neutralisiert (ohne `tag=`). | P3 | S | User | User-Anmeldung bei Amazon Partner-Programm + Tax-Setup | Backlog | Monetarisierung, rechtssicher |
| 24 | **Blog-Post-Typografie-Polish** — User-Feedback zu `/blog/<slug>` (DJI- und WP-migrierte Posts): Überschriften haben zu wenig vertikalen Abstand nach oben/unten, horizontale Trennlinien (HRs) ebenso zu eng. Lesbarkeit leidet in zusammenhängenden Text-Abschnitten. Betrifft `.ogc-prose`-Stil in `app/globals.css`. Optionen: H2/H3 `margin-top` und `margin-bottom` erhöhen, `hr` von 2.5em auf 3-4em, ggf. `p`-spacing differenzieren (Paragraf-nach-Heading vs. Paragraf-nach-Paragraf). User sagt "Backlog, nicht jetzt". | P2 | S | Linus | — | Offen | Lesbarkeit der Blog-Posts |

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
| ~~D11~~ | B5 Forms — 3 Server Actions (Kontakt/Signup/Renewal) + Zod schemas + Nodemailer SMTP client + honeypot + `.env.example`. Fallback: when SMTP_* missing, Server Action logs composition server-side and returns ok. Vercel-Analytics guarded on `process.env.VERCEL` to eliminate local console-404. | `084970f`, `8c5b798` | 2026-04-17 |
| ~~D12~~ | B8 Blog-System — `marked` + `gray-matter` + `sanitize-html` (server-side XSS defence-in-depth), `lib/blog/posts.ts` loader + category aggregation, Prose CSS without @tailwindcss/typography (20kB saved), Index + single + category pages as static-generated routes, PostCard + CategoryList + JsonLd BlogPosting. Sitemap dynamic from `/content/blog`. 2 seed posts. Pagination deferred to v2. | `c4069a9` | 2026-04-17 |
| ~~D13~~ | B6 FAQs MVP — Accordion (native `<details>`) + FAQPage JSON-LD + 5 Kategorien + Deep-Link-Anchors + Contact-CTA. Content-Layer: aggregator `content/faqs.ts` merges `faqs-wp.ts` (from migration script) + `faqs-curated.ts` (hand-written). `scripts/migrate-faqs.py` is idempotent, re-runnable. 11 FAQs live, 8 handicap-FAQs flagged needsReview for human content-pass. | `46edcaa` | 2026-04-17 |
| ~~D14~~ | B6.1 FAQ content-pass — 3 Handicap-FAQ-Rewrites (MASCHIN 120-150-Wörter + direkter Eröffnungssatz + Truth-align), 5 Drops bleiben als draft. /faq jetzt 15 FAQs. | `2d7463a` | 2026-04-17 |
| ~~D15~~ | B9 Content-Migration MVP — `scripts/migrate-posts.py` (markdownify + Avada-Shortcode-Stripper + http→https). 20 WP-Posts → `content/blog/*.md` mit Frontmatter. Handicap-Posts (2) auto-draft. 18 publish-Posts + 4 Kategorien live. | `f849f29` | 2026-04-17 |
| ~~D16~~ | B10 URL-Redirects — `scripts/generate-redirects.py` → `lib/redirects.ts` (59 Einträge: 20 blog + 15 FAQ + 24 pages) → `next.config.ts` async redirects(). Permanent 308, inkl. Hash-Anchors für FAQ-Items. Legacy-WP-Typo `golflcub` im Renewal-Pfad explizit gemappt. | `728d893` | 2026-04-17 |
| ~~D17~~ | Formular-Autoresponder — 3 Templates (Kontakt/Signup/Renewal) in `lib/email/templates.ts`, `sendAutoresponse(to, comp)` in `send.ts` (From/Reply-To = info@, To = User), best-effort post-notification call in alle 3 Server Actions. Smoke-Script `scripts/smoke-autoresponse.ts` für lokale Template-Renders. Aktiviert sich live mit User-SMTP-Creds (#5). | (this commit) | 2026-04-18 |

---

## Conventions

- **Move items promptly.** Done = stays in Done with commit ref, never back to Open.
- **Don't delete.** Strikethrough in-place for items that are retired but still referenced elsewhere.
- **One commit per closed item where practical** — makes the Done-table round-trip easy.
- **When in doubt, file it as Backlog.** Better to write down than forget.
