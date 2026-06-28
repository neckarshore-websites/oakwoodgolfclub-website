import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostNavigation } from "@/components/blog/PostNavigation";
import { Prose } from "@/components/blog/Prose";
import { ExportButton } from "@/components/export/ExportButton";
import { JsonLd, ORG_ID } from "@/components/JsonLd";
import { absoluteImageUrl, firstImageSrc } from "@/lib/blog/lead-image";
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
      type: "article",
      locale: SITE.locale,
      url: `${SITE.url}/blog/${post.slug}`,
      siteName: SITE.name,
      title: post.title,
      description: post.excerpt,
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

  // BlogPosting.image — sourced automatically from the first inline image of
  // the post body (no coverImage frontmatter; SEO-audit H2, 2026-06-18).
  const leadImageSrc = firstImageSrc(post.html);
  const leadImage = leadImageSrc
    ? absoluteImageUrl(leadImageSrc, SITE.url)
    : undefined;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    ...(leadImage ? { image: leadImage } : {}),
    datePublished: post.date,
    dateModified: post.modified ?? post.date,
    // Org-authored posts reference the single org entity via @id; a future
    // named author (SEO-audit M3) would emit a Person node instead.
    author:
      post.author === SITE.name
        ? { "@id": ORG_ID }
        : { "@type": "Organization", name: post.author, url: SITE.url },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.url}/blog/${post.slug}`,
    },
    keywords: [...post.categories, ...(post.tags ?? [])].join(", "),
    inLanguage: SITE.language,
  };

  // BreadcrumbList — marks up the visible Blog → Kategorie → Beitrag trail
  // rendered below (SEO-audit M1, 2026-06-18).
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Blog", item: `${SITE.url}/blog` },
      {
        "@type": "ListItem",
        position: 2,
        name: post.categories[0],
        item: `${SITE.url}/blog/kategorie/${categorySlug(post.categories[0])}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE.url}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd id={`blogposting-${post.slug}`} data={blogPostingSchema} />
      <JsonLd id={`breadcrumb-${post.slug}`} data={breadcrumbSchema} />

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
          {/*
            Mini-Gold-Akzent über der Meta-Zeile — gleicher Move wie
            auf der TL;DR-Sektion und auf der Money-Back-Section der
            Landing. Kleiner (1.5rem breit, 2px hoch), sitzt dezent
            über Datum/Lesezeit, bindet die Blog-Typografie in die
            Landing-Designsprache ein.
          */}
          <div
            aria-hidden
            className="mb-3 h-[2px] w-6 bg-[var(--color-gold)]"
          />
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

        {/*
          Footer-Reihenfolge nach User-Direktive 04-18:
            1. Navigation (Vorheriger / Nächster Beitrag)
            2. Kategorien + "Alle Beiträge"-Link
            3. Bild- und Markenhinweis (Fine-Print ganz unten)

          Rationale: Leser, die einen Post zu Ende haben, sollen zuerst
          die Möglichkeit sehen, direkt weiterzuspringen — erst danach
          die Kategorisierung, erst ganz zum Schluss das Kleingedruckte.
        */}

        <div className="mt-16 border-t border-[var(--color-border)] pt-10">
          <PostNavigation prev={prev} next={next} />
        </div>

        <footer className="mt-10 flex flex-wrap items-start justify-between gap-6 border-t border-[var(--color-border)] pt-10">
          {/*
            Categories block — Eyebrow über den Chips statt inline
            "Kategorien:" Label. Mirrors die Eyebrow-Geste von der
            Tools-Sektion und der TL;DR; gibt dem Footer typografisch
            eine klare Struktur.
          */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-deep)]">
              Kategorien
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs">
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
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <ExportButton path={`/blog/${post.slug}`} />
            <Link
              href="/blog"
              className="text-sm font-medium text-[var(--color-fairway)] underline-offset-4 hover:underline hover:text-[var(--color-fairway-hover)]"
            >
              ← Alle Beiträge
            </Link>
          </div>
        </footer>

        {/*
          Bild-Disclaimer für Hersteller- und Produktbilder. User-Direktive
          04-18: "wenn ihr nicht wollt, nehmt eure Bilder sofort raus."
          Restrained typographic treatment ohne Kasten — passt zur Landing-
          Designsprache (kein "callout box"-Klischee). Eine Hairline trennt
          oben, das Auge erkennt: Fine-Print am Footer, nicht Hauptinhalt.
        */}
        <aside className="mt-10 max-w-2xl border-t border-[var(--color-border)] pt-5 text-sm leading-relaxed text-[var(--color-muted)]">
          <strong className="font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-deep)]">
            Bild- und Markenhinweis
          </strong>
          <br />
          Produkt- und Pressebilder werden ausschließlich redaktionell zur
          Beitragsillustration verwendet. Marken- und Bildrechte verbleiben bei
          den jeweiligen Herstellern. Wenn du Rechteinhaber bist und eine Nutzung
          nicht wünschst, schreib uns eine kurze Mail — wir entfernen das Bild
          umgehend.
        </aside>
      </article>
    </>
  );
}
