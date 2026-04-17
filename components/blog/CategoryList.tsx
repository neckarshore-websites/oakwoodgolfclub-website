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

  return (
    <nav aria-label="Blog-Kategorien">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
        Kategorien
      </p>
      <ul className="space-y-2 text-sm">
        <li>
          <Link
            href="/blog"
            className={
              activeSlug === undefined
                ? "font-medium text-[var(--color-fairway)]"
                : "text-[var(--color-ink)]/75 transition-colors hover:text-[var(--color-fairway)]"
            }
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
                className={
                  isActive
                    ? "font-medium text-[var(--color-fairway)]"
                    : "text-[var(--color-ink)]/75 transition-colors hover:text-[var(--color-fairway)]"
                }
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
