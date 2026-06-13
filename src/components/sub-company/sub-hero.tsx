'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { SubCompanyConfig } from '@/config/sub-companies';
import { motion } from 'motion/react';

interface SubHeroProps {
  config: SubCompanyConfig;
}

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export function SubHero({ config }: Readonly<SubHeroProps>) {
  const { hero, theme } = config;

  return (
    <section
      id="home"
      className="relative flex min-h-[500px] items-center overflow-hidden md:min-h-[560px]"
      style={{ backgroundColor: theme.background }}
    >
      {/* Background image — zoomed out with scale to avoid full-bleed fill */}
      <Image
        src="/assets/sub-company/hero/hero-background.jpg"
        alt=""
        role="presentation"
        fill
        sizes="100vw"
        className="absolute inset-0 object-cover"
        style={{ zIndex: 0, transformOrigin: 'center center', opacity: 0.6 }}
        priority
      />
      <div
        className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-stretch gap-0 px-4 md:flex-row md:items-center md:gap-10 md:px-[72px] md:py-24"
        style={{ paddingTop: '72px', paddingBottom: '40px' }}
      >
        {/* ── Left: Text content ── */}
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          {/* Title line 1 — black */}
          <motion.span
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="font-manrope block text-[32px] leading-[100%] font-extrabold tracking-[0px] md:text-[64px] md:leading-[96px]"
            style={{ color: '#000000' }}
          >
            {hero?.titleLine1}
          </motion.span>

          {/* Title line 2 — accent color */}
          <motion.span
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="font-manrope block text-[32px] leading-[150%] font-extrabold tracking-[0px] md:text-[64px] md:leading-[96px]"
            style={{ color: theme.primary }}
          >
            {hero?.titleLine2}
          </motion.span>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
            className="font-manrope mt-4 max-w-[320px] text-[14px] leading-[120%] font-medium tracking-[0px] md:mt-6 md:max-w-[540px] md:text-[20px] md:leading-[32.5px]"
            style={{ color: '#595C5D' }}
          >
            {hero?.subtitle}
          </motion.p>

          {/* ── Mobile: hero image between description and button ── */}
          {hero?.images && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
              className="relative mt-8 block overflow-hidden rounded-[12px] md:hidden"
              style={{ width: 320, height: 320, maxWidth: 320 }}
            >
              <Image
                src={hero.images.large}
                alt="Hero image"
                fill
                sizes="320px"
                className="object-cover"
                priority
              />
            </motion.div>
          )}

          {/* CTA Button — full width on mobile (below image), auto on desktop */}
          {hero?.cta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
              className="mt-8 w-full md:mt-10 md:w-auto"
            >
              <Link
                href={hero.cta.href}
                className="font-manrope flex h-[60px] w-full items-center justify-center rounded-[12px] px-[40px] py-[16px] text-[16px] leading-[28px] font-bold text-white transition-opacity hover:opacity-90 md:inline-flex md:w-auto"
                style={{
                  background: theme.primary,
                  minWidth: '171px',
                  boxShadow:
                    '0px 4px 6px -4px rgba(106, 28, 246, 0.4), 0px 10px 15px -3px rgba(106, 28, 246, 0.4)',
                }}
              >
                {hero.cta.label}
              </Link>
            </motion.div>
          )}
        </div>

        {/* ── Right: Two hero images — desktop only ── */}
        {hero?.images && (
          <div className="relative hidden shrink-0 md:block" style={{ width: 480, height: 480 }}>
            {/* Large image — top-right anchor */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
              className="absolute top-0 right-0 overflow-hidden rounded-[12px]"
              style={{ width: 430, height: 430, zIndex: 1 }}
            >
              <Image
                src={hero.images.large}
                alt="Hero image"
                fill
                sizes="430px"
                className="object-cover"
                priority
              />
            </motion.div>

            {/* Small image — bottom-left, overlaps large */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
              className="absolute bottom-0 left-0 overflow-hidden rounded-[12px] shadow-xl"
              style={{ width: 192, height: 192 }}
            >
              <Image
                src={hero.images.small}
                alt="Hero image 2"
                fill
                sizes="192px"
                className="object-cover"
                priority
              />
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
