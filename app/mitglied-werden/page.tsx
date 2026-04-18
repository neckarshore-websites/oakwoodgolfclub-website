import type { Metadata } from "next";
import { SignupForm } from "@/components/forms/SignupForm";
import { PRICING } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Mitglied werden",
  description:
    "Fernmitgliedschaft im Oakwood Golf Club beantragen. Einzel €55 / Jahr, Flight €143 / Jahr für 4 Personen. Kein Auto-Renewal.",
  alternates: { canonical: "/mitglied-werden" },
};

export default function MitgliedWerdenPage() {
  return (
    <article className="container-page py-20 md:py-24">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
        Mitglied werden
      </p>
      <h1
        id="signup-heading"
        className="font-heading text-4xl tracking-tight md:text-5xl lg:text-6xl"
      >
        In zwei Minuten beigetreten.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink)]/80">
        Fülle das Formular aus — wir melden uns in der Regel innerhalb
        von 48 Stunden mit den Zahlungsdetails. Die Mitgliedschaft wird
        mit dem Empfang Deiner Clubkarte bei Dir aktiv und läuft
        mindestens 12 Monate ab dem von dir gewählten Startmonat.
      </p>

      <div className="mt-14 grid gap-14 md:grid-cols-5">
        <div className="md:col-span-3">
          <SignupForm />
        </div>

        <aside className="md:col-span-2 md:pl-8 md:border-l md:border-[var(--color-ink)]/10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Preise
          </p>
          <dl className="mt-4 space-y-6 text-sm">
            <div>
              <dt className="font-medium text-[var(--color-ink)]">
                {PRICING.individual.label}
              </dt>
              <dd className="mt-1 text-[var(--color-ink)]/75">
                €{PRICING.individual.priceEur} für 12 Monate —
                1 Mitgliederkarte.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-[var(--color-ink)]">
                {PRICING.flight.label}
              </dt>
              <dd className="mt-1 text-[var(--color-ink)]/75">
                €{PRICING.flight.priceEur} für 12 Monate —
                4 Mitgliederkarten, €35,75 pro Person.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-[var(--color-ink)]">
                Zahlung
              </dt>
              <dd className="mt-1 text-[var(--color-ink)]/75">
                Banküberweisung oder PayPal. Kein Abo, kein
                Lastschrift-Einzug, kein Auto-Renewal.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-[var(--color-ink)]">
                Referral-Bonus
              </dt>
              <dd className="mt-1 text-[var(--color-ink)]/75">
                €{PRICING.referralBonusEur} auf deine Verlängerung pro
                geworbenem neuen Mitglied.
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </article>
  );
}
