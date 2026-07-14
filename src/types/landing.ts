/**
 * Shared types for the CMS-driven landing page.
 *
 * The landing page content lives in two Supabase tables
 * (see migrations/002_create_landing_content.sql + 003_multilang_and_analytics.sql):
 *  - landing_sections  — per-section text (locale-keyed JSONB) + editable images
 *  - landing_companies — one row per showcase company
 *
 * Static files (src/i18n/translations.ts, src/config/companies.ts) remain the
 * fallback/defaults; DB content is deep-merged over them in src/services/landing.ts.
 */
import type { Language, Translations } from '@/i18n/translations';

/** Sections whose text is editable via /admin/content. Company text lives in landing_companies. */
export const LANDING_SECTION_KEYS = [
  'nav',
  'hero',
  'about',
  'services',
  'footer',
  'social',
] as const;
export type LandingSectionKey = (typeof LANDING_SECTION_KEYS)[number];

/** Text keyed by language code — languages without a value fall back to English */
export type LocalizedText = Partial<Record<Language, string>>;

/** Per-section text keyed by language code, e.g. { en: {...}, th: {...}, zh: {...} } */
export type LocalizedSectionContent = Partial<Record<Language, Record<string, string>>>;

/**
 * Per-section editable images, stored in landing_sections.images JSONB.
 * Keys used per section:
 *  - hero:     { background }
 *  - services: { card1, card2, card3 }
 * Values are either /assets/... paths or Supabase Storage public URLs.
 */
export interface LandingSectionImages {
  background?: string;
  card1?: string;
  card2?: string;
  card3?: string;
}

/** Row shape of public.landing_sections */
export interface LandingSectionRow {
  key: LandingSectionKey;
  /** Partial section text per language — deep-merged over the static defaults in translations.ts */
  content: LocalizedSectionContent;
  images: LandingSectionImages | null;
  updated_at?: string;
}

export interface CompanySocialLinks {
  website?: string;
  facebook?: string;
  instagram?: string;
}

/** Row shape of public.landing_companies */
export interface LandingCompanyRow {
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  bg_color: string;
  bottom_image: string | null;
  social_links: CompanySocialLinks;
  images: string[];
  sort_order: number;
  updated_at?: string;
}

/** Fully-resolved company data consumed by the landing page */
export interface LandingCompanyContent {
  slug: string;
  bgColor: string;
  bottomImage?: string;
  socialLinks: CompanySocialLinks;
  images: string[];
  name: Record<Language, string>;
  description: Record<Language, string>;
}

/** Fully-resolved landing content (DB merged over static fallbacks) */
export interface LandingContent {
  translations: Record<Language, Translations>;
  heroImages: { background: string };
  serviceImages: [string, string, string];
  companies: LandingCompanyContent[];
}
