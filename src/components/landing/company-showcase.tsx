'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { ArrowRightIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface LocalizedString {
  en: string;
  th: string;
}

interface CompanyShowcaseProps {
  name: LocalizedString;
  description: LocalizedString;
  bgColor?: string;
  bottomImage?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  images?: string[];
}

const PLACEHOLDER_SLOTS = ['slot-0', 'slot-1', 'slot-2', 'slot-3', 'slot-4', 'slot-5'] as const;

export function CompanyShowcase({
  name,
  description,
  bgColor,
  bottomImage,
  socialLinks,
  images,
}: Readonly<CompanyShowcaseProps>) {
  const { t, language } = useLanguage();
  let nameText: string;
  if (typeof name === 'string') {
    nameText = name;
  } else {
    nameText = language === 'th' ? name.th : name.en;
  }
  let descriptionText: string;
  if (typeof description === 'string') {
    descriptionText = description;
  } else {
    descriptionText = language === 'th' ? description.th : description.en;
  }
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  function scrollRight() {
    scrollRef.current?.scrollBy({ left: 360, behavior: 'smooth' });
  }

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
    const x = e.clientX;
    const walk = x - startXRef.current;
    el.scrollLeft = scrollLeftRef.current - walk;
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
  }

  function onWheel(e: React.WheelEvent<HTMLDivElement>) {
    const el = scrollRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }
  return (
    <section
      className="relative overflow-hidden py-15 md:py-20"
      style={{ background: bgColor ?? '#1D1D1D' }}
    >
      <div className="w-full px-4 md:px-18">
        {/* Heading — inline white bg */}
        <h2
          className="w-full capitalize md:text-[36px]"
          style={{
            fontFamily: 'var(--font-anuphan)',
            fontWeight: 600,
            fontStyle: 'normal',
            fontSize: '32px',
            lineHeight: '120%',
            letterSpacing: '0%',
            color: '#FFFFFF',
          }}
        >
          {nameText}
        </h2>

        {/* Description */}
        <p
          className="mt-6 text-[16px] md:text-[18px] xl:text-[20px]"
          style={{
            fontFamily: 'var(--font-anuphan)',
            fontWeight: 500,
            fontStyle: 'normal',
            lineHeight: '140%',
            letterSpacing: '0%',
            color: '#C7C7C7',
          }}
        >
          {descriptionText}
        </p>

        {/* Social links — render by mapping, using the Instagram style as baseline */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {(() => {
            const basePillStyle: React.CSSProperties = {
              fontFamily: 'var(--font-anuphan)',
              fontWeight: 500,
              height: '52px',
              gap: '10px',
              borderRadius: '8px',
              background: 'rgba(18,18,18,0.28)',
              border: '1px solid rgba(255,255,255,0.14)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
              opacity: 1,
              paddingTop: '2px',
              paddingRight: '2px',
              paddingBottom: '2px',
              paddingLeft: '12px',
              width: '157px',
            };

            const iconBlockStyle: React.CSSProperties = {
              width: '56px',
              height: '48px',
              borderRadius: '6px',
              background: 'linear-gradient(180deg, #A92DFF 0%, #7600D8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            };

            type SocialItem = { key: string; label: string; href: string; iconSrc: string };
            const items: SocialItem[] = [];
            if (socialLinks.website)
              items.push({
                key: 'website',
                label: t.social.website,
                href: socialLinks.website,
                iconSrc: '/assets/icon/logo-web.png',
              });
            if (socialLinks.facebook)
              items.push({
                key: 'facebook',
                label: t.social.facebook,
                href: socialLinks.facebook,
                iconSrc: '/assets/icon/logo-fb.png',
              });
            if (socialLinks.instagram)
              items.push({
                key: 'instagram',
                label: t.social.instagram,
                href: socialLinks.instagram,
                iconSrc: '/assets/icon/logo-ig.png',
              });

            return items.map((it) => (
              <Link
                key={it.key}
                href={it.href}
                className="inline-flex items-center overflow-hidden transition-opacity hover:opacity-80"
                style={{
                  ...basePillStyle,
                }}
              >
                <span
                  className="flex flex-1 items-center justify-center text-[14px] text-white"
                  style={{
                    fontFamily: 'var(--font-anuphan)',
                    fontWeight: 500,
                    lineHeight: '140%',
                    color: '#FFFFFF',
                  }}
                >
                  {it.label}
                </span>
                <span style={iconBlockStyle}>
                  <Image
                    src={it.iconSrc}
                    alt={it.label}
                    width={24}
                    height={24}
                    className="size-6 object-contain"
                  />
                </span>
              </Link>
            ));
          })()}
        </div>

        {/* Image cards row with arrow button */}
        <div className="relative z-10 mt-10">
          {/* Scrollable container */}
          <div
            ref={scrollRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerLeave}
            onWheel={onWheel}
            className={`flex gap-2.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {(images && images.length > 0
              ? images.map((src) => ({ src, id: src }))
              : PLACEHOLDER_SLOTS.map((id) => ({ src: '', id }))
            ).map(({ src, id }, i) => {
              const isWide = i % 2 === 0;
              const cardStyle = {
                width: isWide ? '434px' : '311px',
                height: '244px',
                borderRadius: '8px',
              };
              return src ? (
                <Image
                  key={id}
                  src={src}
                  alt={`${nameText} ${i + 1}`}
                  width={isWide ? 434 : 311}
                  height={244}
                  className="shrink-0 object-cover"
                  style={{ ...cardStyle, flexShrink: 0 }}
                  draggable={false}
                />
              ) : (
                <div
                  key={id}
                  className="shrink-0"
                  style={{ ...cardStyle, backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#656565' }}
                />
              );
            })}
          </div>
          <button
            onClick={scrollRight}
            className="absolute top-1/2 right-4 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-[#4b4b4b] text-white shadow-md hover:bg-[#5a5a5a]"
            aria-label="Scroll right"
          >
            <HugeiconsIcon icon={ArrowRightIcon} className="size-6" />
          </button>
        </div>
      </div>
      {/* Bottom decorative image */}
      {bottomImage && (
        <Image
          src={bottomImage}
          alt=""
          width={1440}
          height={500}
          className="pointer-events-none absolute bottom-0 left-0 h-1/2 w-full object-cover md:h-auto"
        />
      )}
    </section>
  );
}
