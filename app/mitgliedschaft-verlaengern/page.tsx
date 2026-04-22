import type { Metadata } from "next";
import { RenewalForm } from "@/components/forms/RenewalForm";
import { pageOpenGraph } from "@/lib/site-config";

const PAGE_TITLE = "Mitgliedschaft verlängern";
const PAGE_DESCRIPTION =
  "Bestehende Oakwood-Golf-Club-Mitgliedschaft für weitere 12 Monate verlängern. Kein Auto-Renewal — aktive Verlängerung.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/mitgliedschaft-verlaengern" },
  openGraph: pageOpenGraph({
    path: "/mitgliedschaft-verlaengern",
    title: `${PAGE_TITLE} — Oakwood Golf Club`,
    description: PAGE_DESCRIPTION,
  }),
};

export default function VerlaengernPage() {
  return (
    <article className="container-page py-20 md:py-24">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
        Verlängern
      </p>
      <h1
        id="renewal-heading"
        className="font-heading text-4xl tracking-tight md:text-5xl lg:text-6xl"
      >
        Noch ein Jahr dabei.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink)]/80">
        Kein Auto-Renewal — jede Verlängerung läuft aktiv durch dich. Fülle
        das Formular aus, wir schicken dir die neuen Zahlungsdetails
        zeitnah, in der Regel innerhalb weniger Tage. Neue
        12-Monats-Laufzeit beginnt am gewählten Startmonat.
      </p>

      <div className="mt-14 grid gap-14 md:grid-cols-5">
        <div className="md:col-span-3">
          <RenewalForm />
        </div>

        <aside className="md:col-span-2 md:pl-8 md:border-l md:border-[var(--color-ink)]/10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Gut zu wissen
          </p>
          <dl className="mt-4 space-y-6 text-sm">
            <div>
              <dt className="font-medium text-[var(--color-ink)]">
                Keine Kündigungsfrist
              </dt>
              <dd className="mt-1 text-[var(--color-ink)]/75">
                Deine Mitgliedschaft endet automatisch nach 12 Monaten. Wenn
                du nicht verlängerst, passiert nichts — keine versteckten
                Gebühren, kein Auto-Renewal.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-[var(--color-ink)]">
                Mitgliederkarte
              </dt>
              <dd className="mt-1 text-[var(--color-ink)]/75">
                Nach der Verlängerung bekommst du eine aktuelle Karte
                (neue Gültigkeit) per Post an die angegebene Adresse.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-[var(--color-ink)]">
                Mitgliedsnummer unbekannt?
              </dt>
              <dd className="mt-1 text-[var(--color-ink)]/75">
                Kein Problem — trage eine beliebige Zahl ein. Wir finden dich
                im Bestand über Name und aktuelle E-Mail-Adresse.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-[var(--color-ink)]">
                Wechsel Einzel ↔ Flight · Referral-Bonus
              </dt>
              <dd className="mt-1 text-[var(--color-ink)]/75">
                Hinweise auf Tier-Wechsel oder Gutschriften einfach in das
                Nachrichtenfeld schreiben.
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </article>
  );
}
