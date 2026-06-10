'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { SubCompanyConfig } from '@/config/sub-companies';
import { AnimatePresence, motion, useInView } from 'motion/react';

interface SubAboutProps {
  readonly config: SubCompanyConfig;
}

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

interface HighlightedTextProps {
  readonly text: string;
  readonly highlights?: { phrase: string; weight?: 'semibold' | 'bold'; color?: string }[];
}

function HighlightedText({ text, highlights }: HighlightedTextProps) {
  if (!highlights || highlights.length === 0) return <>{text}</>;

  const phraseList = highlights.map((h) => h.phrase);
  const escaped = phraseList.map((p) => p.replace(/[.*+?^${}()|[\]\\]/gu, String.raw`\$&`));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gu');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part) => {
        const match = highlights.find((h) => h.phrase === part);
        if (match) {
          return (
            <span
              key={part}
              style={{ color: match.color }}
              className={match.weight === 'bold' ? 'font-bold' : 'font-semibold'}
            >
              {part}
            </span>
          );
        }
        return <span key={part}>{part}</span>;
      })}
    </>
  );
}

const SWITCH_INTERVAL = 5000;

// ── Shared sub-components ──────────────────────────────────────────

function TextContent({
  about,
  theme,
}: {
  readonly about: SubCompanyConfig['about'];
  readonly theme: SubCompanyConfig['theme'];
}) {
  return (
    <>
      <p
        className="font-manrope text-[12px] leading-[16px] font-bold tracking-[1.2px] uppercase"
        style={{ color: theme.accent }}
      >
        {about?.label}
      </p>
      <h2
        className="font-manrope mt-3 text-[32px] leading-[120%] font-semibold tracking-[-1px] whitespace-pre-line md:text-[48px] md:leading-[60px] md:tracking-[-2.4px]"
        style={{ color: '#2C2F30' }}
      >
        {about?.title}
      </h2>
      <p
        className="font-manrope mt-4 text-[14px] leading-[24px] font-bold tracking-[0px] md:mt-6 md:text-[18px] md:leading-[29.25px]"
        style={{ color: '#595C5D' }}
      >
        <HighlightedText
          text={about?.description ?? ''}
          highlights={about?.descriptionHighlights}
        />
      </p>

      {/* Stats */}
      {about?.stats && about.stats.length > 0 && (
        <>
          {/* Mobile: vertical stack */}
          <div
            className="mt-6 flex flex-col gap-3 rounded-[16px] bg-white p-4 md:hidden"
            style={{ boxShadow: '0px 1px 3px rgba(0,0,0,0.06)' }}
          >
            {about.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span
                  className="font-manrope text-[36px] leading-[40px] font-bold tracking-[0px]"
                  style={{ color: theme.primary }}
                >
                  {stat.value}
                </span>
                <span
                  className="font-manrope mt-1 text-[14px] leading-[20px] font-bold tracking-[1.4px] uppercase"
                  style={{ color: '#595C5D' }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Desktop: side-by-side grid */}
          <div
            className="mt-8 hidden rounded-[16px] bg-white p-4 md:grid"
            style={{
              maxWidth: 592,
              minHeight: 92,
              boxShadow: '0px 1px 3px rgba(0,0,0,0.06)',
              gridTemplateColumns: '1fr 1px 1fr',
              gridTemplateRows: 'auto auto',
            }}
          >
            {about.stats.map((stat, i) => (
              <div
                key={stat.label}
                className="flex flex-col"
                style={{ gridColumn: i === 0 ? 1 : 3, gridRow: '1 / 3' }}
              >
                <span
                  className="font-manrope text-[36px] leading-[40px] font-bold tracking-[0px]"
                  style={{ color: theme.primary }}
                >
                  {stat.value}
                </span>
                <span
                  className="font-manrope mt-1 text-[14px] leading-[20px] font-bold tracking-[1.4px] uppercase"
                  style={{ color: '#595C5D' }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

function ServiceCards({
  about,
  stagger = false,
}: {
  readonly about: SubCompanyConfig['about'];
  readonly stagger?: boolean;
}) {
  if (!about?.cards || about.cards.length === 0) return null;
  return (
    <>
      {about.cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: stagger ? 0.1 * i : 0, ease: EASE }}
          className="flex items-center gap-4 rounded-[16px] p-4"
          style={{
            maxWidth: 592,
            minHeight: 108,
            background: card.highlighted
              ? 'linear-gradient(135deg, #6A1CF6 0%, #7343A9 100%)'
              : '#FFFFFF',
            boxShadow: card.highlighted ? 'none' : '0px 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div className="shrink-0">
            <Image
              src={card.icon}
              alt=""
              role="presentation"
              width={40}
              height={40}
              className="h-10 w-10"
            />
          </div>
          <div className="flex flex-col">
            <span
              className="font-manrope text-[20px] leading-[28px] font-bold tracking-[0px]"
              style={{ color: card.highlighted ? '#FFFFFF' : '#000000' }}
            >
              {card.title}
            </span>
            <span
              className="font-manrope mt-1 text-[14px] leading-[20px] font-normal tracking-[0px]"
              style={{ color: card.highlighted ? '#FFFFFF' : '#464646' }}
            >
              {card.description}
            </span>
          </div>
        </motion.div>
      ))}
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────

export function SubAbout({ config }: Readonly<SubAboutProps>) {
  const { about, theme } = config;
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  const [activeView, setActiveView] = useState(0);

  useEffect(() => {
    if (!isInView || !about?.cards || about.cards.length === 0) return;
    const interval = setInterval(() => {
      setActiveView((prev) => (prev === 0 ? 1 : 0));
    }, SWITCH_INTERVAL);
    return () => clearInterval(interval);
  }, [isInView, about?.cards]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-12 md:py-24"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Mobile: full-width #F3F3F3 bg — no card border */}
      <div className="md:hidden" style={{ backgroundColor: '#F3F3F3' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative mx-auto flex w-full max-w-[1440px] flex-col px-4 pb-10"
          style={{ paddingTop: 'calc(80px + 147px + 24px)' }}
        >
          <div className="flex justify-center self-center">
            {/* SVG — full width, centered, not clipped */}
            <div
              className="pointer-events-none absolute right-0 left-0 flex justify-center"
              style={{ top: 80, height: 147 }}
            >
              <Image
                src="/assets/sub-company/about/about-image.svg"
                alt=""
                role="presentation"
                width={342}
                height={147}
                className="h-full w-auto"
                style={{ objectFit: 'contain' }}
                loading="lazy"
              />
            </div>
          </div>
          {/* Text content */}
          <div className="mt-4 flex flex-col">
            <TextContent about={about} theme={theme} />
          </div>

          {/* Service cards */}
          {about?.cards && about.cards.length > 0 && (
            <div className="mt-4 flex flex-col gap-3">
              <ServiceCards about={about} />
            </div>
          )}
        </motion.div>
      </div>

      {/* ═══════════ DESKTOP layout ═══════════ */}
      <div className="mx-auto w-full max-w-[1440px] px-[72px]">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative hidden min-h-[676px] w-full items-center overflow-hidden rounded-[16px] md:flex"
          style={{ backgroundColor: '#F3F4F6' }}
        >
          {/* Left: SVG slides in from right */}
          <motion.div
            initial={{ opacity: 0, x: 120 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 120 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="pointer-events-none absolute"
            style={{ top: 118, left: -106, width: 1063, height: 441 }}
          >
            <Image
              src="/assets/sub-company/about/about-image.svg"
              alt=""
              role="presentation"
              width={1063}
              height={441}
              className="h-full w-full"
              style={{ objectFit: 'contain', objectPosition: 'left center' }}
              loading="lazy"
            />
          </motion.div>

          {/* Right: switching views */}
          <div className="relative z-10 ml-auto flex w-full md:w-[52%]">
            <div className="relative w-full" style={{ minHeight: 540 }}>
              <AnimatePresence mode="wait">
                {activeView === 0 && (
                  <motion.div
                    key="view1"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="absolute inset-0 flex flex-col justify-center px-12 py-12 lg:px-16"
                  >
                    <TextContent about={about} theme={theme} />
                  </motion.div>
                )}

                {activeView === 1 && about?.cards && about.cards.length > 0 && (
                  <motion.div
                    key="view2"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="absolute inset-0 flex flex-col justify-center gap-3 px-12 py-12 lg:px-16"
                  >
                    <ServiceCards about={about} stagger />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
