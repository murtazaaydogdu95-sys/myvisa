// Simple in-memory fixed-window rate limiter, keyed by client IP + bucket.
// Note: per-process only — fine for a single replica. For multi-pod, back this
// with Redis/Upstash. Prevents brute-force on login and spam on public POSTs.
type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
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
