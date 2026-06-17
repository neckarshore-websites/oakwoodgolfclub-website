import Image from "next/image";
import type { FaqItem } from "@/lib/faqs/types";

/**
 * FAQ accordion — native <details>/<summary>, zero JS.
 *
 * Renders answer text with minimal paragraph + bullet + link handling:
 *   - Blank line separator → new <p>
 *   - Lines starting with "- " become an <ul><li> run
 *   - `[text](href)` → <a href>. External URLs open in new tab with
 *     rel="noopener noreferrer". Internal paths ("/foo") stay same tab.
 *
 * No full Markdown parser — this is intentional. If we ever need rich
 * markup we swap this for <Prose html=...> from the blog system.
 */

// Matches `[visible text](href)`. href is anything up to the closing paren
// that isn't itself a paren. Good enough for our curated hand-written links.
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIdx = 0;
  let linkIdx = 0;

  for (const match of text.matchAll(LINK_PATTERN)) {
    const idx = match.index ?? 0;
    if (idx > lastIdx) {
      parts.push(text.slice(lastIdx, idx));
    }
    const [, label, href] = match;
    const isExternal = /^https?:\/\//i.test(href);
    parts.push(
      <a
        key={`${keyPrefix}-l${linkIdx}`}
        href={href}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="text-[var(--color-fairway)] underline underline-offset-4 hover:text-[var(--color-fairway-hover)]"
      >
        {label}
      </a>
    );
    lastIdx = idx + match[0].length;
    linkIdx += 1;
  }

  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }
  return parts;
}

function renderAnswer(answer: string): React.ReactNode {
  const blocks = answer
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks.map((block, blockIdx) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const allBullets = lines.length > 0 && lines.every((l) => l.startsWith("- "));

    if (allBullets) {
      return (
        <ul key={blockIdx} className="list-disc pl-5 space-y-1">
          {lines.map((l, i) => {
            const cleaned = l.replace(/^-\s*/, "");
            return <li key={i}>{renderInline(cleaned, `b${blockIdx}-i${i}`)}</li>;
          })}
        </ul>
      );
    }

    const joined = lines.join(" ");
    return (
      <p key={blockIdx} className="leading-relaxed">
        {renderInline(joined, `b${blockIdx}`)}
      </p>
    );
  });
}

export function FaqAccordion({
  items,
  headingLevel = "h3",
}: {
  items: FaqItem[];
  /** Heading tag used for each question. h3 inside /faq groups, h2 if standalone. */
  headingLevel?: "h2" | "h3" | "h4";
}) {
  if (items.length === 0) return null;

  return (
    <div className="divide-y divide-[var(--color-ink)]/10 border-y border-[var(--color-ink)]/10">
      {items.map((item) => {
        const Heading = headingLevel;
        return (
          <details key={item.slug} id={item.slug} className="group scroll-mt-24">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-left transition-colors hover:text-[var(--color-fairway)]">
              <Heading className="font-heading text-lg tracking-tight">
                {item.question}
              </Heading>
              <span
                aria-hidden
                className="mt-1 shrink-0 text-xl text-[var(--color-muted)] transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="space-y-4 pb-6 pr-6 text-base text-[var(--color-ink)]/75">
              {renderAnswer(item.answer)}
              {item.images && item.images.length > 0 && (
                <div className="flex flex-wrap gap-6 pt-2">
                  {item.images.map((img) => (
                    <figure key={img.src} className="flex flex-col gap-2">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={img.width}
                        height={img.height}
                        className="h-auto w-auto max-w-full rounded-sm border border-[var(--color-border)]"
                      />
                      {img.caption && (
                        <figcaption className="text-xs text-[var(--color-muted)]">
                          {img.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
}
