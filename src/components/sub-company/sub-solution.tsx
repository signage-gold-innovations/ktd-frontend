'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { SubCompanyConfig } from '@/config/sub-companies';
import { motion, useInView } from 'motion/react';

interface SubSolutionProps {
  readonly config: SubCompanyConfig;
}

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export function SubSolution({ config }: Readonly<SubSolutionProps>) {
  const { solution, theme } = config;
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <>
      {/* ═══ MOBILE: full-width dark wallpaper, no card ═══ */}
      <section
        id="solution"
        ref={sectionRef}
        className="relative overflow-hidden py-20 md:hidden"
        style={{ backgroundColor: '#0C0F10' }}
      >
        {/* Overlay top right */}
        <div className="pointer-events-none absolute top-0 right-0">
          <Image
            src="/assets/sub-company/solution/solution-overlay.svg"
            alt=""
            role="presentation"
            width={300}
            height={300}
            className="h-auto w-auto"
            loading="lazy"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-center px-4 text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            className="font-manrope font-bold tracking-[1px]"
          >
            <span className="block text-[36px] leading-[60px]" style={{ color: '#F5F6F7' }}>
              {solution?.titlePrefix}
            </span>
            <span className="block text-[36px] leading-[60px]" style={{ color: '#C067FF' }}>
              {solution?.titleHighlight}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            className="font-manrope mt-8 max-w-[520px] text-[14px] leading-[28px] font-medium tracking-[0px]"
            style={{ color: '#9B9D9E' }}
          >
            {solution?.description}
          </motion.p>

          {solution?.cta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
              className="mt-10 w-full"
            >
              <Link
                href={solution.cta.href}
                className="font-manrope flex h-[60px] w-full items-center justify-center rounded-[12px] px-[40px] py-[16px] text-[16px] leading-[28px] font-bold text-white transition-opacity hover:opacity-90"
                style={{
                  background: theme.primary,
                  boxShadow:
                    '0px 4px 6px -4px rgba(106, 28, 246, 0.4), 0px 10px 15px -3px rgba(106, 28, 246, 0.4)',
                }}
              >
                {solution.cta.label}
              </Link>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ═══ DESKTOP: #F8F8F8 bg with dark rounded card ═══ */}
      <section
        id="solution"
        ref={sectionRef}
        className="hidden py-20 md:block"
        style={{ backgroundColor: '#F8F8F8' }}
      >
        <div className="mx-auto w-full max-w-[1440px] px-[72px]">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative flex flex-col items-center justify-center overflow-hidden rounded-[32px] text-center"
            style={{
              backgroundColor: '#0C0F10',
              maxWidth: 1280,
              minHeight: 432,
              padding: '80px',
            }}
          >
            {/* Overlay — top right */}
            <div className="pointer-events-none absolute top-0 right-0">
              <Image
                src="/assets/sub-company/solution/solution-overlay.svg"
                alt=""
                role="presentation"
                width={400}
                height={400}
                className="h-auto w-auto"
                loading="lazy"
              />
            </div>

            {/* Overlay — bottom left */}
            <div className="pointer-events-none absolute bottom-0 left-0">
              <Image
                src="/assets/sub-company/solution/solution-overlay-bottom.svg"
                alt=""
                role="presentation"
                width={400}
                height={400}
                className="h-auto w-auto"
                loading="lazy"
              />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
                className="font-manrope text-[60px] leading-[60px] font-bold tracking-[1px]"
              >
                <span style={{ color: '#F5F6F7' }}>{solution?.titlePrefix} </span>
                <span style={{ color: '#C067FF' }}>{solution?.titleHighlight}</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
                className="font-manrope mt-8 max-w-[520px] text-[18px] leading-[28px] font-medium tracking-[0px]"
                style={{ color: '#9B9D9E' }}
              >
                {solution?.description}
              </motion.p>

              {solution?.cta && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
                  className="mt-10"
                >
                  <Link
                    href={solution.cta.href}
                    className="font-manrope inline-flex h-[60px] items-center justify-center rounded-[12px] px-[40px] py-[16px] text-[16px] leading-[28px] font-bold text-white transition-opacity hover:opacity-90"
                    style={{
                      background: theme.primary,
                      minWidth: '171px',
                      boxShadow:
                        '0px 4px 6px -4px rgba(106, 28, 246, 0.4), 0px 10px 15px -3px rgba(106, 28, 246, 0.4)',
                    }}
                  >
                    {solution.cta.label}
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
