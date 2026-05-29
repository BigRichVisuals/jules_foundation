import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import type { NewsletterConfig } from "../config/env.js";
import type { NewsletterInput } from "../schemas/newsletter.js";
import { AppError } from "../utils/errors.js";
import type { Logger } from "../utils/logger.js";

export type NewsletterService = {
  subscribe(input: NewsletterInput, correlationId: string): Promise<{ email: string; subscribed: true }>;
};

type DynamoSender = {
  send(command: PutCommand): Promise<unknown>;
};

export function createNewsletterService(
  config: NewsletterConfig,
  logger: Logger,
  documentClient?: DynamoSender
): NewsletterService {
  const client = documentClient ?? DynamoDBDocumentClient.from(new DynamoDBClient({}));

  return {
    async subscribe(input, correlationId) {
      const normalizedEmail = input.email.toLowerCase();

      try {
        await client.send(
          new PutCommand({
            TableName: config.NEWSLETTER_TABLE_NAME,
            Item: {
              email: normalizedEmail,
              firstName: input.firstName,
              source: input.source,
              correlationId,
              subscribedAt: new Date().toISOString(),
              status: "subscribed"
            }
          })
        );

        logger.info("newsletter.subscription_stored", { email: normalizedEmail });
        return { email: normalizedEmail, subscribed: true };
      } catch (error) {
        logger.error("newsletter.subscription_failed", {
          errorName: error instanceof Error ? error.name : "UnknownError"
        });
        throw new AppError(502, "NEWSLETTER_SUBSCRIPTION_FAILED", "Unable to subscribe email address.");
      }
    }
  };
}
