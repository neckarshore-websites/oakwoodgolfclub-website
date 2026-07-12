# Blog Image Backfill — Sourcing Brief (Equipment/Training subset)

> **Scope:** the residual of **L57 OGC Image Backfill**. The golf-history series (5/5)
> and two reworked posts are already imaged; this brief covers the **7 still-imageless
> posts in the Equipment and Training categories**. It is a *sourcing brief*, not the
> images themselves — asset selection, license verification, and visual acceptance stay
> with the Founder/Jack (see "Who does what").

## Why this is a brief and not a PR-with-images

Two hard constraints keep image assets out of an autonomously-committed PR:

1. **License judgment is a Founder-risk, not an agent decision.** German **§72
   Lichtbildschutz** makes even a repro photo of a public-domain 2-D artwork *non*-PD
   (Reiss-Engelhorn, BGH 2018). A wrongly-verified "PD/CC0" tag becomes an Abmahn
   liability the club carries — so the license call is made by a human, on the concrete
   file, at selection time.
2. **Visual acceptance is the Founder's call.** A committed image is visual output;
   even a correctly-licensed one is "shipped, awaiting acceptance," never "done" until
   the Founder signs off.

## Image-source policy (recap)

- **No AI-generated images.**
- **History posts:** period documents that are gemeinfrei (public-domain by age).
- **Modern posts:** PD-by-release / **CC0** / **CC BY(-SA)** with attribution.
- **§72 caveat:** prefer expired-Lichtbild / CC0 / CC BY over a museum's repro photo of a
  PD 2-D work.
- **Product reviews** follow the established repo precedent: a **manufacturer press/product
  image** with a visible credit line (e.g. Bushnell post → *"Bild: Bushnell Golf"*).
  Generic CC0 golf motifs are the wrong fit for a named-product review.

## Storage & format convention

- File: `public/blog/images/<descriptive-name>.webp` (WebP, ~1200px wide, optimized).
- Reference inline: `![<descriptive German alt text>](/blog/images/<name>.webp)`.
- Optional italic credit line directly under the image: `*<caption>. Bild: <source>*`.
- Place the primary image directly after the TL;DR / first section (Bushnell pattern).

## The 7 posts

### Equipment (3) — manufacturer press image, credited

These are named-product reviews. The natural, correct image is the product itself from
the maker's press/product assets, credited — *not* a generic golf stock photo.

| # | Post | Subject | Recommended image | Source path | License note |
|---|------|---------|-------------------|-------------|--------------|
| 1 | `counterpain-hot-plus-muskelpflege` | Taisho "Counterpain Hot Plus" muscle balm (JP) | Product tube/packaging shot | Taisho press/product page or retailer product image | Manufacturer image, credit "Bild: Taisho" — usage is editorial/review; Founder confirms retailer permits |
| 2 | `magnetischer-ballmarker-puttergriff` | Magnetic ballmarker clipped to a putter grip | Close-up of a magnetic marker on a grip | Vendor product image, OR a self-shot photo of the club's own kit (cleanest — zero license doubt) | **Best option: a quick in-house phone photo** — club owns it outright, no §72/CC issue |
| 3 | `nivea-uv-dry-protect-sport-sonnenspray` | NIVEA UV Dry Protect Sport SPF50 spray | Product can shot | Beiersdorf/NIVEA press assets or retailer product image | Manufacturer image, credit "Bild: NIVEA" — editorial/review use, Founder confirms |

> **Note on #2:** a magnetic ballmarker is a generic accessory, not a single named SKU —
> an **in-house photo of the club's own marker on a putter** is the lowest-risk, most
> authentic image and needs no external license at all. Recommended over a vendor image.

### Training (4) — generic golf CC0 / CC BY imagery

These are conceptual how-to posts. Generic, well-licensed golf imagery fits cleanly. Good
license-safe pools: **Wikimedia Commons** (filter to CC0 / CC BY / CC BY-SA — verify on the
file page, avoid museum-repro §72 traps), **Openverse**, or an **in-house photo** from
Oakwood's own range/bunker (again, zero license doubt and on-brand).

| # | Post | Subject | Recommended motif | Source path | License note |
|---|------|---------|-------------------|-------------|--------------|
| 4 | `gedanken-beim-golf-42-handtuch-positiv` | Mental game — 42 positive thoughts | A calm golfer at address / a towel on the bag | Wikimedia/Openverse CC0-CC BY, or in-house | Verify CC0/CC BY on file page; attribute if CC BY |
| 5 | `ideale-konfiguration-wedges-golfplatz` | Wedge configuration (44–58°) | A set of wedges laid out / a wedge face | Wikimedia/Openverse CC0-CC BY, or in-house photo of a wedge set | In-house is ideal (shows real gear); else verify license |
| 6 | `was-soll-man-trainieren` | What amateurs should practice (approach, not putting) | A practice range / approach shot | Wikimedia/Openverse CC0-CC BY, or in-house range photo | In-house range photo = zero license risk + authentic |
| 7 | `wie-das-bunkerspiel-verbessern` | Bunker technique in 3 steps | A bunker shot with sand spray | Wikimedia/Openverse CC0-CC BY, or in-house bunker photo | In-house = ideal; else verify CC0/CC BY, attribute |

> **Cross-cutting recommendation:** for **5 of the 7** (all Training + the ballmarker),
> an **in-house phone photo** from Oakwood's own course/kit is the single best source —
> authentic, on-brand for E-E-A-T, and carrying no license or §72 risk whatsoever. Only
> the two named-product reviews (Counterpain, NIVEA) genuinely need external manufacturer
> assets.

## Who does what

| Step | Owner |
|------|-------|
| Select the concrete asset per post (or shoot in-house) | Founder / Jack |
| Verify license on the concrete file (§72-aware) | Founder |
| Optimize to WebP + drop into `public/blog/images/` | Linus (once asset + license are handed over) |
| Wire the `![alt](/blog/images/…)` + credit line into each post | Linus |
| Visual acceptance | Founder |

## Offer

If the Founder wants the **4 Training posts** imaged from CC0/CC BY pools (they take
generic golf imagery cleanly), Linus can pull concrete candidates and open a **draft PR**
for visual + license acceptance — on an explicit go, never speculatively. The 3 Equipment
reviews wait on manufacturer assets (or, for the ballmarker, one in-house photo).
