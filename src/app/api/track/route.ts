import { z } from 'zod';

import { TRACKED_EVENT_TYPES } from '@/lib/analytics';
import { createPublicClient } from '@/lib/supabase/public';

/**
 * POST /api/track — ingest one anonymous analytics event from the public site.
 *
 * Called by src/lib/analytics.ts (fetch/sendBeacon). Validates and size-caps
 * the payload, then inserts into public.landing_events with the anon key
 * (RLS: insert-only for anon; reads are admin-only). Always responds quickly
 * and never leaks errors to the visitor — analytics is best-effort.
 */

const eventSchema = z.object({
  session_id: z.string().min(1).max(64),
  event_type: z.enum(TRACKED_EVENT_TYPES),
  path: z
    .string()
    .min(1)
    .max(300)
    .refine((value) => value.startsWith('/') && !value.startsWith('/admin'), 'Untracked path'),
  language: z.string().max(8).optional(),
  referrer: z.string().max(600).optional(),
  target: z.string().max(120).optional(),
  device: z.enum(['mobile', 'tablet', 'desktop']).optional(),
  x: z.number().min(0).max(1).optional(),
  y: z.number().min(0).max(1).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(null, { status: 400 });
  }

  const { session_id, event_type, path, language, referrer, target, device, x, y } = parsed.data;

  try {
    const supabase = createPublicClient();
    const { error } = await supabase.from('landing_events').insert({
      session_id,
      event_type,
      path,
      language: language ?? null,
      referrer: referrer ?? null,
      target: target ?? null,
      device: device ?? null,
      x_ratio: x ?? null,
      y_ratio: y ?? null,
    });
    if (error) {
      console.error('[analytics] Failed to record event:', error.message);
    }
  } catch (error) {
    console.error('[analytics] Failed to record event:', error);
  }

  return new Response(null, { status: 204 });
}
