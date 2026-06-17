"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { SearchOverlay } from "./SearchOverlay";

type Ctx = { open: boolean; setOpen: (v: boolean) => void };
const SearchCtx = createContext<Ctx | null>(null);

export function useSearch(): Ctx {
  const ctx = useContext(SearchCtx);
  if (!ctx) throw new Error("useSearch must be used within <SearchProvider>");
  return ctx;
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return (
    <SearchCtx.Provider value={{ open, setOpen }}>
      {children}
      <SearchOverlay />
    </SearchCtx.Provider>
  );
}
