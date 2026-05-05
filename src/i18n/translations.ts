export type Language = 'en' | 'th';

/**
 * Translation dictionary — add/edit text here for each section.
 * Key structure: translations[lang][section][key]
 */
export const translations = {
  en: {
    nav: {
      companyName: 'Company Name',
      home: 'Home',
      about: 'About',
      services: 'Services',
      contact: 'Contact',
    },
    hero: {
      title: 'Full-Spectrum Technopreneur',
      subtitle: 'Engineering the solve. Scaling the venture.',
      cta: 'Explore Our Services',
    },
    about: {
      title: 'About Us',
    },
    services: {
      title: 'Our Services',
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
  },
  th: {
    nav: {
      companyName: 'ชื่อบริษัท',
      home: 'หน้าแรก',
      about: 'เกี่ยวกับเรา',
      services: 'บริการ',
      contact: 'ติดต่อเรา',
    },
    hero: {
      title: 'ผู้ประกอบการเทคโนโลยีครบวงจร',
      subtitle: 'ออกแบบทางแก้ปัญหาด้วยวิศวกรรม ขยายธุรกิจให้เติบโตอย่างก้าวกระโดด',
      cta: 'ดูบริการของเรา',
    },
    about: {
      title: 'เกี่ยวกับเรา',
    },
    services: {
      title: 'บริการของเรา',
    },
    footer: {
      rights: 'สงวนลิขสิทธิ์ทุกประการ',
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
  },
} as const;

export type Translations = typeof translations.en;
