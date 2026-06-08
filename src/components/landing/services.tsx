'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';
import { motion, useInView } from 'motion/react';

/**
 * Glassy card style — consistent with about.tsx feature cards.
 */
const CARD_STYLE: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(118, 0, 216, 0.15) 0%, rgba(18, 18, 18, 0.55) 100%)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
};

const SERVICE_IMAGES = [
  '/assets/services/service1.jpg',
  '/assets/services/service2.jpg',
  '/assets/services/service3.png',
] as const;

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export function Services() {
  const { t } = useLanguage();
  const s = t.services;

  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  const services = [
    { image: SERVICE_IMAGES[0], label: s.card1Label, description: s.card1Desc },
    { image: SERVICE_IMAGES[1], label: s.card2Label, description: s.card2Desc },
    { image: SERVICE_IMAGES[2], label: s.card3Label, description: s.card3Desc },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 48 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: EASE,
      },
    }),
  };

  return (
    <section id="services" className="relative overflow-hidden bg-black py-[60px] md:py-[120px]">
      {/* Decorative background elements */}

      {/* bg-bottom-left.svg — replaces service-bottom-left.png */}
      <Image
        src="/assets/services/bg-bottom-left.svg"
        alt=""
        role="presentation"
        width={351}
        height={341}
        loading="lazy"
        className="pointer-events-none absolute bottom-0 left-0 hidden md:block"
        style={{ zIndex: 0 }}
      />

      {/* bg-bottom.svg — bottom center glow */}
      <Image
        src="/assets/services/bg-bottom.svg"
        alt=""
        role="presentation"
        width={1440}
        height={162}
        loading="lazy"
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{ zIndex: 0 }}
      />

      {/* bg-top-right.svg — replaces service-top-right.png */}
      <Image
        src="/assets/services/bg-top-right.svg"
        alt=""
        role="presentation"
        width={409}
        height={478}
        loading="lazy"
        className="pointer-events-none absolute top-0 right-0 hidden md:block"
        style={{ zIndex: 0 }}
      />

      <div ref={sectionRef} className="relative z-10 w-full px-4 md:px-[72px]">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-anuphan text-[36px] leading-[100%] font-semibold text-white capitalize"
        >
          {s.title}
        </motion.h2>

        {/* Service cards */}
        <div className="mt-10 flex flex-col gap-[10px] md:grid md:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.label}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="flex h-[471px] w-full shrink-0 flex-col gap-[10px] rounded-[8px] p-4"
              style={CARD_STYLE}
            >
              {/* Image */}
              <div className="relative mb-4 h-[345px] w-full overflow-hidden rounded-[8px]">
                <Image src={service.image} alt={service.label} fill className="object-cover" />
              </div>

              {/* Label badge */}
              <span className="font-anuphan inline-flex w-fit items-center rounded-[5px] border border-[#C067FF] px-[8px] py-[4px] text-[14px] leading-[16px] font-semibold tracking-[0.12px] text-[#C067FF] uppercase">
                {service.label}
              </span>

              {/* Description */}
              <p className="font-anuphan text-[16px] leading-[100%] text-[#C7C7C7]">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
