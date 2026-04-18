import Link from "next/link";

/**
 * "Tools, die wir empfehlen" — small Landing-Page section.
 *
 * Placement: between FAQTeaser and CTASection. Rationale: by the time a
 * visitor scrolls past the FAQ they're either pre-decided ("ich melde
 * mich an") or research-mode ("was muss ich noch wissen?"). Surfacing
 * concrete tool-recommendations to the research-mode reader is more
 * useful than another generic CTA.
 *
 * v1 carries one entry — StrokesIn for Handicap-Tracking, per User
 * direction 04-18 ("der Punkt ist eigentlich wichtig, weil wir die
 * Handicap-Verwaltung darüber propagieren möchten — gehört für mich
 * auch auf die Landing Page"). Designed as a list so adding the next
 * recommendation later is one entry, no layout rework.
 */

type Tool = {
  /** Eyebrow above the tool name — what category. */
  eyebrow: string;
  /** Short, descriptive name shown as the headline. */
  name: string;
  /** One-sentence reason we recommend it. */
  blurb: string;
  /** Target post on /blog. */
  href: string;
  /** Visible label on the link. */
  cta: string;
};

const TOOLS: Tool[] = [
  {
    eyebrow: "Scorecard & Handicap",
    name: "StrokesIn",
    blurb:
      "Die Scorecard- und Handicap-App, die wir Mitgliedern empfehlen. WHS-konform, drei Eingabe-Methoden (manuell, Foto-Scan, Voice-Diktat), starke Statistik-Funktionen.",
    href: "/blog/strokesin-app-empfehlung",
    cta: "Im Blog vorgestellt →",
  },
];

export function Tools() {
  return (
    <section
      aria-labelledby="tools-heading"
      className="border-b border-[var(--color-border)] bg-[var(--color-sand)]/40 py-20 md:py-24"
    >
      <div className="container-page">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
            Tools, die wir empfehlen
          </p>
          <h2
            id="tools-heading"
            className="font-heading text-3xl leading-tight tracking-tight md:text-4xl"
          >
            Wenn du dein Spiel ehrlich verstehen willst.
          </h2>
          <p className="mt-4 max-w-xl text-base text-[var(--color-ink)]/70">
            Nichts gesponsert. Nichts mit Affiliate-Pflicht. Nur Produkte,
            die wir selbst nutzen oder Mitgliedern guten Gewissens
            weiterempfehlen.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <article
              key={tool.name}
              className="flex flex-col rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] p-6 transition-colors hover:border-[var(--color-fairway)]"
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-deep)]">
                {tool.eyebrow}
              </p>
              <h3 className="font-heading text-2xl tracking-tight text-[var(--color-ink)]">
                {tool.name}
              </h3>
              <p className="mt-3 flex-grow text-sm leading-relaxed text-[var(--color-ink)]/75">
                {tool.blurb}
              </p>
              <Link
                href={tool.href}
                className="mt-5 inline-flex items-center text-sm font-medium text-[var(--color-fairway)] underline-offset-4 hover:underline hover:text-[var(--color-fairway-hover)]"
              >
                {tool.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
