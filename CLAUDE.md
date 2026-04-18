@AGENTS.md

## Repo Context

- **Owner:** Linus (Frontend Artist) — this is the maintainer's own 16-year side-hustle, NOT a Neckarshore AI product and NOT a client favor. The business is his.
- **GitHub home:** `oakwoodgolfclub-de/oakwoodgolfclub-website` (private, dedicated OGC GitHub org — NOT the `neckarshore-ai` Org, NOT the User's personal `GmanFooFoo`). Side effect: Vercel Hobby-Plan kann den Repo nicht automatisch per GitHub-Integration verbinden (409 "private & owned by organization" — Pro-Plan needed, oder Repo-Transfer nach `GmanFooFoo`). Deploys laufen aktuell via `vercel deploy --prod` manuell — kein Auto-Deploy-on-push. Siehe Backlog #15.
- **Domain:** `oakwoodgolfclub.de` — currently WordPress. Live production with ~300 paying members. Migration will be phased.
- **Business:** Fernmitgliedschaft im Golfclub. Members pay €55/year (€143/year for a 4-person flight). Service: handicap management + printed membership card that is accepted by ~95% of Austrian golf courses. Operated from Thailand; payments and members are primarily DACH.
- **Why this matters:** This is a **live business**, not a marketing site. Members log in, submit scores, track their handicap, receive cards in the mail. A botched deploy does not just annoy visitors — it risks a member losing their scorecard history, or worse, their handicap being wrong when they play a real course.

## Status

**Briefing stage.** No code, no Next.js bootstrap, no database. Only `BRIEFING.md` + this file. Scope decisions (big-bang vs. phased migration, member-portal build vs. SaaS, CMS choice, payment gateway, etc.) happen in dedicated OGC sessions with the User. The Briefing has 12 open scope questions (section 6) — none of them are answered yet.

## Working Directory Rule

This repo lives at `~/Developer/projects/oakwoodgolfclub-website/`. Every Bash command must start with:

```bash
cd ~/Developer/projects/oakwoodgolfclub-website && ...
```

The Claude Code harness resets `cwd` after every Bash call. Unscoped commands risk writing to the wrong repo (rauhut-website, neckarshore-website, goldoni-website, OMNIXIS, planning repos, Obsidian vault). Same discipline as all other Linus repos. Non-negotiable.

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
- `git push` to GitHub `main` is fine — it's code-sync, not a live event. Vercel does NOT auto-deploy this repo (Backlog #15 still open), so a push cannot reach members on its own.
- **Do NOT cut over DNS to `oakwoodgolfclub.de`** (Backlog item B14 / #11) until the User approves AND a test-membership signup + renewal + handicap-update round-trip has passed end-to-end against the Vercel preview. The DNS cutover — not git push, not `vercel deploy` to a preview — is the single point at which 300 paying members start seeing the new site. Treat it accordingly.

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
