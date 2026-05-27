# Content-Brief: AI-Surface-Monitoring via API — JK-15

**Erstellt:** 2026-05-27 | **Von:** Jack | **Für:** Linus
**Prio:** P2 | **Effort:** M (1–2 Tage Setup, dann 0 min/Lauf)
**Backlog-Ref:** JK-15 (entstanden aus JK-10 Lauf 1 Skalierungs-Diskussion 2026-05-27)

---

## TL;DR

JK-10 Lauf 1 hat 30–45 min manuellen User-Aufwand verursacht. Skaliert nicht: ein Site-Fix ohne Mess-Schleife ist Blindflug. **Lösung:** automatisierter API-basierter Test über vier AI-Provider (Anthropic, OpenAI, Google, Perplexity) mit Web-Search-Tool-Aufruf, GitHub-Actions-Cron, Markdown-Report ins Repo. Kosten: **~0,50–1,00 USD pro Lauf**, ~4 USD/Monat bei wöchentlicher Frequenz.

**Wichtig:** API-Test ist **Trend-Detektor, nicht Surface-Ersatz**. Personalisierung (Gemini-Geo-Lookup), Account-Memory und Surface-Layer-A/B-Tests laufen nur in der UI. Manueller Quartals-Surface-Test (mit Capture-Helper) bleibt Goldstandard. JK-15 ergänzt, ersetzt nicht.

---

## Warum dieser Brief

**Skalierungs-Problem JK-10:** Manueller Surface-Test = 30–45 min User-Aufwand pro Lauf. Bei vier geplanten Site-Fixes (JK-11/12/13 + weitere) braucht jede Wirkungs-Validierung einen kompletten Re-Test. User hat zu Recht in der Diskussion (2026-05-27) gefragt: "Statt über Oberflächen zu gehen, könnt ihr doch wahrscheinlich über API testen, oder?"

**Antwort:** Ja, aber mit klar definierten Grenzen.

### Was die APIs 2026 liefern

| Provider | API-Endpoint + Search-Tool | Surface-Reproduktion |
|---|---|---|
| Anthropic | Messages API + `web_search` Tool (GA seit Mai 2025) | ≈ 75% |
| OpenAI | Responses API mit `web_search` Tool, oder `gpt-4o-search-preview`-Modell | ≈ 80% |
| Google | Gemini API + `google_search_retrieval` Grounding | ≈ 80% |
| Perplexity | Sonar API (Standard — Web-Search ist Default) | ≈ 95% |
| Microsoft / Bing | Nur via Azure OpenAI + Bing-Search-Tool — kein direkter Copilot-Endpoint | ≈ 60% — **out of scope v1** |

### Was die API NICHT reproduziert

- **Geo-Personalisierung** — Gemini Q2 hat in JK-10 Lauf 1 die OGC-Stuttgart-Adresse als "in deiner Nachbarschaft" gezeigt. API ist stateless, kein Geo.
- **Account-Memory** — ChatGPT/Claude.ai-Memory-Features sind nicht über die API zugänglich.
- **System-Prompt** — Surfaces haben proprietäre System-Prompts. Wir kennen sie nicht.
- **Search-Backend-Aufbereitung** — ChatGPT.com macht Snippet-Re-Ranking, das die API-Search-Tool-Variante nicht 1:1 nachstellt.
- **Free-Tier-Modell-Wahl** — 95% der Endnutzer sehen kleinere Modelle. API testet typischerweise das stärkste verfügbare.

### Rolle im Test-Portfolio

| Test-Typ | Frequenz | Rolle | Aufwand pro Lauf |
|---|---|---|---|
| **API-Test (JK-15, automatisiert)** | Wöchentlich | Trend-Detektor: "haben wir Regression nach Deploy?" | 0 min Mensch, ~1 USD |
| **Surface-Test (JK-10 manuell)** | Quartalsweise | Goldstandard: "was sehen reale Endnutzer?" | ~10 min mit Capture-Helper |

---

## Architektur

### Datei-Struktur

```
tests/ai-surface/
  queries.ts                 # 5 OGC-Queries als Konstanten
  ground-truth.ts            # Fakten + Halluzinations-Watchlist
  providers/
    anthropic.ts             # Claude + web_search Tool
    openai.ts                # gpt-4o + web_search Tool
    google.ts                # Gemini + grounding
    perplexity.ts            # Sonar (Search ist Default)
    types.ts                 # gemeinsame Interfaces
  score.ts                   # Auto-Score gegen Ground-Truth
  report.ts                  # Markdown-Report-Generator
  run.ts                     # Orchestrator-Entrypoint
.github/workflows/
  ai-surface-monitor.yml     # Cron: Montag 06:00 UTC
docs/reports/ai-surface/
  YYYY-MM-DD-monitoring.md   # Lauf-Reports
  YYYY-MM-DD-raw.json        # Roh-Daten für Diff
```

### Query-Definition (`queries.ts`)

```typescript
export const QUERIES = [
  { id: "Q1", text: "oakwood golf auto renewal", fact: "no-auto-renewal" },
  { id: "Q2", text: "oakwood mitgliedschaft kuendigen", fact: "formless-cancellation-money-back" },
  { id: "Q3", text: "oakwood fernmitgliedschaft oegv", fact: "thai-background-95pct-austria" },
  { id: "Q4", text: "oakwood handicap verwaltung", fact: "whs-2021-self-reported" },
  { id: "Q5", text: "oakwood mitglied werden", fact: "price-55-143-eur" },
] as const;
```

Identisch zu JK-10 Lauf 1. Konstante eingefroren — Veränderungen brechen die Trend-Vergleichbarkeit.

### Ground-Truth (`ground-truth.ts`)

```typescript
export const FACTS = {
  mentionsOgcDomain: { match: /oakwoodgolfclub\.de/i, requiredFor: "all" },
  foundedYear2007: { match: /2007/, requiredFor: "all", critical: true },
  dachFocus: { match: /\b(DACH|Deutschland|Österreich|Stuttgart)\b/i, requiredFor: "all" },
  memberCountAprox300: { match: /\b(300|rund 300|ca\. 300)\b/, requiredFor: "Q1,Q5" },
  noAutoRenewal: { match: /kein (Auto-Renewal|automatische Verlängerung)/i, requiredFor: "Q1" },
  formlessCancellation: { match: /(formlos|keine Kündigung nötig)/i, requiredFor: "Q2" },
  moneyBackGuarantee: { match: /Geld[\s-]?zurück/i, requiredFor: "Q2,Q5" },
  thaiBackground: { match: /(thailändisch|Thailand)/i, requiredFor: "Q3" },
  acceptance95pctAustria: { match: /95\s?%/i, requiredFor: "Q3,Q5" },
  whs2021: { match: /\bWHS\b|World Handicap System/i, requiredFor: "Q4" },
  price55: { match: /55\s?(€|EUR|Euro)/i, requiredFor: "Q3,Q5" },
  price143: { match: /143\s?(€|EUR|Euro)/i, requiredFor: "Q5" },
};

export const HALLUCINATIONS = {
  bangkokOperated: { match: /(from Bangkok|in Thailand operated|aus Thailand betrieben)/i, severity: "high" },
  freeMembership: { match: /(free for 12 months|kostenlos|free membership)/i, severity: "high" },
  founded2009: { match: /\b(seit|since|founded) 2009\b/i, severity: "high" },
  usgaStandard: { match: /\bUSGA[-\s]?(Standard|Handicap|System)\b/i, severity: "medium" },
};
```

**Hinweis:** Halluzinations-Liste wird mit jedem JK-10-Lauf erweitert (USGA wurde aus Lauf 1 ergänzt). Regex bewusst lose — false-positives akzeptabel, false-negatives kritisch.

### Provider-Adapter — Anthropic-Beispiel (`providers/anthropic.ts`)

```typescript
import Anthropic from "@anthropic-ai/sdk";
import type { ProviderResult, QueryInput } from "./types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function callAnthropic(query: QueryInput): Promise<ProviderResult> {
  const start = Date.now();
  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250929", // pin exact version for reproducibility
    max_tokens: 2048,
    tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 3 }],
    messages: [{ role: "user", content: query.text }],
  });

  const rawAnswer = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const citedUrls = extractCitations(response); // helper extracts web_search_tool_result blocks

  return {
    surface: "anthropic",
    queryId: query.id,
    rawAnswer,
    citedUrls,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    serverSearchCount: response.usage.server_tool_use?.web_search_requests ?? 0,
    durationMs: Date.now() - start,
  };
}
```

**Wichtige Disziplin:**
- **Modell-Version pinnen** (`claude-sonnet-4-5-20250929`, nicht `claude-sonnet-4-5-latest`). Sonst springt der Test bei jedem Anthropic-Modell-Update.
- **`max_uses: 3`** beim Search-Tool — Cost-Cap, verhindert dass Claude in eine Search-Loop läuft.
- **API-Key per ENV** — niemals committen.

Analog für die anderen drei Provider. OpenAI über Responses API, Google über `tools: [{ google_search_retrieval: {} }]`, Perplexity über Standard-Chat-Completions (Search ist default).

### Auto-Score (`score.ts`)

Pro Antwort:

```typescript
interface ScoredResult extends ProviderResult {
  factsReproduced: Record<string, boolean>;
  hallucinations: { name: string; severity: string; excerpt: string }[];
  rating: "pass" | "partial" | "fail" | "refused";
}

function scoreAnswer(result: ProviderResult, query: QueryInput): ScoredResult {
  if (!result.rawAnswer || result.rawAnswer.length < 50) {
    return { ...result, rating: "refused", factsReproduced: {}, hallucinations: [] };
  }

  const factsReproduced: Record<string, boolean> = {};
  for (const [key, def] of Object.entries(FACTS)) {
    if (def.requiredFor === "all" || def.requiredFor.includes(query.id)) {
      factsReproduced[key] = def.match.test(result.rawAnswer);
    }
  }

  const hallucinations = Object.entries(HALLUCINATIONS)
    .filter(([_, def]) => def.match.test(result.rawAnswer))
    .map(([name, def]) => ({
      name,
      severity: def.severity,
      excerpt: extractMatchContext(result.rawAnswer, def.match),
    }));

  const factPassRate =
    Object.values(factsReproduced).filter(Boolean).length /
    Object.values(factsReproduced).length;

  const rating =
    hallucinations.some((h) => h.severity === "high") ? "fail"
    : factPassRate < 0.5 ? "fail"
    : factPassRate < 0.85 ? "partial"
    : "pass";

  return { ...result, factsReproduced, hallucinations, rating };
}
```

**Validierung gegen JK-10 Lauf 1 (Pflicht-Akzeptanzkriterium):** Das Scoring-Modell läuft initial gegen die 20 manuell ausgewerteten Antworten aus JK-10 Lauf 1. Wenn die Auto-Scores >= 85% mit Jack's manueller Bewertung übereinstimmen → Modell validiert. Sonst Regex-Tuning vor Production-Run.

### Report-Generierung (`report.ts`)

Output-Format der `docs/reports/ai-surface/YYYY-MM-DD-monitoring.md`:

```markdown
# AI-Surface-Monitoring — YYYY-MM-DD

**Laufzeit:** Xs · **Kosten:** Y,YY USD · **Frequenz:** wöchentlich · **Trigger:** GitHub-Actions-Cron

## Summary-Matrix

|     | Q1 | Q2 | Q3 | Q4 | Q5 | Score |
|---|---|---|---|---|---|---|
| Anthropic    | ✅ | ✅ | ⚠️ | ✅ | ✅ | 4.5/5 |
| OpenAI       | ✅ | ✅ | ✅ | ⚠️ | ✅ | 4.5/5 |
| Google       | ✅ | ✅ | ✅ | ✅ | ❌ | 4/5 |
| Perplexity   | ❌ | ❌ | ✅ | ❌ | ✅ | 2/5 |

## Drift gegen Vorlauf (YYYY-MM-DD)

- Anthropic Q3 NEU ⚠️ (war ✅) — siehe Halluzinations-Befund #1
- Google Q5 unverändert ❌ — Disambiguation-Defekt persistent

## Halluzinations-Befunde

### #1 — usgaStandard (medium) — Anthropic Q3
Excerpt: "...nach USGA/TGA-Standard, nicht nach ÖGV..."
Empfehlung: JK-12 prüfen — sollte nach Implementation verschwinden.

## Details
[per-Query-Sektionen mit Roh-Antwort, Zitaten, Reproduktion-Checks]
```

Bei Regression (Score sinkt oder neue Halluzination): GitHub Issue automatisch erstellen mit Label `ai-surface-regression`.

### GitHub-Actions-Workflow (`.github/workflows/ai-surface-monitor.yml`)

```yaml
name: AI Surface Monitoring

on:
  schedule:
    - cron: "0 6 * * 1"  # Mondays 06:00 UTC
  workflow_dispatch:      # manual trigger

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20" }
      - run: npm ci
      - run: npm run test:ai-surface
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          GOOGLE_API_KEY: ${{ secrets.GOOGLE_API_KEY }}
          PERPLEXITY_API_KEY: ${{ secrets.PERPLEXITY_API_KEY }}
      - name: Commit report
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add docs/reports/ai-surface/
          git diff --staged --quiet || git commit -m "chore(ai-surface): weekly monitoring report"
          git push
      - name: Open issue on regression
        if: env.HAS_REGRESSION == 'true'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `AI-Surface Regression — ${new Date().toISOString().slice(0, 10)}`,
              body: require('fs').readFileSync('docs/reports/ai-surface/_latest-summary.md', 'utf8'),
              labels: ['ai-surface-regression', 'P2'],
            });
```

---

## Kosten-Überschlag

Pro Lauf: 4 Provider × 5 Queries = **20 API-Calls**

| Provider | Pricing 2026 | Per-Call-Kosten | Per-Run |
|---|---|---|---|
| Anthropic Claude Sonnet 4.5 + web_search | $3/MTok in, $15/MTok out, $10/1k searches | ~0,04 USD | ~0,20 USD |
| OpenAI gpt-4o-search-preview | ~$2,50/MTok in, $10/MTok out, search inkl. | ~0,03 USD | ~0,15 USD |
| Google Gemini 2.0 Flash + grounding | $0,10/MTok in, $0,40/MTok out, $35/1k grounded | ~0,05 USD | ~0,25 USD |
| Perplexity Sonar | $1/MTok in, $1/MTok out, $5/1k searches | ~0,02 USD | ~0,10 USD |

**Total pro Run:** ~0,70 USD
**Bei wöchentlichem Cron (52 Runs/Jahr):** ~36 USD/Jahr.

Cost-Cap-Mechanik: `max_tokens: 2048`, `max_uses: 3` pro Tool — verhindert Runaway-Loops.

---

## Akzeptanzkriterien

- [ ] Vier Provider-Adapter funktional, jeder gibt strukturiertes `ProviderResult` zurück.
- [ ] Modell-Versionen explizit gepinnt (`claude-sonnet-4-5-20250929`, `gpt-4o-search-preview-2025-XX-XX`, `gemini-2.0-flash-001`, `sonar-pro`).
- [ ] `npm run test:ai-surface` lokal lauffähig mit `.env.local`.
- [ ] **Validation-Gate:** Auto-Score gegen JK-10 Lauf 1 manuellen Befund stimmt zu ≥85% überein. Diskrepanzen dokumentiert.
- [ ] Markdown-Report wird in `docs/reports/ai-surface/YYYY-MM-DD-monitoring.md` geschrieben.
- [ ] Roh-Daten in `YYYY-MM-DD-raw.json` archiviert (für spätere Re-Analyse).
- [ ] GitHub-Actions-Workflow läuft cron-getriggert (Montag 06:00 UTC) + manuell triggerbar.
- [ ] API-Keys ausschließlich via GitHub Secrets, nicht im Code, nicht in Logs.
- [ ] Drift-Detection vs. letzten Lauf funktioniert — Diff wird im Report ausgewiesen.
- [ ] Regression öffnet automatisch GitHub Issue mit Label `ai-surface-regression`.
- [ ] Build + Lint grün.
- [ ] README-Eintrag in `tests/ai-surface/README.md` mit Bedienungsanleitung (manueller Trigger, Cost-Estimate, ToS-Hinweise).

---

## Out of Scope (nicht in JK-15 v1)

- **Bing Copilot direkter API-Test** — kein direkter Endpoint. Microsoft-Route über Azure OpenAI + Bing-Search-Tool = JK-15.1, separate Iteration.
- **Surface-Personalisierung reproduzieren** — Geo, Account-Memory, A/B-Tests. Geht prinzipiell nicht über API.
- **Sentiment/Tone-Analyse** der Antworten — JK-15 misst Fakten, nicht Ton.
- **Multi-Sprache** — DE-only v1. EN/AT-Test-Pack ist separate Frage.
- **Anti-Hallucination-Fine-Tuning** — wenn ein Provider chronisch halluziniert, ist das **deren** Problem, nicht unseres. Wir messen, nicht reparieren.
- **Replace manuellen Surface-Test** — Goldstandard bleibt JK-10 manuell. JK-15 ist Frühwarn-System, kein Ersatz.

---

## DSGVO + ToS-Disziplin

- **Queries enthalten keinen PII** — nur Brand-bezogene Phrasen. Kein DSGVO-Risiko bei Provider-Übermittlung.
- **API-Provider-ToS:** API-Nutzung ist explizit erlaubt (anders als Surface-Automation). Keine Account-Sperre-Gefahr.
- **Logs:** Reports enthalten Antwort-Snippets. Keine Personal-Daten, keine Kunden-Queries. Public-OK falls Repo public würde.
- **Rate-Limiting:** Adapter implementieren Exponential-Backoff bei 429. Wöchentlicher Cron läuft weit unter jedem Tier-Limit.

---

## Verknüpfungen

- **Auslöser:** JK-10 Lauf 1 Skalierungs-Diskussion (User-Frage 2026-05-27: "API-Test statt manuell?")
- **Synergie mit:** JK-11, JK-12, JK-13 — JK-15 misst deren Wirkung wöchentlich.
- **Synergie mit:** JK-6 Block 2 Schema-Audit — Auto-Score-Regex können später um Schema-Citation-Tests erweitert werden.
- **Folge-Item:** JK-15.1 Bing Copilot via Azure OpenAI (optional, niedrige Prio).
- **Folge-Item:** Capture-Helper für JK-10 manuell (das ursprüngliche JK-14 — bleibt im Backlog als XS-Item, nur falls JK-10 Lauf 2 zeigt dass 10 min Capture-Aufwand wirklich Reibung sind).
- **Roadmap-Hook:** Falls JK-15 stabil läuft → Public-Dashboard-Idee (oakwoodgolfclub.de/ai-monitoring) als Trust-Signal. Eigenes Item, nicht hier.
