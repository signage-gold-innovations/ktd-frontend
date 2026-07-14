/**
 * Canonical site origin — used for metadataBase, robots, sitemap, and JSON-LD.
 * Override per environment with NEXT_PUBLIC_SITE_URL (no trailing slash).
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ktdgroup.co';
