import crypto from "crypto";
import { prisma } from "./prisma";
import { sendEmail, loginCodeEmail, hasEmail } from "./email";

// Customer email-OTP login. Codes are 6 digits, valid 10 minutes, single-use,
// capped at 5 verification attempts. Only an HMAC hash of the code is stored.

const CODE_TTL_MS = 10 * 60_000;
const MAX_ATTEMPTS = 5;

function secret(): string {
  const s = process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD;
  if (s) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET (or ADMIN_PASSWORD) must be set in production");
  }
  return "myvisa-dev-only-secret";
}

function hashCode(email: string, code: string): string {
  return crypto.createHmac("sha256", secret()).update(`${email.toLowerCase()}:${code}`).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

// Generate, store, and email a fresh login code for `email` (assumes the caller
// already verified an application exists for it). Returns the plaintext code so
// dev environments without email configured can log it. Never expose in prod.
export async function issueLoginCode(email: string): Promise<string> {
  const e = email.toLowerCase();
  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");

  // Invalidate any outstanding codes for this email, then store the new hash.
  await prisma.loginCode.deleteMany({ where: { email: e } });
  await prisma.loginCode.create({
    data: { email: e, codeHash: hashCode(e, code), expiresAt: new Date(Date.now() + CODE_TTL_MS) },
  });

  if (hasEmail()) {
    void sendEmail({ to: e, ...loginCodeEmail({ code }) });
  } else {
    console.log(`[login-code] email not configured — code for ${e}: ${code}`);
  }
  return code;
}

// Verify a submitted code. Single-use; deletes the record on success and when
// the attempt cap is reached. Returns true only on a valid, unexpired match.
export async function verifyLoginCode(email: string, code: string): Promise<boolean> {
  const e = email.toLowerCase();
  const rec = await prisma.loginCode.findFirst({
    where: { email: e },
    orderBy: { createdAt: "desc" },
  });
  if (!rec) return false;

  if (rec.expiresAt < new Date() || rec.attempts >= MAX_ATTEMPTS) {
    await prisma.loginCode.deleteMany({ where: { email: e } });
    return false;
  }

  const ok = safeEqual(rec.codeHash, hashCode(e, code));
  if (!ok) {
    await prisma.loginCode.update({ where: { id: rec.id }, data: { attempts: { increment: 1 } } });
    return false;
  }

  await prisma.loginCode.deleteMany({ where: { email: e } });
  return true;
}
