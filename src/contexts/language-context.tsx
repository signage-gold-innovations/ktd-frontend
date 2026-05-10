'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { translations, type Language } from '@/i18n/translations';

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggle: () => void;
  t: (typeof translations)['en'];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { readonly children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggle = () => setLanguage((l) => (l === 'en' ? 'th' : 'en'));

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggle,
      t: translations[language] as (typeof translations)['en'],
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/**
 * useLanguage — access current language, setter, toggle, and translations.
 *
 * Usage:
 *   const { t, language, toggle } = useLanguage();
 *   <p>{t.hero.title}</p>
 */
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
