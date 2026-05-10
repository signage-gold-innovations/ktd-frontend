'use client';

import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';

export function About() {
  const { t } = useLanguage();
  const a = t.about;
  return (
    <section
      id="about"
      className="relative"
      style={{ background: 'linear-gradient(360deg, #010214 0%, #39005D 100%)' }}
    >
      {/* Background decorative overlapping images — topleft2 below, topleft above */}
      <Image
        src="/assets/about/about-topleft2.png"
        alt=""
        width={400}
        height={400}
        className="pointer-events-none absolute top-0 left-0"
        style={{ zIndex: 0 }}
      />
      <Image
        src="/assets/about/about-topleft.png"
        alt=""
        width={400}
        height={400}
        className="pointer-events-none absolute top-0 left-0"
        style={{ zIndex: 1 }}
      />
      <div className="relative w-full px-4 pt-[40px] pb-[80px] md:px-18 md:pt-[100px] md:pb-[120px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-4">
          {/* Left — text content */}
          <div
            className="flex flex-col gap-5 md:min-w-0 md:flex-1"
            style={{ fontFamily: 'var(--font-anuphan)' }}
          >
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

            {/* CEO section */}
            <div className="mt-2 flex items-center gap-4">
              <div className="h-[64px] w-[64px] flex-shrink-0 rounded-[8px] bg-[#D9D9D9]" />
              <div>
                <p className="text-[16px] font-semibold text-white">{a.ceoName}</p>
                <p className="text-[16px] text-white">{a.ceoTitle}</p>
              </div>
            </div>
          </div>

          {/* Right — feature cards */}
          <div className="flex w-full flex-col gap-4 md:flex-1">
            {/* Row 1 — stacks on mobile, side-by-side on md+ */}
            <div className="flex flex-col gap-4 md:flex-row">
              {/* Card 1 — Systematic Solve */}
              <div
                className="relative flex h-[121px] w-full flex-col justify-end overflow-hidden rounded-[8px] p-4 md:h-[212px] md:flex-1"
                style={{
                  background:
                    'linear-gradient(0deg, rgba(18, 18, 18, 0.5), rgba(18, 18, 18, 0.5)), linear-gradient(0deg, rgba(118, 0, 216, 0.2) 0.28%, rgba(26, 0, 47, 0.2) 95.99%)',
                  fontFamily: 'var(--font-anuphan)',
                }}
              >
                <Image
                  src="/assets/about/card1-topleft.png"
                  alt=""
                  width={120}
                  height={120}
                  className="absolute top-0 left-0 object-contain"
                  style={{ zIndex: 1 }}
                />
                <Image
                  src="/assets/about/card1.png"
                  alt="Systematic Solve"
                  width={120}
                  height={120}
                  className="absolute top-0 right-0 object-contain"
                  style={{ zIndex: 0 }}
                />
                <div className="relative z-10 flex flex-col gap-2">
                  <h3 className="text-[24px] font-semibold text-white">{a.card1Title}</h3>
                  <p className="text-[14px] leading-[160%] text-[#C0C0C0]">{a.card1Desc}</p>
                </div>
              </div>

              {/* Card 2 — Venture Scaling */}
              <div
                className="relative flex h-[121px] w-full flex-col justify-end overflow-hidden rounded-[8px] p-4 md:h-[212px] md:flex-1"
                style={{
                  background:
                    'linear-gradient(0deg, rgba(18, 18, 18, 0.5), rgba(18, 18, 18, 0.5)), linear-gradient(0deg, rgba(118, 0, 216, 0.2) 0.28%, rgba(26, 0, 47, 0.2) 95.99%)',
                  fontFamily: 'var(--font-anuphan)',
                }}
              >
                <Image
                  src="/assets/about/card2.png"
                  alt="Venture Scaling"
                  width={120}
                  height={120}
                  className="absolute top-0 right-0 object-contain"
                  style={{ zIndex: 0 }}
                />
                <div className="relative z-10 flex flex-col gap-2">
                  <h3 className="text-[24px] font-semibold text-white">{a.card2Title}</h3>
                  <p className="text-[14px] leading-[160%] text-[#C0C0C0]">{a.card2Desc}</p>
                </div>
              </div>
            </div>

            {/* Card 3 — Automated Infrastructure */}
            <div
              className="relative flex h-[121px] w-full flex-col justify-end overflow-hidden rounded-[8px] p-4 md:h-[170px] md:py-6"
              style={{
                background:
                  'linear-gradient(0deg, rgba(18, 18, 18, 0.5), rgba(18, 18, 18, 0.5)), linear-gradient(0deg, rgba(118, 0, 216, 0.2) 0.28%, rgba(26, 0, 47, 0.2) 95.99%)',
                fontFamily: 'var(--font-anuphan)',
              }}
            >
              <Image
                src="/assets/about/card3.png"
                alt="Automated Infrastructure"
                width={120}
                height={120}
                className="absolute top-0 right-0 object-contain"
                style={{ zIndex: 0 }}
              />
              <div className="relative z-10 flex flex-col gap-2">
                <h3 className="text-[24px] font-semibold text-white">{a.card3Title}</h3>
                <p className="text-[14px] leading-[160%] text-[#C0C0C0]">{a.card3Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
