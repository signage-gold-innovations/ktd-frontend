'use client';

import type { LanguageInfo } from '@/i18n/translations';

import { cn } from '@/lib/utils';

interface LanguageTabsProps {
  languages: LanguageInfo[];
  active: string;
  onChange: (code: string) => void;
  /** Prefix for unique tab ids when several tab bars share a page */
  idPrefix: string;
}

/**
 * Sub-tab bar used inside the content editor forms — one tab per configured
 * language. Disabled (hidden-from-site) languages are shown too, marked
 * "hidden", so their content can be prepared before going live.
 */
export function LanguageTabs({ languages, active, onChange, idPrefix }: LanguageTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Language"
      className="border-border flex flex-wrap gap-1 border-b"
    >
      {languages.map((lang) => {
        const isActive = lang.code === active;
        return (
          <button
            key={lang.code}
            id={`${idPrefix}-tab-${lang.code}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(lang.code)}
            className={cn(
              '-mb-px rounded-t-md border-x border-t px-3 py-1.5 text-sm font-medium transition-colors',
              isActive
                ? 'border-border bg-background text-foreground border-b-background'
                : 'text-muted-foreground hover:text-foreground border-transparent'
            )}
          >
            {lang.name}
            {lang.nativeName !== lang.name && (
              <span className="text-muted-foreground ml-1.5 text-xs">{lang.nativeName}</span>
            )}
            {!lang.enabled && (
              <span className="text-muted-foreground ml-1.5 text-xs">(hidden)</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
