import { translations } from '@/i18n/translations';

import { About } from '@/components/landing/about';
import { CompanyShowcase } from '@/components/landing/company-showcase';
import { Footer } from '@/components/landing/footer';
import { Hero } from '@/components/landing/hero';
import { Navbar } from '@/components/landing/navbar';
import { Services } from '@/components/landing/services';

const companies = [
  {
    name: {
      en: translations.en.companies.hiterratech.name,
      th: translations.th.companies.hiterratech.name,
    },
    bgColor: '#000000',
    description: {
      en: translations.en.companies.hiterratech.description,
      th: translations.th.companies.hiterratech.description,
    },
    socialLinks: {
      website: 'https://www.google.com/',
      facebook: 'https://www.google.com/',
      instagram: 'https://www.google.com/',
    },
    // Place images in: public/assets/companies/hiterratech/
    images: [
      '/assets/companies/hiterratech/hiterratech1.jpg',
      '/assets/companies/hiterratech/hiterratech2.jpg',
      '/assets/companies/hiterratech/hiterratech3.jpg',
      '/assets/companies/hiterratech/hiterratech4.jpg',
    ],
  },
  {
    name: {
      en: translations.en.companies.silachai.name,
      th: translations.th.companies.silachai.name,
    },
    bgColor: 'linear-gradient(360deg, #010214 0%, #39005D 100%)',
    description: {
      en: translations.en.companies.silachai.description,
      th: translations.th.companies.silachai.description,
    },
    socialLinks: {
      website: 'https://www.google.com/',
      facebook: 'https://www.google.com/',
      instagram: 'https://www.google.com/',
    },
    // Place images in: public/assets/companies/silachai/
    images: [
      '/assets/companies/silachai/silachai1.jpg',
      '/assets/companies/silachai/silachai2.png',
      '/assets/companies/silachai/silachai3.jpg',
      '/assets/companies/silachai/silachai4.jpg',
    ],
  },
  {
    name: {
      en: translations.en.companies.kitthana.name,
      th: translations.th.companies.kitthana.name,
    },
    bgColor: '#000000',
    bottomImage: '/assets/companies/company-bottom.png',
    description: {
      en: translations.en.companies.kitthana.description,
      th: translations.th.companies.kitthana.description,
    },
    socialLinks: {
      website: 'https://www.google.com/',
      facebook: 'https://www.google.com/',
      instagram: 'https://www.google.com/',
    },
    // Place images in: public/assets/companies/kitthana/
    images: [
      '/assets/companies/kitthana/kitthana1.jpg',
      '/assets/companies/kitthana/kitthana2.jpg',
      '/assets/companies/kitthana/kitthana3.png',
      '/assets/companies/kitthana/kitthana4.jpg',
    ],
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        {companies.map((company) => (
          <CompanyShowcase key={company.name.en} {...company} />
        ))}
      </main>
      <Footer />
    </>
  );
}
