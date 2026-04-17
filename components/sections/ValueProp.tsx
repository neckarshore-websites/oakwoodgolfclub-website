/**
 * Value-proposition grid — 4 pillars of OGC Fernmitgliedschaft.
 * Each card opens with a direct citable sentence (AI answer-engine friendly).
 */

const PILLARS = [
  {
    title: "Kein Auto-Renewal",
    body: "Deine Mitgliedschaft verlängert sich nicht automatisch. Jede Verlängerung löst du aktiv aus — keine ungewollten Abbuchungen, keine Kündigungsfristen im Kleingedruckten.",
  },
  {
    title: "Flexibler Startmonat",
    body: "Die 12-Monats-Laufzeit beginnt an dem Tag, den du wählst. Du musst nicht auf einen Stichtag warten und zahlst keinen angebrochenen Monat mit.",
  },
  {
    title: "Recreational Handicap",
    body: "Alle Runden zählen, nicht nur Turniere. Das Recreational-Modell bildet dein tatsächliches Spiel ab — besonders relevant für Spieler ohne festen Heimatplatz.",
  },
  {
    title: "Anerkannte Mitgliederkarte",
    body: "Die offizielle Mitgliederkarte des Oakwood Golf Club wird auf rund 95 % der österreichischen Golfplätze akzeptiert. Plastikkarte, kein PDF-Ausdruck.",
  },
] as const;

export function ValueProp() {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-parchment)] py-20 md:py-24">
      <div className="container-page">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">
            Warum Oakwood
          </p>
          <h2 className="font-heading text-3xl leading-tight tracking-tight md:text-4xl">
            Vier Dinge, die anders sind als bei klassischen Golfclubs.
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => (
            <article
              key={pillar.title}
              className="group relative border-t border-[var(--color-ink)]/10 pt-6"
            >
              <div
                aria-hidden
                className="absolute -top-px left-0 h-[2px] w-8 bg-[var(--color-gold)] transition-all duration-500 group-hover:w-full"
              />
              <h3 className="font-heading text-xl tracking-tight text-[var(--color-ink)]">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink)]/70">
                {pillar.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
