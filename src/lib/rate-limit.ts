// Simple in-memory fixed-window rate limiter, keyed by client IP + bucket.
// Note: per-process only — fine for a single replica. For multi-pod, back this
// with Redis/Upstash. Prevents brute-force on login and spam on public POSTs.
type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

// Resolve the client IP for rate-limiting. The leftmost X-Forwarded-For value
// is client-controlled (spoofable) — never trust it. Prefer X-Real-IP (set by
// the trusted reverse proxy / traefik and overwritten each hop), otherwise use
// the RIGHTMOST X-Forwarded-For entry (appended by our own proxy, not
// attacker-injectable). Assumes a single trusted proxy in front of the app.
function clientIp(req: Request): string {
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return "unknown";
}

/** Returns true if allowed, false if the limit is exceeded. */
export function rateLimit(req: Request, bucket: string, limit: number, windowMs: number): boolean {
  const key = `${bucket}:${clientIp(req)}`;
  const now = Date.now();
  const e = store.get(key);
  if (!e || e.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  e.count += 1;
  return e.count <= limit;
}
