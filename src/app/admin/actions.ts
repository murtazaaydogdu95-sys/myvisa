"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { statuses, balanceCents, formatEuroCents } from "@/lib/data";
import { sendEmail, specialistReplyEmail } from "@/lib/email";
import { assertAdminAction } from "@/lib/admin-auth";

const PAYMENT_STATUSES = ["Paid", "DepositPaid", "Pending", "Refunded"];
const DOC_STATES = ["Verified", "In review", "Action needed", "Missing"];

export async function refundApplication(id: string) {
  await assertAdminAction();
  await prisma.application.update({
    where: { id },
    data: {
      status: "Refunded",
      payments: { updateMany: { where: { status: { not: "refunded" } }, data: { status: "refunded" } } },
    },
  });
  revalidatePath("/admin");
  revalidatePath(`/admin/applications/${id}`);
  revalidatePath("/admin/payments");
  revalidatePath("/dashboard");
}

// Admin creates the remaining-balance payment once the appointment is booked.
// The customer then pays it from their dashboard.
export async function createBalancePayment(id: string) {
  await assertAdminAction();
  const app = await prisma.application.findUnique({ where: { id }, include: { payments: true } });
  if (!app) return;
  if (app.payments.some((p) => p.kind === "balance")) return; // already exists — no double-charge

  const cents = balanceCents(app.totalCents);
  await prisma.payment.create({
    data: { applicationId: id, kind: "balance", label: "Bakiye (%50)", amountCents: cents, status: "pending" },
  });
  await prisma.message.create({
    data: {
      applicationId: id,
      who: "Sistem",
      when: "az önce",
      text: `Randevunuz için bakiye ödemesi oluşturuldu: ${formatEuroCents(cents)}. Panelinizden ödeyebilirsiniz.`,
    },
  });
  revalidatePath(`/admin/applications/${id}`);
  revalidatePath("/admin/payments");
  revalidatePath("/dashboard");
}

export async function setPaymentStatus(id: string, status: string) {
  await assertAdminAction();
  if (!PAYMENT_STATUSES.includes(status)) return;
  await prisma.application.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
  revalidatePath(`/admin/applications/${id}`);
  revalidatePath("/admin/payments");
}

export async function setStage(id: string, statusIndex: number) {
  await assertAdminAction();
  if (!Number.isInteger(statusIndex) || statusIndex < 0 || statusIndex >= statuses.length) return;
  await prisma.application.update({ where: { id }, data: { statusIndex } });
  await prisma.message.create({
    data: {
      applicationId: id,
      who: "Sistem",
      when: "az önce",
      text: `Başvuru "${statuses[statusIndex]}" durumuna güncellendi.`,
    },
  });
  revalidatePath(`/admin/applications/${id}`);
  revalidatePath("/dashboard");
}

export async function setDocumentState(id: string, documentId: string, state: string) {
  await assertAdminAction();
  if (!DOC_STATES.includes(state)) return;
  await prisma.document.update({ where: { id: documentId }, data: { state } });
  revalidatePath(`/admin/applications/${id}`);
  revalidatePath("/dashboard");
}

export async function specialistReply(id: string, formData: FormData) {
  await assertAdminAction();
  const text = String(formData.get("text") ?? "").trim();
  const who = String(formData.get("who") ?? "MyVisa uzmanı").trim() || "MyVisa uzmanı";
  if (!text) return;

  const app = await prisma.application.update({
    where: { id },
    data: {
      messages: { create: { who: `${who} · MyVisa uzmanı`, when: "az önce", text, fromCustomer: false } },
    },
    select: { fullName: true, email: true, ref: true },
  });

  void sendEmail({
    to: app.email,
    ...specialistReplyEmail({ fullName: app.fullName, ref: app.ref, text }),
  });

  revalidatePath(`/admin/applications/${id}`);
  revalidatePath("/dashboard");
}
