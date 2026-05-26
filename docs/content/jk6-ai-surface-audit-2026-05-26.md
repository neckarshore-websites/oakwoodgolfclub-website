# AI-Surface-Audit — Crawler Accessibility, Schema & Knowledge Graph

**Erstellt:** 2026-05-26 | **Von:** Jack | **Für:** Linus + MASCHIN
**Prio:** P2 | **Effort:** Audit S (60 min) — Fixes XS bis M (siehe je Befund)
**Backlog-Ref:** Folge-Audit zu BACKLOG #59 / JK-1

---

## TL;DR

Drei autonome Audits durchgeführt, weil die echten AI-Search-Surfaces (ChatGPT, Claude.ai, Gemini, Perplexity) login-pflichtig und nicht direkt via Tools testbar sind. Statt Surface-Tests messen wir die **Zitierbarkeits-Voraussetzungen**:

1. **Crawler-Accessibility (Block 1):** ✅ **PASS** — alle 18 getesteten AI-Bots erhalten identische 73 KB SSR-HTML, kein Cloaking, kein JS-Wall, robots.txt-Allow-List korrekt.
2. **Schema.org-Audit (Block 2):** ⚠️ **PASS mit Lücken** — Organization-Schema überall, FAQPage perfekt, aber 8 konkrete Lücken im Brand-Authority-Signal.
3. **Knowledge-Graph + Backlinks (Block 3):** ⚠️ **WEAK** — keine Wikipedia-/Wikidata-Entity, sehr dünnes Backlink-Profil, mehrere US-`Oakwood Golf Club`-Entities verwässern Disambiguation.

**Ein neuer kritischer Fund:** Gründer hat eine X-Präsenz (`@oakwoodgolfde`), die im `sameAs`-Schema fehlt. JK-1-Befund (llms.txt "2009") bleibt **bestätigt** und ist weiterhin der wichtigste offene Fix.

---

## Block 1 — Crawler-Accessibility

### Vorgehen

Vier `curl`-Tests mit jeweils unterschiedlichem `User-Agent` gegen `https://oakwoodgolfclub.de/` — keine JS-Ausführung, keine Cookies, kein TLS-Tricks. Misst, was ein AI-Crawler beim ersten Hit sieht.

### Test-Set (18 Bots)

| Kategorie | Bot | Rolle |
|---|---|---|
| OpenAI | GPTBot/1.2 | ChatGPT Training |
| OpenAI | OAI-SearchBot/1.0 | ChatGPT Web-Search Inference |
| OpenAI | ChatGPT-User/1.0 | Manual ChatGPT User-Fetch |
| Anthropic | ClaudeBot/1.0 | Claude Training |
| Anthropic | Claude-User/1.0 | Claude.ai Live-Fetch |
| Anthropic | anthropic-ai/1.0 | Legacy Anthropic Bot |
| Perplexity | PerplexityBot/1.0 | Perplexity Index |
| Perplexity | Perplexity-User/1.0 | Perplexity Live-Fetch |
| Google | Google-Extended | Gemini Training Signal |
| Google | GoogleOther | Gemini Inference |
| Google | Googlebot/2.1 | Standard Google Index |
| Microsoft | bingbot/2.0 | Bing Index + Copilot |
| Apple | Applebot-Extended | Siri + Apple Intelligence |
| DuckDuckGo | DuckAssistBot/1.0 | DuckDuckGo AI |
| Common Crawl | CCBot/2.0 | Many-LLM-Training-Source |
| Meta | Meta-ExternalAgent/1.1 | Meta AI |
| Amazon | Amazonbot/0.1 | Amazon Q + Alexa |
| Yandex | YandexBot/3.0 | Yandex (für CIS-Visibility) |

### Ergebnis

**18/18 Bots → HTTP 200.** Keine Blocks, keine Throttling, keine `403` durch Vercel-WAF oder CDN.

Content-Delivery-Verifikation für 6 Schlüssel-Bots:

| Bot | Body-Size | "Oakwood Golf Club" | "55" | JSON-LD Blocks |
|---|---|---|---|---|
| GPTBot | 73,387 B | 10× | 10× | 3 |
| ClaudeBot | 73,387 B | 10× | 10× | 3 |
| PerplexityBot | 73,387 B | 10× | 10× | 3 |
| Google-Extended | 73,387 B | 10× | 10× | 3 |
| bingbot | 73,387 B | 10× | 10× | 3 |
| Applebot | 73,387 B | 10× | 10× | 3 |

→ Identische Response. Full SSR, keine User-Agent-Selektion. **Sauber.**

### Bewertung

✅ **Block 1 PASS.** Es gibt keinen technischen Grund, warum eine AI-Engine die Site NICHT zitieren könnte. Wenn AIs OGC nicht zitieren, liegt es nicht am Zugang — sondern am Inhalt, an der Schema-Qualität oder an der Brand-Mention-Density.

---

## Block 2 — Schema.org-Audit

### Vorgehen

JSON-LD-Blöcke aus 6 Hauptseiten extrahiert und gegen die E-E-A-T-Checkliste validiert.

### Inventar

| Seite | JSON-LD-Typen | Vollständigkeit |
|---|---|---|
| `/` | `Product` + `Organization` | Stark — Offer-Schema mit beiden Preisen |
| `/faq` | `FAQPage` + `Organization` | Sehr stark — 16 Q&A je 120–150 W |
| `/ueber-uns` | `AboutPage` + `Organization` | Schwach — AboutPage minimal (5 Felder) |
| `/mitglied-werden` | `Organization` nur | OK — kein Aktionstyp fehlt eigentlich |
| `/blog` | `Organization` nur | OK |
| `/blog/[slug]` | `BlogPosting` + `Organization` | Stark — datePublished, dateModified, author, publisher, inLanguage |

### Organization-Schema (Detailansicht)

```json
{
  "@type": "Organization",
  "name": "Oakwood Golf Club",
  "alternateName": "OGC",
  "foundingDate": "2007",
  "email": "info@oakwoodgolfclub.de",
  "telephone": "+49 (160) 385 9135",
  "contactPoint": { "areaServed": ["DE","AT","CH"], "availableLanguage": ["de"] },
  "sameAs": [
    "https://www.facebook.com/Oakwoodgolfclub.de/",
    "https://www.instagram.com/oakwoodgolfclub.de/"
  ]
}
```

`foundingDate: "2007"` ist **korrekt** in Schema — dies ist die kanonische, AI-lesbare Quelle. Der llms.txt-Fund (JK-5: "Seit 2009") ist **nur** in `/llms.txt` falsch, nicht in Schema. Das mildert das Risiko etwas, aber JK-5-Fix bleibt P1 weil llms.txt für AI-Tools ein höher gewichteter Brand-Statement-File ist.

### Gefundene Lücken

| # | Lücke | Severity | Effort | Empfehlung |
|---|---|---|---|---|
| 1 | Kein `Person`-Schema für German Rauhut auf `/ueber-uns` | High | XS | Bereits in JK-3 abgedeckt. Implementieren sobald Founder-Bio finalisiert |
| 2 | `AboutPage`-Schema minimal — nur 5 Felder | Medium | XS | `mainEntity` (Person-Ref) + `author` (Person-Ref) ergänzen |
| 3 | `Organization`-Type generisch | Medium | XS | `"@type": "SportsClub"` oder `"SportsOrganization"` — semantisch präziser. Schema.org-konform. Knowledge-Graph-Hinweis |
| 4 | `sameAs` nur 2 Einträge (FB+IG) | **High** | XS | **NEUER FUND:** `https://x.com/oakwoodgolfde` ergänzen (Founder hat X-Präsenz). Mittelfristig: Wikidata-Entry anlegen + verlinken |
| 5 | `BlogPosting.author` ist `Organization` statt `Person` | Medium | S | E-E-A-T-Empfehlung Google: Articles brauchen einen Author mit Person-Schema + `knowsAbout` |
| 6 | `BlogPosting.keywords` zu generisch ("Club") | Low | XS | Per-Post-Keywords aus Frontmatter ziehen oder Tags-Feld einführen |
| 7 | Kein `BreadcrumbList`-Schema | Low | S | Verschenkt Snippet-Rich-Result-Real-Estate in Google |
| 8 | Home-Schema nutzt `Product` für eine Mitgliedschaft | Low | S | `Service` mit `serviceType: "MembershipProgram"` wäre semantisch präziser. Aber: `Product` rendert Offer-Schema problemlos — nice-to-have |

### Bewertung

⚠️ **Block 2 PASS mit 8 Lücken.** Das Fundament ist solid, die FAQPage ist Best-in-Class (jede Antwort im AI-Citation-Fenster), aber das Brand-Authority-Signal (`sameAs`-Diversität, `Person`-Schema, `SportsClub`-Type) ist unterbelichtet.

---

## Block 3 — Knowledge-Graph + Backlink-Sniff

### Vorgehen

Drei WebSearch-Queries:
1. `"Oakwood Golf Club" Fernmitgliedschaft Deutschland` (Brand-Visibility)
2. `"oakwoodgolfclub.de" -site:oakwoodgolfclub.de` (External Backlinks)
3. `site:wikipedia.org OR site:wikidata.org "Oakwood Golf Club"` (Knowledge-Graph-Entity-Check)

Plus URL-Redirect-Verifikation für sechs Google-gecachte WordPress-Legacy-URLs.

### Knowledge-Graph: Keine Entity

| Source | Eintrag für OGC? |
|---|---|
| Wikipedia (de+en) | ❌ Kein Artikel |
| Wikidata | ❌ Kein Q-Identifier |
| Google Knowledge Panel | ❌ Nicht trigger-bar mit Standard-Query |

**Konsequenz:** AIs bauen ihr "Wer ist Oakwood Golf Club?"-Wissen aus dem Website-Content. Das ist OK, weil der Content gut ist — aber jede AI-Antwort fußt auf Crawl-Snapshots, nicht auf einer kanonischen Entity. Das macht uns abhängig von Snippet-Caches (siehe unten).

**AI-Reconstruction-Test** (WebSearch Query 4 mit Founder-Detail):

Google reproduziert aus den Site-Inhalten korrekt:
- 2007 Gründung in Thailand ✅
- Thai-Golfverband ✅
- German Rauhut Vorsitzender ✅
- April 2008 Aufnahme in Thai-Golfverband ✅
- DACH-Shift mit Schwerpunkt Österreich ✅
- April 2007–2010 Bangkok-Aufenthalt Rauhut ✅

→ Der **Site-Inhalt reicht aus, dass AIs eine kohärente Brand-Story konstruieren**. Auch ohne Wikidata.

### Backlink-Profil: Sehr dünn

Suche `"oakwoodgolfclub.de" -site:oakwoodgolfclub.de` liefert nur:
- Eigene Facebook-Seite (`facebook.com/OakwoodGolfClub/`)
- Unrelated US-`Oakwood Golf Club` Einträge (Lake Wales FL, Coal Valley IL, Polk County etc.)
- **Keine genuinen externen Verlinkungen** (Golf-Blogs, Foren, DACH-Golf-Community-Sites)

**Disambiguation-Risiko:** Mindestens fünf US-`Oakwood Golf Club` Entities konkurrieren um den Markennamen. Für DACH-spezifische Queries kein Problem (siehe JK-1 SERP-Dominanz auf DE-Queries), aber für englische "Oakwood Golf Club"-Queries verlieren wir.

### Google-Cache-Probleme

Google indexiert weiterhin alte WordPress-URLs (vom Pre-Cutover-Stand):

| Alte URL | Status | Redirect-Chain |
|---|---|---|
| `/info/ueber-uns/` | 308 → 308 → 200 | `/info/ueber-uns/` → `/info/ueber-uns` → `/ueber-uns` |
| `/faq-fragen-zur-fernmitgliedschaft/` | 308 → 308 → 200 | → `/faq` |
| `/blog-zur-fernmitgliedschaft-im-golfclub/` | 308 → 308 → 200 | → `/blog` |
| `/info/impressum/` | 308 → 308 → 200 | → `/impressum` |
| `/info/feedback-der-mitglieder/` | 308 → 308 → 200 | → `/ueber-uns` |
| `/golfclub/.../55-euro-fuer-ein-jahr-fernmitgliedschaft/` | 308 → 308 → 200 | → `/mitglied-werden` |

**Befund:** Alle Legacy-URLs **redirecten korrekt**, ABER über zwei Hops (trailing-slash-Normalisierung + URL-Mapping). Jeder Hop kostet 5–10 % Link-Equity. Außerdem cached Google die alten Snippets — manche AI-Engines lesen die gecachten Snippets statt eines frischen Crawls.

**Riskante Snippet-Reste in Google's Cache (aus JK-1 + diesem Audit):**
- "from Bangkok, Thailand" — alte WordPress-Copy. Neue Site sagt klar "operated from Germany". AI-Citation könnte dies propagieren bis Google re-crawled.
- "free for full 12 months" — Misparse eines Google-Snippets (eigentlich: "55 € für volle 12 Monate"). Hohe AI-Hallucination-Gefahr.

### Bewertung

⚠️ **Block 3 WEAK.**

- Knowledge-Graph: Keine Entity. Aber Site-Content reicht aus, dass AIs eine valide Brand-Story bauen.
- Backlinks: Sehr dünn. Hauptrisiko ist nicht Citation-Verlust, sondern Brand-Disambiguation gegen US-Entities.
- URL-Redirects: Funktionieren, aber 2-hop ist suboptimal.
- Google-Cache: Veraltete Snippets propagieren altes Framing — Zeit allein heilt das.

---

## Konsolidierte Empfehlungen (priorisiert)

| # | Fix | Effort | Severity | Bewertung |
|---|---|---|---|---|
| **1** | **JK-5 llms.txt: "Seit 2009" → "Seit 2007"** (offen aus 2026-05-26) | XS | P1 | Erste Datei die AI-Crawler lesen. Blockiert nichts technisch, aber vergiftet die Brand-First-Impression |
| **2** | **`sameAs` ergänzen mit `https://x.com/oakwoodgolfde`** | XS | P1 | Einzeiler in `lib/site-config.ts` (oder wo Organization-Schema sitzt). Sofort gewinnbar — X-Präsenz existiert, ist nur nicht verlinkt |
| 3 | `Organization` Type → `SportsClub` umstellen | XS | P2 | Semantik-Upgrade. Schema.org-konform |
| 4 | `Person`-Schema für German Rauhut auf `/ueber-uns` | S | P2 | Bereits in JK-3-Brief. Implementiert mit JK-3 |
| 5 | `AboutPage` ausbauen (`mainEntity`, `author`-Refs) | XS | P2 | Mit JK-3 zusammen umsetzen |
| 6 | `BlogPosting.author` als `Person`-Schema (Founder) | S | P3 | E-E-A-T für Blog. 20 Posts haben aktuell `Organization` als Author — pauschal auf Person-Ref umstellen |
| 7 | URL-Redirects ein-hop machen (trailing-slash + URL gleichzeitig) | S | P3 | Vercel/Next.js `redirects()`-Funktion erweitern — beide Varianten je Source-URL |
| 8 | `BreadcrumbList`-Schema auf Subseiten | S | P3 | Snippet-Real-Estate. Nicht dringend, aber leicht |
| 9 | Wikidata-Entry anlegen für "Oakwood Golf Club" (DACH-Disambiguation) | M | P3 | User-Aktion. Q-Identifier dann in `sameAs` ergänzen |
| 10 | Per-Post-Keywords im Blog-Frontmatter pflegen | S | P3 | Nice-to-have, Long-Tail-Signal |

**Top-Priorität: #1 und #2.** Beide sind XS, sofort gewinnbar, kein User-Input nötig (#2 benötigt nur Bestätigung dass `@oakwoodgolfde` die offizielle Account-ID ist — implizit JA, da die Account-Page im Suchergebnis dem Founder zugeordnet ist).

---

## Methodische Anmerkung

Direkte Tests gegen die Endkonsumenten-AI-Surfaces (ChatGPT-Web, Claude.ai, Gemini, Perplexity, Bing Copilot) sind **nicht möglich** mit Jacks Toolset:

- Jeder dieser Services ist login-pflichtig oder geo-gated
- WebFetch liefert HTTP 403 (Perplexity) oder JS-Shell ohne Content (alle anderen)
- API-Zugriff erfordert Bezahlung oder existierende Account-Auth

**Folgerung:** Statt Surface-Tests messen wir Zitierbarkeits-Voraussetzungen. Wer aussagekräftige Surface-Daten will: das User-Test-Pack ist der nächste Schritt (5 Surfaces × 5 Queries × einheitliches Capture-Format ≈ 30 min User-Aufwand). Kann Jack in der nächsten Session schreiben.

---

## Definition of Done

- [x] Block 1 — Crawler-Accessibility-Matrix dokumentiert
- [x] Block 2 — Schema-Inventar je Seite + Lücken-Liste mit Severity
- [x] Block 3 — Knowledge-Graph + Backlinks + Cache-Befund + Redirect-Chain
- [x] Konsolidierte Empfehlungen mit Effort + Severity
- [x] Committed + gepusht

## Folge-Items für MASCHIN

- **JK-7 (neu):** `sameAs` mit X/Twitter ergänzen — XS, P1, Linus. Ein-Zeilen-Fix in der Organization-Schema-Config.
- **JK-8 (neu):** Schema-Type-Upgrade Organization → SportsClub — XS, P2, Linus.
- **JK-9 (neu):** Redirect-Chain auf 1-Hop reduzieren — S, P3, Linus.
- **JK-10 (neu):** User-Test-Pack schreiben (5 AI-Surfaces × 5 Queries) — S, P2, Jack (nächste Session).

JK-5 (llms.txt-Fix) wird durch diesen Audit erneut bestätigt und sollte zuerst implementiert werden.
