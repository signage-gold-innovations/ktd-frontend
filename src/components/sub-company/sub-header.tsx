'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { SubCompanyConfig } from '@/config/sub-companies';
import { motion } from 'motion/react';

import { LanguageDropdown } from '@/components/landing/language-dropdown';

interface SubHeaderProps {
  config: SubCompanyConfig;
}

export function SubHeader({ config }: Readonly<SubHeaderProps>) {
  const { theme } = config;

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      }}
      className="sticky top-0 z-50 w-full"
      style={{
        backgroundColor: theme.headerBg,
        color: theme.headerText,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <div className="mx-auto flex h-[82px] max-w-[1440px] items-center justify-between px-4 md:px-[72px]">
        {/* Logo — left */}
        <Link href={`/${config.slug}`}>
          <Image
            src={`/assets/sub-company/header/${config.slug}-logo.png`}
            alt={`${config.name} logo`}
            width={140}
            height={40}
            className="h-[40px] w-auto object-contain"
            priority
          />
        </Link>

        {/* Language switcher — right */}
        <div className="ml-auto">
          <LanguageDropdown
            appearance="light"
            buttonClassName="font-anuphan flex items-center gap-2 rounded-md px-2 py-1 text-[16px] leading-[18px] font-medium transition-colors hover:opacity-70"
            buttonStyle={{ color: theme.headerText }}
          />
        </div>
      </div>
    </motion.header>
  );
}
