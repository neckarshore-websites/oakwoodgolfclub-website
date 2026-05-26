# Content-Brief: /ueber-uns — JK-3 AI-Citation-Pass

**Erstellt:** 2026-05-26 | **Von:** Jack | **Für:** Linus
**Prio:** P2 | **Effort:** S (1 Session, kein neuer Code — reine Content-Edits)
**Backlog-Ref:** BACKLOG #60 / JK-3

---

## Warum dieser Brief

JK-1 (AI-Citation-Impact-Check, 2026-05-26) hat zwei Lücken auf der `/ueber-uns`-Seite identifiziert:

1. **Kein Named Founder** — war explizites SEO-Must-Have in `phase-1-plan.md` (Zeile 101). E-E-A-T braucht einen echten Namen hinter dem Club.
2. **Sektionen zu kurz** — Geschichte ~180 W, Differenzierer ~150 W, Footer ~80 W. AI-Crawler extrahieren Passagen ab ~120 Wörtern als zitierfähige Einheit. Einige Abschnitte sind darunter.

User-Freigabe: **German Rauhut** als Founder-Name darf verwendet werden. ✅

---

## Aktuelle Seiten-Struktur (Stand 2026-05-26)

Die Seite hat bereits guten Inhalt. Kein Rewrite — nur Ergänzungen:

- Heading: "Ein Golfclub für Spieler ohne Heimatplatz."
- Opening: Club seit 2007, DACH-Region, ~300 Mitglieder
- Sektion "Die Geschichte": Gründung 2007 Thailand, Thai-Golfverband, Betrieb Deutschland
- Sektion "Was uns anders macht": Keine Warteliste, 55 EUR, kein Auto-Renewal, Geld-zurück-Garantie
- Stats-Block: Gegründet 2007 / Mitglieder 300+ / Hauptmarkt DACH / Betrieb Deutschland

---

## Gewünschte Änderungen

### 1. Named-Founder-Block hinzufügen (NEU — nach "Die Geschichte", vor "Was uns anders macht")

Neue Sektion mit H2 oder prominentem Inline-Block. Exakter Copy-Vorschlag:

---

**Hinter dem Club: German Rauhut**

Der Oakwood Golf Club ist das Projekt von German Rauhut, einem passionierten Golfer aus Stuttgart. Er hat den Club 2007 in Bangkok gegründet — ursprünglich als Lösung für ein persönliches Problem: Golfen auf Reisen ohne den bürokratischen Overhead einer klassischen Clubmitgliedschaft. Was als Nischenlösung für Vielreisende begann, ist heute eine der bekanntesten Fernmitgliedschaften im deutschsprachigen Raum mit rund 300 aktiven Mitgliedern. German betreibt den Club nebenbei, mit dem Anspruch, dass jede Mitglieder-Interaktion so unkompliziert ist wie das Spiel selbst.

---

**Zielwort-Count:** 110–130 Wörter. (Kann auf 120–150 W ausgebaut werden wenn User weitere Bio-Details freigibt — Beruf, Golf-Handicap, bevorzugte Plätze. Fragt bei Bedarf nach.)

**Platzierung:** Direkt nach der Geschichte-Sektion, vor den Differenzierern. Kein Foto nötig (aber wenn User ein Bild hat: perfekt — BACKLOG #3 wäre damit auch abgedeckt).

---

### 2. "Die Geschichte"-Sektion ausbauen (EDIT — ~+40 Wörter)

Aktuelle Sektion ist ~180 W — nah am Ziel, aber der Einstiegssatz ist zu kurz um als eigenständige AI-Citation-Passage zu stehen. Ergänzung am Ende der Sektion:

Vorschlag (nach dem letzten bestehenden Satz einfügen):

> Der Club ist heute vollständig auf digitale Infrastruktur umgestellt — Anmeldung, Verlängerung und Karten-Versand laufen online, die Mitgliederkarte kommt einmal pro Woche per Post. Die Gründungs-DNA aus Thailand ist in der Mitgliederkarte sichtbar: Sie trägt das Logo des Thailändischen Golfverbands — ein Erkennungszeichen, das auf fast allen österreichischen Plätzen als Clubnachweis akzeptiert wird.

**Ziel:** ~220–230 W gesamt für diese Sektion.

---

### 3. "Was uns anders macht"-Sektion: Geld-zurück-Garantie prominenter (EDIT — minimal)

Aktuell: Geld-zurück-Garantie taucht auf, aber ohne die konkreten Zahlen die im FAQ stehen. Einen Satz ergänzen:

> In über 18 Jahren haben wir die Garantie viermal eingelöst. Das ist unsere Definition von "ohne Wenn und Aber".

**Ziel:** Gleiche Wort-Count, aber der Satz verankert die Garantie mit konkreten Fakten — AI-Citation-ready.

---

## JSON-LD-Ergänzung (optional, aber empfohlen)

Falls nicht bereits vorhanden: `Person`-Schema für German Rauhut auf der Ueber-uns-Seite ergänzen:

```json
{
  "@type": "Person",
  "name": "German Rauhut",
  "jobTitle": "Gründer",
  "worksFor": {
    "@type": "SportsOrganization",
    "name": "Oakwood Golf Club",
    "url": "https://oakwoodgolfclub.de"
  }
}
```

Dies stärkt das E-E-A-T-Signal für AI-Tools die Schema.org auswerten (Google, Bing).

---

## Definition of Done (für Linus)

- [ ] Named-Founder-Block live auf `/ueber-uns`
- [ ] Geschichte-Sektion ≥ 200 W
- [ ] Geld-zurück-Satz mit konkreten Zahlen vorhanden
- [ ] Lighthouse 95+ unverändert (reine Text-Edits, kein Performance-Impact erwartet)
- [ ] Build + Lint grün
- [ ] Committed + gepusht

---

## Offene Frage an User (vor Linus-Start klären)

- Gibt es ein Foto von German Rauhut das für die Seite verwendet werden darf? (Optional — stärkt E-E-A-T enorm)
- Soll der Founder-Block mit "German Rauhut" namentlich oder als "Gründer German Rauhut" eingeführt werden?
- Beruf/weitere Bio-Details freigegeben? (z.B. Stuttgarter Unternehmer, Golf-Handicap, Lieblingsplatz) — macht den Block authentischer
