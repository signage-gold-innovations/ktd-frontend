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

  return null;
}
