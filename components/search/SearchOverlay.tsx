"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type MiniSearch from "minisearch";
import { useSearch } from "./SearchProvider";
import type { SearchDoc } from "@/lib/search/types";

type Hit = SearchDoc;

/**
 * Mount point read from context. Builds the MiniSearch index lazily on first
 * open and keeps it across opens; renders the palette only while open so the
 * palette's query state resets via remount (no reset effect needed).
 */
export function SearchOverlay() {
  const { open, setOpen } = useSearch();
  const [mini, setMini] = useState<MiniSearch<SearchDoc> | null>(null);

  // Lazy-build index on first open (async data load → setState in callback OK).
  useEffect(() => {
    if (!open || mini) return;
    let cancelled = false;
    (async () => {
      const [{ default: MiniSearch }, res] = await Promise.all([
        import("minisearch"),
        fetch("/api/search-index"),
      ]);
      const docs: SearchDoc[] = await res.json();
      if (cancelled) return;
      const m = new MiniSearch<SearchDoc>({
        fields: ["title", "text"],
        storeFields: ["title", "type", "category", "url"],
        searchOptions: { prefix: true, fuzzy: 0.2, boost: { title: 2 } },
      });
      m.addAll(docs);
      setMini(m);
    })();
    return () => { cancelled = true; };
  }, [open, mini]);

  if (!open) return null;
  return <SearchPalette mini={mini} onClose={() => setOpen(false)} />;
}

/** The visible command palette. Mounted only while open → fresh state per open. */
function SearchPalette({
  mini,
  onClose,
}: {
  mini: MiniSearch<SearchDoc> | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => { inputRef.current?.focus(); }, []);

  // Derived during render from state/props — no ref read, no setState-in-effect.
  const results = useMemo<Hit[]>(
    () => (q && mini ? (mini.search(q) as unknown as Hit[]).slice(0, 20) : []),
    [q, mini]
  );

  function go(hit: Hit) { onClose(); router.push(hit.url); }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && results[active]) { e.preventDefault(); go(results[active]); }
  }

  return (
    <div role="dialog" aria-modal="true" aria-label="Suche"
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 p-4 pt-[12vh]"
      onClick={onClose}>
      <div className="w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()} onKeyDown={onKeyDown}>
        <input ref={inputRef} type="search" role="combobox" aria-expanded="true"
          aria-controls="search-results" aria-label="Blog und FAQ durchsuchen"
          value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }}
          placeholder="Blog & FAQ durchsuchen …"
          className="w-full border-b border-[var(--color-border)] px-5 py-4 text-base outline-none" />
        <ul id="search-results" role="listbox" className="max-h-[55vh] overflow-y-auto">
          {!q && <li className="px-5 py-6 text-sm text-[var(--color-muted)]">Tippe, um Blog &amp; FAQ zu durchsuchen.</li>}
          {q && results.length === 0 && mini && (
            <li className="px-5 py-6 text-sm text-[var(--color-muted)]">Nichts gefunden. Schreib uns gern direkt über die Kontaktseite.</li>
          )}
          {results.map((hit, i) => (
            <li key={hit.id} role="option" aria-selected={i === active}>
              <button type="button" onMouseEnter={() => setActive(i)} onClick={() => go(hit)}
                className={`flex w-full flex-col items-start gap-0.5 px-5 py-3 text-left ${i === active ? "bg-[var(--color-fairway)]/10" : ""}`}>
                <span className="flex items-center gap-2">
                  <span className="rounded-sm bg-[var(--color-ink)]/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                    {hit.type === "blog" ? "Blog" : "FAQ"}
                  </span>
                  <span className="font-medium text-[var(--color-ink)]">{hit.title}</span>
                </span>
                <span className="text-xs text-[var(--color-muted)]">{hit.category}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
