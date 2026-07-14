/**
 * Browser-side helpers for the landing-media Storage bucket.
 * Import only from client components — uses the browser Supabase client,
 * and writes are gated by RLS (admin-only) on storage.objects.
 */
import { LANDING_MEDIA_BUCKET } from '@/config/landing-cms';

import { createClient } from '@/lib/supabase/client';

/** All CMS uploads land in one flat folder to keep listing simple */
export const MEDIA_FOLDER = 'uploads';

export interface MediaObject {
  /** File name within MEDIA_FOLDER */
  name: string;
  /** Full object path within the bucket (pass to deleteLandingMedia) */
  path: string;
  publicUrl: string;
  createdAt?: string;
  /** Size in bytes, when the API provides it */
  size?: number;
}

/** Upload an image and return its public URL */
export async function uploadLandingImage(file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
  const path = `${MEDIA_FOLDER}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(LANDING_MEDIA_BUCKET)
    .upload(path, file, { cacheControl: '3600', contentType: file.type });
  if (error) throw new Error(`Upload failed: ${error.message}`);

  return supabase.storage.from(LANDING_MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function listLandingMedia(): Promise<MediaObject[]> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(LANDING_MEDIA_BUCKET)
    .list(MEDIA_FOLDER, { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });
  if (error) throw new Error(`Failed to list media: ${error.message}`);

  return (data ?? [])
    .filter((item) => item.id) // folders have no id
    .map((item) => {
      const path = `${MEDIA_FOLDER}/${item.name}`;
      return {
        name: item.name,
        path,
        publicUrl: supabase.storage.from(LANDING_MEDIA_BUCKET).getPublicUrl(path).data.publicUrl,
        createdAt: item.created_at ?? undefined,
        size: (item.metadata as { size?: number } | null)?.size,
      };
    });
}

export async function deleteLandingMedia(path: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(LANDING_MEDIA_BUCKET).remove([path]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}
