# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

DIYGuide is a monorepo containing:
- **mobile/**: Expo/React Native mobile app with Expo Router
- **backend/**: Next.js web backend with App Router  
- **supabase/**: Database schema, migrations, and Edge Functions

## Development Commands

### Mobile (use npm from mobile/ directory):
```bash
cd mobile
npm i                   # Install dependencies
npm run start           # Start Expo dev client
npm run ios             # Run iOS simulator
npm run android         # Run Android emulator
npm run web             # Run web version
npm test                # Run Jest tests with watch mode
npm run supagenlocal    # Generate TypeScript types from local Supabase
npm run supafunc        # Serve Supabase functions locally
npm run publishprod     # Deploy OTA update to production channel
```

### Backend (use npm from backend/ directory):
```bash
cd backend
npm i                   # Install dependencies
npm run dev             # Start development server with Turbopack
npm run build           # Build for production
npm start               # Start production server
npm run lint            # Run ESLint
npm run lint:fix        # Run ESLint with auto-fix
npm run supagenlocal    # Generate TypeScript types to mobile/types/
```

### Supabase (from root directory):
```bash
supabase start          # Start local Supabase services
supabase stop           # Stop local services
supabase db reset       # Reset local database
supabase functions serve generate-guide --env-file ./supabase/.env.local
supabase functions serve openai --env-file ./supabase/.env.local
supabase functions deploy generate-guide --project-ref <ref>
```

## Architecture Overview

### Mobile App Structure
- **Routing**: Expo Router with file-based routing in `app/`
  - `app/(tabs)/`: Main tab navigation (home, categories, profile)
  - `app/(tabs)/home/`: Guide browsing, details, and AI generation
  - `app/(tabs)/profile/`: User profile, paywall, and settings
- **State Management**: Context-based providers in `utils/`
  - `SupabaseProvider`: Authentication, user profiles, token management
  - `RevenueProvider`: RevenueCat integration for token purchases
- **Components**: Reusable UI components in `components/` (Tailwind via NativeWind)
- **Types**: Generated Supabase types and custom types in `types/`

### Backend Structure
- **Next.js App Router**: Pages and API routes in `src/app/`
- **Supabase Integration**: SSR utilities in `src/utils/supabase/`
  - `server.ts`: Server-side client with cookie management
  - `middleware.ts`: Session refresh middleware
- **Styling**: Tailwind CSS configured in `tailwind.config.ts`

### Supabase Edge Functions
- **generate-guide**: AI-powered guide generation using OpenAI and Gemini
- **openai**: OpenAI API proxy and utilities
- Uses Zod schemas for type validation and AI SDK for structured responses

## Key Architectural Patterns

### Authentication Flow
1. **Mobile**: `SupabaseProvider` manages auth state with session persistence in AsyncStorage
2. **OAuth**: Apple Sign In with custom redirect handling via `expo-auth-session`
3. **Backend**: Session-based auth using Supabase SSR with cookie management
4. **Profile Management**: Automatic profile creation and token balance tracking

### Token Economy System
1. **Purchase**: RevenueCat handles in-app purchases for token packages (10 or 100 tokens)
2. **Usage**: Tokens consumed for AI guide generation via `removeToken()` in SupabaseProvider
3. **Balance**: Real-time token updates stored in Supabase `users` table

### AI Guide Generation
1. **Request**: Mobile app calls Supabase Edge Function with prompt
2. **Processing**: Function uses OpenAI for content generation, Gemini for images
3. **Storage**: Generated guides stored with session tracking for user association
4. **Rendering**: Step-by-step display with materials, tools, and generated images

## Package Management
- **Both mobile and backend use npm** - never use yarn in this repository
- **Dependencies**: Standard npm workflows with package-lock.json files

## Environment Configuration
- **Mobile**: `.env.local` (development), `.env.production` (production)
- **Backend**: `.env` (never commit)
- **Supabase**: `.env.local`, `.env.production`
- **EAS Build**: Environment variables defined per build profile in `eas.json`

### Critical Environment Variables
- `EXPO_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_REVENUE_CAT_IOS` / `EXPO_PUBLIC_REVENUE_CAT_ANDROID`
- `OPENAI_API_KEY`, `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (for Edge Functions)
- `ENABLE_IMAGE_GEN` (optional flag for image generation)

## Testing
- **Mobile**: Jest with jest-expo preset, React Testing Library patterns
- **Backend**: No test framework currently configured
- **Test Location**: Colocate tests as `*.test.ts(x)` or in `__tests__/` directories
- **Run Tests**: `cd mobile && npm test`

## Type Generation
Both mobile and backend can generate TypeScript types from Supabase schema:
- From mobile: `npm run supagenlocal` → generates `types/supabase.ts`
- From backend: `npm run supagenlocal` → generates `../mobile/types/supabase.ts`
- **Always regenerate types after schema changes**

## Build & Deployment
### EAS Build Profiles
- **simulator**: Local development with local Supabase
- **development**: Internal distribution with development environment
- **preview**: Internal testing with production Supabase
- **production**: App Store distribution

### Pre-build Setup
- `eas-build-pre-install` script enables Corepack for build environments
- Build profiles inject environment-specific variables

## Code Style & Conventions
- **TypeScript** throughout with strict type checking
- **2-space indentation** with Prettier formatting (`.prettierrc`)
- **Naming**: Components `PascalCase`, hooks/utils `camelCase`
- **File Structure**: Feature-based organization with co-located tests
- **Import Paths**: Use absolute imports with `@/` alias in mobile app
- **Routes**: Follow Expo Router and Next.js App Router conventions
