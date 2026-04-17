import Link from "next/link";
import { SITE } from "@/lib/site-config";

/**
 * Homepage hero.
 *
 * Goals (Phase-1-Plan §SEO Must-Haves):
 * - One H1, keyword "Oakwood Golf Club" + "Fernmitgliedschaft" in plain text
 * - Direct, citable opening sentence (120–150 char LLM answer window)
 * - Explicit primary CTA above the fold
 * - No stock photography, no hero image in v0.1 — typography-led
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-parchment)]">
      {/* Quiet decorative wash — Fairway-Grün diagonal gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(135deg, var(--color-fairway) 0%, var(--color-fairway) 40%, transparent 60%)",
        }}
      />

      <div className="container-page relative py-24 md:py-32">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-gold-deep)]">
          Seit {SITE.founded} · {SITE.memberCount}+ Mitglieder weltweit
        </p>

        <h1 className="font-heading text-4xl leading-[1.1] tracking-tight text-[var(--color-ink)] sm:text-5xl md:text-6xl lg:text-7xl">
          Fernmitgliedschaft<br />
          im Golfclub — <span className="text-[var(--color-fairway)]">ab 55 Euro</span> im Jahr.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-ink)]/80 md:text-xl">
          Der <strong>Oakwood Golf Club</strong> bietet eine schlanke
          Fernmitgliedschaft mit offizieller Mitgliederkarte, akzeptiert auf
          rund 95 % der österreichischen Golfplätze — ohne Heimatplatz, ohne
          Auto-Renewal, ohne Kleingedrucktes.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/mitglied-werden"
            className="inline-flex items-center justify-center rounded-sm bg-[var(--color-fairway)] px-6 py-3.5 text-base font-medium text-[var(--color-parchment)] transition-colors hover:bg-[var(--color-fairway-hover)]"
          >
            Jetzt Mitglied werden
          </Link>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center rounded-sm border border-[var(--color-ink)]/20 px-6 py-3.5 text-base font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-fairway)] hover:text-[var(--color-fairway)]"
          >
            Wie das funktioniert
          </Link>
        </div>

        <p className="mt-6 text-sm text-[var(--color-muted)]">
          Banküberweisung · Kein Abo · Verlängerung aktiv durch dich
        </p>
      </div>
    </section>
  );
}
