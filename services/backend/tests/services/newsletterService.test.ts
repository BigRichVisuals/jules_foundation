import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { createNewsletterService } from "../../src/services/newsletterService.js";
import type { Logger } from "../../src/utils/logger.js";

const config = {
  APP_ENV: "test" as const,
  LOG_LEVEL: "error" as const,
  ALLOWED_ORIGINS: ["https://www.julesfoundation.com"],
  NEWSLETTER_TABLE_NAME: "newsletter-table"
};

const logger = {
  info: vi.fn(),
  error: vi.fn()
} as unknown as Logger;

describe("createNewsletterService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("stores normalized newsletter subscriptions in DynamoDB", async () => {
    const send = vi.fn().mockResolvedValue({});
    const service = createNewsletterService(config, logger, { send });

    const result = await service.subscribe({ email: "Reader@Example.com", firstName: "Reader" }, "correlation-id");

    expect(result).toEqual({ email: "reader@example.com", subscribed: true });
    expect(send).toHaveBeenCalledWith(expect.any(PutCommand));
  });

  it("maps DynamoDB failures to a safe service error", async () => {
    const send = vi.fn().mockRejectedValue(new Error("DynamoDB secret detail"));
    const service = createNewsletterService(config, logger, { send });

    await expect(service.subscribe({ email: "reader@example.com" }, "correlation-id")).rejects.toMatchObject({
      statusCode: 502,
      code: "NEWSLETTER_SUBSCRIPTION_FAILED",
      message: "Unable to subscribe email address."
    });
  });
});
