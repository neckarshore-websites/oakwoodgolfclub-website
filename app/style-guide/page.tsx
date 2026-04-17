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
  Flag,
  IdCard,
  Info,
  Landmark,
  Mail,
  MapPin,
  Menu,
  Phone,
  TrendingUp,
  Trophy,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
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
              Wir antworten meist innerhalb von 48 Stunden.
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

      {/* 6. Icon-System — Lucide + Custom Social */}
      <IconSystemSection />

      <hr className="my-16 border-[var(--color-border)]" />

      {/* 7. Spacing */}
      <section>
        <SectionHead
          number="07 · Spacing & Layout"
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

      {/* 8. Assets / Favicons — Vorher / Nachher */}
      <section>
        <SectionHead
          number="08 · Assets"
          title="Favicons — Vorher / Nachher"
          note="Legacy-Icons stammen aus 2017 (WordPress-Avada-Theme-Uploads), gemischte Qualität. Entwürfe auf der rechten Seite nutzen unser neues Fairway-Grün (#1b6640) und kommen ohne Web-2.0-Glossy-Effekte aus. Finaler Favicon noch nicht abgenommen — Entwurfsstand."
        />

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

        {/* Nachher */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
            Nachher · Entwurf (Arbeitsstand, noch nicht abgenommen)
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
            <strong className="text-[var(--color-ink)]">Nächster Schritt:</strong>{" "}
            Entscheidung über Variante A / B / C (oder neu zeichnen). Ist
            der 10-Zacken-Stern das richtige Motiv? Alternative:
            stilisiertes Golf-Pin, Monogram &ldquo;O&rdquo;, oder
            Baum-Silhouette (Oak → Oakwood). Die Entwürfe hier sind
            Arbeitsstand — keine Entscheidung getroffen.
          </p>
        </div>
      </section>

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
 * Icon System section (06) — extracted for readability.
 *
 * Framework: Lucide (lucide-react). Stroke-based, 1.5px default, matches
 * our existing custom Facebook/Instagram SVGs (1.8px stroke). Tree-shakeable
 * per-icon bundle — only the icons we actually import reach the wire.
 *
 * Golf-accent icons (Flag, TrendingUp, Landmark, Trophy) are curated from
 * the same library — no separate icon set, no Web-2.0 golf-ball clipart.
 * ---------------------------------------------------------------------*/

type IconEntry = {
  icon: LucideIcon;
  name: string;
  use: string;
};

const CONTACT_ICONS: IconEntry[] = [
  { icon: Mail, name: "Mail", use: "E-Mail-Adressen, Kontaktformular-CTA" },
  { icon: Phone, name: "Phone", use: "Telefon-Link, tel:-URLs" },
  { icon: MapPin, name: "MapPin", use: "Standort, Postanschrift" },
];

const NAV_ICONS: IconEntry[] = [
  { icon: ArrowRight, name: "ArrowRight", use: "CTA-Buttons, Weiterleitung" },
  { icon: ChevronRight, name: "ChevronRight", use: "Breadcrumb, Link-Affordance" },
  { icon: ChevronDown, name: "ChevronDown", use: "Select-Caret, FAQ-Accordion" },
  { icon: Menu, name: "Menu", use: "Mobile-Nav-Toggle" },
  { icon: X, name: "X", use: "Close, Dismiss" },
];

const STATUS_ICONS: IconEntry[] = [
  { icon: CheckCircle2, name: "CheckCircle2", use: "Form-Success, Feature-Haken" },
  { icon: AlertCircle, name: "AlertCircle", use: "Form-Error, Warnhinweis" },
  { icon: Info, name: "Info", use: "Info-Box, Tooltip" },
  { icon: Check, name: "Check", use: "Consent-Done, Inline-OK" },
];

const MEMBER_ICONS: IconEntry[] = [
  { icon: CircleUserRound, name: "CircleUserRound", use: "Einzel-Mitglied" },
  { icon: Users, name: "Users", use: "Flight, Gruppe, 4er-Tarif" },
  { icon: IdCard, name: "IdCard", use: "Mitgliederkarte" },
  { icon: CreditCard, name: "CreditCard", use: "Banküberweisung, Zahlung" },
  { icon: Calendar, name: "Calendar", use: "Startmonat, 12-Monats-Laufzeit" },
];

const GOLF_ICONS: IconEntry[] = [
  { icon: Flag, name: "Flag", use: "Pin-Flag — Golf-Marker, Club-Signal. Primär-Akzent." },
  { icon: TrendingUp, name: "TrendingUp", use: "Handicap-Verlauf, Hcp-Feld" },
  { icon: Landmark, name: "Landmark", use: "Club-Institution, Über-uns" },
  { icon: Trophy, name: "Trophy", use: "Referral-Bonus, Achievement (sparsam)" },
];

function IconSwatch({ entry }: { entry: IconEntry }) {
  const Icon = entry.icon;
  return (
    <div className="flex flex-col gap-2 rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] p-4">
      <div className="flex h-16 items-center justify-center rounded-sm bg-[var(--color-sand)]">
        <Icon
          size={24}
          strokeWidth={1.75}
          className="text-[var(--color-ink)]"
          aria-hidden
        />
      </div>
      <p className="font-mono text-xs text-[var(--color-muted)]">{entry.name}</p>
      <p className="text-xs text-[var(--color-ink)]/75">{entry.use}</p>
    </div>
  );
}

function IconGroup({
  label,
  hint,
  entries,
}: {
  label: string;
  hint?: string;
  entries: IconEntry[];
}) {
  return (
    <div className="mb-10">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
          {label}
        </p>
        {hint && (
          <p className="mt-1 text-xs text-[var(--color-muted)]">{hint}</p>
        )}
      </div>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
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
        number="06 · Icons"
        title="Icon-System"
        note="Framework: Lucide (ISC-lizenziert, ~1500 Icons, stroke-basiert). Warum nicht Heroicons / Material / Phosphor? Heroicons ist zu SaaS-Silicon-Valley, Material zu Google-DNA, Phosphor zu vielschichtig. Lucide ist zurückgenommen, matcht unsere bestehenden Social-Icons (1.8px stroke) und ist Next/Tailwind-de-facto-Standard. Size 24, strokeWidth 1.75 als Default, currentColor als Füllung."
      />

      <IconGroup
        label="Kontakt"
        hint="E-Mail-Block, Footer, Kontakt-Seite."
        entries={CONTACT_ICONS}
      />
      <IconGroup
        label="Navigation"
        hint="CTAs, Breadcrumbs, Mobile-Nav, Dismiss."
        entries={NAV_ICONS}
      />
      <IconGroup
        label="Status"
        hint="Form-Banner, Info-Boxen, Feedback."
        entries={STATUS_ICONS}
      />
      <IconGroup
        label="Mitgliedschaft"
        hint="Signup, Tarife, Zahlung, Karte."
        entries={MEMBER_ICONS}
      />
      <IconGroup
        label="Golf-Akzente · sparsam"
        hint="Thematische Signale für Golf-Kontext. NICHT flächendeckend einsetzen — sonst wird's Country-Club-Kitsch. Flag ist der Primär-Marker."
        entries={GOLF_ICONS}
      />

      {/* Live usage demos */}
      <div className="mt-12 rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] p-6">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
          In Context · wie sie in echt eingesetzt werden
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* CTA button with icon */}
          <div>
            <p className="mb-3 text-xs text-[var(--color-muted)]">
              Button · primary mit Arrow
            </p>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-fairway)] px-6 py-3 text-base font-medium text-[var(--color-parchment)] transition-colors hover:bg-[var(--color-fairway-hover)]"
            >
              Jetzt Mitglied werden
              <ArrowRight size={18} strokeWidth={1.75} aria-hidden />
            </button>
          </div>

          {/* Inline contact row */}
          <div>
            <p className="mb-3 text-xs text-[var(--color-muted)]">
              Inline · Kontaktzeile
            </p>
            <ul className="space-y-2 text-sm text-[var(--color-ink)]/85">
              <li className="flex items-center gap-3">
                <Mail
                  size={16}
                  strokeWidth={1.75}
                  className="text-[var(--color-fairway)]"
                  aria-hidden
                />
                <span>info@oakwoodgolfclub.de</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone
                  size={16}
                  strokeWidth={1.75}
                  className="text-[var(--color-fairway)]"
                  aria-hidden
                />
                <span>+49 (160) 385 9135</span>
              </li>
            </ul>
          </div>

          {/* Feature list with checks */}
          <div>
            <p className="mb-3 text-xs text-[var(--color-muted)]">
              Feature-Liste · CheckCircle2
            </p>
            <ul className="space-y-2 text-sm text-[var(--color-ink)]/85">
              {[
                "Offizielle Mitgliederkarte",
                "Kein Auto-Renewal",
                "95 % Platz-Akzeptanz in Österreich",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    strokeWidth={1.75}
                    className="mt-0.5 shrink-0 text-[var(--color-fairway)]"
                    aria-hidden
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Golf-accent: Flag as primary marker */}
          <div>
            <p className="mb-3 text-xs text-[var(--color-muted)]">
              Golf-Akzent · Flag als Primär-Marker
            </p>
            <div className="flex items-start gap-3 rounded-sm bg-[var(--color-sand)] p-4">
              <Flag
                size={22}
                strokeWidth={1.75}
                className="mt-0.5 shrink-0 text-[var(--color-fairway)]"
                aria-hidden
              />
              <div className="text-sm">
                <p className="font-medium text-[var(--color-ink)]">
                  Seit 2009
                </p>
                <p className="mt-1 text-[var(--color-ink)]/70">
                  Fernmitgliedschaft im Golfclub — 300+ Golferinnen und
                  Golfer in der DACH-Region.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom SVG — Social */}
      <div className="mt-10">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
          Custom Inline SVG · Social
        </p>
        <p className="mb-6 max-w-3xl text-xs text-[var(--color-muted)]">
          Facebook und Instagram liefert Lucide zwar, aber wir halten die
          Brand-Logos bewusst als inline SVG — die Icons sind
          markenrechtlich sensibler und sollen 1:1 deren Style folgen
          (Facebook: solid fill; Instagram: stroke-based camera, 1.8px).
          Gleiche 9×9-Button-Box, gleiche Hover-States wie im Footer.
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Auf hellem Grund
            </p>
            <div className="flex gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-ink)]/15 text-[var(--color-ink)]/70 transition-colors hover:border-[var(--color-fairway)] hover:text-[var(--color-fairway)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M13.5 21v-8.25h2.78l.42-3.25H13.5V7.44c0-.94.26-1.58 1.61-1.58h1.72V2.94c-.3-.04-1.32-.13-2.5-.13-2.48 0-4.18 1.52-4.18 4.3v2.39H7.37v3.25h2.78V21h3.35Z" />
                </svg>
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-ink)]/15 text-[var(--color-ink)]/70 transition-colors hover:border-[var(--color-fairway)] hover:text-[var(--color-fairway)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </span>
            </div>
          </div>

          <div className="rounded-sm bg-[var(--color-ink)] p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
              Auf dunklem Grund (Footer)
            </p>
            <div className="flex gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[var(--color-parchment)]/80 transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M13.5 21v-8.25h2.78l.42-3.25H13.5V7.44c0-.94.26-1.58 1.61-1.58h1.72V2.94c-.3-.04-1.32-.13-2.5-.13-2.48 0-4.18 1.52-4.18 4.3v2.39H7.37v3.25h2.78V21h3.35Z" />
                </svg>
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[var(--color-parchment)]/80 transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
