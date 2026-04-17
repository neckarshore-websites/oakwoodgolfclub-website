import Link from "next/link";
import { SITE } from "@/lib/site-config";

const currentYear = new Date().getFullYear();

/**
 * Site footer — quiet, well-organized. Contact info, legal links, social.
 * No logo mark yet (Phase-1-Plan: branding is Helvetica-on-green for v0.1).
 */
export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-border)] bg-[var(--color-ink)] text-[var(--color-parchment)]">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-heading text-xl">{SITE.name}</p>
            <p className="mt-2 max-w-md text-sm text-[var(--color-parchment)]/70">
              {SITE.tagline}. Seit {SITE.founded} betreuen wir Mitglieder in der
              DACH-Region mit Handicap-Verwaltung und offizieller Mitgliederkarte.
            </p>
          </div>

          <nav aria-label="Seitenstruktur">
            <p className="mb-3 text-xs uppercase tracking-widest text-[var(--color-gold)]">
              Seiten
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/mitglied-werden" className="hover:text-[var(--color-gold)] transition-colors">Mitglied werden</Link></li>
              <li><Link href="/mitgliedschaft-verlaengern" className="hover:text-[var(--color-gold)] transition-colors">Verlängern</Link></li>
              <li><Link href="/faq" className="hover:text-[var(--color-gold)] transition-colors">FAQ</Link></li>
              <li><Link href="/ueber-uns" className="hover:text-[var(--color-gold)] transition-colors">Über uns</Link></li>
              <li><Link href="/blog" className="hover:text-[var(--color-gold)] transition-colors">Blog</Link></li>
              <li><Link href="/kontakt" className="hover:text-[var(--color-gold)] transition-colors">Kontakt</Link></li>
            </ul>
          </nav>

          <div>
            <p className="mb-3 text-xs uppercase tracking-widest text-[var(--color-gold)]">
              Kontakt
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={`mailto:${SITE.email}`} className="hover:text-[var(--color-gold)] transition-colors">
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href={`tel:${SITE.phone}`} className="hover:text-[var(--color-gold)] transition-colors">
                  {SITE.phoneDisplay}
                </a>
              </li>
            </ul>

            <p className="mt-6 mb-3 text-xs uppercase tracking-widest text-[var(--color-gold)]">
              Rechtliches
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/impressum" className="hover:text-[var(--color-gold)] transition-colors">Impressum</Link></li>
              <li><Link href="/datenschutz" className="hover:text-[var(--color-gold)] transition-colors">Datenschutz</Link></li>
              <li><Link href="/agb" className="hover:text-[var(--color-gold)] transition-colors">AGB</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-[var(--color-parchment)]/50 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} {SITE.name}. Alle Rechte vorbehalten.</p>
          <p>Seit {SITE.founded}. Betrieben aus Thailand. Mitglieder in der DACH-Region.</p>
        </div>
      </div>
    </footer>
  );
}
