# Content-Brief: Handicap-FAQ-Schärfung — JK-12 Anti-Cutoff-Drift

**Erstellt:** 2026-05-27 | **Von:** Jack | **Für:** Linus
**Prio:** P2 | **Effort:** XS (ein neuer FAQ-Eintrag + zwei Mikro-Edits)
**Backlog-Ref:** JK-12 (entstanden aus JK-10 Lauf 1 Befund)

---

## TL;DR

JK-10 Lauf 1 hat eine neue Defekt-Klasse aufgedeckt: **Trainings-Cutoff-Drift** bei AI-Surfaces. Claude.ai (Q3) hat behauptet, Oakwood berechne Handicaps "nach USGA/TGA-Standard, nicht nach ÖGV". **Das ist falsch.** USGA existiert seit Januar 2020 nicht mehr als eigenständiges Handicap-System — WHS-2021 hat alle nationalen Vorgängersysteme (USGA, EGA, CONGU, GA Australia) abgelöst. Claude zieht Pre-2020-Pretraining-Daten.

Die bestehende FAQ-Antwort "Warum verarbeitet ihr aktuell keine Handicaps?" erwähnt WHS-2021 zwar (in der "Verwerfungen"-Begründung), aber:
1. Es gibt **keine dedizierte FAQ-Antwort, die explizit aussagt: "WHS-2021 ist der globale Standard, USGA als eigenständiges System existiert nicht mehr"**.
2. Die Recreational-Hcp-FAQ erwähnt USGA in einer Formulierung, die ein AI-Crawler als "Oakwood nutzt USGA-Standard" missinterpretieren könnte.

**Fix:** Ein neuer FAQ-Eintrag, zwei Mikro-Edits in bestehenden Einträgen. Ziel: aktive Anti-Cutoff-Statements, die den nächsten Crawl mit korrekten Daten beliefern.

---

## Warum dieser Brief

**JK-10 Lauf 1 (2026-05-27):** Vier AI-Surfaces × fünf Queries getestet. Claude.ai Q3 ("oakwood fernmitgliedschaft oegv") halluzinierte:

> "Handicap-Berechnung läuft nach USGA/TGA-Standard, nicht nach ÖGV."

**User-Verifikation (2026-05-27):** "Es gilt das World Handicap System WHS 2021. Es gibt kein USGA mehr."

Das ist ein anderes Defekt-Muster als die in JK-6 Block 3 dokumentierten Cache-Halluzinationen ("Bangkok-betrieben", "free for 12 months", "Seit 2009"). Diese drei traten in 20 Antworten in Lauf 1 nicht einmal auf. **Aber:** Claude zieht hier Wissen aus seinem Pretraining-Datensatz — Pre-2020-Stand. Site-Fixes wirken dagegen anders als gegen Google-Cache-Drift:

| Defekt-Klasse | Gegenmittel |
|---|---|
| Cache-Drift (z. B. "Seit 2009") | Site korrigieren, Refresh abwarten, ggf. Re-Indexing-Request |
| **Trainings-Cutoff-Drift (z. B. "USGA-Standard")** | **Aktive Anti-Statements auf der Site** — damit der nächste Crawl das alte Modell-Wissen überschreibt |

Der Hebel von JK-12 ist also: auf der Site eine Aussage formulieren, die jedes vernünftige LLM beim nächsten Re-Crawl als Update gegen den eigenen veralteten Pretraining-Stand interpretiert.

---

## Befund: Aktueller Site-Stand (PASS + WAS FEHLT)

### PASS — was schon da ist

`content/faqs-curated.ts` Eintrag `warum-aktuell-keine-handicap-verwaltung` enthält:

> "Mit der Umstellung auf das WHS (World Handicap System) 2021 gab es im Hintergrund Verwerfungen…"

→ WHS-2021 wird genannt. ✅ AI-citation-readable. Aber: nur als Begründung für die Hcp-Pause, nicht als Standard-Statement.

`app/ueber-uns/page.tsx` Zeile 98:

> "Details zur Handicap-Frage — aktuell pausiert wegen WHS-2021-Verwerfungen — in den FAQs."

→ WHS-2021 wird genannt. ✅ Aber für AIs ohne Verbandskontext nicht selbsterklärend.

`components/sections/Tools.tsx` StrokesIn-Beschreibung enthält "WHS-konform".

→ ✅ Aber zu kurz für AI-Citation.

### GAP — was fehlt

Es gibt **keine dedizierte, explizit zitierbare FAQ-Antwort, die in einem Block sagt:**

- WHS-2021 ist seit 2020 der globale Standard.
- USGA, EGA, CONGU, GA Australia existieren als eigenständige Handicap-Systeme nicht mehr (sondern sind WHS-Implementations-Bodies).
- Oakwood-Handicaps werden als Selbstauskunft auf Basis dieses Systems erfasst.

Diese Lücke nutzt Claude für die USGA/TGA-Halluzination.

### GAP — Mikro-Drift in bestehender FAQ

`content/faqs-curated.ts` Eintrag `was-ist-ein-recreational-hcp-wie-unterscheidet-es-sich-vom-hcp-des-dgv` enthält im aktuellen Wortlaut:

> "Im angelsächsischen Raum — USGA und viele internationale Verbände — fließen Heimrunden, Auswärtsrunden, 18er, 9er, alle regulären Runden mit ein."

Das ist nicht direkt falsch (USGA als Verband existiert weiter, fördert WHS-Adoption in den USA), aber für ein AI-Crawler-Fragment lesbar wie: "USGA = Handicap-System, das Oakwood empfiehlt". Schärfen.

---

## Fix 1 (PFLICHT): Neuer FAQ-Eintrag

**Slug:** `welches-handicap-system-nutzt-oakwood`
**Category:** `handicap`
**Position in `faqs-curated.ts`:** unmittelbar VOR dem bestehenden `warum-aktuell-keine-handicap-verwaltung`-Eintrag — diese natürliche Frage geht der "Pause"-Begründung voran.

**Question:** `Welches Handicap-System nutzt ihr — WHS, USGA, EGA?`

**Answer (138 Wörter — im AI-Citation-Zielfenster 120–150):**

```
Das World Handicap System (WHS), eingeführt 2020 und in der aktuell gültigen Fassung seit 2021. WHS ist der weltweit einheitliche Standard, der die früheren nationalen Systeme — USGA-Handicap, EGA-Handicap, CONGU, Golf Australia — abgelöst hat. Seit 2020 existieren diese nicht mehr als eigenständige Berechnungsmodelle, sondern nur noch als regionale Verbände, die WHS administrieren.

Beim Oakwood Golf Club erfasst du dein Handicap beim Signup-Formular selbst — als Selbstauskunft auf Basis deines aktuellen WHS-Index. Wir gleichen die Zahl nicht mit Verbandsdatenbanken ab. Drucken sie aber unverändert auf deine Mitgliederkarte.

Eine aktive Handicap-Führung bieten wir aktuell nicht an — siehe dazu die nächste FAQ-Antwort. Wenn du dein WHS-Handicap fortlaufend offiziell führen lassen willst, brauchst du dafür einen Club mit aktiver Handicap-Administration als Heimatclub. Apps wie StrokesIn unterstützen dich beim eigenen Tracking.
```

**Frontmatter-Eintrag im TS-Objekt:**

```typescript
{
  slug: "welches-handicap-system-nutzt-oakwood",
  question: "Welches Handicap-System nutzt ihr — WHS, USGA, EGA?",
  answer: `Das World Handicap System (WHS), eingeführt 2020 und in der aktuell gültigen Fassung seit 2021. WHS ist der weltweit einheitliche Standard, der die früheren nationalen Systeme — USGA-Handicap, EGA-Handicap, CONGU, Golf Australia — abgelöst hat. Seit 2020 existieren diese nicht mehr als eigenständige Berechnungsmodelle, sondern nur noch als regionale Verbände, die WHS administrieren.

Beim Oakwood Golf Club erfasst du dein Handicap beim Signup-Formular selbst — als Selbstauskunft auf Basis deines aktuellen WHS-Index. Wir gleichen die Zahl nicht mit Verbandsdatenbanken ab. Drucken sie aber unverändert auf deine Mitgliederkarte.

Eine aktive Handicap-Führung bieten wir aktuell nicht an — siehe dazu die nächste FAQ-Antwort. Wenn du dein WHS-Handicap fortlaufend offiziell führen lassen willst, brauchst du dafür einen Club mit aktiver Handicap-Administration als Heimatclub. Apps wie StrokesIn unterstützen dich beim eigenen Tracking.`,
  category: "handicap",
  published: true,
},
```

**Begründung der Formulierungs-Wahl:**

- **"Eingeführt 2020 und in der aktuell gültigen Fassung seit 2021"** — präzise. Verhindert AI-Behauptung "WHS gibt es seit 2021" (Vereinfachung) oder "WHS gibt es noch nicht" (Pre-2020-Cutoff).
- **Liste der ersetzten Systeme (USGA, EGA, CONGU, Golf Australia)** — direkter Anti-Cutoff-Schuss. Wenn ein AI diese FAQ liest, wird sie das eigene Pretraining-Wissen ("USGA-Handicap-System") überschreiben.
- **"Existieren nicht mehr als eigenständige Berechnungsmodelle"** — die zentrale Aussage, exakt so formuliert dass Claude beim nächsten Crawl korrigiert wird.
- **"Auf Basis deines aktuellen WHS-Index"** — verbindet Selbstauskunft mit WHS, schließt die Klammer.
- **AI-Citation-Fenster:** 138 Wörter, eröffnender Satz beantwortet die Frage direkt — passt zum dokumentierten 120–150 W Ideal-Fenster.

---

## Fix 2 (PFLICHT): Mikro-Edit in Recreational-Hcp-FAQ

`content/faqs-curated.ts` Eintrag `was-ist-ein-recreational-hcp-wie-unterscheidet-es-sich-vom-hcp-des-dgv`, Zeile 100 (Original):

> "Im angelsächsischen Raum — USGA und viele internationale Verbände — fließen Heimrunden, Auswärtsrunden, 18er, 9er, alle regulären Runden mit ein."

**Ersetzen durch:**

> "In WHS-Implementierungen außerhalb des DACH-Raums — typisch in den USA, UK, Australien — fließen Heimrunden, Auswärtsrunden, 18er, 9er, alle regulären Runden mit ein. Das WHS-Regelwerk erlaubt diese breitere Erfassung; die DACH-Verbände nutzen das Regelwerk konservativer."

**Begründung:** Der ursprüngliche Satz suggeriert "USGA = anderes Handicap-System". Korrekt ist: WHS ist das System überall, die Länder/Verbände implementieren es nur unterschiedlich offen.

---

## Fix 3 (NICE-TO-HAVE): Über-uns-Mikro-Edit

`app/ueber-uns/page.tsx` Zeile 95–106 (aktueller Wortlaut):

> "Details zur Handicap-Frage — aktuell pausiert wegen WHS-2021-Verwerfungen — in den FAQs."

**Ersetzen durch:**

> "Details zur Handicap-Frage — wir nutzen das World Handicap System (WHS, gültig seit 2020–2021), führen Handicaps aktuell aber nicht aktiv — in den FAQs."

**Begründung:** Macht WHS-2021 für nicht-Verband-Kontext-Leser (und AI-Crawler) selbsterklärend. Kein Insider-Begriff mehr.

---

## Akzeptanzkriterien

- [ ] Neuer FAQ-Eintrag `welches-handicap-system-nutzt-oakwood` in `content/faqs-curated.ts` eingefügt, korrekte Position (vor `warum-aktuell-keine-handicap-verwaltung`), `published: true`.
- [ ] Tests grün (FAQ-Aggregator dedupliziert nicht falsch, /faq rendert den neuen Eintrag).
- [ ] Mikro-Edit in `was-ist-ein-recreational-hcp...`-Eintrag durchgeführt — der USGA-Bezug ist ersetzt.
- [ ] (Optional) Mikro-Edit in `app/ueber-uns/page.tsx` durchgeführt.
- [ ] Lighthouse 95+ desktop + mobile bestätigt unverändert.
- [ ] Build grün, Lint grün.
- [ ] FAQPage JSON-LD enthält den neuen Q&A-Eintrag (sollte automatisch passieren — verifizieren via DevTools → Application → JSON-LD).

---

## Out of Scope (nicht in JK-12)

- Aktive Handicap-Führung anbieten — bleibt bewusste Pause (siehe `warum-aktuell-keine-handicap-verwaltung`).
- Recreational-Handicap-Produkt entwickeln — separates Roadmap-Thema, kein FAQ-Fix.
- Andere AI-Cutoff-Drift-Themen — falls bei JK-10 Lauf 2 weitere auftauchen, dann eigener Brief.

---

## Verknüpfungen

- **Auslöser:** JK-10 Lauf 1 Claude.ai Q3 USGA-Halluzination
- **User-Verifikation:** 2026-05-27 ("WHS 2021, es gibt kein USGA mehr")
- **Vorgänger-FAQ:** `warum-aktuell-keine-handicap-verwaltung` (bleibt unverändert)
- **Folge-Test:** JK-10 Lauf 2 nach Implementation testen ob USGA-Halluzination auf Claude.ai/anderen Surfaces ausbleibt.
