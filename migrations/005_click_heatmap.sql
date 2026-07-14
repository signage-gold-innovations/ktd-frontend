/**
 * Supabase Migration: Click coordinates for the admin heatmap
 *
 * Extends public.landing_events so every click on the public site can be
 * recorded as a 'click' event with normalized page coordinates:
 *  - x_ratio — clientX / viewport width   (0..1, left → right)
 *  - y_ratio — pageY / document height    (0..1, top → bottom)
 *
 * The /admin/heatmap page overlays these points on the live landing page,
 * filtered by device bucket (mobile / tablet / desktop) since layouts differ.
 * RLS is unchanged: anon insert-only, admin read.
 */

-- Allow the new 'click' event type
ALTER TABLE public.landing_events
  DROP CONSTRAINT IF EXISTS landing_events_event_type_check;
ALTER TABLE public.landing_events
  ADD CONSTRAINT landing_events_event_type_check CHECK (
    event_type IN (
      'page_view', 'language_switch', 'cta_click', 'social_click', 'nav_click', 'click'
    )
  );

-- Normalized click coordinates (only set on 'click' events)
ALTER TABLE public.landing_events
  ADD COLUMN IF NOT EXISTS x_ratio REAL CHECK (x_ratio IS NULL OR (x_ratio >= 0 AND x_ratio <= 1)),
  ADD COLUMN IF NOT EXISTS y_ratio REAL CHECK (y_ratio IS NULL OR (y_ratio >= 0 AND y_ratio <= 1));

COMMENT ON COLUMN public.landing_events.x_ratio IS 'Click X as a fraction of the viewport width (0..1); NULL for non-click events';
COMMENT ON COLUMN public.landing_events.y_ratio IS 'Click Y as a fraction of the full document height (0..1); NULL for non-click events';
