/**
 * Build-time intrinsic-dimension injection for blog images (SEO-audit
 * 2026-06-18 #71).
 *
 * Markdown `![]()` images render to `<img src alt>` with NO width/height,
 * so the browser can't reserve space before the image loads → layout shift
 * (CLS). The `.ogc-prose img` rule already pairs `max-width:100%; height:auto`
 * with explicit width/height attributes to keep images responsive AND
 * reserve their aspect-ratio box — markdown images simply never carried those
 * attributes. This reads each local image's intrinsic size from /public at
 * build time and injects `width`/`height`, completing that design.
 *
 * Scope is deliberately CLS-only: no `loading`/`fetchpriority` (LCP tuning
 * lives in Backlog #43). Images that already declare both dimensions (the
 * hand-authored `<figure>` posts) are left untouched.
 */

import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

const PUBLIC_DIR = path.join(process.cwd(), "public");

export type Dimensions = { width: number; height: number };

/**
 * Intrinsic dimensions of a root-relative public image, or `null` when the
 * source is external, missing, or unreadable. Never throws — a single bad
 * path must not fail `next build` (the image is just left without dimensions).
 */
export function readDimensions(src: string): Dimensions | null {
  // Only local, root-relative images can be read from disk.
  if (!src.startsWith("/")) return null;
  try {
    const filePath = path.join(PUBLIC_DIR, src);
    const buf = fs.readFileSync(filePath);
    const { width, height } = imageSize(new Uint8Array(buf));
    if (!width || !height) return null;
    return { width, height };
  } catch {
    console.warn(`[blog] no intrinsic size for image: ${src} (left without width/height)`);
    return null;
  }
}

/** Append attributes just before an `<img …>` tag's close (handles `/>`). */
function addAttrs(tag: string, attrs: Record<string, string>): string {
  const selfClosing = /\/>\s*$/.test(tag);
  const inner = tag.replace(/\s*\/?>\s*$/, "");
  const attrStr = Object.entries(attrs)
    .map(([k, v]) => ` ${k}="${v}"`)
    .join("");
  return `${inner}${attrStr}${selfClosing ? " />" : ">"}`;
}

/**
 * Inject intrinsic `width`/`height` into every `<img>` that is missing them.
 * `resolve` is injectable for testing; it defaults to `readDimensions`.
 */
export function injectImageDimensions(
  html: string,
  resolve: (src: string) => Dimensions | null = readDimensions,
): string {
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    // Already carries a dimension (hand-authored <figure> posts) → leave it
    // to the author. Acting on a half-declared image would duplicate an attr
    // and risks an aspect-ratio mismatch; only bare images get both injected.
    if (/\swidth=/i.test(tag) || /\sheight=/i.test(tag)) return tag;

    const srcMatch = tag.match(/\ssrc=(["'])(.*?)\1/i);
    const src = srcMatch?.[2];
    if (!src) return tag;

    const dim = resolve(src);
    if (!dim) return tag;

    return addAttrs(tag, {
      width: String(dim.width),
      height: String(dim.height),
    });
  });
}
