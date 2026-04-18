import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site-config";

/**
 * Homepage hero — Auto-Swap zwischen Sonnenaufgang-Fairway und 1906er-
 * Vintage-Foto. Live auf `/` seit 2026-04-18 (User-Entscheidung).
 *
 * Technik (zero JS):
 * - Zwei `<Image>` stacken absolut übereinander.
 * - Unteres Bild (Vintage 1906) ist immer sichtbar.
 * - Oberes Bild (Sunrise) hat CSS-Animation `hero-image-swap` (siehe
 *   `globals.css`) — 40s Loop, je ~20s sichtbar, 2s Crossfade.
 * - Initial-Paint zeigt Sunrise (Top-Layer opacity=1 at keyframe 0%) —
 *   die kanonische Szene, die auch SEO-Snapshots erwischen.
 * - `prefers-reduced-motion: reduce` schaltet die Animation ab; dann
 *   bleibt Sunrise statisch oben sichtbar.
 *
 * Keine Alt-Texte: beide Bilder sind dekorativ, die Copy trägt die
 * semantische Last. Screen-Reader springt direkt zum `<h1>`.
 */
export function HeroOverlaySwap() {
  return (
    <section
      className="relative overflow-hidden border-b border-[var(--color-border)] bg-black"
    >
      {/* Bottom layer (always visible beneath): Vintage 1906 */}
      <div className="absolute inset-0">
        <Image
          src="/brand/hero-golfplatz.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "50% 20%" }}
        />
      </div>

      {/* Top layer (fades in/out over bottom): Sunrise */}
      <div className="absolute inset-0">
        <Image
          src="/brand/hero-sunrise.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-swap-top object-cover"
          style={{ objectPosition: "50% 60%" }}
        />
      </div>

      {/* Dark gradient overlay for text legibility */}
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
          <span className="text-[var(--color-fairway-bright)]">
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
          Banküberweisung oder PayPal · Kein Abo · Verlängerung aktiv durch dich
        </p>
      </div>
    </section>
  );
}
