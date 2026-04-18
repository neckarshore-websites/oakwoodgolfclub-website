import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site-config";

/**
 * Homepage hero — Bild als Vollbild-Hintergrund mit Text-Overlay.
 *
 * Gewählt 2026-04-18 (User) aus dem A/B-Vergleich. Bild-Asset ist
 * aktuell ein historisches Schwarz-Weiß-Foto "Opening of Dollar Golf
 * Course by Countess of Mar and Kellie, 8th Sept 1906" — versehent-
 * lich aus dem Avada-Ordner gegriffen (emotionheader-Datei war
 * missverstanden), aber User hat's bewusst behalten weil es zum
 * Golf-Tradition-Claim passt.
 *
 * Crop-Verhalten: `object-position: 50% 20%` sorgt dafür, dass bei
 * wide viewports (Desktop / Ultrawide) die Köpfe der abgebildeten
 * Personen im oberen Bilddrittel sichtbar bleiben, statt durch
 * `object-center` beidseitig weggeschnitten zu werden. Bottom-Caption
 * "Opening of Dollar Golf Course…" darf gecroppt werden — sie trägt
 * zum Hero nichts bei.
 *
 * Dark-Gradient (bottom-left → top-right) hält die Copy lesbar
 * ohne das Bild optisch totzuschlagen.
 */
export function HeroOverlay() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-black">
      {/* Background image — object-position pushes the frame up so the
          heads in the top-third of the vintage photo stay in view on
          wide viewports. */}
      <div className="absolute inset-0">
        <Image
          src="/brand/hero-golfplatz.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "50% 20%" }}
        />
      </div>

      {/* Dark gradient overlay for text legibility — stronger bottom-left,
          softer top-right to keep the photo subject visible */}
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
