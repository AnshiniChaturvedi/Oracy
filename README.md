# frontend

Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS for ORACY.

**Status:** landing page, sign-in / sign-up / forgot-password, dashboard preview, and an interview setup page are built as a **front-end prototype**. Nothing talks to an AI or auth backend yet.

## Run

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run lint
npm run build && npm start
```

Optional: create `frontend/.env.local` with `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1` (this is also the default).

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/login`, `/signup`, `/forgot-password` | Auth screens (demo only). Old `/sign-in` and `/sign-up` redirect here. |
| `/dashboard` | Dashboard preview (needs the demo session) |
| `/interview` | Interview setup (validated locally, nothing uploaded) |

## What is real and what is not

- **Demo auth:** `src/services/auth.ts` stores only name + email in `localStorage`. Any valid email signs in. No password is stored or checked.
- **Demo data:** all scores, charts, and history come from `src/lib/demo-data.ts` and are labelled illustrative.
- **Imagery:** an original SVG illustration (`src/components/Portrait.tsx`) stands in for photography. To use licensed photos, add them to `public/images/` and set `photography.enabled` in `src/lib/site.ts`.

## Backend integration points

Backend currently exposes only `GET /api/v1/health`. Needed:

- Auth: `POST /auth/login`, `/auth/register`, `/auth/password-reset`, `/auth/logout`, `GET /auth/me` (replace bodies in `src/services/auth.ts`).
- Interview: `POST /resumes`, `POST /sessions`, `POST /sessions/{id}/answers`, `GET /jobs/{id}`.
- Results: `GET /sessions/{id}/readiness`, `/feedback`, `GET /dashboard/summary`, `/dashboard/sessions` (replace `demo-data.ts` usage in the dashboard and landing previews).

See `../docs/API_DESIGN.md`.

## Design tokens

Future Minimal palette: `paper` #F7F9FC, `ink` #151C2C, `line` #E5EBF4, `card` #FFFFFF, `cobalt` #285FE8 (plus `cobalt-deep`, `cobalt-tint`, `mute`);, fonts (Instrument Serif, Inter, JetBrains Mono via `next/font/google`) and type scale are defined in `tailwind.config.ts`. Motion lives in `src/styles/globals.css` and respects `prefers-reduced-motion`.
