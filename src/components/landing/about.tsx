'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';
import { motion, useInView } from 'motion/react';

/**
 * Glassy card style — semi-transparent purple tint with a frosted-glass
 * border and subtle inner highlight on the top edge.
 */
const CARD_STYLE: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(118, 0, 216, 0.15) 0%, rgba(18, 18, 18, 0.55) 100%)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
};

export function About() {
  const { t } = useLanguage();
  const a = t.about;

  // Ref for the cards container — triggers animation when scrolled into view
  const cardsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardsRef, { once: true, amount: 0.2 });

  // Shared animation variants for staggered reveal
  const cardVariants = {
    hidden: { opacity: 0, y: 48 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    }),
  };

  return (
    <section
      id="about"
      className="relative"
      style={{ background: 'linear-gradient(360deg, #010214 0%, #39005D 100%)' }}
    >
      {/* Decorative background SVGs */}
      <Image
        src="/assets/about/bg-flare.svg"
        alt=""
        role="presentation"
        width={393}
        height={392}
        loading="lazy"
        className="pointer-events-none absolute top-0 left-0"
        style={{ zIndex: 0 }}
      />
      <Image
        src="/assets/about/bg-line.svg"
        alt=""
        role="presentation"
        width={423}
        height={432}
        loading="lazy"
        className="pointer-events-none absolute top-0 left-0"
        style={{ zIndex: 1 }}
      />

      <div className="relative w-full px-4 pt-[40px] pb-[80px] md:px-18 md:pt-[100px] md:pb-[120px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-4">
          {/* Left — text content */}
          <div className="font-anuphan flex flex-col gap-5 md:min-w-0 md:flex-1">
            <h2 className="text-[36px] leading-[110%] font-semibold text-white md:text-[48px]">
              {a.title}
            </h2>
            <p className="text-[16px] leading-[170%] font-medium text-[#F3F3F3] md:text-[20px]">
              {a.p1}
            </p>
            <p className="text-[16px] leading-[170%] font-medium text-[#F3F3F3] md:text-[20px]">
              {a.p2}
            </p>
            <p className="text-[16px] leading-[170%] font-medium text-[#F3F3F3] md:text-[20px]">
              {a.p3}
            </p>

            {/* CEO */}
            {/* <div className="mt-2 flex items-center gap-4">
            
              <div
                className="h-[64px] w-[64px] shrink-0 rounded-[8px] bg-[#D9D9D9]"
                aria-hidden="true"
              />
              <div>
                <p className="text-[16px] font-semibold text-white">{a.ceoName}</p>
                <p className="text-[16px] text-white">{a.ceoTitle}</p>
              </div>
            </div> */}
          </div>

          {/* Right — feature cards */}
          <div ref={cardsRef} className="flex w-full flex-col gap-4 md:flex-1">
            {/* Row 1 */}
            <div className="flex flex-col gap-4 md:flex-row">
              {/* Card 1 — Systematic Solve */}
              <motion.div
                custom={0}
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="font-anuphan relative flex h-[121px] w-full flex-col justify-end overflow-hidden rounded-[8px] p-4 md:h-[212px] md:flex-1"
                style={CARD_STYLE}
              >
                <Image
                  src="/assets/about/card-1-flare.svg"
                  alt=""
                  role="presentation"
                  width={174}
                  height={170}
                  className="absolute top-0 left-0 object-contain"
                  style={{ zIndex: 1 }}
                />
                <Image
                  src="/assets/about/card-1.svg"
                  alt=""
                  role="presentation"
                  width={120}
                  height={106}
                  className="absolute top-0 right-0 object-contain"
                  style={{ zIndex: 0 }}
                />
                <div className="relative z-10 flex flex-col gap-1">
                  <h3 className="text-[24px] font-semibold text-white">{a.card1Title}</h3>
                  <p className="text-[14px] leading-[120%] text-[#C0C0C0]">{a.card1Desc}</p>
                </div>
              </motion.div>

              {/* Card 2 — Venture Scaling */}
              <motion.div
                custom={1}
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="font-anuphan relative flex h-[121px] w-full flex-col justify-end overflow-hidden rounded-[8px] p-4 md:h-[212px] md:flex-1"
                style={CARD_STYLE}
              >
                <Image
                  src="/assets/about/card-2.svg"
                  alt=""
                  role="presentation"
                  width={134}
                  height={154}
                  className="absolute top-0 right-0 object-contain"
                  style={{ zIndex: 0 }}
                />
                <div className="relative z-10 flex flex-col gap-1">
                  <h3 className="text-[24px] font-semibold text-white">{a.card2Title}</h3>
                  <p className="text-[14px] leading-[120%] text-[#C0C0C0]">{a.card2Desc}</p>
                </div>
              </motion.div>
            </div>

            {/* Card 3 — Automated Infrastructure */}
            <motion.div
              custom={2}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="font-anuphan relative flex w-full overflow-hidden rounded-[8px] p-4 md:h-[170px] md:items-end md:py-6"
              style={CARD_STYLE}
            >
              {/* Text — takes left portion, image lives on the right */}
              <div className="relative z-10 flex flex-col gap-1">
                <h3 className="text-[24px] leading-[120%] font-semibold text-white md:text-[24px]">
                  {a.card3Title}
                </h3>
                <p className="text-[14px] leading-[120%] text-[#C0C0C0]">{a.card3Desc}</p>
              </div>
              <Image
                src="/assets/about/card-3.svg"
                alt=""
                role="presentation"
                width={121}
                height={121}
                className="absolute top-0 right-0 object-contain"
                style={{ zIndex: 0 }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
