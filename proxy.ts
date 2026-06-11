import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ALL_REDIRECTS } from "./lib/redirects";

/**
 * Trailing-slash + legacy-redirect handling in one pass (JK-9).
 *
 * The problem: with Next.js' built-in `trailingSlash: false`, a request for a
 * legacy URL WITH a trailing slash takes TWO hops —
 *   `/foo/` → 308 (Next strips the slash) → `/foo` → 308 (redirects() maps) → 200.
 * Next's slash-normalization fires BEFORE both redirects() AND the proxy
 * (verified locally 2026-06-11), so a proxy alone can't collapse it. WordPress
 * indexed nearly every URL WITH a trailing slash, so this 2-hop is the common
 * legacy path.
 *
 * The fix: disable Next's auto-normalization (`skipTrailingSlashRedirect: true`
 * in next.config.ts) and let this proxy own BOTH concerns:
 *   1. Legacy source (either slash variant) → destination in a SINGLE 308.
 *   2. Any other trailing-slash URL → its slashless form (the normalization
 *      Next used to do), so non-legacy pages keep their canonical shape.
 *
 * Net effect: legacy URLs are 1-hop regardless of trailing slash; every other
 * URL behaves exactly as before. next.config.ts redirects() stays as a
 * belt-and-suspenders fallback (D-LIN-26-2: two layers, not either-or).
 *
 * Fail-open: any error returns NextResponse.next() — the proxy must never
 * break a request on the live revenue site.
 */

// Built once per cold start. Keys are slashless sources (as generated).
const REDIRECT_MAP = new Map(ALL_REDIRECTS.map((entry) => [entry.source, entry]));

function stripTrailingSlash(pathname: string): string {
  return pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
}

export function proxy(request: NextRequest): NextResponse {
  try {
    const { pathname, search } = request.nextUrl;
    const slashless = stripTrailingSlash(pathname);

    // 1. Legacy redirect — both slash variants map straight to the target.
    const hit = REDIRECT_MAP.get(slashless);
    if (hit) {
      const target = new URL(hit.destination, request.url);
      // Carry incoming query (e.g. UTM) forward; destinations only carry a
      // #hash, never their own query, so this never clobbers one.
      if (!target.search && search) target.search = search;
      return NextResponse.redirect(target, hit.permanent ? 308 : 307);
    }

    // 2. Non-legacy trailing slash — emulate the normalization we switched off.
    if (slashless !== pathname) {
      const target = new URL(slashless + search, request.url);
      return NextResponse.redirect(target, 308);
    }

    return NextResponse.next();
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  // Navigable paths only: skip Next internals, API routes, and any file with
  // an extension (assets, .well-known). Legacy sources never contain a dot.
  matcher: ["/((?!_next/static|_next/image|api|favicon.ico|.*\\..*).*)"],
};
