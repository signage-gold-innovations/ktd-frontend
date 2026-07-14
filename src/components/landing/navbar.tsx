'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { LANGUAGES } from '@/i18n/translations';
import { faFacebook, faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faBars, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'motion/react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const SIDEBAR_COMPANIES = [
  { key: 'hiterratech' as const, href: '/hiterratech' },
  { key: 'silachai' as const, href: '/silachai' },
  { key: 'kitthana' as const, href: '/kitthana' },
];

const SOCIAL_ICONS = [
  { icon: faFacebook, label: 'Facebook' },
  { icon: faYoutube, label: 'Youtube' },
  { icon: faXTwitter, label: 'X' },
  { icon: faGlobe, label: 'Website' },
] as const;

export function Navbar() {
  const { language, toggle, t } = useLanguage();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      }}
      className="absolute top-[24px] right-4 left-4 z-50 rounded-[12px] md:top-[48px] md:right-[60px] md:left-[60px]"
      style={{
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="flex h-[54px] w-full items-center gap-3 px-6 py-3 md:h-[68px] md:px-10">
        {/* Hamburger menu */}
        <Sheet>
          <SheetTrigger
            render={
              <button
                className="flex items-center justify-center text-white transition-opacity hover:opacity-70 focus-visible:outline-none"
                aria-label="Toggle menu"
              />
            }
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
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
            <nav aria-label="Company navigation" className="mx-[16px] my-[28px] flex flex-col">
              {SIDEBAR_COMPANIES.map((company) => (
                <div key={company.key}>
                  <Link
                    href={company.href}
                    data-track="nav_click"
                    data-track-target={company.key}
                    className="font-anuphan flex items-center justify-between py-4 text-[18px] leading-[140%] font-bold text-white transition-colors hover:bg-white/5"
                  >
                    <span>{t.companies[company.key].name}</span>
                    <Image
                      src="/assets/landing/navbar/arrow-right-square.svg"
                      alt=""
                      role="presentation"
                      width={20}
                      height={20}
                    />
                  </Link>
                  <div className="border-t border-[#757575]" />
                </div>
              ))}
            </nav>

            {/* Social icons */}
            <div className="mt-auto flex items-center gap-5 px-10 pb-10">
              {SOCIAL_ICONS.map(({ icon, label }) => (
                <Link
                  key={label}
                  href="#"
                  aria-label={label}
                  data-track="social_click"
                  data-track-target={`navbar:${label}`}
                  className="text-white transition-opacity hover:opacity-70"
                >
                  <FontAwesomeIcon icon={icon} style={{ width: 20, height: 20 }} />
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {/* Company name — center */}
        {/* <Link
          href="#"
          className="font-anuphan absolute left-1/2 -translate-x-1/2 text-[16px] font-semibold text-white md:text-[18px]"
        >
          {t.nav.companyName}
        </Link> */}

        {/* Language switcher — right */}
        <div className="ml-auto">
          <button
            onClick={toggle}
            aria-label="Change language"
            className="font-anuphan flex items-center gap-2 rounded-md px-2 py-1 text-[16px] leading-[18px] font-medium text-white transition-colors hover:text-white/80"
          >
            <FontAwesomeIcon icon={faGlobe} style={{ width: 20, height: 20 }} />
            <span>{LANGUAGES.find((lang) => lang.code === language)?.label ?? language}</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
