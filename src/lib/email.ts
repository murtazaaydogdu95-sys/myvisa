import { Resend } from "resend";

// Env-gated email. When RESEND_API_KEY is unset (e.g. local dev), sends are
// skipped and logged instead of failing — so the app works without a key.
const apiKey = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM || "MyVisa <onboarding@resend.dev>";
const ADMIN_TO = process.env.ADMIN_EMAIL || "";

const resend = apiKey ? new Resend(apiKey) : null;

type Mail = { to: string; subject: string; html: string };

export async function sendEmail({ to, subject, html }: Mail): Promise<boolean> {
  if (!resend) {
    console.log(`[email skipped — no RESEND_API_KEY] to=${to} subject="${subject}"`);
    return false;
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
    return true;
  } catch (e) {
    console.error("[email] send failed:", e);
    return false;
  }
}

const shell = (title: string, body: string) => `
  <div style="font-family:system-ui,sans-serif;background:#f5f7fa;padding:24px">
    <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #eef2f7;border-radius:16px;overflow:hidden">
      <div style="background:linear-gradient(160deg,#071529,#0a1f3c);padding:22px 26px;color:#fff;font-size:18px;font-weight:800">
        My<span style="color:#10b981">Visa</span>
      </div>
      <div style="padding:26px">
        <h1 style="font-size:19px;color:#0a1f3c;margin:0 0 12px">${title}</h1>
        <div style="font-size:14.5px;color:#46566e;line-height:1.6">${body}</div>
      </div>
    </div>
  </div>`;

export function applicationConfirmationEmail(p: { fullName: string; ref: string; destination: string }) {
  return {
    subject: `Başvurunuz alındı — ${p.ref}`,
    html: shell(
      "Başvurunuz alındı 🎉",
      `Merhaba ${p.fullName},<br><br>${p.destination} vizesi başvurunuz alındı ve ödemeniz onaylandı.
       Referans numaranız: <strong>${p.ref}</strong>.<br><br>
       Bir MyVisa uzmanı kısa süre içinde belgelerinizi incelemeye başlayacak.
       Süreci panelinizden takip edebilirsiniz.`,
    ),
  };
}

export function contactNotificationEmail(p: { name: string; email: string; message: string }) {
  return {
    to: ADMIN_TO,
    subject: `Yeni iletişim mesajı — ${p.name}`,
    html: shell(
      "Yeni iletişim mesajı",
      `<strong>${p.name}</strong> (${p.email}) şunu yazdı:<br><br>${p.message.replace(/\n/g, "<br>")}`,
    ),
  };
}

export function specialistReplyEmail(p: { fullName: string; ref: string; text: string }) {
  return {
    subject: `Başvurunuzla ilgili güncelleme — ${p.ref}`,
    html: shell(
      "Uzmanınızdan yeni mesaj",
      `Merhaba ${p.fullName},<br><br>${p.text.replace(/\n/g, "<br>")}<br><br>
       Tüm detayları panelinizden görebilirsiniz.`,
    ),
  };
}

export const hasAdminEmail = () => !!ADMIN_TO;
