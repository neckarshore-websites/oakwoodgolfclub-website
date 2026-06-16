import type { Metadata } from "next";
import Link from "next/link";
import { GolfFlag } from "@/components/icons/GolfIcons";
import { RedirectHome } from "./redirect-home";

/**
 * QR splash — reached at /qr.html (rewritten to /qr in next.config.ts), the URL
 * encoded on the printed membership card's QR code. Shows a branded
 * "coming soon" screen for ~5s, then auto-forwards to the homepage. Placeholder
 * copy until real content lands here.
 *
 * Styled to match the 404 page; Nav + Footer come from the root layout for
 * free. Not linked in any navigation — it is a QR-only entry point.
 *
 * noindex: QR-only, not part of the public navigation, and it auto-redirects —
 * keep it out of the search index.
 */

export const metadata: Metadata = {
  title: "Demnächst · Ein neues Grün entsteht",
  description:
    "An dieser Stelle entsteht gerade etwas Neues. Sie werden in Kürze zur Startseite weitergeleitet.",
  robots: {
    index: false,
    follow: true,
  },
};

const REDIRECT_DELAY_MS = 5000;

export default function QrSplash() {
  return (
    <section className="container-page flex flex-col items-center py-24 text-center md:py-32">
      <RedirectHome delayMs={REDIRECT_DELAY_MS} />

      <div
        className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-sand)] text-[var(--color-fairway)] md:h-24 md:w-24"
        aria-hidden="true"
      >
        <GolfFlag size={44} strokeWidth={1.5} />
      </div>

      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold-deep)]">
        Demnächst
      </p>

      <h1 className="font-heading text-5xl tracking-tight text-[var(--color-fairway)] md:text-7xl">
        Hier entsteht ein neues Grün
      </h1>

      <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-ink)]/70 md:text-lg">
        Wir bereiten an dieser Stelle gerade etwas vor. Schauen Sie bald wieder
        vorbei — bis dahin geht es für Sie automatisch weiter zur Startseite.
      </p>

      <p className="mt-8 text-sm text-[var(--color-ink)]/50" aria-live="polite">
        Sie werden in wenigen Sekunden automatisch weitergeleitet …
      </p>

      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-[var(--color-fairway)] px-6 py-3 text-sm font-semibold text-[var(--color-parchment)] transition-colors hover:bg-[var(--color-fairway-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-fairway)]"
        >
          Direkt zur Startseite →
        </Link>
      </div>
    </section>
  );
}
