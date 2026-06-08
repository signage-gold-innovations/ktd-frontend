import { COMPANIES } from '@/config/companies';
import { translations } from '@/i18n/translations';

import { About } from '@/components/landing/about';
import { CompanyShowcase } from '@/components/landing/company-showcase';
import { Footer } from '@/components/landing/footer';
import { Hero } from '@/components/landing/hero';
import { Navbar } from '@/components/landing/navbar';
import { Services } from '@/components/landing/services';

/** JSON-LD structured data for search engines */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'KTD Group',
  description:
    'Full-Spectrum Technopreneur bridging deep technical engineering and entrepreneurial growth.',
  url: 'https://ktdgroup.co',
  sameAs: [],
  knowsAbout: [
    'Satellite Data Engineering',
    'Rock Quarry Operations',
    'Brick Manufacturing',
    'Automated Infrastructure',
  ],
};

export default function Home() {
  return (
    <>
      {/* Structured data for SEO — not visible to users */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        {COMPANIES.map((company) => (
          <CompanyShowcase
            key={company.slug}
            id={company.slug}
            bgColor={company.bgColor}
            socialLinks={company.socialLinks}
            images={company.images}
            name={{
              en: translations.en.companies[company.slug].name,
              th: translations.th.companies[company.slug].name,
            }}
            description={{
              en: translations.en.companies[company.slug].description,
              th: translations.th.companies[company.slug].description,
            }}
          />
        ))}
      </main>
      <Footer />
    </>
  );
}
