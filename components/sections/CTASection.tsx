import Link from "next/link";
import { SITE } from "@/lib/site-config";

/**
 * Closing CTA — quiet, confident. No urgency theatre.
 * Uses the dark Fairway-Grün surface to punctuate the end of the page.
 */
export function CTASection() {
  return (
    <section className="bg-[var(--color-fairway)] text-[var(--color-parchment)]">
      <div className="container-page py-20 md:py-24">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
              Seit {SITE.founded}
            </p>
            <h2 className="font-heading text-3xl leading-tight tracking-tight md:text-4xl lg:text-5xl">
              {SITE.memberCount}+ Golfer vertrauen uns.<br />
              Werde der oder die Nächste.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-parchment)]/80">
              16 Jahre Erfahrung mit Fernmitgliedschaften. Transparente Preise,
              kein Auto-Renewal, echter Kundenservice per E-Mail — bearbeitet
              aus Thailand, in der Regel innerhalb von 24 Stunden.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:col-span-4">
            <Link
              href="/mitglied-werden"
              className="inline-flex items-center justify-center rounded-sm bg-[var(--color-gold)] px-6 py-4 text-base font-medium text-[var(--color-ink)] transition-opacity hover:opacity-90"
            >
              Jetzt Mitglied werden
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center rounded-sm border border-[var(--color-parchment)]/30 px-6 py-4 text-base font-medium text-[var(--color-parchment)] transition-colors hover:border-[var(--color-parchment)]"
            >
              Frage stellen
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
