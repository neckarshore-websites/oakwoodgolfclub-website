"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { NAV, SITE } from "@/lib/site-config";
import { SearchButton } from "@/components/search/SearchButton";

/**
 * Top navigation — black header with logo left, nav right.
 *
 * Design decision 2026-04-18 (User-Entscheidung): Header im
 * Original-WordPress-Stil — schwarzer Hintergrund mit weißer Schrift
 * und Wortmarke (inkl. Tagline "Serious golfers go to work to relax!")
 * als eingebettetes JPG aus `/public/brand/ogc-logo.jpg`. Die Logo-JPG
 * hat einen schwarzen Hintergrund; deshalb nutzt dieses Header pure
 * `bg-black` statt `var(--color-ink)` (#0a0a0a), damit es um das Logo
 * keinen sichtbaren Kantenrand gibt.
 *
 * Phase-2-Backlog (User 2026-04-18): Logo-Optimierung — transparente
 * PNG/SVG-Variante, skalierbare Wordmark, Brand-Konsistenz. Für Launch
 * genügt die Original-JPG.
 *
 * Mobile: hamburger menu via <details> (zero-JS fallback). Diese
 * Komponente ist Client wegen des Auto-Close-Verhaltens — siehe
 * `closeMobileMenu` und der `pathname`-Effekt unten. Hintergrund:
 * native `<details>` behält ihre `open`-Property über Next.js
 * Client-side-Navigation, weil der DOM-Knoten der Sticky-Nav
 * persistiert. Ohne dieses Schließen blieb das Menü auf dem iPhone
 * 12 Pro Max nach Klick auf einen Menüpunkt offen über dem neuen
 * Inhalt liegen (Bug 2026-04-19).
 */
export function Nav() {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  const closeMobileMenu = useCallback(() => {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  }, []);

  // Catch-all für Pfad-Wechsel — auch dann zu, wenn der User von
  // ausserhalb des Menüs navigiert (z.B. via In-Content-Link).
  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center rounded-sm outline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--color-fairway-hover)]"
          aria-label={`${SITE.name} — Startseite`}
        >
          <Image
            src="/brand/ogc-logo.jpg"
            alt={`${SITE.name} Logo`}
            width={391}
            height={75}
            priority
            className="h-12 w-auto md:h-14"
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Hauptnavigation" className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-white/85 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <SearchButton variant="desktop" />
          <Link
            href="/mitglied-werden"
            className="inline-flex items-center rounded-sm bg-[var(--color-fairway)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-fairway-hover)]"
          >
            Jetzt Mitglied werden
          </Link>
        </nav>

        {/* Mobile: search + disclosure menu */}
        <div className="flex items-center gap-2 md:hidden">
          <SearchButton variant="mobile" />
          <details ref={detailsRef} className="relative">
          <summary
            className="cursor-pointer list-none rounded-sm border border-white/20 px-3 py-2 text-sm text-white hover:border-white/40"
            aria-label="Menü öffnen"
          >
            Menü
          </summary>
          <nav
            aria-label="Hauptnavigation (mobil)"
            className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-56 rounded-sm border border-white/15 bg-black p-3 shadow-lg"
          >
            <ul className="flex flex-col gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="block rounded-sm px-3 py-2 text-sm text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 border-t border-white/10 pt-2">
                <Link
                  href="/mitglied-werden"
                  onClick={closeMobileMenu}
                  className="block rounded-sm bg-[var(--color-fairway)] px-3 py-2 text-center text-sm font-medium text-white hover:bg-[var(--color-fairway-hover)]"
                >
                  Jetzt Mitglied werden
                </Link>
              </li>
            </ul>
          </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
