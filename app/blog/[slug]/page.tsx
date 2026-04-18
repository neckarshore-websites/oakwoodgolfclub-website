import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostNavigation } from "@/components/blog/PostNavigation";
import { Prose } from "@/components/blog/Prose";
import { JsonLd } from "@/components/JsonLd";
import {
  categorySlug,
  getAdjacentPosts,
  getAllPosts,
  getPostBySlug,
} from "@/lib/blog/posts";
import { SITE } from "@/lib/site-config";

/** Static generation — every slug becomes a prerendered page at build time. */
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Beitrag nicht gefunden" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${SITE.url}/blog/${post.slug}`,
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage(
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(slug);

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.modified ?? post.date,
    author: {
      "@type": "Organization",
      name: post.author,
      url: SITE.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.url}/blog/${post.slug}`,
    },
    keywords: [...post.categories, ...(post.tags ?? [])].join(", "),
    inLanguage: SITE.language,
  };

  return (
    <>
      <JsonLd id={`blogposting-${post.slug}`} data={blogPostingSchema} />

      <article className="container-page py-16 md:py-20">
        {/* Breadcrumb */}
        <nav
          aria-label="Brotkrumen"
          className="mb-8 text-xs text-[var(--color-muted)]"
        >
          <Link href="/blog" className="hover:text-[var(--color-fairway)]">
            Blog
          </Link>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <Link
            href={`/blog/kategorie/${categorySlug(post.categories[0])}`}
            className="hover:text-[var(--color-fairway)]"
          >
            {post.categories[0]}
          </Link>
        </nav>

        <header className="mb-10 border-b border-[var(--color-border)] pb-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-muted)]">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.modified && post.modified !== post.date && (
              <>
                <span aria-hidden>·</span>
                <span>
                  Aktualisiert{" "}
                  <time dateTime={post.modified}>
                    {formatDate(post.modified)}
                  </time>
                </span>
              </>
            )}
            <span aria-hidden>·</span>
            <span>{post.readingTime} min Lesezeit</span>
          </div>

          <h1 className="mt-4 font-heading text-4xl tracking-tight md:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
            {post.title}
          </h1>

          {/*
            Excerpt intentionally NOT rendered on the detail page —
            it duplicates the TL;DR section that opens the body. The
            excerpt remains in `frontmatter.excerpt` for the index
            cards, OG description, and metadata.description.
            Per User direction 04-18: "TL;DR sollte da in dem Fall
            auf der Detailseite gewinnen."
          */}
        </header>

        <Prose html={post.html} />

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-[var(--color-border)] pt-10">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[var(--color-muted)]">Kategorien:</span>
            {post.categories.map((cat) => (
              <Link
                key={cat}
                href={`/blog/kategorie/${categorySlug(cat)}`}
                className="rounded-sm border border-[var(--color-border)] px-2 py-1 text-[var(--color-ink)]/75 transition-colors hover:border-[var(--color-fairway)] hover:text-[var(--color-fairway)]"
              >
                {cat}
              </Link>
            ))}
          </div>

          <Link
            href="/blog"
            className="text-sm font-medium text-[var(--color-fairway)] underline-offset-4 hover:underline hover:text-[var(--color-fairway-hover)]"
          >
            ← Alle Beiträge
          </Link>
        </footer>

        <PostNavigation prev={prev} next={next} />
      </article>
    </>
  );
}
