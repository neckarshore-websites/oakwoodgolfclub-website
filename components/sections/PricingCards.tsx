import Link from "next/link";
import { PRICING } from "@/lib/site-config";

/**
 * Pricing — two tiers plus the referral bonus as a subtle accent.
 * Gold is used sparingly here on the "Flight" badge (Premium-Signal).
 * No "Most popular" banners, no urgency tactics — quiet, honest pricing.
 */
export function PricingCards() {
  return (
    <section
      id="preise"
      className="border-b border-[var(--color-border)] bg-[var(--color-sand)]/40 py-20 md:py-24"
    >
      <div className="container-page">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">
            Preise
          </p>
          <h2 className="font-heading text-3xl leading-tight tracking-tight md:text-4xl">
            Zwei klare Optionen. Keine versteckten Kosten.
          </h2>
          <p className="mt-4 max-w-xl text-base text-[var(--color-ink)]/70">
            Bezahlt wird per Banküberweisung. Die 12-Monats-Laufzeit beginnt an
            dem Tag, den du wählst. Keine automatische Verlängerung.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Individual */}
          <article className="flex flex-col border border-[var(--color-ink)]/10 bg-[var(--color-parchment)] p-8 md:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Für eine Person
            </p>
            <h3 className="mt-2 font-heading text-2xl tracking-tight">
              {PRICING.individual.label}
            </h3>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-heading text-5xl tracking-tight text-[var(--color-fairway)]">
                €{PRICING.individual.priceEur}
              </span>
              <span className="text-sm text-[var(--color-muted)]">
                / {PRICING.individual.term}
              </span>
            </div>
            <ul className="mt-8 space-y-3 text-sm text-[var(--color-ink)]/80">
              <li>· Offizielle Mitgliederkarte (Plastik)</li>
              <li>· Handicap-Verwaltung (Recreational)</li>
              <li>· Flexibler Startmonat</li>
              <li>· Kein Auto-Renewal</li>
            </ul>
            <Link
              href="/mitglied-werden"
              className="mt-10 inline-flex items-center justify-center rounded-sm bg-[var(--color-fairway)] px-6 py-3 text-sm font-medium text-[var(--color-parchment)] transition-colors hover:bg-[var(--color-fairway-hover)]"
            >
              Einzelmitgliedschaft starten
            </Link>
          </article>

          {/* Flight */}
          <article className="relative flex flex-col border border-[var(--color-fairway)]/30 bg-[var(--color-parchment)] p-8 md:p-10">
            <span className="absolute right-8 top-8 rounded-sm bg-[var(--color-gold)]/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
              Bester Preis / Person
            </span>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Für 4 Personen
            </p>
            <h3 className="mt-2 font-heading text-2xl tracking-tight">
              {PRICING.flight.label}
            </h3>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-heading text-5xl tracking-tight text-[var(--color-fairway)]">
                €{PRICING.flight.priceEur}
              </span>
              <span className="text-sm text-[var(--color-muted)]">
                / {PRICING.flight.term}
              </span>
            </div>
            <p className="mt-2 text-xs text-[var(--color-muted)]">
              €35,75 pro Person — statt 4 × €55 = €220
            </p>
            <ul className="mt-8 space-y-3 text-sm text-[var(--color-ink)]/80">
              <li>· 4 Mitgliederkarten</li>
              <li>· 4 Handicap-Accounts</li>
              <li>· Flexible Startmonate pro Person</li>
              <li>· Kein Auto-Renewal</li>
            </ul>
            <Link
              href="/mitglied-werden"
              className="mt-10 inline-flex items-center justify-center rounded-sm bg-[var(--color-fairway)] px-6 py-3 text-sm font-medium text-[var(--color-parchment)] transition-colors hover:bg-[var(--color-fairway-hover)]"
            >
              Flight-Mitgliedschaft starten
            </Link>
          </article>
        </div>

        <p className="mt-8 text-sm text-[var(--color-muted)]">
          <span className="text-[var(--color-gold)]">★</span>{" "}
          <strong>Referral-Bonus:</strong> Für jedes neue Mitglied, das du wirbst,
          erhältst du €{PRICING.referralBonusEur} auf deine nächste Verlängerung
          gutgeschrieben.
        </p>
      </div>
    </section>
  );
}
