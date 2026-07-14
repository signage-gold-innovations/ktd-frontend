/**
 * Supabase Migration: Multi-language CMS content + Landing analytics
 *
 * 1. landing_sections   — replace content_en/content_th with one locale-keyed
 *                         `content` JSONB: {"en": {...}, "th": {...}, "zh": {...}}
 * 2. landing_companies  — replace name_en/name_th/description_en/description_th
 *                         with locale-keyed `name` and `description` JSONB
 * 3. landing_events     — anonymous interaction tracking for the public site,
 *                         powering the /admin dashboard
 *
 * Language codes are defined in src/i18n/translations.ts (LANGUAGE_CODES).
 * Languages missing from the JSONB fall back to the static defaults in code,
 * so existing EN/TH rows keep working and new languages need no backfill.
 *
 * Row shapes must stay in sync with LandingSectionRow / LandingCompanyRow in
 * src/types/landing.ts and the tables in src/types/database.ts.
 *
 * Run in the Supabase SQL Editor or via the Management API.
 */

-- ---------------------------------------------------------------------------
-- 1. landing_sections → locale-keyed content
-- ---------------------------------------------------------------------------
ALTER TABLE public.landing_sections
  ADD COLUMN IF NOT EXISTS content JSONB NOT NULL DEFAULT '{}'::jsonb;

UPDATE public.landing_sections
SET content = jsonb_build_object(
  'en', COALESCE(content_en, '{}'::jsonb),
  'th', COALESCE(content_th, '{}'::jsonb)
)
WHERE content = '{}'::jsonb;

ALTER TABLE public.landing_sections
  DROP COLUMN IF EXISTS content_en,
  DROP COLUMN IF EXISTS content_th;

COMMENT ON COLUMN public.landing_sections.content IS 'Section text keyed by language code, e.g. {"en": {...}, "th": {...}, "zh": {...}} — flat string maps matching the section shape in src/i18n/translations.ts. Missing languages fall back to static defaults in code.';

-- ---------------------------------------------------------------------------
-- 2. landing_companies → locale-keyed name/description
-- ---------------------------------------------------------------------------
ALTER TABLE public.landing_companies
  ADD COLUMN IF NOT EXISTS name JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS description JSONB NOT NULL DEFAULT '{}'::jsonb;

UPDATE public.landing_companies
SET name = jsonb_build_object('en', name_en, 'th', name_th),
    description = jsonb_build_object('en', description_en, 'th', description_th)
WHERE name = '{}'::jsonb;

ALTER TABLE public.landing_companies
  DROP COLUMN IF EXISTS name_en,
  DROP COLUMN IF EXISTS name_th,
  DROP COLUMN IF EXISTS description_en,
  DROP COLUMN IF EXISTS description_th;

COMMENT ON COLUMN public.landing_companies.name IS 'Company name keyed by language code, e.g. {"en": "...", "th": "...", "zh": "..."}';
COMMENT ON COLUMN public.landing_companies.description IS 'Company description keyed by language code';

-- ---------------------------------------------------------------------------
-- 3. landing_events — anonymous visitor interaction tracking
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.landing_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Random per-tab id from sessionStorage — groups events into a visit, no user identity
  session_id TEXT NOT NULL CHECK (char_length(session_id) BETWEEN 1 AND 64),
  event_type TEXT NOT NULL CHECK (
    event_type IN ('page_view', 'language_switch', 'cta_click', 'social_click', 'nav_click')
  ),
  path TEXT NOT NULL CHECK (char_length(path) BETWEEN 1 AND 300),
  language TEXT CHECK (language IS NULL OR char_length(language) <= 8),
  referrer TEXT CHECK (referrer IS NULL OR char_length(referrer) <= 600),
  -- What was interacted with: 'hero-cta', 'hiterratech:facebook', a language code, ...
  target TEXT CHECK (target IS NULL OR char_length(target) <= 120),
  device TEXT CHECK (device IS NULL OR device IN ('mobile', 'tablet', 'desktop'))
);

CREATE INDEX IF NOT EXISTS landing_events_occurred_at_idx
  ON public.landing_events (occurred_at DESC);
CREATE INDEX IF NOT EXISTS landing_events_type_occurred_at_idx
  ON public.landing_events (event_type, occurred_at DESC);

ALTER TABLE public.landing_events ENABLE ROW LEVEL SECURITY;

-- Anyone may record events (writes go through /api/track, which validates and
-- caps field sizes; the CHECK constraints above are the hard backstop).
DROP POLICY IF EXISTS "Anyone can record landing events" ON public.landing_events;
CREATE POLICY "Anyone can record landing events" ON public.landing_events
  FOR INSERT
  WITH CHECK (true);

-- Only admins can read or prune analytics
DROP POLICY IF EXISTS "Admins can view landing events" ON public.landing_events;
CREATE POLICY "Admins can view landing events" ON public.landing_events
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete landing events" ON public.landing_events;
CREATE POLICY "Admins can delete landing events" ON public.landing_events
  FOR DELETE
  USING (public.is_admin());

COMMENT ON TABLE public.landing_events IS 'Anonymous visitor interaction events from the public landing pages (page views, language switches, CTA/social/nav clicks). Written via /api/track, read by the /admin dashboard.';
