import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from "aws-lambda";
import { getNewsletterConfig } from "../config/env.js";
import { newsletterSchema } from "../schemas/newsletter.js";
import { createNewsletterService } from "../services/newsletterService.js";
import { withApiHandler } from "../utils/api.js";
import { validateBody } from "../utils/validation.js";

export async function handler(
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyStructuredResultV2> {
  const config = getNewsletterConfig();

  return withApiHandler(event, context, { operation: "newsletter", config }, async ({ correlationId, logger }) => {
    const input = validateBody(newsletterSchema, event.body);
    const service = createNewsletterService(config, logger);
    const result = await service.subscribe(input, correlationId);

    return {
      accepted: true,
      email: result.email
    };
  });
}
