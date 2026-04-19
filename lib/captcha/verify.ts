/**
 * Friendly Captcha — Server-side verification.
 *
 * User-Entscheidung 2026-04-20: Friendly Captcha v2 (Wörthsee, Deutschland)
 * als Anti-Spam-Layer auf allen drei Forms. DSGVO-konform, DE-Brand-Fit,
 * Proof-of-Work (kein Klick-Captcha), Free-Tier für OGC-Traffic mehr als
 * ausreichend.
 *
 * Flow:
 *   1. Client-Widget (components/forms/FriendlyCaptcha.tsx) lädt den SDK,
 *      lässt den Browser einen Proof-of-Work berechnen und injiziert das
 *      Ergebnis als hidden input `frc-captcha-response` in die Form.
 *   2. Die Server Action extrahiert das Feld und ruft
 *      `verifyFriendlyCaptchaSolution(solution)` auf.
 *   3. Friendly Captcha prüft die Lösung serverseitig (API-Key bleibt
 *      secret) und antwortet mit `success: true/false`.
 *   4. `success=false` → Form-Response validation-error, kein Versand.
 *
 * Graceful degradation:
 *   - Wenn `FRIENDLY_CAPTCHA_API_KEY` NICHT gesetzt ist (lokale Dev-
 *     Umgebung, noch-nicht-konfigurierte Preview), wird die Verifikation
 *     übersprungen (`ok: true`). Das hält den Funnel lauffähig während
 *     der Account-Einrichtung + DPA-Signatur. In Production MUSS der Key
 *     gesetzt sein (siehe Datenschutz §6 — keine Captcha = kein AV-Eintrag
 *     nötig, aber dann auch kein Spam-Schutz).
 *   - Wenn `NEXT_PUBLIC_FRIENDLY_CAPTCHA_SITEKEY` NICHT gesetzt ist, rendert
 *     das Widget clientseitig nichts und die Form hat kein Solution-Feld.
 *     Der Server-Check sieht dann einen leeren String und — bei gesetztem
 *     API-Key — schlägt fehl. Beide Vars müssen gemeinsam gesetzt werden.
 *
 * Endpoint: wir nutzen den EU-Endpunkt (`eu-api.frcapi.com`) passend zur
 * DACH-Positionierung und zum EU-Sitz der Friendly Captcha GmbH.
 *
 * Docs: https://developer.friendlycaptcha.com/docs/v2/verification-api
 */

const FRIENDLY_CAPTCHA_VERIFY_URL =
  "https://eu-api.frcapi.com/api/v2/captcha/siteverify";

export type CaptchaVerifyResult =
  | { ok: true; skipped?: boolean }
  | { ok: false; reason: "missing-solution" | "verification-failed" | "network-error"; detail?: string };

export async function verifyFriendlyCaptchaSolution(
  solution: string | undefined | null,
): Promise<CaptchaVerifyResult> {
  // Feature-Flag (User-Entscheidung 2026-04-19): Launch OHNE Captcha.
  // Spam-Schutz kommt aus Rate-Limit (siehe lib/ratelimit.ts). Captcha-
  // Code bleibt dormant für Phase 2 — sobald `CAPTCHA_ENABLED=true` gesetzt
  // ist (server-seitig) + `NEXT_PUBLIC_CAPTCHA_ENABLED=true` (client-
  // seitig) gemeinsam gesetzt werden, greift der normale fail-closed-Flow.
  //
  // `=== "true"` als strikter Check: unset, leer, "false", oder irgendein
  // anderer Wert → Flag ist aus. Sicherer Default: aus.
  const captchaEnabled = process.env.CAPTCHA_ENABLED === "true";
  if (!captchaEnabled) {
    return { ok: true, skipped: true };
  }

  const apiKey = process.env.FRIENDLY_CAPTCHA_API_KEY;
  const sitekey = process.env.NEXT_PUBLIC_FRIENDLY_CAPTCHA_SITEKEY;

  // Flag aktiv, aber Keys fehlen → in Production fail-closed, sonst
  // graceful (Dev/Preview-Komfort, kein Launch-Blocker).
  if (!apiKey || !sitekey) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[captcha] CAPTCHA_ENABLED=true but API key or sitekey missing in production — rejecting submit.",
      );
      return {
        ok: false,
        reason: "verification-failed",
        detail: "captcha-not-configured",
      };
    }
    console.warn(
      "[captcha] CAPTCHA_ENABLED=true but keys missing — dev/preview fallback (submit accepted).",
    );
    return { ok: true, skipped: true };
  }

  if (!solution || solution.trim().length === 0) {
    return { ok: false, reason: "missing-solution" };
  }

  try {
    const res = await fetch(FRIENDLY_CAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        response: solution,
        sitekey,
      }),
      // Cap the network wait — the verify API is normally sub-100ms; we
      // don't want a hanging upstream to block the form submit indefinitely.
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      console.warn(
        `[captcha] siteverify non-2xx status=${res.status}`,
      );
      return { ok: false, reason: "network-error", detail: `HTTP ${res.status}` };
    }

    const json = (await res.json()) as {
      success?: boolean;
      errors?: string[];
      data?: unknown;
    };

    if (json.success === true) {
      return { ok: true };
    }

    return {
      ok: false,
      reason: "verification-failed",
      detail: Array.isArray(json.errors) ? json.errors.join(", ") : undefined,
    };
  } catch (err) {
    console.warn("[captcha] siteverify network error", err);
    return {
      ok: false,
      reason: "network-error",
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * The form field name that the Friendly Captcha client widget injects into
 * the surrounding `<form>` with the proof-of-work solution. This is the
 * SDK default — keep in sync with `formFieldName` option in the widget.
 */
export const CAPTCHA_FORM_FIELD = "frc-captcha-response";
