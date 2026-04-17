import nodemailer, { type Transporter } from "nodemailer";

/**
 * Lazy-initialised SMTP transporter — reads env vars on first use.
 *
 * Required env vars (set in Vercel project settings, NEVER committed):
 *   SMTP_HOST         e.g. smtp.ionos.de
 *   SMTP_PORT         587 (STARTTLS) or 465 (SSL)
 *   SMTP_USER         info@oakwoodgolfclub.de
 *   SMTP_PASSWORD     the IONOS mailbox password
 *   SMTP_FROM         info@oakwoodgolfclub.de (can equal SMTP_USER)
 *   SMTP_TO           info@oakwoodgolfclub.de (the inbox receiving form submissions)
 *
 * If any of the required vars are missing, `getTransporter()` returns null
 * and the caller falls back to dev-mode logging. This keeps local dev runnable
 * without secrets and keeps Vercel preview deploys safe by default.
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
  const host = process.env.SMTP_HOST;
  const portStr = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM;
  const to = process.env.SMTP_TO;

  if (!host || !portStr || !user || !password || !from || !to) return null;
  const port = Number(portStr);
  if (!Number.isFinite(port)) return null;

  return { host, port, user, password, from, to };
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

  cachedTransporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465, // implicit TLS on 465, STARTTLS otherwise
    auth: { user: config.user, pass: config.password },
  });

  return cachedTransporter;
}
