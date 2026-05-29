# Jules Foundation

This is the Jules Foundation monorepo for the full website and supporting infrastructure. The production domain is `julesfoundation.com`.

## Structure

```text
apps/
  web/              Public frontend website
services/
  backend/          AWS SAM backend for public website APIs
assets/
  images/           Shared brand assets
infra/
  dns/              Domain, Route 53, ACM, and DNS notes
```

## Workspaces

- `services/backend` contains the production AWS SAM backend using TypeScript, Lambda, API Gateway, SES, and DynamoDB.
- `apps/web` contains the public Jules Foundation frontend website.
- `assets/images` contains shared brand assets, including the Jules Foundation logo.
- `infra/dns` contains notes for domain registration, Route 53 hosted zones, ACM certificates, and DNS planning.

## Root Commands

The repo root is a small npm workspace command hub:

```bash
npm install
npm test
npm run build
npm run sam:validate
npm run sam:validate:lint
npm run sam:build
```

## Amplify Hosting

The frontend is configured for AWS Amplify Hosting with the root [amplify.yml](./amplify.yml) file. The deployed app root is:

```text
apps/web
```

For an existing Amplify app, set this environment variable in the Amplify console if branch deployments do not automatically detect the monorepo app root:

```text
AMPLIFY_MONOREPO_APP_ROOT=apps/web
```

The Amplify app ID for this project is `d1jgyq9fz4ajo6`.

SAM files live in `services/backend`, so direct SAM commands from the root must point to that template:

```bash
sam validate --template-file services/backend/template.yaml --lint
sam build --template-file services/backend/template.yaml
```

Frontend commands should be run from `apps/web`:

```bash
cd apps/web
npm install
npm run dev
npm run build
```

Backend commands should be run from `services/backend`:

```bash
cd services/backend
npm install
npm test
npm run build
sam validate
sam build
```
