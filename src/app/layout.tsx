import type { Metadata } from 'next';
import { Anuphan } from 'next/font/google';

import './globals.css';

import { LanguageProvider } from '@/contexts/language-context';

import { LanguageHtmlWrapper } from '@/components/landing/language-html-wrapper';

import { cn } from '@/lib/utils';

/**
 * Anuphan is the primary typeface for the landing page — covers both
 * Latin and Thai subsets. Geist, Figtree, and Manrope from the original
 * scaffold have been removed as they are unused in the landing page.
 */
const anuphan = Anuphan({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-anuphan',
  display: 'swap',
});

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /**
     * LanguageHtmlWrapper is a thin client component that reads the selected
     * language from context and keeps the <html lang="..."> attribute in sync.
     * It must live inside <LanguageProvider> to consume the context.
     */
    <LanguageProvider>
      <LanguageHtmlWrapper className={cn('h-full antialiased', anuphan.variable)}>
        <body className="flex min-h-full flex-col">{children}</body>
      </LanguageHtmlWrapper>
    </LanguageProvider>
  );
}
