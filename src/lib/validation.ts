import { z } from "zod";

export const applicationSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().default(""),
  dob: z.string().trim().max(20).optional().default(""),
  nationality: z.string().trim().min(1).max(80),
  passport: z.string().trim().max(40).optional().default(""),
  destination: z.string().trim().min(1).max(80),
  visaType: z.string().trim().max(40).optional().default(""),
  visaCenter: z.string().trim().max(80).optional().default(""),
  purpose: z.string().trim().max(80).optional().default(""),
  travelDate: z.string().trim().max(20).optional().default(""),
  duration: z.string().trim().max(20).optional().default(""),
  documents: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(160),
        mime: z.string().max(120).optional(),
        // base64 (no data: prefix); ~5MB binary ≈ ~6.8MB base64
        dataBase64: z.string().max(7_000_000).optional(),
      }),
    )
    .max(20)
    .optional()
    .default([]),
});

export const customerMessageSchema = z.object({
  applicationId: z.string().min(1).max(60),
  text: z.string().trim().min(1).max(4000),
});

export const customerDocumentSchema = z.object({
  applicationId: z.string().min(1).max(60),
  name: z.string().trim().min(1).max(160),
  mime: z.string().max(120).optional(),
  dataBase64: z.string().min(1).max(7_000_000),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(160),
  message: z.string().trim().min(1).max(4000),
});

export const customerLoginSchema = z.object({
  email: z.string().trim().email().max(160),
});

export const adminLoginSchema = z.object({
  user: z.string().max(120),
  password: z.string().max(200),
});
