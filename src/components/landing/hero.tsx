'use client';

import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';
import { motion } from 'motion/react';

import { Button } from '@/components/ui/button';

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export function Hero() {
  const { t } = useLanguage();
  const h = t.hero;

  return (
    <section
      id="home"
      className="relative flex min-h-[600px] items-center overflow-hidden bg-black md:min-h-[800px]"
    >
      {/* Background — uses Next.js Image for automatic WebP/AVIF, responsive sizing, and LCP optimization */}
      <div className="absolute inset-0">
        <Image
          src="/assets/hero/hero-background.png"
          alt=""
          role="presentation"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        {/* Dark vignette overlay — heaviest at bottom where text sits */}
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/50 to-black/80" />
      </div>

      <div className="relative z-10 mx-4 pt-[411px] pb-[54px] md:mx-[130px] md:pt-[280px] md:pb-[220px]">
        {/* Presenter name */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="font-anuphan mb-4 text-[18px] leading-[120%] font-bold text-white/80 md:text-[20px]"
        >
          {h.presenterName}
        </motion.p>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          className="font-anuphan text-[36px] leading-[100%] font-bold text-white md:text-[64px]"
        >
          <span className="mb-8 block">{h.title}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
          className="font-anuphan mb-0 text-[20px] leading-[24px] font-light text-[#F3F3F3] md:text-[32px] md:leading-[32px]"
        >
          {h.subtitle}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.85, ease: EASE }}
        >
          <Button
            className="font-anuphan mt-16 rounded-[8px] text-[18px] font-bold md:h-[60px]! md:w-[260px]! md:text-[22px]!"
            style={{
              width: '217px',
              height: '49px',
              background: 'linear-gradient(0deg, #A92DFF, #A92DFF)',
            }}
          >
            {h.cta}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
