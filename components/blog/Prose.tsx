import type { ReactNode } from "react";

/**
 * Typography container for rendered Markdown.
 *
 * Lean hand-written type-system — no @tailwindcss/typography, which would
 * bring ~20kB of opinionated CSS. Keeps us inside Lighthouse 95+.
 *
 * Styling rules live in app/globals.css under .ogc-prose — see that file
 * for the canonical type-scale.
 *
 * Security: the `html` prop is ALWAYS sanitized via sanitize-html in
 * lib/blog/posts.ts before it reaches this component. The allow-list
 * there rejects <script>, inline event handlers, javascript: URLs, etc.
 * So while React's dangerouslySetInnerHTML is the injection mechanism,
 * the content itself has been scrubbed server-side at build time.
 */

export function Prose({
  html,
  children,
}: {
  /** Pre-sanitized HTML string from lib/blog/posts.ts. */
  html?: string;
  /** Alternative: render React children inside the same type container. */
  children?: ReactNode;
}) {
  if (html !== undefined) {
    // Content is sanitized at build time (see security note above).
    const injectProp = { __html: html };
    return <div className="ogc-prose" dangerouslySetInnerHTML={injectProp} />;
  }
  return <div className="ogc-prose">{children}</div>;
}
