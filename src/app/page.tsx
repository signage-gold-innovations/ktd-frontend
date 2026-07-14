import type { Metadata } from 'next';
import { SITE_URL } from '@/config/site';
import { getSubCompanyConfig } from '@/config/sub-companies';
import { getLandingContent } from '@/services/landing';

import { About } from '@/components/landing/about';
import { CompanyShowcase } from '@/components/landing/company-showcase';
import { Footer } from '@/components/landing/footer';
import { Hero } from '@/components/landing/hero';
import { Navbar } from '@/components/landing/navbar';
import { Services } from '@/components/landing/services';

import type { LandingContent } from '@/types/landing';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

/**
 * JSON-LD structured data, built from the live CMS content so search and AI
 * answer engines always see the same names/descriptions as human visitors.
 * Placeholder social links (google.com) are filtered out of sameAs.
 */
function buildJsonLd(content: LandingContent) {
  const isRealLink = (href?: string) => Boolean(href && !href.includes('google.com'));

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KTD Group',
    description:
      'Full-Spectrum Technopreneur bridging deep technical engineering and entrepreneurial growth.',
    url: SITE_URL,
    sameAs: [],
    knowsAbout: [
      'Satellite Data Engineering',
      'Rock Quarry Operations',
      'Brick Manufacturing',
      'Automated Infrastructure',
    ],
    subOrganization: content.companies.map((company) => ({
      '@type': 'Organization',
      name: company.name.en,
      alternateName: company.name.th !== company.name.en ? company.name.th : undefined,
      description: company.description.en,
      // Companies with a dedicated page get its URL; others anchor to their showcase section
      url: getSubCompanyConfig(company.slug)
        ? `${SITE_URL}/${company.slug}`
        : `${SITE_URL}/#${company.slug}`,
      sameAs: Object.values(company.socialLinks).filter(isRealLink),
      parentOrganization: { '@type': 'Organization', name: 'KTD Group', url: SITE_URL },
    })),
  };
}

export default async function Home() {
  // CMS content merged over static defaults (cached, tagged for admin invalidation)
  const content = await getLandingContent();
  const jsonLd = buildJsonLd(content);

  return (
    <>
      {/* Structured data for SEO — not visible to users */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero backgroundImage={content.heroImages.background} />
        <About />
        <Services images={content.serviceImages} />
        {content.companies.map((company) => (
          <CompanyShowcase
            key={company.slug}
            id={company.slug}
            bgColor={company.bgColor}
            socialLinks={company.socialLinks}
            images={company.images}
            name={company.name}
            description={company.description}
          />
        ))}
      </main>
      <Footer />
    </>
  );
}
