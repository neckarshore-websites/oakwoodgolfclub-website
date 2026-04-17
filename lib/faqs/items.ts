/**
 * FAQ loader — reads content/faqs.ts, filters + groups for the page.
 *
 * Source is static TypeScript (no fs, no async) so this runs at
 * Node + Edge + browser without runtime cost.
 */

import { FAQS } from "@/content/faqs";
import type { FaqCategory, FaqItem } from "./types";
import { CATEGORY_ORDER } from "./types";

/** Published FAQs only. Drafts and needs-review items are never shown in prod. */
export function getPublishedFaqs(): FaqItem[] {
  return FAQS.filter((f) => f.published);
}

/** One FAQ by slug, or null. Honours published flag — drafts return null in prod. */
export function getFaqBySlug(slug: string): FaqItem | null {
  const found = FAQS.find((f) => f.slug === slug);
  if (!found) return null;
  if (!found.published && process.env.NODE_ENV === "production") return null;
  return found;
}

/** Group published FAQs by category, in display order. */
export function getFaqsByCategory(): Array<{
  category: FaqCategory;
  items: FaqItem[];
}> {
  const published = getPublishedFaqs();
  const groupMap = new Map<FaqCategory, FaqItem[]>();
  for (const faq of published) {
    const list = groupMap.get(faq.category) ?? [];
    list.push(faq);
    groupMap.set(faq.category, list);
  }
  return Array.from(groupMap.entries())
    .sort((a, b) => CATEGORY_ORDER[a[0]] - CATEGORY_ORDER[b[0]])
    .map(([category, items]) => ({ category, items }));
}

/** Count of published FAQs — useful for the page intro ("15 Antworten"). */
export function getPublishedCount(): number {
  return getPublishedFaqs().length;
}
