import { apiEvent, jsonBody, lambdaContext } from "../helpers/aws.js";

const newsletterMocks = vi.hoisted(() => ({
  subscribe: vi.fn()
}));

vi.mock("../../src/services/newsletterService.js", () => ({
  createNewsletterService: () => ({
    subscribe: newsletterMocks.subscribe
  })
}));

const { handler } = await import("../../src/handlers/newsletter.js");

describe("newsletter handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.APP_ENV = "test";
    process.env.LOG_LEVEL = "error";
    process.env.ALLOWED_ORIGINS = "https://www.julesfoundation.com";
    process.env.NEWSLETTER_TABLE_NAME = "newsletter-table";
  });

  it("validates and accepts newsletter subscriptions", async () => {
    newsletterMocks.subscribe.mockResolvedValue({ email: "reader@example.com", subscribed: true });

    const response = await handler(
      apiEvent({
        routeKey: "POST /newsletter",
        rawPath: "/newsletter",
        headers: { "x-correlation-id": "newsletter-correlation" },
        requestContext: {
          ...apiEvent().requestContext,
          http: { ...apiEvent().requestContext.http, method: "POST", path: "/newsletter" },
          routeKey: "POST /newsletter"
        },
        body: JSON.stringify({ email: "reader@example.com", firstName: "Reader" })
      }),
      lambdaContext()
    );

    expect(response.statusCode).toBe(200);
    expect(newsletterMocks.subscribe).toHaveBeenCalledWith(
      expect.objectContaining({ email: "reader@example.com" }),
      "newsletter-correlation"
    );
    expect(jsonBody(response)).toMatchObject({
      success: true,
      data: {
        accepted: true,
        email: "reader@example.com"
      }
    });
  });

  it("returns validation errors without calling the service", async () => {
    const response = await handler(
      apiEvent({
        routeKey: "POST /newsletter",
        rawPath: "/newsletter",
        requestContext: {
          ...apiEvent().requestContext,
          http: { ...apiEvent().requestContext.http, method: "POST", path: "/newsletter" },
          routeKey: "POST /newsletter"
        },
        body: JSON.stringify({ email: "bad" })
      }),
      lambdaContext()
    );

    expect(response.statusCode).toBe(400);
    expect(newsletterMocks.subscribe).not.toHaveBeenCalled();
    expect(jsonBody(response)).toMatchObject({
      success: false,
      error: {
        code: "VALIDATION_ERROR"
      }
    });
  });
});
