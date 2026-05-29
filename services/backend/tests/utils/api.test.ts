import { apiEvent, jsonBody, lambdaContext } from "../helpers/aws.js";
import { AppError } from "../../src/utils/errors.js";
import { withApiHandler } from "../../src/utils/api.js";

const config = {
  APP_ENV: "test" as const,
  LOG_LEVEL: "error" as const,
  ALLOWED_ORIGINS: ["https://www.julesfoundation.com"]
};

describe("withApiHandler", () => {
  it("returns a consistent success envelope with correlation ID", async () => {
    const event = apiEvent({
      headers: {
        origin: "https://www.julesfoundation.com",
        "x-correlation-id": "client-correlation"
      }
    });

    const response = await withApiHandler(event, lambdaContext(), { operation: "test", config }, async () => ({
      ok: true
    }));

    expect(response.statusCode).toBe(200);
    expect(response.headers).toMatchObject({
      "x-correlation-id": "client-correlation",
      "access-control-allow-origin": "https://www.julesfoundation.com"
    });
    expect(jsonBody(response)).toEqual({
      success: true,
      data: { ok: true },
      correlationId: "client-correlation"
    });
  });

  it("does not leak stack traces for unexpected errors", async () => {
    const response = await withApiHandler(
      apiEvent(),
      lambdaContext(),
      { operation: "test", config },
      async () => {
        throw new Error("database password is bad");
      }
    );

    expect(response.statusCode).toBe(500);
    expect(JSON.stringify(jsonBody(response))).not.toContain("database password");
    expect(jsonBody(response)).toMatchObject({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred."
      }
    });
  });

  it("returns safe details for intentional application errors", async () => {
    const response = await withApiHandler(
      apiEvent(),
      lambdaContext(),
      { operation: "test", config },
      async () => {
        throw new AppError(409, "DUPLICATE", "Already exists.", { field: "email" });
      }
    );

    expect(response.statusCode).toBe(409);
    expect(jsonBody(response)).toMatchObject({
      success: false,
      error: {
        code: "DUPLICATE",
        message: "Already exists.",
        details: { field: "email" }
      }
    });
  });
});
