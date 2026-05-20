import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site-config";

/**
 * Default OG / Twitter card for the entire site.
 *
 * File convention: `app/opengraph-image.tsx` makes Next.js auto-emit
 * `og:image` + `twitter:image` meta tags on every route that does not
 * override them. See:
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
 *
 * Rendered server-side via `next/og`'s `ImageResponse` (ships with
 * Next 16). No external image asset, no design-tool dependency — the
 * card is brand-token-driven JSX. Re-renders deterministically on
 * deploy; Vercel CDN-caches the PNG output.
 *
 * Brand tokens duplicated as inline hex values because `ImageResponse`
 * does not load `globals.css` — utility classes don't apply, only
 * inline styles do. The hexes here mirror `app/globals.css` `@theme`:
 *   - fairway        #1b6640
 *   - fairway-bright #52b27f
 *   - gold           #d4a12e
 *   - parchment      #fafafa
 *   - sand           #f3ead4
 *
 * Typography: system-fallback serif (Georgia) for headlines and
 * system-sans for the eyebrow / footer. A future iteration can fetch
 * the Playfair Display TTF at build time and pass it via `fonts:[]`
 * for stricter visual parity — for the v1 OG card the system serif is
 * sufficient and removes a remote-fetch risk at request time.
 */

export const runtime = "nodejs";

export const alt = `${SITE.name} — ${SITE.tagline}`;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1b6640",
          color: "#fafafa",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 96px",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        {/* Top: eyebrow + gold rule */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span
            style={{
              fontSize: 24,
              fontFamily: "system-ui, sans-serif",
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#f3ead4",
              fontWeight: 500,
            }}
          >
            {SITE.name}
          </span>
          <div
            style={{
              width: 64,
              height: 3,
              background: "#d4a12e",
              borderRadius: 2,
            }}
          />
        </div>

        {/* Middle: hero copy */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span
            style={{
              fontSize: 84,
              lineHeight: 1.05,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#fafafa",
            }}
          >
            Fernmitgliedschaft
          </span>
          <span
            style={{
              fontSize: 84,
              lineHeight: 1.05,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#fafafa",
            }}
          >
            im Golfclub für{" "}
            <span style={{ color: "#52b27f", fontStyle: "italic" }}>
              55 Euro
            </span>
          </span>
        </div>

        {/* Bottom: domain + provenance */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontFamily: "system-ui, sans-serif",
            fontSize: 22,
            color: "#f3ead4",
          }}
        >
          <span style={{ letterSpacing: 1 }}>oakwoodgolfclub.de</span>
          <span style={{ letterSpacing: 1, opacity: 0.78 }}>
            gegründet {SITE.founded}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
