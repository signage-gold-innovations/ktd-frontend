'use server';

import { updateTag } from 'next/cache';
import { LANDING_CACHE_TAG } from '@/config/landing-cms';
import { DEFAULT_LANGUAGE } from '@/i18n/translations';
import { checkAdminAccess } from '@/services/admin';
import { z } from 'zod';

import { createClient } from '@/lib/supabase/server';

export type SaveResult = { ok: true } | { ok: false; error: string };

/** Lowercase BCP-47-ish code: 'en', 'th', 'zh', 'zh-tw', 'ja', ... */
const codeSchema = z
  .string()
  .regex(
    /^[a-z]{2,3}(-[a-z0-9]{2,8})?$/,
    "Language code must look like 'en', 'zh' or 'zh-tw' (lowercase)."
  );

const languageSchema = z.object({
  code: codeSchema,
  label: z.string().min(1).max(12),
  name: z.string().min(1).max(40),
  native_name: z.string().min(1).max(40),
  enabled: z.boolean(),
  sort_order: z.number().int().min(0),
});

export type SaveLanguageInput = z.input<typeof languageSchema>;

/**
 * Create or update one language. New languages appear as a content-editor
 * sub-tab immediately and on the public site once enabled (text falls back
 * to English until filled in).
 */
export async function saveLanguage(input: SaveLanguageInput): Promise<SaveResult> {
  const parsed = languageSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid language data.' };
  }

  if (!(await checkAdminAccess())) {
    return { ok: false, error: 'You do not have permission to manage languages.' };
  }

  if (parsed.data.code === DEFAULT_LANGUAGE && !parsed.data.enabled) {
    return { ok: false, error: 'English is the fallback language and cannot be disabled.' };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('site_languages')
      .upsert(parsed.data, { onConflict: 'code' });
    if (error) {
      return { ok: false, error: error.message };
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Failed to save language.' };
  }

  updateTag(LANDING_CACHE_TAG);
  return { ok: true };
}

/** Remove a language. Its saved content stays in the JSONB and reappears if re-added. */
export async function deleteLanguage(code: string): Promise<SaveResult> {
  const parsed = codeSchema.safeParse(code);
  if (!parsed.success) {
    return { ok: false, error: 'Invalid language code.' };
  }

  if (!(await checkAdminAccess())) {
    return { ok: false, error: 'You do not have permission to manage languages.' };
  }

  if (parsed.data === DEFAULT_LANGUAGE) {
    return { ok: false, error: 'English is the fallback language and cannot be removed.' };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('site_languages').delete().eq('code', parsed.data);
    if (error) {
      return { ok: false, error: error.message };
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Failed to delete language.' };
  }

  updateTag(LANDING_CACHE_TAG);
  return { ok: true };
}

/** Persist a new display order — sort_order becomes the index in `codes`. */
export async function reorderLanguages(codes: string[]): Promise<SaveResult> {
  const parsed = z.array(codeSchema).min(1).max(50).safeParse(codes);
  if (!parsed.success) {
    return { ok: false, error: 'Invalid language order.' };
  }

  if (!(await checkAdminAccess())) {
    return { ok: false, error: 'You do not have permission to manage languages.' };
  }

  try {
    const supabase = await createClient();
    for (const [index, code] of parsed.data.entries()) {
      const { error } = await supabase
        .from('site_languages')
        .update({ sort_order: index })
        .eq('code', code);
      if (error) {
        return { ok: false, error: error.message };
      }
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Failed to reorder.' };
  }

  updateTag(LANDING_CACHE_TAG);
  return { ok: true };
}
