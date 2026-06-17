/** Reduce Markdown/HTML to searchable plaintext. Lossy by design. */
export function stripMarkdown(md: string): string {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")     // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")  // links -> visible text
    .replace(/<[^>]+>/g, " ")                 // html tags
    .replace(/^#{1,6}\s+/gm, "")              // ATX headings
    .replace(/^>\s?/gm, "")                   // blockquotes
    .replace(/[*_`~]/g, "")                   // emphasis/code/strike marks
    .replace(/\s+/g, " ")                     // collapse whitespace
    .trim();
}
