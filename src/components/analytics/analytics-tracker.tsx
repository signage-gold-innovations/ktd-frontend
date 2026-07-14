'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

import { track, type TrackedEventType } from '@/lib/analytics';

const CLICK_EVENT_TYPES: TrackedEventType[] = ['cta_click', 'social_click', 'nav_click'];

/**
 * Records anonymous usage of the public site:
 *  - a page_view on every route change (the first one carries document.referrer)
 *  - clicks on any element marked with data-track="cta_click|social_click|nav_click"
 *    (+ optional data-track-target="what-was-clicked")
 *
 * Mounted once in the root layout; track() itself ignores /admin routes.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const isFirstView = useRef(true);

  useEffect(() => {
    track({
      type: 'page_view',
      referrer: isFirstView.current ? globalThis.document.referrer || undefined : undefined,
    });
    isFirstView.current = false;
  }, [pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;

      // Every click feeds the /admin/heatmap density map, with coordinates
      // normalized to viewport width and full document height.
      const doc = globalThis.document.documentElement;
      const width = globalThis.innerWidth || doc.clientWidth;
      const height = doc.scrollHeight || 1;
      track({
        type: 'click',
        x: Math.min(1, Math.max(0, event.clientX / width)),
        y: Math.min(1, Math.max(0, (event.clientY + globalThis.scrollY) / height)),
      });

      // Named interactions (CTA/social/nav) additionally feed the dashboard
      const tracked = target?.closest?.('[data-track]');
      if (!tracked) return;

      const type = tracked.getAttribute('data-track') as TrackedEventType | null;
      if (!type || !CLICK_EVENT_TYPES.includes(type)) return;

      track({ type, target: tracked.getAttribute('data-track-target') ?? undefined });
    }

    // Capture phase so outbound links (social icons) are recorded before navigation
    globalThis.document.addEventListener('click', handleClick, true);
    return () => globalThis.document.removeEventListener('click', handleClick, true);
  }, []);

  // Mouse movement tracking — throttled to reduce event volume
  useEffect(() => {
    let lastTrackTime = 0;
    const THROTTLE_MS = 200;

    function handleMouseMove(event: MouseEvent) {
      const now = Date.now();
      if (now - lastTrackTime < THROTTLE_MS) return;
      lastTrackTime = now;

      const doc = globalThis.document.documentElement;
      const width = globalThis.innerWidth || doc.clientWidth;
      const height = doc.scrollHeight || 1;
      track({
        type: 'move',
        x: Math.min(1, Math.max(0, event.clientX / width)),
        y: Math.min(1, Math.max(0, (event.clientY + globalThis.scrollY) / height)),
      });
    }

    globalThis.document.addEventListener('mousemove', handleMouseMove);
    return () => globalThis.document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return null;
}
