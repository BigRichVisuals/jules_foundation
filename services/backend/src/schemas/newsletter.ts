import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().trim().email().max(254),
  firstName: z.string().trim().min(1).max(80).optional(),
  source: z.string().trim().min(1).max(120).optional()
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
