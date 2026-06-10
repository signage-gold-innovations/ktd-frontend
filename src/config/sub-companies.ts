/**
 * Sub-company site configuration — theming, content, and structure
 * for individual company landing pages (e.g., /hiterratech, /silachai, /kitthana).
 *
 * Each sub-company reuses the same page layout/components but differs in:
 * - Color scheme (primary, accent, background, text)
 * - Content (hero text, about, services, solutions)
 * - Images
 *
 * To add a new sub-company page:
 *  1. Add its config entry below
 *  2. Add images to public/assets/companies/<slug>/
 *  3. The dynamic route [company]/page.tsx handles the rest
 */

export interface SubCompanyTheme {
  /** Primary brand color */
  primary: string;
  /** Accent/secondary color */
  accent: string;
  /** Page background color or gradient */
  background: string;
  /** Header background */
  headerBg: string;
  /** Header text color */
  headerText: string;
  /** Section background alternating */
  sectionBgAlt: string;
  /** Footer background */
  footerBg: string;
}

export interface SubCompanyNav {
  logo?: string;
  links: { label: string; href: string }[];
}

export interface SubCompanyHero {
  /** First line of title — black */
  titleLine1: string;
  /** Second line of title — accent color */
  titleLine2: string;
  subtitle: string;
  backgroundImage?: string;
  /** Two hero images displayed on the right side */
  images?: {
    /** Smaller image (192×192) */
    small: string;
    /** Larger image (430×430) */
    large: string;
  };
  cta?: { label: string; href: string };
}

export interface SubCompanyAbout {
  /** Small uppercase label above the title */
  label: string;
  title: string;
  /** Description supports inline highlights via `highlights` array.
   *  Plain string for the body copy; highlighted phrases are applied separately. */
  description: string;
  /** Inline highlighted phrases within the description.
   *  Each entry specifies the phrase and optional font weight override.
   *  Defaults to semibold (600) if weight is not specified. */
  descriptionHighlights?: { phrase: string; weight?: 'semibold' | 'bold'; color?: string }[];
  /** Stats shown in the bottom bar */
  stats?: { value: string; label: string }[];
  /** Service cards shown on the right side (scrollable second view) */
  cards?: {
    title: string;
    description: string;
    icon: string;
    /** If true, card gets gradient bg and white text */
    highlighted?: boolean;
  }[];
}

export interface SubCompanyService {
  title: string;
  description: string;
  image?: string;
  /** Icon path from public/assets/sub-company/services/ */
  icon?: string;
}

export interface SubCompanyServices {
  title: string;
  /** Subtitle shown below the title */
  subtitle?: string;
  items: SubCompanyService[];
}

export interface SubCompanySolution {
  /** "Ready for" prefix text */
  titlePrefix: string;
  /** Highlighted word (e.g. "Solution?") */
  titleHighlight: string;
  description: string;
  cta: { label: string; href: string };
}

export interface SubCompanyFooter {
  /** Company name shown in brand column */
  brandName: string;
  copyright: string;
  /** Navigation column links */
  navLinks: { label: string; href: string }[];
  /** Specializations column items */
  specializations: { label: string; href?: string }[];
  /** Social column links */
  socialLinks: { label: string; href: string }[];
}

export interface SubCompanyConfig {
  slug: 'hiterratech' | 'silachai' | 'kitthana';
  name: string;
  theme: SubCompanyTheme;
  nav: SubCompanyNav;
  hero: SubCompanyHero;
  about: SubCompanyAbout;
  services: SubCompanyServices;
  solution: SubCompanySolution;
  footer: SubCompanyFooter;
}

export const SUB_COMPANIES: Record<string, SubCompanyConfig> = {
  hiterratech: {
    slug: 'hiterratech',
    name: 'Hiterratech',
    theme: {
      primary: '#7A00CF',
      accent: '#6A1CF6',
      background: '#FFFFFF',
      headerBg: '#FFFFFF',
      headerText: '#000000',
      sectionBgAlt: '#F9FAFB',
      footerBg: '#111827',
    },
    nav: {
      links: [
        { label: 'Home', href: '#home' },
        { label: 'About', href: '#about' },
        { label: 'Services', href: '#services' },
        { label: 'Solution', href: '#solution' },
        { label: 'Contact', href: '#contact' },
      ],
    },
    hero: {
      titleLine1: 'Smarter Mining &',
      titleLine2: 'Industrial Solutions',
      subtitle:
        'Integrated solution for your business and engineering projects with specialization in mining industry, smart ICT solution, and innovative technology.',
      images: {
        small: '/assets/sub-company/hero/hero-image-1.jpg',
        large: '/assets/sub-company/hero/hero-image-2.jpg',
      },
      cta: { label: 'Get Started', href: '#about' },
    },
    about: {
      label: 'LET US KNOW HOW WE CAN HELP',
      title: 'Need solution\nFor your Project?',
      description:
        "Your Business Solution does not limited to just what's available in your area. Explore Unlimited Possibilities with solution from all around the world.",
      descriptionHighlights: [
        { phrase: 'Business Solution', weight: 'semibold', color: '#7A00CF' },
        { phrase: 'Unlimited Possibilities', weight: 'bold', color: '#A92DFF' },
      ],
      stats: [
        { value: '100%', label: 'SYSTEM INTEGRITY' },
        { value: '20+', label: 'YEARS COMBINED EXPERTISE' },
      ],
      cards: [
        {
          title: 'Hiterratech Energy',
          description:
            'We can source solar panels and auxiliary equipments for your renewable energy solution.',
          icon: '/assets/sub-company/about/sun-icon.svg',
        },
        {
          title: 'Hiterratech Aerial',
          description:
            'We also specialize in aerial imaging and 3D reconstruction solution for your industrial requirements.',
          icon: '/assets/sub-company/about/map-icon.svg',
          highlighted: true,
        },
        {
          title: 'Hiterratech Trading',
          description:
            'We can help you source any tradable goods from trustworthy suppliers all around the world for all your requirements.',
          icon: '/assets/sub-company/about/trading-icon.svg',
        },
        {
          title: 'Hiterratech Mining',
          description:
            'We can source machineries, equipments, and spare parts for your crushing and mineral processing plants.',
          icon: '/assets/sub-company/about/gallery-icon.svg',
        },
      ],
    },
    services: {
      title: 'Our Service',
      subtitle:
        'Providing the elasticity and technical depth required for modern industrial engineering.',
      items: [
        {
          title: 'SLC Crushing Plant Upgrade',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
          icon: '/assets/sub-company/services/engineer-icon.svg',
        },
        {
          title: 'Mining Pit Aerial Imaging',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
          icon: '/assets/sub-company/services/cloud-icon.svg',
        },
        {
          title: 'Sadao HED Installation',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
          icon: '/assets/sub-company/services/tool-icon.svg',
        },
      ],
    },
    solution: {
      titlePrefix: 'Ready for',
      titleHighlight: 'Solution?',
      description:
        "Join the ranks of global innovators who have transitioned to HiTerraTech's kinetic infrastructure.",
      cta: { label: 'Contact Us', href: '#contact' },
    },
    footer: {
      brandName: 'HITERRATECH',
      copyright: '© 2026 HITERRATECH. BUSINESS AND\nSYSTEMS ENGINEERING SPECIALISTS.',
      navLinks: [
        { label: 'HOME', href: '#home' },
        { label: 'SOLUTIONS', href: '#solution' },
        { label: 'ABOUT', href: '#about' },
      ],
      specializations: [
        { label: 'MINING INDUSTRY' },
        { label: 'SMART ICT' },
        { label: 'INNOVATIVE TECH' },
      ],
      socialLinks: [
        { label: 'LINKEDIN', href: 'https://www.linkedin.com/' },
        { label: 'TWITTER', href: 'https://www.twitter.com/' },
        { label: 'GITHUB', href: 'https://www.github.com/' },
      ],
    },
  },
};

/**
 * Get sub-company config by slug. Returns undefined if not found.
 */
export function getSubCompanyConfig(slug: string): SubCompanyConfig | undefined {
  return SUB_COMPANIES[slug];
}
