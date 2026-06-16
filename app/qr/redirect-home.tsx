"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Client-only redirect: after `delayMs` (default 5s) forward the visitor to the
 * homepage. Used by the QR splash (/qr.html) so a scanned membership-card code
 * lands on a branded "coming soon" screen for a beat, then continues to the
 * site.
 *
 * `router.replace` (not push) so the splash leaves no history entry — pressing
 * "back" from the homepage must not loop the visitor back onto this screen.
 */
export function RedirectHome({ delayMs = 5000 }: { delayMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = window.setTimeout(() => router.replace("/"), delayMs);
    return () => window.clearTimeout(id);
  }, [router, delayMs]);

  return null;
}
