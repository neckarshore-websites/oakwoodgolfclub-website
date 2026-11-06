import nodemailer, { type Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { KONTAKT } from "@/lib/kontakt-config";

/**
 * Lazy-initialised SMTP transporter.
 *
 * Host, port, user, sender and recipient are configuration and live in
 * lib/kontakt-config.ts (planning #2879). The only value read from the
 * environment is the mailbox password, SMTP_PASSWORD, set in Vercel for
 * Production only and NEVER committed.
 *
 * Without the password `getTransporter()` returns null and the caller falls
 * back to dev-mode logging (or refuses in production, see lib/email/send.ts).
 * That keeps local dev and Vercel previews from sending mail.
 */

type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
  to: string;
};

function readConfig(): SmtpConfig | null {
  const password = process.env.SMTP_PASSWORD;
  if (!password) return null;

  return {
    host: KONTAKT.smtpHost,
    port: KONTAKT.smtpPort,
    user: KONTAKT.smtpUser,
    password,
    from: KONTAKT.absender,
    to: KONTAKT.empfaenger,
  };
}

let cachedTransporter: Transporter | null = null;
let cachedConfig: SmtpConfig | null = null;

export function getSmtpConfig(): SmtpConfig | null {
  if (cachedConfig) return cachedConfig;
  cachedConfig = readConfig();
  return cachedConfig;
}

export function getTransporter(): Transporter | null {
  if (cachedTransporter) return cachedTransporter;

  const config = getSmtpConfig();
  if (!config) return null;

  // Pin to the SMTPTransport.Options overload of createTransport; the generic
  // last overload otherwise picks `TransportOptions`, which lacks host/port/secure.
  const transportOptions: SMTPTransport.Options = {
    host: config.host,
    port: config.port,
    // Port 465 is implicit TLS; 587 starts plain and upgrades via STARTTLS.
    secure: config.port === 465,
    // Without requireTLS a stripped STARTTLS would send the mailbox password in
    // the clear. smtp.ionos.de:587 offers STARTTLS (#2879).
    requireTLS: true,
    auth: { user: config.user, pass: config.password },
  };
  cachedTransporter = nodemailer.createTransport(transportOptions);

  return cachedTransporter;
}
