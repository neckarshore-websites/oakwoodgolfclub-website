import Image from "next/image";

/**
 * Full-width hero banner image — placed directly below the Nav.
 *
 * Variant A (2026-04-18 User-Vergleich): Bild wirkt als visuelle
 * Einleitung zwischen schwarzem Header und dem Copy-Hero darunter.
 *
 * Proportionen (User-Anfrage "optimale Höhe und Breite"):
 * - Full bleed width
 * - Desktop ~520px Höhe (aspect ≈ 2.7:1 bei 1440px wide) — Szene
 *   ist erkennbar ohne Above-the-fold zu dominieren
 * - Tablet ~400px, Mobile ~280px — Landschaft bleibt lesbar, hero
 *   copy bleibt in Scroll-Reichweite
 * - `object-cover` stellt sicher dass der Fairway und das Wasser-
 *   feature die bildbestimmenden Elemente bleiben beim Crop
 *
 * LCP-Notiz: `priority` lädt das Bild sofort; Next Image gibt
 * modernes WebP aus (Quelle ist bereits WebP, 600×384). Für
 * Hi-DPI-Screens ideal wäre eine ~2400×900 Version — im Backlog als
 * Asset-Upgrade für Phase 2.
 */
export function HeroBanner() {
  return (
    <section
      aria-hidden
      className="relative w-full overflow-hidden bg-black"
    >
      <div className="relative h-[280px] w-full sm:h-[360px] md:h-[440px] lg:h-[520px]">
        <Image
          src="/brand/hero-golfplatz.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </section>
  );
}
