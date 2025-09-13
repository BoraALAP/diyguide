# Repository Guidelines

## Overview & Capabilities
- DIYGuide is a monorepo with a mobile app (Expo/React Native) and a web backend (Next.js). Core capabilities:
  - Browse curated DIY guides by category and view guide details.
  - Authenticate with Supabase (email/3rd-party where configured) and manage a profile.
  - Paywall/subscription support via RevenueCat (purchase and entitlement checks).
  - Typed Supabase client usage across the stack, with generated TypeScript types.

## Architecture
- Mobile (`mobile/`): Expo Router structure in `app/` with tabs for `home`, `categories`, and `profile`. UI in `components/`, state/providers in `utils/` (`SupabaseProvider.tsx`, `RevenueProvider.tsx`), types in `types/`, assets in `assets/`.
- Backend (`backend/`): Next.js (App Router) under `src/app`. Tailwind CSS in `src/app/globals.css`. Supabase SSR helpers in `src/utils/supabase/`.
- Configuration: `mobile/app.config.ts`, `backend/next.config.ts`.
- Environment: `mobile/.env.local`, `mobile/.env.production`, `backend/.env` (never commit secrets).

## Key Flows
- Onboarding/Auth: App initializes providers, checks session (Supabase); unauthenticated users are prompted to sign in (Apple/email where enabled).
- Guide Browsing: `home` and `categories` routes query Supabase via `mobile/lib/supabaseClient.ts`; cards navigate to detail screens.
- Subscription: `PurchaseButton` + `RevenueProvider` trigger RevenueCat purchase, then entitlement gates access (e.g., `profile/paywall.tsx`).
- Profile: Edit profile data under `app/(tabs)/profile/`; persisted via Supabase.

## Build, Test, and Development
- Mobile (use Yarn):
  - `cd mobile && yarn` – install deps; `yarn start` – Expo dev client.
  - Targets: `yarn ios` / `yarn android` / `yarn web`.
  - Tests: `yarn test` (jest-expo). Types: `yarn supagenlocal` → `types/supabase.ts`.
  - OTA update: `yarn publishprod` (EAS Update to production channel).
- Backend (use npm):
  - `cd backend && npm i` – install; `npm run dev` – dev server.
  - `npm run build && npm start` – production build/serve; `npm run lint` – ESLint.

## Coding Style & Tests
- TypeScript; 2-space indentation; Prettier formatting (`.prettierrc`).
- Naming: Components `PascalCase` (e.g., `GuideCard.tsx`); hooks/utils `camelCase`; routes follow Expo/Next conventions.
- Tests (mobile): `*.test.ts(x)` beside source or in `__tests__/`; prefer RTL patterns and deterministic tests. Backend tests not configured—add per feature if needed.

## Local Dev & Release Workflow
- Local: set env files, install per package, start services (mobile and/or backend).
- Before PR: run tests, lint backend, verify purchase flow in sandbox, and refresh Supabase types if schema changed.
- Release: use EAS Update for OTA mobile updates; deploy backend build to a Next.js-compatible host.

## Security & Configuration
- Keep API keys and service secrets in env files only; rotate if leaked.
- Supabase: mobile client in `mobile/lib/supabaseClient.ts`, SSR in `backend/src/utils/supabase/`.
- Package managers: Yarn in `mobile/`, npm in `backend/`—do not mix.

## Commit & Pull Request Guidelines
- Commits: imperative mood with optional scope, e.g., `mobile: fix purchase button`, `backend: add auth middleware`.
- PRs: clear summary, linked issues (`Closes #123`), screenshots for UI changes, steps to test, and any env/config notes.
