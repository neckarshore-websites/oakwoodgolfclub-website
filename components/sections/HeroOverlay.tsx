import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site-config";

/**
 * Homepage hero — Variant B: image as background with text overlay.
 *
 * Variant B (2026-04-18 User-Vergleich, parallel zu Variant A):
 * Golfplatz-Foto wird Vollbild-Hintergrund des Hero-Blocks, der Hero-
 * Text liegt als Overlay darauf. Darker Gradient von links unten
 * sorgt für Lesbarkeit der Copy ohne das Bild optisch zu zerschießen.
 *
 * Nur an User-Vergleich gebunden — einer der beiden Varianten
 * verschwindet nach User-Entscheidung.
 *
 * LCP-Notiz: priority-geladenes Bild (Nachfolge-Element im DOM)
 * ersetzt den typographischen Hero als LCP-Element — erwartet etwas
 * langsamer als Variant A's reiner Text-Hero (CSS-only LCP).
 */
export function HeroOverlay() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-black">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/brand/hero-golfplatz.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Dark gradient overlay for text legibility — stronger bottom-left,
          softer top-right to keep landscape visible */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/55 to-black/15"
      />

      <div className="container-page relative py-24 md:py-32 lg:py-40">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-gold)]">
          Seit {SITE.founded} · {SITE.memberCount}+ Mitglieder weltweit
        </p>

        <h1 className="font-heading text-4xl leading-[1.1] tracking-tight text-white drop-shadow-sm sm:text-5xl md:text-6xl lg:text-7xl">
          Fernmitgliedschaft<br />
          im Golfclub —{" "}
          <span className="text-[var(--color-fairway-hover)]">
            ab 55 Euro
          </span>{" "}
          im Jahr.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
          Der <strong>Oakwood Golf Club</strong> bietet eine schlanke
          Fernmitgliedschaft mit offizieller Mitgliederkarte, akzeptiert
          auf rund 95 % der österreichischen Golfplätze — ohne
          Heimatplatz, ohne Auto-Renewal, ohne Kleingedrucktes.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/mitglied-werden"
            className="inline-flex items-center justify-center rounded-sm bg-[var(--color-fairway)] px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-[var(--color-fairway-hover)]"
          >
            Jetzt Mitglied werden
          </Link>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center rounded-sm border border-white/35 bg-white/10 px-6 py-3.5 text-base font-medium text-white backdrop-blur-sm transition-colors hover:border-white/55 hover:bg-white/15"
          >
            Wie das funktioniert
          </Link>
        </div>

        <p className="mt-6 text-sm text-white/75">
          Banküberweisung · Kein Abo · Verlängerung aktiv durch dich
        </p>
      </div>
    </section>
  );
}
