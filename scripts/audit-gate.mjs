#!/usr/bin/env node
/**
 * Dependency CVE gate with an EXPIRING allowlist.
 *
 * Replaces a bare `npm audit --audit-level=high`, which had no way to say
 * "we know about this one and it has no forward fix". Without that, a single
 * unfixable transitive advisory turns a required check permanently red and
 * blocks every merge — including the merge that fixes the OTHER advisories.
 * That is exactly what happened on 2026-07-27: `sharp` (libvips) pinned this
 * repo shut while six Next.js advisories, among them SSRF in rewrites and
 * unauthenticated disclosure of internal Server Function endpoints, sat
 * waiting behind it.
 *
 * DESIGN RULES, in order of importance:
 *
 *  1. FAIL CLOSED. Every unexpected condition exits non-zero: malformed audit
 *     JSON, an empty payload, a missing `vulnerabilities` key, an allowlist
 *     entry whose shape is wrong, an unparseable date. A gate that fails open
 *     is worse than no gate, because it reports green.
 *  2. AN ENTRY EXPIRES. Past its date the build goes red EVEN IF the advisory
 *     is gone. That forces a human to look again instead of letting a
 *     temporary acceptance become permanent silence. This mirrors the sandbox
 *     repo's decay-check.yml, where a deadline is enforced by a job rather
 *     than by memory.
 *  3. MATCH ON ADVISORY ID, NEVER ON PACKAGE NAME. npm reports a parent
 *     package as high purely because a child is (`next` shows up "via: sharp"
 *     with no advisory of its own). Allowlisting by package name would
 *     therefore suppress far more than intended, and would silently keep
 *     suppressing it after the child was fixed. Collecting the distinct GHSA
 *     ids across the whole tree sidesteps that entirely.
 *  4. NO NEW DEPENDENCY. `audit-ci` and `better-npm-audit` both solve this,
 *     and both mean adding a dependency to the thing whose job is auditing
 *     dependencies. This is ~120 lines of zero-dep Node, in the same style as
 *     scripts/check-private-slug-leak.sh.
 *
 * Usage:  node scripts/audit-gate.mjs
 * Tests:  node scripts/audit-gate.test.mjs
 */

import { execFileSync } from "node:child_process";

/**
 * Advisories we consciously accept, each with a reason and a hard expiry.
 *
 * Adding a line here is a DECISION, not a formality. Two questions must both
 * be answered in the reason: why can this not be fixed today, and what would
 * have to change for it to be removed.
 */
// Five entries removed 2026-08-12, each because the thing it accepted stopped
// existing — not because anyone decided to tolerate more:
//   sharp    GHSA-f88m-g3jw-g9cj  -> next@16.3.0 widened its sharp range
//   js-yaml  GHSA-h67p-54hq-rp68  -> resolved by `npm audit fix` after the freeze lift
//   js-yaml  GHSA-52cp-r559-cp3m  -> same
//   brace-expansion  GHSA-3jxr-9vmj-r5cp, GHSA-mh99-v99m-4gvg -> same
// All five were confirmed inert by the gate's own "listed but no longer reported"
// output before removal. An acceptance that outlives its reason is how a temporary
// exception turns into permanent silence, which design rule 2 exists to prevent.
export const ALLOWLIST = [
  {
    id: "GHSA-w3rx-r6r6-pgpr",
    pkg: "image-size",
    devOnly: false,
    expires: "2026-11-30",
    reason:
      "image-size ICNS parser infinite loop. THERE IS NO FIX TO TAKE: this and GHSA-5p2g-fcmc-qvqq " +
      "both report first_patched_version = null against '<= 2.0.2', and 2.0.2 is what we run — so " +
      "this is not a bump being postponed. Reachability is why it is acceptable rather than urgent: " +
      "image-size is called ONLY from lib/blog/image-dimensions.ts at BUILD time, over files in our " +
      "own public/ directory, to inject width/height into markdown images against CLS. No upload " +
      "path, no request path, no untrusted byte reaches it — feeding it a crafted image requires " +
      "commit access to this repo first. Re-decide at expiry; if upstream still has nothing, the " +
      "cheap exit is to read the two dimension fields ourselves, which is all we use.",
  },
  {
    id: "GHSA-5p2g-fcmc-qvqq",
    pkg: "image-size",
    devOnly: false,
    expires: "2026-11-30",
    reason:
      "image-size JXL/HEIF parser infinite loops. Same package, same build-time-only reachability, " +
      "and the same absence of any patched version as GHSA-w3rx-r6r6-pgpr.",
  },
  // Both brace-expansion entries (GHSA-3jxr-9vmj-r5cp, GHSA-mh99-v99m-4gvg) removed
  // 2026-08-12: `npm audit fix` resolved them once the install freeze lifted, and the
  // gate's own "listed but no longer reported" line confirmed they had gone inert.
  // An acceptance that outlives its reason is how a temporary exception becomes
  // permanent silence.
];

const GATED = new Set(["high", "critical"]);

function die(message) {
  console.error(`\n[31mFAIL: ${message}[0m`);
  process.exit(1);
}

/** Runs npm audit and returns the parsed payload. npm exits non-zero when it finds
 *  anything, so a non-zero exit is expected and only the STDOUT matters. */
export function runAudit() {
  let raw;
  try {
    raw = execFileSync("npm", ["audit", "--json"], {
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
    });
  } catch (err) {
    raw = err.stdout;
    // No stdout at all means npm itself failed (offline, bad registry, no lockfile).
    // That is NOT "no vulnerabilities" — fail closed.
    if (!raw || !raw.trim()) {
      die(`npm audit produced no output (exit ${err.status}). Cannot verify — refusing to pass.`);
    }
  }
  return raw;
}

/** Extracts the distinct gated advisories from an npm-audit payload. Throws rather
 *  than returning empty on anything it does not recognise. */
export function collectAdvisories(raw) {
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("npm audit did not return valid JSON — refusing to pass.");
  }
  if (!data || typeof data !== "object") {
    throw new Error("npm audit JSON was not an object — refusing to pass.");
  }
  if (!("vulnerabilities" in data)) {
    throw new Error(
      "npm audit JSON has no `vulnerabilities` key — the format changed or the run failed. " +
        "Refusing to pass.",
    );
  }

  const found = new Map();
  for (const entry of Object.values(data.vulnerabilities)) {
    if (!entry || !GATED.has(entry.severity)) continue;
    for (const via of entry.via ?? []) {
      // Strings are parent-package pointers, not advisories. Only objects carry an id.
      if (typeof via !== "object" || via === null) continue;
      const id = String(via.url ?? "").split("/").pop();
      if (!id) continue;
      found.set(id, { id, title: via.title ?? "(no title)", pkg: entry.name ?? via.name ?? "?" });
    }
  }
  return found;
}

/** Validates allowlist shape and returns the entries that are past their date. */
export function findExpired(allowlist, today) {
  const expired = [];
  for (const entry of allowlist) {
    if (!entry?.id || !entry?.expires || !entry?.reason) {
      throw new Error(`allowlist entry is missing id/expires/reason: ${JSON.stringify(entry)}`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.expires)) {
      throw new Error(`allowlist entry ${entry.id} has a malformed expires date: ${entry.expires}`);
    }
    if (entry.expires < today) expired.push(entry);
  }
  return expired;
}

export function evaluate(raw, allowlist, today) {
  const found = collectAdvisories(raw);
  const expired = findExpired(allowlist, today);
  const allowed = new Map(allowlist.map((e) => [e.id, e]));

  const unlisted = [...found.values()].filter((a) => !allowed.has(a.id));
  const suppressed = [...found.values()].filter((a) => allowed.has(a.id));

  return { found, unlisted, suppressed, expired, allowed };
}

function main() {
  const today = new Date().toISOString().slice(0, 10);
  let result;
  try {
    result = evaluate(runAudit(), ALLOWLIST, today);
  } catch (err) {
    die(err.message);
    return;
  }

  console.log("=== Dependency CVE gate (high/critical, expiring allowlist) ===\n");

  if (result.suppressed.length) {
    console.log("Accepted advisories — each expires and will turn this gate red:");
    for (const a of result.suppressed) {
      const e = result.allowed.get(a.id);
      console.log(`  [33m~[0m ${a.id}  ${a.pkg}${e.devOnly ? "  [dev-only]" : ""}`);
      console.log(`      ${a.title}`);
      console.log(`      expires ${e.expires} — ${e.reason}`);
    }
    console.log("");
  }

  const staleEntries = ALLOWLIST.filter(
    (e) => !result.found.has(e.id) && !result.expired.includes(e),
  );
  if (staleEntries.length) {
    console.log("Listed but no longer reported — the advisory is gone, drop these lines:");
    for (const e of staleEntries) console.log(`  [36m·[0m ${e.id}  ${e.pkg}`);
    console.log("");
  }

  if (result.expired.length) {
    console.error("[31mEXPIRED allowlist entries — re-decide, do not just extend:[0m");
    for (const e of result.expired) {
      console.error(`  [31mx[0m ${e.id}  ${e.pkg}  expired ${e.expires}`);
      console.error(`      ${e.reason}`);
    }
  }

  if (result.unlisted.length) {
    console.error("[31mUNACCEPTED high/critical advisories:[0m");
    for (const a of result.unlisted) {
      console.error(`  [31mx[0m ${a.id}  ${a.pkg}`);
      console.error(`      ${a.title}`);
    }
  }

  if (result.expired.length || result.unlisted.length) {
    die(
      `${result.unlisted.length} unaccepted advisory/advisories, ` +
        `${result.expired.length} expired allowlist entry/entries.`,
    );
  }

  console.log(
    `[32mPASS[0m — ${result.found.size} gated advisory/advisories, all explicitly accepted and unexpired.`,
  );
}

// Only run when invoked directly, so the tests can import the pure helpers.
if (process.argv[1] && process.argv[1].endsWith("audit-gate.mjs")) main();
