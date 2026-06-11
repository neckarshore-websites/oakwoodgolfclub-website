# AI-Surface-Monitoring (JK-15)

Weekly, API-based trend detector for how the four major AI surfaces answer OGC
queries. Built per `docs/content/jk15-api-monitoring-brief.md`. It is a
**trend detector, not a surface replacement** — geo-personalization, account
memory, and free-tier model choice only show up in the real UI. The quarterly
manual surface test (JK-10) stays the gold standard; JK-15 complements it.

## Status: BUILT, DORMANT — activation blocked

The tooling, scorer, report generator, and workflow are complete and the
scorer is unit-tested (`npm run test:ai-surface:unit`, 6/6, no keys needed).
**It does not run end-to-end yet.** Three blockers, none of them code:

| # | Blocker | Owner | Why it matters |
|---|---------|-------|----------------|
| 1 | 4 paid API keys as GitHub Secrets | User | No keys → every adapter throws on `requireKey`. |
| 2 | JK-10 Lauf 1 manual scores | Jack | The ≥85%-agreement validation gate scores against them. |
| 3 | JK-11/12/13 deployed | Linus | JK-15 measures their effect; until they ship there is nothing to measure. |

## Architecture

```
tests/ai-surface/
  queries.ts        5 frozen OGC queries (Q1..Q5) — never edit
  ground-truth.ts   FACTS + HALLUCINATIONS (loose regexes)
  score.ts          scoreAnswer() — the brain, pure + unit-tested
  report.ts         Markdown report + drift diff + regression detection
  run.ts            orchestrator (4 providers × 5 queries → score → write)
  score.test.ts     scorer unit test (zero keys)
  providers/
    http.ts         fetch + timeout + 429 backoff + key guard
    anthropic.ts    claude-sonnet-4-6 + web_search_20260209  (verified shapes)
    openai.ts       gpt-4o-search-preview     ⚠️ verify at activation
    google.ts       gemini-2.0-flash grounding ⚠️ verify at activation
    perplexity.ts   sonar-pro                  ⚠️ verify at activation
docs/reports/ai-surface/
  YYYY-MM-DD-monitoring.md   per-run report
  YYYY-MM-DD-raw.json        raw data (drift diff source)
  _latest-summary.md         short summary (GitHub issue body on regression)
```

## Activation (User)

1. Provision API keys: Anthropic, OpenAI, Google (Gemini), Perplexity.
2. Add them as GitHub Actions **secrets** on `neckarshore-websites/oakwoodgolfclub-website`:
   `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_API_KEY`, `PERPLEXITY_API_KEY`.
3. **Verify the 3 flagged adapters** (Linus): one live smoke call each against
   current provider docs — the OpenAI/Google/Perplexity response shapes were
   written from the brief but never run. The Anthropic adapter is verified.
4. Run the validation gate: point the scorer at the JK-10 Lauf 1 answers and
   confirm ≥85% agreement with Jack's manual scores (brief acceptance criterion).
5. Trigger the workflow manually (`workflow_dispatch`) once, review the report,
   then let the Monday cron run.

## Commands

| Command | What |
|---------|------|
| `npm run test:ai-surface:unit` | Scorer unit test — **no keys needed**, runs now. |
| `npm run test:ai-surface:local` | Full run, keys loaded from `.env.local`. |
| `npm run test:ai-surface` | Full run, keys from the environment (CI path). |

## Cost & ToS

- ~0.70 USD/run, ~36 USD/year at weekly cadence. Cost caps: `max_tokens: 2048`
  + web-search `max_uses: 3` per call.
- API usage is explicitly ToS-permitted (unlike surface automation) — no account-ban
  risk. Queries carry no PII (brand phrases only) — no GDPR exposure.
- Reports contain answer snippets only; safe even if the repo were public.

## Notes

- **Models are pinned** (`claude-sonnet-4-6`, etc.), not "latest" — a floating
  id would make the trend jump on every provider release.
- **Raw `fetch`, no SDKs** keeps the dormant tool dependency-free. For production
  the Anthropic adapter may be swapped to `@anthropic-ai/sdk` (Anthropic's
  recommended path); the request/response shapes already match.
