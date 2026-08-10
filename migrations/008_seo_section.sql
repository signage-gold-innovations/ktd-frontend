/**
 * Supabase Migration: Editable SEO / metadata section
 *
 * Adds a 'seo' key to public.landing_sections so the browser-tab title and
 * meta description become CMS-editable (admin → Content → SEO / Metadata).
 * The app reads them in src/app/layout.tsx generateMetadata(), falling back
 * to the static defaults in src/i18n/translations.ts when the row is absent.
 *
 * Row shape stays in sync with LandingSectionRow in src/types/landing.ts and
 * the landing_sections type in src/types/database.ts.
 *
 * Run in the Supabase SQL Editor or via the Management API.
 */

-- ---------------------------------------------------------------------------
-- 1. Allow the new 'seo' section key
-- ---------------------------------------------------------------------------
-- The original CHECK was created inline in migration 002, so PostgreSQL
-- auto-named it landing_sections_key_check. Drop and recreate it widened.
ALTER TABLE public.landing_sections
  DROP CONSTRAINT IF EXISTS landing_sections_key_check;

ALTER TABLE public.landing_sections
  ADD CONSTRAINT landing_sections_key_check
  CHECK (key IN ('nav', 'hero', 'about', 'services', 'footer', 'social', 'seo'));

COMMENT ON COLUMN public.landing_sections.key IS 'Section identifier: nav | hero | about | services | footer | social | seo';

-- ---------------------------------------------------------------------------
-- 2. Seed the seo row (locale-keyed content, mirrors src/i18n/translations.ts)
-- ---------------------------------------------------------------------------
-- Only en/th/zh are seeded; languages added later fall back to English in code.
-- Dollar-quoted so the em dash and Thai/Chinese text need no escaping.
INSERT INTO public.landing_sections (key, content, images) VALUES
  (
    'seo',
    jsonb_build_object(
      'en', $json${"metaTitle": "KTD Group — Full-Spectrum Technopreneur", "metaDescription": "KTD Group bridges deep technical engineering and entrepreneurial growth across satellite data, rock quarry, and brick manufacturing ventures."}$json$::jsonb,
      'th', $json${"metaTitle": "กลุ่มบริษัท KTD — ผู้ประกอบการเทคโนโลยีครบวงจร", "metaDescription": "กลุ่มบริษัท KTD เชื่อมโยงวิศวกรรมเชิงเทคนิคเข้ากับการเติบโตของธุรกิจ ครอบคลุมธุรกิจข้อมูลดาวเทียม เหมืองหิน และการผลิตอิฐ"}$json$::jsonb,
      'zh', $json${"metaTitle": "KTD 集团 — 全方位科技创业家", "metaDescription": "KTD 集团连接深度技术工程与企业增长,业务涵盖卫星数据、采石场与制砖等领域。"}$json$::jsonb
    ),
    NULL
  )
ON CONFLICT (key) DO NOTHING;
