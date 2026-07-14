import { unstable_cache } from 'next/cache';
import { COMPANIES, type CompanyConfig } from '@/config/companies';
import {
  DEFAULT_HERO_BACKGROUND,
  DEFAULT_SERVICE_IMAGES,
  LANDING_CACHE_TAG,
} from '@/config/landing-cms';
import {
  FALLBACK_LANGUAGES,
  getStaticDictionary,
  type Language,
  type LanguageInfo,
  type Translations,
} from '@/i18n/translations';
import { fetchSiteLanguages } from '@/services/languages';

import {
  LANDING_SECTION_KEYS,
  type LandingCompanyContent,
  type LandingCompanyRow,
  type LandingContent,
  type LandingSectionRow,
} from '@/types/landing';

import { createPublicClient } from '@/lib/supabase/public';

/** Slugs that have static entries in translations.companies / COMPANIES */
type KnownSlug = CompanyConfig['slug'];

function isKnownSlug(slug: string): slug is KnownSlug {
  return COMPANIES.some((company) => company.slug === slug);
}

/**
 * Shallow-merge a DB section patch over a static section object.
 * Only known keys are overwritten, and only with non-empty string values —
 * unknown or blank DB fields never clobber the static defaults.
 */
function mergeSection(
  target: Record<string, string>,
  patch: Record<string, string> | null | undefined
): void {
  if (!patch || typeof patch !== 'object') return;
  for (const [key, value] of Object.entries(patch)) {
    if (typeof target[key] === 'string' && typeof value === 'string' && value.trim() !== '') {
      target[key] = value;
    }
  }
}

/** Base dictionaries for each active language: static text, English where none exists */
function buildBaseTranslations(codes: Language[]): Record<Language, Translations> {
  return Object.fromEntries(
    codes.map((code) => [code, structuredClone(getStaticDictionary(code))])
  );
}

/** Build a Record<Language, string> by resolving each language with an English fallback */
function localize(
  codes: Language[],
  resolve: (lang: Language) => string | undefined
): Record<Language, string> {
  const english = resolve('en') ?? '';
  return Object.fromEntries(codes.map((lang) => [lang, resolve(lang) || english]));
}

/** Resolve a static COMPANIES entry + its translation text into LandingCompanyContent */
function staticCompanyContent(
  config: CompanyConfig,
  codes: Language[],
  merged: Record<Language, Translations>
): LandingCompanyContent {
  return {
    slug: config.slug,
    bgColor: config.bgColor,
    bottomImage: config.bottomImage,
    socialLinks: config.socialLinks,
    images: config.images,
    name: localize(codes, (lang) => merged[lang]?.companies[config.slug].name),
    description: localize(codes, (lang) => merged[lang]?.companies[config.slug].description),
  };
}

/** Map a landing_companies row to LandingCompanyContent, falling back to static config per field */
function mapCompanyRow(
  row: LandingCompanyRow,
  codes: Language[],
  merged: Record<Language, Translations>
): LandingCompanyContent {
  const fallback = COMPANIES.find((company) => company.slug === row.slug);
  const staticText = isKnownSlug(row.slug)
    ? {
        name: (lang: Language) => getStaticDictionary(lang).companies[row.slug as KnownSlug].name,
        description: (lang: Language) =>
          getStaticDictionary(lang).companies[row.slug as KnownSlug].description,
      }
    : undefined;

  const name = localize(codes, (lang) => row.name?.[lang] || staticText?.name(lang) || row.slug);
  const description = localize(
    codes,
    (lang) => row.description?.[lang] || staticText?.description(lang) || ''
  );

  // Overlay the resolved company text onto the merged translations so client
  // components reading t.companies[slug] see the DB values too.
  if (isKnownSlug(row.slug)) {
    for (const lang of codes) {
      merged[lang].companies[row.slug] = { name: name[lang], description: description[lang] };
    }
  }

  const hasSocialLinks =
    row.social_links != null && Object.values(row.social_links).some((href) => Boolean(href));

  return {
    slug: row.slug,
    bgColor: row.bg_color || fallback?.bgColor || '#000000',
    bottomImage: row.bottom_image ?? fallback?.bottomImage ?? undefined,
    socialLinks: hasSocialLinks ? row.social_links : (fallback?.socialLinks ?? {}),
    images: row.images && row.images.length > 0 ? row.images : (fallback?.images ?? []),
    name,
    description,
  };
}

/** Fully-static content — used whenever Supabase is unreachable or empty */
function buildStaticContent(): LandingContent {
  const languages = FALLBACK_LANGUAGES;
  const codes = languages.map((lang) => lang.code);
  const merged = buildBaseTranslations(codes);
  return {
    languages,
    translations: merged,
    heroImages: { background: DEFAULT_HERO_BACKGROUND },
    serviceImages: [...DEFAULT_SERVICE_IMAGES],
    companies: COMPANIES.map((company) => staticCompanyContent(company, codes, merged)),
  };
}

/** Enabled languages only, with the base language guaranteed present */
function enabledLanguages(all: LanguageInfo[]): LanguageInfo[] {
  const enabled = all.filter((lang) => lang.enabled);
  if (!enabled.some((lang) => lang.code === 'en')) {
    enabled.unshift(FALLBACK_LANGUAGES[0]);
  }
  return enabled;
}

/**
 * Fetch all CMS-editable landing content and deep-merge it over the static
 * defaults (translations.ts + companies.ts + landing-cms.ts). Any failure —
 * network, missing tables, empty rows — degrades to the static fallback so
 * the public page never breaks because Supabase is down.
 *
 * Runs inside unstable_cache, so it must stay free of cookies()/headers();
 * createPublicClient() is cookie-less by design.
 */
async function fetchLandingContent(): Promise<LandingContent> {
  try {
    const supabase = createPublicClient();

    const [languagesAll, sectionsResult, companiesResult] = await Promise.all([
      fetchSiteLanguages(supabase),
      supabase.from('landing_sections').select('key, content, images'),
      supabase
        .from('landing_companies')
        .select('slug, name, description, bg_color, bottom_image, social_links, images, sort_order')
        .order('sort_order', { ascending: true }),
    ]);

    if (sectionsResult.error) throw sectionsResult.error;
    if (companiesResult.error) throw companiesResult.error;

    const languages = enabledLanguages(languagesAll);
    const codes = languages.map((lang) => lang.code);
    const sections = (sectionsResult.data ?? []) as LandingSectionRow[];
    const companyRows = (companiesResult.data ?? []) as LandingCompanyRow[];

    // 1. Merge section text (per language) over the static base dictionaries
    const merged = buildBaseTranslations(codes);
    for (const section of sections) {
      if (!LANDING_SECTION_KEYS.includes(section.key)) continue;
      for (const lang of codes) {
        mergeSection(merged[lang][section.key] as Record<string, string>, section.content?.[lang]);
      }
    }

    // 2. Resolve editable images with per-slot static fallbacks
    const heroImages = sections.find((section) => section.key === 'hero')?.images;
    const servicesImages = sections.find((section) => section.key === 'services')?.images;

    // 3. Resolve companies — DB rows win, static COMPANIES fills any gaps
    const companies =
      companyRows.length > 0
        ? companyRows.map((row) => mapCompanyRow(row, codes, merged))
        : COMPANIES.map((company) => staticCompanyContent(company, codes, merged));

    return {
      languages,
      translations: merged,
      heroImages: { background: heroImages?.background || DEFAULT_HERO_BACKGROUND },
      serviceImages: [
        servicesImages?.card1 || DEFAULT_SERVICE_IMAGES[0],
        servicesImages?.card2 || DEFAULT_SERVICE_IMAGES[1],
        servicesImages?.card3 || DEFAULT_SERVICE_IMAGES[2],
      ],
      companies,
    };
  } catch (error) {
    console.error('[landing] Failed to load CMS content, falling back to static defaults:', error);
    return buildStaticContent();
  }
}

/**
 * getLandingContent — cached landing page content.
 *
 * Cached via unstable_cache and tagged with LANDING_CACHE_TAG so admin server
 * actions (content edits AND language changes) can invalidate it on write;
 * also time-revalidated hourly as a safety net.
 */
export const getLandingContent = unstable_cache(fetchLandingContent, ['landing-content'], {
  tags: [LANDING_CACHE_TAG],
  revalidate: 3600,
});
