import { getAllPosts, getPostBySlug } from "@/lib/blog/posts";
import { getPublishedFaqs } from "@/lib/faqs/items";
import { CATEGORY_LABEL } from "@/lib/faqs/types";
import { stripMarkdown } from "./strip-markdown";
import type { SearchDoc } from "./types";

/** Build the full searchable document set from blog posts + published FAQs. */
export function buildSearchDocs(): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const meta of getAllPosts()) {
    const body = getPostBySlug(meta.slug)?.content ?? "";
    docs.push({
      id: `blog:${meta.slug}`,
      type: "blog",
      title: meta.title,
      text: stripMarkdown(`${meta.excerpt} ${body}`),
      category: meta.categories[0] ?? "Blog",
      url: `/blog/${meta.slug}`,
    });
  }

  for (const faq of getPublishedFaqs()) {
    docs.push({
      id: `faq:${faq.slug}`,
      type: "faq",
      title: faq.question,
      text: stripMarkdown(faq.answer),
      category: CATEGORY_LABEL[faq.category],
      url: `/faq#${faq.slug}`,
    });
  }

  return docs;
}
