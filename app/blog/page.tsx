import type { Metadata } from "next";
import { CategoryList } from "@/components/blog/CategoryList";
import { PostCard } from "@/components/blog/PostCard";
import { getAllCategories, getAllPosts } from "@/lib/blog/posts";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Beiträge rund um Fernmitgliedschaft, Handicap, Mitgliederkarte und das Drumherum beim Oakwood Golf Club.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Blog · ${SITE.name}`,
    description: "Fernmitgliedschaft, Mitgliederkarte, Golf-Praxis.",
    url: `${SITE.url}/blog`,
    type: "website",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  return (
    <article className="container-page py-20 md:py-24">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
        Blog
      </p>
      <h1 className="font-heading text-4xl tracking-tight md:text-5xl lg:text-6xl">
        Praxis, Karte, Club.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink)]/80">
        Kurze Beiträge rund um Fernmitgliedschaft, Mitgliederkarte und
        Golf-Alltag. Keine Werbetexte — Dinge, die Mitglieder oft fragen,
        und Hintergründe zu unseren Entscheidungen.
      </p>

      <div className="mt-14 grid gap-14 md:grid-cols-5">
        <div className="md:col-span-3">
          {posts.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)]">
              Noch keine Beiträge veröffentlicht.
            </p>
          ) : (
            <div className="border-t border-[var(--color-border)]">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>

        <aside className="md:col-span-2 md:pl-8 md:border-l md:border-[var(--color-border)]">
          <CategoryList categories={categories} />
        </aside>
      </div>
    </article>
  );
}
