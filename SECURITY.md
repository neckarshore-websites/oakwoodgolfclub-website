# Security Policy

Oakwood Golf Club runs a **live production website** at
[oakwoodgolfclub.de](https://oakwoodgolfclub.de) that processes real member
data (names, addresses, emails, membership state). Security reports are taken
seriously and handled through a private channel — please do **not** open a
public GitHub issue for a security vulnerability (see
[Reporting a Vulnerability](#reporting-a-vulnerability) below).

## Supported Versions

Only the current production deploy receives security updates. There are no
maintained release branches — `main` is continuously deployed to Vercel, and
security fixes ship to production as soon as they are merged.

| Version                     | Supported |
| --------------------------- | --------- |
| Current production (`main`) | Yes       |
| Any older commit / fork     | No        |

## Data Handling

The website is a Next.js application deployed on Vercel. Understanding the
data-flow helps scope a security report:

**Member and form data.** The three public forms (new-member signup,
membership renewal, contact) submit to server-side handlers that compose an
email and deliver it over authenticated SMTP to the club inbox
(`info@oakwoodgolfclub.de`, hosted at IONOS). Submission payloads contain
personal data (names, addresses, emails). This data is **not** persisted in
the repository, in any committed file, or in application logs — server logs
deliberately record only non-PII metadata (subject lines, machine-readable
result codes), never names, addresses, emails, or message bodies.

**Secrets.** All credentials — SMTP mailbox password, Cloudflare Turnstile
keys, any API keys — live exclusively in Vercel environment variables. They
are never committed. `.env*`, database dumps, member exports, and WordPress
exports are `.gitignore`d and must never be overridden into a commit.

**Spam and abuse protection.** All three forms are gated by Cloudflare
Turnstile plus a server-side honeypot; submissions failing the challenge are
dropped before any email is composed.

**Fail-closed posture.** If SMTP is misconfigured in production, form handlers
refuse the submission rather than silently pretending success — a member is
never shown a false confirmation while their data is lost.

## Scope

**In scope** — anything that could expose member data, hijack a form
submission, or compromise the production deploy:

- Authentication / authorization flaws in server-side form handlers
- Injection (command, header, template) in the form or email pipeline
- Secret or PII leakage into logs, client bundles, or committed files
- Supply-chain issues (a malicious or vulnerable dependency reaching prod)
- Server-Side Request Forgery or arbitrary file read via the mail layer

**Out of scope:**

- Findings that require a compromised maintainer machine or a stolen Vercel
  session to exploit
- Denial-of-service through sheer request volume (handled at the Vercel /
  Cloudflare edge, not in application code)
- Missing security headers with no demonstrated exploit
- Reports generated solely by an automated scanner with no proof-of-concept

## Reporting a Vulnerability

**Report privately by email:**
[**info@oakwoodgolfclub.de**](mailto:info@oakwoodgolfclub.de)

Use the subject line prefix `SECURITY:` so the report is triaged ahead of
routine club correspondence. Please include:

1. **What you found** — a clear description of the vulnerability
2. **How to reproduce** — the steps or proof-of-concept needed to trigger it
3. **Impact** — what an attacker could achieve (which data, which action)

**Please do not** open a public GitHub issue, post to social media, or
otherwise disclose the issue publicly until it has been fixed — the site is
live and handles member data, so coordinated disclosure protects real people.

**Response time:** Best-effort. This is a solo-maintained website for a small
membership club, not a commercial service with a formal SLA. You can expect an
acknowledgement within a few days, and we will keep you informed as a fix is
developed and deployed.

**Coordinated disclosure:** Once a fix is live in production, we are happy to
credit the reporter (if desired) and to agree on a public disclosure date.
