'use client';

import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';

const serviceImages = [
  '/assets/services/service1.jpg',
  '/assets/services/service2.jpg',
  '/assets/services/service3.png',
];

export function Services() {
  const { t } = useLanguage();
  const s = t.services;

  const services = [
    { image: serviceImages[0], label: s.card1Label, description: s.card1Desc },
    { image: serviceImages[1], label: s.card2Label, description: s.card2Desc },
    { image: serviceImages[2], label: s.card3Label, description: s.card3Desc },
  ];

  return (
    <section
      id="services"
      style={{ backgroundColor: '#000000' }}
      className="relative overflow-hidden py-[60px] md:py-[120px]"
    >
      {/* Background decorations */}
      <Image
        src="/assets/services/service-bottom-left.png"
        alt=""
        width={400}
        height={400}
        className="pointer-events-none absolute bottom-0 left-0 hidden md:block"
        style={{ zIndex: 0 }}
      />
      <Image
        src="/assets/services/service-bottom.png"
        alt=""
        width={1440}
        height={200}
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{ zIndex: 0 }}
      />
      <Image
        src="/assets/services/service-top-right.png"
        alt=""
        width={400}
        height={400}
        className="pointer-events-none absolute top-0 right-0 hidden md:block"
        style={{ zIndex: 0 }}
      />
      <div className="relative z-10 w-full px-4 md:px-[72px]">
        <h2
          style={{
            fontFamily: 'var(--font-anuphan)',
            fontWeight: 600,
            fontSize: '36px',
            lineHeight: '100%',
            letterSpacing: '0%',
            textTransform: 'capitalize',
            color: '#ffffff',
          }}
        >
          {s.title}
        </h2>

        {/* Service cards: horizontal scroll on xs, grid on sm+ */}
        <div className="mt-10 flex flex-col gap-[10px] md:grid md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.label}
              className="flex w-full flex-shrink-0 flex-col gap-[10px] rounded-[8px] p-4"
              style={{
                height: '471px',
                background:
                  'linear-gradient(0deg, rgba(18, 18, 18, 0.5), rgba(18, 18, 18, 0.5)), linear-gradient(0deg, rgba(118, 0, 216, 0.2) 0.28%, rgba(26, 0, 47, 0.2) 95.99%)',
              }}
            >
              {/* Image */}
              <div
                className="relative mb-4 w-full overflow-hidden rounded-[8px]"
                style={{ height: '345px' }}
              >
                <Image src={service.image} alt={service.label} fill className="object-cover" />
              </div>

              {/* Label */}
              <span
                className="inline-flex w-fit items-center rounded-[5px] border px-[8px] py-[4px] uppercase"
                style={{
                  fontFamily: 'var(--font-anuphan)',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '16px',
                  letterSpacing: '0.12px',
                  color: '#C067FF',
                  borderColor: '#C067FF',
                  fontVariantNumeric: 'lining-nums tabular-nums',
                }}
              >
                {service.label}
              </span>

              {/* Description */}
              <p
                style={{
                  fontFamily: 'var(--font-anuphan)',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#C7C7C7',
                }}
              >
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
