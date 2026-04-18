import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  CreditCard,
  IdCard,
  Info,
  Mail,
  MapPin,
  Menu,
  Phone,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import {
  GolfBall,
  GolfClub,
  GolfFairway,
  GolfFlag,
  GolfHandicap,
  GolfHole,
  GolfScorecard,
  GolfTee,
} from "@/components/icons/GolfIcons";
import {
  TextField,
  TextareaField,
  SelectField,
  RadioGroupField,
  ConsentField,
} from "@/components/forms/FormField";

/**
 * Internal Style Guide / Design System reference page.
 *
 * Not linked from the main navigation. Reachable at /style-guide so the
 * designer (and the User) can eyeball every token in situ. `noindex` keeps
 * search engines out. No business copy — this is a reference, not a page.
 */

export const metadata: Metadata = {
  title: "Style Guide — intern",
  description: "Internes Design-System: Farben, Typografie, Komponenten.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/style-guide" },
};

type Swatch = {
  token: string;
  name: string;
  hex: string;
  rgb: string;
  usage: string;
  /** Tailwind class for the background rectangle. */
  bg: string;
  /** Tailwind class for the label text shown on the swatch. */
  fg: string;
  /** Optional AA/AAA contrast note (pair vs base text). */
  contrast?: string;
};

const SWATCHES: Swatch[] = [
  {
    token: "--color-ink",
    name: "Ink",
    hex: "#0a0a0a",
    rgb: "10, 10, 10",
    usage: "Base text. Dark surfaces (Footer, CTA-Dark).",
    bg: "bg-[var(--color-ink)]",
    fg: "text-[var(--color-parchment)]",
    contrast: "AAA on parchment (20.1 : 1)",
  },
  {
    token: "--color-parchment",
    name: "Parchment",
    hex: "#fafafa",
    rgb: "250, 250, 250",
    usage: "Page background. Card surfaces. Light text on dark.",
    bg: "bg-[var(--color-parchment)] border border-[var(--color-border)]",
    fg: "text-[var(--color-ink)]",
  },
  {
    token: "--color-muted",
    name: "Muted",
    hex: "#4b5563",
    rgb: "75, 85, 99",
    usage: "Secondary text, captions, helper-copy. AA on parchment.",
    bg: "bg-[var(--color-muted)]",
    fg: "text-[var(--color-parchment)]",
    contrast: "AA on parchment (6.97 : 1)",
  },
  {
    token: "--color-border",
    name: "Border",
    hex: "#e5e7eb",
    rgb: "229, 231, 235",
    usage: "Hairlines, dividers, input-borders (via /15 opacity).",
    bg: "bg-[var(--color-border)]",
    fg: "text-[var(--color-ink)]",
  },
  {
    token: "--color-fairway",
    name: "Fairway",
    hex: "#1b6640",
    rgb: "27, 102, 64",
    usage: "Primary brand accent. Links, primary button, focus ring.",
    bg: "bg-[var(--color-fairway)]",
    fg: "text-[var(--color-parchment)]",
    contrast: "AAA on parchment (7.2 : 1)",
  },
  {
    token: "--color-fairway-hover",
    name: "Fairway Hover",
    hex: "#2a8a52",
    rgb: "42, 138, 82",
    usage: "Hover state for primary links and buttons. Brighter than fairway for clear state change.",
    bg: "bg-[var(--color-fairway-hover)]",
    fg: "text-[var(--color-parchment)]",
  },
  {
    token: "--color-gold",
    name: "Gold",
    hex: "#d4a12e",
    rgb: "212, 161, 46",
    usage: "Premium-Akzent — NIE als Flächenfarbe. Footer-Überschriften, Eyebrows auf dunklem Grund, Hover-Accent.",
    bg: "bg-[var(--color-gold)]",
    fg: "text-[var(--color-ink)]",
    contrast: "AAA on ink (8.17 : 1) · 2.95 : 1 on fairway (decorative only!)",
  },
  {
    token: "--color-gold-deep",
    name: "Gold Deep",
    hex: "#7a5a0e",
    rgb: "122, 90, 14",
    usage: "Dunkles Gold für kleinen Text auf hellem Grund (Eyebrows auf parchment). AA-safe.",
    bg: "bg-[var(--color-gold-deep)]",
    fg: "text-[var(--color-parchment)]",
    contrast: "AA on parchment (5.94 : 1)",
  },
  {
    token: "--color-sand",
    name: "Sand",
    hex: "#f3ead4",
    rgb: "243, 234, 212",
    usage: "Warm background-wash. Sparsam eingesetzt für Akzent-Sections.",
    bg: "bg-[var(--color-sand)]",
    fg: "text-[var(--color-ink)]",
  },
];

function Swatch({ swatch }: { swatch: Swatch }) {
  return (
    <div className="flex flex-col gap-3 rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] p-4">
      <div
        className={`flex h-24 items-end rounded-sm p-3 ${swatch.bg}`}
        aria-hidden
      >
        <span className={`font-mono text-xs ${swatch.fg}`}>
          {swatch.hex}
        </span>
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <p className="font-medium text-[var(--color-ink)]">{swatch.name}</p>
        <p className="font-mono text-xs text-[var(--color-muted)]">
          {swatch.token}
        </p>
        <p className="font-mono text-xs text-[var(--color-muted)]">
          rgb({swatch.rgb})
        </p>
        <p className="mt-2 text-xs text-[var(--color-ink)]/75">{swatch.usage}</p>
        {swatch.contrast && (
          <p className="mt-1 text-xs text-[var(--color-fairway)]">
            {swatch.contrast}
          </p>
        )}
      </div>
    </div>
  );
}

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
        <p className="mt-3 max-w-3xl text-sm text-[var(--color-muted)]">
          {note}
        </p>
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

export default function StyleGuidePage() {
  return (
    <article className="container-page py-20 md:py-24">
      {/* Header */}
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
        Intern
      </p>
      <h1 className="font-heading text-4xl tracking-tight md:text-5xl lg:text-6xl">
        Style Guide
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink)]/80">
        Design-System-Referenz für oakwoodgolfclub.de. Zeigt jede Farbe,
        jede Schrift, jede Komponente in situ. Noch nicht verlinkt in der
        Navigation — erreichbar via direkte URL{" "}
        <Code>/style-guide</Code>. <Code>noindex</Code>, damit Google nichts
        findet.
      </p>

      <p className="mt-4 text-sm text-[var(--color-muted)]">
        Quelle aller Tokens:{" "}
        <Code>app/globals.css</Code> (Tailwind v4 <Code>@theme</Code>).
        Alle Komponenten leben in <Code>components/</Code>. Änderungen
        passieren dort, nicht hier.
      </p>

      <hr className="my-16 border-[var(--color-border)]" />

      {/* 1. Colors */}
      <section>
        <SectionHead
          number="01 · Farben"
          title="Palette"
          note="Traditional-Modern-Golf — Fairway-Grün als Brand-Accent, Gold sparsam als Premium-Signal. Kontrast-Werte sind gegen Parchment (hellen Grund) getestet, sofern nicht anders angegeben."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SWATCHES.map((s) => (
            <Swatch key={s.token} swatch={s} />
          ))}
        </div>
      </section>

      <hr className="my-16 border-[var(--color-border)]" />

      {/* 2. Typography */}
      <section>
        <SectionHead
          number="02 · Typografie"
          title="Schrift-System"
          note="Zwei Schriften, sparsam kombiniert. Headings in Playfair Display (self-hosted via next/font), Body in Inter. Kerning tight (−0.01em) auf Headings — kein Sport-Look, kein Newspaper-Look."
        />

        <div className="space-y-10">
          <div>
            <p className="mb-2 font-mono text-xs text-[var(--color-muted)]">
              h1 · font-heading · text-6xl · tracking-tight
            </p>
            <p className="font-heading text-6xl tracking-tight text-[var(--color-ink)]">
              Noch ein Jahr dabei.
            </p>
          </div>
          <div>
            <p className="mb-2 font-mono text-xs text-[var(--color-muted)]">
              h2 · font-heading · text-4xl · tracking-tight
            </p>
            <p className="font-heading text-4xl tracking-tight text-[var(--color-ink)]">
              300+ Golfer vertrauen uns.
            </p>
          </div>
          <div>
            <p className="mb-2 font-mono text-xs text-[var(--color-muted)]">
              h3 · font-heading · text-2xl · tracking-tight
            </p>
            <p className="font-heading text-2xl tracking-tight text-[var(--color-ink)]">
              Die Geschichte
            </p>
          </div>
          <div>
            <p className="mb-2 font-mono text-xs text-[var(--color-muted)]">
              h4 · font-heading · text-xl
            </p>
            <p className="font-heading text-xl text-[var(--color-ink)]">
              Was uns anders macht
            </p>
          </div>
          <div>
            <p className="mb-2 font-mono text-xs text-[var(--color-muted)]">
              Body · font-body (Inter) · text-lg · leading-relaxed
            </p>
            <p className="max-w-2xl text-lg leading-relaxed text-[var(--color-ink)]/80">
              Fernmitgliedschaft im Golfclub für 55 Euro pro Jahr — mit
              offizieller Mitgliederkarte, akzeptiert auf rund 95 % der
              österreichischen Golfplätze.
            </p>
          </div>
          <div>
            <p className="mb-2 font-mono text-xs text-[var(--color-muted)]">
              Body · text-base · text-ink/75
            </p>
            <p className="max-w-2xl text-base text-[var(--color-ink)]/75">
              Der Oakwood Golf Club ist seit 2009 eine Fernmitgliedschaft für
              Golferinnen und Golfer in der DACH-Region, die keinen klassischen
              Heimatplatz brauchen oder wollen.
            </p>
          </div>
          <div>
            <p className="mb-2 font-mono text-xs text-[var(--color-muted)]">
              Eyebrow · text-xs · uppercase · tracking-[0.2em] ·
              text-gold-deep
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
              Seit 2009
            </p>
          </div>
          <div>
            <p className="mb-2 font-mono text-xs text-[var(--color-muted)]">
              Small · text-xs · text-muted
            </p>
            <p className="text-xs text-[var(--color-muted)]">
              Wir antworten in der Regel innerhalb weniger Tage.
            </p>
          </div>
        </div>
      </section>

      <hr className="my-16 border-[var(--color-border)]" />

      {/* 3. Buttons */}
      <section>
        <SectionHead
          number="03 · Buttons"
          title="Button-System"
          note="Drei Varianten: Primary (solid fairway), Secondary (outline parchment), Ghost (text link). Disabled-State immer via opacity-60 + cursor-not-allowed."
        />

        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-sm bg-[var(--color-fairway)] px-6 py-3 text-base font-medium text-[var(--color-parchment)] transition-colors hover:bg-[var(--color-fairway-hover)]"
          >
            Primary — Jetzt Mitglied werden
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-sm bg-[var(--color-gold)] px-6 py-3 text-base font-medium text-[var(--color-ink)] transition-opacity hover:opacity-90"
          >
            Gold — Hervorhebung (CTA-Dark)
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-sm border border-[var(--color-ink)]/30 px-6 py-3 text-base font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]"
          >
            Secondary — Frage stellen
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-sm px-4 py-2 text-base font-medium text-[var(--color-fairway)] underline underline-offset-4 hover:text-[var(--color-fairway-hover)]"
          >
            Ghost — Mehr erfahren
          </button>
          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center rounded-sm bg-[var(--color-fairway)] px-6 py-3 text-base font-medium text-[var(--color-parchment)] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            Disabled · Wird gesendet…
          </button>
        </div>

        <div className="mt-8 rounded-sm bg-[var(--color-ink)] p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)]">
            Auf dunklem Grund
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-sm bg-[var(--color-gold)] px-6 py-3 text-base font-medium text-[var(--color-ink)] transition-opacity hover:opacity-90"
            >
              Gold · Primary-Dark
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-sm border border-[var(--color-parchment)]/30 px-6 py-3 text-base font-medium text-[var(--color-parchment)] transition-colors hover:border-[var(--color-parchment)]"
            >
              Outline · Secondary-Dark
            </button>
          </div>
        </div>
      </section>

      <hr className="my-16 border-[var(--color-border)]" />

      {/* 4. Form elements */}
      <section>
        <SectionHead
          number="04 · Formulare"
          title="Formular-Primitive"
          note="Alle Formulare der Site nutzen diese Primitive aus components/forms/FormField.tsx. Konsistenz über Kontakt / Signup / Renewal."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <TextField
              name="sg-text"
              label="Text · required"
              required
              placeholder="Vorname Nachname"
            />
            <TextField
              name="sg-text-err"
              label="Text · mit Error"
              required
              placeholder="name@example.de"
              error="Bitte eine gültige E-Mail eingeben."
            />
            <TextField
              name="sg-date"
              label="Datum"
              type="date"
              defaultValue="2026-04-17"
            />
            <SelectField
              name="sg-select"
              label="Select — matched height"
              required
              defaultValue="Deutschland"
              options={[
                { value: "Deutschland", label: "Deutschland" },
                { value: "Österreich", label: "Österreich" },
                { value: "Schweiz", label: "Schweiz" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-5">
            <TextareaField
              name="sg-textarea"
              label="Textarea"
              placeholder="Was sollten wir noch wissen?"
              rows={3}
            />
            <RadioGroupField
              name="sg-radio-inline"
              label="Radio · inline"
              required
              inline
              options={[
                { value: "herr", label: "Herr" },
                { value: "frau", label: "Frau" },
                { value: "divers", label: "Divers" },
                { value: "keine", label: "Möchte ich nicht sagen" },
              ]}
            />
            <ConsentField name="sg-consent">
              Ich habe die Datenschutzerklärung gelesen und stimme zu.
            </ConsentField>
          </div>
        </div>
      </section>

      <hr className="my-16 border-[var(--color-border)]" />

      {/* 5. Surfaces */}
      <section>
        <SectionHead
          number="05 · Flächen"
          title="Surfaces & Cards"
          note="Drei Haupt-Surface-Typen: Parchment (Default), Sand (Warm-Akzent), Ink/Fairway (Dark-Sections für CTAs und Footer)."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
              Parchment Card
            </p>
            <p className="mt-3 font-heading text-xl text-[var(--color-ink)]">
              Default-Fläche
            </p>
            <p className="mt-2 text-sm text-[var(--color-ink)]/75">
              Page-Background, Form-Wrapper, Info-Asides.
            </p>
          </div>
          <div className="rounded-sm bg-[var(--color-sand)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
              Sand Wash
            </p>
            <p className="mt-3 font-heading text-xl text-[var(--color-ink)]">
              Warm-Akzent
            </p>
            <p className="mt-2 text-sm text-[var(--color-ink)]/75">
              Sparsam — für Abschnitte, die ruhen sollen.
            </p>
          </div>
          <div className="rounded-sm bg-[var(--color-ink)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
              Ink Surface
            </p>
            <p className="mt-3 font-heading text-xl text-[var(--color-parchment)]">
              Dark-Section
            </p>
            <p className="mt-2 text-sm text-[var(--color-parchment)]/75">
              Footer, CTA-Closer, Dark-Mode-Kandidat.
            </p>
          </div>
          <div className="rounded-sm bg-[var(--color-fairway)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-parchment)]/80">
              Fairway
            </p>
            <p className="mt-3 font-heading text-xl text-[var(--color-parchment)]">
              Brand-Punctuation
            </p>
            <p className="mt-2 text-sm text-[var(--color-parchment)]/80">
              Closing-CTA, Hero-Akzent, Footer-Border.
            </p>
          </div>
          <div className="rounded-sm border border-[var(--color-fairway)]/40 bg-[var(--color-fairway)]/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-fairway)]">
              Success Banner
            </p>
            <p className="mt-3 font-heading text-xl text-[var(--color-ink)]">
              Form-Success-State
            </p>
            <p className="mt-2 text-sm text-[var(--color-ink)]/75">
              Nach erfolgreichem Form-Submit.
            </p>
          </div>
          <div className="rounded-sm border border-red-700/30 bg-red-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-800">
              Error Banner
            </p>
            <p className="mt-3 font-heading text-xl text-[var(--color-ink)]">
              Form-Error-State
            </p>
            <p className="mt-2 text-sm text-red-900/80">
              Bei technischen Problemen oder Validierungsfehlern.
            </p>
          </div>
        </div>
      </section>

      <hr className="my-16 border-[var(--color-border)]" />

      {/* 6. Spacing */}
      <section>
        <SectionHead
          number="06 · Spacing & Layout"
          title="Container & Rhythmus"
          note="Ein einziger Container — .container-page, 72rem (1152px) Max-Width, responsive Padding. Vertikaler Rhythmus über py-20 / py-24 auf Section-Ebene."
        />

        <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] p-5">
            <dt className="font-mono text-xs text-[var(--color-muted)]">
              .container-page
            </dt>
            <dd className="mt-2 text-sm text-[var(--color-ink)]/80">
              max-width: 72rem (1152px) · mx-auto · px-5 (640+) px-6 (1024+) px-8
            </dd>
          </div>
          <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] p-5">
            <dt className="font-mono text-xs text-[var(--color-muted)]">
              Section-Padding vertikal
            </dt>
            <dd className="mt-2 text-sm text-[var(--color-ink)]/80">
              py-20 md:py-24 — 80px mobil, 96px Desktop. Jede Hauptsection.
            </dd>
          </div>
          <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] p-5">
            <dt className="font-mono text-xs text-[var(--color-muted)]">
              Card-Padding
            </dt>
            <dd className="mt-2 text-sm text-[var(--color-ink)]/80">
              p-5 (Form-Group), p-6 (Standard-Card), p-8 (Hero-Block)
            </dd>
          </div>
          <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] p-5">
            <dt className="font-mono text-xs text-[var(--color-muted)]">
              Form-Spacing
            </dt>
            <dd className="mt-2 text-sm text-[var(--color-ink)]/80">
              gap-6 (Field-Abstand), gap-4 (Field-Sub-Grid, z. B. PLZ + Ort)
            </dd>
          </div>
          <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] p-5">
            <dt className="font-mono text-xs text-[var(--color-muted)]">
              Border-Radius
            </dt>
            <dd className="mt-2 text-sm text-[var(--color-ink)]/80">
              rounded-sm durchgängig. Keine pillfoermigen Buttons, keine
              rounded-xl-Cards. Ruhig und klassisch.
            </dd>
          </div>
          <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] p-5">
            <dt className="font-mono text-xs text-[var(--color-muted)]">
              Focus-Ring
            </dt>
            <dd className="mt-2 text-sm text-[var(--color-ink)]/80">
              outline 2px fairway · offset 2px · radius 2px. Nur auf
              :focus-visible (keyboard-only).
            </dd>
          </div>
        </dl>
      </section>

      <hr className="my-16 border-[var(--color-border)]" />

      {/* 7. Assets / Favicons — Aktuell / Vorher / Verworfene Entwürfe */}
      <section>
        <SectionHead
          number="07 · Assets"
          title="Favicons"
          note="Aktuell aktiv: GolfHole auf Fairway-Grund (temporärer Start-Zustand). Legacy-Icons von 2017 (WordPress-Avada-Theme-Uploads) und frühere Stern-Entwürfe stehen daneben zum Vergleich. Finaler Brand Mark noch nicht definiert — siehe BACKLOG #18."
        />

        {/* Aktuell aktiv */}
        <div className="mb-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-fairway)]">
            Aktuell aktiv · /app/icon.svg
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-3 rounded-sm border border-[var(--color-fairway)]/40 bg-[var(--color-fairway)]/5 p-4 sm:col-span-2">
              <div className="flex h-32 items-center justify-center rounded-sm bg-[var(--color-sand)]">
                <Image
                  src="/style-guide/current-favicon.svg"
                  alt="Aktives Favicon · GolfHole mit Pin"
                  width={96}
                  height={96}
                  unoptimized
                />
              </div>
              <div className="text-sm">
                <p className="font-medium text-[var(--color-ink)]">
                  GolfHole-Motiv · Fairway-Grund
                </p>
                <p className="font-mono text-xs text-[var(--color-muted)]">
                  64 × 64 SVG · ~400 B · scaliert auf jede Größe
                </p>
                <p className="mt-2 text-xs text-[var(--color-ink)]/75">
                  Aus <Code>components/icons/GolfIcons.tsx</Code> (GolfHole),
                  skaliert auf 64×64, Stroke 4 für Lesbarkeit bei 16px.
                  Fairway (<Code>#1b6640</Code>) Grund + Parchment
                  (<Code>#fafafa</Code>) Mark. Temporäre Übergangslösung.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Real-Size Tab
              </p>
              <div className="flex items-center gap-3 rounded-sm bg-[var(--color-sand)] p-3">
                <Image
                  src="/style-guide/current-favicon.svg"
                  alt="Tab-Größe 16px"
                  width={16}
                  height={16}
                  unoptimized
                />
                <span className="text-xs text-[var(--color-ink)]">
                  Oakwood Golf Club
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-sm bg-[var(--color-sand)] p-3">
                <Image
                  src="/style-guide/current-favicon.svg"
                  alt="Bookmark-Größe 32px"
                  width={32}
                  height={32}
                  unoptimized
                />
                <span className="text-xs text-[var(--color-ink)]">
                  Bookmark 32px
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-sm bg-[var(--color-sand)] p-3">
                <Image
                  src="/style-guide/current-favicon.svg"
                  alt="Touch-Icon 64px"
                  width={64}
                  height={64}
                  unoptimized
                />
                <span className="text-xs text-[var(--color-ink)]">
                  Touch 64px
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Vorher */}
        <div className="mb-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Vorher · oakwoodgolfclub.de (WordPress, seit 2017)
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-3 rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] p-4">
              <div className="flex h-24 items-center justify-center rounded-sm bg-[var(--color-sand)]">
                <Image
                  src="/style-guide/legacy-favicon-16.png"
                  alt="Legacy favicon 16x16, Original-Pixelgröße"
                  width={16}
                  height={16}
                  unoptimized
                  className="[image-rendering:pixelated]"
                />
              </div>
              <div className="text-sm">
                <p className="font-medium text-[var(--color-ink)]">
                  favicon.png
                </p>
                <p className="font-mono text-xs text-[var(--color-muted)]">
                  16 × 16 PNG · 3.5 KB
                </p>
                <p className="mt-2 text-xs text-[var(--color-ink)]/75">
                  Offiziell verlinkt im &lt;head&gt;. Grünes Motiv, aber bei
                  16px schwer lesbar.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] p-4">
              <div className="flex h-24 items-center justify-center rounded-sm bg-[var(--color-sand)]">
                <Image
                  src="/style-guide/legacy-favicon-16.png"
                  alt="Legacy favicon 16x16, auf 64px hochskaliert"
                  width={64}
                  height={64}
                  unoptimized
                  className="[image-rendering:pixelated]"
                />
              </div>
              <div className="text-sm">
                <p className="font-medium text-[var(--color-ink)]">
                  favicon.png · 4× skaliert
                </p>
                <p className="font-mono text-xs text-[var(--color-muted)]">
                  Pixelated-Render
                </p>
                <p className="mt-2 text-xs text-[var(--color-ink)]/75">
                  Macht das 16px-Pixel-Raster sichtbar. Zeigt, wie wenig
                  Detail das Original hat.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] p-4">
              <div className="flex h-24 items-center justify-center rounded-sm bg-[var(--color-sand)]">
                <Image
                  src="/style-guide/legacy-apple-touch.jpg"
                  alt="Legacy apple-touch-icon, 124x149 Original"
                  width={62}
                  height={75}
                  unoptimized
                />
              </div>
              <div className="text-sm">
                <p className="font-medium text-[var(--color-ink)]">
                  apple-touch-icon.jpg
                </p>
                <p className="font-mono text-xs text-[var(--color-muted)]">
                  124 × 149 JPEG · 7.3 KB
                </p>
                <p className="mt-2 text-xs text-[var(--color-ink)]/75">
                  Nicht quadratisch (soll 180×180). Glossy Highlights,
                  Web-2.0-Look. Beste Quelle für das Motiv.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] p-4">
              <div className="flex h-24 items-center justify-center rounded-sm bg-[var(--color-sand)]">
                <Image
                  src="/style-guide/legacy-favicon-root.png"
                  alt="WordPress-Default-W-Favicon"
                  width={48}
                  height={48}
                  unoptimized
                />
              </div>
              <div className="text-sm">
                <p className="font-medium text-[var(--color-ink)]">
                  /favicon.ico (Root)
                </p>
                <p className="font-mono text-xs text-[var(--color-muted)]">
                  80 × 80 PNG · 4.1 KB
                </p>
                <p className="mt-2 text-xs text-red-700">
                  ⚠ Das ist das WordPress-Default-&ldquo;W&rdquo;. Kein OGC-Branding.
                  Unbrauchbar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Verworfene Entwürfe */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Verworfen · Stern-Entwürfe (zu generisch, kein Golf-Bezug)
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-3 rounded-sm border border-[var(--color-fairway)]/40 bg-[var(--color-fairway)]/5 p-4">
              <div className="flex h-24 items-center justify-center rounded-sm bg-[var(--color-sand)]">
                <Image
                  src="/style-guide/proposed-favicon-light.svg"
                  alt="Favicon-Entwurf hell — Fairway-Stern auf Parchment"
                  width={64}
                  height={64}
                  unoptimized
                />
              </div>
              <div className="text-sm">
                <p className="font-medium text-[var(--color-ink)]">
                  Variante A · Hell
                </p>
                <p className="font-mono text-xs text-[var(--color-muted)]">
                  Parchment Ground · Fairway Mark
                </p>
                <p className="mt-2 text-xs text-[var(--color-ink)]/75">
                  Ruhig, matcht die Site-Grundfläche. Im Safari-Tab auf
                  weißem Grund weniger präsent.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-sm border border-[var(--color-fairway)]/40 bg-[var(--color-fairway)]/5 p-4">
              <div className="flex h-24 items-center justify-center rounded-sm bg-[var(--color-sand)]">
                <Image
                  src="/style-guide/proposed-favicon-dark.svg"
                  alt="Favicon-Entwurf dunkel — Parchment-Stern auf Fairway"
                  width={64}
                  height={64}
                  unoptimized
                />
              </div>
              <div className="text-sm">
                <p className="font-medium text-[var(--color-ink)]">
                  Variante B · Fairway
                </p>
                <p className="font-mono text-xs text-[var(--color-muted)]">
                  Fairway Ground · Parchment Mark
                </p>
                <p className="mt-2 text-xs text-[var(--color-ink)]/75">
                  Markanter im Tab-Listing, Brand-Signal sofort erkennbar.
                  Meine persönliche Empfehlung.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-sm border border-[var(--color-fairway)]/40 bg-[var(--color-fairway)]/5 p-4">
              <div className="flex h-24 items-center justify-center rounded-sm bg-[var(--color-sand)]">
                <Image
                  src="/style-guide/proposed-favicon-ink.svg"
                  alt="Favicon-Entwurf dunkel-gold — Gold-Stern auf Ink"
                  width={64}
                  height={64}
                  unoptimized
                />
              </div>
              <div className="text-sm">
                <p className="font-medium text-[var(--color-ink)]">
                  Variante C · Ink / Gold
                </p>
                <p className="font-mono text-xs text-[var(--color-muted)]">
                  Ink Ground · Gold Mark
                </p>
                <p className="mt-2 text-xs text-[var(--color-ink)]/75">
                  Premium-Optik, matcht den Footer. Gold als sparsamer
                  Akzent — riskiert Country-Club-Kitsch.
                </p>
              </div>
            </div>
          </div>

          {/* Real-size preview */}
          <div className="mt-10 rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Real-Size-Vorschau · wie sie im Browser-Tab aussehen
            </p>
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-3">
                <Image
                  src="/style-guide/proposed-favicon-light.svg"
                  alt="Variante A · 16px Tab-Größe"
                  width={16}
                  height={16}
                  unoptimized
                />
                <span className="text-xs text-[var(--color-muted)]">Variante A · 16px</span>
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src="/style-guide/proposed-favicon-dark.svg"
                  alt="Variante B · 16px Tab-Größe"
                  width={16}
                  height={16}
                  unoptimized
                />
                <span className="text-xs text-[var(--color-muted)]">Variante B · 16px</span>
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src="/style-guide/proposed-favicon-ink.svg"
                  alt="Variante C · 16px Tab-Größe"
                  width={16}
                  height={16}
                  unoptimized
                />
                <span className="text-xs text-[var(--color-muted)]">Variante C · 16px</span>
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src="/style-guide/legacy-favicon-16.png"
                  alt="Legacy · 16px (Original)"
                  width={16}
                  height={16}
                  unoptimized
                />
                <span className="text-xs text-[var(--color-muted)]">Legacy · 16px</span>
              </div>
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-sm text-[var(--color-muted)]">
            <strong className="text-[var(--color-ink)]">Status:</strong>{" "}
            Diese drei Stern-Varianten wurden verworfen — zu generisch, kein
            Golf-Bezug. Ersetzt durch das GolfHole-Motiv (oben, aktuell aktiv)
            als temporäre Lösung. Finale Logo-/Brand-Mark-Entscheidung
            siehe BACKLOG #18.
          </p>
        </div>
      </section>

      <hr className="my-16 border-[var(--color-border)]" />

      {/* 8. Icons — moved to the end (was 06). Compact 3-column layout. */}
      <IconSystemSection />

      <hr className="my-16 border-[var(--color-border)]" />

      {/* Footer-Nav back to app */}
      <p className="text-sm text-[var(--color-muted)]">
        <Link
          href="/"
          className="text-[var(--color-fairway)] underline underline-offset-4 hover:text-[var(--color-fairway-hover)]"
        >
          ← Zurück zur Startseite
        </Link>
      </p>
    </article>
  );
}

/* -----------------------------------------------------------------------
 * Icon System section (08) — compact 3-column layout at the end of the
 * style guide. Two families:
 *
 *   1. Lucide UI icons (lucide-react 1.8.0) — Kontakt, Navigation, Status,
 *      Mitgliedschaft. Stroke-based, 1.75px default, matches Footer SVGs.
 *   2. Custom Golf icons — drawn in-house in the same visual language.
 *      Lucide has NO golf-specific marks, so Flag/Trophy-as-golf was
 *      faking it. These are real: pin-flag, ball, tee, club, scorecard,
 *      hole, fairway, handicap.
 * ---------------------------------------------------------------------*/

type GolfIconComponent = ComponentType<SVGProps<SVGSVGElement> & {
  size?: number;
  strokeWidth?: number;
}>;

type IconEntry = {
  name: string;
  use: string;
  icon?: LucideIcon;
  golfIcon?: GolfIconComponent;
};

const CONTACT_ICONS: IconEntry[] = [
  { icon: Mail, name: "Mail", use: "E-Mail-Adressen" },
  { icon: Phone, name: "Phone", use: "Telefon-Link" },
  { icon: MapPin, name: "MapPin", use: "Postanschrift" },
];

const NAV_ICONS: IconEntry[] = [
  { icon: ArrowRight, name: "ArrowRight", use: "CTA-Button-Suffix" },
  { icon: ChevronRight, name: "ChevronRight", use: "Breadcrumb, Link" },
  { icon: ChevronDown, name: "ChevronDown", use: "Select, Accordion" },
  { icon: Menu, name: "Menu", use: "Mobile-Nav" },
  { icon: X, name: "X", use: "Close, Dismiss" },
];

const STATUS_ICONS: IconEntry[] = [
  { icon: CheckCircle2, name: "CheckCircle2", use: "Form-Success" },
  { icon: AlertCircle, name: "AlertCircle", use: "Form-Error" },
  { icon: Info, name: "Info", use: "Info-Box" },
  { icon: Check, name: "Check", use: "Consent-OK" },
];

const MEMBER_ICONS: IconEntry[] = [
  { icon: CircleUserRound, name: "CircleUserRound", use: "Einzel-Mitglied" },
  { icon: Users, name: "Users", use: "Flight, 4er-Tarif" },
  { icon: IdCard, name: "IdCard", use: "Mitgliederkarte" },
  { icon: CreditCard, name: "CreditCard", use: "Banküberweisung" },
  { icon: Calendar, name: "Calendar", use: "12-Monats-Laufzeit" },
];

const GOLF_ICONS: IconEntry[] = [
  { golfIcon: GolfFlag, name: "GolfFlag", use: "Pin-Flag auf Green — Primär-Marker" },
  { golfIcon: GolfBall, name: "GolfBall", use: "Ball mit Dimples" },
  { golfIcon: GolfTee, name: "GolfTee", use: "Tee mit Ball, Abschlag" },
  { golfIcon: GolfClub, name: "GolfClub", use: "Schläger (Putter-Stil)" },
  { golfIcon: GolfScorecard, name: "GolfScorecard", use: "Scorecard, Punkte" },
  { golfIcon: GolfHole, name: "GolfHole", use: "Loch mit Pin" },
  { golfIcon: GolfFairway, name: "GolfFairway", use: "Course-Silhouette" },
  { golfIcon: GolfHandicap, name: "GolfHandicap", use: "Hcp (H + Down-Pfeil)" },
];

function IconSwatch({ entry }: { entry: IconEntry }) {
  const Icon = entry.icon;
  const GolfIcon = entry.golfIcon;
  return (
    <div className="flex flex-col gap-2 rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] p-3">
      <div className="flex h-14 items-center justify-center rounded-sm bg-[var(--color-sand)]">
        {Icon && (
          <Icon
            size={22}
            strokeWidth={1.75}
            className="text-[var(--color-ink)]"
            aria-hidden
          />
        )}
        {GolfIcon && (
          <GolfIcon
            size={22}
            strokeWidth={1.75}
            className="text-[var(--color-ink)]"
          />
        )}
      </div>
      <p className="font-mono text-[11px] leading-tight text-[var(--color-muted)]">
        {entry.name}
      </p>
      <p className="text-[11px] leading-snug text-[var(--color-ink)]/70">
        {entry.use}
      </p>
    </div>
  );
}

function IconGroup({
  label,
  entries,
}: {
  label: string;
  entries: IconEntry[];
}) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
        {label}
      </p>
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3">
        {entries.map((e) => (
          <IconSwatch key={e.name} entry={e} />
        ))}
      </div>
    </div>
  );
}

function IconSystemSection() {
  return (
    <section>
      <SectionHead
        number="08 · Icons"
        title="Icon-System"
        note="Zwei Familien. Lucide (lucide-react 1.8.0) für UI-Standards — 1500 Icons, stroke-basiert, tree-shakeable. Custom Golf-Icons aus eigener Feder — Lucide hat keine Golf-Marks, also zeichnen wir sie im selben Stil (24×24, stroke 1.75, currentColor). Alternative Libraries (Heroicons / Material / Phosphor) bewusst abgelehnt: zu SaaS / zu Google / zu expressive."
      />

      {/* 3-column grid of all icon groups. UI icons on columns 1-2, Golf standalone on 3. */}
      <div className="grid gap-8 lg:grid-cols-3">
        <IconGroup label="Kontakt · Lucide" entries={CONTACT_ICONS} />
        <IconGroup label="Navigation · Lucide" entries={NAV_ICONS} />
        <IconGroup label="Status · Lucide" entries={STATUS_ICONS} />
        <IconGroup label="Mitgliedschaft · Lucide" entries={MEMBER_ICONS} />
        <div className="lg:col-span-2">
          <IconGroup label="Golf · Custom SVG" entries={GOLF_ICONS} />
        </div>
      </div>

      {/* In Context — compact 2x2 */}
      <div className="mt-10 rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] p-6">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
          In Context · so werden sie eingesetzt
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-fairway)] px-5 py-2.5 text-sm font-medium text-[var(--color-parchment)] transition-colors hover:bg-[var(--color-fairway-hover)]"
          >
            Jetzt Mitglied werden
            <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
          </button>

          <ul className="space-y-1.5 text-sm text-[var(--color-ink)]/85">
            <li className="flex items-center gap-2">
              <Mail size={14} strokeWidth={1.75} className="text-[var(--color-fairway)]" aria-hidden />
              <span>info@oakwoodgolfclub.de</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} strokeWidth={1.75} className="text-[var(--color-fairway)]" aria-hidden />
              <span>+49 (160) 385 9135</span>
            </li>
          </ul>

          <ul className="space-y-1.5 text-sm text-[var(--color-ink)]/85">
            {[
              "Offizielle Mitgliederkarte",
              "Kein Auto-Renewal",
              "95 % Platz-Akzeptanz in Österreich",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <CheckCircle2
                  size={16}
                  strokeWidth={1.75}
                  className="mt-0.5 shrink-0 text-[var(--color-fairway)]"
                  aria-hidden
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-start gap-3 rounded-sm bg-[var(--color-sand)] p-3">
            <GolfFlag
              size={22}
              strokeWidth={1.75}
              className="mt-0.5 shrink-0 text-[var(--color-fairway)]"
            />
            <div className="text-sm">
              <p className="font-medium text-[var(--color-ink)]">Seit 2009</p>
              <p className="mt-0.5 text-xs text-[var(--color-ink)]/70">
                300+ Mitglieder, DACH-Region.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Social — compact 2x1 */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Social · hell · Custom SVG
          </p>
          <div className="flex gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-ink)]/15 text-[var(--color-ink)]/70">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M13.5 21v-8.25h2.78l.42-3.25H13.5V7.44c0-.94.26-1.58 1.61-1.58h1.72V2.94c-.3-.04-1.32-.13-2.5-.13-2.48 0-4.18 1.52-4.18 4.3v2.39H7.37v3.25h2.78V21h3.35Z" />
              </svg>
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-ink)]/15 text-[var(--color-ink)]/70">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </span>
          </div>
        </div>

        <div className="rounded-sm bg-[var(--color-ink)] p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
            Social · dunkel · Footer
          </p>
          <div className="flex gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-[var(--color-parchment)]/80">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M13.5 21v-8.25h2.78l.42-3.25H13.5V7.44c0-.94.26-1.58 1.61-1.58h1.72V2.94c-.3-.04-1.32-.13-2.5-.13-2.48 0-4.18 1.52-4.18 4.3v2.39H7.37v3.25h2.78V21h3.35Z" />
              </svg>
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-[var(--color-parchment)]/80">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
