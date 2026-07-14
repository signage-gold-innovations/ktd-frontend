import { createClient } from '@/lib/supabase/server';

/**
 * Click points for the /admin/heatmap page.
 * Reads 'click' events (recorded with normalized coordinates by the public
 * site tracker) with the signed-in admin's client — RLS restricts SELECT
 * to admins.
 */

export const HEATMAP_DEVICES = ['desktop', 'tablet', 'mobile'] as const;
export type HeatmapDevice = (typeof HEATMAP_DEVICES)[number];

/** Preview iframe width per device bucket — matches the tracker's breakpoints */
export const DEVICE_PREVIEW_WIDTHS: Record<HeatmapDevice, number> = {
  desktop: 1280,
  tablet: 900,
  mobile: 390,
};

export interface HeatmapPoint {
  x: number;
  y: number;
}

export interface HeatmapData {
  rangeDays: number;
  device: HeatmapDevice;
  points: HeatmapPoint[];
  /** True when the fetch hit the row cap and the map is a sample */
  truncated: boolean;
}

const RANGE_DAYS = 30;
const ROW_LIMIT = 20000;

/**
 * Fetch landing-page ('/') click coordinates for one device bucket.
 * Returns null when the table/columns are unreachable (migration 005 not
 * applied) so the page can show setup guidance instead of crashing.
 */
export async function getClickHeatmap(device: HeatmapDevice): Promise<HeatmapData | null> {
  const since = new Date(Date.now() - RANGE_DAYS * 24 * 60 * 60 * 1000).toISOString();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('landing_events')
      .select('x_ratio, y_ratio')
      .eq('event_type', 'click')
      .eq('device', device)
      .eq('path', '/')
      .not('x_ratio', 'is', null)
      .not('y_ratio', 'is', null)
      .gte('occurred_at', since)
      .order('occurred_at', { ascending: false })
      .limit(ROW_LIMIT);

    if (error) {
      console.error('[heatmap] Failed to load click events:', error.message);
      return null;
    }

    const rows = (data ?? []) as { x_ratio: number; y_ratio: number }[];
    return {
      rangeDays: RANGE_DAYS,
      device,
      points: rows.map((row) => ({ x: row.x_ratio, y: row.y_ratio })),
      truncated: rows.length >= ROW_LIMIT,
    };
  } catch (error) {
    // Let Next.js control-flow errors (static prerender bailout via cookies()) propagate
    if (error instanceof Error && 'digest' in error) throw error;
    console.error('[heatmap] Failed to load click events:', error);
    return null;
  }
}

/**
 * Fetch mouse movement coordinates for one device bucket.
 * Returns null when the table/columns are unreachable.
 */
export async function getMovementHeatmap(device: HeatmapDevice): Promise<HeatmapData | null> {
  const since = new Date(Date.now() - RANGE_DAYS * 24 * 60 * 60 * 1000).toISOString();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('landing_events')
      .select('x_ratio, y_ratio')
      .eq('event_type', 'move')
      .eq('device', device)
      .eq('path', '/')
      .not('x_ratio', 'is', null)
      .not('y_ratio', 'is', null)
      .gte('occurred_at', since)
      .order('occurred_at', { ascending: false })
      .limit(ROW_LIMIT);

    if (error) {
      console.error('[heatmap] Failed to load move events:', error.message);
      return null;
    }

    const rows = (data ?? []) as { x_ratio: number; y_ratio: number }[];
    return {
      rangeDays: RANGE_DAYS,
      device,
      points: rows.map((row) => ({ x: row.x_ratio, y: row.y_ratio })),
      truncated: rows.length >= ROW_LIMIT,
    };
  } catch (error) {
    if (error instanceof Error && 'digest' in error) throw error;
    console.error('[heatmap] Failed to load move events:', error);
    return null;
  }
}
