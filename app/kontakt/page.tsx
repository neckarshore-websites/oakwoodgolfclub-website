import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { MAILTO_FEEDBACK, pageOpenGraph, SITE } from "@/lib/site-config";

const PAGE_TITLE = "Kontakt";
const PAGE_DESCRIPTION =
  "Kontaktformular und direkte E-Mail-Adresse des Oakwood Golf Club. Antwort in der Regel innerhalb weniger Tage.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/kontakt" },
  openGraph: pageOpenGraph({
    path: "/kontakt",
    title: `${PAGE_TITLE} — ${SITE.name}`,
    description: PAGE_DESCRIPTION,
  }),
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
        am bequemsten ist. Wir antworten zeitnah per E-Mail — in der
        Regel innerhalb weniger Tage.
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
                  href={MAILTO_FEEDBACK}
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
                In der Regel wenige Tage, werktags.
              </dd>
            </div>
            <div>
              <dt className="text-[var(--color-muted)]">Seit</dt>
              <dd className="mt-0.5 text-[var(--color-ink)]/85">
                {SITE.founded} — {SITE.memberCount}+ Fernmitgliedschaften
                im DACH-Raum.
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </article>
  );
}
