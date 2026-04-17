/**
 * Single source of truth for site-wide constants.
 * Used by metadata, JSON-LD, sitemap, robots, and UI copy that references business facts.
 *
 * Business facts come from BRIEFING.md §3 — do not drift from that source.
 */

export const SITE = {
  name: "Oakwood Golf Club",
  tagline: "Fernmitgliedschaft im Golfclub für 55 Euro",
  description:
    "Fernmitgliedschaft im Golfclub: Handicap-Verwaltung und offizielle Mitgliederkarte für 55 Euro pro Jahr. Akzeptiert auf rund 95 % der österreichischen Golfplätze.",
  url: "https://oakwoodgolfclub.de",
  locale: "de_DE",
  language: "de",
  founded: 2009,
  email: "info@oakwoodgolfclub.de",
  phone: "+4916038591350", // international format for tel: links
  phoneDisplay: "+49 (160) 385 9135", // human-readable
  memberCount: 300,
  social: {
    facebook: "https://www.facebook.com/oakwoodgolfclub/",
    twitter: "https://twitter.com/oakwoodgolf",
    pinterest: "https://www.pinterest.com/oakwoodgolfclub/",
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

export const NAV = [
  { href: "/mitglied-werden", label: "Mitglied werden" },
  { href: "/mitgliedschaft-verlaengern", label: "Verlängern" },
  { href: "/faq", label: "FAQ" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/blog", label: "Blog" },
  { href: "/kontakt", label: "Kontakt" },
] as const;
