'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { faCheck, faChevronDown, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';

interface LanguageDropdownProps {
  /** 'dark' — glassy panel for the landing navbar; 'light' — white panel for sub-company headers */
  readonly appearance?: 'dark' | 'light';
  readonly buttonClassName?: string;
  readonly buttonStyle?: React.CSSProperties;
}

/**
 * Language switcher: the globe button opens a popup listing every enabled
 * site language (from /admin/languages); picking one sets it site-wide.
 * Closes on outside click and Escape.
 */
export function LanguageDropdown({
  appearance = 'dark',
  buttonClassName,
  buttonStyle,
}: LanguageDropdownProps) {
  const { language, languages, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    globalThis.document.addEventListener('pointerdown', handlePointerDown);
    globalThis.document.addEventListener('keydown', handleKeyDown);
    return () => {
      globalThis.document.removeEventListener('pointerdown', handlePointerDown);
      globalThis.document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const current = languages.find((lang) => lang.code === language);
  const isDark = appearance === 'dark';

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        className={
          buttonClassName ??
          'font-anuphan flex items-center gap-2 rounded-md px-2 py-1 text-[16px] leading-[18px] font-medium text-white transition-colors hover:text-white/80'
        }
        style={buttonStyle}
      >
        <FontAwesomeIcon icon={faGlobe} style={{ width: 20, height: 20 }} />
        <span>{current?.label ?? language}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          style={{
            width: 12,
            height: 12,
            transition: 'transform 0.2s ease',
            transform: open ? 'rotate(180deg)' : 'none',
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Language"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute top-full right-0 z-50 mt-2 min-w-44 overflow-hidden rounded-[10px] py-1.5',
              isDark ? 'text-white' : 'border border-black/10 bg-white text-gray-900 shadow-lg'
            )}
            style={
              isDark
                ? {
                    background: 'rgba(18, 18, 18, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }
                : undefined
            }
          >
            {languages.map((lang) => {
              const isActive = lang.code === language;
              return (
                <li key={lang.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      setLanguage(lang.code);
                      setOpen(false);
                    }}
                    className={cn(
                      'font-anuphan flex w-full items-center justify-between gap-4 px-4 py-2 text-left text-[15px] transition-colors',
                      isDark ? 'hover:bg-white/10' : 'hover:bg-black/5',
                      isActive && 'font-semibold'
                    )}
                  >
                    <span>
                      {lang.nativeName}
                      {lang.nativeName !== lang.name && (
                        <span
                          className={cn('ml-2 text-xs', isDark ? 'text-white/60' : 'text-gray-500')}
                        >
                          {lang.name}
                        </span>
                      )}
                    </span>
                    {isActive && (
                      <FontAwesomeIcon icon={faCheck} style={{ width: 14, height: 14 }} />
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
