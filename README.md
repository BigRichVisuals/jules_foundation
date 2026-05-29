# Jules Foundation

This is the Jules Foundation monorepo for the full website and supporting infrastructure. The production domain is `julesfoundation.com`.

## Structure

```text
apps/
  web/              Reserved for the future frontend website
services/
  backend/          AWS SAM backend for public website APIs
assets/
  images/           Shared brand assets
infra/
  dns/              Domain, Route 53, ACM, and DNS notes
```

## Workspaces

- `services/backend` contains the production AWS SAM backend using TypeScript, Lambda, API Gateway, SES, and DynamoDB.
- `apps/web` is reserved for the future Jules Foundation frontend website.
- `assets/images` contains shared brand assets, including the Jules Foundation logo.
- `infra/dns` contains notes for domain registration, Route 53 hosted zones, ACM certificates, and DNS planning.

Backend commands should be run from `services/backend`:

```bash
cd services/backend
npm install
npm test
npm run build
sam validate
sam build
```
