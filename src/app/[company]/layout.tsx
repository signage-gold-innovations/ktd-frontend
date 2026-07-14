import type { Metadata } from 'next';
import { getSubCompanyConfig } from '@/config/sub-companies';

/**
 * Server layout for sub-company pages — exists to provide per-company
 * metadata (title/description/canonical/OG), since the page itself is a
 * client component and cannot export generateMetadata.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ company: string }>;
}): Promise<Metadata> {
  const { company } = await params;
  const config = getSubCompanyConfig(company);

  if (!config) {
    return { title: 'Company not found — KTD Group', robots: { index: false } };
  }

  const title = `${config.name} — ${config.hero.titleLine1} ${config.hero.titleLine2}`;
  const description = config.hero.subtitle;

  return {
    title,
    description,
    alternates: { canonical: `/${config.slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/${config.slug}`,
    },
    twitter: { card: 'summary', title, description },
  };
}

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
