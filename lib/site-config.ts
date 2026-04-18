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
export const SITE_UPDATED = "2026-04-18";

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
