// HMAC-signed auth tokens, usable in both Edge middleware and Node routes
// (Web Crypto only — no Buffer/Node APIs). Replaces the reversible
// base64(user:pass) cookie. Secret comes from AUTH_SECRET (falls back to
// ADMIN_PASSWORD, then a dev constant).
const enc = new TextEncoder();

function secret(): string {
  return process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || "myvisa-dev-secret";
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

// ── Admin: token is just the signature of a fixed payload ──
export function adminToken(user: string): Promise<string> {
  return hmac(`admin:${user}`);
}
export async function verifyAdmin(cookie: string | undefined, user: string): Promise<boolean> {
  return !!cookie && cookie === (await adminToken(user));
}

// ── Customer: cookie = base64(email).signature, so the email is readable but tamper-proof ──
export async function customerToken(email: string): Promise<string> {
  const e = email.toLowerCase();
  return `${b64(e)}.${await hmac(`cust:${e}`)}`;
}
export async function readCustomer(cookie: string | undefined): Promise<string | null> {
  if (!cookie || !cookie.includes(".")) return null;
  const [payload, sig] = cookie.split(".");
  let email: string;
  try {
    email = unb64(payload);
  } catch {
    return null;
  }
  return sig === (await hmac(`cust:${email}`)) ? email : null;
}
