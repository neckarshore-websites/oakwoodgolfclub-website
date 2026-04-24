import { CURATED_FAQS } from "../../content/faqs-curated";
import { WP_FAQS } from "../../content/faqs-wp";

const seen = new Set(CURATED_FAQS.map(f => f.slug));
const dedupedWp = WP_FAQS.filter(f => { if (seen.has(f.slug)) return false; seen.add(f.slug); return true; });
const all = [...CURATED_FAQS, ...dedupedWp].filter(f => f.published);

const countWords = (s: string) =>
  s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").split(/\s+/).filter(Boolean).length;

console.log("=".repeat(100));
console.log(`Total published FAQs: ${all.length}  |  Target: 120-150 words (AI-citation sweet spot)`);
console.log("=".repeat(100));

const rows = all.map(f => ({
  slug: f.slug,
  q: f.question,
  words: countWords(f.answer),
  source: CURATED_FAQS.find(c => c.slug === f.slug) ? "C" : "W",
  category: f.category,
})).sort((a, b) => a.words - b.words);

for (const f of rows) {
  const tag =
    f.words < 60  ? "RED   TOO SHORT" :
    f.words < 120 ? "YEL   short    " :
    f.words <= 150 ? "GRN   OK       " :
    f.words <= 180 ? "YEL   long     " :
                     "RED   TOO LONG ";
  console.log(`${f.source} [${f.category.padEnd(14)}] ${String(f.words).padStart(3)} w  ${tag}  ${f.q.slice(0, 60)}`);
}
console.log("=".repeat(100));
const ok    = rows.filter(f => f.words >= 120 && f.words <= 150).length;
const short = rows.filter(f => f.words < 120).length;
const long  = rows.filter(f => f.words > 150).length;
console.log(`In target (120-150): ${ok}/${rows.length}   Short (<120): ${short}   Long (>150): ${long}`);
