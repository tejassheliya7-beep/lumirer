# Lumière — Bug Fixes Applied

## How to build & deploy

1. Run: `npm install`
2. Run: `npm run build`
3. Drag the `dist/` folder to Netlify → lumirerjewel → Deploys

## What was fixed

### Security (Critical)
- **AdminAuth.tsx** — Hardcoded password removed. Now reads from `VITE_ADMIN_PASSWORD` environment variable (already set in Netlify)
- **AdminAuth.tsx** — Added 1-hour session timeout with auto-logout
- **AdminAuth.tsx** — Added visible Logout button in admin panel
- **.env** — Exposed OpenAI API key removed (now stored safely in Netlify env vars)
- **robots.txt** — Admin panel blocked from search engine indexing

### Routing & UX
- **netlify.toml** — Added SPA redirect (fixes page refresh 404s) + security headers
- **NotFound.tsx** — Branded 404 page with navigation back to store and collections

### SEO
- **index.html** — Added full meta tags: description, keywords, Open Graph, Twitter Card, canonical URL

## Environment variables (already set in Netlify)
- `VITE_ADMIN_PASSWORD` = your admin password ✅
- `VITE_OPENAI_API_KEY` = your OpenAI key ✅

## URGENT
Revoke your old OpenAI key at https://platform.openai.com/api-keys
It was exposed in your project ZIP file.
