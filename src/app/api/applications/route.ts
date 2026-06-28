import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { countries, destinationOpts, SERVICE_PLAN_NAME, priceForPersons } from "@/lib/data";
import { trCountry } from "@/lib/tr";
import { makeRef, makeTxn, formatDay } from "@/lib/format";
import { applicationSchema } from "@/lib/validation";
import { sendEmail, applicationConfirmationEmail } from "@/lib/email";
import { newPurchaseMessage } from "@/lib/telegram";
import { enqueueTelegram, flushNotifications } from "@/lib/notifications";
import { rateLimit } from "@/lib/rate-limit";
import { customerToken } from "@/lib/auth-token";

function codeFor(list: { name: string; code: string }[], name: string, fallback: string) {
  return list.find((c) => c.name === name)?.code ?? fallback;
}

export async function POST(req: Request) {
  if (!rateLimit(req, "applications", 10, 60_000)) {
    return NextResponse.json({ error: "Çok fazla istek. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = applicationSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz başvuru verisi." }, { status: 400 });
  }
  const d = parsed.data;

  // Price is computed server-side from the group size — never trust the client.
  const pricing = priceForPersons(d.persons);

  const base = {
    title: `${trCountry(d.destination)} vizesi`,
    fullName: d.fullName,
    email: d.email,
    phone: d.phone || null,
    dob: d.dob || null,
    gender: d.gender || null,
    nationality: d.nationality,
    nationalityFlag: codeFor(countries, d.nationality, "gb"),
    passport: d.passport || null,
    passportExpiry: d.passportExpiry || null,
    employment: d.employment || null,
    addressLine1: d.addressLine1 || null,
    addressLine2: d.addressLine2 || null,
    city: d.city || null,
    state: d.state || null,
    destination: d.destination,
    destinationFlag: codeFor(destinationOpts, d.destination, "us"),
    visaType: d.visaType || "Tourist",
    visaCenter: d.visaCenter || null,
    purpose: d.purpose || null,
    sponsor: d.sponsor || null,
    accommodation: d.accommodation || null,
    hasChildren: d.hasChildren,
    travelDate: d.travelDate || null,
    duration: d.duration || null,
    plan: SERVICE_PLAN_NAME,
    persons: pricing.persons,
    perPerson: pricing.perPersonLabel,
    amount: pricing.totalLabel,
    paymentMethod: "Card payment",
    txn: makeTxn(),
    paidOn: formatDay(),
    status: "Paid",
    statusIndex: 0,
    isDemo: false,
    documents: {
      create: d.documents.map((f) => {
        const bytes = f.dataBase64 ? Buffer.from(f.dataBase64, "base64") : null;
        return {
          name: f.name,
          state: "In review",
          mimeType: f.mime ?? null,
          size: bytes?.length ?? null,
          data: bytes,
          uploadedBy: "customer",
        };
      }),
    },
    messages: {
      create: [
        {
          who: "Sistem",
          when: "az önce",
          text: "Başvurunuz alındı ve ödemeniz onaylandı. Bir MyVisa uzmanı kısa süre içinde belgelerinizi incelemeye başlayacak.",
        },
      ],
    },
  };

  // Create with a unique-ref retry (ref collisions are rare but possible).
  let application = null;
  for (let attempt = 0; attempt < 5 && !application; attempt++) {
    const ref = `${makeRef()}-${Math.floor(Math.random() * 90 + 10)}`;
    try {
      application = await prisma.application.create({ data: { ref, ...base } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") continue;
      throw e;
    }
  }
  if (!application) {
    return NextResponse.json({ error: "Başvuru oluşturulamadı. Lütfen tekrar deneyin." }, { status: 500 });
  }

  // Fire-and-forget confirmation email (no-op without RESEND_API_KEY).
  void sendEmail({
    to: application.email,
    ...applicationConfirmationEmail({
      fullName: application.fullName,
      ref: application.ref,
      destination: trCountry(application.destination),
    }),
  });

  // Queue the Telegram alert in the durable outbox (delivered immediately;
  // retried with backoff if Telegram is unreachable). Also opportunistically
  // drain any previously-failed notifications now that we have a live request.
  void enqueueTelegram(
    newPurchaseMessage({
      fullName: application.fullName,
      ref: application.ref,
      destination: trCountry(application.destination),
      amount: application.amount,
      perPerson: application.perPerson ?? pricing.perPersonLabel,
      persons: application.persons,
      email: application.email,
    }),
  ).then(() => flushNotifications(5)).catch(() => {});

  // Auto-log-in the applicant so the apply → dashboard redirect lands authed.
  const res = NextResponse.json({ id: application.id, ref: application.ref }, { status: 201 });
  res.cookies.set("mv_customer", await customerToken(d.email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
