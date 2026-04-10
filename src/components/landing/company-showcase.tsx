'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRightIcon,
  FacebookIcon,
  InstagramIcon,
  InternetIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface CompanyShowcaseProps {
  name: string;
  description: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
}

export function CompanyShowcase({ name, description, socialLinks }: CompanyShowcaseProps) {
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

  function onPointerLeave(e: React.PointerEvent<HTMLDivElement>) {
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
    <section className="relative py-[60px] md:py-[80px]" style={{ backgroundColor: '#1D1D1D' }}>
      <div className="w-full px-4 md:px-[72px]">
        {/* Heading — inline white bg */}
        <h2
          className="inline-block bg-white px-4 py-2 text-[32px] leading-[100%] font-[700] text-black md:px-5 md:py-3 md:text-[40px]"
          style={{ fontFamily: 'var(--font-anuphan)' }}
        >
          {name}
        </h2>

        {/* Description */}
        <p
          className="mt-6 max-w-4xl text-[16px] leading-[170%] text-[#969696] md:text-[18px]"
          style={{ fontFamily: 'var(--font-anuphan)', fontWeight: 400 }}
        >
          {description}
        </p>

        {/* Social links — pill badges with white border */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {socialLinks.facebook && (
            <Link
              href={socialLinks.facebook}
              className="inline-flex items-center gap-2 bg-[#373737] px-4 py-2 text-[16px] text-white transition-colors hover:bg-white/10"
              style={{ fontFamily: 'var(--font-anuphan)', fontWeight: 500 }}
            >
              <HugeiconsIcon icon={FacebookIcon} className="size-6" />
              Facebook
            </Link>
          )}
          {socialLinks.instagram && (
            <Link
              href={socialLinks.instagram}
              className="inline-flex items-center gap-2 bg-[#373737] px-4 py-2 text-[16px] text-white transition-colors hover:bg-white/10"
              style={{ fontFamily: 'var(--font-anuphan)', fontWeight: 500 }}
            >
              <HugeiconsIcon icon={InstagramIcon} className="size-6" />
              Instagram
            </Link>
          )}
          {socialLinks.website && (
            <Link
              href={socialLinks.website}
              className="inline-flex items-center gap-2 bg-[#373737] px-4 py-2 text-[16px] text-white transition-colors hover:bg-white/10"
              style={{ fontFamily: 'var(--font-anuphan)', fontWeight: 500 }}
            >
              <HugeiconsIcon icon={InternetIcon} className="size-6" />
              Website
            </Link>
          )}
        </div>

        {/* Image cards row with arrow button */}
        <div className="mt-10 flex items-center gap-4">
          {/* Scrollable container */}
          <div
            ref={scrollRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerLeave}
            onWheel={onWheel}
            className={`flex gap-[10px] overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {['#FFFFFF', '#656565', '#FFFFFF', '#656565', '#FFFFFF', '#656565'].map((color, i) => {
              const isWide = i % 2 === 0;
              return (
                <div
                  key={i}
                  className="shrink-0 p-[40px]"
                  style={{
                    width: isWide ? '434px' : '311px',
                    height: '244px',
                    backgroundColor: color,
                  }}
                />
              );
            })}
          </div>
          <button
            onClick={scrollRight}
            className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full bg-[#4b4b4b] text-white shadow-md hover:bg-[#5a5a5a]"
            aria-label="Scroll right"
          >
            <HugeiconsIcon icon={ArrowRightIcon} className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
