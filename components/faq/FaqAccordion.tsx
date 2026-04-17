import type { FaqItem } from "@/lib/faqs/types";

/**
 * FAQ accordion — native <details>/<summary>, zero JS.
 *
 * Renders answer text with minimal paragraph + bullet handling:
 *   - Blank line separator → new <p>
 *   - Lines starting with "- " become an <ul><li> run
 *
 * Good enough for the WP-migrated content. If we ever need rich
 * markup we swap this for <Prose html=...> from the blog system.
 */

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
          {lines.map((l, i) => (
            <li key={i}>{l.replace(/^-\s*/, "")}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={blockIdx} className="leading-relaxed">
        {lines.join(" ")}
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
          <details key={item.slug} id={item.slug} className="group">
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
            </div>
          </details>
        );
      })}
    </div>
  );
}
