# MediaBrowse - Group 6 Consumer App (Sprint 6)

Next.js 15 consumer front end for TCSS 460. This app signs in through Auth2 (NextAuth) and reads movies and TV shows from our **upstream partner, Group 5**.

## Upstream partner (Group 5)

| Item | Value |
| --- | --- |
| **API base URL** | https://tcss460-group-5-api.onrender.com |
| **OpenAPI (Swagger UI)** | https://tcss460-group-5-api.onrender.com/api-docs |
| **OpenAPI JSON** | https://tcss460-group-5-api.onrender.com/openapi.json |
| **Bug Tracker FE** | https://group-project-bug-tracker-front-end-one.vercel.app/ |
| **JWT audience (aud)** | `group-5-api` |
| **Partner README** | https://github.com/UWT-TCSS460-SP26/group-project-backend-group-5/blob/main/README.md |

A copy of Group 5 OpenAPI spec is in [api-1.yaml](./api-1.yaml).

File bugs against Group 5 contract through their Bug Tracker FE (not Slack) when their API misbehaves.

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000.

### Required environment variables

| Variable | Purpose |
| --- | --- |
| `AUTH_SECRET` | Signs the NextAuth session cookie |
| `AUTH_URL` | Public origin of this app (e.g. `http://localhost:3000`) |
| `AUTH_TCSS460_CLIENT_ID` | Consumer client ID from the instructor |
| `AUTH_TCSS460_CLIENT_SECRET` | Consumer client secret |
| `AUTH_TCSS460_AUDIENCE` | `group-5-api` (must match partner API) |
| `NEXT_PUBLIC_API_BASE_URL` | `https://tcss460-group-5-api.onrender.com` |

Optional: `NEXT_PUBLIC_AUTH_ISSUER`, `NEXT_PUBLIC_AUTH_AUDIENCE`.

## Auth2 / JWT verification (one-time)

After signing in:

1. Open **Profile** (`/profile`).
2. Copy the **access token** shown on the page.
3. Paste it into [jwt.io](https://jwt.io).
4. Confirm `iss` is `https://tcss-460-iam.onrender.com` and `aud` is exactly `group-5-api`.

## App routes (Sprint 6)

| Route | Description |
| --- | --- |
| `/` | Home |
| `/browse` | Popular or discover with filters |
| `/search` | Text search |
| `/movie/[id]` | Movie detail |
| `/tv/[id]` | TV detail |
| `/profile` | Email and access token for jwt.io |

## Browse filters

Uses `GET /v1/movies` and `GET /v1/tv` when filters are set; otherwise popular endpoints. Media type, language, genre, date range, and min/max runtime map to Group 5 OpenAPI query parameters.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

## Team

Group 6 - TCSS 460 Spring 2026 consumer app repository.
