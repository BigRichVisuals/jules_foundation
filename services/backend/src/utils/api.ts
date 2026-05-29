import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from "aws-lambda";
import type { BaseConfig } from "../config/env.js";
import { AppError } from "./errors.js";
import { createLogger, type Logger } from "./logger.js";

export type ApiSuccess<T> = {
  success: true;
  data: T;
  correlationId: string;
};

export type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  correlationId: string;
};

export type HandlerContext = {
  correlationId: string;
  logger: Logger;
};

export type HandlerOptions = {
  operation: string;
  config: BaseConfig;
};

export function getCorrelationId(event: APIGatewayProxyEventV2, context: Context): string {
  return (
    event.headers["x-correlation-id"] ??
    event.headers["x-request-id"] ??
    event.requestContext.requestId ??
    context.awsRequestId
  );
}

export function corsHeaders(event: APIGatewayProxyEventV2, config: BaseConfig): Record<string, string> {
  const requestOrigin = event.headers.origin;
  const fallbackOrigin = config.ALLOWED_ORIGINS[0] ?? "";
  const allowedOrigin =
    requestOrigin && config.ALLOWED_ORIGINS.includes(requestOrigin) ? requestOrigin : fallbackOrigin;

  return {
    "access-control-allow-origin": allowedOrigin,
    "access-control-allow-headers": "content-type,x-correlation-id",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "content-type": "application/json"
  };
}

export function ok<T>(
  event: APIGatewayProxyEventV2,
  config: BaseConfig,
  correlationId: string,
  data: T,
  statusCode = 200
): APIGatewayProxyStructuredResultV2 {
  return {
    statusCode,
    headers: {
      ...corsHeaders(event, config),
      "x-correlation-id": correlationId
    },
    body: JSON.stringify({
      success: true,
      data,
      correlationId
    })
  };
}

export function fail(
  event: APIGatewayProxyEventV2,
  config: BaseConfig,
  correlationId: string,
  error: unknown
): APIGatewayProxyStructuredResultV2 {
  const appError =
    error instanceof AppError
      ? error
      : new AppError(500, "INTERNAL_SERVER_ERROR", "An unexpected error occurred.");

  return {
    statusCode: appError.statusCode,
    headers: {
      ...corsHeaders(event, config),
      "x-correlation-id": correlationId
    },
    body: JSON.stringify({
      success: false,
      error: {
        code: appError.code,
        message: appError.message,
        ...(appError.details ? { details: appError.details } : {})
      },
      correlationId
    })
  };
}

export async function withApiHandler<T>(
  event: APIGatewayProxyEventV2,
  context: Context,
  options: HandlerOptions,
  action: (handlerContext: HandlerContext) => Promise<T>
): Promise<APIGatewayProxyStructuredResultV2> {
  const correlationId = getCorrelationId(event, context);
  const logger = createLogger(
    {
      appEnv: options.config.APP_ENV,
      operation: options.operation,
      correlationId,
      requestId: event.requestContext.requestId,
      awsRequestId: context.awsRequestId
    },
    options.config.LOG_LEVEL
  );

  try {
    logger.info("request.received", {
      method: event.requestContext.http.method,
      path: event.rawPath
    });

    const data = await action({ correlationId, logger });

    logger.info("request.completed");
    return ok(event, options.config, correlationId, data);
  } catch (error) {
    logger.error("request.failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
      errorMessage: error instanceof AppError ? error.message : "Unhandled error"
    });

    return fail(event, options.config, correlationId, error);
  }
}
