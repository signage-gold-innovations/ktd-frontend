'use server';

import { updateTag } from 'next/cache';
import { LANDING_CACHE_TAG } from '@/config/landing-cms';
import { LANGUAGE_CODES } from '@/i18n/translations';
import { checkAdminAccess } from '@/services/admin';
import { z } from 'zod';

import type { LandingSectionKey, LocalizedSectionContent, LocalizedText } from '@/types/landing';
import { LANDING_SECTION_KEYS } from '@/types/landing';

import { createClient } from '@/lib/supabase/server';

export type SaveResult = { ok: true } | { ok: false; error: string };

const COMPANY_SLUGS = ['hiterratech', 'silachai', 'kitthana'] as const;

/**
 * Image locations the public page can actually render: local /assets paths or
 * this project's public Storage bucket. next/image rejects any other remote
 * host (see next.config.ts remotePatterns), so anything else would save fine
 * but show a broken image — reject it here instead.
 */
const storagePublicPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''}/storage/v1/object/public/`;

const imageUrl = z
  .string()
  .refine(
    (value) =>
      value === '' ||
      value.startsWith('/') ||
      (storagePublicPrefix.startsWith('http') && value.startsWith(storagePublicPrefix)),
    'Images must be a local /assets path or a Supabase Storage URL from the media library.'
  );

const languageCode = z.enum(LANGUAGE_CODES);

const sectionSchema = z.object({
  key: z.enum(LANDING_SECTION_KEYS),
  content: z.partialRecord(languageCode, z.record(z.string(), z.string())),
  images: z.record(z.string(), imageUrl).optional(),
});

const companySchema = z.object({
  slug: z.enum(COMPANY_SLUGS),
  name: z.partialRecord(languageCode, z.string()),
  description: z.partialRecord(languageCode, z.string()),
  bg_color: z.string(),
  bottom_image: imageUrl.nullable().optional(),
  social_links: z.object({
    website: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
  }),
  images: z.array(imageUrl),
  sort_order: z.number().int().optional(),
});

export type SaveSectionInput = {
  key: LandingSectionKey;
  content: LocalizedSectionContent;
  images?: Record<string, string>;
};

export type SaveCompanyInput = Omit<z.input<typeof companySchema>, 'name' | 'description'> & {
  name: LocalizedText;
  description: LocalizedText;
};

/** Upsert one landing_sections row, then expire the landing cache tag. */
export async function saveSection(input: SaveSectionInput): Promise<SaveResult> {
  const parsed = sectionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid section data.' };
  }

  if (!(await checkAdminAccess())) {
    return { ok: false, error: 'You do not have permission to edit landing content.' };
  }

  const { key, content, images } = parsed.data;

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('landing_sections').upsert(
      {
        key,
        content,
        images: images && Object.keys(images).length > 0 ? images : null,
      },
      { onConflict: 'key' }
    );

    if (error) {
      return { ok: false, error: error.message };
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Failed to save section.' };
  }

  updateTag(LANDING_CACHE_TAG);
  return { ok: true };
}

/** Upsert one landing_companies row, then expire the landing cache tag. */
export async function saveCompany(input: SaveCompanyInput): Promise<SaveResult> {
  const parsed = companySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid company data.' };
  }

  if (!(await checkAdminAccess())) {
    return { ok: false, error: 'You do not have permission to edit landing content.' };
  }

  const { slug, name, description, bg_color } = parsed.data;
  const { bottom_image, social_links, images, sort_order } = parsed.data;

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('landing_companies').upsert(
      {
        slug,
        name,
        description,
        bg_color,
        bottom_image: bottom_image || null,
        social_links,
        images,
        ...(sort_order !== undefined ? { sort_order } : {}),
      },
      { onConflict: 'slug' }
    );

    if (error) {
      return { ok: false, error: error.message };
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Failed to save company.' };
  }

  updateTag(LANDING_CACHE_TAG);
  return { ok: true };
}
