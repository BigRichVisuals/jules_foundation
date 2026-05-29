# Jules Foundation Backend

AWS SAM backend for the Jules Foundation website at `julesfoundation.com`. It uses TypeScript, Node.js 20.x, Lambda, API Gateway HTTP API, SES for contact form delivery, and DynamoDB for newsletter subscriptions.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | Service health check |
| POST | `/contact` | Validates contact form input and sends it through SES |
| POST | `/newsletter` | Validates and stores newsletter subscriptions in DynamoDB |

All responses use the same envelope:

```json
{
  "success": true,
  "data": {},
  "correlationId": "request-correlation-id"
}
```

Errors never expose stack traces:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request body failed validation."
  },
  "correlationId": "request-correlation-id"
}
```

## Architecture

```text
src/
  config/      Environment parsing and validation
  handlers/    Thin Lambda entrypoints
  schemas/     Zod request schemas
  services/    AWS integration logic
  utils/       API envelopes, logging, validation, errors
tests/
  config/
  handlers/
  schemas/
  services/
  utils/
```

Handlers validate input, create a correlation-aware logger, call one service, and return a consistent response. Services own AWS integration behavior. This keeps future admin/auth expansion possible without coupling public form endpoints to a fake auth layer.

## Setup

Prerequisites:

- Node.js 20.x
- AWS SAM CLI
- AWS CLI configured for the deployment account
- A verified SES identity for `ContactFromEmail`

From the repository root:

```bash
cd services/backend
```

Install dependencies:

```bash
npm install
```

Create a local environment file for reference:

```bash
cp env.example .env
```

`.env` is ignored by git. SAM deployment values are provided through `samconfig.toml` or CLI parameter overrides, not committed secrets.

## Test

Run type checks:

```bash
npm run lint
```

Run unit tests:

```bash
npm test
```

Run coverage:

```bash
npm run test:coverage
```

## Build

Build with SAM:

```bash
npm run build
```

The SAM template uses Makefile build targets that call the project-local `esbuild` dev dependency through `npx`. SAM builds do not require a globally installed `esbuild`.

## SAM Local

Start API Gateway locally:

```bash
npm run sam:local
```

Call the health endpoint:

```bash
curl -i http://127.0.0.1:3000/health
```

Contact and newsletter local calls execute the real SES and DynamoDB client code. Use AWS credentials and deployment parameters that point at a safe development AWS account.

Example contact request:

```bash
curl -i http://127.0.0.1:3000/contact \
  -H 'content-type: application/json' \
  -H 'x-correlation-id: local-contact-1' \
  -d '{
    "name": "Jane Jules",
    "email": "jane@example.com",
    "subject": "Volunteer",
    "message": "I would like to learn more about volunteering."
  }'
```

Example newsletter request:

```bash
curl -i http://127.0.0.1:3000/newsletter \
  -H 'content-type: application/json' \
  -H 'x-correlation-id: local-newsletter-1' \
  -d '{"email":"reader@example.com","firstName":"Reader"}'
```

## Deploy

Review `samconfig.toml` before deploying. Set:

- `AllowedOrigins` to the exact production and development website origins.
- `ContactToEmail` to the mailbox that receives website contact submissions.
- `ContactFromEmail` to a verified SES identity in the deployment region.

The current config includes:

- `https://julesfoundation.com`
- `https://www.julesfoundation.com`
- `https://main.d1jgyq9fz4ajo6.amplifyapp.com`
- `https://dev.d1jgyq9fz4ajo6.amplifyapp.com`
- `http://localhost:3000`

The AWS Amplify app ID provided for the frontend is `d1jgyq9fz4ajo6`.

This scaffold is pinned to `nodejs20.x` because the project requires Node.js 20.x. As of May 29, 2026, `sam validate --lint` warns that AWS has placed that runtime on its deprecation path. Plan a deliberate runtime upgrade to `nodejs24.x` when the project requirement changes.

Guided deployment:

```bash
npm run sam:deploy:guided
```

Repeat deployment after configuration is saved:

```bash
npm run sam:deploy
```

Direct deployment with explicit parameters:

```bash
sam deploy \
  --stack-name jules-foundation-backend-dev \
  --region us-east-1 \
  --capabilities CAPABILITY_IAM \
  --resolve-s3 \
  --parameter-overrides \
    AppEnv=dev \
    LogLevel=info \
    AllowedOrigins=https://julesfoundation.com,https://www.julesfoundation.com,https://main.d1jgyq9fz4ajo6.amplifyapp.com,https://dev.d1jgyq9fz4ajo6.amplifyapp.com,http://localhost:3000 \
    ContactToEmail=contact@julesfoundation.com \
    ContactFromEmail=no-reply@julesfoundation.com
```

## Security Notes

- CORS is explicit in `template.yaml` and reflected in runtime headers only for configured origins.
- Request correlation IDs are accepted from `x-correlation-id` and returned in every response.
- Logs are structured JSON and include operation, environment, request IDs, and correlation ID.
- Unexpected errors are converted to a generic `INTERNAL_SERVER_ERROR` response.
- Contact IAM is limited to `ses:SendEmail` from the configured SES sender identity.
- Newsletter IAM is limited to `dynamodb:PutItem` on the generated newsletter table.
- The newsletter table uses on-demand billing and server-side encryption.
- Secrets, local env files, build outputs, coverage, and dependencies are ignored by git.

## Adding Endpoints

1. Add a Zod schema in `src/schemas` when the endpoint accepts input.
2. Add or extend a service in `src/services` for external side effects.
3. Add a thin handler in `src/handlers` using `withApiHandler`.
4. Add an `AWS::Serverless::Function` and `HttpApi` event in `template.yaml`.
5. Grant the smallest IAM action/resource set required by the service.
6. Add tests for schema validation, service success/failure, and handler response behavior.

## File Tree

```text
.
├── README.md
├── env.example
├── Makefile
├── package-lock.json
├── package.json
├── samconfig.toml
├── src
│   ├── config
│   │   └── env.ts
│   ├── handlers
│   │   ├── contact.ts
│   │   ├── health.ts
│   │   └── newsletter.ts
│   ├── schemas
│   │   ├── contact.ts
│   │   └── newsletter.ts
│   ├── services
│   │   ├── contactService.ts
│   │   └── newsletterService.ts
│   └── utils
│       ├── api.ts
│       ├── errors.ts
│       ├── logger.ts
│       └── validation.ts
├── template.yaml
├── tests
│   ├── config
│   │   └── env.test.ts
│   ├── handlers
│   │   ├── contact.test.ts
│   │   ├── health.test.ts
│   │   └── newsletter.test.ts
│   ├── helpers
│   │   └── aws.ts
│   ├── schemas
│   │   ├── contact.test.ts
│   │   └── newsletter.test.ts
│   ├── services
│   │   ├── contactService.test.ts
│   │   └── newsletterService.test.ts
│   └── utils
│       ├── api.test.ts
│       └── validation.test.ts
├── tsconfig.json
└── vitest.config.ts
```
