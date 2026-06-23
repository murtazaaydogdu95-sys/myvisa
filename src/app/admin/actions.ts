"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { statuses } from "@/lib/data";
import { sendEmail, specialistReplyEmail } from "@/lib/email";

const PAYMENT_STATUSES = ["Paid", "Pending", "Refunded"];
const DOC_STATES = ["Verified", "In review", "Action needed", "Missing"];

export async function refundApplication(id: string) {
  await prisma.application.update({ where: { id }, data: { status: "Refunded" } });
  revalidatePath("/admin");
}

export async function setPaymentStatus(id: string, status: string) {
  if (!PAYMENT_STATUSES.includes(status)) return;
  await prisma.application.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
  revalidatePath(`/admin/applications/${id}`);
  revalidatePath("/admin/payments");
}

export async function setStage(id: string, statusIndex: number) {
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
  if (!DOC_STATES.includes(state)) return;
  await prisma.document.update({ where: { id: documentId }, data: { state } });
  revalidatePath(`/admin/applications/${id}`);
  revalidatePath("/dashboard");
}

export async function specialistReply(id: string, formData: FormData) {
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
