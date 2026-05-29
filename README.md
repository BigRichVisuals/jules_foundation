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
