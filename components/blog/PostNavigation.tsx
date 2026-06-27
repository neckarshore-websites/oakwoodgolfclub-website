import Link from "next/link";

import type { PostMeta } from "@/lib/blog/types";

/**
 * Prev/next navigation at the bottom of a blog detail page.
 *
 * Per User direction 04-18: not just "Next →" arrows but the (truncated)
 * actual title of the neighbouring post, so readers know where they're
 * about to go. The order matches the listing on /blog (date desc,
 * newest first) — see lib/blog/posts.getAdjacentPosts().
 *
 * Either side can be null (start / end of the post list); we render the
 * existing side anyway and leave the other column empty so the layout
 * doesn't shift.
 */

const TITLE_TRUNCATE_AT = 60;

function shortenTitle(title: string): string {
  if (title.length <= TITLE_TRUNCATE_AT) return title;
  // Drop trailing whole word so we don't end on a syllable break.
  const cut = title.slice(0, TITLE_TRUNCATE_AT).replace(/\s+\S*$/, "");
  return `${cut}…`;
}

function NavLink({
  post,
  direction,
}: {
  post: PostMeta;
  direction: "prev" | "next";
}) {
  const label = direction === "prev" ? "Vorheriger Beitrag" : "Nächster Beitrag";
  const arrow = direction === "prev" ? "←" : "→";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col gap-1 rounded-sm border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-fairway)] ${
        direction === "next" ? "text-right md:items-end" : ""
      }`}
    >
      <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
        {direction === "prev" ? `${arrow} ${label}` : `${label} ${arrow}`}
      </span>
      <span className="text-sm font-medium leading-snug text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-fairway)]">
        {shortenTitle(post.title)}
      </span>
      {post.categories[0] && (
        <span className="text-xs text-[var(--color-muted)]">
          {post.categories[0]}
        </span>
      )}
    </Link>
  );
}

export function PostNavigation({
  prev,
  next,
}: {
  prev: PostMeta | null;
  next: PostMeta | null;
}) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Beitrags-Navigation"
      className="grid gap-4 md:grid-cols-2"
    >
      {prev ? <NavLink post={prev} direction="prev" /> : <div aria-hidden />}
      {next ? <NavLink post={next} direction="next" /> : <div aria-hidden />}
    </nav>
  );
}
