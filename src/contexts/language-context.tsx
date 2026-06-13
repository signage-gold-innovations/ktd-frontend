'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations, type Language } from '@/i18n/translations';

const STORAGE_KEY = 'ktd-language';

function getInitialLanguage(): Language {
  if (typeof globalThis.window === 'undefined') return 'en';
  const stored = globalThis.localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'th') return stored;
  // Fall back to browser language preference
  return globalThis.navigator.language.startsWith('th') ? 'th' : 'en';
}

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggle: () => void;
  t: (typeof translations)['en'];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { readonly children: React.ReactNode }) {
  const [language, setLang] = useState<Language>('en');

  // Hydrate from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    setLang(getInitialLanguage());
  }, []);

  function setLanguage(lang: Language) {
    setLang(lang);
    try {
      globalThis.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // localStorage may be unavailable in private browsing on some browsers
    }
  }

  function toggle() {
    setLanguage(language === 'en' ? 'th' : 'en');
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggle,
      t: translations[language] as (typeof translations)['en'],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
