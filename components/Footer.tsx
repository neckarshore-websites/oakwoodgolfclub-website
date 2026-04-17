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
              DACH-Region — schlankes Setup, offizielle Mitgliederkarte, kein Abo.
            </p>
          </div>

          <nav aria-label="Seitenstruktur">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)]">
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
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)]">
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

            <p className="mt-6 mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)]">
              Rechtliches
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/impressum" className="hover:text-[var(--color-gold)] transition-colors">Impressum</Link></li>
              <li><Link href="/datenschutz" className="hover:text-[var(--color-gold)] transition-colors">Datenschutz</Link></li>
              <li><Link href="/agb" className="hover:text-[var(--color-gold)] transition-colors">AGB</Link></li>
            </ul>

            <p className="mt-6 mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)]">
              Social
            </p>
            <ul className="flex gap-4 text-sm">
              <li>
                <a
                  href={SITE.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Oakwood Golf Club auf Facebook"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[var(--color-parchment)]/80 transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M13.5 21v-8.25h2.78l.42-3.25H13.5V7.44c0-.94.26-1.58 1.61-1.58h1.72V2.94c-.3-.04-1.32-.13-2.5-.13-2.48 0-4.18 1.52-4.18 4.3v2.39H7.37v3.25h2.78V21h3.35Z"/>
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href={SITE.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Oakwood Golf Club auf Instagram"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[var(--color-parchment)]/80 transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              </li>
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
