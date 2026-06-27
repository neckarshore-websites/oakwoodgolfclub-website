import Link from "next/link";
import type { Category } from "@/lib/blog/types";

/**
 * Sidebar list of all blog categories with post counts.
 * Highlights the active category when `activeSlug` matches.
 */

export function CategoryList({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  if (categories.length === 0) return null;

  // Each entry is a >=44px-tall flex row so the (mobile) category nav is a
  // comfortable tap target — see docs/blog-ux-standard.md (touch-target floor).
  // min-height needs a block/flex box to take effect; a bare inline <a> ignores
  // it. Applies on desktop too (one code path; large targets help mouse users).
  const row = "flex min-h-[44px] items-center";
  const active = "font-medium text-[var(--color-fairway)]";
  const inactive =
    "text-[var(--color-ink)]/75 transition-colors hover:text-[var(--color-fairway)]";

  return (
    <nav aria-label="Blog-Kategorien">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
        Kategorien
      </p>
      <ul className="text-sm">
        <li>
          <Link
            href="/blog"
            className={`${row} ${activeSlug === undefined ? active : inactive}`}
          >
            Alle Beiträge
          </Link>
        </li>
        {categories.map((cat) => {
          const isActive = cat.slug === activeSlug;
          return (
            <li key={cat.slug}>
              <Link
                href={`/blog/kategorie/${cat.slug}`}
                className={`${row} ${isActive ? active : inactive}`}
              >
                {cat.name}
                <span className="ml-1 text-xs text-[var(--color-muted)]">
                  ({cat.count})
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
