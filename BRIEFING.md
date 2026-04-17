# Oakwood Golf Club — Website Redesign Briefing

Snapshot taken 2026-04-17 as groundwork for a dedicated OGC session. No build decisions made yet — all 12 scope-questions below need clarification before any code is written. Different from Goldoni: OGC is a **live business** with ~300 paying members, not a marketing site. Planning depth reflects that.

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

| Feature | Beschreibung | Kritikalität |
|---|---|---|
| Handicap-Verwaltungssystem | Online-Tool: Scorecard-Upload, Score-Tracking, Handicap-Berechnung | **Hoch** — Kerndienst |
| Mitgliederkarte-Druck | Plastikkarte Kreditkartengröße mit Name + Handicap + Datum | **Hoch** — Platz-Credibility |
| Interaktive Mitgliederkarte | Google Maps mit geografischer Verteilung der Mitglieder | Mittel — Community-Signal |
| Blog-System | 16 Jahre Content über 5 Kategorien | Mittel — SEO-Langzeitwert |
| FAQ-Datenbank | Strukturierte Q&A (Collapse-Plugin) | Mittel — Support-Entlastung |
| Scorecard-Submission-Portal | Upload / Eingabe durch Member | **Hoch** — Kerndienst |

---

## 6. Scope-Fragen (offen, zu klären in dedizierter Session)

| # | Frage | Optionen / Gedanken |
|---|-------|---------------------|
| 6a | **Relaunch-Strategie** | Big-Bang (alles neu gleichzeitig, hohes Risiko) vs. schrittweise Migration (Landing → Info-Seiten → Blog → Member-Portal). **Linus-Empfehlung: schrittweise.** |
| 6b | **Member-Portal** | (A) Eigenentwicklung Next.js + PostgreSQL; (B) SaaS-Integration (ClubUp, Howdidido, Golfnet); (C) WordPress bleibt für Portal, nur Frontend-Relaunch |
| 6c | **Payment-Gateway** | Aktueller Provider? (User-Input nötig). Neu: Stripe / PayPal / beides? Wiederkehrend (Subscription) vs. jährlich manuell (wie aktuell "kein Auto-Renewal") |
| 6d | **Handicap-Berechnung** | Eigenes Backend (muss WHS-konform sein — World Handicap System, komplex) vs. externes System vs. manueller Export. **Ist das aktuelle System WHS-konform?** |
| 6e | **Content-Migration Blog** | 16 Jahre Posts — alle importieren, kuratieren (Top 20?), oder nur Flagship-Posts? Redirects für alte URLs = SEO-kritisch |
| 6f | **Mitgliederdaten-Migration** | Export WordPress DB → Anonymisierungs-Prüfung → Import ins neue Schema. DSGVO-Dokumentation des Migrationsvorgangs nötig. **Kein Member darf Daten verlieren.** |
| 6g | **Mehrsprachigkeit** | DE primär. EN für internationale Mitglieder (aktuell Thailand, Brazil, UK, India, DK, IT — aber: sprechen die Deutsch? Migration-Risiko wenn EN fehlt?) |
| 6h | **CMS-Wahl** | User-selbst-pflege vs. Payload (selfhosted Headless) vs. Sanity (SaaS) vs. Markdown-in-Repo. User hat wenig Zeit → CMS sinnvoll. |
| 6i | **Mitgliederkarte-Druck** | Aktueller Dienstleister? Kartendruck-Automatisierung via API möglich? Oder weiter manuell? |
| 6j | **E-Mail-Workflows** | Welcome, Renewal-Reminder (Member hat kein Auto-Renewal, muss aktiv verlängern → Reminder kritisch), Handicap-Updates. Provider: aktuell? Neu: Resend / Postmark / SendGrid? |
| 6k | **Analytics** | Vercel Web Analytics (cookieless) oder Plausible (self-hostable, DSGVO-safe) oder Matomo. Business-Betrieb → konkrete Zahlen nötig, nicht nur "gibt es Traffic?" |
| 6l | **Domain / DNS / Email-MX** | Wo liegt `oakwoodgolfclub.de`? Wer kontrolliert DNS? Email-MX-Records: nicht kaputt machen (analog zu rauhut.com-Lesson) |

---

## 7. Tech-Vorschlag (Defaults, zu bestätigen)

| Layer | Wahl | Begründung |
|---|---|---|
| Framework | Next.js 16 | Konsistenz mit rauhut.com, neckarshore.ai, goldoni-website |
| CSS | Tailwind CSS | Konsistenz |
| Hosting | Vercel | Git-Push deployt; gleiche Pipeline wie alle anderen Linus-Projekte |
| DB | PostgreSQL — Supabase Free Tier oder Vercel Postgres | Für Member, Scores, Handicap, Renewals |
| Payment | Stripe | Industry-Standard; Subscription + One-off beides möglich |
| CMS | Payload CMS (selfhosted) oder Sanity Free Tier | Member-Portal braucht Struktur; Markdown reicht nicht mehr |
| Analytics | Vercel Web Analytics oder Plausible | Cookieless, DSGVO-konform |
| Transaktionsemail | Resend (Default) oder Postmark | Welcome + Renewal-Reminder + Handicap-Updates |
| Fonts | Self-hosted via `next/font/local` | DSGVO-konform, kein Google-CDN-Fetch |
| Lighthouse-Target | 95+ desktop + mobile | Nicht verhandelbar |
| Membership-Card-Druck | API-Integration falls aktuelle Druckerei eine hat; sonst manueller Export-CSV | Hängt von 6i ab |

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
- Goldene Akzente (wirken nouveau riche)
