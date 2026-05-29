import type { APIGatewayProxyEventV2, Context } from "aws-lambda";

export function apiEvent(overrides: Partial<APIGatewayProxyEventV2> = {}): APIGatewayProxyEventV2 {
  return {
    version: "2.0",
    routeKey: "GET /health",
    rawPath: "/health",
    rawQueryString: "",
    headers: {},
    requestContext: {
      accountId: "123456789012",
      apiId: "api-id",
      domainName: "example.execute-api.us-east-1.amazonaws.com",
      domainPrefix: "example",
      http: {
        method: "GET",
        path: "/health",
        protocol: "HTTP/1.1",
        sourceIp: "127.0.0.1",
        userAgent: "vitest"
      },
      requestId: "request-id",
      routeKey: "GET /health",
      stage: "dev",
      time: "01/Jan/2026:00:00:00 +0000",
      timeEpoch: 1767225600000
    },
    isBase64Encoded: false,
    ...overrides
  };
}

export function lambdaContext(overrides: Partial<Context> = {}): Context {
  return {
    callbackWaitsForEmptyEventLoop: false,
    functionName: "test-function",
    functionVersion: "$LATEST",
    invokedFunctionArn: "arn:aws:lambda:us-east-1:123456789012:function:test",
    memoryLimitInMB: "256",
    awsRequestId: "aws-request-id",
    logGroupName: "/aws/lambda/test",
    logStreamName: "test-stream",
    getRemainingTimeInMillis: () => 1000,
    done: () => undefined,
    fail: () => undefined,
    succeed: () => undefined,
    ...overrides
  };
}

export function jsonBody<T>(response: { body?: string }): T {
  return JSON.parse(response.body ?? "{}") as T;
}
