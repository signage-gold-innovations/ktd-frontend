'use client';

import { useRef } from 'react';
import Image from 'next/image';
import type { SubCompanyConfig } from '@/config/sub-companies';
import { motion, useInView } from 'motion/react';

interface SubServicesProps {
  readonly config: SubCompanyConfig;
}

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export function SubServices({ config }: Readonly<SubServicesProps>) {
  const { services } = config;
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-20 md:py-24"
      style={{ backgroundColor: '#F5F6F7' }}
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-[72px]">
        {/* Header — centered */}
        <div className="flex flex-col items-center text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="font-manrope text-[36px] leading-[40px] font-bold tracking-[-1.8px]"
            style={{ color: '#2C2F30' }}
          >
            {services?.title}
          </motion.h2>

          {services?.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              className="font-manrope mt-4 max-w-[1200px] text-[16px] leading-[24px] font-normal tracking-[0px]"
              style={{ color: '#595C5D' }}
            >
              {services.subtitle}
            </motion.p>
          )}
        </div>

        {/* Service cards — 3 columns */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {services?.items?.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: 0.15 * (i + 1), ease: EASE }}
              className="flex flex-col"
            >
              {/* Icon box — 56×56, radius 16, bg #E0E3E4 */}
              <div
                className="flex shrink-0 items-center justify-center rounded-[16px]"
                style={{ width: 56, height: 56, backgroundColor: '#E0E3E4' }}
              >
                {service.icon ? (
                  <Image
                    src={service.icon}
                    alt=""
                    role="presentation"
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-gray-400" />
                )}
              </div>

              {/* Title — 20px Bold, #2C2F30 */}
              <h3
                className="font-manrope mt-6 text-[20px] leading-[28px] font-bold tracking-[0px]"
                style={{ color: '#2C2F30' }}
              >
                {service.title}
              </h3>

              {/* Description — 16px Regular, #595C5D */}
              <p
                className="font-manrope mt-6 text-[16px] leading-[24px] font-normal tracking-[0px]"
                style={{ color: '#595C5D' }}
              >
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
