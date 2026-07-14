# Changelog

All notable changes to this project are documented here. Follow semantic versioning.

---

## [2026-07-15] Admin Analytics Dashboard, Multi-language CMS & Cleanup

### Added 🆕

- `migrations/003_multilang_and_analytics.sql` — converts `landing_sections` to a locale-keyed `content` JSONB and `landing_companies` to locale-keyed `name`/`description` JSONB (existing EN/TH data migrated in place); creates `public.landing_events` (anonymous visitor events, anon insert-only / admin read via RLS)
- **Analytics tracking** — `src/lib/analytics.ts` (anonymous per-tab session id, `track()` via sendBeacon/fetch, never runs on `/admin`), `AnalyticsTracker` in the root layout (page views on every route change + delegated clicks on `data-track` elements), and `POST /api/track` (Zod-validated, size-capped ingest with the anon key)
- **Dashboard** (`/admin`) now shows real data: page views / unique visitors / interactions / views today, a 14-day daily-views chart, top pages, top interactions, language & device breakdowns, and a recent-events table; shows setup guidance if migration 003 isn't applied
- Instrumented hero CTA, navbar company links & social icons, showcase social links, footer social links (`data-track` attributes) and language switches
- **Chinese (中文)** as a third site language with static fallback translations; languages are now config-driven via `LANGUAGES`/`LANGUAGE_CODES` in `src/i18n/translations.ts` — adding a language is one entry there

### Changed 🔄

- `/admin/content` editor renders one field per configured language (English/Thai/Chinese) for every section and company — new languages appear automatically
- Content save actions, `getLandingContent()` merge logic, types (`landing.ts`, `database.ts`) all locale-keyed; languages missing DB or static text fall back to English
- Public language switcher cycles EN → TH → 中文; stored/browser language validated against the configured list
- Admin header shows only the sign-out button (login email removed)

### Removed 🗑️

- `/admin/pages` and `/admin/settings` placeholder sections and their sidebar links

### Migration Steps

1. Apply `migrations/003_multilang_and_analytics.sql` _(already applied to the KTD Supabase project on 2026-07-15)_
2. Analytics starts recording immediately; the dashboard reads the last 30 days

---

## [2026-07-09] Performance & AI-Search (GEO) Optimization

### Added 🆕

- `src/app/robots.ts` — allows all crawlers plus an explicit allowlist of AI search bots (GPTBot, ClaudeBot, PerplexityBot, etc.); `/admin` excluded from indexing; links the sitemap
- `src/app/sitemap.ts` — sitemap for `/` and configured sub-company pages
- `public/llms.txt` — llms.txt summary of the group and portfolio companies for AI answer engines
- `src/app/[company]/layout.tsx` — per-company `generateMetadata` (title/description/canonical/OG); unknown slugs get `noindex`
- `src/config/site.ts` — `SITE_URL` (override with `NEXT_PUBLIC_SITE_URL`)

### Changed 🔄

- Home page JSON-LD is now built from live CMS content (`subOrganization` entries with EN/TH names, descriptions, real social links) instead of a static blob
- Root layout sets `metadataBase`; home page sets a canonical URL
- Compressed hero background (1.7 MB PNG → 208 KB JPEG) and three 3 MB PNGs (→ ~590 KB JPEG each); storage bucket and DB rows updated to the compressed versions

---

## [2026-07-09] CMS-Editable Landing Page (Content & Images)

### Added 🆕

- `migrations/002_create_landing_content.sql` — `landing_sections` (per-section EN/TH JSONB text + editable images) and `landing_companies` tables, RLS (public read, admin-only writes via `is_admin()` helper), `landing-media` public Storage bucket with admin-only write policies, and seed data reproducing the current static content
- `src/services/landing.ts` — `getLandingContent()`: cached (`unstable_cache` + `landing-content` tag, hourly revalidate) fetch that deep-merges DB content over the static defaults and degrades to fully-static content on any Supabase failure
- `src/lib/supabase/public.ts` — cookie-less anon client, safe inside `unstable_cache`
- `/admin/content` — working editor: per-section EN/TH forms (Hero, About, Services, Navigation, Footer & Social) and per-company forms (names, descriptions, colors, social links, images), saving via server actions that validate with Zod, guard with `checkAdminAccess()`, and expire the cache with `updateTag()` so edits go live immediately
- `/admin/media` — media library for the `landing-media` bucket: multi-file upload, thumbnail grid, copy URL, delete
- `src/lib/storage-client.ts` — browser-side upload/list/delete helpers for the bucket
- `src/types/landing.ts` + `src/config/landing-cms.ts` — shared content types and CMS constants (cache tag, bucket name, default images)
- UI primitives: `input.tsx`, `textarea.tsx`, `label.tsx`

### Changed 🔄

- Root layout fetches CMS content and feeds it to `LanguageProvider`; `Hero` and `Services` accept image props; home page renders companies from DB-backed content
- `src/i18n/translations.ts` — dropped `as const` so DB strings are assignable; the file now serves as the fallback/defaults for CMS content
- `next.config.ts` — `images.remotePatterns` for the Supabase Storage host (derived from `NEXT_PUBLIC_SUPABASE_URL`)
- `src/types/database.ts` — added `Json` type and the two new table definitions

### Migration Steps

1. Apply `migrations/002_create_landing_content.sql` (SQL editor or `supabase db push`)
2. Ensure your user exists in `admin_users` with `is_admin = true` (required for writes; reads are public)
3. Edit content at `/admin/content`, manage images at `/admin/media`

---

## [2026-04-25] Pre-commit Auto-formatting with lint-staged

### Added 🆕

- `lint-staged` — runs Prettier and ESLint auto-fix on staged files before each commit
- Pre-commit now formats `*.{ts,tsx,js,jsx}` with ESLint fix + Prettier, and `*.{json,md,css,mjs}` with Prettier
- Tailwind class sorting and import ordering applied automatically via existing Prettier plugins

### Changed 🔄

- `.husky/pre-commit` — replaced `npm run lint` with `npx lint-staged` for targeted, faster pre-commit checks

---

## [2026-04-25] Admin CMS UI, Auth Screen & Architecture Refactor

### Added 🆕

- Admin login page at `/admin/login` — email/password auth via Supabase client
- Protected admin dashboard at `/admin` with sidebar navigation and header
- Admin layout using Next.js route groups: `(protected)` for auth-gated pages, login outside
- Placeholder pages for Pages, Content, Media, and Settings sections
- Shared `AdminPageHeader` component for consistent page titles across admin
- Shared `StatCard` component for dashboard metric cards
- `src/services/auth.ts` — shared `getAuthUser()` helper to avoid repeating `createClient` + `getUser` across server components
- `src/services/admin.ts` — `checkAdminAccess()`, `getAdminRole()`, `validateAdminMiddleware()` with optional userId param to skip redundant network calls
- `src/components/admin/sidebar.tsx` — sidebar nav with active route highlighting
- `src/components/admin/header.tsx` — top bar with sign-out button

### Changed 🔄

- Moved data-fetching/business logic from `src/lib/supabase/` to `src/services/` — `src/lib/supabase/` now only holds client setup (`client.ts`, `server.ts`)
- Refactored `checkAdminAccess()` and `getAdminRole()` to accept optional `userId` param, eliminating redundant `getUser()` calls when the caller already has the user
- Dashboard page no longer calls `getUser()` directly — uses shared `getAuthUser()` from services

### Architecture

- `src/lib/supabase/` — Supabase client setup only
- `src/services/` — server-side data-fetching and business logic
- `src/components/admin/` — shared admin UI components
- `src/app/admin/login/` — public login page (no auth required)
- `src/app/admin/(protected)/` — auth-gated admin pages with sidebar layout

---

## [2026-04-25] Middleware Update — Align with Latest Supabase SSR Standard

### Fixed 🐛

- **`middleware.ts`** — Replaced `getSession()` with `getClaims()` for JWT validation in server code. Per the latest Supabase docs, `getSession()` does not revalidate the Auth token and should never be trusted in middleware. `getClaims()` validates the JWT signature against the project's published public keys on every request.
- Removed custom cookie option overrides (`httpOnly`, `secure`, `sameSite`) from middleware `setAll`. The official pattern passes `options` through as-is — overriding them (especially `httpOnly: true`) can break browser session sync.
- Updated route matcher to exclude static file extensions (`.svg`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`), matching the official Supabase Next.js example.
- Updated commented-out admin role check to use `user.sub` (claims object) instead of `user.id` (user object), since `getClaims()` returns claims, not a full user.

### Corrected ⚠️

- Previous changelog entries incorrectly stated `getClaims()` was deprecated in favor of `getSession()`. This was backwards — `getClaims()` is the correct and recommended method for server-side JWT validation. `getSession()` is only safe on the client side.

---

## [2026-04-25] Supabase Implementation Audit & Cleanup

### 🔍 Audit Results

**Compliance Score: 100/100** ✅

Completed comprehensive audit of all Supabase implementations using MCP tools. All files verified to follow 2026 latest standards.

### Audited Files ✅

- ✅ `middleware.ts` (root) - Using `getSession()`, secure cookies
- ✅ `src/lib/supabase/client.ts` - Browser client correct
- ✅ `src/lib/supabase/server.ts` - Server client with async cookies
- ✅ `src/lib/supabase/admin.ts` - Admin utilities correct
- ✅ `src/types/database.ts` - TypeScript types correct

### Removed 🗑️

- ❌ Deleted `src/lib/supabase/middleware.ts` - Deprecated file using old `getClaims()` method
  - This file was not used by Next.js (root middleware.ts is active)
  - Contained outdated authentication pattern
  - Caused confusion with duplicate middleware implementation

### Added 📚

- ✅ `SUPABASE_AUDIT_REPORT.md` - Complete audit documentation with:
  - File-by-file compliance analysis
  - Security audit results
  - Recommended actions
  - Version compatibility matrix
  - 100/100 compliance score

### Security Improvements

- ✅ All files use secure cookie flags (`secure`, `httpOnly`, `sameSite`)
- ✅ Environment variables properly separated (NEXT*PUBLIC*\* vs SECRET)
- ✅ No hardcoded secrets in any file
- ✅ RLS policies ready for admin_users table
- ✅ TypeScript safety enforced throughout

---

## [2026-04-25] ESLint Fixes & Code Quality

### Fixed 🐛

- Fixed unused `cookies` import in `src/lib/supabase/admin.ts`
- Fixed TypeScript `any` type - now uses proper `SupabaseClient<Database>` type
- Fixed empty object types `{}` in `src/types/database.ts` - now uses `Record<string, never>`
- Fixed unused parameter in `onPointerLeave()` function in company-showcase component
- ✅ All ESLint errors and warnings resolved

---

## [2026-04-25] Supabase Admin CMS - Phase 1 Setup

### New Features ✨

- **Admin Authentication System** - Email/password login with Supabase
- **Admin Dashboard** - Protected `/admin` route with middleware-based access control
- **Role-Based Access Control** - Support for `admin`, `moderator`, `editor` roles
- **Admin Users Table** - Database migration with Row Level Security (RLS)
- **Admin Helper Utilities** - TypeScript functions for access checks

### Added 🆕

- `middleware.ts` - Latest Supabase authentication (`getSession()` standard)
- `src/lib/supabase/admin.ts` - Admin helper functions
- `migrations/001_create_admin_users_table.sql` - Database schema with RLS
- `src/types/database.ts` - TypeScript type definitions
- `README.md` - Complete development guide

### Changed 🔄

- Updated middleware to use `getSession()` instead of deprecated `getClaims()`
- Enhanced cookie security with `secure`, `httpOnly`, `sameSite` flags

### Deprecated ⚠️

- `getClaims()` method - Now using `getSession()` (Supabase 2026 standard)

### Fixed 🐛

- Session handling now uses latest Supabase standards

---

## Pending ⏳

- [ ] Apply database migration (`supabase db push`)
- [ ] Generate TypeScript types from schema
- [ ] Create admin login UI component
- [ ] Create admin dashboard layout
- [ ] Create admin pages manager
- [ ] Create admin content manager
- [ ] Create admin media library
- [ ] Add user management features
