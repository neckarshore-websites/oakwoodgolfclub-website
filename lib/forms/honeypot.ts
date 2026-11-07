/**
 * The hidden trap field of the three forms (contact, signup, renewal).
 *
 * Until 2026-11-07 it was called `website`. That name invites a browser or a
 * password manager to fill it, and a filled trap ends in the thank-you panel
 * without a mail: a member's signup or renewal would be lost, and the member
 * would believe it had arrived. The new name carries no word autofill looks for,
 * and every drop leaves one fixed log line, so a lost message can be found.
 *
 * Same fix as grafowerk-website#24 and goldoni-website#236.
 */
export const HONEYPOT_FELD = "nicht_ausfuellen" as const;

export type HoneypotFormular = "kontakt" | "mitglied-werden" | "mitgliedschaft-verlaengern";

/**
 * True when the trap is filled. Logs one fixed line naming only the form,
 * never anything the visitor typed. Whitespace counts as empty.
 */
export function honeypotAusgeloest(
  wert: string | undefined,
  formular: HoneypotFormular,
): boolean {
  if (!wert || wert.trim().length === 0) return false;
  console.warn(`[forms] honeypot drop: ${formular}`);
  return true;
}
