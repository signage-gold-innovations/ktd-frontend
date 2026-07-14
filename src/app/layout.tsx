import type { Metadata } from 'next';
import { Anuphan, Manrope } from 'next/font/google';

import './globals.css';

import { SITE_URL } from '@/config/site';
import { LanguageProvider } from '@/contexts/language-context';
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'KTD Group — Full-Spectrum Technopreneur',
  description:
    'KTD Group bridges deep technical engineering and entrepreneurial growth across satellite data, rock quarry, and brick manufacturing ventures.',
  openGraph: {
    title: 'KTD Group — Full-Spectrum Technopreneur',
    description:
      'Engineering the solve. Scaling the venture. Explore KTD Group and our portfolio of companies.',
    type: 'website',
    locale: 'th_TH',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KTD Group — Full-Spectrum Technopreneur',
    description: 'Engineering the solve. Scaling the venture.',
  },
};

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
    <LanguageProvider translations={content.translations}>
      <LanguageHtmlWrapper className={cn('h-full antialiased', anuphan.variable, manrope.variable)}>
        <body className="flex min-h-full flex-col">
          <AnalyticsTracker />
          {children}
        </body>
      </LanguageHtmlWrapper>
    </LanguageProvider>
  );
}
