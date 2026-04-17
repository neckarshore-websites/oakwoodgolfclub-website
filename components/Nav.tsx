import Link from "next/link";
import { NAV, SITE } from "@/lib/site-config";

/**
 * Top navigation — fixed at top, translucent on scroll.
 * Mobile: hamburger menu handled by a <details> element for zero-JS fallback.
 */
export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-parchment)]/90 backdrop-blur-sm">
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-heading text-lg tracking-tight text-[var(--color-ink)] hover:text-[var(--color-fairway)] transition-colors"
        >
          {SITE.name}
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Hauptnavigation" className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--color-ink)] hover:text-[var(--color-fairway)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/mitglied-werden"
            className="inline-flex items-center rounded-sm bg-[var(--color-fairway)] px-4 py-2 text-sm text-[var(--color-parchment)] hover:bg-[var(--color-fairway-hover)] transition-colors"
          >
            Jetzt Mitglied werden
          </Link>
        </nav>

        {/* Mobile nav — zero-JS disclosure */}
        <details className="relative md:hidden">
          <summary
            className="cursor-pointer list-none rounded-sm border border-[var(--color-border)] px-3 py-2 text-sm"
            aria-label="Menü öffnen"
          >
            Menü
          </summary>
          <nav
            aria-label="Hauptnavigation (mobil)"
            className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-56 rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] p-3 shadow-lg"
          >
            <ul className="flex flex-col gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-sm px-3 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-sand)] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 border-t border-[var(--color-border)] pt-2">
                <Link
                  href="/mitglied-werden"
                  className="block rounded-sm bg-[var(--color-fairway)] px-3 py-2 text-center text-sm text-[var(--color-parchment)] hover:bg-[var(--color-fairway-hover)]"
                >
                  Jetzt Mitglied werden
                </Link>
              </li>
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
