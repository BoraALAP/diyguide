# Components

Documentation for the reusable UI building blocks under `@/components`. Each entry outlines what the component does, recommended usage patterns, and where it currently appears in the app.

## Auth
- **What it does:** Full authentication surface that supports password sign-in/sign-up, Supabase magic links, GitHub OAuth, and Apple Sign In. Handles Supabase session refresh and deep-linked sessions.
- **When to use:** Drop in anywhere you need a complete auth flow with minimal setup.
- **Used in:** `mobile/app/(tabs)/profile/index.tsx:93` to gate the profile tab when the user is signed out.

## Button
- **What it does:** Theme-aware pressable with built-in variants (primary, secondary, tertiary, destructive), size presets, loading state, and typography alignment.
- **When to use:** Default call-to-action across the app, for both standalone buttons and inline actions (e.g., generate actions).
- **Used in:** `mobile/app/(tabs)/profile/paywall.tsx:61` for token purchases, and within other components like `Auth` and `SearchField`.

## Card
- **What it does:** Rounded container that adapts to the active color scheme and provides consistent padding/gap for grouped content.
- **When to use:** To wrap lists or bodies of related information to visually separate them from the background.
- **Used in:** `mobile/app/(tabs)/categories/index.tsx:96` and `mobile/app/(tabs)/categories/[id]/index.tsx:84` to frame category and guide lists.

## CategoryBadge
- **What it does:** Compact pill with a color indicator and category name, respecting the theme palette.
- **When to use:** To tag guides or any entity with a category highlight; ideal inside cards, chips, or metadata rows.
- **Used in:** Not yet referenced in screens, ready for guide detail chips where a static badge is needed.

## CategoryItem
- **What it does:** Pressable row representing a single category, showing a colored indicator and title with feedback on press.
- **When to use:** For category pickers or lists that navigate to category detail pages.
- **Used in:** `mobile/app/(tabs)/categories/index.tsx:113` for the main category directory.

## GuideItem
- **What it does:** Displays a guide name, up to three tags (or legacy single category), and step count with responsive layout.
- **When to use:** In guide carousels or lists where you need rich metadata and tag chips.
- **Used in:** `mobile/components/GuideSection.tsx:41`, which renders the home “Latest Guides” list.

## GuideListItem
- **What it does:** Minimal list row for guides, focusing on title and step count with press feedback.
- **When to use:** When you need a denser guide list without tag chips, such as category-specific screens.
- **Used in:** `mobile/app/(tabs)/categories/[id]/index.tsx:96` for the list of guides under a selected category.

## GuideSection
- **What it does:** Section wrapper that renders a `PageTitle` and a `Card` full of `GuideItem` instances, wiring up `onGuidePress` callbacks.
- **When to use:** To compose home-page style sections of guides with consistent spacing and typography.
- **Used in:** `mobile/app/(tabs)/home/index.tsx:156` to surface the latest generated guides.

## Input
- **What it does:** Labeled text input with validation/error messaging, disabled state formatting, and focus styling governed by theme colors.
- **When to use:** Whenever a screen needs user text input with consistent Supabase-native styling and helper text support.
- **Used in:** `mobile/app/(tabs)/profile/index.tsx:126` for editable profile fields and throughout `Auth`.

## Loading
- **What it does:** Centered fullscreen spinner using NativeWind utility classes for quick loading placeholders.
- **When to use:** As a drop-in fallback while data fetches or suspense boundaries resolve.
- **Used in:** Multiple loading gates including `mobile/app/(tabs)/home/index.tsx:110`, `mobile/app/(tabs)/categories/index.tsx:87`, `mobile/app/(tabs)/categories/[id]/index.tsx:83`, and `mobile/app/[guide]/guide.tsx:75`.

## MenuButton
- **What it does:** Row-style action with optional Ionicon, variant styling (default/destructive), and disabled handling.
- **When to use:** For contextual menus or settings rows that trigger actions without heavy visual weight.
- **Used in:** `mobile/app/(tabs)/profile/index.tsx:189` for logout and account deletion controls.

## PageTitle
- **What it does:** Consistent page header that renders a Literata-based title and supporting description with theme-aware colors.
- **When to use:** To introduce new sections or screens where you need aligned typography for headings.
- **Used in:** `mobile/app/(tabs)/categories/index.tsx:108` and all `GuideSection` headers.

## ProfileEditActions
- **What it does:** Convenience wrapper that pairs Save and Cancel buttons aligned to the right, matching profile form spacing.
- **When to use:** In edit flows beneath form fields to handle confirmation/cancel without reimplementing button layout.
- **Used in:** `mobile/app/(tabs)/profile/index.tsx:145` when profile editing mode is active.

## ProfileHeader
- **What it does:** Hero banner for the profile tab, rendering avatar, name, token count, and a purchase button.
- **When to use:** Wherever you need to present primary user identity info with a call-to-action (e.g., tokens or upgrades).
- **Used in:** `mobile/app/(tabs)/profile/index.tsx:107` at the top of the profile screen.

## ProfileSection
- **What it does:** Section container for profile content with optional border, header actions, and spacing for children.
- **When to use:** To break profile pages into logical sections while keeping edit actions aligned with headings.
- **Used in:** `mobile/app/(tabs)/profile/index.tsx:115` for profile details (and prepared for purchases/history blocks).

## PurchaseItem
- **What it does:** Pressable row summarizing a past token purchase with date, token quantity, and price.
- **When to use:** For purchase history or receipts lists where tapping could open invoices or details.
- **Used in:** Sampled within `mobile/app/(tabs)/profile/index.tsx:160` (currently commented out) for purchase history listings.

## SearchField
- **What it does:** Search input with built-in search icon, focus detection, and an optional generate button that appears when active.
- **When to use:** For search bars that may kick off generation flows or filter lists after text entry.
- **Used in:** Ready for search surfaces; integrate into tabs like Home when search is enabled.

## Typography
- **What it does:** Centralized text component that maps Figma typography tokens to React Native styles, handling font family loading, weights, and italic variants.
- **When to use:** Prefer over bare `Text` to ensure consistent typography and automatic defaults per variant.
- **Used in:** Nearly every component (e.g., `Button`, `GuideItem`, `ProfileHeader`), making it the foundation of the design system.

## Hooks & Utilities

### useClientOnlyValue / useClientOnlyValue.web
- **What they do:** Provide platform-aware helpers to defer values until after the client mounts, preventing hydration mismatches in Expo Router web builds.
- **When to use:** When a value should differ between server and client render passes (e.g., referencing `window`).

### useColorScheme / useColorScheme.web
- **What they do:** Light abstraction around the platform color scheme hook, with a web fallback to a stable `light` value to avoid SSR flash.
- **When to use:** Any time a component needs to resolve theme colors in a cross-platform-safe way (already imported across all themable components).

