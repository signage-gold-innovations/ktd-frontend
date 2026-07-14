/**
 * Supabase Migration: Create Landing Page CMS Content Tables
 *
 * This migration makes the main landing page editable from the admin CMS:
 *  - public.is_admin()        — SECURITY DEFINER helper used by all RLS policies
 *  - public.landing_sections  — per-section text (EN/TH JSONB) + editable images
 *  - public.landing_companies — one row per showcase company
 *  - storage 'landing-media'  — public bucket for CMS-uploaded images
 *
 * Seed data reproduces the current static content from
 * src/i18n/translations.ts and src/config/companies.ts, so the page renders
 * identically before any admin edit. Row shapes must stay in sync with
 * LandingSectionRow / LandingCompanyRow in src/types/landing.ts.
 *
 * IMPORTANT: Run this in your Supabase SQL Editor or apply via:
 * supabase migration new create_landing_content
 *
 * Then paste the SQL below and run:
 * supabase db push
 */

-- ---------------------------------------------------------------------------
-- 1. Admin helper function
-- ---------------------------------------------------------------------------
-- SECURITY DEFINER is required: the RLS policies below call this function,
-- and without DEFINER the check would recurse through admin_users' own RLS.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
      AND (is_admin = true OR role = 'admin')
  );
$$;

COMMENT ON FUNCTION public.is_admin() IS 'Returns true when the current auth.uid() is an admin (admin_users.is_admin = true OR role = admin). SECURITY DEFINER so RLS policies do not recurse through admin_users'' own RLS.';

-- ---------------------------------------------------------------------------
-- 2. landing_sections table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.landing_sections (
  key TEXT PRIMARY KEY CHECK (key IN ('nav', 'hero', 'about', 'services', 'footer', 'social')),
  content_en JSONB NOT NULL DEFAULT '{}'::jsonb,
  content_th JSONB NOT NULL DEFAULT '{}'::jsonb,
  images JSONB, -- 'hero': {"background": url}; 'services': {"card1","card2","card3"}; others NULL
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 3. landing_companies table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.landing_companies (
  slug TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_th TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_th TEXT NOT NULL,
  bg_color TEXT NOT NULL,
  bottom_image TEXT,
  social_links JSONB NOT NULL DEFAULT '{}'::jsonb, -- {"website","facebook","instagram"}
  images TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create or replace function to update updated_at timestamp (shared by both tables)
CREATE OR REPLACE FUNCTION public.update_landing_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('UTC'::TEXT, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_landing_sections_updated_at ON public.landing_sections;
CREATE TRIGGER update_landing_sections_updated_at
  BEFORE UPDATE ON public.landing_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_landing_updated_at();

DROP TRIGGER IF EXISTS update_landing_companies_updated_at ON public.landing_companies;
CREATE TRIGGER update_landing_companies_updated_at
  BEFORE UPDATE ON public.landing_companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_landing_updated_at();

-- ---------------------------------------------------------------------------
-- 4. Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.landing_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_companies ENABLE ROW LEVEL SECURITY;

-- Public website content: anyone (including anon) can read
CREATE POLICY "Anyone can view landing sections" ON public.landing_sections
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view landing companies" ON public.landing_companies
  FOR SELECT
  USING (true);

-- Only admins can write
CREATE POLICY "Admins can insert landing sections" ON public.landing_sections
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update landing sections" ON public.landing_sections
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete landing sections" ON public.landing_sections
  FOR DELETE
  USING (public.is_admin());

CREATE POLICY "Admins can insert landing companies" ON public.landing_companies
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update landing companies" ON public.landing_companies
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete landing companies" ON public.landing_companies
  FOR DELETE
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- 5. Seed data — mirrors src/i18n/translations.ts + src/config/companies.ts
-- ---------------------------------------------------------------------------
-- JSONB payloads are dollar-quoted so apostrophes ("We don't just build
-- tools") and Thai text need no escaping.

INSERT INTO public.landing_sections (key, content_en, content_th, images) VALUES
  (
    'nav',
    $json${"companyName": "KTD Group", "home": "Home", "about": "About", "services": "Services", "contact": "Contact"}$json$::jsonb,
    $json${"companyName": "กลุ่มบริษัท KTD", "home": "หน้าแรก", "about": "เกี่ยวกับเรา", "services": "บริการ", "contact": "ติดต่อเรา"}$json$::jsonb,
    NULL
  ),
  (
    'hero',
    $json${"presenterName": "Tod Sirawattananon", "title": "Full-Spectrum Technopreneur", "subtitle": "Engineering the solve. Scaling the venture.", "cta": "Explore Our Ventures"}$json$::jsonb,
    $json${"presenterName": "Tod Sirawattananon", "title": "ผู้ประกอบการเทคโนโลยีครบวงจร", "subtitle": "ออกแบบทางแก้ปัญหาด้วยวิศวกรรม ขยายธุรกิจให้เติบโตอย่างก้าวกระโดด", "cta": "ดูบริการของเรา"}$json$::jsonb,
    '{"background": "/assets/landing/hero/hero-background.png"}'::jsonb
  ),
  (
    'about',
    $json${
      "title": "Who Are We?",
      "p1": "We bridge the gap between deep technical logic and entrepreneurial growth.",
      "p2": "We don't just build tools; We engineer the systematic solve—creating the robust infrastructure and automated workflows that allow a venture to scale without breaking.",
      "p3": "From the engine room to the boardroom, We are an all-in-one technologist focused on what works",
      "ceoName": "Lorem ipsum dolor sit amet",
      "ceoTitle": "CEO",
      "card1Title": "Systematic Solve",
      "card1Desc": "Engineering robust, end-to-end solutions",
      "card2Title": "Venture Scaling",
      "card2Desc": "Bridging the gap between technical logic and business growth to scale without breaking.",
      "card3Title": "Automated Infrastructure",
      "card3Desc": "Creating automated workflows and solid infrastructure from the engine room to the boardroom."
    }$json$::jsonb,
    $json${
      "title": "เราคือใคร?",
      "p1": "เราเป็นตัวกลางเชื่อมโยงระหว่างตรรกะทางเทคนิคที่ลึกซึ้งกับการเติบโตของธุรกิจ",
      "p2": "ผมไม่ได้แค่สร้างเครื่องมือ เราออกแบบระบบการแก้ปัญหา — สร้างโครงสร้างพื้นฐานที่แข็งแกร่งและระบบอัตโนมัติที่ช่วยให้ธุรกิจขยายตัวได้โดยไม่สะดุด",
      "p3": "ตั้งแต่ห้องเครื่องไปจนถึงห้องประชุมคณะกรรมการ เราคือนักเทคโนโลยีแบบครบวงจรที่โฟกัสในสิ่งที่ใช้งานได้จริง",
      "ceoName": "Lorem ipsum dolor sit amet",
      "ceoTitle": "CEO",
      "card1Title": "การแก้ปัญหาเชิงระบบ",
      "card1Desc": "ออกแบบทางแก้ปัญหาที่แข็งแกร่งและครบวงจร เชื่อมโยงทุกส่วนตั้งแต่ข้อมูล",
      "card2Title": "การขยายธุรกิจและการเติบโต",
      "card2Desc": "เชื่อมช่องว่างระหว่างเทคนิคกับการเติบโตเพื่อขยายขนาดธุรกิจอย่างมั่นคง",
      "card3Title": "โครงสร้างพื้นฐานอัตโนมัติ",
      "card3Desc": "สร้างระบบการทำงานอัตโนมัติและโครงสร้างที่ยอดเยี่ยม รองรับการทำงานในทุกระดับ"
    }$json$::jsonb,
    NULL
  ),
  (
    'services',
    $json${
      "title": "Our Services & Ventures",
      "card1Label": "HITERRATECH",
      "card1Desc": "The Intelligent View (Engineering the Solve via Data)",
      "card2Label": "ศิลาชัยเจริญ",
      "card2Desc": "The Intelligent View (Engineering the Solve via Data)",
      "card3Label": "กิจธนาทรัพย์",
      "card3Desc": "The Intelligent View (Engineering the Solve via Data)"
    }$json$::jsonb,
    $json${
      "title": "บริการและธุรกิจในเครือ",
      "card1Label": "HITERRATECH",
      "card1Desc": "The Intelligent View (Engineering the Solve via Data)",
      "card2Label": "ศิลาชัยเจริญ",
      "card2Desc": "The Intelligent View (Engineering the Solve via Data)",
      "card3Label": "กิจธนาทรัพย์",
      "card3Desc": "The Intelligent View (Engineering the Solve via Data)"
    }$json$::jsonb,
    '{"card1": "/assets/landing/services/service1.jpg", "card2": "/assets/landing/services/service2.jpg", "card3": "/assets/landing/services/service3.png"}'::jsonb
  ),
  (
    'footer',
    '{"rights": "All rights reserved."}'::jsonb,
    '{"rights": "All rights reserved."}'::jsonb,
    NULL
  ),
  (
    'social',
    '{"website": "Website", "facebook": "Facebook", "instagram": "Instagram"}'::jsonb,
    '{"website": "Website", "facebook": "Facebook", "instagram": "Instagram"}'::jsonb,
    NULL
  )
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.landing_companies
  (slug, name_en, name_th, description_en, description_th, bg_color, bottom_image, social_links, images, sort_order)
VALUES
  (
    'hiterratech',
    'Hiterratech',
    'Hiterratech',
    'Integrated solution for your business and engineering projects with specialisation in mining industry, smart ICT solution, and innovative technology.',
    'Integrated solution for your business and engineering projects with specialisation in mining industry, smart ICT solution, and innovative technology.',
    '#000000',
    NULL,
    '{"website": "https://www.google.com/", "facebook": "https://www.google.com/", "instagram": "https://www.google.com/"}'::jsonb,
    ARRAY[
      '/assets/landing/companies/hiterratech/hiterratech1.jpg',
      '/assets/landing/companies/hiterratech/hiterratech2.jpg',
      '/assets/landing/companies/hiterratech/hiterratech3.jpg',
      '/assets/landing/companies/hiterratech/hiterratech4.jpg'
    ],
    0
  ),
  (
    'silachai',
    'Silachai Charoen',
    'ศิลาชัยเจริญ',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'linear-gradient(360deg, #010214 0%, #39005D 100%)',
    NULL,
    '{"website": "https://www.google.com/", "facebook": "https://www.google.com/", "instagram": "https://www.google.com/"}'::jsonb,
    ARRAY[
      '/assets/landing/companies/silachai/silachai1.jpg',
      '/assets/landing/companies/silachai/silachai2.png',
      '/assets/landing/companies/silachai/silachai3.jpg',
      '/assets/landing/companies/silachai/silachai4.jpg'
    ],
    1
  ),
  (
    'kitthana',
    'Kitthana Sap',
    'กิจธนาทรัพย์',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    '#000000',
    '/assets/landing/companies/company-bottom.png',
    '{"website": "https://www.google.com/", "facebook": "https://www.google.com/", "instagram": "https://www.google.com/"}'::jsonb,
    ARRAY[
      '/assets/landing/companies/kitthana/kitthana1.jpg',
      '/assets/landing/companies/kitthana/kitthana2.jpg',
      '/assets/landing/companies/kitthana/kitthana3.png',
      '/assets/landing/companies/kitthana/kitthana4.jpg'
    ],
    2
  )
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 6. Storage: public 'landing-media' bucket for CMS-uploaded images
-- ---------------------------------------------------------------------------
-- Must match LANDING_MEDIA_BUCKET in src/config/landing-cms.ts
INSERT INTO storage.buckets (id, name, public)
VALUES ('landing-media', 'landing-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view landing media" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'landing-media');

CREATE POLICY "Admins can upload landing media" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'landing-media' AND public.is_admin());

CREATE POLICY "Admins can update landing media" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'landing-media' AND public.is_admin())
  WITH CHECK (bucket_id = 'landing-media' AND public.is_admin());

CREATE POLICY "Admins can delete landing media" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'landing-media' AND public.is_admin());

-- ---------------------------------------------------------------------------
-- 7. Documentation comments
-- ---------------------------------------------------------------------------
COMMENT ON TABLE public.landing_sections IS 'Editable landing page text per section (EN/TH JSONB) plus optional per-section images. Deep-merged over static defaults in src/i18n/translations.ts';
COMMENT ON COLUMN public.landing_sections.key IS 'Section identifier: nav | hero | about | services | footer | social';
COMMENT ON COLUMN public.landing_sections.content_en IS 'English text for the section — flat object of string values matching the section shape in translations.ts';
COMMENT ON COLUMN public.landing_sections.content_th IS 'Thai text for the section — flat object of string values matching the section shape in translations.ts';
COMMENT ON COLUMN public.landing_sections.images IS 'Editable images: hero => {"background"}, services => {"card1","card2","card3"}; NULL for sections without images. Values are /assets/... paths or landing-media public URLs';

COMMENT ON TABLE public.landing_companies IS 'Editable showcase companies on the landing page, ordered by sort_order. Mirrors src/config/companies.ts + translations.ts companies section';
COMMENT ON COLUMN public.landing_companies.bg_color IS 'CSS color or gradient string for the company section background';
COMMENT ON COLUMN public.landing_companies.bottom_image IS 'Optional decorative image rendered at the bottom of the section';
COMMENT ON COLUMN public.landing_companies.social_links IS 'Social link URLs: {"website","facebook","instagram"} — all keys optional';
COMMENT ON COLUMN public.landing_companies.images IS 'Ordered gallery image paths (/assets/... or landing-media public URLs)';
COMMENT ON COLUMN public.landing_companies.sort_order IS 'Ascending display order of company sections on the landing page';
