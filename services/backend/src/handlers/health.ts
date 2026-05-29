import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from "aws-lambda";
import { getBaseConfig } from "../config/env.js";
import { withApiHandler } from "../utils/api.js";

export async function handler(
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyStructuredResultV2> {
  const config = getBaseConfig();

  return withApiHandler(event, context, { operation: "health", config }, async () => ({
    status: "ok",
    service: "jules-foundation-backend",
    environment: config.APP_ENV
  }));
}
