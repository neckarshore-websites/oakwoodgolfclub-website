---
date: 2026-04-19
session: james-ogc-security-rescan
agent: james
repo: oakwoodgolfclub-website
mode: read-only
scope: verify F1-F4 fixes on commit 28aa2c5 (no new deep scan)
commits: []
roadmap_updates:
  - security-gate-b14-cutover: GREEN
decisions:
  - F1 Autoresponder-Recap removed across all 3 templates — PASS
  - F2 In-Memory Rate-Limit correctly wired in all 3 server actions — PASS
  - F3 Captcha Feature-Flag + fail-closed on enabled+unconfigured Prod — PASS
  - F4 SMTP fail-closed in Prod + PII-free dev log — PASS
next_session: Dr. Sommer Compliance Re-Scan (H1-H5/M1-M3/L1-L3 on commit 44b1f64) — out of James' scope
---

# Session Report: James OGC — Security Re-Scan (F1-F4)

## Verdict

| # | Finding | File:Line-Pointer | Gate |
|---|---------|-------------------|------|
| 1 | F1 Autoresponder-Recap removed | `lib/email/templates.ts:323-347, 349-372, 374-398` | ✅ |
| 2 | F2 In-Memory Rate-Limit | `lib/ratelimit.ts:45-62` + `app/kontakt/actions.ts:71-81`, `app/mitglied-werden/actions.ts:64-74`, `app/mitgliedschaft-verlaengern/actions.ts:64-74` | ✅ |
| 3 | F3 Captcha Fail-Closed + Feature-Flag | `lib/captcha/verify.ts:55-80` + `components/forms/FriendlyCaptcha.tsx:33, 38, 62, 67` | ✅ |
| 4 | F4 SMTP Fail-Closed + PII-Log-Kill | `lib/email/send.ts:36-57, 94-109` | ✅ |
| 5 | Kollateral-Scan | — | clean |

**Security-Gate für B14 Cutover:** 🟢 **GREEN**

Alle 4 HIGH-Findings aus dem Original-Sweep (2026-04-19) sind in Commit `28aa2c5` sauber geschlossen. Kein neues Finding im Kollateral-Scan. B14 DNS-Cutover ist aus Security-Sicht unblocked.

---

## Pro Finding — detaillierter Review

### F1 — Autoresponder-Recap entfernt ✅

**Was gefordert war:** Der User-Echo-Block ("Übersicht deiner Anfrage") musste aus allen 3 Autoresponder-Templates raus. Ein Angreifer hätte sonst über die DKIM-signierte OGC-Domain beliebige Inhalte an beliebige Opfer ausliefern lassen können (Phishing-Amplifier).

**Was ich gesehen habe:**

- `composeContactAutoresponse` (`lib/email/templates.ts:323-347`): kein Recap-Block, kein `"Übersicht deiner Anfrage:"`-String, kein `field()`/`multilineField()`-Echo der User-Eingaben. Nur neutrale OGC-Copy ("danke für deine Nachricht", "wir melden uns zeitnah"), plus Signatur und Footer. Inline-Kommentar dokumentiert F1.
- `composeSignupAutoresponse` (`lib/email/templates.ts:349-372`): identisches Muster. Salutation-Lookup, Referral-Lookup und Recap-Zusammenbau sind komplett entfernt (siehe Diff `28aa2c5 -- lib/email/templates.ts`).
- `composeRenewalAutoresponse` (`lib/email/templates.ts:374-398`): identisches Muster.
- Helper-Funktionen `field`, `multilineField`, `defangFormData`, `SALUTATION_LABEL`, `REFERRAL_LABEL`, `formatAddress`, `formatStartDate`, `rawDataBlock` bleiben in Verwendung durch die Notification-Templates (`composeContactEmail`/`composeSignupEmail`/`composeRenewalEmail`). **Kein Dead-Code**, Lint bleibt grün.

**Restrisiko — minor, akzeptiert:**

Die Autoresponder begrüßen den User mit `` `Hallo ${data.name},\n\n` `` (`templates.ts:334, 357, 382`). `data.name` ist bereits durch `defangFormData()` geroutet, d.h. Control-Chars, Zero-Width-Chars und Prompt-Injection-Marker sind entschärft. Zusammen mit fehlendem Message-/Email-/Consent-Echo ist die Phishing-Amplifier-Exploitation nicht mehr praktikabel (max. ein kurzer String im Greeting, keine URL, kein Call-to-Action). Kein Blocker.

---

### F2 — In-Memory Rate-Limit ✅

**Was gefordert war:** Spam-Schutz vor Form-Submits (5/h pro IP, forms-übergreifend), da Launch ohne Captcha.

**Was ich gesehen habe:**

- `lib/ratelimit.ts:32` — `const store = new Map<string, RateLimitEntry>()` im Modul-Scope (Singleton pro Fluid-Compute-Instanz). ✅
- `lib/ratelimit.ts:34-35` — `DEFAULT_MAX = 5`, `DEFAULT_WINDOW_MS = 3_600_000` (= 1 h). ✅
- `lib/ratelimit.ts:45-62` — `checkRateLimit(key, max, windowMs)` mit Lazy-TTL-Reset: abgelaufene Einträge werden bei Neuzugriff durch `store.set(key, {...})` überschrieben (L53-55). Bei `entry.count >= max` → `return false`, sonst `entry.count += 1`. ✅
- `__resetRateLimitForTests()` (`ratelimit.ts:68-70`) — Test-Utility, sauberer Export-Namensraum (`__`-Präfix signalisiert "nicht für Prod"). ✅
- IP-Source in allen 3 Actions: `` (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon" `` — Fallback `"anon"` wenn Header fehlt. Kein NPE-Risiko. ✅
- Key-Schema: `` `form:${ip}` `` in allen 3 Actions — pro-IP, forms-aggregiert wie spezifiziert. ✅
- Call-Order in allen 3 Actions: Schema-Parse → Honeypot → Captcha-Verify → **Rate-Limit → `sendFormEmail`**. Rate-Limit kommt VOR `sendFormEmail` wie im Briefing gefordert. Inline-Kommentar dokumentiert, dass es bewusst NACH Validation liegt ("damit wir legitime Form-Errors nicht gegen das Budget zählen") — guter Trade-off. ✅
- Return-Shape: `{ ok: false, status: "server-error", message: "Zu viele Anfragen …", values: raw, submitCount: nextSubmitCount }` — passt zum bestehenden `FormStatus`-Panel. ✅
- Trade-off "Map überlebt Redeploy nicht" ist im Datei-Header explizit dokumentiert (`ratelimit.ts:18-28`). Akzeptiert als User-Decision D2.

**Minor observation (nicht Blocker):** Die Map löscht abgelaufene Einträge nur bei erneutem Zugriff auf denselben Key (Lazy-Reset). IPs, die genau einmal submitten und nie wiederkommen, lassen ihren Eintrag bis zum Prozess-Restart liegen. Für 300 Members + ~10-50 Submits/Woche irrelevant. Siehe Follow-ups.

---

### F3 — Captcha Feature-Flag + Fail-Closed ✅

**Was gefordert war:** Captcha-Verifikation nur aktiv wenn Flag gesetzt; bei aktivem Flag + fehlenden Keys in Prod fail-closed; Client-Widget rendert nichts wenn Flag aus (kein SDK-Import, kein Bundle-Impact).

**Was ich gesehen habe:**

Server (`lib/captcha/verify.ts`):
- L55 — `const captchaEnabled = process.env.CAPTCHA_ENABLED === "true"` — strikter `=== "true"` Check wie spezifiziert. unset/`""`/`"false"`/alles andere → Flag aus. ✅
- L56-58 — Flag off → `return { ok: true, skipped: true }` (short-circuit vor jedem Key-Check oder Netzaufruf). ✅
- L65-75 — Flag ON + `!apiKey || !sitekey` + `NODE_ENV === "production"` → `return { ok: false, reason: "verification-failed", detail: "captcha-not-configured" }`. **Fail-closed in Prod.** ✅
- L76-80 — Flag ON + Keys missing + NICHT production → graceful log + `{ ok: true, skipped: true }` (Dev/Preview-Komfort). ✅
- L82-83 — Flag ON + Keys OK + leere `solution` → `{ ok: false, reason: "missing-solution" }`. ✅
- L86-100 — `fetch` mit `AbortSignal.timeout(5000)` gegen hängende Upstream-Requests. Good defensive coding. ✅

Client (`components/forms/FriendlyCaptcha.tsx`):
- L33 — `const captchaEnabled = process.env.NEXT_PUBLIC_CAPTCHA_ENABLED === "true"` — strikter Check, client-side. ✅
- L38 — `if (!captchaEnabled || !sitekey || !mountRef.current) return;` early-return im `useEffect`, BEVOR `await import("@friendlycaptcha/sdk")` läuft. Kein SDK-Import wenn Flag aus → kein Bundle-Impact. ✅
- L62 — `useEffect`-Dependency-Array: `[captchaEnabled, sitekey]`. Enthält den Flag wie spezifiziert. ✅
- L67 — `if (!captchaEnabled || !sitekey) return null;` — Komponente rendert nichts. Keine DOM-Footprint. ✅

**Launch-Config akzeptiert:** Beide Envs (`CAPTCHA_ENABLED`, `NEXT_PUBLIC_CAPTCHA_ENABLED`) bleiben beim B14-Cutover UNGESETZT → Captcha ist off. Spam-Schutz kommt aus F2 Rate-Limit. Das ist User-Entscheidung, kein Security-Issue.

---

### F4 — SMTP Fail-Closed + PII-Log-Kill ✅

**Was gefordert war:** Kein Silent-Success wenn SMTP in Prod unkonfiguriert; Dev-Fallback-Log darf KEINE PII (Body, Name, Email, Recipient) enthalten.

**Was ich gesehen habe:**

`sendFormEmail` (`lib/email/send.ts:30-72`):
- L36-51 — `if (!config || !transporter)`:
  - L46-51 — `NODE_ENV === "production"` → `console.error(...refusing to accept submit...)` + `return { ok: false, reason: "no-smtp" }`. **Fail-closed in Prod.** ✅
  - L52-56 — Dev-Fallback: `console.warn("... dev-only fallback (body suppressed).")` + `console.info("[email/send] subject:", composition.subject)`. **NUR das Subject, keine PII, kein Body.** ✅
- L60-66 — Transport-Call setzt `from: config.from`, `to: config.to` (fix, nicht User-Eingabe), `replyTo: composition.replyTo`, `subject`, `text` — korrekt.
- L69 — `console.error("[email/send] SMTP failure:", error)` — der Fehler landet server-side, aber keine Form-Daten.

`sendAutoresponse` (`lib/email/send.ts:87-124`):
- L94-109 — gleiches Muster:
  - L98-103 — Prod + fehlende Config → `{ ok: false, reason: "no-smtp" }`. ✅
  - L104-108 — Dev-Fallback: `console.warn("... dev-only fallback (body + recipient suppressed).")` + `console.info("[email/autoresponse] subject:", composition.subject)`. **Der User-`to:` (PII!) wird NICHT geloggt.** ✅
- L112-118 — Transport-Call loggt nichts.
- L121 — SMTP-Failure logged den Error, nicht die Composition.

**Beide Funktionen abgedeckt.** Grundprinzip ist konsistent durchgezogen.

---

## Kollateral-Scan (Commit 28aa2c5, non-F1-F4 Änderungen)

**Diff reviewed:** 8 Files, 195 insertions, 77 deletions. Alle Änderungen lassen sich eindeutig einem der 4 Findings zuordnen. Keine "bei der Gelegenheit"-Änderungen, die Security-relevant wären.

Spot-Checks:
- Keine neuen `console.log`-Aufrufe mit Form-Daten.
- Keine neuen `process.env.*`-Zugriffe ohne Default / ohne Explicit-String-Compare.
- Keine Stack-Traces, die client-seitig oder an die Form-Response bubble'n.
- Rate-Limit-Response-Message nennt `info@oakwoodgolfclub.de` — das ist öffentliche Inbox-Adresse, kein Leak.
- Keine neuen Dependencies in diesem Commit (siehe `git show --stat`: 8 Files, davon 0 `package*.json`).

**Kollateral-Scan: nichts auffälliges.**

---

## Follow-ups für Backlog

| # | Item | Prio | Effort | Wer | Status | Impact |
|---|------|------|--------|-----|--------|--------|
| 1 | **F5 CSP-Header** — Content-Security-Policy bleibt offen. Post-Launch P2 per User-Entscheidung, bereits bekannt. | P2 | S | Linus | Offen | Header-basierter XSS-Mitigation-Layer on-top der React-Default-Escape. |
| 2 | **Upstash Sliding-Window** — In-Memory-Rate-Limit bei Multi-Region nicht mehr adäquat (Map pro Region). Für OGC aktuell irrelevant, aber Backlog wenn Scale-Out kommt. | P3 | M | Linus | Offen | Region-übergreifend konsistente Limits, überlebt Redeploy. |
| 3 | **Rate-Limit GC für IPs ohne Re-Submit** — Lazy-Reset räumt nur Keys auf, die erneut adressiert werden. Ein Long-Running-Prozess mit vielen Einmal-Submittern akkumuliert Einträge. Für 300-Member-Traffic irrelevant, wäre ein `setInterval`-Sweep oder LRU-Cap (z.B. `lru-cache`-Wrapper) fix. | Backlog | XS | Linus | Offen | Memory-Hygiene bei sehr hohem Einmal-IP-Traffic. |
| 4 | **Captcha-Re-Activation-Playbook** — Wenn Phase 2 Captcha wieder an soll, dokumentieren welche 2 Envs + welche Friendly-Captcha-Credentials in welcher Reihenfolge zu setzen sind, plus `CAPTCHA_FORM_FIELD` vs. SDK-Default-Check. | Backlog | XS | Jack / Linus | Offen | Saubere Re-Aktivierung ohne überraschenden Fail-Closed auf Prod. |

---

## FOR MASCHIN

- **Security-Gate B14 Cutover:** 🟢 GREEN. Aus meiner Sicht unblocked.
- **Session-State-Propagation:** F1/F2/F3/F4 in `docs/process/session-state.md` als **Done** markieren (Linus Commit `28aa2c5`, verifiziert 2026-04-19 James Re-Scan).
- **Backlog-Einträge:** 4 Follow-ups oben (F5 CSP war schon bekannt, die anderen 3 sind neu/minor).
- **Nicht in meinem Scope:** Compliance-Fixes aus `44b1f64` (H2/H3/H4/H5/M1/M2/M3/L1/L2/L3). Die gehen an Dr. Sommer.
- **Pre-Cutover offene User-Gates (aus meiner Sicht):** Rechtsschutzversicherung, DPA Friendly Captcha (wenn je aktiviert), Stripe-Setup-Status, Resend/IONOS-SMTP-Creds in Prod-Env.

---

## Session Close

🎵 **Song:** "Welcome to the Machine" — Pink Floyd, Wish You Were Here (1975). Der Song handelt von einem System, das User-Input verarbeitet, ohne je wirklich zu antworten. F4 hat genau das beerdigt: kein Silent-Success mehr, wenn das System nichts an den Empfänger weiterreicht.

💬 **Quote:** "Fail-closed in Prod, honest-log in Dev — das ist keine Komplexität, das ist ein Grundprinzip. Linus hat's in einem Commit durchgezogen. Vier Findings, vier Treffer, null Regressions."

🎨 **Poster Prompt:** Nahaufnahme einer Server-Rack-Tür aus gebürstetem Stahl, halb geöffnet. Im Spalt ein rotes LED-Display: `SMTP: NO-CONFIG | RESPONSE: ok=false`. Dahinter ein einzelner Ethernet-Port, dunkel, unbelegt. Im Vordergrund, leicht unscharf, eine Hand in schwarzem Handschuh zieht sich von der Tür zurück — der Angreifer hat das Silent-Success-Loch gesucht und nichts gefunden. Keine Explosion, kein Alarm. Nur eine Tür, die nicht aufgeht, weil die Config nicht da ist. Licht: kühles Rechenzentrum-Blau plus das rote LED-Display als einziger Warmton. Stil: cinematischer Thriller-Still, 35mm, flach, keine Dramatik — die Dramatik ist die Abwesenheit von Dramatik.
