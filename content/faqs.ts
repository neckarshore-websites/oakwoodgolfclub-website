/**
 * FAQ aggregator — combines WP-migrated FAQs (faqs-wp.ts, generated) with
 * hand-curated FAQs (faqs-curated.ts). Curated entries come FIRST so they
 * take precedence when a slug collides.
 *
 * lib/faqs/items.ts is the only consumer of this module.
 */

import type { FaqItem } from "@/lib/faqs/types";
import { CURATED_FAQS } from "./faqs-curated";
import { WP_FAQS } from "./faqs-wp";

// Dedupe by slug — curated wins. WP-version kept only if slug is unique.
const seen = new Set<string>(CURATED_FAQS.map((f) => f.slug));
const dedupedWp = WP_FAQS.filter((f) => {
  if (seen.has(f.slug)) return false;
  seen.add(f.slug);
  return true;
});

export const FAQS: FaqItem[] = [...CURATED_FAQS, ...dedupedWp];
