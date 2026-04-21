import type { Metadata } from "next";
import Link from "next/link";
import { GolfFlag } from "@/components/icons/GolfIcons";

/**
 * Custom 404 — "Fore!" (the golf warning shout when a ball flies off-line).
 * Brand-consistent: Fairway-Grün, Gold-Accent, Playfair-Serif for the big
 * word, Inter for body. Noindex so Google does not treat it as a real page.
 *
 * Rendered inside the root layout, so Nav + Footer come for free.
 */

export const metadata: Metadata = {
  title: "Fore! · Seite nicht gefunden",
  description:
    "Diese Seite ist aus dem Fairway geflogen. Zurück zur Startseite oder zu den Mitgliedschafts-Infos.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <section className="container-page flex flex-col items-center py-24 text-center md:py-32">
      <div
        className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-sand)] text-[var(--color-fairway)] md:h-24 md:w-24"
        aria-hidden="true"
      >
        <GolfFlag size={44} strokeWidth={1.5} />
      </div>

      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold-deep)]">
        404 · Seite nicht gefunden
      </p>

      <h1 className="font-heading text-6xl tracking-tight text-[var(--color-fairway)] md:text-8xl">
        Fore!
      </h1>

      <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-ink)]/70 md:text-lg">
        Diese Seite ist aus dem Fairway geflogen. Vielleicht liegt sie im Rough,
        vielleicht im Bunker — hier ist sie jedenfalls nicht.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-[var(--color-fairway)] px-6 py-3 text-sm font-semibold text-[var(--color-parchment)] transition-colors hover:bg-[var(--color-fairway-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-fairway)]"
        >
          Zurück zur Startseite
        </Link>
        <Link
          href="/mitglied-werden"
          className="inline-flex items-center text-sm font-medium text-[var(--color-fairway)] hover:text-[var(--color-fairway-hover)]"
        >
          Oder Mitglied werden →
        </Link>
      </div>
    </section>
  );
}
