# JK-10 — User-Test-Pack: AI-Surfaces × OGC-Queries

**Status:** Fillable — User-Aufgabe
**Datum erstellt:** 2026-05-26 (Jack Session C)
**Geschätzter Aufwand:** 30–45 min
**Ziel:** Validieren, dass AI-Surfaces (nicht nur Google) OGC korrekt zitieren — das ist der Surface-Test, den JK-1 und JK-6 nicht direkt liefern konnten. JK-1 hat Google-Dominanz nachgewiesen, JK-6 hat Crawler-Zugang und Schema-Vollständigkeit verifiziert. Was fehlt: Tut die AI-Antwort am Ende auch das, was die Voraussetzungen erwarten lassen?

---

## Pre-Flight (vor dem ersten Query lesen)

1. **Neue Chat-Session pro Query.** Sonst Context-Bleed. Bei Perplexity: "New Thread". Bei ChatGPT: "+". Bei Claude.ai/Gemini: neues Gespräch. Bei Bing Copilot: "Neues Thema". **Wichtigste einzelne Disziplinregel.**
2. **Account-Tier:** anonym / Free wo möglich (das sehen 95% der echten Nutzer). Wenn nur Plus/Pro verfügbar: in jeder Cell unter "Surface-Modus" notieren.
3. **Search-Modus aktiv** — sonst antwortet das Modell aus Training-Cutoff statt aus aktuellem Crawl, und der Test misst das Falsche:
   - **ChatGPT:** Search-Toggle (Globus-Icon) muss an sein. Oder das Modell explizit per "search the web for…" zwingen.
   - **Claude.ai:** Web-Search-Tool muss aktiviert sein (Settings → Tools → Web search).
   - **Gemini:** macht Search standardmäßig — keine Action.
   - **Perplexity:** macht Search standardmäßig — keine Action.
   - **Bing Copilot:** macht Search standardmäßig — keine Action.
4. **Reihenfolge:** Perplexity zuerst (zitiert Quellen am explizitesten → gut zum Kalibrieren), dann ChatGPT → Claude.ai → Gemini → Bing Copilot. **Eine Surface komplett (alle 5 Queries) bevor zur nächsten gewechselt wird.**
5. **Sprache:** Antworten auf Deutsch erwarten. Falls eine Surface auf Englisch antwortet: unter "UI-Sprache" notieren — das ist selbst ein Befund.

---

## Hallucination-Watchlist (gezielt auf diese 3 Halluzinationen achten)

Aus JK-6 Block 3 sind diese Cache-Halluzinationen mit hoher Wahrscheinlichkeit zu erwarten:

| Halluzination | Korrekt | Bedeutung wenn sie auftritt |
|---|---|---|
| "from Bangkok, Thailand" / "in Thailand operated" | Gegründet 2007 in Thailand, **betrieben aus Deutschland seit Jahren** | Google-Cache vergiftet noch andere Surfaces |
| "free for 12 months" / "kostenlos" / "free membership" | 55 EUR/Jahr (143 EUR/Flight) | Schwerwiegender Funnel-Fehler — Surface verliert Trust |
| "Seit 2009" / "founded 2009" / "since 2009" | Seit 2007 | Bestätigt llms.txt-Drift-Hypothese (JK-5 P1-Fix-Begründung) |

Wenn eine dieser drei auftritt: in der Cell unter "Halluzinationen" wortgetreu zitieren + Quelle vermerken (falls die Surface eine zitiert).

---

## Summary-Matrix (am Ende ausfüllen — Quickread für Jack)

Skala: ✅ = OGC korrekt + zitiert · ⚠️ = teilweise korrekt oder fehlende Zitation · ❌ = falsch oder OGC gar nicht erwähnt · ➖ = Surface verweigert Antwort

|     | Q1 auto renewal | Q2 kündigen | Q3 ÖGV / Thai | Q4 handicap | Q5 mitglied werden |
|---|---|---|---|---|---|
| **Perplexity**    |   |   |   |   |   |
| **ChatGPT**       |   |   |   |   |   |
| **Claude.ai**     |   |   |   |   |   |
| **Gemini**        |   |   |   |   |   |
| **Bing Copilot**  |   |   |   |   |   |

---

## Capture-Template (für jede Cell)

```
- Datum/Zeit:
- Surface-Modus: [Free / Plus / Pro / Search-on / Search-off]
- UI-Sprache der Antwort: [DE / EN]
- Antwort (verbatim copy-paste, ungekürzt):

- Zitierte URLs:

- Reproduzierte Facts (✅/❌):
  - [ ] oakwoodgolfclub.de als Quelle genannt
  - [ ] Gründung 2007 (NICHT 2009)
  - [ ] DACH-Fokus / Betrieb aus Deutschland
  - [ ] ~300 aktive Mitglieder
  - [ ] [query-spezifischer Fact, siehe Cell]
- Halluzinationen: [keine / wortgetreu zitieren falls vorhanden]
- Quickrating: ✅ / ⚠️ / ❌
```

---

## Die 5 Queries (exakt so eingeben — Copy-Paste, kein Reformat)

| # | Query (verbatim) | Query-spezifischer Fact |
|---|---|---|
| Q1 | `oakwood golf auto renewal` | Kein Auto-Renewal — formfreie manuelle Verlängerung |
| Q2 | `oakwood mitgliedschaft kuendigen` | Formfreie Kündigung + Geld-zurück-Garantie |
| Q3 | `oakwood fernmitgliedschaft oegv` | Thai-Golfverband-Hintergrund + ~95% Akzeptanz in Österreich |
| Q4 | `oakwood handicap verwaltung` | WHS-2021-konform |
| Q5 | `oakwood mitglied werden` | 55 EUR Einzelmitgliedschaft (143 EUR Flight) |

---

# Captures

## Surface 1: Perplexity

### Perplexity · Q1: "oakwood golf auto renewal"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] Kein Auto-Renewal — manuelle Verlängerung
- Halluzinationen:
- Quickrating:

### Perplexity · Q2: "oakwood mitgliedschaft kuendigen"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] Formfreie Kündigung + Geld-zurück-Garantie
- Halluzinationen:
- Quickrating:

### Perplexity · Q3: "oakwood fernmitgliedschaft oegv"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] Thai-Golfverband-Hintergrund + ~95% Akzeptanz Österreich
- Halluzinationen:
- Quickrating:

### Perplexity · Q4: "oakwood handicap verwaltung"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] WHS-2021-konform
- Halluzinationen:
- Quickrating:

### Perplexity · Q5: "oakwood mitglied werden"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] 55 EUR Einzel (143 EUR Flight)
- Halluzinationen:
- Quickrating:

---

## Surface 2: ChatGPT

### ChatGPT · Q1: "oakwood golf auto renewal"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] Kein Auto-Renewal — manuelle Verlängerung
- Halluzinationen:
- Quickrating:

### ChatGPT · Q2: "oakwood mitgliedschaft kuendigen"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] Formfreie Kündigung + Geld-zurück-Garantie
- Halluzinationen:
- Quickrating:

### ChatGPT · Q3: "oakwood fernmitgliedschaft oegv"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] Thai-Golfverband-Hintergrund + ~95% Akzeptanz Österreich
- Halluzinationen:
- Quickrating:

### ChatGPT · Q4: "oakwood handicap verwaltung"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] WHS-2021-konform
- Halluzinationen:
- Quickrating:

### ChatGPT · Q5: "oakwood mitglied werden"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] 55 EUR Einzel (143 EUR Flight)
- Halluzinationen:
- Quickrating:

---

## Surface 3: Claude.ai

### Claude.ai · Q1: "oakwood golf auto renewal"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] Kein Auto-Renewal — manuelle Verlängerung
- Halluzinationen:
- Quickrating:

### Claude.ai · Q2: "oakwood mitgliedschaft kuendigen"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] Formfreie Kündigung + Geld-zurück-Garantie
- Halluzinationen:
- Quickrating:

### Claude.ai · Q3: "oakwood fernmitgliedschaft oegv"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] Thai-Golfverband-Hintergrund + ~95% Akzeptanz Österreich
- Halluzinationen:
- Quickrating:

### Claude.ai · Q4: "oakwood handicap verwaltung"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] WHS-2021-konform
- Halluzinationen:
- Quickrating:

### Claude.ai · Q5: "oakwood mitglied werden"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] 55 EUR Einzel (143 EUR Flight)
- Halluzinationen:
- Quickrating:

---

## Surface 4: Gemini

### Gemini · Q1: "oakwood golf auto renewal"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] Kein Auto-Renewal — manuelle Verlängerung
- Halluzinationen:
- Quickrating:

### Gemini · Q2: "oakwood mitgliedschaft kuendigen"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] Formfreie Kündigung + Geld-zurück-Garantie
- Halluzinationen:
- Quickrating:

### Gemini · Q3: "oakwood fernmitgliedschaft oegv"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] Thai-Golfverband-Hintergrund + ~95% Akzeptanz Österreich
- Halluzinationen:
- Quickrating:

### Gemini · Q4: "oakwood handicap verwaltung"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] WHS-2021-konform
- Halluzinationen:
- Quickrating:

### Gemini · Q5: "oakwood mitglied werden"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] 55 EUR Einzel (143 EUR Flight)
- Halluzinationen:
- Quickrating:

---

## Surface 5: Bing Copilot

### Bing Copilot · Q1: "oakwood golf auto renewal"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] Kein Auto-Renewal — manuelle Verlängerung
- Halluzinationen:
- Quickrating:

### Bing Copilot · Q2: "oakwood mitgliedschaft kuendigen"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] Formfreie Kündigung + Geld-zurück-Garantie
- Halluzinationen:
- Quickrating:

### Bing Copilot · Q3: "oakwood fernmitgliedschaft oegv"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] Thai-Golfverband-Hintergrund + ~95% Akzeptanz Österreich
- Halluzinationen:
- Quickrating:

### Bing Copilot · Q4: "oakwood handicap verwaltung"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] WHS-2021-konform
- Halluzinationen:
- Quickrating:

### Bing Copilot · Q5: "oakwood mitglied werden"
- Datum/Zeit:
- Surface-Modus:
- UI-Sprache der Antwort:
- Antwort (verbatim):

- Zitierte URLs:

- Reproduzierte Facts:
  - [ ] oakwoodgolfclub.de als Quelle
  - [ ] Gründung 2007
  - [ ] DACH-Fokus
  - [ ] ~300 Mitglieder
  - [ ] 55 EUR Einzel (143 EUR Flight)
- Halluzinationen:
- Quickrating:

---

## Nach dem Test — User-Aktion

1. Summary-Matrix oben ausfüllen (eine Markierung pro Cell).
2. Datei committen oder als Diff an Jack zurückgeben.
3. Jack analysiert in Folge-Session: Welche Surface ist am weitesten weg von Ground Truth? Welche Halluzination tritt wo auf? Welche Fix-Reihenfolge ergibt sich? Daraus → JK-11ff Backlog-Items.

**Wenn eine Halluzination aus der Watchlist auftritt:** Das ist nicht nur ein Test-Befund — es ist eine konkrete Site-Fix-Begründung. Beispiel: jedes "Seit 2009" auf irgendeiner Surface bestätigt JK-5 (llms.txt-Fix) als P1.

**Wenn eine Surface gar nicht über OGC antwortet ("nicht gefunden"):** wertvoller Datenpunkt — heißt der Crawler kommt zwar an (JK-6 bestätigt), aber das Modell hat die Seite nicht im Index der relevanten Embedding-Schicht. Disambiguations-Risiko (US-Clubs gleichen Namens) ist die wahrscheinlichste Erklärung.
