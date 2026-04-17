import Link from "next/link";

/**
 * FAQ teaser on the homepage — four high-traffic questions.
 * Full FAQ with schema.org FAQPage JSON-LD lives at /faq (B6).
 *
 * Native <details>/<summary> for zero-JS expand/collapse.
 */

const FAQ_PREVIEW = [
  {
    q: "Wie funktioniert eine Fernmitgliedschaft?",
    a: "Du wirst offizielles Mitglied im Oakwood Golf Club, ohne an einen festen Heimatplatz gebunden zu sein. Du erhältst eine offizielle Mitgliederkarte und einen Handicap-Account. Damit kannst du auf Gastplätzen spielen, die eine Vereinszugehörigkeit voraussetzen — insbesondere in Österreich.",
  },
  {
    q: "Wo wird die Mitgliederkarte akzeptiert?",
    a: "Die Mitgliederkarte wird auf rund 95 % der österreichischen Golfplätze akzeptiert. In Deutschland und der Schweiz gibt es je nach Platz unterschiedliche Regelungen — im Zweifel vorab beim Platz anrufen.",
  },
  {
    q: "Wie wird mein Handicap verwaltet?",
    a: "Wir führen dein Handicap nach dem Recreational-Modell: Alle Runden zählen, nicht nur Turniere. Du reichst deine Scorecards bei uns ein, wir aktualisieren dein Handicap und stellen dir ein jährliches Handicap-Zertifikat aus.",
  },
  {
    q: "Gibt es ein Auto-Renewal?",
    a: "Nein. Deine Mitgliedschaft läuft nach 12 Monaten automatisch aus. Du entscheidest aktiv, ob du verlängern möchtest. Keine Kündigung nötig, keine versteckten Gebühren.",
  },
] as const;

export function FAQTeaser() {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-parchment)] py-20 md:py-24">
      <div className="container-page">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">
            Häufig gefragt
          </p>
          <h2 className="font-heading text-3xl leading-tight tracking-tight md:text-4xl">
            Die wichtigsten Antworten in Kurzform.
          </h2>
        </div>

        <div className="divide-y divide-[var(--color-ink)]/10 border-y border-[var(--color-ink)]/10">
          {FAQ_PREVIEW.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between py-5 pr-2 text-left transition-colors hover:text-[var(--color-fairway)]">
                <span className="font-heading text-lg tracking-tight">
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className="ml-4 text-xl text-[var(--color-muted)] transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-6 pr-10 text-base leading-relaxed text-[var(--color-ink)]/75">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/faq"
            className="inline-flex items-center text-sm font-medium text-[var(--color-fairway)] hover:text-[var(--color-fairway-hover)]"
          >
            Alle FAQs ansehen →
          </Link>
        </div>
      </div>
    </section>
  );
}
