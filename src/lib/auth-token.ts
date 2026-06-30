// HMAC-signed auth tokens, usable in both Edge middleware and Node routes
// (Web Crypto only — no Buffer/Node APIs). Replaces the reversible
// base64(user:pass) cookie. Secret comes from AUTH_SECRET (falls back to
// ADMIN_PASSWORD, then a dev constant).
const enc = new TextEncoder();

function secret(): string {
  const configured = process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD;
  if (configured) return configured;
  // No signing secret configured. Fail CLOSED in production rather than fall
  // back to a constant committed to the (public) repo — that would let anyone
  // forge admin/customer tokens. A dev-only constant keeps local dev working.
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET (or ADMIN_PASSWORD) must be set in production");
  }
  return "myvisa-dev-only-secret";
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

// Emails are ASCII, so plain base64 is sufficient and avoids deprecated globals.
const b64 = (s: string) => btoa(s);
const unb64 = (s: string) => atob(s);

const ADMIN_TTL = 8 * 60 * 60; // seconds
const CUSTOMER_TTL = 7 * 24 * 60 * 60;
const nowSec = () => Math.floor(Date.now() / 1000);

// ── Admin: token = exp.signature(admin:user:exp) — bounded lifetime (F-05) ──
export async function adminToken(user: string): Promise<string> {
  const exp = nowSec() + ADMIN_TTL;
  return `${exp}.${await hmac(`admin:${user}:${exp}`)}`;
}
export async function verifyAdmin(cookie: string | undefined, user: string): Promise<boolean> {
  if (!cookie) return false;
  const parts = cookie.split(".");
  if (parts.length !== 2) return false;
  const [expStr, sig] = parts;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < nowSec()) return false; // expired/invalid
  return sig === (await hmac(`admin:${user}:${exp}`));
}

// ── Customer: cookie = base64(email).exp.signature — readable email, tamper-proof, expiring ──
export async function customerToken(email: string): Promise<string> {
  const e = email.toLowerCase();
  const exp = nowSec() + CUSTOMER_TTL;
  return `${b64(e)}.${exp}.${await hmac(`cust:${e}:${exp}`)}`;
}
export async function readCustomer(cookie: string | undefined): Promise<string | null> {
  if (!cookie) return null;
  const parts = cookie.split(".");
  if (parts.length !== 3) return null;
  const [payload, expStr, sig] = parts;
  let email: string;
  try {
    email = unb64(payload);
  } catch {
    return null;
  }
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < nowSec()) return null; // expired/invalid
  return sig === (await hmac(`cust:${email}:${exp}`)) ? email : null;
}
