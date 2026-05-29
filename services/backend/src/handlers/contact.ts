import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from "aws-lambda";
import { getContactConfig } from "../config/env.js";
import { contactSchema } from "../schemas/contact.js";
import { createContactService } from "../services/contactService.js";
import { withApiHandler } from "../utils/api.js";
import { validateBody } from "../utils/validation.js";

export async function handler(
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyStructuredResultV2> {
  const config = getContactConfig();

  return withApiHandler(event, context, { operation: "contact", config }, async ({ correlationId, logger }) => {
    const input = validateBody(contactSchema, event.body);
    const service = createContactService(config, logger);
    const result = await service.submit(input, correlationId);

    return {
      accepted: true,
      messageId: result.messageId
    };
  });
}
