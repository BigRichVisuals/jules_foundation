import { apiEvent, jsonBody, lambdaContext } from "../helpers/aws.js";

const contactMocks = vi.hoisted(() => ({
  submit: vi.fn()
}));

vi.mock("../../src/services/contactService.js", () => ({
  createContactService: () => ({
    submit: contactMocks.submit
  })
}));

const { handler } = await import("../../src/handlers/contact.js");

describe("contact handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.APP_ENV = "test";
    process.env.LOG_LEVEL = "error";
    process.env.ALLOWED_ORIGINS = "https://www.julesfoundation.com";
    process.env.CONTACT_TO_EMAIL = "contact@julesfoundation.com";
    process.env.CONTACT_FROM_EMAIL = "no-reply@julesfoundation.com";
  });

  it("validates and accepts contact submissions", async () => {
    contactMocks.submit.mockResolvedValue({ messageId: "message-id" });

    const response = await handler(
      apiEvent({
        routeKey: "POST /contact",
        rawPath: "/contact",
        headers: { "x-correlation-id": "contact-correlation" },
        requestContext: {
          ...apiEvent().requestContext,
          http: { ...apiEvent().requestContext.http, method: "POST", path: "/contact" },
          routeKey: "POST /contact"
        },
        body: JSON.stringify({
          name: "Jane Jules",
          email: "jane@example.com",
          subject: "Volunteer",
          message: "I would like to learn more about volunteering."
        })
      }),
      lambdaContext()
    );

    expect(response.statusCode).toBe(200);
    expect(contactMocks.submit).toHaveBeenCalledWith(expect.objectContaining({ email: "jane@example.com" }), "contact-correlation");
    expect(jsonBody(response)).toMatchObject({
      success: true,
      data: {
        accepted: true,
        messageId: "message-id"
      },
      correlationId: "contact-correlation"
    });
  });

  it("returns validation errors without calling the service", async () => {
    const response = await handler(
      apiEvent({
        routeKey: "POST /contact",
        rawPath: "/contact",
        requestContext: {
          ...apiEvent().requestContext,
          http: { ...apiEvent().requestContext.http, method: "POST", path: "/contact" },
          routeKey: "POST /contact"
        },
        body: JSON.stringify({ email: "bad" })
      }),
      lambdaContext()
    );

    expect(response.statusCode).toBe(400);
    expect(contactMocks.submit).not.toHaveBeenCalled();
    expect(jsonBody(response)).toMatchObject({
      success: false,
      error: {
        code: "VALIDATION_ERROR"
      }
    });
  });
});
