#!/usr/bin/env bash
# verify-b14-cutover.sh — Post-Cutover Verification
#
# Runs all non-interactive checks from docs/runbooks/b14-dns-cutover.md §5
# in one pass. Use during and after the DNS-Cutover to confirm:
#   - DNS-Propagation (local + Google-DNS + Cloudflare-DNS)
#   - HTTPS reachability + HTTP status on apex and www
#   - TLS certificate issuer, subject, and validity window
#   - www→apex redirect behaviour
#   - B10 legacy-URL redirect (`/lieblingsclub-in-thailand/` → `/blog/...`)
#
# Does NOT:
#   - Run the Playwright E2E suite (do that separately via
#     `E2E_BASE_URL=https://oakwoodgolfclub.de npm run test:e2e:nightly`)
#   - Send mails or trigger IONOS rate-limits
#   - Modify any DNS record, deploy, or config
#
# Exit codes:
#   0  — all checks passed
#   1  — at least one HARD check failed (HTTP/DNS/cert broken)
#   2  — SOFT warning only (e.g. legacy redirect returned unexpected but
#        non-fatal status — inspect output)
#
# Usage:
#   cd ~/Developer/projects/oakwoodgolfclub-de/oakwoodgolfclub-website
#   bash scripts/verify-b14-cutover.sh
#
# Optional env vars:
#   DOMAIN            default: oakwoodgolfclub.de
#   EXPECTED_APEX_IP  if set, script asserts dig output matches; else
#                     just prints observed value for human eyeball.

set -u
set -o pipefail

DOMAIN="${DOMAIN:-oakwoodgolfclub.de}"
EXPECTED_APEX_IP="${EXPECTED_APEX_IP:-}"

# Colours — disabled when stdout is not a TTY
if [ -t 1 ]; then
  RED=$'\033[0;31m'
  GREEN=$'\033[0;32m'
  YELLOW=$'\033[0;33m'
  BLUE=$'\033[0;34m'
  BOLD=$'\033[1m'
  RESET=$'\033[0m'
else
  RED="" GREEN="" YELLOW="" BLUE="" BOLD="" RESET=""
fi

HARD_FAILS=0
SOFT_WARNS=0

section() {
  printf '\n%s%s== %s ==%s\n' "$BOLD" "$BLUE" "$1" "$RESET"
}

pass() {
  printf '  %s✓%s %s\n' "$GREEN" "$RESET" "$1"
}

warn() {
  printf '  %s⚠%s %s\n' "$YELLOW" "$RESET" "$1"
  SOFT_WARNS=$((SOFT_WARNS + 1))
}

fail() {
  printf '  %s✗%s %s\n' "$RED" "$RESET" "$1"
  HARD_FAILS=$((HARD_FAILS + 1))
}

info() {
  printf '    %s\n' "$1"
}

# Prereq: required CLI tools
for tool in dig curl openssl; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    printf '%sFATAL:%s %s not found in PATH\n' "$RED" "$RESET" "$tool" >&2
    exit 1
  fi
done

printf '%sVerifying cutover for %s%s%s\n' "$BOLD" "$BLUE" "$DOMAIN" "$RESET"
if [ -n "$EXPECTED_APEX_IP" ]; then
  printf '  Expected apex IP: %s\n' "$EXPECTED_APEX_IP"
else
  printf '  %s(No EXPECTED_APEX_IP set — will print observed values only, no assertion.)%s\n' "$YELLOW" "$RESET"
fi

# ---------- 1. DNS Propagation ----------
section "1. DNS Propagation"

apex_local="$(dig +short "$DOMAIN" A 2>/dev/null | head -1)"
apex_google="$(dig @8.8.8.8 +short "$DOMAIN" A 2>/dev/null | head -1)"
apex_cloudflare="$(dig @1.1.1.1 +short "$DOMAIN" A 2>/dev/null | head -1)"
www_cname="$(dig +short "www.${DOMAIN}" CNAME 2>/dev/null | head -1)"

info "apex A (local resolver): ${apex_local:-<empty>}"
info "apex A (Google 8.8.8.8): ${apex_google:-<empty>}"
info "apex A (Cloudflare 1.1.1.1): ${apex_cloudflare:-<empty>}"
info "www CNAME: ${www_cname:-<empty>}"

if [ -z "$apex_local" ] || [ -z "$apex_google" ] || [ -z "$apex_cloudflare" ]; then
  fail "one or more resolvers returned no A record for ${DOMAIN}"
else
  pass "all three resolvers returned an A record"
fi

if [ -n "$apex_google" ] && [ -n "$apex_cloudflare" ] && [ "$apex_google" != "$apex_cloudflare" ]; then
  warn "Google and Cloudflare returned different IPs — propagation in progress or split DNS"
fi

if [ -n "$EXPECTED_APEX_IP" ]; then
  if [ "$apex_google" = "$EXPECTED_APEX_IP" ]; then
    pass "Google-DNS A matches EXPECTED_APEX_IP=${EXPECTED_APEX_IP}"
  else
    fail "Google-DNS A = ${apex_google}, expected ${EXPECTED_APEX_IP}"
  fi
fi

case "$www_cname" in
  *vercel-dns.com*|*vercel.app*)
    pass "www CNAME points to Vercel: ${www_cname}"
    ;;
  "")
    warn "no CNAME for www.${DOMAIN} — if Vercel was configured to use apex-redirect-from-www via A record, this may be intended"
    ;;
  *)
    warn "www CNAME = ${www_cname} — does not look like Vercel"
    ;;
esac

# ---------- 2. HTTP Status ----------
section "2. HTTP Status"

apex_status="$(curl -sI -o /dev/null -w '%{http_code}' "https://${DOMAIN}/" --max-time 10 || echo "000")"
www_status="$(curl -sI -o /dev/null -w '%{http_code}' "https://www.${DOMAIN}/" --max-time 10 || echo "000")"
www_location="$(curl -sI "https://www.${DOMAIN}/" --max-time 10 | awk 'tolower($1) == "location:" { print $2 }' | tr -d '\r')"

info "HTTPS apex status: ${apex_status}"
info "HTTPS www status: ${www_status}"
info "HTTPS www Location: ${www_location:-<none>}"

case "$apex_status" in
  200) pass "apex returns HTTP 200" ;;
  308|301|302) warn "apex returns redirect ${apex_status} — expected 200 for canonical apex" ;;
  000) fail "apex unreachable (connection failed/timeout)" ;;
  *) fail "apex returned HTTP ${apex_status}" ;;
esac

case "$www_status" in
  308|301) pass "www returns permanent redirect ${www_status}" ;;
  200) warn "www returned 200 directly — apex+www both canonical? consistency check needed" ;;
  000) fail "www unreachable (connection failed/timeout)" ;;
  *) warn "www returned HTTP ${www_status}" ;;
esac

case "$www_location" in
  "https://${DOMAIN}/"*) pass "www redirects to apex" ;;
  "") ;;  # covered by status check
  *) warn "www Location header = ${www_location} — expected https://${DOMAIN}/" ;;
esac

# ---------- 3. TLS Certificate ----------
section "3. TLS Certificate"

cert_text="$(echo | openssl s_client -connect "${DOMAIN}:443" -servername "${DOMAIN}" 2>/dev/null \
  | openssl x509 -noout -issuer -subject -dates 2>/dev/null || true)"

if [ -z "$cert_text" ]; then
  fail "could not retrieve TLS certificate"
else
  printf '%s\n' "$cert_text" | sed 's/^/    /'
  issuer="$(printf '%s' "$cert_text" | awk -F'=' '/^issuer/ { $1=""; sub(/^ /,""); print }')"
  case "$issuer" in
    *"Let's Encrypt"*|*"R10"*|*"R11"*|*"E1"*|*"E2"*)
      pass "issuer looks like Let's Encrypt (${issuer})"
      ;;
    *)
      warn "issuer is not Let's Encrypt — Vercel usually provisions LE certs (${issuer})"
      ;;
  esac
fi

# ---------- 4. B10 Legacy-URL Redirect ----------
section "4. B10 Legacy-URL Redirect"

legacy_path="/lieblingsclub-in-thailand/"
legacy_status="$(curl -sI -o /dev/null -w '%{http_code}' "https://${DOMAIN}${legacy_path}" --max-time 10 || echo "000")"
legacy_location="$(curl -sI "https://${DOMAIN}${legacy_path}" --max-time 10 | awk 'tolower($1) == "location:" { print $2 }' | tr -d '\r')"

info "legacy ${legacy_path} status: ${legacy_status}"
info "legacy ${legacy_path} Location: ${legacy_location:-<none>}"

if [ "$legacy_status" = "308" ] || [ "$legacy_status" = "301" ]; then
  case "$legacy_location" in
    */blog/lieblingsclub-in-thailand*)
      pass "B10 redirect resolves to /blog/lieblingsclub-in-thailand"
      ;;
    *)
      warn "B10 redirect Location = ${legacy_location} — expected /blog/lieblingsclub-in-thailand"
      ;;
  esac
else
  fail "B10 legacy URL did not return 308/301 (got ${legacy_status})"
fi

# ---------- 5. Content Smoke ----------
section "5. Content Smoke"

title_raw="$(curl -sL --max-time 10 "https://${DOMAIN}/" | grep -oE '<title>[^<]+</title>' | head -1 || true)"
info "apex <title>: ${title_raw:-<empty>}"

case "$title_raw" in
  *Oakwood*|*OGC*|*Golfclub*|*golfclub*)
    pass "apex <title> contains OGC wording"
    ;;
  "")
    fail "apex <title> not found in rendered HTML"
    ;;
  *)
    warn "apex <title> does not contain OGC wording — check for wrong-site-served"
    ;;
esac

# ---------- Summary ----------
section "Summary"

printf '  Hard fails: %d\n' "$HARD_FAILS"
printf '  Soft warns: %d\n' "$SOFT_WARNS"

if [ "$HARD_FAILS" -gt 0 ]; then
  printf '%s%sRESULT: FAIL%s — %d hard failure(s). Inspect above.\n' "$BOLD" "$RED" "$RESET" "$HARD_FAILS"
  exit 1
fi

if [ "$SOFT_WARNS" -gt 0 ]; then
  printf '%s%sRESULT: PASS with warnings%s — %d warning(s) to eyeball.\n' "$BOLD" "$YELLOW" "$RESET" "$SOFT_WARNS"
  exit 2
fi

printf '%s%sRESULT: PASS%s — all checks green.\n' "$BOLD" "$GREEN" "$RESET"
exit 0
