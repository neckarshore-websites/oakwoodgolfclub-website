# Oakwood Golf Club — Website Redesign Briefing

Snapshot taken 2026-04-17. Scope-Interview abgeschlossen (Session C + D). Alle 12 Scope-Fragen entschieden. Phase-1-Plan steht: `docs/phase-1-plan.md`.

---

## 0. Phase-Architektur (Kurzübersicht)

| Phase | Scope | Status |
|---|---|---|
| **Phase 1** | Marketing-Site + Funnel + 20-Post-Blog-Migration | Geplant — `docs/phase-1-plan.md` |
| Phase 2 | Publishing-Pipeline (E-Mail/Obsidian → LLM → Review → Publish) + Admin-Automatisierung | Roadmap |
| Später | EN-Version, Stripe-Integration, Handicap-Produkt (eigenes separates Projekt) | Offen |

**Kernentscheidung:** OGC-Phase-1 ist ein Jamstack-Projekt (Marketing-Site + Funnel + Blog), kein Portal-Projekt. Kein Member-Login, kein Handicap-Backend, keine DB zwingend. Scope ist nach Scope-Interview eine Größenordnung kleiner als das ursprüngliche Briefing annahm.

---

---

## 1. Kontext

- **Betreiber:** User (German Rauhut). OGC ist **sein** 16-Jahres-Side-Hustle, nicht fremd, nicht Kundenprojekt, nicht Neckarshore-Produkt.
- **Betriebsdauer:** 16 Jahre Live-Betrieb. Wird von Thailand aus operiert, Hauptmarkt DACH.
- **Mitgliederzahl:** ~300 aktive Mitglieder — substanziell genug um 16 Jahre zu laufen.
- **Priorität:** User hat explizit gesagt: "OGC ist mein Baby und aus meiner Sicht wichtiger als Goldoni." Für den User die **höchstpriore Nebenprojekt-Website**.
- **Strategische Implikation:** Goldoni wird als schneller MVP gebaut (Design-Proving-Ground). OGC bekommt strukturierte, mehrsession-Session-Planung — **Risiko eines botched Relaunches ist hoch**: ein bestehendes Mitglied darf nicht plötzlich seine Scorecards verlieren oder ein falsches Handicap auf einem echten Golfplatz haben.

---

## 2. Aktuelle Site

- **URL:** [oakwoodgolfclub.de](https://oakwoodgolfclub.de)
- **Tech:** WordPress (identifiziert an `/wp-content/`-Pfaden, FAQ-Collapse-Plugin, Share-Button-Plugin)
- **Hosting:** in Deutschland
- **Pages (aktuell):**
  - Home
  - Mitglied werden (Onboarding-Flow)
  - Mitgliedschaft verlängern (Renewal-Flow)
  - Info (Über uns, Feedback, Kontakt, AGB, Datenschutzerklärung, Impressum)
  - FAQs (Fernmitgliedschaft, Handicapverwaltung, Handicap, Golfclub)
  - Blog (5 Kategorien: Das 19. Loch, Equipment & Spielzeug, Handicapverwaltung, Golfplätze, Training)
- **Languages:** Deutsch primär; minimale EN-Elemente in Navigation

---

## 3. Business-Fakten

| Feld | Wert |
|---|---|
| Name | Oakwood Golf Club |
| Tagline | "Fernmitgliedschaft im Golfclub für 55 Euro" |
| Primär-Hero | "Werde noch heute Mitglied mit einer Fernmitgliedschaft" |
| Preis Einzel | €55 / 12 Monate |
| Preis Flight (4 Personen) | €143 / 12 Monate (€35.75 pro Person; spart gegenüber 4× €55 = €220) |
| Referral-Bonus | €10 pro geworbenem Mitglied |
| Mitglieder | ~300 aktiv |
| Geo-Verteilung | DACH (Mehrheit DE/AT/CH) + Thailand + Brazil + UK + India + DK + IT |
| Telefon | +49 (160) 385 9135 |
| Email | info@oakwoodgolfclub.de |
| Öffnungszeiten | Nicht spezifiziert (kein physischer Platz) |
| Physische Adresse | Nicht gelistet (remote-only) |
| Social | Facebook · X (Twitter) · Pinterest · Email-Signup |

### Value Proposition (Wortlaut aus aktueller Site)

- ~95% der österreichischen Golfplätze akzeptieren die Mitgliedschaft
- Kein Auto-Renewal — keine ungewollten Verlängerungen
- Mitgliedschaft läuft ab dem vom Member gewählten Startdatum + 12 Monate (flexibel)
- Recreational Handicap-Modell: alle Runden zählen, nicht nur Turniere
- Professionelle Mitgliederkarte als Platz-Credibility

---

## 4. Content-Snapshot (aktuell)

### Navigation

`Home | Mitglied werden! | Mitgliedschaft verlängern! | Info ▾ | FAQs ▾ | Blog ▾`

### Hero

"Werde noch heute Mitglied mit einer Fernmitgliedschaft" — Primär-CTA zum Signup.

### Blog-Kategorien

- Das 19. Loch (Lifestyle / Off-Course)
- Equipment & Spielzeug (Reviews)
- Handicapverwaltung (How-To, FAQ-Tiefe)
- Golfplätze (Course-Guides)
- Training (Tipps)

**→ 16 Jahre Blog-Content. Content-Migration-Strategie = eine der großen Scope-Fragen.**

### FAQ-Themen

- Fernmitgliedschaft
- Handicapverwaltung
- Handicap (allgemein)
- Golfclub (allgemein)

---

## 5. Special Features (aktuell, zu erhalten / migrieren)

| Feature | Beschreibung | Phase-1-Status |
|---|---|---|
| ~~Handicap-Verwaltungssystem~~ | ~~Online-Tool: Scorecard-Upload, Score-Tracking, Handicap-Berechnung~~ | **OUT OF SCOPE Phase 1.** Self-reported beim Signup reicht. Eigenes Handicap-Produkt = Roadmap 2027. |
| Mitgliederkarte-Druck | Plastikkarte Kreditkartengröße mit Name + Handicap + Datum | Manuell bleibt (Zebra ZC100 + wirmachendruck.de). Kein Code-Scope. |
| ~~Interaktive Mitgliederkarte~~ | ~~Google Maps mit geografischer Verteilung der Mitglieder~~ | OUT OF SCOPE Phase 1. |
| Blog-System | 20 Posts (2020–2025), 5 Kategorien | ✅ Migrieren — Markdown-in-Repo, SEO A+B+D |
| FAQ-Datenbank | Strukturierte Q&A | ✅ Neu bauen — Accordion + FAQPage JSON-LD |
| ~~Scorecard-Submission-Portal~~ | ~~Upload / Eingabe durch Member~~ | **OUT OF SCOPE Phase 1.** Kein Member-Portal. |

---

## 6. Scope-Fragen (alle entschieden — 2026-04-17)

| # | Frage | Entscheidung |
|---|-------|--------------|
| 6a | **Relaunch-Strategie** | ✅ Schrittweise, konservativ. Phase 1 = Marketing-Site + Funnel + Blog. |
| 6b | **Member-Portal** | ✅ Kein Portal Phase 1. Website = Funnel + Content. Outlook bleibt Master-CRM. |
| 6c | **Payment-Gateway** | ✅ Banküberweisung bleibt (kein Auto-Renewal). Stripe = Option Phase 2 (Kosten-Analyse ausstehend). Lastschrift explizit NEIN. |
| 6d | **Handicap-Berechnung** | ✅ Self-reported beim Signup — kein WHS-Backend. Eigenes Recreational-Handicap-Produkt = Roadmap 2027, eigenes Projekt. |
| 6e | **Content-Migration Blog** | ✅ Alle 20 Posts (2020–2025) migrieren. SEO A+B+D Pflicht. C (Content-Qualität) = LLM-Review-Queue. Redirects = Pflicht. |
| 6f | **Mitgliederdaten-Migration** | ✅ Gestorben. Kein Member-Portal → keine DB-Migration. Outlook bleibt Master. |
| 6g | **Mehrsprachigkeit** | ✅ DE-only Phase 1+2. EN später wenn Nachfrage quantifiziert. Browser-Translation als Interim. |
| 6h | **CMS-Wahl** | ✅ Markdown-in-Repo. 20 Posts, 1 Redakteur. Phase-2-Pipeline-kompatibel. |
| 6i | **Mitgliederkarte-Druck** | ✅ Manuell bleibt (Zebra ZC100 + wirmachendruck.de). Kein API-Scope. |
| 6j | **E-Mail-Workflows** | ✅ Phase 1: Formulare → strukturierte E-Mail an info@. Transaktionsemail-Provider (Resend/Postmark) = Phase 2. |
| 6k | **Analytics** | ✅ Vercel Web Analytics (cookieless, DSGVO, kein Cookie-Banner). Konsistent mit rauhut.com. |
| 6l | **Domain / DNS / Email-MX** | ✅ IONOS, bleibt. DNS-Cutover = nur A+CNAME auf Vercel. MX-Records bleiben unberührt. |

---

## 7. Tech-Stack (entschieden)

| Layer | Wahl | Begründung |
|---|---|---|
| Framework | Next.js 16 (App Router) | Konsistenz mit rauhut.com, neckarshore.ai, goldoni-website |
| CSS | Tailwind CSS | Konsistenz |
| Hosting | Vercel | Edge-Deployment → TTFB < 200ms; gleiche Pipeline wie alle Linus-Projekte |
| CMS | Markdown-in-Repo (`.md` + Frontmatter) | 20 Posts, 1 Redakteur, Phase-2-Pipeline-kompatibel |
| Analytics | Vercel Web Analytics | Cookieless, DSGVO, kein Cookie-Banner, konsistent mit rauhut.com |
| Fonts | Self-hosted via `next/font/local` | DSGVO-konform, kein Google-CDN-Fetch |
| E-Mail (Phase 1) | Server Action → strukturierte E-Mail an info@ | Kein externer Provider nötig für Phase 1 |
| E-Mail (Phase 2) | Resend oder Postmark | Reminder + Welcome + Renewal-Automatisierung |
| Payment (Phase 2) | Stripe | Abhängig von Kosten-Analyse (~1.7% bei €55) |
| DB | Keine in Phase 1 | Kein Member-Portal, Outlook bleibt Master |
| Lighthouse-Target | 95+ desktop + mobile | Nicht verhandelbar |

---

## 8. Design-Richtung (zu validieren)

**Vorschlag Linus:** Traditional-Modern-Golf. Edel, aber nicht snobistisch. Klassisch, aber nicht verstaubt. Hebt sich bewusst ab von:

- Dem klischeehaften "Country Club mit karierten Mustern und Schottland-Foto"
- Dem generischen WordPress-Golfclub-Theme (aktueller Zustand)

### Gegenprüfung zu anderen Linus-Projekten

| Projekt | Ästhetik | Palette |
|---|---|---|
| rauhut.com | Minimal Material, sachlich | Schwarz/Weiß + Teal `#22D3EE` |
| neckarshore.ai | Premium, warm | Bordeaux-Ton |
| goldoni (Vorschlag) | Warm, einladend, hand-gemacht | Warme Erdtöne: Terrakotta, Creme, Olivgrün |
| **OGC (Vorschlag)** | **Traditional-Modern-Golf, ruhig, klassisch** | **Tiefes Fairway-Grün (`#1B4332` / `#2D5F3F`) + Sand-Beige + Anthrazit** |

### Typo-Kandidaten

- Headline: Cormorant, Playfair Display, DM Serif — klassisch, ruhig, seriös
- Body: Inter (sachlich, modern) oder Source Serif (wärmer, klassischer)

### No-Gos

- Stockfotos Golfer-mit-Putter-Silhouette gegen Sonnenuntergang
- Klischee-Fotos schottischer Küstenplätze (keinen Link zu OGC)
- Übertriebene Rasen-Texturen im Hintergrund
- Karierte Muster (Tartan, Schach)
- Rot-Grün-Farbschemata Weihnachten-Assoziation
- ~~Goldene Akzente (wirken nouveau riche)~~ → **Korrektur (User-Direktive):** Gold ist erlaubt als sparsamer Premium-Akzent (Icon-Farbe, CTA-Hover, Membership-Signal). KEINE Flächenfarbe. Trad-Modern-Golf mit Gold-Akzent ist stärker als ohne — es ist das Signal das den €55-Preis rechtfertigt.
