import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(1).max(160),
  message: z.string().trim().min(10).max(5000),
  phone: z.string().trim().max(40).optional(),
  organization: z.string().trim().max(160).optional()
});

export type ContactInput = z.infer<typeof contactSchema>;
