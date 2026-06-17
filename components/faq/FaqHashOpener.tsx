"use client";
import { useEffect } from "react";

/** Opens + scrolls to the <details id={hash}> targeted by location.hash.
 *  Makes /faq#<slug> deep-links (incl. search results) reveal the answer. */
export function FaqHashOpener() {
  useEffect(() => {
    function openTarget() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (el instanceof HTMLDetailsElement) {
        el.open = true;
        el.scrollIntoView({ block: "start" });
      }
    }
    openTarget();
    window.addEventListener("hashchange", openTarget);
    return () => window.removeEventListener("hashchange", openTarget);
  }, []);
  return null;
}
