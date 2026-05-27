# Content-Brief: Geld-zurück-Garantie auf /mitglied-werden — JK-13

**Erstellt:** 2026-05-27 | **Von:** Jack | **Für:** Linus
**Prio:** P1 | **Effort:** XS (Sidebar-Item + optional FAQ-Eintrag)
**Backlog-Ref:** JK-13 (entstanden aus JK-10 Lauf 1 Claude.ai Q5 USP-Befund)

---

## TL;DR

JK-10 Lauf 1 hat einen wertvollen positiven Befund geliefert: **Claude.ai (Q5) ist das einzige AI-Surface in 20 Antworten, das die Geld-zurück-Garantie als USP nennt.** Wortgetreu:

> "Lebenslange Geld-zurück-Garantie per formloser Mail."

Gemini, ChatGPT und Perplexity haben den USP in allen Q5-Antworten ausgelassen — obwohl er auf der Homepage und im FAQ vorhanden ist. **Grund:** Auf `/mitglied-werden` (der direkten Conversion-Seite) wird die Garantie aktuell überhaupt nicht erwähnt. Die Sidebar listet Preise, Zahlung, Referral-Bonus — aber keinen Trust-Anker.

**Fix:** Ein Sidebar-Eintrag auf `/mitglied-werden` plus optional ein dedizierter FAQ-Eintrag. Effort XS, Conversion-Hebel hoch.

---

## Warum dieser Brief

**JK-10 Lauf 1 Claude.ai Q5 (2026-05-27):**

> "Zahlung per Banküberweisung oder PayPal. **Lebenslange Geld-zurück-Garantie per formloser Mail.** [Oakwoodgolfclub](https://Oakwoodgolfclub.de)"

Claude hat das aus irgendeiner Quelle der Site extrahiert (vermutlich `MoneyBackGuarantee`-Component auf Homepage oder FAQ-Bereich). **Aber:** in den 19 anderen Antworten taucht der USP nirgends auf. Insbesondere:

- ChatGPT Q5 erwähnt 12 Monate, kein Auto-Renewal, Banküberweisung/PayPal — aber keine Garantie.
- Gemini Q5 erwähnt OGC nicht einmal (Disambiguations-Failure — JK-11 adressiert).
- Perplexity Q5 erwähnt Konditionen, Anmeldung, 48-Stunden-Reaktion — keine Garantie.

**ChatGPT-Thinking-Beobachtung (Q3):** Der Thinking-Modus baut Skeptiker-Mail-Templates ("Erst buchen, wenn schriftlich bestätigt"). Genau gegen so eine Conversion-Bremse hilft eine sichtbare Geld-zurück-Garantie direkt im Conversion-Funnel. Wer hier landet hat die Kaufentscheidung schon vorbereitet — der Trust-Anker im richtigen Moment dreht Zögerer.

**Synergie mit JK-2:** JK-2 fixiert das Placement der Money-Back-Component auf der Homepage (zwischen Pricing und FAQ-Teaser). JK-13 zieht den Trust-Anker einen Schritt weiter im Funnel — auf die Conversion-Seite selbst.

---

## Befund: Aktueller /mitglied-werden-Stand

`app/mitglied-werden/page.tsx` Sidebar-Items (Stand 2026-05-26):

1. **Einzelmitgliedschaft** — 55 EUR / 12 Monate / 1 Karte
2. **Flight-Mitgliedschaft** — 143 EUR / 12 Monate / 4 Karten
3. **Zahlung** — Banküberweisung/PayPal, kein Abo, kein Lastschrift-Einzug, kein Auto-Renewal
4. **Referral-Bonus** — 10 EUR auf Verlängerung pro geworbenem Mitglied

**Was fehlt:** Eine Sidebar-Card zum Trust-Anker Geld-zurück-Garantie. Keine sichtbare Position für den stärksten Risk-Reversal-USP des Clubs an dem Punkt, an dem der Nutzer die Kaufentscheidung trifft.

---

## Fix 1 (PFLICHT): Sidebar-Item auf /mitglied-werden

In `app/mitglied-werden/page.tsx` zwischen "Zahlung" und "Referral-Bonus" ein neues `<div>` einfügen:

```tsx
<div>
  <dt className="font-medium text-[var(--color-ink)]">
    Geld-zurück-Garantie
  </dt>
  <dd className="mt-1 text-[var(--color-ink)]/75">
    Wenn die Mitgliedschaft nicht passt — formlose E-Mail an{" "}
    <a
      href="mailto:info@oakwoodgolfclub.de"
      className="underline underline-offset-2"
    >
      info@oakwoodgolfclub.de
    </a>
    , Geld zurück. Ohne Begründung, ohne Frist. Vertraglich
    verankert in AGB § 8.
  </dd>
</div>
```

**Begründung der Formulierung:**

- **"Wenn die Mitgliedschaft nicht passt"** — direkter Einwand-Schließer. Adressiert die rationale Frage "Was passiert wenn's nicht funktioniert?".
- **"Formlose E-Mail"** — niedrige Friction. Kein Formular, kein Kündigungs-Prozess.
- **Mailto-Link** — direkt klickbar. Verschnellert das mentale Modell "ich kann jederzeit raus".
- **"Ohne Begründung, ohne Frist"** — die zwei kritischen Konditionen, präzise.
- **AGB § 8 Anker** — vertrauensschaffender Verweis, ohne dass der Nutzer wirklich in die AGB gehen muss.

**Layout-Hinweis:** Die Sidebar wird visuell länger. Falls Linus das zu schwer findet, kann das Geld-zurück-Item auch oberhalb der Preise stehen als sichtbarer Trust-Anker bevor der Preis verglichen wird. **Empfehlung Jack:** zwischen Zahlung und Referral-Bonus — der Nutzer geht die Liste in dieser Reihenfolge mental ab: Preis → Zahlung → "Was wenn?" (= Geld-zurück) → Bonus.

---

## Fix 2 (OPTIONAL): FAQ-Eintrag für "Wie funktioniert die Geld-zurück-Garantie?"

In `content/faqs-curated.ts` ein neuer Eintrag in der Category `mitgliedschaft`:

```typescript
{
  slug: "wie-funktioniert-die-geld-zurueck-garantie",
  question: "Wie funktioniert die Geld-zurück-Garantie?",
  answer: `Wenn dir die Mitgliedschaft nicht passt — egal aus welchem Grund — bekommst du dein Geld zurück. Du schreibst formlos eine E-Mail an info@oakwoodgolfclub.de mit der Bitte um Rückerstattung. Eine Begründung brauchst du nicht zu nennen. Eine Frist gibt es nicht.

Das Versprechen gilt vertraglich, verankert in AGB § 8. In den 18 Jahren, in denen es uns gibt, haben es vier bis fünf Mitglieder genutzt — kein Aktivismus, sondern Erwachsenen-Vertrag.

Die Rückerstattung erfolgt auf das Konto, von dem die Zahlung kam (Banküberweisung oder PayPal). Übliche Bearbeitungsdauer: wenige Werktage.

Diese Garantie ist Teil unseres Selbstverständnisses — eine Fernmitgliedschaft soll dir Sicherheit geben, nicht ein Risiko aufzwingen. Wenn die Karte nicht das tut, was sie soll, oder dein Lebensumstand sich ändert, bist du nicht gebunden.`,
  category: "mitgliedschaft",
  published: true,
},
```

**Begründung:**

- **AI-Citation-Fenster:** 145 Wörter, im Ideal-Bereich 120–150.
- **Eröffnungssatz beantwortet die Frage direkt** — kein narratives Vorgeplänkel.
- **"In den 18 Jahren, vier bis fünf Mitglieder"** — Story-Anchor aus dem User-O-Ton (siehe JK-2 Brief).
- **"Kein Aktivismus, sondern Erwachsenen-Vertrag"** — Brand-Voice, signalisiert Reife.
- **AGB § 8 wieder** — konsistent mit Sidebar-Verweis.
- **Eigene Category `mitgliedschaft`** statt `garantie`, da AIs dann den Eintrag in der Kategorie-Frage "Wie funktioniert die Oakwood-Mitgliedschaft?" mit-extrahieren.

**Optional weil:** der Sidebar-Eintrag aus Fix 1 ist der Conversion-Hebel; der FAQ-Eintrag ist die AI-Citation-Verstärkung. Falls Linus pragmatisch nur einen Fix machen will: Fix 1 ist PFLICHT, Fix 2 kann später.

---

## Akzeptanzkriterien

- [ ] Sidebar auf `/mitglied-werden` enthält neuen "Geld-zurück-Garantie"-Eintrag zwischen "Zahlung" und "Referral-Bonus".
- [ ] Mailto-Link funktioniert (klickt zur Standard-Mail-App mit korrektem Empfänger).
- [ ] Mobile-Layout der Sidebar bleibt clean (kein Overflow, kein Line-Break-Bruch).
- [ ] Lighthouse 95+ desktop + mobile unverändert.
- [ ] (Falls Fix 2 implementiert) Neuer FAQ-Eintrag `wie-funktioniert-die-geld-zurueck-garantie` ist in `/faq` sichtbar, FAQPage-JSON-LD enthält Q&A.
- [ ] Build grün, Lint grün.

---

## Out of Scope (nicht in JK-13)

- Komplette Money-Back-Component auf `/mitglied-werden` einbauen — die Component ist als Homepage-Section konzipiert, nicht als Sidebar-Item. JK-13 ist die Conversion-Seite-Variante.
- AGB-Section umformulieren — § 8 bleibt unverändert. JK-13 verlinkt nur drauf.
- Animations- oder Hover-Effekte auf der Garantie-Card — bleibt textlich, kein Showstopper-Treatment.

---

## Verknüpfungen

- **Auslöser:** JK-10 Lauf 1 Claude.ai Q5 USP-Befund
- **Synergie mit:** JK-2 (Money-Back-Component Homepage-Placement)
- **Synergie mit:** AGB § 8 (Quelle der vertraglichen Verankerung — unverändert)
- **Folge-Test:** JK-10 Lauf 2 — sollte die Garantie nach Implementation in mehr als nur Claude.ai Q5-Antworten auftauchen.
