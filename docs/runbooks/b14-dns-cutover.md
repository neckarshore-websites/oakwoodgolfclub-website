# Runbook B14 — DNS-Cutover `oakwoodgolfclub.de` zu Vercel

**Status:** Draft 2026-04-19, Session `linus-fe-g`. Nicht ausgeführt.
**Owner Execution:** User (DNS + Vercel Dashboard)
**Owner Verification:** Linus (CLI-Checks, Cert-Verify, Cache-Propagation)
**Estimated Window:** 30–60 Min plus TTL-Propagation (bis 24 h, erwartet 10–60 Min bei IONOS-Default-TTL 3600).

---

## 1. Scope & Intent

Ziel: `oakwoodgolfclub.de` und `www.oakwoodgolfclub.de` von der aktuellen WordPress-Hosting-IP bei IONOS auf das Vercel-Deployment umbiegen. Keine Änderung an E-Mail-Infrastruktur. Rollback möglich innerhalb TTL-Fenster.

**Was sich ändert:**
- `A  @  <vercel-ip>` (apex)
- `CNAME  www  cname.vercel-dns.com` (or equivalent Vercel-provided value)

**Was **NICHT** angefasst wird:**
- `MX`-Records (IONOS-Postfächer laufen weiter, `info@oakwoodgolfclub.de` = SMTP-Versand des Funnels hängt dran, Ausfall = Funnel kaputt)
- `TXT`-Records für SPF/DKIM/DMARC
- Alle Subdomains außer `www` (falls vorhanden: separat prüfen, im Zweifel lassen)
- NS-Records (IONOS bleibt DNS-Authority)

---

## 2. Prerequisites — MUST alle ✅ sein bevor Schritt 4 läuft

| # | Gate | Verifiziert durch | Status |
|---|------|-------------------|--------|
| 1 | B13 Pre-Launch Lighthouse 95+ (Mobile Median 92 akzeptiert als Launch-Gate, siehe Session -f D1) | Linus 2026-04-19-f | ✅ |
| 2 | B5 Form-Funnel e2e-verified auf Prod | Linus 2026-04-18-F (18/18 Playwright pass) | ✅ |
| 3 | Legal-Seiten live (Impressum, AGB, Datenschutz, Widerrufsbelehrung) mit volle Anschrift + § 19 UStG-Klausel | Linus 2026-04-19-e | ✅ |
| 4 | Visual-Sichtkontrolle auf Prod-Alias durch User (T2) | User | ⬜ **Offen** |
| 5 | End-to-End Test-Membership: Signup + Mail-Empfang + Renewal gegen `oakwoodgolfclub-website.vercel.app` | User + Linus | ⬜ **Offen** |
| 6 | Prod-Alias serves aktuellster Main-Commit (Source↔Prod-Parität) — Session -f Revert 808d475 ist live | User-Decision D1 aus Session -f Frontmatter | ⬜ **Offen** |
| 7 | IONOS Zone-Snapshot als Rollback-Backup (Backlog #12) | User | ⬜ **Offen** |
| 8 | Custom-Domain in Vercel-Projekt `oakwoodgolfclub-website` hinzugefügt und SSL-Cert vorbereitet | User im Vercel-Dashboard | ⬜ **Offen** |

Wenn **irgendein** ⬜ nicht erledigt ist: STOP. Nicht umziehen.

---

## 3. Pre-Cutover (T-1 Tag bis T-1 h)

### 3a. IONOS Zone-Snapshot (Backlog #12)

Ziel: exaktes Abbild der aktuellen DNS-Zone, um bei Bedarf jeden Record restoren zu können.

Im IONOS Control Panel:
1. **Domains & SSL → oakwoodgolfclub.de → DNS** öffnen.
2. Export-Funktion nutzen (Zone-File als `.txt`) — falls UI das nicht anbietet: Screenshots aller Record-Einträge machen (A, CNAME, MX, TXT, NS, SRV falls vorhanden).
3. Datei lokal speichern unter `~/Desktop/ogc-dns-snapshot-YYYY-MM-DD.txt` (NICHT in dieses Repo committen — Zone-File kann E-Mail-Infra-Hinweise enthalten).

**Mindest-Inhalt des Snapshots:**
- Alle `A` Records (insbesondere `@` und `www`)
- Alle `CNAME` Records
- Alle `MX` Records mit Prioritäten
- Alle `TXT` Records (SPF/DKIM/DMARC/Verification)
- NS-Records (zur Dokumentation)

### 3b. Vercel Custom Domain registrieren

Ziel: Vercel weiß, dass es für `oakwoodgolfclub.de` zuständig ist — erst dann stellt es SSL-Zertifikate aus und serviert die richtige Response.

Schritt-für-Schritt (Vercel Dashboard):
1. Projekt `oakwoodgolfclub-website` → **Settings → Domains**.
2. **Add Domain** → `oakwoodgolfclub.de` eingeben → **Add**.
3. Vercel zeigt an, welche Records gesetzt werden müssen. **Diese Werte notieren — Apex-IP kann je nach Datum differieren von dem was in alten Runbooks steht.** Erwartete Muster:
   - Apex `@`: `A` record auf Vercel-IP (aktuell typischerweise `76.76.21.21`, aber Vercel-Dashboard-Wert nehmen)
   - `www`: `CNAME` auf `cname.vercel-dns.com`
4. Zusätzlich `www.oakwoodgolfclub.de` als Domain hinzufügen → Redirect zu `oakwoodgolfclub.de` konfigurieren (apex als Canonical, Vercel macht das optional automatisch).
5. Vercel stellt Status "Invalid Configuration" bis die IONOS-Records gesetzt sind — erwartet.

### 3c. Optional: Sync-Deploy (D1-Entscheidung)

Falls User entscheidet **sync_deploy_now** (siehe Session -f Frontmatter D1):
```bash
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && npx vercel deploy --prod
```
Erwartet: Deploy-Time ~40 s, neue `dpl_…`-ID, Alias zieht automatisch nach. Ziel ist Source↔Prod-Parität (Revert 808d475 + Backlog-Updates 9fac41b aktiv). Funktional No-Op (b77fee5 war DOM-No-Op).

Falls **deploy_with_next_functional_change**: Skip, erster funktionaler Post-Cutover-Deploy trägt den Revert.

---

## 4. Cutover (T-Stunde)

**Wichtig:** Schritt-Reihenfolge einhalten. Zwischen Schritten ~30 s warten, damit IONOS-UI saves sauber durchlaufen.

### 4a. IONOS DNS-Records ändern

Im IONOS Control Panel → **DNS für oakwoodgolfclub.de**:

| Action | Record | Host | Old Value | New Value | TTL |
|--------|--------|------|-----------|-----------|-----|
| EDIT | A | `@` | `<IONOS-WP-IP>` | `<Vercel-Apex-IP aus Schritt 3b.3>` | 3600 (oder tiefer wenn Panik-Option 600) |
| EDIT oder CREATE | CNAME | `www` | `@` oder bisheriger Wert | `cname.vercel-dns.com` | 3600 |

**NICHT ANFASSEN:**
- MX-Records bleiben wie sie sind (Mail Auth-Records ebenso).
- TXT SPF/DKIM/DMARC bleiben wie sie sind.
- NS bleibt IONOS.

### 4b. Dokumentation der Änderung

User: Zeitstempel + neue Werte in Session-Chat zu Linus posten. Linus hält das fest im Session-Report, damit Rollback-Werte nachvollziehbar sind.

---

## 5. Verification (T+5 Min bis T+60 Min)

### 5.0 One-Shot Verify (Recommended First Pass)

```bash
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && npm run verify:cutover
```

Script: `scripts/verify-b14-cutover.sh`. Läuft alle Checks aus §5a–c + Content-Smoke nacheinander, farbkodierte Pass/Warn/Fail-Ausgabe, Exit-Code (0 pass, 1 hard-fail, 2 soft-warn). Optional `EXPECTED_APEX_IP=<vercel-ip>` vorher exportieren, dann assertet der Script die DNS-Antwort statt sie nur anzuzeigen. Beispiel:

```bash
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && EXPECTED_APEX_IP=76.76.21.21 npm run verify:cutover
```

Bei "RESULT: PASS" ist §5a–c redundant. Bei "RESULT: FAIL" bzw. "PASS with warnings" die folgenden Einzelschritte manuell nachziehen.

### 5a. DNS-Propagation Checks

```bash
# Apex A-Record
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && dig +short oakwoodgolfclub.de A

# www CNAME
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && dig +short www.oakwoodgolfclub.de CNAME

# Google-DNS gegenprüfen (nicht nur lokaler Resolver)
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && dig @8.8.8.8 +short oakwoodgolfclub.de A

# Cloudflare-DNS gegenprüfen
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && dig @1.1.1.1 +short oakwoodgolfclub.de A
```

**Erwartet:** Vercel-IP (Schritt 3b.3) aus allen drei Quellen. Wenn nach 15 Min noch alte IP → IONOS-UI-Save prüfen.

### 5b. HTTPS + Cert-Verify

```bash
# Cert-Issuer + Domains
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && echo | openssl s_client -connect oakwoodgolfclub.de:443 -servername oakwoodgolfclub.de 2>/dev/null | openssl x509 -noout -issuer -subject -dates

# HTTP-Response-Header
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && curl -sI https://oakwoodgolfclub.de | head -10
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && curl -sI https://www.oakwoodgolfclub.de | head -10

# Content-Smoke (Title enthält OGC-Wording)
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && curl -sL https://oakwoodgolfclub.de | grep -oE '<title>[^<]+</title>'
```

**Erwartet:**
- Cert Issuer: `Let's Encrypt` (Vercel stellt automatisch via ACME)
- Subject enthält `oakwoodgolfclub.de` (und idealerweise `www.oakwoodgolfclub.de` via SAN)
- `HTTP/2 200` für apex, `HTTP/2 308 → https://oakwoodgolfclub.de/` für `www`
- Title-Tag entspricht der Prod-Alias-Version

### 5c. Redirect-Korrektheit

```bash
# Altes WP-URL muss auf neuen Blog-Slug redirecten (B10)
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && curl -sI https://oakwoodgolfclub.de/lieblingsclub-in-thailand/ | head -5

# Erwartet: HTTP/2 308, Location: /blog/lieblingsclub-in-thailand
```

### 5d. Form-Funnel Live-Test

```bash
# Playwright gegen neue Production-Domain
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && E2E_BASE_URL=https://oakwoodgolfclub.de npm run test:e2e:nightly
```

**Erwartet:** 23/23 passed, Mails kommen bei `info@oakwoodgolfclub.de` + `g@rauhut.com` an.

### 5e. Mail-Integrität (wichtig!)

User sendet eine Test-Mail aus beliebigem externen Account an `info@oakwoodgolfclub.de` UND `kontakt@oakwoodgolfclub.de` (falls vorhanden), prüft Ankunft in IONOS-Postfach. Wenn MX korrekt unberührt blieb: Mail kommt innerhalb 1 Min an. Wenn nicht: **SOFORT Rollback Schritt 6**, MX-Records wurden aus Versehen geändert.

---

## 6. Rollback (falls etwas nicht stimmt)

**Trigger-Kriterien für Rollback:**
- Site lädt nicht innerhalb 30 Min nach Cutover (außerhalb TTL-Erklärung)
- Cert nicht ausgestellt innerhalb 20 Min (Vercel-Seite zeigt "Pending")
- Mails kommen nicht an (MX versehentlich verändert)
- Form-E2E schlägt fehl und Root-Cause ist Deploy-seitig
- User-visueller Check zeigt gravierende Abweichung

**Prozedur:**
1. Im IONOS Control Panel: A-Record `@` zurück auf `<IONOS-WP-IP aus Snapshot>`, CNAME `www` zurück auf alten Wert.
2. TTL-Durchlauf abwarten (3600 s = max 1 h). Bei Panik: zweiter Browser / anderer DNS-Resolver testen.
3. Session-Report: Rollback-Grund dokumentieren, Root-Cause-Analyse starten.
4. Vercel-Domain `oakwoodgolfclub.de` NICHT aus Projekt entfernen — bleibt für nächsten Versuch konfiguriert.

---

## 7. Post-Cutover (T+24 h)

- [ ] Lighthouse gegen `https://oakwoodgolfclub.de` Home + Mobile + Desktop (3-Run-Median) — Baseline für neue Canonical-URL
- [ ] Google Search Console: neue Property für `oakwoodgolfclub.de` verifizieren via Vercel-Integration (oder TXT)
- [ ] Alte WP-Property in GSC behalten bis Indexing Migration abgeschlossen (~30 Tage nach Cutover)
- [ ] Sitemap-URL `https://oakwoodgolfclub.de/sitemap.xml` an GSC submitten
- [ ] 301-Redirect-Health-Check: `curl -I` auf 5 zufällige alte WP-URLs, alle müssen 308 zu neuen Slugs liefern
- [ ] `WP→Vercel`-Transition im Session-Report-Frontmatter als Roadmap-Step "Done" markieren
- [ ] Backlog #11 B14 schließen mit Cutover-Zeitstempel

---

## 8. Known Gotchas

| ID | Gotcha | Workaround |
|----|--------|------------|
| B14-G1 | IONOS DNS-Propagation ist manchmal lokal deutlich schneller als extern sichtbar — User-lokaler Resolver zeigt neue IP, externe Nutzer noch nicht. | Immer `dig @8.8.8.8` + `dig @1.1.1.1` als Ground Truth, nicht `ping` oder Browser-Cache. |
| B14-G2 | Vercel-Cert-Ausstellung kann bei apex-ALIAS-artigen Setups 5–15 Min dauern. Erst HTTPS verfügbar wenn Cert live. | Nicht in Panik verfallen <20 Min. Wenn >20 Min: Vercel-Domain-Settings-Seite prüfen, ob "Invalid Configuration" Hinweise gibt. |
| B14-G3 | `www.oakwoodgolfclub.de` vs. `oakwoodgolfclub.de` — Entscheidung Canonical muss konsistent mit Sitemap + `robots.txt` + internen Links sein. Codebasis linkt auf apex. | Sicherstellen dass Vercel `www → apex` Redirect setzt (bzw. umgekehrt). **Nach Cutover verifizieren:** `curl -I https://www.oakwoodgolfclub.de` muss 308 zu `https://oakwoodgolfclub.de/` liefern. |
| B14-G4 | IONOS erlaubt manchmal nur CNAME für `www` wenn `@` separate Records hat. Konflikt mit A+CNAME-Setup ist nie aufgetreten, aber IONOS-UI zeigt gelegentlich Warnung. | Warnung lesen, im Zweifel Screenshot an Linus, nicht blind mit "Trotzdem speichern" drüberbügeln. |
| B14-G5 | Falls TTL vor Cutover hoch stand (z.B. 86400) propagiert alte IP noch 24 h für manche Nutzer. | TTL ~24 h vor Cutover auf 600 senken, dann cutovern, dann zurück auf 3600. Nicht vergessen: Session -f hat 3600 Default angenommen, User bitte TTL im Snapshot mitnotieren. |
| B14-G6 | Vercel-Hobby-Plan ohne GitHub-Auto-Deploy (Backlog #15). Nach Cutover sind Deploys weiter manuell via `npx vercel deploy --prod`. Bedeutet: nach B14 passiert **nichts** automatisch, wenn man `git push` macht. | Bewusst dokumentieren, Team informieren, Item #15 bleibt offen (Pro-Plan $20/mo oder Repo-Transfer zu `GmanFooFoo`). |

---

## 9. Commands Reference (Copy-Paste-Ready)

```bash
# Pre-Cutover — Source↔Prod Sync-Check
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && git status && git log --oneline -3
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && curl -sI https://oakwoodgolfclub-website.vercel.app | head -3

# Optional Sync-Deploy (D1)
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && npx vercel deploy --prod

# During + Post-Cutover — Propagation
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && dig +short oakwoodgolfclub.de A
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && dig +short www.oakwoodgolfclub.de CNAME
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && dig @8.8.8.8 +short oakwoodgolfclub.de A
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && dig @1.1.1.1 +short oakwoodgolfclub.de A

# HTTP + Cert
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && curl -sI https://oakwoodgolfclub.de | head -10
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && curl -sI https://www.oakwoodgolfclub.de | head -10
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && echo | openssl s_client -connect oakwoodgolfclub.de:443 -servername oakwoodgolfclub.de 2>/dev/null | openssl x509 -noout -issuer -subject -dates

# Redirect-Smoke
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && curl -sI https://oakwoodgolfclub.de/lieblingsclub-in-thailand/ | head -5

# E2E Nightly gegen neue Production-Domain
cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website && E2E_BASE_URL=https://oakwoodgolfclub.de npm run test:e2e:nightly
```

---

## 10. Sign-Off

Runbook executed by: _______________ Date: _______________ Time: _______________

Snapshot location: _______________

Cutover-A-Record before: _______________ → after: _______________

Cert valid-until: _______________

Test-Membership signup @: _______________ Verified by: _______________

Mail-Delivery test: _______________ Verified by: _______________

Go-live freigegeben durch: German Rauhut / _______________

Backlog #11 B14 geschlossen durch Commit: _______________
