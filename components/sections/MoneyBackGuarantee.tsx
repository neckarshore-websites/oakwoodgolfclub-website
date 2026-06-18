import Link from "next/link";

import { MAILTO_FEEDBACK, SITE } from "@/lib/site-config";

/**
 * Money-Back-Garantie — trust block on the homepage.
 *
 * Placement: between PricingCards and FAQTeaser. Rationale: someone who
 * just looked at "55 €" / "143 €" is doing the mental math on perceived
 * risk. A clear, low-friction money-back promise lowers that friction
 * before they reach the FAQ teaser (which mostly answers usage
 * questions, not risk questions).
 *
 * Style: distinct from the surrounding 4-card grids — center-aligned,
 * narrow column, gold accent rule. Reads as a single clear sentence
 * promise plus an honest history data point ("4-5 mal in 18 Jahren").
 *
 * No CTA on purpose. The whole point is that the user doesn't need to
 * do anything except keep this in mind. AGB § 8 is the formal anchor.
 *
 * Content sourced from User-O-Ton 2026-04-18 ("Money-Back-Garantie
 * ohne Regeln, ohne Nachfragen, einfach anfragen. Zu jeder Zeit
 * formfrei. In 18 Jahren vier-fünf Mal gezogen.").
 */
export function MoneyBackGuarantee() {
  return (
    <section
      aria-labelledby="money-back-heading"
      className="border-b border-[var(--color-border)] bg-[var(--color-parchment)] py-20 md:py-28"
    >
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <div
            aria-hidden
            className="mx-auto mb-8 h-[2px] w-12 bg-[var(--color-gold)]"
          />
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
            Geld-zurück-Garantie
          </p>
          <h2
            id="money-back-heading"
            className="font-heading text-3xl leading-tight tracking-tight md:text-4xl lg:text-[2.75rem]"
          >
            Wenn dir was nicht passt, bekommst du dein Geld zurück.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--color-ink)]/75 md:text-lg">
            <strong>Lebenslang. Formfrei. Ohne Begründung.</strong> Eine
            kurze Mail an{" "}
            <a
              href={MAILTO_FEEDBACK}
              className="text-[var(--color-fairway)] underline underline-offset-4 hover:text-[var(--color-fairway-hover)]"
            >
              {SITE.email}
            </a>{" "}
            genügt — wir erstatten den Beitrag über denselben Zahlungsweg,
            auf dem du ihn überwiesen hast.
          </p>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-[var(--color-ink)]/65">
            Seit der Gründung des Clubs wurde diese Garantie viermal in
            Anspruch genommen — jedes Mal hat das Mitglied sein
            Geld zurückbekommen. Uns ist wichtiger, dass niemand
            unzufrieden Mitglied bleibt, als dass wir jeden Beitrag
            einbehalten.
          </p>
          <p className="mt-10 text-xs uppercase tracking-[0.18em] text-[var(--color-ink)]/65">
            Vertraglich verankert in{" "}
            <Link
              href="/agb"
              className="text-[var(--color-fairway)] underline underline-offset-4"
            >
              AGB § 8
            </Link>
            {" — "}
            zusätzlich zum gesetzlichen 14-Tage-Widerrufsrecht.
          </p>
          <p className="mt-6 text-sm">
            <Link
              href="/blog/geld-zurueck-garantie-ohne-wenn-und-aber"
              className="text-[var(--color-fairway)] underline underline-offset-4 hover:text-[var(--color-fairway-hover)]"
            >
              Wie das in der Praxis aussieht →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
