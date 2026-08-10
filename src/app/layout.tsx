import type { Metadata } from 'next';
import { Anuphan, Manrope } from 'next/font/google';

import './globals.css';

import { SITE_URL } from '@/config/site';
import { LanguageProvider } from '@/contexts/language-context';
import { DEFAULT_LANGUAGE } from '@/i18n/translations';
import { getLandingContent } from '@/services/landing';

import { AnalyticsTracker } from '@/components/analytics/analytics-tracker';
import { LanguageHtmlWrapper } from '@/components/landing/language-html-wrapper';

import { cn } from '@/lib/utils';

/**
 * Anuphan — primary typeface for KTD landing page (Latin + Thai).
 * Manrope — typeface for sub-company pages (e.g. Hiterratech).
 */
const anuphan = Anuphan({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-anuphan',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

/** Static fallbacks — used when the CMS seo section is empty or unreachable */
const FALLBACK_META_TITLE = 'KTD Group — Full-Spectrum Technopreneur';
const FALLBACK_META_DESCRIPTION =
  'KTD Group bridges deep technical engineering and entrepreneurial growth across satellite data, rock quarry, and brick manufacturing ventures.';

/**
 * Tab title and meta description are CMS-editable (admin → Content → SEO /
 * Metadata). We read the cached landing content and use the default language's
 * seo block, falling back to the static strings above. Metadata is
 * server-rendered, so this reflects the base (default) language; a live
 * per-language title swap on the client is not wired up.
 */
export async function generateMetadata(): Promise<Metadata> {
  const content = await getLandingContent();
  const seo = content.translations[DEFAULT_LANGUAGE]?.seo;
  const title = seo?.metaTitle?.trim() || FALLBACK_META_TITLE;
  const description = seo?.metaDescription?.trim() || FALLBACK_META_DESCRIPTION;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'th_TH',
      alternateLocale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // CMS-merged translations (cached, static fallback) shared with all client components
  const content = await getLandingContent();

  return (
    /**
     * LanguageHtmlWrapper is a thin client component that reads the selected
     * language from context and keeps the <html lang="..."> attribute in sync.
     * It must live inside <LanguageProvider> to consume the context.
     */
    <LanguageProvider translations={content.translations} languages={content.languages}>
      <LanguageHtmlWrapper className={cn('h-full antialiased', anuphan.variable, manrope.variable)}>
        <body className="flex min-h-full flex-col">
          <AnalyticsTracker />
          {children}
        </body>
      </LanguageHtmlWrapper>
    </LanguageProvider>
  );
}
