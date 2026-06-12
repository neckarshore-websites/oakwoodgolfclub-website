# Runbook — Activating Cloudflare Turnstile on a Site

Reusable procedure for switching the form spam-protection from dormant to live
on a Vercel + Next.js (App Router) site. **oakwoodgolfclub.de was the first
site activated (2026-06-12)** — this runbook is the worked example generalised
so the next site (goldoni, then any future site) does not re-learn the same
lessons the hard way.

> **Important — the single most expensive lesson:** a **real** Turnstile key
> **cannot be solved by an automated browser** (Playwright/headless). Cloudflare
> bot-detection refuses the token. So the *final* happy-path verification is
> ALWAYS a **human in a real browser**, and the prod/nightly E2E happy-path
> submit tests must be **skipped against the real-key target**. Test keys
> (preview/local) solve fine; the real key does not. Do not interpret a failing
> automated happy-path against prod as a broken config — confirm with a human
> round-trip first.

## Prerequisites

1. The site already has the Turnstile code wired (the dormant state):
   - `components/forms/Turnstile.tsx` (client widget, renders `null` unless
     `NEXT_PUBLIC_CAPTCHA_ENABLED === "true"` + sitekey set).
   - `lib/captcha/verify.ts` (server verify; **fail-closed in production** when
     `CAPTCHA_ENABLED=true` + secret missing).
   - CSP in `next.config.ts` allows `https://challenges.cloudflare.com` in
     `script-src` + `connect-src` + `frame-src`.
   - `<Turnstile />` mounted inside each form.
   - **If the site does NOT have this yet (e.g. goldoni today): wire it first.**
     Port the three pieces above + mount the component; ship + verify dormant
     (forms still work, no widget) BEFORE activating.
2. A Cloudflare API token scoped **Account → Turnstile → Edit**, stored in the
   macOS Keychain as `cloudflare-turnstile-token` (NOT pasted into any chat).
   This token is **reused across all sites** — create once, keep it.
   - Created at <https://dash.cloudflare.com/profile/api-tokens> → Custom Token.
   - Account ID (this account): `90fbc9ccaa7b0a7435a9eaef68edf542`.

## Step 1 — Create the widget via the Cloudflare API (not the dashboard)

The dashboard nav moves; the API is stable and scriptable. The create response
returns **both** the public `sitekey` and the secret in one call.

```bash
TOKEN=$(security find-generic-password -s cloudflare-turnstile-token -w)
ACC=90fbc9ccaa7b0a7435a9eaef68edf542
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  "https://api.cloudflare.com/client/v4/accounts/$ACC/challenges/widgets" \
  --data '{"name":"<Site Name>","domains":["<apex>","www.<apex>","<project>.vercel.app"],"mode":"managed"}'
```

- **`domains` MUST include the `*.vercel.app` production alias**, not just the
  custom apex + www. The nightly/prod E2E runs against the `.vercel.app` alias;
  if it is not in the allowlist the widget will not solve there.
- `mode: "managed"` is the right default (invisible most of the time).
- Capture `sitekey` (public) and `secret` (sensitive). Pipe the secret straight
  into storage; never print it.
- Idempotency: `GET .../challenges/widgets` first to avoid duplicates.
- To add a domain later: `PUT .../challenges/widgets/{sitekey}` with the full
  `{name, domains[], mode}` (PUT overwrites).

## Step 2 — Validate on a LOCAL PRODUCTION build (not `next dev`)

`next dev` has two traps: cold-compile flakiness on heavy form routes, and a
softer CSP (dev adds `unsafe-eval`). Validate on the real production build:

```bash
# .env.local (gitignored) — Cloudflare PUBLIC test keys (always-pass):
NEXT_PUBLIC_CAPTCHA_ENABLED="true"
CAPTCHA_ENABLED="true"
NEXT_PUBLIC_TURNSTILE_SITEKEY="1x00000000000000000000AA"
TURNSTILE_SECRET_KEY="1x0000000000000000000000000000000AA"

npm run build && npm start          # serves the real prod CSP, NODE_ENV=production
# point Playwright at the local prod server (127.0.0.1, NOT "localhost", so the
# webServer block is skipped and your server is used):
E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/forms/ --grep "happy path"
```

- Test-key cheat-sheet: always-pass sitekey `1x00000000000000000000AA` / secret
  `1x0000000000000000000000000000000AA`; always-block sitekey
  `2x00000000000000000000AB` / secret `2x0000000000000000000000000000000AA`.
- Confirm the prod CSP serves Turnstile:
  `curl -sI http://127.0.0.1:3000/<form> | grep -i content-security`.
- Remove the test keys from `.env.local` when done.

## Step 3 — E2E happy-path needs a token-wait helper

The happy-path specs click submit instantly and race the async Turnstile
script-load → empty token → server rejects (`missing-solution`). Add a helper
that waits for the token **only when the widget is present** (no-op when captcha
is off, so the same specs stay green in both states). See
`tests/e2e/fixtures/test.ts` → `waitForTurnstileToken(page)`.

## Step 4 — Set the 4 production env vars BEFORE the activating deploy

`NEXT_PUBLIC_*` is **baked at build time**, so the activation only takes effect
on the *next* deploy. Setting the vars is inert until then (Vercel binds env at
build time — the running deployment is unaffected). Set all four, then let the
activating deploy bake them in one shot:

```bash
printf 'true' | vercel env add NEXT_PUBLIC_CAPTCHA_ENABLED production
printf 'true' | vercel env add CAPTCHA_ENABLED production
printf '<real-sitekey>' | vercel env add NEXT_PUBLIC_TURNSTILE_SITEKEY production
printf '%s' "$(security find-generic-password -s <site>-turnstile-secret -w)" | vercel env add TURNSTILE_SECRET_KEY production
```

- **Never set `CAPTCHA_ENABLED=true` on prod while the live build lacks the
  baked `NEXT_PUBLIC` sitekey** — that combination is fail-closed → all submits
  rejected. Setting all four + one fresh deploy avoids the window.
- Setting prod env vars + merging are **gated user-authorized actions** — get an
  explicit go-ahead (the auto-mode classifier blocks them otherwise).

## Step 5 — Deploy + datenschutz, atomically

- The Datenschutz page must disclose Cloudflare as a US processor: a §6.1
  "Auftragsverarbeiter" block + a §7 third-country (SCC) entry. Turnstile sets
  **no cookies**. (See the oakwood `app/datenschutz/page.tsx` diff for wording.)
- Bundle the Datenschutz change + E2E helper in one PR. Merge AFTER setting the
  env vars so the single auto-deploy ships text + activation together.

## Step 6 — Verify on the REAL domain (human round-trip)

1. **Human, real browser:** open `https://<apex>/<form>`, submit, confirm the
   success banner + that the notification email arrives. This is the only
   reliable real-key check.
2. Cheap automated checks (single requests — see warning below):
   `curl -s https://<apex>/<form> | grep -o cf-turnstile` and check
   `/datenschutz` for the new text.

## Step 7 — Skip the real-key happy-path in nightly/prod E2E

Because automation can't solve the real key, the prod/nightly happy-path submit
tests **will fail** unless skipped. Gate them (e.g. `test.skip` on an
`E2E_CAPTCHA_REAL=1` flag set in `test:e2e:nightly` / `test:e2e:prod`). The rest
of the suite (loads, validation, honeypot, SEO, redirects) keeps running →
nightly stays green and meaningful. Happy-path submit stays covered by
local/preview with test keys.

## Pitfalls (learned on oakwood, 2026-06-12)

| # | Pitfall | Mitigation |
|---|---------|------------|
| 1 | Real key can't be solved by Playwright → looks "broken" | Human round-trip is the truth; skip in automation. |
| 2 | **Polling the live domain in a tight loop** trips Vercel auto-DDoS-mitigation → "Vercel Security Checkpoint" (403 to non-browser clients) | Use **single** requests + the `.vercel.app` alias for checks. It self-clears once traffic normalises (manual Attack Mode was never on). `vercel firewall attack-mode disable` is **agent-blocked** — only the user can run it interactively. |
| 3 | `.vercel.app` alias missing from widget allowlist → nightly breaks | Add it in Step 1. |
| 4 | `next dev` cold-compile flakiness on heavy form routes | Validate on a local **prod** build (Step 2). |
| 5 | Custom domain "serving old build" | Usually a 403 challenge (curl) or edge-lag, not a bad deploy. Check the `.vercel.app` alias (same deploy) and follow redirects/UA. |
| 6 | Secret hygiene | Widget secret → Vercel env (source of truth). API token → Keychain (reused). Never echo either. |

## Rollback

`vercel rollback <previous-dormant-deployment-url>` — instant revert to the
pre-activation build. Note the prior production deployment URL **before** the
activating deploy so you can roll back in seconds. (Removing env vars also
works but needs a redeploy to take effect.)
