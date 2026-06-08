/**
 * Company configuration — single source of truth for all company data.
 * Text content is kept in src/i18n/translations.ts, but structural/visual
 * config (colors, images, links) lives here.
 *
 * To add a new company:
 *  1. Add its translation keys to translations.ts
 *  2. Add its entry here
 *  3. Drop images in public/assets/landing/companies/<slug>/
 */

export interface SocialLinks {
  website?: string;
  facebook?: string;
  instagram?: string;
}

export interface CompanyConfig {
  /** Matches the key in translations.companies */
  slug: 'hiterratech' | 'silachai' | 'kitthana';
  /** CSS color or gradient string for the section background */
  bgColor: string;
  /** Optional decorative image rendered at the bottom of the section */
  bottomImage?: string;
  socialLinks: SocialLinks;
  /** Ordered list of image paths relative to /public */
  images: string[];
}

export const COMPANIES: CompanyConfig[] = [
  {
    slug: 'hiterratech',
    bgColor: '#000000',
    socialLinks: {
      website: 'https://www.google.com/',
      facebook: 'https://www.google.com/',
      instagram: 'https://www.google.com/',
    },
    images: [
      '/assets/landing/companies/hiterratech/hiterratech1.jpg',
      '/assets/landing/companies/hiterratech/hiterratech2.jpg',
      '/assets/landing/companies/hiterratech/hiterratech3.jpg',
      '/assets/landing/companies/hiterratech/hiterratech4.jpg',
    ],
  },
  {
    slug: 'silachai',
    bgColor: 'linear-gradient(360deg, #010214 0%, #39005D 100%)',
    socialLinks: {
      website: 'https://www.google.com/',
      facebook: 'https://www.google.com/',
      instagram: 'https://www.google.com/',
    },
    images: [
      '/assets/landing/companies/silachai/silachai1.jpg',
      '/assets/landing/companies/silachai/silachai2.png',
      '/assets/landing/companies/silachai/silachai3.jpg',
      '/assets/landing/companies/silachai/silachai4.jpg',
    ],
  },
  {
    slug: 'kitthana',
    bgColor: '#000000',
    bottomImage: '/assets/landing/companies/company-bottom.png',
    socialLinks: {
      website: 'https://www.google.com/',
      facebook: 'https://www.google.com/',
      instagram: 'https://www.google.com/',
    },
    images: [
      '/assets/landing/companies/kitthana/kitthana1.jpg',
      '/assets/landing/companies/kitthana/kitthana2.jpg',
      '/assets/landing/companies/kitthana/kitthana3.png',
      '/assets/landing/companies/kitthana/kitthana4.jpg',
    ],
  },
];
