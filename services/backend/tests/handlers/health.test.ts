import { handler } from "../../src/handlers/health.js";
import { apiEvent, jsonBody, lambdaContext } from "../helpers/aws.js";

describe("health handler", () => {
  beforeEach(() => {
    process.env.APP_ENV = "test";
    process.env.LOG_LEVEL = "error";
    process.env.ALLOWED_ORIGINS = "https://www.julesfoundation.com";
  });

  it("returns service health", async () => {
    const response = await handler(apiEvent(), lambdaContext());

    expect(response.statusCode).toBe(200);
    expect(jsonBody(response)).toMatchObject({
      success: true,
      data: {
        status: "ok",
        service: "jules-foundation-backend",
        environment: "test"
      }
    });
  });
});
