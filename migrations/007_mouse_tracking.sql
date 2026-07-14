-- Add 'move' event type for mouse movement tracking
ALTER TABLE public.landing_events
  DROP CONSTRAINT IF EXISTS landing_events_event_type_check;
ALTER TABLE public.landing_events
  ADD CONSTRAINT landing_events_event_type_check CHECK (
    event_type IN (
      'page_view', 'language_switch', 'cta_click', 'social_click', 'nav_click', 'click', 'move'
    )
  );
