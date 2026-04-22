---
date: 2026-04-22
session: james-ogc-post-launch-check
agent: james
repo: oakwoodgolfclub-website
mode: read-only + passive-probes against live prod (oakwoodgolfclub.de)
commits: []
scope: post-launch security + redirect + exposure sweep (Day+1 after B14 cutover)
findings_summary:
  p1_count: 1
  p3_count: 2
  open_not_verified: 3
next_session: linus — B10 Redirect-Bug-Fix (see §FOR LINUS below)
---

# Session Report — James Post-Launch Check (Day+1)

Site ist seit 2026-04-21 live auf `oakwoodgolfclub.de`. Kein MASCHIN-Briefing im Planning-Repo vorgefunden — Post-Launch-Check autonom durchgeführt im Security- und Exposure-Scope.

**Resultat: ein launch-kritisches Finding (Redirect-Bug, SEO-Bleed), zwei Minor-Findings, sonst alles grün.**

---

## 🔴 F-PL-1 — Legacy-URL-Redirect-Bug (launch-critical)

### Symptom
Alle 59 B10-Redirects (`/<slug>/` → neue Struktur) gehen auf Prod im 404 — trotz `Done`-Status in Backlog #9 / D16.

**Reproduktion:**

```bash
$ curl -sL -o /dev/null -w "final=%{http_code} url=%{url_effective} redirects=%{num_redirects}\n" \
    https://oakwoodgolfclub.de/lieblingsclub-in-thailand/
final=404 url=https://oakwoodgolfclub.de/lieblingsclub-in-thailand redirects=1

$ curl -s -o /dev/null -w "%{http_code}\n" \
    https://oakwoodgolfclub.de/blog/lieblingsclub-in-thailand
200
```

Das Ziel ist 200, die Legacy-URL erreicht es nicht.

### Root-Cause
`lib/redirects.ts:8` enthält folgenden Kommentar (Entwickler-Annahme):

> *"Next.js automatically handles both trailing-slash and non-trailing-slash variants of the source path."*

**Diese Annahme ist für Next.js 16 mit `trailingSlash: false` (Default) falsch.** Request-Pipeline:

1. Request `/<slug>/` kommt rein
2. Next.js normalisiert Trailing-Slash **zuerst** → 308 auf `/<slug>`
3. Erst **danach** matched `redirects()` gegen die Config
4. Config hat `source: "/<slug>/"` (mit Slash) → matched nicht gegen internen Pfad `/<slug>` (ohne Slash)
5. Kein Config-Match → 404

### Scope
Alle 59 Einträge betroffen (20 Blog-Posts + 15 FAQ-Items + 24 Page-Mappings). Alle haben Trailing-Slash im `source`.

### Impact
- 16 Jahre Google-Indexierung auf WP-Slugs blutet 404 — jeder Tag kostet Ranking
- User die einen alten Link (Bookmark, externe Verweise, Social-Share) klicken, landen im 404
- Backlog #9 / D16 war als "Done" markiert — auf Prod nicht funktional

### Fix (empfohlen: Option B)

| Option | Change | Trade-off |
|---|---|---|
| A | `trailingSlash: true` in `next.config.ts` | 1 Zeile, aber ÄNDERT kanonische URL-Form der ganzen Site — Sitemap, OG-URLs, JsonLd, interne Links invalidiert. Post-Launch zu invasiv. |
| **B** | **Generator-Script + Regenerate: `source` ohne Trailing-Slash** | Minimal-invasiv. Kanonische URLs bleiben. **Empfehlung.** |
| C | Beide Varianten pro Eintrag | 118 statt 59 Einträge, doppelte Generator-Logik |

---

## 🟡 F-PL-2 — Access-Control-Allow-Origin `*` auf HTML (P3, minor)

Vercel-Default setzt `access-control-allow-origin: *` auf alle gecachten HTML-Responses. Für HTML ohne Credentials unkritisch — Browser akzeptieren Cross-Origin-Fetch des HTML-Textes, aber ohne Cookies. Server Actions haben Next.js-eigenen Same-Origin-Check (Action-Protection seit Next 14), daher kein Exploit-Pfad.

**Empfehlung:** Optional tighten via Vercel-Project-Settings oder `headers()` in `next.config.ts` — für Routes die User-spezifische Daten rendern (später Member-Portal!) sollte ACAO `same-origin` oder `null` sein. Für die jetzige Marketing-Site akzeptabel.

---

## 🟡 F-PL-3 — `/.well-known/security.txt` fehlt (P3, minor)

RFC 9116 Best Practice. Einzeiler würde Vulnerability-Reports-Channel auf Standard-Pfad öffnen. Vorschlag-Inhalt:

```
Contact: mailto:info@oakwoodgolfclub.de
Expires: 2027-04-22T00:00:00Z
Preferred-Languages: de, en
Canonical: https://oakwoodgolfclub.de/.well-known/security.txt
```

Als `public/.well-known/security.txt` deployen — Next.js serviert public/ als static.

---

## ⚪ Nicht live-verifiziert

| # | Was | Warum | Proxy |
|---|-----|-------|-------|
| 1 | F2 In-Memory Rate-Limit live | Sandbox blockt aktive POST-Probes gegen Prod-Kontakt-Form (korrekt — Shared-Prod-Infrastructure ohne User-Consent) | Code-Review vs. Prod-Deploy-ID: `dpl_8mnMDJSPzwdRMCG2d6x13GqBfuJS` contains `28aa2c5`, per 2026-04-19 Re-Scan grün |
| 2 | F4 SMTP Fail-Closed live | gleiches Thema wie #1 | selber Proxy |
| 3 | F5 CSP-Header | bewusst nicht gesetzt, User-Entscheidung P2 Post-Launch | Backlog |

Für #1 + #2: Wenn User expliziten OK für 7 gezielte POSTs an Kontakt-Form gibt, fahre ich den Live-Test. Bis dahin: Code-Review-Proxy reicht für "nicht regressioniert".

---

## 🟢 Green — verifiziert passiv

| Check | Befund |
|---|---|
| HSTS `max-age=63072000; includeSubDomains; preload` | ✅ apex + www |
| X-Frame-Options `DENY` | ✅ |
| X-Content-Type-Options `nosniff` | ✅ |
| Referrer-Policy `strict-origin-when-cross-origin` | ✅ |
| Permissions-Policy camera/mic/geo locked | ✅ |
| HTTP → HTTPS forced (308) | ✅ |
| `www.` → apex 308 | ✅ |
| TLS Let's Encrypt R12, valid bis 2026-07-20 | ✅ separate Certs für apex + www |
| `/api/test-hooks/reset-rate-limit` → 404 auf Prod | ✅ F2-Defense-in-Depth hält |
| `.env` / `.env.local` / `.env.production` / `.git/config` / `.git/HEAD` | ✅ alle 404 |
| `/wp-login.php` / `/xmlrpc.php` | ✅ 403 (Vercel WP-attack-surface-block) |
| HTML-Scan auf Secret-Patterns (sk_, pk_, AKIA, AIza, Bearer) | ✅ 0 Treffer |
| `npm audit` | ✅ 0 vulnerabilities |
| `robots.txt` + `sitemap.xml` + `llms.txt` | ✅ live, Disallow `/api/` korrekt |

---

## FOR LINUS — Ready-to-paste Task-Briefing

**Task:** Fix B10 Legacy-URL-Redirect-Bug (F-PL-1). Option B: Generator-Script anpassen + regenerate.

**Files to touch:**

1. **`scripts/generate-redirects.py`** — beim Aufbau jedes `RedirectEntry` den Trailing-Slash am Ende des `source`-Strings abschneiden. Pseudo-Diff:
   ```python
   # before writing the source field:
   source = source.rstrip("/") or "/"
   ```
   Fallback `or "/"` fängt Edge-Case ab, falls `source` nur "/" wäre.

2. **`lib/redirects.ts:7-9`** — Kommentar korrigieren:
   ```diff
   - * Consumed by next.config.ts → async redirects(). All entries are
   - * permanent (308) by default. Next.js automatically handles both
   - * trailing-slash and non-trailing-slash variants of the source path.
   + * Consumed by next.config.ts → async redirects(). All entries are
   + * permanent (308) by default. Sources MUST be written without
   + * trailing slash — Next.js 16 (default trailingSlash: false)
   + * normalizes trailing slashes BEFORE the redirects() config is
   + * consulted, so "/foo/" as source would never match.
   ```

3. **`lib/redirects.ts`** — via Script regenerieren. 59 Einträge.

**Proof-of-Fix (Red-Green):**

Neue Playwright-Spec `tests/e2e/redirects.spec.ts` mit 3 Sample-Checks (ein Blog, ein FAQ, ein Page-Mapping):

```typescript
test("B10: legacy blog URL redirects to /blog/<slug>", async ({ page }) => {
  const res = await page.goto("/lieblingsclub-in-thailand/");
  expect(res?.status()).toBe(200);
  expect(page.url()).toContain("/blog/lieblingsclub-in-thailand");
});

test("B10: legacy FAQ URL redirects to /faq#<slug>", async ({ page }) => {
  const res = await page.goto("/faq-items/wie-funktioniert-das/");
  expect(res?.status()).toBe(200);
  expect(page.url()).toContain("/faq#wie-funktioniert-das");
});

test("B10: legacy page URL redirects to new path", async ({ page }) => {
  const res = await page.goto("/info/impressum/");
  expect(res?.status()).toBe(200);
  expect(page.url()).toContain("/impressum");
});
```

Test-First (rot) → Fix (grün). Sichert gegen zukünftige Next.js-Minor-Updates, die das Verhalten wieder drehen könnten.

**Smoke nach Deploy:**

```bash
for u in "lieblingsclub-in-thailand/" "faq-items/wie-funktioniert-das/" "info/impressum/"; do
  curl -sL -o /dev/null -w "%{http_code} → %{url_effective}\n" "https://oakwoodgolfclub.de/$u"
done
# expected: 200 on all three, final URL = new path
```

**Effort:** S (~45 min inkl. Test).

**Priorität:** P1 — jeder Tag kostet SEO-Bleed über 16 Jahre indexierte URLs.

---

## 🔧 Process Issue — Stale Baseline at Session Start

**Primary finding for MASCHIN. Methodisch wichtig, nicht nur für diese Session.**

### Was passiert ist

Mein Persona-Startup-Protokoll hat `cd && pwd && git status` gelaufen — aber **kein `git fetch`**. Ergebnis:

- Der Session-Prompt-Snapshot zeigte "clean, auf demselben Stand wie origin/main" — das war zum Session-Start bereits stale
- `git log` lokal zeigte als HEAD `040be99` (Linus-Session -h Datenschutz-Fixup)
- `origin/main` war zu dem Zeitpunkt aber bereits 10 Commits weiter — `395281f` (Custom 404-Page)
- Ich habe die gesamte erste Session-Hälfte auf 15+ Stunden veralteter Datenbasis gearbeitet

### Konkret — was ich dadurch falsch eingeordnet habe

Die ersten zwei Antworten an den User waren materially wrong im Framing. Erst nach User-Korrektur ("Wir haben gestern schon gelauncht") habe ich korrigiert. Konkret:

| # | Claim in meiner ersten Antwort | Realität (in origin/main zum Session-Start schon committed) |
|---|-------------------------------|-------------------------------------------------------------|
| 1 | "B14 DNS-Cutover gated on user-actions" | `c18ab16` — DNS-Cutover executed 2026-04-21, Site seit >12h live |
| 2 | "UA3 Visual-Acceptance auf Prod — offen, blocking" | `3241cfb` — B14-Runbook §5e signed off 2026-04-21 durch User |
| 3 | "Backlog #16 Vercel Analytics Dashboard — offen" | `9720c60` — Dashboard aktiviert 2026-04-21 |
| 4 | "4-Agent-SEO-Audit unbekannt" | `ec8410f` — Audit lief, Quick-Wins bereits geshippt |
| 5 | Nicht erwähnt, obwohl relevant | `395281f` — Custom 404-Page ("Fore!") live, 404-Routing bereits als Thema auf dem Tisch |
| 6 | Nicht erwähnt, obwohl relevant | `2cfe7b1` + `408bfb0` — GSC Domain-Property done, 43 pages discovered |
| 7 | Nicht erwähnt, obwohl relevant | `6cbfd65` — FritzBox DNS-Cache Thema bekannt + resolved |

### Was davon Verschwendung war

Die passive Security-Check-Arbeit selbst war NICHT verschwendet (Header-Scan, Exposure-Probes, TLS-Cert, npm audit müssen ohnehin gegen Live-Domain laufen und waren vorher nicht adressiert). **Der Redirect-Bug-Finding ist ebenfalls substantiell neu** — nicht gefixt in keinem der 11 neuen Commits.

**Aber:** Das Framing meiner Antworten an den User, die Priorisierungs-Empfehlungen, und die "Was gibt es zu tun"-Liste waren zu ~30 % auf stale Daten gebaut. Der User hat das sofort bemerkt und musste mich korrigieren.

### Root-Cause

Im Persona-Prompt steht "Read `session-state.md` for current tasks and ecosystem status" — das Planning-Repo-`docs/process/` ist aber leer, kein session-state da. Der Persona-Startup hat **keine Fallback-Logik** für den Fall, dass session-state fehlt. Ein `git fetch` im Target-Repo hätte den Gap geschlossen.

### Proposed Fix (für ALLE Personae, nicht nur James)

Persona-Startup erweitern, direkt nach dem `pwd && git status`:

```bash
git fetch origin main 2>/dev/null && \
  git log --oneline HEAD..origin/main -20 | head -20 && \
  echo "---lokal ahead---" && \
  git log --oneline origin/main..HEAD -5
```

Falls `HEAD..origin/main` nicht leer ist, MUSS die Persona entscheiden:
- **Option A** — Rebase lokal (`git pull --rebase origin main`) bevor irgendwas anderes passiert
- **Option B** — User fragen, ob lokaler WIP erst zu sichern ist
- **Option C** — Falls man diverged hat und nicht rebasen will: explizit als "stale fork" deklarieren und entsprechend qualifizieren

### Warum das für den ganzen Agent-Fleet gilt

OGC ist ein Multi-Agent-Repo — Linus, Sommer, James, MASCHIN committen alle auf `main` (siehe `git log --pretty=format:"%an"` der letzten 50 Commits: ausschließlich German Rauhut als Author, Claude-Varianten als Co-Author). Jede Persona, die ohne Fetch startet, arbeitet im schlimmsten Fall auf einer Basis die 12-24h veraltet ist. Das produziert:

- Phantom-Findings (bereits gefixt)
- Doppelarbeit (jemand hat schon gemacht was ich vorschlage)
- Falsche Roadmap-Einschätzungen (gated-on-Items sind längst erledigt)
- User-Reibung (User muss den Agent korrigieren statt Arbeit bekommen)

Fix ist zwei Zeilen im Persona-Startup. ROI ist hoch.

---

## FOR MASCHIN

- **PROZESS-PRIMÄR (siehe §Process Issue):** Persona-Startup-Protokoll um `git fetch` + Divergenz-Check erweitern. Gilt für alle Personae auf Multi-Agent-Repos (OGC, OMNIXIS, etc.). Ohne Fix wird der Stale-Baseline-Fehler wiederholt — diese Session war ein Beispiel, nicht die Ausnahme.
- **Session-State-Dispatch-Pfad fehlt:** Planning-Repo `~/Developer/projects/OMNIXIS-planning/docs/process/` ist leer. Persona-Briefings können aktuell nicht via Prompts-Folder laufen. Entweder Planning-Dispatch-Pfad aufbauen **oder** die Persona-Specs so anpassen, dass sie ohne session-state funktionieren (Target-Repo-`git log` + `docs/reports/` lesen als Dispatch-Fallback).
- **Backlog #9 / D16 Status falsch:** `Done` → muss auf `In Progress` oder `Rework`. Code war geshippt, aber nicht live-verifiziert — die falsche Annahme im Generator-Script ist im Build durchgerutscht. Red-Green-Test hätte das erwischt; gab's bislang nicht.
- **Post-Launch-Process-Learning:** Nach B14-DNS-Cutover braucht es einen Smoke-Sweep, der **alle** B10-Redirects gegen Prod curlt (nicht nur ein Sample). Gehört in den B14-Runbook als Post-Cutover-Gate. Hätte F-PL-1 noch gestern abend entdeckt, nicht erst heute früh.
- **Backlog updates:**
  - Neu: F-PL-1 (Redirect-Bug) → P1, Linus
  - Neu: F-PL-2 (ACAO `*` tightening) → P3, James/Linus
  - Neu: F-PL-3 (security.txt) → P3, James

---

## Follow-ups für Backlog (aus meinem Scope)

| # | Item | Prio | Effort | Wer |
|---|------|------|--------|-----|
| 1 | `security.txt` anlegen unter `public/.well-known/security.txt` (F-PL-3) | P3 | XS | James |
| 2 | ACAO `*` auf HTML tightening — Vercel-Project-Settings oder `headers()` config prüfen (F-PL-2) | P3 | S | James+Linus |
| 3 | F5 CSP-Header Post-Launch — bleibt offen, bekannt | P2 | S | James+Linus |
| 4 | B14-Runbook um Post-Cutover-Redirect-Smoke ergänzen (alle 59 Einträge via curl, nicht nur ein Sample) | P2 | XS | MASCHIN / Linus |

---

## Commit Log

- `c2bf3fb` — `docs(reports): james 2026-04-22 post-launch check — redirect-bug P1 found` (initial report)
- (this commit) — `docs(reports): james 2026-04-22 addendum — stale-baseline process issue for MASCHIN`

---

## Session Close — Easter Egg

🎵 **Song:** "Where Did You Sleep Last Night" — Leadbelly (1944), bekannter über die Nirvana-MTV-Unplugged-Version 1993.
*(Die Legacy-URLs haben 16 Jahre lang irgendwo geschlafen, und heute fragen sie: wohin? — Die Antwort darf nicht 404 sein.)*

💬 **Quote:** "A comment that claims a behavior the runtime doesn't deliver is worse than no comment at all. No comment leaves the dev alert. A wrong comment hands out a false sense of security — and that's exactly what silent-broke 59 redirects for 24 hours on a live production site."

🎨 **Poster Prompt:** Ein alter Holz-Wegweiser an einer Kreuzung auf einem leeren Fairway bei kaltem Morgenlicht. Auf einem der Pfeile steht in verblichener Serif-Schrift `/lieblingsclub-in-thailand/`. Der Pfeil zeigt auf eine leere Wiese — kein Weg, kein Ziel, nur Nebel. Am Boden daneben liegt ein neuer, frisch gestrichener Pfeil, noch nicht montiert, mit der Aufschrift `/blog/lieblingsclub-in-thailand`. Eine Arbeitshandschuh-Hand im Vordergrund greift nach dem neuen Pfeil. Textoverlay unten: "Nicht was der Kommentar sagt. Was der Router tut." Palette: Morgengrau, Fairway-Grün gedimmt, ein warmer Goldton auf dem neuen Pfeil als einziger Akzent. Stil: dokumentarische Fotografie, 35mm, Fokus auf Textur (Holzmaserung, abblätternde Farbe).
