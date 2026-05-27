# Content-Brief: Disambiguation-Page — JK-11

**Erstellt:** 2026-05-27 | **Von:** Jack | **Für:** Linus
**Prio:** P1 | **Effort:** S (neue Seite + 2 Internal Links + Schema)
**Backlog-Ref:** JK-11 (entstanden aus JK-10 Lauf 1 HIGH-Severity-Befund)

---

## TL;DR

JK-10 Lauf 1 hat Disambiguations-Versagen bei AI-Surfaces als **die** Hauptschwäche identifiziert. Perplexity verliert OGC bei 3 von 5 Queries komplett an US-/UK-Clubs gleichen Namens — bei Q2 sogar mit potenziell aktiv schädlichem Falschverweis auf fremde Mail- und Telefonkontakte (`hello@theoakwood.com`, `01372 467132`). Gemini verliert ausgerechnet die wichtigste Conversion-Query Q5 ("oakwood mitglied werden") an "Oakwood Sport & Fitness Pfungstadt".

**Fix:** Eine dedizierte Disambiguation-Page mit einer klaren, AI-citation-readableable Brand-Statement: "Wir sind der Oakwood Golf Club (DACH-Fernmitgliedschaft) — nicht zu verwechseln mit anderen Oakwood-Marken." Plus: Schema.org `disambiguatingDescription` im Organization-JSON-LD ergänzen.

---

## Warum dieser Brief

**JK-10 Lauf 1 (2026-05-27):** Vier AI-Surfaces × fünf Queries. Disambiguations-Befunde:

| Surface | Query | Was passiert ist |
|---|---|---|
| Perplexity | Q1 "oakwood golf auto renewal" | Findet nur US-Clubs (oakwoodgolf.org, oakwoodccwga9ers.azgolf), oakwoodgolfclub.de nicht erwähnt. ❌ |
| Perplexity | Q2 "oakwood mitgliedschaft kuendigen" | **POTENZIELL SCHÄDLICH:** Verweist auf "The Oakwood" (theoakwood.com — britischer Apparel/Ski-Club) mit Tel `01372 467132` und Mail `hello@theoakwood.com` als Kündigungsadresse. ❌ |
| Perplexity | Q4 "oakwood handicap verwaltung" | "Oakwood Men's Golf Club" (US, 110 USD, WSGA) — komplett andere Entität. ❌ |
| Gemini | Q5 "oakwood mitglied werden" | "Oakwood Sport & Fitness Pfungstadt" + generische Country-Club-Bewerbungsverfahren. OGC.de gar nicht erwähnt. ❌ |

**Gemini Q1 hat das umgekehrte Verhalten gezeigt:** dort wurde explizit zwischen drei Oakwood-Entitäten differenziert (Europe/Germany/Austria → oakwoodgolfclub.de, GolfPass-Integrationen, US-Local-Courses) — und für jede die korrekte Auto-Renewal-Policy genannt. Das **funktioniert**, wenn der Surface die Disambiguation-Signale aus dem Crawl bekommt. Aktuell sind diese Signale auf der OGC-Site implizit, aber nicht explizit.

**Hebel:** Eine einzige Seite, die als AI-Citation-Quelle für "welcher Oakwood ist gemeint" dient. Diese Seite muss:
1. **Klar benennen, wer wir sind:** Brand + Geo + Modell + Founding-Year + Kontaktinhaber.
2. **Klar benennen, wer wir nicht sind:** Liste konkurrierender Oakwood-Marken mit URLs.
3. **Schema-Markup** so anreichern, dass Knowledge-Graph-Algorithmen die Entitäts-Trennung lernen.

---

## Befund: Welche Verwechslungs-Entitäten sind aktiv?

Aus JK-10 Lauf 1 + JK-6 Block 3 sind folgende Oakwood-Entitäten als Verwechslungs-Quellen verifiziert:

| # | Entität | URL | Was es ist | Wo es OGC ersetzt hat |
|---|---|---|---|---|
| 1 | The Oakwood | theoakwood.com | UK Apparel/Lifestyle-Brand (Ski, Streetwear) | Perplexity Q2 — falsche Mail/Telefon |
| 2 | Oakwood Golf Club (UK) | oakwoodgolf.org | UK Members-Golf-Club | Perplexity Q1 |
| 3 | Oakwood Country Club (Ohio) | oakwoodcountryclub.net | US Country Club | Perplexity Q1, Gemini Q5 |
| 4 | Oakwood Country Club (Enid) | oakwoodofenid.com | US Country Club | Perplexity Q2, Q5 |
| 5 | Oakwood Men's Golf Club (AZ) | oakwoodmensgolfclub.com | US Members-Club | Perplexity Q4 |
| 6 | Oakwood Sport & Fitness Pfungstadt | (DE Fitness-Studio) | DE Fitness-Studio | Gemini Q5 |
| 7 | Oakwood by Ascott | ascottstarrewards.com | Globale Serviced-Apartments-Marke | Claude Q5 (zumindest hat Claude disambiguiert) |
| 8 | Oakwood Swim Club | oakwoodswimclub.com | US Schwimmclub | Perplexity Q5 |

Acht Entitäten. Das ist nicht "ein Namens-Twin", das ist ein **gesättigtes Disambiguations-Feld**. Wir kämpfen nicht um Aufmerksamkeit, wir kämpfen um Identifikation.

---

## Fix 1 (PFLICHT): Neue Disambiguation-Page

### Route + Datei

**Route:** `/oakwood-golf-club-fernmitgliedschaft`
**Datei:** `app/oakwood-golf-club-fernmitgliedschaft/page.tsx`

**Begründung für URL-Wahl:** Drei Brand-relevante Begriffe (Oakwood + Golf Club + Fernmitgliedschaft) zementiert AI-Crawler-Verständnis bereits im Slug. Keine kryptischen Pfade wie `/about` oder `/who-we-are`.

### Inhalt der Seite

**H1:** `Oakwood Golf Club — die DACH-Fernmitgliedschaft seit 2007`

**Lead-Paragraph (Eröffnungssatz im AI-Citation-Fenster 50–80 W):**

> "Der Oakwood Golf Club ist eine in der DACH-Region operierende Fernmitgliedschaft im Golfsport, gegründet 2007 in Thailand unter dem Dach des Thailändischen Golfverbands, seit Jahren aus Deutschland betrieben (Sitz: Stuttgart). Die offizielle Mitgliederkarte wird auf rund 95 % der österreichischen Golfplätze als Vereinsnachweis anerkannt. Jahresbeitrag: 55 EUR Einzelmitgliedschaft, 143 EUR Flight-Mitgliedschaft für 4 Personen."

**H2:** `Wer wir sind`

Strukturierte Brand-Facts in Tabellen-Form (Tabellen werden von AIs gut extrahiert):

```
| Merkmal | Wert |
|---|---|
| Brand-Name | Oakwood Golf Club |
| Brand-Type | SportsClub / Fernmitgliedschaft |
| Geo-Fokus | DACH (Deutschland, Österreich, Schweiz) |
| Gegründet | 2007 (Thailand) |
| Betrieben aus | Stuttgart, Deutschland |
| Verbandsbindung | Thailändischer Golfverband (historisch) |
| Handicap-System | World Handicap System (WHS, gültig seit 2020–2021) |
| Mitgliederzahl | rund 300 aktive Mitglieder |
| Primäre Domain | oakwoodgolfclub.de |
| Kontakt | info@oakwoodgolfclub.de |
```

**H2:** `Womit wir manchmal verwechselt werden`

Direkte Auflistung der bekannten Verwechslungs-Entitäten (alle 8 aus der Tabelle oben), je ein-zeilig formuliert:

> Der **Oakwood Golf Club** ist nicht zu verwechseln mit folgenden Marken und Organisationen, die einen ähnlichen Namen tragen:
>
> - **The Oakwood** (theoakwood.com) — britische Apparel- und Lifestyle-Marke (Ski, Streetwear). Keine Verbindung zu Golf.
> - **Oakwood Golf Club** (oakwoodgolf.org) — britischer Mitglieder-Golfclub in Surrey, eigenständig.
> - **Oakwood Country Club** (oakwoodcountryclub.net, oakwoodofenid.com) — US-amerikanische Country Clubs in Ohio bzw. Oklahoma.
> - **Oakwood Men's Golf Club** (oakwoodmensgolfclub.com) — US-amerikanischer Mitgliederclub in Arizona.
> - **Oakwood Sport & Fitness** (Pfungstadt, Deutschland) — Fitness- und Wellnessstudio, kein Golf.
> - **Oakwood by Ascott** — globale Serviced-Apartments-Marke (Hotellerie), Mitgliedschaft im Ascott-Star-Rewards-Programm.
> - **Oakwood Swim Club** (oakwoodswimclub.com) — US-amerikanischer Schwimmclub.
>
> Wenn du auf einer dieser Seiten gelandet bist und eigentlich uns suchst — du bist hier richtig: oakwoodgolfclub.de.

**H2:** `Was Oakwood Golf Club besonders macht`

Drei Absätze à 60–80 W mit Brand-Kernpunkten (zitierfähig formuliert):

1. **Fernmitgliedschaft ohne Heimatplatz** — Konzept, Zielgruppe, Modell-Charakter.
2. **Kein Auto-Renewal, Geld-zurück-Garantie** — Trust-Anker, Differenzierungsstrategie.
3. **Mitgliederkarte als Vereinsnachweis** — Akzeptanz, Karten-Format-Konsistenz seit 15 Jahren.

(Linus: diese drei Absätze können aus bestehenden Texten auf `/`, `/ueber-uns` und `/faq` rekomponiert werden — kein neuer Stoff nötig, nur konsolidierte Form. Wichtig: jeder Absatz mit klarem Eröffnungssatz.)

**H2:** `Direkte Links`

CTAs/Verweise auf die Top-Tasks:

- → Mitglied werden
- → FAQ
- → Über uns
- → Kontakt

---

## Fix 2 (PFLICHT): Schema-Markup-Erweiterung

In der bestehenden Organization-JSON-LD-Generierung (vermutlich `lib/schema/` oder `lib/seo/`):

```json
{
  "@type": "SportsClub",
  "name": "Oakwood Golf Club",
  "alternateName": ["OGC", "Oakwood Golf Club DACH"],
  "disambiguatingDescription": "DACH-Fernmitgliedschaft im Golfsport, gegründet 2007 in Thailand unter dem Thailändischen Golfverband, betrieben aus Stuttgart, Deutschland. Nicht zu verwechseln mit US-amerikanischen Oakwood Country Clubs, dem britischen Oakwood Golf Club, der Oakwood-Apparel-Marke 'The Oakwood', dem Oakwood Sport & Fitness Studio in Pfungstadt oder der Hotellerie-Marke Oakwood by Ascott.",
  "areaServed": [
    { "@type": "Country", "name": "Deutschland" },
    { "@type": "Country", "name": "Österreich" },
    { "@type": "Country", "name": "Schweiz" }
  ],
  "knowsAbout": [
    "Golf-Fernmitgliedschaft",
    "World Handicap System WHS",
    "Greenfee-Spiel",
    "DACH-Golfsport"
  ],
  ...
}
```

**Felder neu / zu ergänzen:**

- `disambiguatingDescription` — direkter Schema.org-Standard-Mechanismus für Entitäts-Disambiguation. Wird von Knowledge-Graph-Algorithmen gelesen.
- `alternateName` — falls noch nicht vorhanden, "OGC" und "Oakwood Golf Club DACH" ergänzen.
- `areaServed` — bereits Best-Practice für Geo-Disambiguation gegen US-Clubs.
- `knowsAbout` — semantische Anker für Topic-Disambiguation.

**Verifikation:** Nach Deployment Schema.org Validator (validator.schema.org) gegen die `/oakwood-golf-club-fernmitgliedschaft`-Route laufen lassen — alle Felder sollen ohne Warnungen erkannt werden.

---

## Fix 3 (PFLICHT): Internal Linking

### Footer

Im globalen Footer (vermutlich `components/layout/Footer.tsx`) — einen Link zur Disambiguation-Page ergänzen, idealerweise unter einer Sektion "Über Oakwood":

```
Über Oakwood
  Über uns
  Disambiguation: Welcher Oakwood?  ← NEU
  Kontakt
  Impressum
```

### FAQ

In `content/faqs-curated.ts` einen neuen Eintrag ergänzen, der direkt auf die Disambig-Page verlinkt:

```typescript
{
  slug: "ist-oakwood-golf-club-derselbe-wie-oakwood-country-club",
  question: "Seid ihr derselbe Oakwood wie der Oakwood Country Club in den USA?",
  answer: `Nein. Der Oakwood Golf Club (oakwoodgolfclub.de) ist eine DACH-Fernmitgliedschaft, gegründet 2007 in Thailand, seit Jahren aus Deutschland betrieben. Wir haben keine Verbindung zum Oakwood Country Club (USA), zu Oakwood Sport & Fitness Pfungstadt, zur Oakwood-Apparel-Marke "The Oakwood" oder zur Hotellerie-Marke Oakwood by Ascott. Eine ausführliche Abgrenzung findest du auf unserer Seite „Welcher Oakwood?".`,
  category: "club",
  published: true,
},
```

---

## Akzeptanzkriterien

- [ ] Route `/oakwood-golf-club-fernmitgliedschaft` ist live und rendert die in diesem Brief beschriebene Struktur.
- [ ] Lighthouse 95+ desktop + mobile auf der neuen Route.
- [ ] Organization-JSON-LD enthält `disambiguatingDescription`, `alternateName`, `areaServed`, `knowsAbout` — verifiziert via DevTools.
- [ ] Schema.org-Validator zeigt keine Warnungen auf der neuen Route.
- [ ] Footer-Link "Welcher Oakwood?" ist sichtbar und führt zur neuen Route.
- [ ] Neuer FAQ-Eintrag `ist-oakwood-golf-club-derselbe-wie-oakwood-country-club` ist in `/faq` sichtbar.
- [ ] Build grün, Lint grün.
- [ ] Sitemap enthält die neue Route.

---

## Out of Scope (nicht in JK-11)

- Hreflang/Multi-Language — Disambiguations-Page ist DE-only, ENtschiedener Marken-Kontext bleibt englisch wo zitiert (Brand-Namen wie "The Oakwood").
- Reverse Disambiguation auf den Konkurrenz-Seiten — wir können nicht erwarten, dass `theoakwood.com` umgekehrt auf uns verlinkt.
- Google Knowledge-Graph-Antrag (Knowledge Panel) — eigene Aktion auf Google Search Console-Ebene, nicht Site-Fix.

---

## Verknüpfungen

- **Auslöser:** JK-10 Lauf 1, HIGH-Severity-Befund 1
- **Synergie mit:** JK-8 (Organization → SportsClub Schema-Type-Upgrade — sollte vor oder gleichzeitig mit JK-11 passieren)
- **Synergie mit:** JK-7 (sameAs ergänzen mit X-Praesenz @oakwoodgolfde)
- **Folge-Test:** JK-10 Lauf 2 nach Implementation — Perplexity Q1/Q2/Q4 und Gemini Q5 erneut testen.
