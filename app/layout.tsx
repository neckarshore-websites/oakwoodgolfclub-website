import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { JsonLd, organizationSchema } from "@/components/JsonLd";
import { SITE } from "@/lib/site-config";
import "./globals.css";

/**
 * Fonts — self-hosted at build time by next/font/google.
 * No runtime request to Google is ever made; fonts are served from the
 * same origin as the site (DSGVO-konform, matches Phase-1-Plan §Tech Stack).
 */
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#1b6640", // synced with --color-fairway in globals.css (v0.2)
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Fernmitgliedschaft im Golfclub für 55 Euro`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  alternates: {
    canonical: "/",
    languages: { "de-DE": "/" },
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Fernmitgliedschaft im Golfclub für 55 Euro`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Fernmitgliedschaft im Golfclub für 55 Euro`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
  category: "sports",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={SITE.language} className={`${playfair.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <JsonLd id="org-schema" data={organizationSchema()} />
        {/* Vercel Web Analytics — cookieless, DSGVO-safe, no consent banner needed.
            Only emits when deployed on Vercel; no-op in local dev. */}
        <Analytics />
      </body>
    </html>
  );
}
