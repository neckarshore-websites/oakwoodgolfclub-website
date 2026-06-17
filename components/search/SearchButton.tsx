"use client";
import { useSearch } from "./SearchProvider";

export function SearchButton({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const { setOpen } = useSearch();
  return (
    <button type="button" onClick={() => setOpen(true)} aria-label="Suche öffnen"
      className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-3 py-2 text-sm text-white outline-offset-4 hover:border-white/40 focus-visible:outline-2 focus-visible:outline-[var(--color-fairway-hover)]">
      <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
      </svg>
      {variant === "desktop" && <span className="text-white/60">⌘K</span>}
    </button>
  );
}
