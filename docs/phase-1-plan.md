# Oakwood Golf Club — Phase-1-Plan

**Stand:** 2026-04-17 (nach Scope-Interview Session C + Block-C-Abschluss Session D)
**Autor:** Linus (Frontend Artist)

---

## Kurzübersicht

| Phase | Scope | Status |
|---|---|---|
| **Phase 1** | Marketing-Site + Funnel + 20-Post-Blog-Migration | Geplant — dieser Plan |
| Phase 2 | Publishing-Pipeline (E-Mail/Obsidian → LLM → Review → Publish) + Admin-Automatisierung | Roadmap |
| Später | EN-Version, Stripe-Integration, Handicap-Produkt (eigenes Projekt) | Offen |

---

## Scope Phase 1

**Was wir bauen:**
- Marketing-Site + Funnel — kein Member-Portal, kein Auth, keine DB zwingend
- 3 Formulare: Kontakt, Signup, Renewal (senden strukturierte E-Mail an info@oakwoodgolfclub.de)
- Blog: 20 Posts (2020–2025) als Markdown-Dateien, SEO-Optimization A+B+D
- URL-Redirects in `next.config.js` für alle alten WordPress-URLs (Pflicht für Ranking-Erhalt)

**Was wir NICHT bauen (Phase 1):**
- Member-Login / Member-Portal
- Handicap-Backend oder Scorecard-Upload (self-reported beim Signup reicht)
- Payment-Gateway (Stripe = Phase 2)
- Transaktionsemail-Provider (E-Mail direkt via Server Action, kein Resend/Postmark nötig)
- Mitgliederdaten-Migration aus Outlook (Outlook bleibt Master-CRM)
- EN-Version (DE-only)

---

## Seiten-Struktur

| Seite | URL | Beschreibung |
|---|---|---|
| Home | `/` | Hero, Value Prop, Pricing, FAQ-Teaser, CTA |
| Mitglied werden | `/mitglied-werden` | Signup-Formular |
| Mitgliedschaft verlängern | `/mitgliedschaft-verlaengern` | Renewal-Formular |
| FAQs | `/faq` | Accordion + FAQPage JSON-LD |
| Über uns | `/ueber-uns` | Founder-Bio, Geschichte, Thailand-Story |
| Blog | `/blog` | Listing + Kategorie-Filter |
| Blog-Post | `/blog/[slug]` | Einzelner Post (Markdown) |
| Impressum | `/impressum` | Statisch |
| Datenschutz | `/datenschutz` | Statisch |
| AGB | `/agb` | Statisch |
| Kontakt | `/kontakt` | Kontakt-Formular |

---

## Tech Stack

| Layer | Wahl | Begründung |
|---|---|---|
| Framework | Next.js 16 (App Router) | Konsistenz mit rauhut.com, neckarshore.ai, goldoni |
| CSS | Tailwind CSS | Konsistenz |
| Hosting | Vercel | Edge-Deployment → TTFB < 200ms, gleiche Pipeline |
| CMS | Markdown-in-Repo (`.md` + Frontmatter) | 20 Posts, 1 Redakteur, Phase-2-Pipeline-kompatibel |
| Analytics | Vercel Web Analytics (cookieless) | DSGVO, kein Cookie-Banner, konsistent mit rauhut.com |
| Fonts | Self-hosted via `next/font/local` | DSGVO, kein Google-CDN-Fetch |
| E-Mail | Server Action → `mailto:` strukturiert | Phase 1 reicht ohne Provider |
| Lighthouse-Target | 95+ desktop + mobile | Nicht verhandelbar |

---

## Design-Tokens

| Token | Wert | Verwendung |
|---|---|---|
| Schwarz | `#0A0A0A` | Base Text, Nav BG |
| Weiß | `#FAFAFA` | Background, Karten |
| Grau | `#6B7280` | Muted Text, Borders |
| Fairway-Grün (dunkel) | `#1B4332` | Primärer Brand-Accent, Buttons, aktive States |
| Fairway-Grün (heller) | `#2D6A4F` | Hover-States, Secondary |
| Gold | `#B7892A` | Sparsamer Premium-Akzent: Icon-Farbe, CTA-Hover, Membership-Signal. KEINE Flächenfarbe. |
| Headline-Font | Playfair Display | Klassisch, seriös — self-hosted |
| Body-Font | Inter | Sachlich, modern — self-hosted |

**Design-Prinzip:** Traditional-Modern-Golf. Schwarz/Weiß/Grau als Base, Fairway-Grün als Brand-Accent, Gold sparsam als Premium-Signal (rechtfertigt den €55-Preis). Kein Country-Club-Kitsch.

---

## SEO Must-Haves (eingebaut, nicht nachträglich)

Aus dem MASCHIN-Audit 2026-04-17 (`docs/reports/2026-04-17-maschin-seo-oakwood.md`):

### Performance
- TTFB < 200ms — Vercel Edge-Deployment erfüllt das out-of-the-box
- LCP < 2.5s — kein Avada-CSS-Overhead, kein jQuery
- WebP/AVIF für alle Bilder
- Brotli-Compression (Vercel-Standard)

### Content & E-E-A-T
- "Oakwood Golf Club" als Klartext überall — nie nur "oakwoodgolfclub.de"
- H1 auf jeder Seite
- 500+ Wörter Homepage-Content
- Named Founder + Bio (2–3 Sätze) auf Über-uns-Seite
- Testimonials: Gründungsjahr, Mitgliederzahl, Thailand-Story
- Explicit CTA "Jetzt Mitglied werden" above the fold

### GEO / AI Citability
- `llms.txt` im Repo-Root von Anfang an (Template im MASCHIN-Report)
- `robots.txt`: AI-Crawler explizit freigeben (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot)
- FAQPage JSON-LD: plain text, keine HTML-Fragmente, 120–150 Wörter pro Antwort mit direktem Eröffnungssatz
- Organization JSON-LD: name, url, logo, contactPoint, alternateName
- Offer-Schema für Pricing (55 EUR Einzel, 143 EUR Flight, 10 EUR Referral)
- OG Title + Twitter Cards vollständig befüllt
- `dateModified` in JSON-LD + sichtbares "Zuletzt aktualisiert"-Signal — auf Blog-Posts UND auf Homepage/FAQ/Über-uns (AI-Freshness-Signal auf allen Content-Seiten, nicht nur Blog)

### Technical SEO
- Security Headers via `next.config.js`: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- Canonical Tags auf allen Seiten
- `hreflang="de"` self-referencing
- Sitemap-Generierung (`next-sitemap` oder App-Router-native)

---

## Content-Migration Blog

**Umfang:** 20 Posts (2020–2025), 5 Kategorien

**Optimierungs-Level:**
| Level | Was | Prio |
|---|---|---|
| A | SEO-Meta (Title, Description, OG) — LLM-generiert, User approvt | Pflicht |
| B | Struktur (H-Hierarchie, Alt-Texte, interne Verlinkung) | Pflicht |
| C | Content-Qualität — LLM liefert Verbesserungsvorschläge in Review-Queue | Nice-to-have (Phase 2) |
| D | URL-Redirects (alte WordPress-URLs → neue Next.js-URLs) | Pflicht |

**Frontmatter-Schema je Blog-Post:**
```yaml
---
title: "Titel des Posts"
description: "SEO-Meta-Description (max 155 Zeichen)"
date: "2024-03-15"
dateModified: "2026-04-17"
category: "golfplaetze"
slug: "mein-post-slug"
author: "German Rauhut"
image: "/blog/mein-post/hero.webp"
imageAlt: "Alt-Text für das Bild"
---
```

---

## Bau-Blöcke (Reihenfolge)

| # | Block | Was | Effort | Status |
|---|---|---|---|---|
| B1 | Repo-Bootstrap | Next.js 16 init, Tailwind, Vercel-Link, self-hosted Fonts, `.gitignore` erweitern | S | Offen |
| B2 | Design-Tokens | Tailwind-Config, Farbpalette, Typo-Scale, globale CSS-Variablen | S | Offen |
| B3 | Layout-Shell | Nav + Footer + SEO-Meta-Komponente + robots.txt + llms.txt + Security Headers | S | Offen |
| B4 | Homepage | Hero + Value Prop + Pricing-Cards + FAQ-Teaser + CTA-Section + Organization JSON-LD + Offer-Schema | M | Offen |
| B5 | Formulare | Kontakt, Signup, Renewal — je Server Action → E-Mail an info@ | M | Offen |
| B6 | FAQs-Seite | Accordion + FAQPage JSON-LD (15 Q&A, plain text). **Antworten werden rewritten, nicht 1:1 übernommen** — aktueller Ø 65 Wörter, Ziel 120–150 Wörter pro Antwort mit direktem Eröffnungssatz (AI-Citation-Fenster). | S | Offen |
| B7 | Über uns | Named Founder, Bio, Gründungsjahr, Thailand-Story, Mitgliederzahl | XS | Offen |
| B8 | Blog-System | Markdown-Reader, Post-Layout, Kategorie-Listing, Pagination | S | Offen |
| B9 | Content-Migration | 20 Posts: WordPress-Export → Markdown + Frontmatter, SEO A+B+D. **Cleanup-Schritt Pflicht:** Scan auf Legacy-Hosting-URLs (`s522799978.online.de` etc.) und auf rohe Avada-HTML-Fragmente — beides wird entfernt bevor der Post als Markdown committet wird. | M | Offen |
| B10 | URL-Redirects | `next.config.js` redirects für alle alten WordPress-URLs | S | Offen |
| B11 | Legal | Impressum, Datenschutz, AGB — statische Seiten | XS | Offen |
| B12 | Analytics | Vercel Web Analytics einbinden | XS | Offen |
| B13 | Pre-Launch | Lighthouse 95+, visuelle Abnahme (User), smoke test Formulare | S | Offen |
| B14 | DNS-Cutover | IONOS A+CNAME → Vercel, MX unberührt (analog rauhut.com-Pattern) | XS | Offen |

**Gesamtaufwand Phase 1:** ~2–3 Linus-Build-Sessions

---

## Definition of Done Phase 1

- [ ] Lighthouse 95+ desktop + mobile
- [ ] Mobile + Desktop visuell vom User abgenommen
- [ ] Alle 20 Blog-Posts migriert + SEO A+B+D
- [ ] URL-Redirects getestet (kein 404 auf alten WordPress-URLs)
- [ ] Formulare smoke-getestet (E-Mail kommt an info@)
- [ ] Build grün (`npm run build`)
- [ ] Lint grün (`npm run lint`)
- [ ] Committed + pushed
- [ ] User hat DNS-Cutover freigegeben

---

## Domain / DNS (Cutover, Phase 1 Ende)

- **Domain:** `oakwoodgolfclub.de` — bleibt bei IONOS (analog rauhut.com)
- **Cutover:** Nur A- und CNAME-Records auf Vercel-IPs umbiegen
- **MX-Records bleiben unberührt** — E-Mail darf nicht ausfallen
- Vorher: IONOS-Zone-Snapshot als Rollback-Versicherung (User-Aufgabe)

---

## Offene Entscheidungen für spätere Sessions

| # | Entscheidung | Wer | Wann |
|---|---|---|---|
| 1 | WordPress-Content-Export: Tool/Script-Wahl (wp-cli, WP REST API, manuell) | Linus + User | B9-Session |
| 2 | E-Mail-Versand Phase 1: `mailto:`-Link vs. Server Action mit SMTP | Linus | B5-Session |
| 3 | Sitemap: `next-sitemap` Paket vs. App-Router-native | Linus | B3-Session |
