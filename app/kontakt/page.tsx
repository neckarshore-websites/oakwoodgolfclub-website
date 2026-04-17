import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontaktformular und direkte E-Mail-Adresse des Oakwood Golf Club. Antwort in der Regel innerhalb von 24 Stunden.",
  alternates: { canonical: "/kontakt" },
};

export default function KontaktPage() {
  return (
    <article className="container-page py-20 md:py-24">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
        Kontakt
      </p>
      <h1
        id="kontakt-heading"
        className="font-heading text-4xl tracking-tight md:text-5xl lg:text-6xl"
      >
        Sprich direkt mit uns.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink)]/80">
        Schreib uns, ruf an, oder nutze das Formular — je nachdem, was für dich
        am bequemsten ist. Wir antworten in der Regel innerhalb von 24 Stunden,
        bearbeitet aus Thailand per E-Mail.
      </p>

      <div className="mt-14 grid gap-14 md:grid-cols-5">
        <div className="md:col-span-3">
          <ContactForm />
        </div>

        <aside className="md:col-span-2 md:pl-8 md:border-l md:border-[var(--color-ink)]/10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Direkt
          </p>
          <dl className="mt-4 space-y-5 text-sm">
            <div>
              <dt className="text-[var(--color-muted)]">E-Mail</dt>
              <dd className="mt-0.5">
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-[var(--color-fairway)] underline underline-offset-4 hover:text-[var(--color-fairway-hover)]"
                >
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[var(--color-muted)]">Telefon</dt>
              <dd className="mt-0.5">
                <a
                  href={`tel:${SITE.phone}`}
                  className="text-[var(--color-ink)]"
                >
                  {SITE.phoneDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[var(--color-muted)]">Antwortzeit</dt>
              <dd className="mt-0.5 text-[var(--color-ink)]/85">
                In der Regel &lt; 24 Stunden, werktags.
              </dd>
            </div>
            <div>
              <dt className="text-[var(--color-muted)]">Betrieb</dt>
              <dd className="mt-0.5 text-[var(--color-ink)]/85">
                Aus Thailand. Mitglieder primär in Deutschland, Österreich,
                der Schweiz.
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </article>
  );
}
