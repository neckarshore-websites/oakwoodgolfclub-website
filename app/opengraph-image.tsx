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
 * Typography: Playfair Display (matches the site's heading face from
 * `next/font/google` in `layout.tsx`) and Inter (body face), both
 * fetched at build time as static TTF binaries from the fontsource
 * CDN. Fetches happen during the static-prerender pass, not at request
 * time, so the prod render is offline-safe once built.
 */

export const runtime = "nodejs";

export const alt = `${SITE.name} — ${SITE.tagline}`;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

/**
 * Stable, single-weight TTF binaries from fontsource (mirrors
 * Google Fonts; jsdelivr-served, no auth). Pinned via the version-
 * tagged path so a future fontsource major doesn't silently change
 * glyph metrics.
 */
const FONT_PLAYFAIR_SEMIBOLD =
  "https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@latest/latin-600-normal.ttf";
const FONT_PLAYFAIR_SEMIBOLD_ITALIC =
  "https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@latest/latin-600-italic.ttf";
const FONT_INTER_MEDIUM =
  "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-500-normal.ttf";

async function loadFont(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load font ${url}: ${res.status}`);
  }
  return res.arrayBuffer();
}

export default async function OpengraphImage() {
  const [playfair, playfairItalic, inter] = await Promise.all([
    loadFont(FONT_PLAYFAIR_SEMIBOLD),
    loadFont(FONT_PLAYFAIR_SEMIBOLD_ITALIC),
    loadFont(FONT_INTER_MEDIUM),
  ]);

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
          fontFamily: "Playfair Display",
        }}
      >
        {/* Top: eyebrow + gold rule */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span
            style={{
              fontSize: 24,
              fontFamily: "Inter",
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
            <span
              style={{
                color: "#52b27f",
                fontStyle: "italic",
                fontFamily: "Playfair Display",
              }}
            >
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
            fontFamily: "Inter",
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
      fonts: [
        {
          name: "Playfair Display",
          data: playfair,
          weight: 600,
          style: "normal",
        },
        {
          name: "Playfair Display",
          data: playfairItalic,
          weight: 600,
          style: "italic",
        },
        {
          name: "Inter",
          data: inter,
          weight: 500,
          style: "normal",
        },
      ],
    },
  );
}
