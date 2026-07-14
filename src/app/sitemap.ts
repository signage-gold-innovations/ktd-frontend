import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';
import { SUB_COMPANIES } from '@/config/sub-companies';

export default function sitemap(): MetadataRoute.Sitemap {
  const subCompanyPages = Object.keys(SUB_COMPANIES).map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    ...subCompanyPages,
  ];
}
