---
date: 2026-04-19
session: dr-sommer-ogc-compliance-rescan
agent: dr-sommer
mode: dpo / read-only
repo: oakwoodgolfclub-website
scope: verify H1-H6 / M1-M3 / L1-L3 fixes on commit 44b1f64 (no new deep scan)
commits: []
roadmap_updates:
  - compliance-gate-b14-cutover: GREEN (Code-Scope) — User-Actions H6 + DPA-Sigs separat
decisions:
  - H1 Friendly-Captcha §6-Eintrag — N/A (Captcha disabled, kein aktiver Subprocessor)
  - H2 §6 Zweiteilung Art. 28 / Art. 4 Nr. 7 — PASS (saubere 6.1/6.2 Hierarchie, h3→h4 korrekt)
  - H3 ContactForm Consent → Acknowledgment — PASS (Wortlaut, Datamodell unverändert)
  - H4+M2 Microsoft-Abschnitt + Copilot-Einbettung — PASS (Broken-Ref weg, Wording korrekt)
  - H5 Startdatum +14d — PASS (Schema, Default, AGB §7 — § 356 BGB-Falle geschlossen)
  - H6 Anthropic Zero-Retention — out of code scope, awaiting User-Console-Verifikation
  - M1 Apple in §6.2 — PASS (Art. 4 Nr. 7 wortgleich, kein AV)
  - M3 Speicherdauer-Policy — PASS (5 strukturierte Retention-Perioden mit Rechtsgrundlagen)
  - L1 IP-Formulierung — PASS (Wortlaut wie spezifiziert)
  - L2 DSB-TODO → Entscheidungs-Kommentar — PASS (§ 38 BDSG-Begründung dokumentiert)
  - L3 AGB-Wording — PASS ("nachfolgende Muster-Widerrufsformular")
  - Drift-Stichprobe — 2 Folge-Findings (1× LOW Code-Comment, 1× MED Form-Wording asymmetrisch)
next_session: User-Action H6 (Anthropic Console) + DPA-Sigs (Vercel/IONOS/Microsoft/Anthropic) → Cutover-Freigabe komplett
---

# Session Report: Dr. Sommer OGC — Compliance Re-Scan (H-M-L)

Read-Only-Verifikation der Linus-Fixes aus Commit `44b1f64` ("compliance(ogc): H2/H3/H4/H5/M1/M2/M3/L1/L2/L3 pre-launch fixes") gegen den Original-Compliance-Sweep vom 2026-04-19. Kein neuer Deep-Scan, kein Code-Change im OGC-Repo. Reine Verifikation gegen Briefing `dr-sommer-ogc-compliance-rescan.md` + die User-Decisions D1/D3/D4/D5/D6.

## Verdict-Matrix

| # | ID | Finding | File:Line | Status |
|---|----|---------|-----------|--------|
| 1 | H1 | Friendly Captcha §6-Eintrag | `app/datenschutz/page.tsx` (gesamtes §6) | ✅ N/A — Captcha disabled, kein aktiver Subprocessor |
| 2 | H2 | §6 Zweiteilung Art. 28 / Art. 4 Nr. 7 | `app/datenschutz/page.tsx:264-458` | ✅ PASS |
| 3 | H3 | ContactForm Consent → Acknowledgment | `components/forms/ContactForm.tsx:80-93` | ✅ PASS |
| 4 | H4 | Microsoft-Abschnitt + Broken-Ref | `app/datenschutz/page.tsx:303-340` | ✅ PASS |
| 5 | H5 | Startdatum +14d (Schema + Default + AGB) | `lib/forms/schemas.ts:104-116`, `components/forms/SignupForm.tsx:47-54, 127`, `app/agb/page.tsx:200-205` | ✅ PASS |
| 6 | H6 | Anthropic Zero-Retention | (Anthropic Admin Console) | ⏳ awaiting User-Action |
| 7 | M1 | Apple in §6.2 Art. 4 Nr. 7 | `app/datenschutz/page.tsx:435-458` | ✅ PASS |
| 8 | M2 | Copilot-Einbettung unter Microsoft | `app/datenschutz/page.tsx:315-325` | ✅ PASS (kombiniert mit H4) |
| 9 | M3 | Speicherdauer-Policy strukturiert | `app/datenschutz/page.tsx:233-262` | ✅ PASS |
| 10 | L1 | IP-Formulierung gestrafft | `app/datenschutz/page.tsx:113-114` | ✅ PASS |
| 11 | L2 | DSB-TODO → Entscheidungs-Kommentar | `app/datenschutz/page.tsx:98-101` | ✅ PASS |
| 12 | L3 | AGB-Wording "nachfolgende Muster-…" | `app/agb/page.tsx:224-225` | ✅ PASS |

**Compliance-Gate für B14 Cutover (Code-Scope):** 🟢 **GREEN**

Alle 11 verifizierbaren Code-Findings sauber geschlossen. H6 ist sauber als User-Action getrennt (Console-Setting bei Anthropic, außerhalb dieses Repos). Die Drift-Stichprobe hat 2 Folge-Findings produziert (1× LOW Code-Comment, 1× MED Form-Wording-Asymmetrie) — beide sind **NICHT Cutover-Blocker**, gehen ins Backlog.

> **Important:** GREEN gilt nur für Code-Scope. Die Compliance-Gate-Gesamtfreigabe für B14 verlangt zusätzlich:
> - H6 Anthropic Zero-Retention Console-Screenshot (User)
> - DPA-Signaturen Vercel / IONOS / Microsoft / Anthropic (User)
> - Vercel `CAPTCHA_ENABLED` Env-Var bewusst gesetzt oder bewusst ungesetzt (User)
>
> Erst wenn diese drei User-Action-Items 🟢 sind, ist die Compliance-Seite des B14-Gates komplett.

---

## Pro Finding — detaillierter Review

### H1 — Friendly Captcha §6-Eintrag ✅ N/A

**Kontext:** Captcha ist via Feature-Flag deaktiviert (D1, Linus Session 04-19). Friendly-Captcha-Code ist im Repo für Phase 2 ready, aktiviert sich erst wenn `NEXT_PUBLIC_FRIENDLY_CAPTCHA_SITEKEY` + `FRIENDLY_CAPTCHA_API_KEY` in Vercel gesetzt sind (Graceful Degrade — siehe `app/datenschutz/page.tsx:21-23` Doc-Kommentar).

**Verifikation:** Grep `Friendly.{0,10}Captcha` auf `app/datenschutz/page.tsx`:
- Treffer ausschließlich im Doc-Kommentar Zeile 20-23 (Architektur-Wahrheit, beschreibt den Status korrekt)
- **Kein Friendly-Captcha-Eintrag im sichtbaren §6** (weder in 6.1 noch 6.2)

**Verdict:** Korrekt — kein aktiver Auftragsverarbeiter, also kein §6-Eintrag nötig. Re-evaluieren beim Phase-2-Re-Aktivieren via Feature-Flag (Backlog: "Phase-2 Captcha-Aktivierung — Datenschutz §6.1 Eintrag ergänzen").

---

### H2 — §6 Zweiteilung Art. 28 / Art. 4 Nr. 7 ✅ PASS

**Verifikation `app/datenschutz/page.tsx`:**

1. **Einleitender Absatz** (Zeile 264-274) erklärt beide Rollen klar: Auftragsverarbeiter (Art. 28) ↔ eigenverantwortliche Empfänger (Art. 4 Nr. 7). Sprache verständlich (kein Juristen-Kauderwelsch).

2. **§6.1 Auftragsverarbeiter (h3, Zeile 276)** — vier h4-Firmen:
   - Vercel Inc. (Hosting + Web Analytics) — Zeile 283
   - IONOS SE (E-Mail-Versand) — Zeile 292
   - Microsoft Corporation (CRM via Outlook) — Zeile 303
   - Anthropic PBC (KI-Assistenz für internen Workflow) — Zeile 342

3. **§6.2 Eigenverantwortliche Empfänger (h3, Zeile 385)** — zwei h4-Firmen:
   - PayPal (Europe) S.à r.l. et Cie, S.C.A. — Zeile 393
   - Apple Inc. — Apple Intelligence (OS-Funktion) — Zeile 435

4. **Hierarchie-Konsistenz:** Alle Firmen-Einträge sind h4 unter den 6.x-h3-Headings (semantisch sauber, screen-reader-tauglich, SEO-tauglich).

**Decision-Match D5 + D6:** PayPal explizit als eigenverantwortlicher Empfänger (D5) + §6-Heading-Hierarchie h2→h3→h4 (D6) — beides erfüllt.

---

### H3 — ContactForm Consent → Acknowledgment ✅ PASS

**Verifikation `components/forms/ContactForm.tsx:80-93`:**

```tsx
<ConsentField
  name="consent"
  defaultChecked={values.consent === "on"}
  error={errors.consent}
>
  Ich habe die{" "}
  <Link href="/datenschutz" …>Datenschutzerklärung</Link>{" "}
  zur Kenntnis genommen.
</ConsentField>
```

- **Wortlaut:** "Ich habe die Datenschutzerklärung zur Kenntnis genommen." — exakt wie im Briefing spezifiziert. Kein "Ich willige ein" mehr.
- **Datamodell unverändert:** `consent === "on"` (Zeile 82). Schema in `lib/forms/schemas.ts:73-77` validiert weiterhin auf `z.literal("on")`. Server-seitige Validierung bleibt funktional.
- **Kopplungsverbots-Risiko geschlossen** (für ContactForm): keine Verquickung von Leistungs-Einwilligung mit Datenschutz-Kenntnisnahme. Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO bleibt sauber.

> **Note:** Drift-Sample hat aufgedeckt, dass die identische Wortlaut-Korrektur in `SignupForm.tsx` und `RenewalForm.tsx` **NICHT** durchgezogen wurde — siehe Drift-Finding DRIFT-1 unten. Dies war jedoch nicht im H3-Scope (Briefing nannte explizit nur ContactForm), und ist in den anderen Formularen ein anderer Rechtsgrund (Art. 6 lit. b statt lit. f).

---

### H4 + M2 — Microsoft-Abschnitt + Copilot-Einbettung ✅ PASS

**Verifikation `app/datenschutz/page.tsx:303-340`:**

1. **Copilot-Absatz lebt direkt unter "Microsoft Corporation (CRM via Outlook)"** (Zeile 315-325): physisch im selben h4-Block, nicht mehr im KI-Assistenz-Kontext.

2. **Broken-Reference WEG:** Grep `Microsoft \(E-Mail-Infrastruktur\)|E-Mail-Infrastruktur` auf der Datei → 0 Treffer. Die alte Phantom-Sektion "Microsoft (E-Mail-Infrastruktur)" existiert nicht mehr.

3. **Wording matcht User-Decision M1/M2:**
   > "Microsoft 365 Copilot ist in unserem M365-Abonnement aktiv. Wir setzen Copilot nicht gezielt für die Verarbeitung von OGC-Mitgliederdaten ein. Bei der Nutzung von Outlook in der Administrator-Umgebung kann Copilot als integrierte Assistenzfunktion eingreifen."

   Sinn-erhaltend zur Briefing-Vorgabe ("aktiv nicht gezielt eingesetzt"). Der "kann eingreifen"-Halbsatz ist wichtig — er anerkennt die operative Realität ohne aktive Prozess-Behauptung.

4. **AV-Anchor sauber:** Zeile 320-324 verweist auf "denselben Auftragsverarbeitungsvertrag wie in diesem Abschnitt 'Microsoft Corporation (CRM via Outlook)'" — Selbst-Referenz im selben h4, kein Cross-Doc-Bruch.

---

### H5 — Startdatum ≥ heute + 14 Tage ✅ PASS

**Verifikation across drei Files:**

1. **`lib/forms/schemas.ts:104-116`** — `startDateField`:
   - `minStart.setDate(minStart.getDate() + 14)` ✅
   - `maxYears.setFullYear(maxYears.getFullYear() + 5)` (Fat-Finger-Schutz) ✅
   - Error-Message: "Startdatum muss mindestens 14 Tage in der Zukunft liegen (Widerrufsfrist) und darf höchstens 5 Jahre in der Zukunft liegen." — informativ, nennt Grund.
   - **Inline-Kommentar Zeile 95-101 dokumentiert die DSGVO/§ 356 BGB-Begründung** — Audit-Trail für nachfolgende Devs ist gegeben.

2. **`components/forms/SignupForm.tsx:47-54, 127`** — `defaultStartDate()`:
   - `d.setDate(d.getDate() + 14)` ✅
   - Default ist `values.startDate ?? defaultStartDate()` (Zeile 127) — Picker zeigt nie einen Wert an, der beim Submit abgelehnt würde.
   - **Inline-Kommentar Zeile 43-46** verweist explizit auf Schema-Min ("Muss synchron zum Schema-Min bleiben") — Drift-Schutz gegeben.

3. **`app/agb/page.tsx:200-205`** — §7 Widerrufsbelehrung:
   > "Die Mitgliedschaft beginnt frühestens 14 Tage nach Vertragsschluss. Damit läuft die Widerrufsfrist regulär vor Leistungsbeginn ab — eine gesonderte Zustimmung zum vorzeitigen Leistungsbeginn im Sinne von § 356 Abs. 4 BGB ist nicht erforderlich."

   Wortlaut ist exakt im AGB §7 platziert (zwischen "Widerrufsfrist beträgt vierzehn Tage…" und der Adress-Block "Um dein Widerrufsrecht auszuüben…"), strukturell richtig.

4. **Logik-Review (Decision D3):**
   - Vertragsschluss = Tag X
   - Widerrufsfrist (14 Tage) = X bis X+14
   - Leistungsbeginn = frühestens X+14
   - **→ Widerrufsfrist endet immer VOR Leistungsbeginn**
   - **→ § 356 BGB Pre-Consent-Falle (12 Monate + 14 Tage Verlängerung) geschlossen.** Keine AGB-Vorab-Zustimmung nach § 356 nötig (was Decision D3 explizit vermeidet — Kopplungsverbots-Risiko).

---

### H6 — Anthropic Zero-Retention ⏳ awaiting User-Action

**Out of code scope.** Verifikation verlangt Screenshot des Anthropic Admin-Console-Settings ("Zero data retention" auf Org-Level enabled). Datenschutzerklärung deklariert Zero-Retention bereits korrekt (Zeile 352-357), aber die operative Wahrheit muss der User in der Console nachweisen.

**Owner:** User. **Action:** Screenshot in `omnopsis-planning/docs/process/decisions/` ablegen (oder OGC-internes Compliance-Verzeichnis), darauf in nachfolgendem Cutover-Approval-Step verweisen.

---

### M1 — Apple Intelligence aus AV-Kontext ✅ PASS

**Verifikation `app/datenschutz/page.tsx:435-458`:**

1. **Apple-Block ist NICHT mehr unter "KI-Assistenz"-h3** — die §6.1-Auftragsverarbeiter-Liste enthält Apple nicht mehr. Apple lebt jetzt in §6.2 Eigenverantwortliche Empfänger (Zeile 435 h4 unter §6.2 h3).

2. **Wording wortgleich zum Briefing** (Zeile 451-454):
   > "Apple agiert dabei als eigenverantwortlicher Anbieter einer OS-Funktion im Sinne von Art. 4 Nr. 7 DSGVO; es besteht kein Auftragsverarbeitungsverhältnis mit uns."

3. **Decision D4 erfüllt:** Apple Intelligence ist sauber als Art. 4 Nr. 7 eigenverantwortlich klassifiziert, nicht mehr fälschlich als Auftragsverarbeiter.

4. **Drittland-Konsistenz:** §7 Drittländer (Zeile 494-501) erwähnt Apple Inc., USA mit eigenständiger Apple-SCC-Begründung — keine Inkonsistenz zur §6.2-Klassifikation.

---

### M2 — Copilot-Einbettung

Kombiniert mit H4 — siehe oben. ✅ PASS.

---

### M3 — Speicherdauer-Policy strukturiert ✅ PASS

**Verifikation `app/datenschutz/page.tsx:233-262`:**

§5 hat eine strukturierte `<ul>` mit 5 konkreten Retention-Perioden, jede mit Rechtsgrundlage:

| # | Datenkategorie | Speicherdauer | Rechtsgrundlage |
|---|----------------|---------------|-----------------|
| 1 | Mitglieder-Stammdaten | Mitgliedschaft + 3 J | § 195 BGB (regelm. Verjährung) |
| 2 | Zahlungs-/Buchungsbelege | 10 J ab Kalenderjahr-Ende | § 147 Abs. 1 Nr. 4 AO + § 257 Abs. 4 HGB |
| 3 | Allgemeine Kontaktanfragen | 6 Monate nach letzter Interaktion | (impliziert: Zweckbindung Art. 5 Abs. 1 lit. e) |
| 4 | Abgelehnte Anmeldungen | 3 Monate nach Ablehnungs-Entscheidung | (impliziert: Zweckbindung) |
| 5 | Server-Logs (IP, Zugriffszeit) | wenige Tage (Vercel-Default) | (verweist auf §2 Server-Log-Block) |

**Audit-Tauglich:** Jede Position klar abgegrenzt, mit Bullet-Struktur, Pflicht-Zitate korrekt. Server-Log-Position konsistent mit §2 Wording (L1).

> **Minor Note:** Bei Kategorie 3 + 4 fehlt die explizite Zitat-Grundlage (z.B. Art. 5 Abs. 1 lit. e DSGVO Zweckbindung). Das ist juristisch entbehrlich (Speicherdauer-Begründung "nach Zweckerfüllung" ist Standard-Praxis ohne Pflicht-Artikel), aber wäre ein Backlog-P3-Verfeinerung.

---

### L1 — IP-Formulierung ✅ PASS

**Verifikation `app/datenschutz/page.tsx:113-114`:**

> "IP-Adresse (wird nur in technischen Server-Logs kurzfristig vorgehalten, siehe Speicherdauer)"

Wortlaut exakt wie im Briefing spezifiziert. Cross-Reference "siehe Speicherdauer" zeigt auf §5 Position 5 (Server-Logs) — funktional.

---

### L2 — DSB-TODO → Entscheidungs-Kommentar ✅ PASS

**Verifikation `app/datenschutz/page.tsx:98-101`:**

```tsx
{/* DSB: nicht benannt. Begründung: kein Betrieb mit 20+ Personen,
    die ständig mit automatisierter Verarbeitung personenbezogener
    Daten befasst sind (§ 38 Abs. 1 BDSG). Einzelunternehmer mit
    Admin-Workflow durch Inhaber selbst. User-bestätigt 2026-04-19. */}
```

- Kein "TODO USER-CHECK" mehr.
- § 38 BDSG-Begründung dokumentiert (Schwelle 20 Personen, Einzelunternehmer-Konstellation).
- User-Bestätigung mit Datum vermerkt — Audit-Trail.

**Audit-Tauglich.** Der Kommentar ist kein User-facing Legal Text, aber für eine spätere Aufsichts-Anfrage ("warum ist kein DSB benannt?") liefert er die Begründung sofort.

---

### L3 — AGB-Wording "nachfolgende" ✅ PASS

**Verifikation `app/agb/page.tsx:224-225`:**

> "Du kannst für den Widerruf das nachfolgende Muster-Widerrufs­formular verwenden, das jedoch nicht vorgeschrieben ist."

"nachfolgende" statt "beigefügte" — entspricht dem tatsächlichen Layout (das Muster-Formular ist physisch als §7-Sub-Heading "Muster-Widerrufsformular" Zeile 257 darunter abgedruckt, nicht in einem separaten Anhang).

---

## Drift-Stichprobe (§§ 1-5, 7-9 Datenschutz + AGB §§ 1-6, 8-15)

Read-Through der nicht direkt vom Re-Scan adressierten Sektionen, um zu prüfen, ob die H2-Umstrukturierung (§6 Zweiteilung) und der H5 AGB-§7-Eingriff Cross-Reference-Kollateral verursacht haben.

### Datenschutzerklärung Cross-References — clean

- §2 Server-Logs Zeile 107: "(siehe Abschnitt 6)" → §6.1 enthält Vercel ✅
- §2 Zeile 132-137: Speicherdauer Server-Logs konsistent zu §5 Position 5 ✅
- §5 Formulare Zeile 227: "(siehe Abschnitt 6)" → §6.1 enthält IONOS ✅
- §6.2 Apple Zeile 456: "siehe Abschnitt 7" → §7 enthält Apple-Block ✅
- §7 Drittländer (Zeile 460-502) — alle 5 Empfänger (Vercel/PayPal/Microsoft/Anthropic/Apple) sauber referenziert
- IONOS in §7 nicht enthalten — **korrekt**, IONOS ist DE-only, kein Drittland

### AGB Cross-References — clean

- §3 Vertragsschluss Zeile 122: "innerhalb der in § 5 genannten Frist" → §5 hat 14-Tage-Frist ✅
- §6 Laufzeit Zeile 186: "entsprechend § 5 fristgerecht" → §5 ✅
- §8 Geld-zurück-Garantie Zeile 285 + 312: zweimal "§ 7" referenziert → §7 Widerrufsbelehrung ✅
- **Kein Widerspruch** durch das neue §7-Wortlaut "Mitgliedschaft beginnt frühestens 14 Tage nach Vertragsschluss" zu §6 Laufzeit ("Mitgliedschaft beginnt mit dem in der Anmeldebestätigung genannten Startdatum und läuft 12 Kalendermonate") — die zwei Klauseln sind komplementär, nicht konfliktär (Startdatum ist eingeschränkt, aber dann läuft die 12-Monats-Periode normal).

**Drift-Stichprobe Datenschutz §§1-5 + 7-9 + AGB §§1-6 + 8-15: clean.**

### Aber: 2 Folge-Findings entdeckt

#### DRIFT-1 — Form-Wording-Asymmetrie SignupForm + RenewalForm (Severity: MEDIUM)

**Files:**
- `components/forms/SignupForm.tsx:222-236` (Consent-Wortlaut)
- `components/forms/RenewalForm.tsx:171-173` (identisches Wording)

**Wortlaut beider Formulare:** "Ich habe die AGB und die Datenschutzerklärung gelesen und stimme zu."

**Problem:**
- ContactForm wurde in H3 korrekt auf "zur Kenntnis genommen" umgestellt, weil die Datenschutzerklärung eine Informationsmitteilung (Art. 13 DSGVO) ist und KEINE Art. 7 Einwilligung verlangt.
- SignupForm + RenewalForm verkoppeln "AGB akzeptieren" (= aktive Vertragsannahme, Pflicht für Vertragsschluss) mit "Datenschutzerklärung gelesen" (= reine Kenntnisnahme) in einem einzigen "stimme zu"-Statement.
- Resultat: Der Nutzer kann der Datenschutzerklärung nicht "zustimmen" ohne gleichzeitig die AGB zu akzeptieren — und umgekehrt. Das ist eine echte Kopplung zweier rechtlich unterschiedlicher Akte.
- Schadensbild ist abgeschwächt, weil die tatsächliche Rechtsgrundlage für die Datenverarbeitung in beiden Fällen Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung/-durchführung) ist, NICHT lit. a (Einwilligung). Die Checkbox-Texterzeugung erzeugt also kein unwirksames Consent — sie ist nur **misleadingly worded**.

**Empfehlung (Diff-Vorschlag, Linus-Owned):**

```diff
- Ich habe die{" "}
- <Link href="/agb">AGB</Link>{" "}
- und die{" "}
- <Link href="/datenschutz">Datenschutzerklärung</Link>{" "}
- gelesen und stimme zu.
+ Ich akzeptiere die{" "}
+ <Link href="/agb">AGB</Link>{" "}
+ und habe die{" "}
+ <Link href="/datenschutz">Datenschutzerklärung</Link>{" "}
+ zur Kenntnis genommen.
```

- AGB → "akzeptiere" (aktive Vertragsannahme, korrekt für Vertragsschluss)
- Datenschutzerklärung → "zur Kenntnis genommen" (Informationsmitteilung, korrekt für Art. 13 DSGVO)
- Datamodel `consent === "on"` bleibt unverändert.

**Severity:** MEDIUM. **NICHT** Cutover-Blocker (rechtliche Wirksamkeit der Datenverarbeitung ist gegeben), aber Wording-Sauberkeit für DPO-Audit + Konsistenz mit ContactForm sollte post-launch nachgezogen werden. Owner: Linus.

#### DRIFT-2 — Stale Code-Comment Reference auf alte §6-Struktur (Severity: LOW)

**File:** `app/datenschutz/page.tsx:34`

**Aktueller Wortlaut (Doc-Kommentar oben in der Datei):**
> "Microsoft-Outlook-Umgebung. Details in §6 'KI-Assistenz'."

**Problem:** §6 hat seit der H2-Umstrukturierung keine Sub-Section mehr namens "KI-Assistenz". Stattdessen lebt Anthropic als h4 in §6.1 (Heading-Wortlaut: "Anthropic PBC (KI-Assistenz für internen Workflow)") und Apple in §6.2 (h4 "Apple Inc. — Apple Intelligence (OS-Funktion)"). Der Kommentar verweist auf eine nicht mehr existierende Struktur.

**Owner-Impact:** Nur Dev-Kommentar, NICHT user-visible Legal Text. Aber zukünftige Maintainer werden verwirrt sein.

**Empfehlung (Diff-Vorschlag, Linus-Owned):**

```diff
- *    Microsoft-Outlook-Umgebung. Details in §6 "KI-Assistenz".
+ *    Microsoft-Outlook-Umgebung. Details in §6.1 (Anthropic, Microsoft)
+ *    und §6.2 (Apple Intelligence — eigenverantwortlich).
```

**Severity:** LOW. Backlog. Nicht zeitkritisch.

---

## DPA-Coverage (Recap aus Original-Sweep — User-Action)

Diese Tabelle ist NICHT Teil meiner Re-Scan-Verifikation, dient nur als Reminder welche User-Actions zur Compliance-Gate-Komplettierung noch ausstehen.

| Subprocessor | Rolle | DPA verfügbar | DPA signiert | Owner |
|--------------|-------|---------------|--------------|-------|
| Vercel Inc. | AV (Hosting) | Ja | ⏳ User-Check | User |
| IONOS SE | AV (Mail) | Ja | ⏳ User-Check | User |
| Microsoft Corporation | AV (CRM) | Ja (M365 OST/DPA) | ⏳ User-Check | User |
| Anthropic PBC | AV (KI) | Ja | ⏳ User-Check | User |
| PayPal | Eigenverantwortlich (Art. 4 Nr. 7) | N/A — kein AV nötig | ✅ N/A | — |
| Apple Inc. | Eigenverantwortlich (OS-Funktion) | N/A — kein AV nötig | ✅ N/A | — |

PayPal und Apple sind in §6.2 als eigenverantwortliche Empfänger klassifiziert (D4 + D5) — kein AV mit ihnen erforderlich. Bleibt: 4 AV-Signaturen als User-Action.

---

## Follow-ups für Backlog

1. **DRIFT-1 — Form-Wording-Asymmetrie SignupForm + RenewalForm** (P2, S, Linus, Post-Launch) — Diff-Vorschlag im Report. Gleiche Acknowledgment-Logik wie H3 ContactForm auf die anderen zwei Formulare ausdehnen. Datamodell unverändert.

2. **DRIFT-2 — Stale Code-Comment** in `app/datenschutz/page.tsx:34` (P3, XS, Linus, Backlog) — Verweis auf alte §6-"KI-Assistenz"-Struktur aktualisieren auf §6.1/§6.2.

3. **Phase-2 Captcha-Aktivierung — Datenschutz §6.1 Eintrag** (P3, S, Linus + Dr. Sommer Re-Review) — Wenn `NEXT_PUBLIC_FRIENDLY_CAPTCHA_SITEKEY` in Vercel gesetzt wird, muss Friendly Captcha (Operator: Friendly Captcha GmbH, DE) als Auftragsverarbeiter in §6.1 ergänzt werden. Heute N/A (H1).

4. **M3 Verfeinerung — Zitat Art. 5 Abs. 1 lit. e DSGVO bei Kategorien 3+4** (P3, XS, Linus, Backlog) — Optionale juristische Verfeinerung der Speicherdauer-Begründung für allgemeine Kontaktanfragen + abgelehnte Anmeldungen. Heute Standard-Praxis-konform.

5. **Compliance Re-Sweep nach 6 Monaten** (P2, S, Dr. Sommer, ~2026-10-19) — Standard Recurring DPO-Audit nach Launch, prüft Drift durch zwischenzeitlichen Feature-Drop, Subprocessor-Wechsel oder regulatorische Updates (z.B. KI-VO Anwendbarkeit, neue SCC-Versionen).

---

## FOR MASCHIN

Dr. Sommer Compliance Re-Scan komplett. Verdict-Matrix grün (11/11 Code-Items + H6 sauber als User-Action getrennt). Compliance-Gate für B14 Cutover ist **🟢 GREEN im Code-Scope**.

**Update für session-state Dr.-Sommer-Row:**
- Add: "Session 04-19 (OGC Compliance Re-Scan) — 🟢 GREEN. 11/11 Code-Items PASS. 2 Drift-Findings ins Backlog (M+L). H6 + DPA-Sigs bleiben User-Action."

**Update für OGC Pre-Launch Backlog:**
- Add 4 neue Items (DRIFT-1, DRIFT-2, Phase-2 Captcha, M3 Verfeinerung) — siehe "Follow-ups für Backlog" oben.
- Add 1 Recurring Item: Compliance Re-Sweep ~2026-10-19.

**Cutover-Freigabe-Status (Compliance-Seite):**
- Code: 🟢 GREEN (dieser Report)
- User-Action H6 Anthropic Console: ⏳ pending
- User-Action DPA-Sigs (Vercel/IONOS/Microsoft/Anthropic): ⏳ pending
- User-Action Vercel `CAPTCHA_ENABLED` Decision: ⏳ pending (kann auch bewusst ungesetzt = off bleiben)

Erst wenn alle 4 🟢 sind, ist die Compliance-Seite des B14-Gates komplett. Security (James) ist bereits 🟢. Nach Compliance-Gate-Komplettierung kann der DNS-Cutover laufen.

---

## Session Close

🎵 **Song:** "Every Little Thing She Does Is Magic" — The Police (Stewart Copeland / Sting / Andy Summers, 1981). Statt der Sommer-Default-DPO-Hymne "Every Breath You Take" — diese Verifikation hatte eine andere Energie: die Fixes waren bereits sauber, mein Job war "every little thing" (jede Zeile, jede Cross-Reference) zu verifizieren, nicht zu observieren wie ein Stalker-Tracker. Magic war, dass nichts Größeres aufgepoppt ist.

💬 **Quote:** "Make things as simple as possible, but not simpler." — Albert Einstein (zugeschrieben, sinngemäß aus "On the Method of Theoretical Physics", 1933). Die Re-Scan-Logik in einer Linie: Zwei Drift-Findings, beide aus dem gleichen Muster — die "ContactForm-only"-Korrektur war einfach, aber zu einfach. Die Wahrheit der Sache (Kopplungsverbots-Hygiene) verlangt Anwendung auf alle drei Formulare, nicht nur auf das eine.

🎨 **Poster Prompt:** Ein DPO im weißen Kittel, am Schreibtisch sitzend, mit einem Vergrößerungsglas in der Hand. Auf dem Schreibtisch: ein gedruckter Datenschutzerklärungs-Stapel mit gelben Klebezetteln "✅ §6.1", "✅ §6.2", "⚠️ DRIFT-1 SignupForm". Im Hintergrund eine Tafel mit "Art. 28 ↔ Art. 4 Nr. 7" als Gegenüberstellung, daneben "§ 356 BGB — Pre-Consent-Falle: closed". Auf der Schulter des DPO sitzt ein kleiner Cartoon-Friendly-Captcha (gelb, mit "off"-Schalter), der schläft. Stil: technische Illustration, ruhige Farben (Nordseegrau + Akzent-Gelb), keine Cartoon-Überzeichnung — eher Bauhaus-meets-Compliance-Audit.
