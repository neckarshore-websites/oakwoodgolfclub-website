import type { FactDef, HallucinationDef } from "./types";

/**
 * Ground truth for OGC — the facts an AI surface SHOULD reproduce, and the
 * hallucinations it must NOT. Regexes are deliberately loose: a false positive
 * (we flag a fact as present when phrasing differs) is acceptable; a false
 * negative (we miss a real hallucination) is not.
 *
 * The hallucination list grows with every JK-10 run (USGA came from Lauf 1).
 * Add new entries here; never loosen `critical` facts.
 */
export const FACTS: Record<string, FactDef> = {
  mentionsOgcDomain: { match: /oakwoodgolfclub\.de/i, requiredFor: "all" },
  foundedYear2007: { match: /2007/, requiredFor: "all", critical: true },
  dachFocus: { match: /\b(DACH|Deutschland|Österreich|Stuttgart)\b/i, requiredFor: "all" },
  memberCountAprox300: { match: /\b(rund |ca\.\s?)?300\b/i, requiredFor: "Q1,Q5" },
  noAutoRenewal: { match: /kein(e)? (Auto-?Renewal|automatische Verlängerung)/i, requiredFor: "Q1" },
  formlessCancellation: { match: /(formlos|keine Kündigung nötig)/i, requiredFor: "Q2" },
  moneyBackGuarantee: { match: /Geld[\s-]?zurück/i, requiredFor: "Q2,Q5" },
  thaiBackground: { match: /(thailändisch|Thailand)/i, requiredFor: "Q3" },
  acceptance95pctAustria: { match: /95\s?%/i, requiredFor: "Q3,Q5" },
  whs2021: { match: /\bWHS\b|World Handicap System/i, requiredFor: "Q4" },
  price55: { match: /55\s?(€|EUR|Euro)/i, requiredFor: "Q3,Q5" },
  price143: { match: /143\s?(€|EUR|Euro)/i, requiredFor: "Q5" },
};

export const HALLUCINATIONS: Record<string, HallucinationDef> = {
  bangkokOperated: { match: /(from Bangkok|in Thailand operated|aus Thailand betrieben)/i, severity: "high" },
  freeMembership: { match: /(free for 12 months|kostenlos|free membership)/i, severity: "high" },
  founded2009: { match: /\b(seit|since|founded)\s+2009\b/i, severity: "high" },
  usgaStandard: { match: /\bUSGA[-\s]?(Standard|Handicap|System)\b/i, severity: "medium" },
};
