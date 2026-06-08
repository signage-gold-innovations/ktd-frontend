'use client';

import { useLanguage } from '@/contexts/language-context';

interface LanguageHtmlWrapperProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

/**
 * Renders the <html> element with a lang attribute that stays in sync
 * with the user's selected language. Must be a client component because
 * it reads from LanguageContext.
 *
 * This component sits just inside <LanguageProvider> in the root layout
 * so it can consume the context while still wrapping the entire page.
 */
export function LanguageHtmlWrapper({ children, className }: LanguageHtmlWrapperProps) {
  const { language } = useLanguage();

  return (
    <html lang={language} className={className}>
      {children}
    </html>
  );
}
