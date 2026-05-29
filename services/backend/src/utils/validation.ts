import { z } from "zod";
import { ValidationError } from "./errors.js";

export function parseJsonBody(eventBody: string | null | undefined): unknown {
  if (!eventBody) {
    throw new ValidationError("Request body is required.");
  }

  try {
    return JSON.parse(eventBody) as unknown;
  } catch {
    throw new ValidationError("Request body must be valid JSON.");
  }
}

export function validateBody<T>(schema: z.ZodSchema<T>, eventBody: string | null | undefined): T {
  const parsedBody = parseJsonBody(eventBody);
  const result = schema.safeParse(parsedBody);

  if (!result.success) {
    throw new ValidationError("Request body failed validation.", result.error.flatten());
  }

  return result.data;
}
