import { COMPANIES } from '@/config/companies';
import { DEFAULT_HERO_BACKGROUND, DEFAULT_SERVICE_IMAGES } from '@/config/landing-cms';
import { LANGUAGE_CODES, translations, type Language } from '@/i18n/translations';

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

function buildSections(rows: LandingSectionRow[]): EditableSection[] {
  return LANDING_SECTION_KEYS.map((key) => {
    const row = rows.find((candidate) => candidate.key === key);

    // Prefill every language: DB values merged over the static defaults
    const content = Object.fromEntries(
      LANGUAGE_CODES.map((lang) => [
        lang,
        {
          ...(translations[lang][key] as Record<string, string>),
          ...(row?.content?.[lang] ?? {}),
        },
      ])
    ) as Record<Language, Record<string, string>>;

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

function buildCompanies(rows: LandingCompanyRow[]): LandingCompanyRow[] {
  return COMPANIES.map((config, index) => {
    const row = rows.find((candidate) => candidate.slug === config.slug);

    const staticName = Object.fromEntries(
      LANGUAGE_CODES.map((lang) => [lang, translations[lang].companies[config.slug].name])
    );
    const staticDescription = Object.fromEntries(
      LANGUAGE_CODES.map((lang) => [lang, translations[lang].companies[config.slug].description])
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
  const [sectionsResult, companiesResult] = await Promise.all([
    supabase.from('landing_sections').select('*'),
    supabase.from('landing_companies').select('*').order('sort_order', { ascending: true }),
  ]);

  const sectionRows = (sectionsResult.data ?? []) as LandingSectionRow[];
  const companyRows = (companiesResult.data ?? []) as LandingCompanyRow[];

  const sections = buildSections(sectionRows);
  const companies = buildCompanies(companyRows);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Content"
        description="Edit the landing page text and images. Changes go live immediately."
      />
      <ContentEditor sections={sections} companies={companies} />
    </div>
  );
}
