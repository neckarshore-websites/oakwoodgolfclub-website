import Link from "next/link";
import { categorySlug } from "@/lib/blog/posts";
import type { PostMeta } from "@/lib/blog/types";

/**
 * Listing card for a blog post. Used on /blog index and /blog/kategorie/[slug].
 *
 * Structure: date + primary category → title (link) → excerpt → read-more CTA.
 * Whole card is NOT a single link — the title already is, and screen readers
 * get a clean single target.
 */

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PostCard({ post }: { post: PostMeta }) {
  const primaryCategory = post.categories[0];

  return (
    <article className="group border-b border-[var(--color-border)] py-8 last:border-b-0">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-muted)]">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden>·</span>
        <Link
          href={`/blog/kategorie/${categorySlug(primaryCategory)}`}
          className="uppercase tracking-[0.15em] text-[var(--color-gold-deep)] hover:text-[var(--color-fairway)]"
        >
          {primaryCategory}
        </Link>
      </div>

      <h2 className="mt-3 font-heading text-2xl tracking-tight md:text-3xl">
        <Link
          href={`/blog/${post.slug}`}
          className="text-[var(--color-ink)] transition-colors hover:text-[var(--color-fairway)]"
        >
          {post.title}
        </Link>
      </h2>

      <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-ink)]/75">
        {post.excerpt}
      </p>

      <Link
        href={`/blog/${post.slug}`}
        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-fairway)] underline-offset-4 hover:underline hover:text-[var(--color-fairway-hover)]"
      >
        Weiterlesen
        <span aria-hidden>→</span>
      </Link>
    </article>
  );
}
