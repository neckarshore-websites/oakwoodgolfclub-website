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
 * Graceful degradation:
 *   - Wenn `NEXT_PUBLIC_FRIENDLY_CAPTCHA_SITEKEY` nicht gesetzt ist,
 *     rendert die Komponente null. Die Form bleibt submit-fähig — nur
 *     ohne Captcha. Spiegelbild in verify.ts: ohne API-Key wird die
 *     Server-Verifikation übersprungen. Beide Vars müssen gemeinsam
 *     gesetzt werden (Vercel Production), sonst ist Spam-Schutz aus.
 *
 * Theme: `auto` — respektiert System-Präferenz (Light/Dark). Language:
 * `de` — die Form-Seiten sind durchgängig deutsch. Endpoint: `eu` —
 * passend zum EU-Sitz der Friendly Captcha GmbH.
 */
export function FriendlyCaptcha() {
  const sitekey = process.env.NEXT_PUBLIC_FRIENDLY_CAPTCHA_SITEKEY;
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sitekey || !mountRef.current) return;

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
  }, [sitekey]);

  // Nichts rendern wenn kein Sitekey konfiguriert ist — Form bleibt
  // funktional, Server-Seite überspringt dann auch die Verifikation.
  if (!sitekey) return null;

  return (
    <div
      ref={mountRef}
      className="frc-captcha"
      aria-label="Spam-Schutz (Proof-of-Work)"
    />
  );
}
