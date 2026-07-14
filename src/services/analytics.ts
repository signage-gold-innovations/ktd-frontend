import type { LandingEventRecord } from '@/types/database';

import { createClient } from '@/lib/supabase/server';

/**
 * Aggregated landing-page analytics for the /admin dashboard.
 * Reads public.landing_events with the signed-in admin's client
 * (RLS restricts SELECT to admins).
 */

type EventRow = Pick<
  LandingEventRecord,
  'occurred_at' | 'event_type' | 'path' | 'session_id' | 'language' | 'device' | 'target'
>;

export interface DailyCount {
  /** YYYY-MM-DD (UTC) */
  date: string;
  views: number;
}

export interface CountedItem {
  label: string;
  count: number;
}

export interface RecentEvent {
  occurredAt: string;
  type: EventRow['event_type'];
  path: string;
  target: string | null;
  language: string | null;
  device: string | null;
}

export interface LandingAnalytics {
  rangeDays: number;
  pageViews: number;
  uniqueSessions: number;
  interactions: number;
  viewsToday: number;
  dailyViews: DailyCount[];
  topPages: CountedItem[];
  languages: CountedItem[];
  devices: CountedItem[];
  clickTargets: CountedItem[];
  recentEvents: RecentEvent[];
  /** True when the fetch hit the row cap and numbers are a lower bound */
  truncated: boolean;
}

const RANGE_DAYS = 30;
const CHART_DAYS = 14;
const ROW_LIMIT = 20000;

function utcDay(iso: string): string {
  return iso.slice(0, 10);
}

function toSortedCounts(counts: Map<string, number>, limit: number): CountedItem[] {
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function bump(counts: Map<string, number>, key: string | null | undefined): void {
  if (!key) return;
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

/**
 * Fetch and aggregate the last 30 days of landing events.
 * Returns null when the table is unreachable (e.g. migration 003 not applied)
 * so the dashboard can show setup guidance instead of crashing.
 */
export async function getLandingAnalytics(): Promise<LandingAnalytics | null> {
  const since = new Date(Date.now() - RANGE_DAYS * 24 * 60 * 60 * 1000).toISOString();

  let rows: EventRow[];
  try {
    const supabase = await createClient();
    // Raw 'click' events feed the /admin/heatmap page, not the dashboard —
    // excluding them here keeps the row budget for meaningful events.
    const { data, error } = await supabase
      .from('landing_events')
      .select('occurred_at, event_type, path, session_id, language, device, target')
      .neq('event_type', 'click')
      .gte('occurred_at', since)
      .order('occurred_at', { ascending: false })
      .limit(ROW_LIMIT);

    if (error) {
      console.error('[analytics] Failed to load landing events:', error.message);
      return null;
    }
    rows = (data ?? []) as EventRow[];
  } catch (error) {
    // Let Next.js control-flow errors (static prerender bailout via cookies()) propagate
    if (error instanceof Error && 'digest' in error) throw error;
    console.error('[analytics] Failed to load landing events:', error);
    return null;
  }

  const sessions = new Set<string>();
  const pathCounts = new Map<string, number>();
  const languageCounts = new Map<string, number>();
  const deviceCounts = new Map<string, number>();
  const targetCounts = new Map<string, number>();
  const viewsByDay = new Map<string, number>();

  const today = utcDay(new Date().toISOString());
  let pageViews = 0;
  let interactions = 0;
  let viewsToday = 0;

  for (const row of rows) {
    sessions.add(row.session_id);

    if (row.event_type === 'page_view') {
      pageViews += 1;
      const day = utcDay(row.occurred_at);
      viewsByDay.set(day, (viewsByDay.get(day) ?? 0) + 1);
      if (day === today) viewsToday += 1;
      bump(pathCounts, row.path);
      bump(languageCounts, row.language);
      bump(deviceCounts, row.device);
    } else {
      interactions += 1;
      bump(targetCounts, row.target ? `${row.event_type}: ${row.target}` : row.event_type);
    }
  }

  // Continuous daily series for the chart, oldest → newest, zero-filled
  const dailyViews: DailyCount[] = [];
  for (let i = CHART_DAYS - 1; i >= 0; i -= 1) {
    const date = utcDay(new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString());
    dailyViews.push({ date, views: viewsByDay.get(date) ?? 0 });
  }

  return {
    rangeDays: RANGE_DAYS,
    pageViews,
    uniqueSessions: sessions.size,
    interactions,
    viewsToday,
    dailyViews,
    topPages: toSortedCounts(pathCounts, 6),
    languages: toSortedCounts(languageCounts, 6),
    devices: toSortedCounts(deviceCounts, 3),
    clickTargets: toSortedCounts(targetCounts, 6),
    recentEvents: rows.slice(0, 12).map((row) => ({
      occurredAt: row.occurred_at,
      type: row.event_type,
      path: row.path,
      target: row.target,
      language: row.language,
      device: row.device,
    })),
    truncated: rows.length >= ROW_LIMIT,
  };
}
