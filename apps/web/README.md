# Jules Foundation Web

Public frontend website for `julesfoundation.com`.

## Commands

```bash
npm install
npm run dev
npm run build
```

The current site is a polished static React/Vite experience with Home, About Us, and Contact sections. The Donate button is intentionally a placeholder and does not process payments.

## Contact Form

The contact form posts to:

```text
${VITE_API_BASE_URL}/contact
```

Set `VITE_API_BASE_URL` in Amplify after the backend API is deployed. Until then, the form displays a short unavailable message and does not show fake email or phone details.
