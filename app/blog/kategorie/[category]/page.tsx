import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryList } from "@/components/blog/CategoryList";
import { PostCard } from "@/components/blog/PostCard";
import {
  getAllCategories,
  getCategoryBySlug,
  getPostsByCategorySlug,
} from "@/lib/blog/posts";
import { SITE } from "@/lib/site-config";

export function generateStaticParams() {
  return getAllCategories().map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ category: string }> },
): Promise<Metadata> {
  const { category } = await props.params;
  const cat = getCategoryBySlug(category);
  if (!cat) return { title: "Kategorie nicht gefunden" };

  return {
    title: `${cat.name} · Blog`,
    description: `Alle Blog-Beiträge zum Thema ${cat.name} beim ${SITE.name}.`,
    alternates: { canonical: `/blog/kategorie/${cat.slug}` },
    openGraph: {
      title: `${cat.name} · Blog · ${SITE.name}`,
      description: `Blog-Beiträge zum Thema ${cat.name}.`,
      url: `${SITE.url}/blog/kategorie/${cat.slug}`,
      type: "website",
    },
  };
}

export default async function BlogCategoryPage(
  props: { params: Promise<{ category: string }> },
) {
  const { category } = await props.params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const posts = getPostsByCategorySlug(category);
  const categories = getAllCategories();

  return (
    <article className="container-page py-20 md:py-24">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
        Kategorie
      </p>
      <h1 className="font-heading text-4xl tracking-tight md:text-5xl lg:text-6xl">
        {cat.name}
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-ink)]/80">
        {posts.length === 1
          ? "Ein Beitrag"
          : `${posts.length} Beiträge`}{" "}
        zum Thema.
      </p>

      <div className="mt-14 grid gap-14 md:grid-cols-5">
        <div className="md:col-span-3">
          {posts.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)]">
              In dieser Kategorie wurden noch keine Beiträge veröffentlicht.
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
          <CategoryList categories={categories} activeSlug={cat.slug} />
        </aside>
      </div>
    </article>
  );
}
