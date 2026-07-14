'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_LANGUAGE,
  isLanguage,
  LANGUAGE_CODES,
  translations as staticTranslations,
  type Language,
  type Translations,
} from '@/i18n/translations';

import { track } from '@/lib/analytics';

const STORAGE_KEY = 'ktd-language';

function getInitialLanguage(): Language {
  if (typeof globalThis.window === 'undefined') return DEFAULT_LANGUAGE;
  const stored = globalThis.localStorage.getItem(STORAGE_KEY);
  if (stored && isLanguage(stored)) return stored;
  // Fall back to browser language preference
  const browser = globalThis.navigator.language.toLowerCase();
  return LANGUAGE_CODES.find((code) => browser.startsWith(code)) ?? DEFAULT_LANGUAGE;
}

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  /** Cycle to the next language in LANGUAGE_CODES order */
  toggle: () => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  translations = staticTranslations,
}: {
  readonly children: React.ReactNode;
  /** CMS-merged dictionaries from getLandingContent(); defaults to the static bundle */
  readonly translations?: Record<Language, Translations>;
}) {
  const [language, setLang] = useState<Language>(DEFAULT_LANGUAGE);

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
    track({ type: 'language_switch', target: lang });
  }

  function toggle() {
    const index = LANGUAGE_CODES.indexOf(language);
    setLanguage(LANGUAGE_CODES[(index + 1) % LANGUAGE_CODES.length]);
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggle,
      t: translations[language] ?? staticTranslations[language],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language, translations]
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
