/**
 * Search and share metadata for one blog post (agent-bridge #29).
 *
 * Two gaps this closes, both measured on production 2026-11-21:
 *   1. Posts emitted no og:image, although BlogPosting JSON-LD had one.
 *   2. twitter:title / twitter:description on every post were the root
 *      layout's membership pitch, because the post set `openGraph` but not
 *      `twitter`, and Next does not derive one from the other.
 *
 * The snippet title is `metaTitle` when the post sets one, otherwise the
 * headline. That lets the search result be shorter or plainer than the H1
 * without touching the article.
 */
import type { Metadata } from "next";
import { absoluteImageUrl, firstImageSrc } from "@/lib/blog/lead-image";
import type { Post } from "@/lib/blog/types";
import { pageOpenGraph, SITE } from "@/lib/site-config";

export function buildPostMetadata(post: Post): Metadata {
  const title = post.metaTitle ?? post.title;
  const description = post.excerpt;
  const path = `/blog/${post.slug}`;
  const leadImageSrc = firstImageSrc(post.html);

  const base = pageOpenGraph({ path, title, description, type: "article" });
  const images = leadImageSrc
    ? [{ url: absoluteImageUrl(leadImageSrc, SITE.url), alt: post.title }]
    : base.images;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...base,
      type: "article",
      images,
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((image) => image.url),
    },
  };
}
