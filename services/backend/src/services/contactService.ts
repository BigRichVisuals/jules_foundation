import { SESClient, SendEmailCommand, type SendEmailCommandOutput } from "@aws-sdk/client-ses";
import type { ContactConfig } from "../config/env.js";
import type { ContactInput } from "../schemas/contact.js";
import { AppError } from "../utils/errors.js";
import type { Logger } from "../utils/logger.js";

export type ContactService = {
  submit(input: ContactInput, correlationId: string): Promise<{ messageId: string }>;
};

type SesSender = {
  send(command: SendEmailCommand): Promise<SendEmailCommandOutput>;
};

export function createContactService(config: ContactConfig, logger: Logger, sesClient?: SesSender): ContactService {
  const client = sesClient ?? new SESClient({});

  return {
    async submit(input, correlationId) {
      try {
        const response = await client.send(
          new SendEmailCommand({
            Source: config.CONTACT_FROM_EMAIL,
            Destination: {
              ToAddresses: [config.CONTACT_TO_EMAIL]
            },
            ReplyToAddresses: [input.email],
            Message: {
              Subject: {
                Charset: "UTF-8",
                Data: `Jules Foundation contact: ${input.subject}`
              },
              Body: {
                Text: {
                  Charset: "UTF-8",
                  Data: [
                    `Name: ${input.name}`,
                    `Email: ${input.email}`,
                    input.phone ? `Phone: ${input.phone}` : undefined,
                    input.organization ? `Organization: ${input.organization}` : undefined,
                    `Correlation ID: ${correlationId}`,
                    "",
                    input.message
                  ]
                    .filter(Boolean)
                    .join("\n")
                }
              }
            }
          })
        );

        logger.info("contact.email_sent", { messageId: response.MessageId });
        return { messageId: response.MessageId ?? correlationId };
      } catch (error) {
        logger.error("contact.email_failed", {
          errorName: error instanceof Error ? error.name : "UnknownError"
        });
        throw new AppError(502, "CONTACT_DELIVERY_FAILED", "Unable to submit contact message.");
      }
    }
  };
}
