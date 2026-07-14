import { COMPANIES } from '@/config/companies';
import { DEFAULT_HERO_BACKGROUND, DEFAULT_SERVICE_IMAGES } from '@/config/landing-cms';
import { getStaticDictionary, type Language, type LanguageInfo } from '@/i18n/translations';
import { fetchSiteLanguages } from '@/services/languages';

import { ContentEditor } from '@/components/admin/content/content-editor';
import type { EditableSection } from '@/components/admin/content/section-form';
import { AdminPageHeader } from '@/components/admin/page-header';

import type { LandingCompanyRow, LandingSectionKey, LandingSectionRow } from '@/types/landing';
import { LANDING_SECTION_KEYS } from '@/types/landing';

import { createClient } from '@/lib/supabase/server';

/** Static default images per section, matching the LandingSectionImages keys */
const DEFAULT_SECTION_IMAGES: Partial<Record<LandingSectionKey, Record<string, string>>> = {
  hero: { background: DEFAULT_HERO_BACKGROUND },
  services: {
    card1: DEFAULT_SERVICE_IMAGES[0],
    card2: DEFAULT_SERVICE_IMAGES[1],
    card3: DEFAULT_SERVICE_IMAGES[2],
  },
};

function buildSections(rows: LandingSectionRow[], codes: Language[]): EditableSection[] {
  return LANDING_SECTION_KEYS.map((key) => {
    const row = rows.find((candidate) => candidate.key === key);

    // Prefill every configured language: DB values merged over the static
    // defaults (English for languages without a static dictionary)
    const content = Object.fromEntries(
      codes.map((lang) => [
        lang,
        {
          ...(getStaticDictionary(lang)[key] as Record<string, string>),
          ...(row?.content?.[lang] ?? {}),
        },
      ])
    );

    return {
      key,
      content,
      images: {
        ...(DEFAULT_SECTION_IMAGES[key] ?? {}),
        ...((row?.images as Record<string, string> | null) ?? {}),
      },
    };
  });
}

function buildCompanies(rows: LandingCompanyRow[], codes: Language[]): LandingCompanyRow[] {
  return COMPANIES.map((config, index) => {
    const row = rows.find((candidate) => candidate.slug === config.slug);

    const staticName = Object.fromEntries(
      codes.map((lang) => [lang, getStaticDictionary(lang).companies[config.slug].name])
    );
    const staticDescription = Object.fromEntries(
      codes.map((lang) => [lang, getStaticDictionary(lang).companies[config.slug].description])
    );

    if (row) {
      // Prefill languages the DB row doesn't have yet with the static defaults
      return {
        ...row,
        name: { ...staticName, ...row.name },
        description: { ...staticDescription, ...row.description },
      };
    }

    return {
      slug: config.slug,
      name: staticName,
      description: staticDescription,
      bg_color: config.bgColor,
      bottom_image: config.bottomImage ?? null,
      social_links: config.socialLinks,
      images: [...config.images],
      sort_order: index,
    };
  });
}

export default async function AdminContentPage() {
  const supabase = await createClient();

  // Plain uncached reads — the admin must always see the latest rows.
  // The public landing page reads through the LANDING_CACHE_TAG cache instead,
  // which the save actions expire via updateTag().
  const [languages, sectionsResult, companiesResult] = await Promise.all([
    fetchSiteLanguages(supabase) as Promise<LanguageInfo[]>,
    supabase.from('landing_sections').select('*'),
    supabase.from('landing_companies').select('*').order('sort_order', { ascending: true }),
  ]);

  const codes = languages.map((lang) => lang.code);
  const sectionRows = (sectionsResult.data ?? []) as LandingSectionRow[];
  const companyRows = (companiesResult.data ?? []) as LandingCompanyRow[];

  const sections = buildSections(sectionRows, codes);
  const companies = buildCompanies(companyRows, codes);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Content"
        description="Edit the landing page text and images per language. Changes go live immediately."
      />
      <ContentEditor sections={sections} companies={companies} languages={languages} />
    </div>
  );
}
