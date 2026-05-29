# Jules Foundation DNS

Domain: `julesfoundation.com`

Planned hostnames:

- Root website: `julesfoundation.com`
- Website alias: `www.julesfoundation.com`
- Backend API: `api.julesfoundation.com`

Domain registration is handled through Route 53 Domains. DNS should be hosted in Route 53.

ACM certificates should be created separately from the backend SAM stack. CloudFront certificates must be issued in `us-east-1`.

Backend SAM custom domain support should remain parameterized and optional so the backend can deploy without requiring DNS or certificate resources in every environment.
