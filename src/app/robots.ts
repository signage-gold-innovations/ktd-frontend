import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';

/**
 * Robots policy: the public site is open to all crawlers — including AI
 * search/answer engines, which are listed explicitly so the intent is clear —
 * while the admin CMS stays out of every index.
 */
export default function robots(): MetadataRoute.Robots {
  const aiCrawlers = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-Web',
    'anthropic-ai',
    'PerplexityBot',
    'Google-Extended',
    'meta-externalagent',
    'CCBot',
  ];

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/admin' },
      { userAgent: aiCrawlers, allow: '/', disallow: '/admin' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
