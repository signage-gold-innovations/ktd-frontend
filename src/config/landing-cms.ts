/**
 * Constants shared between the landing page data layer and the admin CMS.
 */

/**
 * Cache tag for all landing content fetched in src/services/landing.ts.
 * Admin server actions call updateTag(LANDING_CACHE_TAG) after a write so
 * the public page reflects edits immediately.
 */
export const LANDING_CACHE_TAG = 'landing-content';

/** Public Supabase Storage bucket holding CMS-uploaded landing images */
export const LANDING_MEDIA_BUCKET = 'landing-media';

/** Static fallback images — used until an admin overrides them in the CMS */
export const DEFAULT_HERO_BACKGROUND = '/assets/landing/hero/hero-background.png';

export const DEFAULT_SERVICE_IMAGES: [string, string, string] = [
  '/assets/landing/services/service1.jpg',
  '/assets/landing/services/service2.jpg',
  '/assets/landing/services/service3.png',
];
