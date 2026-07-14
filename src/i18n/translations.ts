/**
 * Supported site languages.
 *
 * To add a language: append its code here, add an entry to LANGUAGES below,
 * and (optionally) a static dictionary — languages without one fall back to
 * English until an admin fills in the text via /admin/content.
 */
export const LANGUAGE_CODES = ['en', 'th', 'zh'] as const;
export type Language = (typeof LANGUAGE_CODES)[number];

export const DEFAULT_LANGUAGE: Language = 'en';

export interface LanguageInfo {
  code: Language;
  /** Short label shown in the public language switcher */
  label: string;
  /** English name, used in the admin CMS field labels */
  name: string;
  /** Native name, used for accessibility labels */
  nativeName: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', label: 'EN', name: 'English', nativeName: 'English' },
  { code: 'th', label: 'TH', name: 'Thai', nativeName: 'ไทย' },
  { code: 'zh', label: '中文', name: 'Chinese', nativeName: '中文' },
];

export function isLanguage(value: string): value is Language {
  return (LANGUAGE_CODES as readonly string[]).includes(value);
}

/**
 * Translation dictionary — add/edit text here for each section.
 * Key structure: translations[lang][section][key]
 *
 * Structural/visual config (images, colors, links) lives in src/config/companies.ts
 */
const en = {
  nav: {
    companyName: 'KTD Group',
    home: 'Home',
    about: 'About',
    services: 'Services',
    contact: 'Contact',
  },
  hero: {
    presenterName: 'Tod Sirawattananon',
    title: 'Full-Spectrum Technopreneur',
    subtitle: 'Engineering the solve. Scaling the venture.',
    cta: 'Explore Our Ventures',
  },
  about: {
    title: 'Who Are We?',
    p1: 'We bridge the gap between deep technical logic and entrepreneurial growth.',
    p2: "We don't just build tools; We engineer the systematic solve—creating the robust infrastructure and automated workflows that allow a venture to scale without breaking.",
    p3: 'From the engine room to the boardroom, We are an all-in-one technologist focused on what works',
    ceoName: 'Lorem ipsum dolor sit amet',
    ceoTitle: 'CEO',
    card1Title: 'Systematic Solve',
    card1Desc: 'Engineering robust, end-to-end solutions',
    card2Title: 'Venture Scaling',
    card2Desc:
      'Bridging the gap between technical logic and business growth to scale without breaking.',
    card3Title: 'Automated Infrastructure',
    card3Desc:
      'Creating automated workflows and solid infrastructure from the engine room to the boardroom.',
  },
  services: {
    title: 'Our Services & Ventures',
    card1Label: 'HITERRATECH',
    card1Desc: 'The Intelligent View (Engineering the Solve via Data)',
    card2Label: 'ศิลาชัยเจริญ',
    card2Desc: 'The Intelligent View (Engineering the Solve via Data)',
    card3Label: 'กิจธนาทรัพย์',
    card3Desc: 'The Intelligent View (Engineering the Solve via Data)',
  },
  footer: {
    rights: 'All rights reserved.',
  },
  social: {
    website: 'Website',
    facebook: 'Facebook',
    instagram: 'Instagram',
  },
  companies: {
    hiterratech: {
      name: 'Hiterratech',
      description:
        'Integrated solution for your business and engineering projects with specialisation in mining industry, smart ICT solution, and innovative technology.',
    },
    silachai: {
      name: 'Silachai Charoen',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
    kitthana: {
      name: 'Kitthana Sap',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
  },
};

export type Translations = typeof en;

const th: Translations = {
  nav: {
    companyName: 'กลุ่มบริษัท KTD',
    home: 'หน้าแรก',
    about: 'เกี่ยวกับเรา',
    services: 'บริการ',
    contact: 'ติดต่อเรา',
  },
  hero: {
    presenterName: 'Tod Sirawattananon',
    title: 'ผู้ประกอบการเทคโนโลยีครบวงจร',
    subtitle: 'ออกแบบทางแก้ปัญหาด้วยวิศวกรรม ขยายธุรกิจให้เติบโตอย่างก้าวกระโดด',
    cta: 'ดูบริการของเรา',
  },
  about: {
    title: 'เราคือใคร?',
    p1: 'เราเป็นตัวกลางเชื่อมโยงระหว่างตรรกะทางเทคนิคที่ลึกซึ้งกับการเติบโตของธุรกิจ',
    p2: 'ผมไม่ได้แค่สร้างเครื่องมือ เราออกแบบระบบการแก้ปัญหา — สร้างโครงสร้างพื้นฐานที่แข็งแกร่งและระบบอัตโนมัติที่ช่วยให้ธุรกิจขยายตัวได้โดยไม่สะดุด',
    p3: 'ตั้งแต่ห้องเครื่องไปจนถึงห้องประชุมคณะกรรมการ เราคือนักเทคโนโลยีแบบครบวงจรที่โฟกัสในสิ่งที่ใช้งานได้จริง',
    ceoName: 'Lorem ipsum dolor sit amet',
    ceoTitle: 'CEO',
    card1Title: 'การแก้ปัญหาเชิงระบบ',
    card1Desc: 'ออกแบบทางแก้ปัญหาที่แข็งแกร่งและครบวงจร เชื่อมโยงทุกส่วนตั้งแต่ข้อมูล',
    card2Title: 'การขยายธุรกิจและการเติบโต',
    card2Desc: 'เชื่อมช่องว่างระหว่างเทคนิคกับการเติบโตเพื่อขยายขนาดธุรกิจอย่างมั่นคง',
    card3Title: 'โครงสร้างพื้นฐานอัตโนมัติ',
    card3Desc: 'สร้างระบบการทำงานอัตโนมัติและโครงสร้างที่ยอดเยี่ยม รองรับการทำงานในทุกระดับ',
  },
  services: {
    title: 'บริการและธุรกิจในเครือ',
    card1Label: 'HITERRATECH',
    card1Desc: 'The Intelligent View (Engineering the Solve via Data)',
    card2Label: 'ศิลาชัยเจริญ',
    card2Desc: 'The Intelligent View (Engineering the Solve via Data)',
    card3Label: 'กิจธนาทรัพย์',
    card3Desc: 'The Intelligent View (Engineering the Solve via Data)',
  },
  footer: {
    rights: 'All rights reserved.',
  },
  social: {
    website: 'Website',
    facebook: 'Facebook',
    instagram: 'Instagram',
  },
  companies: {
    hiterratech: {
      name: 'Hiterratech',
      description:
        'Integrated solution for your business and engineering projects with specialisation in mining industry, smart ICT solution, and innovative technology.',
    },
    silachai: {
      name: 'ศิลาชัยเจริญ',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
    kitthana: {
      name: 'กิจธนาทรัพย์',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
  },
};

const zh: Translations = {
  nav: {
    companyName: 'KTD 集团',
    home: '首页',
    about: '关于我们',
    services: '服务',
    contact: '联系我们',
  },
  hero: {
    presenterName: 'Tod Sirawattananon',
    title: '全方位科技创业家',
    subtitle: '以工程思维解决问题,以规模化思维发展企业',
    cta: '探索我们的业务',
  },
  about: {
    title: '我们是谁?',
    p1: '我们是连接深度技术逻辑与企业增长之间的桥梁。',
    p2: '我们不只是打造工具;我们以工程方法系统性地解决问题——构建稳健的基础设施与自动化工作流,让企业在扩张中稳步前行。',
    p3: '从机房到董事会,我们是专注于实效的全能型技术专家',
    ceoName: 'Lorem ipsum dolor sit amet',
    ceoTitle: 'CEO',
    card1Title: '系统性解决方案',
    card1Desc: '打造稳健的端到端解决方案',
    card2Title: '企业规模化',
    card2Desc: '连接技术逻辑与业务增长,实现稳健扩张。',
    card3Title: '自动化基础设施',
    card3Desc: '从机房到董事会,构建自动化工作流与坚实的基础设施。',
  },
  services: {
    title: '我们的服务与业务',
    card1Label: 'HITERRATECH',
    card1Desc: 'The Intelligent View (Engineering the Solve via Data)',
    card2Label: 'ศิลาชัยเจริญ',
    card2Desc: 'The Intelligent View (Engineering the Solve via Data)',
    card3Label: 'กิจธนาทรัพย์',
    card3Desc: 'The Intelligent View (Engineering the Solve via Data)',
  },
  footer: {
    rights: '版权所有。',
  },
  social: {
    website: '官网',
    facebook: 'Facebook',
    instagram: 'Instagram',
  },
  companies: {
    hiterratech: {
      name: 'Hiterratech',
      description:
        'Integrated solution for your business and engineering projects with specialisation in mining industry, smart ICT solution, and innovative technology.',
    },
    silachai: {
      name: 'Silachai Charoen',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
    kitthana: {
      name: 'Kitthana Sap',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
  },
};

export const translations: Record<Language, Translations> = { en, th, zh };
