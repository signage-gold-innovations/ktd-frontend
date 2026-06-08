'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faArrowLeft, faArrowRight, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, useInView } from 'motion/react';

interface LocalizedString {
  en: string;
  th: string;
}

interface CompanyShowcaseProps {
  /** Used as the section's id attribute for in-page anchor navigation */
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  bgColor?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  images?: string[];
}

const PLACEHOLDER_SLOTS = ['slot-0', 'slot-1', 'slot-2', 'slot-3', 'slot-4', 'slot-5'] as const;

type SocialKey = 'website' | 'facebook' | 'instagram';

const SOCIAL_ICON_MAP = {
  website: faGlobe,
  facebook: faFacebook,
  instagram: faInstagram,
} as const;

export function CompanyShowcase({
  id,
  name,
  description,
  bgColor,
  socialLinks,
  images,
}: Readonly<CompanyShowcaseProps>) {
  const { t, language } = useLanguage();

  const nameText = language === 'th' ? name.th : name.en;
  const descriptionText = language === 'th' ? description.th : description.en;

  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, amount: 0.3 });

  const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

  const scrollRef = useRef<HTMLDivElement>(null);
  // Pointer drag state stored in refs (no re-render needed)
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  // Track whether the user's pointer is hovering the carousel
  // We only hijack wheel when they are explicitly hovering AND dragging,
  // never on passive scroll-by.
  const isHoveringRef = useRef(false);

  // Show/hide the scroll arrows
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // ── Arrow visibility ────────────────────────────────────────────────────
  function updateScrollState() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [images]);

  function scrollBy(direction: 'left' | 'right') {
    scrollRef.current?.scrollBy({
      left: direction === 'right' ? 360 : -360,
      behavior: 'smooth',
    });
  }

  // ── Pointer drag ────────────────────────────────────────────────────────
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const el = scrollRef.current;
    if (!el) return;
    isDownRef.current = true;
    setIsDragging(true);
    startXRef.current = e.clientX;
    scrollLeftRef.current = el.scrollLeft;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDownRef.current) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = scrollLeftRef.current - (e.clientX - startXRef.current);
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    isDownRef.current = false;
    setIsDragging(false);
    try {
      (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    } catch {}
  }

  function onPointerLeave() {
    isDownRef.current = false;
    setIsDragging(false);
    isHoveringRef.current = false;
  }

  function onPointerEnter() {
    isHoveringRef.current = true;
  }

  // ── Wheel: non-passive imperative listener ──────────────────────────────
  // FIX: We NO LONGER hijack the wheel event just because the mouse happens
  // to be over the carousel. We only scroll the carousel horizontally when
  // the user is actively dragging (i.e., pointer is captured). For normal
  // page scrolling, the event passes through untouched.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function handleWheel(e: WheelEvent) {
      if (!el) return;

      // Only take over if the user is mid-drag inside the carousel
      if (!isDownRef.current) return;

      // Only handle predominantly-vertical wheels
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

      e.preventDefault();
      el.scrollLeft += e.deltaY;
    }

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  const socialItems = (Object.keys(SOCIAL_ICON_MAP) as SocialKey[]).flatMap((key) => {
    const href = socialLinks[key];
    if (!href) return [];
    return [{ key, label: t.social[key], href, icon: SOCIAL_ICON_MAP[key] }];
  });

  const cardItems =
    images && images.length > 0
      ? images.map((src) => ({ src, imgId: src }))
      : PLACEHOLDER_SLOTS.map((slot) => ({ src: '', imgId: slot }));

  // Glassy scroll button style
  const scrollBtnStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
    border: '1px solid rgba(255,255,255,0.2)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
  };

  return (
    <section
      id={id}
      className="relative overflow-x-clip py-15 md:py-20"
      style={{ background: bgColor ?? '#1D1D1D' }}
    >
      {/* Content with padding */}
      <div ref={contentRef} className="w-full px-4 md:px-18">
        {/* Company name — slides in from left */}
        <motion.h2
          initial={{ opacity: 0, x: -32 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -32 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-anuphan w-full text-[32px] leading-[120%] font-semibold text-white capitalize md:text-[36px]"
        >
          {nameText}
        </motion.h2>

        {/* Description — slides in from left with slight delay */}
        <motion.p
          initial={{ opacity: 0, x: -24 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="font-anuphan mt-6 text-[16px] leading-[140%] font-medium text-[#C7C7C7] md:text-[18px] xl:text-[20px]"
        >
          {descriptionText}
        </motion.p>

        {/* Social links — fade in with stagger */}
        {socialItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
            className="mt-5 flex flex-wrap items-center gap-3"
          >
            {socialItems.map(({ key, label, href, icon }) => (
              <Link
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex h-[52px] w-auto items-center overflow-hidden rounded-[8px] transition-opacity hover:opacity-80"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                <span className="font-anuphan flex flex-1 items-center justify-center pr-[10px] pl-3 text-[16px] leading-[140%] font-medium text-white">
                  {label}
                </span>
                {/* Icon block */}
                <span
                  className="m-[2px] flex h-[48px] w-[56px] shrink-0 items-center justify-center rounded-[6px]"
                  style={{ background: 'linear-gradient(180deg, #A92DFF 0%, #7600D8 100%)' }}
                >
                  <FontAwesomeIcon
                    icon={icon}
                    className="text-white"
                    style={{ width: 20, height: 20 }}
                  />
                </span>
              </Link>
            ))}
          </motion.div>
        )}
      </div>

      {/* ── Image carousel — bleeds past the right edge of the viewport ── */}
      {/* Outer wrapper: position:relative so buttons anchor to it,        */}
      {/* but overflow is intentionally NOT clipped on x-axis.             */}
      <div className="relative mt-10">
        {/* Scrollable strip */}
        <div
          ref={scrollRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerLeave}
          onPointerEnter={onPointerEnter}
          className={`flex gap-2.5 overflow-x-auto pb-2 pl-4 [scrollbar-width:none] md:pl-18 [&::-webkit-scrollbar]:hidden ${
            isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
          }`}
          style={{ touchAction: 'pan-x' }}
        >
          {cardItems.map(({ src, imgId }, i) => {
            const isWide = i % 2 === 0;
            const w = isWide ? 434 : 311;
            return src ? (
              <div
                key={imgId}
                className="relative shrink-0 overflow-hidden rounded-[8px]"
                style={{ width: w, height: 244 }}
              >
                <Image
                  src={src}
                  alt={`${nameText} ${i + 1}`}
                  fill
                  sizes={`${w}px`}
                  loading="lazy"
                  className="object-cover"
                  draggable={false}
                />
              </div>
            ) : (
              <div
                key={imgId}
                className="shrink-0 rounded-[8px]"
                style={{
                  width: w,
                  height: 244,
                  backgroundColor: i % 2 === 0 ? '#3a3a3a' : '#555555',
                }}
              />
            );
          })}
          {/* Spacer so last card gets a "peek-behind" feel */}
          <div className="w-4 shrink-0 md:w-18" aria-hidden="true" />
        </div>

        {/* ← Left button: sits on top of the first card, aligned with content padding.
            Use pointer-events-none when hidden so it never blocks drag. */}
        <button
          onClick={() => scrollBy('left')}
          aria-label="Scroll left"
          className={`absolute top-1/2 left-4 z-10 flex h-15 w-15 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-105 md:left-18 ${
            canScrollLeft ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
          style={scrollBtnStyle}
        >
          <FontAwesomeIcon icon={faArrowLeft} style={{ width: 20, height: 20 }} />
        </button>

        {/* → Right button: pinned to right edge of the viewport.
            fixed would escape the section, so we use absolute + right-4.
            The section's overflow-x-clip only clips content that overflows the
            section box itself — the button stays inside so it renders fine. */}
        <button
          onClick={() => scrollBy('right')}
          aria-label="Scroll right"
          className={`absolute top-1/2 right-4 z-10 flex h-15 w-15 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-105 ${
            canScrollRight ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          } md:right-18`}
          style={scrollBtnStyle}
        >
          <FontAwesomeIcon icon={faArrowRight} style={{ width: 20, height: 20 }} />
        </button>
      </div>
    </section>
  );
}
