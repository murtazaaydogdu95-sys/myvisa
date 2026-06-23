import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { sendEmail, contactNotificationEmail, hasAdminEmail } from "@/lib/email";

export async function POST(req: Request) {
  if (!rateLimit(req, "contact", 5, 60_000)) {
    return NextResponse.json({ error: "Çok fazla istek. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Lütfen adınızı, geçerli bir e-posta ve bir mesaj girin." },
      { status: 400 },
    );
  }
  const { name, email, message } = parsed.data;

  await prisma.contactMessage.create({ data: { name, email, message } });

  if (hasAdminEmail()) {
    void sendEmail(contactNotificationEmail({ name, email, message }));
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
