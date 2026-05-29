import { z } from "zod";

const csvSchema = z
  .string()
  .min(1)
  .transform((value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  )
  .pipe(z.array(z.string().url()).min(1));

const baseSchema = z.object({
  APP_ENV: z.enum(["local", "test", "dev", "staging", "prod"]).default("local"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  ALLOWED_ORIGINS: csvSchema.default("http://localhost:3000")
});

const contactSchema = baseSchema.extend({
  CONTACT_TO_EMAIL: z.string().email(),
  CONTACT_FROM_EMAIL: z.string().email()
});

const newsletterSchema = baseSchema.extend({
  NEWSLETTER_TABLE_NAME: z.string().min(1)
});

export type BaseConfig = z.infer<typeof baseSchema>;
export type ContactConfig = z.infer<typeof contactSchema>;
export type NewsletterConfig = z.infer<typeof newsletterSchema>;

function parseConfig<TSchema extends z.ZodTypeAny>(schema: TSchema, env: NodeJS.ProcessEnv): z.infer<TSchema> {
  const result = schema.safeParse(env);

  if (!result.success) {
    const fields = result.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Invalid environment configuration: ${fields}`);
  }

  return result.data;
}

export function getBaseConfig(env: NodeJS.ProcessEnv = process.env): BaseConfig {
  return parseConfig(baseSchema, env);
}

export function getContactConfig(env: NodeJS.ProcessEnv = process.env): ContactConfig {
  return parseConfig(contactSchema, env);
}

export function getNewsletterConfig(env: NodeJS.ProcessEnv = process.env): NewsletterConfig {
  return parseConfig(newsletterSchema, env);
}
