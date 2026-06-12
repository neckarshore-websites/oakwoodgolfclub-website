@AGENTS.md

## Repo Context

- **Owner:** Linus (Frontend Artist) — this is the maintainer's own 16-year side-hustle, NOT a Neckarshore AI product and NOT a client favor. The business is his.
- **GitHub home:** `neckarshore-websites/oakwoodgolfclub-website` (**public** — moved here in the 2026-06-11 GitHub org-split; was `oakwoodgolfclub-de/...` private OGC org). Vercel-Git-Integration ist angebunden und **Auto-Deploy-on-push to `main` is LIVE** (re-verified 2026-06-12: the org-split silently broke the push-webhook, Linus re-wired it via `vercel git disconnect && vercel git connect`, then a push to `main` produced a `vercel[bot]` production deploy in seconds). The old "Hobby-Plan blocks private org repos → manual `vercel deploy --prod`" framing is fully superseded — the repo is public now, so the Hobby plan deploys it on every push. ⚠️ **Consequence: a `git push`/merge to `main` reaches ~300 paying members directly** — see the deploy-care rule below.
- **Domain:** `oakwoodgolfclub.de` — currently WordPress. Live production with ~300 paying members. Migration will be phased.
- **Business:** Fernmitgliedschaft im Golfclub. Members pay €55/year (€143/year for a 4-person flight). Service: handicap management + printed membership card that is accepted by ~95% of Austrian golf courses. Operated from Germany; payments and members are primarily DACH (founding history is Thailand 2007 — Thai-Golfverband origin — but the business has been run from Germany for years; Thailand still appears in the member geo distribution as legitimate ~5% share).
- **Why this matters:** This is a **live business**, not a marketing site. Members log in, submit scores, track their handicap, receive cards in the mail. A botched deploy does not just annoy visitors — it risks a member losing their scorecard history, or worse, their handicap being wrong when they play a real course.

## Status

**Implementation in progress** — past briefing stage. The Next.js app is bootstrapped and deploying to Vercel preview. Shipped routes today (`app/`):

- `/` (homepage)
- `/mitglied-werden` (new-member signup form)
- `/mitgliedschaft-verlaengern` (renewal form)
- `/blog` (Markdown-driven, gray-matter + marked)
- `/faq`, `/agb`, `/impressum`, `/datenschutz`, `/kontakt`
- `/api/*` (server actions / form endpoints)

Member-portal (login, scorecards, handicap-management) is **not yet built** — that is the next big block and still needs scope decisions with the User. CMS choice for the 16 years of WordPress blog posts is still open. Payment gateway is wired (Stripe deps in `package.json`); test-mode end-to-end not yet verified.

**Form spam-protection:** Cloudflare Turnstile is **live** on all 3 forms (signup/renewal/contact), activated 2026-06-12. Reusable procedure + the hard-won lessons (real keys can't be solved by automation → human round-trip; don't poll the live domain; `.vercel.app` must be in the widget allowlist; fail-closed activation order): [`docs/runbooks/turnstile-activation.md`](docs/runbooks/turnstile-activation.md). The same runbook applies to porting Turnstile to other sites (goldoni next).

The DNS cutover to `oakwoodgolfclub.de` (Backlog **B14**) has NOT happened — the live business still runs on the WordPress site. Vercel preview ≠ production for paying members. Treat every "is this in scope?" question for member-portal features as still-open until confirmed in a dedicated OGC session.

`BRIEFING.md` § 6 (12 scope questions) — some answered implicitly by what's been built; others (member-portal architecture, payment-flow details, scorecard migration) still unresolved.

## Working Directory Rule

This repo lives at `~/Developer/projects/neckarshore-websites/oakwoodgolfclub-website/`. Every Bash command must start with:

```bash
cd ~/Developer/projects/neckarshore-websites/oakwoodgolfclub-website && ...
```

The Claude Code harness resets `cwd` after every Bash call. Unscoped commands risk writing to the wrong repo (rauhut-website, neckarshore-website, goldoni-website, omnopsis-backend, planning repos, Obsidian vault). Same discipline as all other Linus repos. Non-negotiable.

## Data Discipline (OGC-SPECIFIC — ADDITIONAL TO STANDARD RULES)

OGC handles personal member data (names, addresses, emails, handicap history, payment state). DSGVO applies. Strict rules:

- **Never commit member data.** Not a single real record. `.env*`, `/dumps/`, `/member-exports/`, `/wordpress-exports/`, `*.sql*`, `*.sqlite*` are in `.gitignore` — do not override.
- **No real data in mocks.** If seed / test data is needed, generate synthetic names and addresses. Never use anonymized real records — anonymization is reversible when sample sizes are small.
- **Never log PII.** Server logs (on Vercel or elsewhere) must not include names, emails, addresses, or raw scorecards. Use internal IDs.
- **DB credentials, Stripe keys, SMTP creds:** only via environment variables. Never hardcoded. Never in a commit. Not even for "just a second."
- **WordPress DB migration:** when it happens, the dump lives in `/dumps/` (gitignored) and is deleted immediately after the one-time migration script runs.
- **Member-facing pages:** audit every form for "is this asking for more than we need?" — e.g. date-of-birth is not required for handicap calculation; collecting it would be scope creep + DSGVO burden.

## Rules

Same quality bar as `neckarshore-website`, `rauhut-website`, `goldoni-website`:

- Mobile-first responsive design
- Lighthouse 95+ target on all metrics (desktop + mobile)
- No JS frameworks beyond React/Next.js
- Self-hosted fonts (DSGVO)
- Commit after each section / logical block
- **DNS-Cutover STATUS: COMPLETE.** Cutover IONOS → Vercel happened 2026-05-19 16:24–22:09 UTC, User-confirmed final 2026-05-25. `oakwoodgolfclub.de` is live on Vercel (A `76.76.21.21`, HTTP/2 `server: Vercel`). The cutover was the single point at which 300 paying members started seeing the new site — now operative. Treat post-cutover production deploys with proportional care: `vercel deploy --prod` reaches members directly. A test-membership signup + renewal + handicap-update round-trip should run on every production deploy that touches member-flows. See Backlog B14 / #11 for cutover-history.
- **`git push`/merge to `main` AUTO-DEPLOYS to production** (Backlog #15 CLOSED — re-verified 2026-06-12). There is no longer a manual-deploy gate: a push to `main` triggers a `vercel[bot]` production deploy that reaches ~300 paying members within minutes. **Treat every merge to `main` as a production release** — for any member-flow change, run the test-membership signup + renewal + handicap-update round-trip after the deploy goes live (per the DNS-Cutover note above). The old "production deploys are User-triggered via `vercel deploy --prod`, no accidental push-to-prod" guidance is obsolete and **inverted**: pushes DO reach prod now.

## Definition of Done

Standard DoD plus OGC-specific additions:

- Lighthouse 95+ desktop + mobile
- Mobile + Desktop visual check
- No browser console errors
- Build green (`npm run build`)
- Lint green (`npm run lint`)
- Committed + pushed
- **For transactional features:** end-to-end test with Stripe test mode + Resend test domain before marking "in-review"
- **For member-portal features:** data-integrity verification — no deploy may silently drop scorecards, change handicaps, or reset renewal dates

## Visuelle Abnahme — HARTE REGEL

Du entscheidest NIE, wann ein visuelles Ergebnis "fertig" ist. User entscheidet. Bei Member-Portal-Änderungen zusätzlich: Daten-Integrität verifizieren (ein bestehendes Mitglied darf durch einen Deploy weder seine Scorecards noch sein Handicap noch sein Verlängerungsdatum verlieren). Lighthouse-Scores objektiv und reportbar, alles andere User-Territorium.

## Content Source

Heute: `BRIEFING.md` in diesem Repo.

Später (TBD in dedizierter Session):
- Struktur-Content (Pages, FAQs) → Payload CMS / Sanity / Markdown-in-Repo
- Blog (16 Jahre WordPress-Posts) → Migrationsplan entscheiden: alle importieren, kuratieren, oder nur verlinken
- Member-Daten → PostgreSQL (Supabase / Vercel Postgres)

## Out of Scope (v1 — vorläufig, zu bestätigen)

- Mobile-App (Web-App reicht, funktioniert auf Mobile)
- Turniermanagement (nicht im aktuellen Scope des Clubs)
- Social-Media-Integration über Links hinaus
- Live-Scorecard-Eingabe auf dem Platz (eigenes Projekt, falls überhaupt)
- Multi-Currency-Payments (EUR only v1)
- Integrierter Shop (Merchandise, Bälle, etc.)
- Watermarking / Anti-Counterfeit auf Mitgliederkarten-Druck (eigenes Thema)
- Mehrsprachigkeit (erst wenn internationale Nachfrage quantifiziert ist)
