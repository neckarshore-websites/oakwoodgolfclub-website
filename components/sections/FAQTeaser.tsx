import Link from "next/link";

/**
 * FAQ teaser on the homepage — four high-traffic questions.
 * Full FAQ with schema.org FAQPage JSON-LD lives at /faq (B6).
 *
 * Native <details>/<summary> for zero-JS expand/collapse.
 */

type FaqItem = {
  q: string;
  a: string;
  /**
   * Optional inline call-out below the answer. Used today on the
   * Handicap question to point readers at the StrokesIn app-empfehlung
   * post (User-Direktive 04-18: StrokesIn als Handicap-Tracking
   * propagieren).
   */
  link?: {
    prefix: string;
    text: string;
    href: string;
    suffix?: string;
  };
};

const FAQ_PREVIEW: readonly FaqItem[] = [
  {
    q: "Wie funktioniert eine Fernmitgliedschaft?",
    a: "Du wirst offizielles Mitglied im Oakwood Golf Club, ohne an einen festen Heimatplatz gebunden zu sein. Du erhältst eine offizielle Mitgliederkarte und kannst damit auf Gastplätzen spielen, die eine Vereinszugehörigkeit voraussetzen — insbesondere in Österreich.",
  },
  {
    q: "Wo wird die Mitgliederkarte akzeptiert?",
    a: "Die Mitgliederkarte wird auf rund 95 % der österreichischen Golfplätze akzeptiert. In Deutschland und der Schweiz gibt es je nach Platz unterschiedliche Regelungen — im Zweifel vorab beim Platz anrufen.",
  },
  {
    q: "Warum verarbeitet ihr aktuell keine Handicaps?",
    a: "Handicap-Verwaltung war über Jahre Teil der Mitgliedschaft, wird aktuell aber nicht aktiv angeboten. Dein Handicap erfasst du beim Signup selbst — ohne Verifizierung. Wenn du ein offizielles Handicap führst, nutze dafür die Systeme deines Heimat- oder Gastplatzes. Eine eigene Recreational-Handicap-Lösung ist in Planung, hat aber keinen festen Termin.",
    link: {
      prefix: "Unsere App-Empfehlung fürs Handicap-Tracking:",
      text: "StrokesIn",
      href: "/blog/strokesin-app-empfehlung",
      suffix: "— im Blog vorgestellt.",
    },
  },
  {
    q: "Gibt es ein Auto-Renewal?",
    a: "Nein. Deine Mitgliedschaft läuft nach 12 Monaten automatisch aus. Du entscheidest aktiv, ob du verlängern möchtest. Keine Kündigung nötig, keine versteckten Gebühren.",
  },
];

export function FAQTeaser() {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-parchment)] py-20 md:py-24">
      <div className="container-page">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
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
              <p className="pb-2 pr-10 text-base leading-relaxed text-[var(--color-ink)]/75">
                {item.a}
              </p>
              {item.link && (
                <p className="pb-6 pr-10 text-sm text-[var(--color-ink)]/65">
                  {item.link.prefix}{" "}
                  <Link
                    href={item.link.href}
                    className="font-medium text-[var(--color-fairway)] underline-offset-4 hover:underline hover:text-[var(--color-fairway-hover)]"
                  >
                    {item.link.text}
                  </Link>
                  {item.link.suffix ? ` ${item.link.suffix}` : ""}
                </p>
              )}
              {!item.link && <div className="pb-4" />}
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
