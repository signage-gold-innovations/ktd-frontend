'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { Globe02Icon, MenuIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const NAV_HREFS = [
  { key: 'home' as const, href: '#' },
  { key: 'about' as const, href: '#about' },
  { key: 'services' as const, href: '#services' },
  { key: 'contact' as const, href: '#contact' },
];

export function Navbar() {
  const { language, toggle, t } = useLanguage();

  return (
    <header className="fixed top-[40px] right-[42px] left-[42px] z-50 rounded-[8px] border border-white/20 bg-white/5 bg-clip-padding shadow-lg backdrop-blur-sm backdrop-saturate-150 md:top-[48px] md:right-[60px] md:left-[60px] md:rounded-[12px]">
      <div className="flex h-[54px] w-full items-center gap-3 px-6 py-3 md:h-[68px] md:px-10">
        {/* Mobile/all-screen hamburger menu */}
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="text-white" />}>
            <HugeiconsIcon icon={MenuIcon} className="size-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-black text-white">
            <SheetHeader className="flex items-center justify-center">
              <SheetTitle
                className="text-center text-white"
                style={{
                  fontFamily: 'var(--font-anuphan)',
                  fontWeight: 700,
                  fontSize: '24px',
                  lineHeight: '120%',
                  letterSpacing: '0%',
                }}
              >
                {t.nav.companyName}
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-4 px-4">
              {NAV_HREFS.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="text-sm text-white/80 transition-colors hover:text-white"
                >
                  {t.nav[link.key]}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo / Company Name */}
        <Link
          href="/"
          className="text-white md:text-[30px]"
          style={{
            fontFamily: 'var(--font-anuphan)',
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: '120%',
            letterSpacing: '0%',
          }}
        >
          {t.nav.companyName}
        </Link>

        {/* Language switcher */}
        <div className="ml-auto">
          <button
            onClick={toggle}
            aria-label="Switch language"
            className="flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:text-white"
            style={{
              fontFamily: 'var(--font-anuphan)',
              fontWeight: 500,
              fontStyle: 'normal',
              fontSize: '24px',
              lineHeight: '24px',
              letterSpacing: '0%',
              color: '#FFFFFF',
            }}
          >
            <HugeiconsIcon icon={Globe02Icon} className="size-6" />
            <span>{language.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
