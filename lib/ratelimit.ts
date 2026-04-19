/**
 * In-Memory Rate-Limiter — Pre-Launch Spam-Schutz (User-Entscheidung
 * 2026-04-19, Security-Sweep F2).
 *
 * Kontext: OGC geht OHNE Captcha an den Start. Der Spam-Schutz beim
 * Launch ist dieser Rate-Limiter vor `sendFormEmail` in allen drei
 * Form-Server-Actions (Kontakt, Mitglied werden, Verlängerung).
 *
 * Design:
 *   - Per-Process `Map` — pro Vercel-Fluid-Instanz ein Counter.
 *   - 5 Submits pro IP pro Stunde (default). Genug für Familien mit
 *     4 Flight-Mitgliedern + 1 Korrektur, aber stoppt einen Bot, der
 *     IONOS-Mailbox in < 1 Minute mit 1000 Mails fluten will.
 *   - TTL-Lazy-Reset: alte Einträge werden bei Neuzugriff verworfen.
 *     Kein Garbage-Collector-Interval nötig — bei 300 Mitgliedern und
 *     ~10-50 realen Submits pro Woche bleibt die Map winzig.
 *
 * Skalierungs-Limit:
 *   - In-Memory ist EIN-PROZESS. Bei Multi-Region-Fluid-Compute hat
 *     jede Region ihren eigenen Counter → effektives Limit × Regionen.
 *     Für OGC (1 Region, DACH-Traffic) irrelevant.
 *   - Bei einem Crash / Redeploy verliert der Counter seinen State.
 *     Trade-Off bewusst akzeptiert: Spam-Flood-Fenster ist kurz
 *     (Sekunden bis wenige Minuten), ein Redeploy passiert selten
 *     und öffnet das Fenster nur minimal.
 *   - Phase 2 (Backlog): Upstash Ratelimit mit sliding window wenn
 *     Multi-Region oder persistenter State notwendig wird.
 */

type RateLimitEntry = { count: number; resetAt: number };

const store = new Map<string, RateLimitEntry>();

const DEFAULT_MAX = 5;
const DEFAULT_WINDOW_MS = 3_600_000; // 1 Stunde

/**
 * Check und erhöhe den Counter für `key`. Returnt `true` wenn der
 * Request durchgehen darf, `false` wenn das Limit erreicht ist.
 *
 * `key`-Konvention: `form:${ip}` (pro-IP, forms-übergreifend). Alternativ
 * `form:${formName}:${ip}` wenn pro-Form-Limits gewünscht sind — der
 * MASCHIN-Prompt hat pro-IP vorgegeben, Phase 2 kann das verfeinern.
 */
export function checkRateLimit(
  key: string,
  max: number = DEFAULT_MAX,
  windowMs: number = DEFAULT_WINDOW_MS,
): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= max) return false;

  entry.count += 1;
  return true;
}

/**
 * Test-Utility — löscht alle Counter. NICHT aus Produktionscode aufrufen.
 * Nur verwenden in Unit-/E2E-Tests, um zwischen Szenarien zurückzusetzen.
 */
export function __resetRateLimitForTests(): void {
  store.clear();
}
