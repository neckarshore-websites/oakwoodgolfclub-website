"use client";

import { useEffect, useRef } from "react";

/**
 * Friendly Captcha — Client-Widget (Proof-of-Work).
 *
 * Mount-Komponente für das Friendly-Captcha-v2-Widget. Lädt den SDK
 * dynamisch im Browser (kein SSR, zero bytes auf dem ersten Paint),
 * erzeugt eine Widget-Instanz und hängt ein hidden input
 * `frc-captcha-response` an das umschließende <form>-Element.
 *
 * Das Widget ist schlank (~15kB gzip) und vollständig DSGVO-konform
 * (Proof-of-Work, keine IP-Fingerprints, EU-Server, DE-Firma).
 * Siehe lib/captcha/verify.ts für die Server-Verifikation.
 *
 * Feature-Flag (User-Entscheidung 2026-04-19): Launch OHNE Captcha.
 *   - `NEXT_PUBLIC_CAPTCHA_ENABLED !== "true"` → Widget rendert null,
 *     kein SDK-Import, kein Bundle-Impact für Besucher.
 *   - Spam-Schutz beim Launch kommt aus dem In-Memory-Rate-Limit
 *     (lib/ratelimit.ts) in den Server Actions.
 *   - Sobald Phase 2 den Captcha re-aktivieren will, setzt man BEIDE
 *     Envs auf "true" (client + server — siehe verify.ts).
 *
 * Graceful degradation (wenn Flag aktiv, aber Sitekey fehlt): nichts
 * rendern, Form bleibt submit-fähig. Spiegelbild in verify.ts.
 *
 * Theme: `auto` — respektiert System-Präferenz (Light/Dark). Language:
 * `de` — die Form-Seiten sind durchgängig deutsch. Endpoint: `eu` —
 * passend zum EU-Sitz der Friendly Captcha GmbH.
 */
export function FriendlyCaptcha() {
  const captchaEnabled = process.env.NEXT_PUBLIC_CAPTCHA_ENABLED === "true";
  const sitekey = process.env.NEXT_PUBLIC_FRIENDLY_CAPTCHA_SITEKEY;
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!captchaEnabled || !sitekey || !mountRef.current) return;

    let widget: { destroy?: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const { FriendlyCaptchaSDK } = await import("@friendlycaptcha/sdk");
      if (cancelled || !mountRef.current) return;

      const sdk = new FriendlyCaptchaSDK();
      widget = sdk.createWidget({
        element: mountRef.current,
        sitekey,
        apiEndpoint: "eu",
        language: "de",
        startMode: "focus",
        theme: "auto",
      });
    })();

    return () => {
      cancelled = true;
      widget?.destroy?.();
    };
  }, [captchaEnabled, sitekey]);

  // Feature-Flag aus ODER kein Sitekey → Widget komplett unsichtbar.
  // Form bleibt funktional; Server-Seite respektiert das gleiche Flag
  // und skipped die Verifikation (siehe lib/captcha/verify.ts).
  if (!captchaEnabled || !sitekey) return null;

  return (
    <div
      ref={mountRef}
      className="frc-captcha"
      aria-label="Spam-Schutz (Proof-of-Work)"
    />
  );
}
