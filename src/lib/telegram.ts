// Env-gated Telegram notifications. When TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID
// are unset (e.g. local dev), sends are skipped and logged instead of failing —
// so the app works without a bot configured.
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export const hasTelegram = () => !!(TOKEN && CHAT_ID);

// Sends a Markdown message to the configured chat. Fire-and-forget friendly:
// never throws, returns whether it was delivered.
export async function sendTelegram(text: string): Promise<boolean> {
  if (!TOKEN || !CHAT_ID) {
    console.log(`[telegram skipped — no TELEGRAM_BOT_TOKEN/CHAT_ID]\n${text}`);
    return false;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      console.error("[telegram] send failed:", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (e) {
    console.error("[telegram] send failed:", e);
    return false;
  }
}

// Telegram MarkdownV1 only needs a few characters escaped to avoid breaking.
function esc(v: string) {
  return v.replace(/([_*`\[])/g, "\\$1");
}

export function newPurchaseMessage(p: {
  fullName: string;
  ref: string;
  destination: string;
  amount: string;
  deposit: string;
  perPerson: string;
  persons: number;
  email: string;
}): string {
  return [
    "🎉 *Yeni başvuru & kapora alındı*",
    "",
    `👤 *Müşteri:* ${esc(p.fullName)}`,
    `📧 *E-posta:* ${esc(p.email)}`,
    `🌍 *Destinasyon:* ${esc(p.destination)}`,
    `👥 *Kişi sayısı:* ${p.persons} (${esc(p.perPerson)}/kişi)`,
    `💰 *Kapora (%50):* ${esc(p.deposit)}`,
    `💳 *Toplam:* ${esc(p.amount)}`,
    `🔖 *Referans:* ${esc(p.ref)}`,
  ].join("\n");
}
