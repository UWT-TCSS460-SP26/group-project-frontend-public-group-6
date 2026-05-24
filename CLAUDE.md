# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build
npm run lint     # ESLint via Next.js
```

There are no tests configured yet.

## Architecture

This is a **Next.js 15 App Router** project (TypeScript, React 19) for the TCSS 460 client-server course project.

### Auth

Authentication uses **NextAuth v5 (beta)** with a custom OIDC provider backed by `https://tcss-460-iam.onrender.com`.

- `auth.ts` — root NextAuth config; exports `{ handlers, signIn, signOut, auth }`
- `app/api/auth/[...nextauth]/route.ts` — mounts the NextAuth `GET`/`POST` handlers
- The JWT callback stores `access_token` and `id_token` on the token; the session callback surfaces `access_token` on the session object for use in API calls to the backend

Required environment variables:
```
AUTH_CLIENT_ID
AUTH_CLIENT_SECRET
AUTH_TCSS460_AUDIENCE
AUTH_SECRET          # NextAuth session secret
```

### Path aliases

`@/*` maps to the project root (e.g., `import { auth } from "@/auth"`).

### Key conventions

- App Router only — all pages/layouts live under `app/`
- No `src/` directory; source files sit at the repo root alongside config
