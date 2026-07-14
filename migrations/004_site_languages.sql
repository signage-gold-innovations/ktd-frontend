/**
 * Supabase Migration: Configurable site languages
 *
 * public.site_languages — the list of languages the public site and the
 * admin CMS offer, managed at /admin/languages. Adding a language here makes
 * it appear in the public switcher and as a sub-tab in the content editor;
 * its text falls back to English until an admin fills it in.
 *
 * 'en' is the base/fallback language: it cannot be disabled or deleted
 * (enforced by triggers here and by the server actions).
 *
 * Static dictionaries in src/i18n/translations.ts (en/th/zh) remain the
 * offline fallback when Supabase is unreachable.
 */

CREATE TABLE IF NOT EXISTS public.site_languages (
  -- BCP-47-ish lowercase code: 'en', 'th', 'zh', 'zh-tw', 'ja', ...
  code TEXT PRIMARY KEY CHECK (code ~ '^[a-z]{2,3}(-[a-z0-9]{2,8})?$'),
  -- Short label shown in the public language switcher, e.g. 'EN', '中文'
  label TEXT NOT NULL CHECK (char_length(label) BETWEEN 1 AND 12),
  -- English name shown in the admin, e.g. 'Chinese'
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 40),
  -- Native name, e.g. '中文'
  native_name TEXT NOT NULL CHECK (char_length(native_name) BETWEEN 1 AND 40),
  -- Disabled languages are hidden from the public site but keep their content
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_site_languages_updated_at ON public.site_languages;
CREATE TRIGGER update_site_languages_updated_at
  BEFORE UPDATE ON public.site_languages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_landing_updated_at();

-- 'en' is the hard fallback for all content — never let it disappear
CREATE OR REPLACE FUNCTION public.protect_default_language()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.code = 'en' THEN
      RAISE EXCEPTION 'The default language (en) cannot be deleted';
    END IF;
    RETURN OLD;
  END IF;
  IF OLD.code = 'en' AND (NEW.code <> 'en' OR NEW.enabled = FALSE) THEN
    RAISE EXCEPTION 'The default language (en) cannot be disabled or renamed';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_default_language ON public.site_languages;
CREATE TRIGGER protect_default_language
  BEFORE UPDATE OR DELETE ON public.site_languages
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_default_language();

ALTER TABLE public.site_languages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view site languages" ON public.site_languages;
CREATE POLICY "Anyone can view site languages" ON public.site_languages
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert site languages" ON public.site_languages;
CREATE POLICY "Admins can insert site languages" ON public.site_languages
  FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update site languages" ON public.site_languages;
CREATE POLICY "Admins can update site languages" ON public.site_languages
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete site languages" ON public.site_languages;
CREATE POLICY "Admins can delete site languages" ON public.site_languages
  FOR DELETE
  USING (public.is_admin());

INSERT INTO public.site_languages (code, label, name, native_name, enabled, sort_order) VALUES
  ('en', 'EN', 'English', 'English', TRUE, 0),
  ('th', 'TH', 'Thai', 'ไทย', TRUE, 1),
  ('zh', '中文', 'Chinese', '中文', TRUE, 2)
ON CONFLICT (code) DO NOTHING;

COMMENT ON TABLE public.site_languages IS 'Languages offered by the public site and the admin CMS, managed at /admin/languages. en is the protected fallback. Mirrors LanguageInfo in src/i18n/translations.ts.';
