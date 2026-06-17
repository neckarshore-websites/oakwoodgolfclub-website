import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

/**
 * Internal asset index. Catalogs project assets that don't live in the
 * main UI: the architecture / timeline diagrams and the brand media.
 *
 * Not in the navigation — reachable at /assets, linked only from the footer
 * as "(intern)". `noindex` keeps it out of search so it never competes with
 * the golf-membership pages for ranking.
 *
 * The diagrams are authored in `docs/diagrams/` (outside the Next.js build)
 * and published into `public/diagrams/` via `npm run render:diagrams -- --publish`,
 * which is what makes the interactive HTML reachable at `/diagrams/<file>.html`.
 */

export const metadata: Metadata = {
  title: "Assets — intern",
  description: "Interner Asset-Index: Architektur-Diagramme und Marken-Medien.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/assets" },
};

const REPO_BLOB =
  "https://github.com/oakwoodgolfclub-de/oakwoodgolfclub-website/blob/main";

function SectionHead({
  number,
  title,
  note,
}: {
  number: string;
  title: string;
  note?: string;
}) {
  return (
    <header className="mb-10 border-b border-[var(--color-border)] pb-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
        {number}
      </p>
      <h2 className="mt-2 font-heading text-3xl tracking-tight text-[var(--color-ink)] md:text-4xl">
        {title}
      </h2>
      {note && (
        <p className="mt-3 max-w-3xl text-sm text-[var(--color-muted)]">{note}</p>
      )}
    </header>
  );
}

function Code({ children }: { children: string }) {
  return (
    <code className="rounded-sm bg-[var(--color-sand)] px-1.5 py-0.5 font-mono text-xs text-[var(--color-ink)]">
      {children}
    </code>
  );
}

function AssetLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-fairway)] transition-colors hover:text-[var(--color-gold-deep)]"
    >
      {children}
      <span aria-hidden>↗</span>
    </a>
  );
}

type DiagramCard = {
  eyebrow: string;
  title: string;
  description: string;
  preview: { src: string; width: number; height: number; alt: string };
  html: string; // served path, e.g. /diagrams/architecture.html
  source: string; // repo-relative path under docs/diagrams
  fullPng?: string; // served full-page PNG
};

const DIAGRAMS: DiagramCard[] = [
  {
    eyebrow: "Diagramm · Architektur",
    title: "Website-Architektur",
    description:
      "Tech-Stack und Daten-Fluss: Besucher → Vercel → Next.js 16 (App Router) → Markdown-Content / Server Actions → FriendlyCaptcha + SMTP.",
    preview: {
      src: "/diagrams/architecture.png",
      width: 2300,
      height: 1198,
      alt: "Architektur-Diagramm: Besucher über Vercel zu Next.js 16, weiter zu Content, Server Actions, FriendlyCaptcha und SMTP",
    },
    html: "/diagrams/architecture.html",
    source: "docs/diagrams/architecture.html",
    fullPng: "/diagrams/architecture-full.png",
  },
  {
    eyebrow: "Diagramm · Launch",
    title: "Launch-Timeline",
    description:
      "Sechs-Tage-Launch 17.–22. April 2026, vom Next.js-16-Scaffold bis Go-Live. Zwei Gold-Meilensteine: Engineering Gate (21.) und Go-Live (22.).",
    preview: {
      src: "/diagrams/launch-timeline-full.png",
      width: 2560,
      height: 2242,
      alt: "Launch-Timeline-Diagramm über sechs Tage im April 2026 mit zwei Gold-Meilensteinen",
    },
    html: "/diagrams/launch-timeline.html",
    source: "docs/diagrams/launch-timeline.html",
  },
];

type BrandAsset = {
  title: string;
  meta: string;
  path: string; // served path
  alt: string;
  width: number;
  height: number;
  surface: "sand" | "ink" | "parchment";
};

const BRAND_ASSETS: BrandAsset[] = [
  {
    title: "Logo (Wortmarke)",
    meta: "391 × 75 · JPG",
    path: "/brand/ogc-logo.jpg",
    alt: "Oakwood Golf Club Wortmarke",
    width: 391,
    height: 75,
    surface: "parchment",
  },
  {
    title: "Hero · Golfplatz",
    meta: "600 × 384 · WebP",
    path: "/brand/hero-golfplatz.webp",
    alt: "Golfplatz im Morgenlicht",
    width: 600,
    height: 384,
    surface: "sand",
  },
  {
    title: "Hero · Sunrise",
    meta: "JPG",
    path: "/brand/hero-sunrise.jpg",
    alt: "Sonnenaufgang über dem Fairway",
    width: 600,
    height: 384,
    surface: "sand",
  },
  {
    title: "Mitgliederkarte · Vorderseite",
    meta: "1219 × 766 · WebP · Facelift 2026",
    path: "/brand/card/card-2026-front.webp",
    alt: "Mitgliederkarte Vorderseite (Design 2026)",
    width: 1219,
    height: 766,
    surface: "sand",
  },
  {
    title: "Mitgliederkarte · Rückseite",
    meta: "1219 × 766 · WebP · Facelift 2026",
    path: "/brand/card/card-2026-back.webp",
    alt: "Mitgliederkarte Rückseite (Design 2026)",
    width: 1219,
    height: 766,
    surface: "sand",
  },
  {
    title: "Mitgliederkarte · Vorderseite (Legacy 2012)",
    meta: "Karten-Artwork · JPG · Legacy",
    path: "/brand/card/card-2012-front.jpg",
    alt: "Mitgliederkarte Vorderseite (Design 2012)",
    width: 320,
    height: 200,
    surface: "ink",
  },
  {
    title: "Mitgliederkarte · Rückseite (Legacy 2012)",
    meta: "Karten-Artwork · JPG · Legacy",
    path: "/brand/card/card-2012-back.jpg",
    alt: "Mitgliederkarte Rückseite (Design 2012)",
    width: 320,
    height: 200,
    surface: "ink",
  },
];

const SURFACE: Record<BrandAsset["surface"], string> = {
  sand: "bg-[var(--color-sand)]",
  ink: "bg-[var(--color-ink)]",
  parchment: "bg-[var(--color-parchment)]",
};

export default function AssetsPage() {
  return (
    <article className="container-page py-20 md:py-24">
      {/* Header */}
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
        Intern
      </p>
      <h1 className="font-heading text-4xl tracking-tight md:text-5xl lg:text-6xl">
        Assets
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink)]/80">
        Interner Index der Projekt-Assets, die nicht in der normalen Oberfläche
        leben: die Architektur- und Launch-Diagramme sowie die Marken-Medien.
        Nicht in der Navigation — erreichbar via <Code>/assets</Code>.{" "}
        <Code>noindex</Code>, damit es nie mit den Mitglieder-Seiten ums Ranking
        konkurriert.
      </p>
      <p className="mt-4 max-w-2xl text-sm text-[var(--color-muted)]">
        Die Diagramme werden in <Code>docs/diagrams/</Code> als
        eigenständige HTML-Dateien gepflegt und mit{" "}
        <Code>npm run render:diagrams -- --publish</Code> nach{" "}
        <Code>public/diagrams/</Code> publiziert — erst dadurch sind die
        interaktiven Versionen unter <Code>/diagrams/…</Code> im Browser
        erreichbar. HTML ist die Quelle, die PNGs sind gerenderte Exporte.
      </p>

      <hr className="my-16 border-[var(--color-border)]" />

      {/* 1. Diagrams */}
      <section>
        <SectionHead
          number="01 · Diagramme"
          title="Architektur & Launch"
          note="Selbst-enthaltene HTML-Diagramme, brand-tokened aus app/globals.css (Fairway, Gold, Sand, Parchment · Playfair + Inter). Vorschau als gerendertes PNG, daneben die interaktive Live-Version."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {DIAGRAMS.map((d) => (
            <div
              key={d.html}
              className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-white"
            >
              <div className="border-b border-[var(--color-border)] bg-[var(--color-sand)] p-4">
                <Image
                  src={d.preview.src}
                  alt={d.preview.alt}
                  width={d.preview.width}
                  height={d.preview.height}
                  className="h-auto w-full rounded-sm"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-fairway)]">
                  {d.eyebrow}
                </p>
                <h3 className="mt-2 font-heading text-xl tracking-tight text-[var(--color-ink)]">
                  {d.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                  {d.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <AssetLink href={d.html}>Interaktiv öffnen</AssetLink>
                  {d.fullPng && (
                    <AssetLink href={d.fullPng}>Vollbild (PNG)</AssetLink>
                  )}
                  <AssetLink href={`${REPO_BLOB}/${d.source}`}>
                    Quelle (HTML)
                  </AssetLink>
                </div>
                <p className="mt-4 font-mono text-xs text-[var(--color-muted)]">
                  {d.source}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="my-16 border-[var(--color-border)]" />

      {/* 2. Brand media */}
      <section>
        <SectionHead
          number="02 · Marke & Medien"
          title="Logo, Hero, Karte"
          note="Marken-Medien, die im Repo unter public/brand/ liegen. Für Farben, Typografie und Favicons siehe den Style Guide — hier stehen nur die Medien-Dateien."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BRAND_ASSETS.map((a) => (
            <div
              key={a.path}
              className="flex flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-white"
            >
              <div
                className={`flex min-h-[140px] items-center justify-center p-5 ${SURFACE[a.surface]}`}
              >
                <Image
                  src={a.path}
                  alt={a.alt}
                  width={a.width}
                  height={a.height}
                  className="h-auto max-h-28 w-auto max-w-full rounded-sm"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="font-medium text-[var(--color-ink)]">{a.title}</p>
                <p className="mt-1 font-mono text-xs text-[var(--color-muted)]">
                  {a.path}
                </p>
                <p className="font-mono text-xs text-[var(--color-muted)]">
                  {a.meta}
                </p>
                <div className="mt-3">
                  <AssetLink href={a.path}>Öffnen</AssetLink>
                </div>
              </div>
            </div>
          ))}

          {/* Favicons → Style Guide (single source of truth, no duplication) */}
          <div className="flex flex-col justify-center rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-parchment)] p-5">
            <p className="font-medium text-[var(--color-ink)]">Favicons</p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Aktiv, Legacy und verworfene Entwürfe sind im{" "}
              <Link
                href="/style-guide"
                className="font-medium text-[var(--color-fairway)] hover:text-[var(--color-gold-deep)]"
              >
                Style Guide
              </Link>{" "}
              dokumentiert.
            </p>
          </div>
        </div>
      </section>

      <hr className="my-16 border-[var(--color-border)]" />

      {/* How to add */}
      <section>
        <SectionHead
          number="03 · Pflege"
          title="Asset hinzufügen"
          note="Damit dieser Index nicht driftet."
        />
        <ul className="max-w-3xl space-y-3 text-sm text-[var(--color-ink)]/80">
          <li>
            <strong className="font-semibold">Diagramm:</strong> HTML in{" "}
            <Code>docs/diagrams/</Code> ablegen, dann{" "}
            <Code>npm run render:diagrams -- --publish</Code> ausführen (rendert
            PNG-Export und publiziert HTML+PNG nach <Code>public/diagrams/</Code>
            ). Anschließend einen Eintrag in <Code>DIAGRAMS</Code> auf dieser
            Seite ergänzen.
          </li>
          <li>
            <strong className="font-semibold">Marken-Medium:</strong> Datei
            unter <Code>public/brand/</Code> ablegen und einen Eintrag in{" "}
            <Code>BRAND_ASSETS</Code> ergänzen.
          </li>
        </ul>
      </section>
    </article>
  );
}
