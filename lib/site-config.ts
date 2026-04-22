/**
 * Single source of truth for site-wide constants.
 * Used by metadata, JSON-LD, sitemap, robots, and UI copy that references business facts.
 *
 * Business facts come from BRIEFING.md §3 — do not drift from that source.
 */

/**
 * Date of the last meaningful content / structural change to the site.
 * Format: YYYY-MM-DD (parseable by Date()).
 *
 * Visible signal in the page footer ("Zuletzt aktualisiert: …") and used
 * as `dateModified` in JSON-LD schemas for AI-freshness signals
 * (Perplexity / ChatGPT-Search / Claude weight `dateModified` heavily for
 * citation freshness — MASCHIN-SEO-Audit Must-Have).
 *
 * Bump this on any meaningful change to homepage / FAQ / about / pricing /
 * legal. Trivial-edit-only commits do NOT need a bump.
 */
export const SITE_UPDATED = "2026-04-21";

/** Render SITE_UPDATED as a German long date for visible UI text. */
export function formatUpdatedAtDe(iso: string = SITE_UPDATED): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export const SITE = {
  name: "Oakwood Golf Club",
  tagline: "Fernmitgliedschaft im Golfclub für 55 Euro",
  description:
    "Fernmitgliedschaft im Golfclub für 55 Euro pro Jahr — mit offizieller Mitgliederkarte, akzeptiert auf rund 95 % der österreichischen Golfplätze.",
  url: "https://oakwoodgolfclub.de",
  locale: "de_DE",
  language: "de",
  founded: 2009,
  email: "info@oakwoodgolfclub.de",
  phone: "+4916038591350", // international format for tel: links
  phoneDisplay: "+49 (160) 385 9135", // human-readable
  memberCount: 300,
  social: {
    facebook: "https://www.facebook.com/Oakwoodgolfclub.de/",
    instagram: "https://www.instagram.com/oakwoodgolfclub.de/",
  },
} as const;

/**
 * Returns a complete OpenGraph metadata object for a subpage.
 *
 * WHY THIS HELPER EXISTS: Next.js App Router does not deep-merge the
 * `openGraph` metadata object. When a page sets its own `openGraph`, it
 * fully REPLACES the layout's `openGraph` — `siteName`, `locale`, `type`
 * and any other fields defined at the root do NOT carry over. Without
 * this helper, subpages that set their own og:title lose og:site_name
 * and og:locale, and subpages that do NOT set their own end up showing
 * the Home og:title/og:url on every social share (verified against
 * prod HTML 2026-04-22: /impressum, /datenschutz, /agb, /mitglied-werden,
 * /mitgliedschaft-verlaengern, /ueber-uns, /kontakt all served Home
 * values in og:title + og:url).
 *
 * Pass this helper's return value as the page's `openGraph` metadata
 * field to guarantee complete, consistent OG tags on every page.
 *
 * @param path  Absolute path from site root (e.g. "/faq"). Joined to
 *              SITE.url to produce og:url.
 * @param title og:title (and `title.absolute` preferred at the top-level
 *              Metadata) for the page.
 * @param description og:description for the page.
 * @param type  OG type — defaults to "website" (most subpages). Pass
 *              "article" on blog posts.
 */
export function pageOpenGraph(opts: {
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
}): {
  type: "website" | "article";
  locale: string;
  url: string;
  siteName: string;
  title: string;
  description: string;
} {
  return {
    type: opts.type ?? "website",
    locale: SITE.locale,
    url: `${SITE.url}${opts.path}`,
    siteName: SITE.name,
    title: opts.title,
    description: opts.description,
  };
}

/**
 * Default `mailto:` href for generic contact / feedback links across the
 * site. Pre-fills the subject line so messages can be triaged in the
 * inbox at a glance — the trailing " - " is intentional so the user's
 * mail client appends their own topic after the prefix.
 *
 * NOT to be used in contexts with a specific legal trigger:
 *   - Kündigungs-Mailtos (AGB §Kündigung) — needs a Kündigung-marker
 *     so the recipient hits the Vertrags-Frist correctly
 *   - DSGVO-Rechte-Mailtos (Datenschutz §Rechte) — Art. 12 macht eine
 *     1-Monats-Antwortfrist verbindlich, wrong subject = risk of miss
 *
 * For those, keep the bare `mailto:${SITE.email}` (no prefilled subject)
 * so the user types the topic themselves and the inbox triage is clean.
 */
export const MAILTO_FEEDBACK = `mailto:${SITE.email}?subject=${encodeURIComponent(
  "Oakwoodgolfclub.de - Feedback - ",
)}`;

export const PRICING = {
  individual: {
    id: "individual",
    label: "Einzelmitgliedschaft",
    priceEur: 55,
    term: "12 Monate",
    people: 1,
    note: "Flexibler Startmonat",
  },
  flight: {
    id: "flight",
    label: "Flight-Mitgliedschaft",
    priceEur: 143,
    term: "12 Monate",
    people: 4,
    note: "€35,75 pro Person — spart gegenüber 4× Einzel",
  },
  referralBonusEur: 10,
} as const;

/**
 * NAV — Haupt-Navigation im schwarzen Header.
 *
 * "Mitglied werden" bewusst NICHT als Nav-Link — die Aktion ist als
 * primärer CTA-Button rechts im Header (Nav.tsx) repräsentiert, um
 * Duplikation zu vermeiden (User-Entscheidung 2026-04-18).
 *
 * "Verlängern" bleibt als Nav-Link: adressiert Bestandsmitglieder, die
 * gezielt nach diesem Aktionspfad scannen; die Sichtbarkeit als
 * sekundärer (nicht Button-) Link reflektiert, dass Signup-Conversions
 * die Launch-Priorität sind.
 */
export const NAV = [
  { href: "/mitgliedschaft-verlaengern", label: "Verlängern" },
  { href: "/faq", label: "FAQ" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/blog", label: "Blog" },
  { href: "/kontakt", label: "Kontakt" },
] as const;
