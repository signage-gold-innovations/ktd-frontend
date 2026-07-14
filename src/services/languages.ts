import { FALLBACK_LANGUAGES, type LanguageInfo } from '@/i18n/translations';

import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Site language list, backed by public.site_languages (managed at
 * /admin/languages). Shared by the public data layer (enabled languages only)
 * and the admin CMS (all languages, so content can be prepared before a
 * language is enabled).
 */

interface SiteLanguageRow {
  code: string;
  label: string;
  name: string;
  native_name: string;
  enabled: boolean;
  sort_order: number;
}

function mapRow(row: SiteLanguageRow): LanguageInfo {
  return {
    code: row.code,
    label: row.label,
    name: row.name,
    nativeName: row.native_name,
    enabled: row.enabled,
    sortOrder: row.sort_order,
  };
}

/**
 * Fetch all configured languages, ordered. Falls back to the static
 * FALLBACK_LANGUAGES when the table is unreachable so both the public site
 * and the admin keep working.
 */
export async function fetchSiteLanguages(supabase: SupabaseClient): Promise<LanguageInfo[]> {
  try {
    const { data, error } = await supabase
      .from('site_languages')
      .select('code, label, name, native_name, enabled, sort_order')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    const rows = (data ?? []) as SiteLanguageRow[];
    return rows.length > 0 ? rows.map(mapRow) : FALLBACK_LANGUAGES;
  } catch (error) {
    console.error('[languages] Failed to load site languages, using fallback list:', error);
    return FALLBACK_LANGUAGES;
  }
}
