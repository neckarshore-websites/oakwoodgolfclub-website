# Content-Brief: Money-Back-Garantie — JK-2 Placement + Polish

**Erstellt:** 2026-05-26 | **Von:** Jack | **Für:** Linus
**Prio:** P2 | **Effort:** XS (Placement-Fix) + optional XS (Hero-Eyebrow)
**Backlog-Ref:** BACKLOG #26 / JK-2

---

## TL;DR

Die `MoneyBackGuarantee`-Component existiert bereits — Copy ist stark, Schema ist sauber. **Das einzige Problem: sie steht im falschen Slot.** Die Component selbst fordert in ihrem Docstring "Placement: between PricingCards and FAQTeaser" — gerendert wird sie aber als letzte Section nach `CTASection`. Ein Ein-Zeilen-Fix in `app/page.tsx`.

Zusätzlich optional: ein Eyebrow-Hinweis im Hero, damit die Garantie above-the-fold sichtbar wird (BACKLOG #26 Option c).

---

## Warum dieser Brief

User-O-Ton vom 2026-04-18 ist der Ausgangspunkt:

> "Money-Back-Garantie ohne Regeln, ohne Nachfragen, einfach anfragen. Zu jeder Zeit formfrei. In 18 Jahren vier-fünf Mal gezogen."

Das ist das stärkste differenzierende Vertrauenssignal des Clubs. Kein anderer DACH-Golfclub mit Fernmitgliedschaft kommuniziert sowas öffentlich. Es rechtfertigt einerseits den Preisanker (55 €), entkräftet andererseits den "Was ist wenn's nicht passt?"-Einwand bevor er entsteht.

**BACKLOG #26 (offen seit 2026-04-18 — über 5 Wochen):** Empfehlung war Option b — eigene Sektion zwischen Pricing und FAQ-Teaser. Linus hat diese Empfehlung umgesetzt — aber die Section landet aktuell ganz unten auf der Seite.

---

## Befund: Component vs. Placement

### Was schon da ist (PASS — kein Rewrite nötig)

`components/sections/MoneyBackGuarantee.tsx` — von Linus gebaut, Copy in direktem User-O-Ton-Stil:

- Eyebrow: "Geld-zurück-Garantie"
- Headline: "Wenn dir was nicht passt, bekommst du dein Geld zurück."
- Promise: "Lebenslang. Formfrei. Ohne Begründung."
- Story-Anchor: "vier- bis fünfmal in 18 Jahren"
- AGB-Anker: "Vertraglich verankert in AGB § 8"
- Gold-Akzent-Rule, narrow column, kein CTA (richtige Entscheidung — die Botschaft ist die CTA)

**Bewertung:** Copy ist on-brand, AI-citation-ready (zwei klare Passagen >40 W), und folgt dem User-O-Ton ohne ihn wörtlich zu zitieren. Lass es so. ✅

### Was nicht passt (FIX)

`app/page.tsx` (Stand 2026-05-26):

```tsx
return (
  <>
    <HeroOverlaySwap />
    <ValueProp />
    <PricingCards />
    <FAQTeaser />     // ← MoneyBack gehört DAVOR
    <Tools />
    <CTASection />
    <MoneyBackGuarantee />  // ← steht hier, nach CTA, unter der Fold-Linie
    <JsonLd id="offer-schema" data={offersSchema()} />
  </>
);
```

Die Component dokumentiert ihre eigene Soll-Platzierung im Docstring (Zeile 7–9):

> "Placement: between PricingCards and FAQTeaser. Rationale: someone who just looked at '55 €' / '143 €' is doing the mental math on perceived risk."

**Conversion-Logik:** Genau in dem Moment, wo der Besucher die Preise sieht und denkt "55 € — gut, aber was ist wenn ich's nicht mehr nutze?", liefert die Garantie die Antwort. Wenn sie nach dem CTA kommt, verpufft sie. Der Besucher hat zu dem Zeitpunkt entweder schon geklickt oder schon aufgegeben.

---

## Gewünschte Änderungen

### 1. Placement-Fix (REQUIRED — XS)

In `app/page.tsx` `<MoneyBackGuarantee />` zwischen `<PricingCards />` und `<FAQTeaser />` verschieben:

```tsx
return (
  <>
    <HeroOverlaySwap />
    <ValueProp />
    <PricingCards />
    <MoneyBackGuarantee />  // ← hierhin
    <FAQTeaser />
    <Tools />
    <CTASection />
    <JsonLd id="offer-schema" data={offersSchema()} />
  </>
);
```

**Begründung:** Component-eigene Empfehlung folgen. Risk-Reversal direkt nach dem Pricing-Block, bevor andere kognitive Themen (FAQs, Tools) den Vertrauensmoment überschreiben.

**Effort:** Ein-Zeilen-Reorder. Kein Render-Risiko (Component ist self-contained, hat eigenen Spacing/Border).

---

### 2. Hero-Eyebrow (OPTIONAL — XS)

BACKLOG #26 Option c war ein Hero-Eyebrow: "Mit lebenslanger Geld-zurück-Garantie". Lohnt sich, weil:

- Above-the-fold-Vertrauenssignal — vor jedem Preis sichtbar
- Erste Sekunde der Seite trägt schon das Differentiating Promise
- Konsistent mit der jetzt richtig platzierten Sektion

**Vorschlag:** Im Hero einen kleinen Eyebrow oberhalb der H1 oder als Footer-Zeile unterhalb des CTA-Buttons:

> Lebenslange Geld-zurück-Garantie — ohne Regeln.

oder kompakter:

> Geld-zurück-Garantie — lebenslang, ohne Wenn und Aber.

**Placement-Empfehlung:** Direkt unter dem primären CTA-Button im Hero, in der gleichen Mikrotypografie wie das aktuelle Eyebrow oben (kleine Caps, gold-deep oder ink/65). Kein eigener Link — der ganze Block weiter unten erklärt es.

**Effort:** Ein zusätzlicher `<p>` in `HeroOverlaySwap.tsx`. Lighthouse-neutral.

---

### 3. Pricing-Cards-Note (OPTIONAL — XS, eher nicht)

BACKLOG #26 Option a war "drittes Pricing-Card-Argument". Empfehlung: **nicht machen.** Die Garantie ist kein Feature des Tarifs — sie gilt für alle. Sie würde im Pricing-Block redundant wirken und den Vergleich zwischen 55 € / 143 € verwässern. Die Sektion direkt unter dem Pricing-Block (Fix #1) macht den Job besser.

---

## E-E-A-T / GEO-Effekt

Die richtig platzierte Section liefert AI-Crawlern eine eigenständige Passage mit:

- Klarer Eröffnungs-Headline (>120 W Folgekontext)
- Konkreten Zahlen ("vier- bis fünfmal in 18 Jahren")
- Vertragsanker (AGB § 8 — verifizierbar)

Das ist die Art von Passage, die Perplexity / ChatGPT bei Queries wie "oakwood golf geld zurück" oder "is oakwood golf club risk free" als Quelle zitieren werden. Aktuelle Platzierung am Seitenende verringert die Wahrscheinlichkeit, dass Crawler die Passage als zentrale Brand-Aussage gewichten — sie wirkt wie ein Footer-Element.

---

## Definition of Done (für Linus)

**Required:**
- [ ] `<MoneyBackGuarantee />` zwischen `<PricingCards />` und `<FAQTeaser />` in `app/page.tsx`
- [ ] Lighthouse 95+ unverändert (reine Reorder, kein neues Markup)
- [ ] Mobile + Desktop visuell geprüft (Spacing/Border-Übergänge stimmen)
- [ ] Build + Lint grün
- [ ] Committed + gepusht

**Optional (eine Folge-Session, nicht im selben Commit):**
- [ ] Hero-Eyebrow ergänzt (Variante in `HeroOverlaySwap.tsx`)
- [ ] Visual-Review durch User vor Merge (Hero-Bereich ist Brand-zentral)

---

## Offene Fragen für User-Bestätigung

Keine. Der Brief beschreibt einen Placement-Fix nach Component-Owner-Intent — Copy ist nicht zu ändern. Hero-Eyebrow ist optional und kann in einer eigenen Mini-Session entschieden werden, wenn der User die genaue Wortwahl mag.

---

## Anmerkung (für MASCHIN-Drift-Audit)

BACKLOG #26 sollte nach Implementierung von Fix #1 von "Offen" auf "Done" geflippt werden — die Section existiert und ist dann an der empfohlenen Stelle. Optional-Punkt 2 (Hero-Eyebrow) kann als neues, eigenständiges Backlog-Item (P3, XS) angelegt werden, wenn der User den Eyebrow möchte. Sonst ist #26 mit dem Placement-Fix vollständig erledigt.
