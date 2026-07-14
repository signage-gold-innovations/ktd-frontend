'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGES,
  getStaticDictionary,
  translations as staticTranslations,
  type Language,
  type LanguageInfo,
  type Translations,
} from '@/i18n/translations';

import { track } from '@/lib/analytics';

const STORAGE_KEY = 'ktd-language';

function getInitialLanguage(available: Language[]): Language {
  if (typeof globalThis.window === 'undefined') return DEFAULT_LANGUAGE;
  const stored = globalThis.localStorage.getItem(STORAGE_KEY);
  if (stored && available.includes(stored)) return stored;
  // Fall back to browser language preference
  const browser = globalThis.navigator.language.toLowerCase();
  return available.find((code) => browser.startsWith(code)) ?? DEFAULT_LANGUAGE;
}

type LanguageContextValue = {
  language: Language;
  /** Enabled site languages in display order */
  languages: LanguageInfo[];
  setLanguage: (lang: Language) => void;
  /** Cycle to the next enabled language */
  toggle: () => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  translations = staticTranslations,
  languages = FALLBACK_LANGUAGES,
}: {
  readonly children: React.ReactNode;
  /** CMS-merged dictionaries from getLandingContent(); defaults to the static bundle */
  readonly translations?: Record<Language, Translations>;
  /** Enabled languages from getLandingContent(); defaults to the static list */
  readonly languages?: LanguageInfo[];
}) {
  const [language, setLang] = useState<Language>(DEFAULT_LANGUAGE);

  const codes = useMemo(() => languages.map((lang) => lang.code), [languages]);

  // Hydrate from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    setLang(getInitialLanguage(codes));
  }, [codes]);

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
    const index = codes.indexOf(language);
    setLanguage(codes[(index + 1) % codes.length] ?? DEFAULT_LANGUAGE);
  }

  const value = useMemo(
    () => ({
      language,
      languages,
      setLanguage,
      toggle,
      t: translations[language] ?? getStaticDictionary(language),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language, languages, translations]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/**
 * useLanguage — access current language, the enabled language list, setter,
 * toggle, and translations.
 *
 * Usage:
 *   const { t, language, languages, toggle } = useLanguage();
 *   <p>{t.hero.title}</p>
 */
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
