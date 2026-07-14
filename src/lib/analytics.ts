/**
 * Client-side analytics for the public landing pages.
 *
 * Events are posted to /api/track (see src/app/api/track/route.ts), which
 * validates them and inserts into public.landing_events. The admin dashboard
 * (/admin) aggregates that table.
 *
 * Tracking is anonymous by design: a random per-tab session id (sessionStorage)
 * groups events into visits — no cookies, no user identifiers.
 */

export const TRACKED_EVENT_TYPES = [
  'page_view',
  'language_switch',
  'cta_click',
  'social_click',
  'nav_click',
  'click',
  'move',
] as const;
export type TrackedEventType = (typeof TRACKED_EVENT_TYPES)[number];

export interface TrackEventInput {
  type: TrackedEventType;
  /** What was interacted with, e.g. 'hero-cta', 'hiterratech:facebook', 'th' */
  target?: string;
  /** First page view of a session carries the document referrer */
  referrer?: string;
  /** 'click' events: X as a fraction of the viewport width (0..1) */
  x?: number;
  /** 'click' events: Y as a fraction of the full document height (0..1) */
  y?: number;
}

const SESSION_KEY = 'ktd-session-id';

function getSessionId(): string {
  try {
    let id = globalThis.sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = globalThis.crypto.randomUUID();
      globalThis.sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // sessionStorage can be unavailable (private browsing); still record the event
    return 'anonymous';
  }
}

function getDevice(): 'mobile' | 'tablet' | 'desktop' {
  const width = globalThis.innerWidth || 1024;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Record one analytics event. Safe to call anywhere in client code:
 * no-ops during SSR and on /admin pages, and never throws.
 */
export function track(event: TrackEventInput): void {
  if (typeof globalThis.window === 'undefined') return;

  // Skip embedded views (e.g. the /admin/heatmap preview iframe) — only
  // record what real visitors do in a top-level tab.
  if (globalThis.window.self !== globalThis.window.top) return;

  const path = globalThis.location.pathname;
  if (path.startsWith('/admin')) return;

  const payload = JSON.stringify({
    session_id: getSessionId(),
    event_type: event.type,
    path,
    language: globalThis.localStorage?.getItem('ktd-language') ?? undefined,
    referrer: event.referrer || undefined,
    target: event.target || undefined,
    device: getDevice(),
    x: event.x,
    y: event.y,
  });

  try {
    // sendBeacon survives page unloads (e.g. outbound social link clicks)
    const sent = globalThis.navigator.sendBeacon?.(
      '/api/track',
      new Blob([payload], { type: 'application/json' })
    );
    if (!sent) {
      void fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => undefined);
    }
  } catch {
    // Analytics must never break the page
  }
}
