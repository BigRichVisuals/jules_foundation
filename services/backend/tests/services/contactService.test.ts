import { SendEmailCommand } from "@aws-sdk/client-ses";
import { createContactService } from "../../src/services/contactService.js";
import type { Logger } from "../../src/utils/logger.js";

const config = {
  APP_ENV: "test" as const,
  LOG_LEVEL: "error" as const,
  ALLOWED_ORIGINS: ["https://www.julesfoundation.com"],
  CONTACT_TO_EMAIL: "Julesfoundationinc@gmail.com",
  CONTACT_FROM_EMAIL: "Julesfoundationinc@gmail.com"
};

const logger = {
  info: vi.fn(),
  error: vi.fn()
} as unknown as Logger;

describe("createContactService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends contact messages through SES", async () => {
    const send = vi.fn().mockResolvedValue({ MessageId: "ses-message-id" });
    const service = createContactService(config, logger, { send });

    const result = await service.submit(
      {
        name: "Jane Jules",
        email: "jane@example.com",
        subject: "Volunteer",
        message: "I would like to learn more about volunteering."
      },
      "correlation-id"
    );

    expect(result).toEqual({ messageId: "ses-message-id" });
    expect(send).toHaveBeenCalledWith(expect.any(SendEmailCommand));
  });

  it("maps SES failures to a safe service error", async () => {
    const send = vi.fn().mockRejectedValue(new Error("SES secret detail"));
    const service = createContactService(config, logger, { send });

    await expect(
      service.submit(
        {
          name: "Jane Jules",
          email: "jane@example.com",
          subject: "Volunteer",
          message: "I would like to learn more about volunteering."
        },
        "correlation-id"
      )
    ).rejects.toMatchObject({
      statusCode: 502,
      code: "CONTACT_DELIVERY_FAILED",
      message: "Unable to submit contact message."
    });
  });
});
