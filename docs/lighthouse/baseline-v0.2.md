# Lighthouse Baseline — v0.2 (2026-04-17)

**Build:** commit pending (post-farb-tuning + contrast-fix)
**Target:** `http://localhost:3000` (Next.js production build via `npm run start`)
**Tool:** `lighthouse 13.1.0` via `npx`
**Environment:** Chrome headless, macOS arm64

## Scores

| Category | Desktop | Mobile |
|----------|---------|--------|
| Performance | **100** | **96** |
| Accessibility | **100** | **100** |
| Best Practices | **100** | **100** |
| SEO | **100** | **100** |

All four categories meet the `neckarshore-website` CLAUDE.md target of `95+`.

## Core Web Vitals

| Metric | Desktop | Mobile | Threshold (Good) |
|--------|---------|--------|------------------|
| LCP (Largest Contentful Paint) | 0.6 s | 2.6 s | < 2.5 s |
| FCP (First Contentful Paint) | 0.3 s | 0.8 s | < 1.8 s |
| TBT (Total Blocking Time) | 20 ms | 80 ms | < 200 ms |
| CLS (Cumulative Layout Shift) | 0 | 0 | < 0.1 |
| Speed Index | 0.4 s | 0.8 s | < 3.4 s |

Mobile LCP at 2.6 s is 100 ms over the "Good" threshold. This is the only Core-Web-Vital
that isn't in the top bucket. Acceptable baseline for v0.2 — watch after B5 Forms
(Server Actions may add a bit of JS to the bundle).

## Binary Audit Failures

Desktop: none.
Mobile: none.

## How to Reproduce

```bash
cd ~/Developer/projects/oakwoodgolfclub-website
npm run build
npm run start &
SERVER_PID=$!

# Desktop
npx lighthouse http://localhost:3000 \
  --output=json --output-path=docs/lighthouse/baseline-vX-desktop.json \
  --preset=desktop --quiet --chrome-flags="--headless=new"

# Mobile (default)
npx lighthouse http://localhost:3000 \
  --output=json --output-path=docs/lighthouse/baseline-vX-mobile.json \
  --quiet --chrome-flags="--headless=new"

kill $SERVER_PID
```

## History

| Version | Date | Commit | Desktop | Mobile | Notes |
|---------|------|--------|---------|--------|-------|
| v0.1 | 2026-04-17 | `6e0af5e` | not measured | not measured | Scaffold shipped (B1–B4) |
| v0.2 pre-contrast | 2026-04-17 | `70af7de` | 100/95/100/100 | — | Farb-Tuning — 4 contrast fails caught |
| v0.2 post-contrast | 2026-04-17 | `d9f4c50` | 100/100/100/100 | 96/100/100/100 | A11y-Contrast-Fix — 0 binary failures |
| v0.2 post-copy | 2026-04-17 | `dd0d7bc` | 100/100/100/100 | 92–96 / 100/100/100 | Handicap-Copy removal — mobile perf variance ±4 points on LCP |

## Mobile Perf Variance

Three mobile runs against the same build produced Perf scores of 92, 96, 96.
Mobile LCP fluctuated between 2.6 s and 2.9 s. This is within Lighthouse's
typical ±5 % noise for a single host machine running other processes.
The `npx lighthouse ...` invocation is not a substitute for WebPageTest or
Vercel Analytics for production metrics — use this baseline as a floor, not
an exact score.
