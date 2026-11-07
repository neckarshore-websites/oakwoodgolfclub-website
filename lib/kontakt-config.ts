/**
 * Mail and captcha settings that are NOT secret, kept in code, not in Vercel.
 *
 * Ticket: neckarshore-ai/neckarshore-planning#2879 (Founder decision 2026-10-02),
 * same pattern as goldoni-website#233 and rauhut-website#100.
 *
 * WHY THEY LIVE HERE: several of these values sat in Vercel as type "sensitive",
 * which nobody can read back. A value you cannot read, you cannot check. Here it
 * is readable, versioned and guarded by tests/contact/kontakt-config.test.ts.
 *
 * WHAT MUST NEVER LIVE HERE: passwords, secret keys, tokens. Those stay in Vercel
 * and are read where they are used. The test goes red when such a variable or
 * field name appears in this file, which is why this comment spells none of them.
 *
 * NO FALLBACK TO THE OLD VARIABLE NAMES, on purpose: production reads these values
 * only from here, so the old Vercel variables are inert from this deploy on.
 *
 * ENVIRONMENTS: what has an effect only where a secret exists is gated on that
 * secret, not on a second switch. The secrets are set for Production only, so
 * previews and `npm run dev` send no mail and show no captcha widget.
 */

export interface KontaktEinstellungen {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  absender: string;
  empfaenger: string;
}

/**
 * Sources:
 * - All five values: the Vercel production variables, read on 2026-11-05 (report
 *   2026-11-05-linus-websites, row L-1102-2879-OAKWOOD). Production and development
 *   held the same values. The Vercel listing of 2026-11-05 evening shows no edit of
 *   any of them since 2026-04-18 (updatedAt), and .env.example carries the same.
 * - smtp.ionos.de:587 is the IONOS submission port with STARTTLS, as for Goldoni.
 *
 * Every form mail goes to the club's own info@ mailbox, and the autoresponse to a
 * member is sent from it. The sender is the bare address, as it was in Vercel.
 */
export const KONTAKT: KontaktEinstellungen = {
  smtpHost: "smtp.ionos.de",
  smtpPort: 587,
  smtpUser: "info@oakwoodgolfclub.de",
  absender: "info@oakwoodgolfclub.de",
  empfaenger: "info@oakwoodgolfclub.de",
};

/**
 * Public Turnstile site key, read from the shipped JS bundle of
 * oakwoodgolfclub.de/kontakt on 2026-11-05. Public by design: every browser
 * receives it.
 */
export const TURNSTILE_SITEKEY = "0x4AAAAAADjdJKW5lPVgXcv_";

/**
 * Captcha on all three forms (contact, signup, renewal). The client switch was on
 * in Production: the bundle of 2026-11-05 carries the widget with its on-check
 * compiled away. Where it takes effect is gated on the secret, see
 * `captchaSitekey` in lib/captcha/verify.ts.
 */
export const CAPTCHA_AKTIV = true;
