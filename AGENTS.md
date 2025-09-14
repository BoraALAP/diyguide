# Repository Guidelines

This guide helps contributors work efficiently across mobile, backend, and Supabase code in this monorepo.

## Project Structure & Module Organization
- `mobile/` (Expo/React Native)
  - Routes in `app/` (`(tabs)/home`, `categories`, `profile`)
  - UI in `components/`, providers in `utils/`, types in `types/`, assets in `assets/`
- `backend/` (Next.js App Router)
  - App in `src/app`, styles in `src/app/globals.css`, Supabase SSR utils in `src/utils/supabase/`
- `supabase/`
  - Edge Functions in `functions/`, SQL in `migrations/`, local env in `.env.local`, optional `config.toml`
- Tests: colocate in `*.test.ts(x)` or `__tests__/` under `mobile/`.

## Build, Test, and Development Commands
- Mobile (npm only)
  - `cd mobile && npm i` — install deps
  - `npm run start` — Expo dev server
  - `npm run ios` / `npm run android` — run on simulator/device
  - `npm test` — run Jest (jest-expo)
  - `npm run supagenlocal` — generate `types/supabase.ts`
- Backend (npm only)
  - `cd backend && npm i && npm run dev` — local dev
  - `npm run build && npm start` — prod build/start
  - `npm run lint` — lint
- Supabase local
  - `supabase start` — start services
  - `supabase db reset` — recreate tables
  - Serve function: from repo root `supabase functions serve openai --env-file ./supabase/.env.local`
  - Deploy: `supabase functions deploy openai --project-ref <ref>` then set secrets

## Coding Style & Naming Conventions
- TypeScript everywhere; 2-space indent; Prettier configured via `.prettierrc`.
- Components `PascalCase` (e.g., `GuideCard.tsx`); hooks/utils `camelCase`.
- Routes follow Expo/Next conventions.
- Mobile styling: Tailwind via NativeWind (`className` on RN components). Config at `mobile/tailwind.config.js`; Babel plugin in `mobile/babel.config.js`.

## Testing Guidelines
- Mobile: React Testing Library patterns; deterministic tests; colocate as `*.test.ts(x)` or `__tests__/`.
- Backend: tests not preconfigured—add per feature as needed.
- Run with `cd mobile && npm test`.

## Security & Configuration Tips
- Do not commit secrets. Use env files:
  - `mobile/.env.local`, `mobile/.env.production`, `backend/.env`, `supabase/.env.local`
- Keys: `OPENAI_API_KEY`, `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, optional `ENABLE_IMAGE_GEN`.
- For local images, set `PUBLIC_SUPABASE_URL` to LAN URL (e.g., `http://192.168.x.x:54321`).

## Commit & Pull Request Guidelines
- Commits: imperative with optional scope, e.g., `mobile: add guide card`, `backend: fix auth redirect`.
- PRs: describe changes, link issues (`Closes #123`), include screenshots for UI, steps to test, and any env/config notes.
- Before opening: run tests and lint; ensure commands above succeed.
