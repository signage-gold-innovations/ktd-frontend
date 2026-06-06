'use client';

import Image from 'next/image';
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

const SIDEBAR_COMPANIES = [
  { key: 'hiterratech' as const, href: '#hiterratech' },
  { key: 'silachai' as const, href: '#silachai' },
  { key: 'kitthana' as const, href: '#kitthana' },
];

export function Navbar() {
  const { language, toggle, t } = useLanguage();

  return (
    <header className="absolute top-[40px] right-[42px] left-[42px] z-50 rounded-[8px] border border-white/20 bg-white/5 bg-clip-padding shadow-lg backdrop-blur-sm backdrop-saturate-150 md:top-[48px] md:right-[60px] md:left-[60px] md:rounded-[12px]">
      <div className="flex h-[54px] w-full items-center gap-3 px-6 py-3 md:h-[68px] md:px-10">
        {/* Mobile/all-screen hamburger menu */}
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="rounded-none text-white hover:bg-transparent! focus-visible:border-transparent focus-visible:ring-0"
              />
            }
          >
            <HugeiconsIcon icon={MenuIcon} className="size-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent
            side="left"
            showCloseButton={false}
            className="flex w-64 flex-col border-0 bg-transparent! text-white backdrop-blur-2xl data-[side=left]:border-r-0"
            style={{
              background:
                'linear-gradient(0deg, rgba(18, 18, 18, 0.3), rgba(18, 18, 18, 0.3)), linear-gradient(0deg, rgba(118, 0, 216, 0.25) 0.28%, rgba(26, 0, 47, 0.15) 95.99%)',
            }}
          >
            {/* Companies list */}
            <div className="mx-[28px] my-[36px] flex flex-col">
              {SIDEBAR_COMPANIES.map((company, i) => (
                <div key={company.key}>
                  <Link
                    href={company.href}
                    className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-white/5"
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-anuphan)',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        lineHeight: '140%',
                        color: '#FFFFFF',
                      }}
                    >
                      {t.companies[company.key].name}
                    </span>
                    <Image
                      src="/assets/icon/sidebar-square.png"
                      alt="navigate"
                      width={24}
                      height={24}
                      className="size-6 object-contain"
                    />
                  </Link>
                  <div className="border-t border-white/20" />
                </div>
              ))}
            </div>

            {/* Social icons bottom-left */}
            <div className="mt-auto flex items-center gap-4 px-10 pb-10">
              <Link
                href="#"
                aria-label="Facebook"
                className="opacity-70 transition-opacity hover:opacity-100"
              >
                <Image
                  src="/assets/icon/logo-fb.png"
                  alt="Facebook"
                  width={24}
                  height={24}
                  className="size-6 object-contain"
                />
              </Link>
              <Link
                href="#"
                aria-label="Instagram"
                className="opacity-70 transition-opacity hover:opacity-100"
              >
                <Image
                  src="/assets/icon/logo-ig.png"
                  alt="Instagram"
                  width={24}
                  height={24}
                  className="size-6 object-contain"
                />
              </Link>
              <Link
                href="#"
                aria-label="Website"
                className="opacity-70 transition-opacity hover:opacity-100"
              >
                <Image
                  src="/assets/icon/logo-web.png"
                  alt="Website"
                  width={24}
                  height={24}
                  className="size-6 object-contain"
                />
              </Link>
            </div>
          </SheetContent>
        </Sheet>

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
