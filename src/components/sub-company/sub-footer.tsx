'use client';

import Link from 'next/link';
import type { SubCompanyConfig } from '@/config/sub-companies';
import { motion } from 'motion/react';

interface SubFooterProps {
  readonly config: SubCompanyConfig;
}

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

/** Reusable footer column */
function FooterColumn({
  heading,
  accentColor,
  children,
}: {
  readonly heading: string;
  readonly accentColor: string;
  readonly children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <span
        className="font-manrope text-[12px] leading-[16px] font-bold tracking-[1.1px] uppercase"
        style={{ color: accentColor }}
      >
        {heading}
      </span>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

const LINK_CLASS =
  'font-manrope text-[12px] font-bold uppercase leading-[16px] tracking-[1.1px] transition-opacity hover:opacity-70';
const LINK_COLOR = '#959595';

export function SubFooter({ config }: Readonly<SubFooterProps>) {
  const { footer, theme } = config;

  return (
    <motion.footer
      id="contact"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="py-10 md:py-12"
      style={{ backgroundColor: '#F3F4F6' }}
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-[72px]">
        {/* ── Desktop: 4-column grid, gap 32px ── */}
        <div className="hidden md:grid md:grid-cols-[296px_1fr_1fr_1fr] md:gap-8">
          {/* Brand column */}
          <div className="flex min-w-[160px] flex-col gap-3">
            <span
              className="font-manrope text-[13px] leading-[18px] font-bold tracking-[1.3px] uppercase"
              style={{ color: '#2C2F30' }}
            >
              {footer?.brandName}
            </span>
            <p
              className="font-manrope text-[12px] leading-[18px] font-medium tracking-[0.5px] whitespace-pre-line uppercase"
              style={{ color: '#959595' }}
            >
              {footer?.copyright}
            </p>
          </div>

          {/* Navigation */}
          <FooterColumn heading="NAVIGATION" accentColor={theme.accent}>
            {footer?.navLinks?.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={LINK_CLASS}
                style={{ color: LINK_COLOR }}
              >
                {link.label}
              </Link>
            ))}
          </FooterColumn>

          {/* Specializations */}
          <FooterColumn heading="SPECIALIZATIONS" accentColor={theme.accent}>
            {footer?.specializations?.map((item) =>
              item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className={LINK_CLASS}
                  style={{ color: LINK_COLOR }}
                >
                  {item.label}
                </Link>
              ) : (
                <span key={item.label} className={LINK_CLASS} style={{ color: LINK_COLOR }}>
                  {item.label}
                </span>
              )
            )}
          </FooterColumn>

          {/* Social */}
          <FooterColumn heading="SOCIAL" accentColor={theme.accent}>
            {footer?.socialLinks?.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK_CLASS}
                style={{ color: LINK_COLOR }}
              >
                {link.label}
              </Link>
            ))}
          </FooterColumn>
        </div>

        {/* ── Mobile: stacked ── */}
        <div className="mb-9 flex flex-col gap-8 md:hidden">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <span
              className="font-manrope text-[18px] leading-[18px] font-semibold tracking-[1.3px] uppercase"
              style={{ color: '#323232' }}
            >
              {footer?.brandName}
            </span>
            <p
              className="font-manrope text-[12px] leading-[18px] font-medium tracking-[0.5px] whitespace-pre-line uppercase"
              style={{ color: LINK_COLOR }}
            >
              {footer?.copyright}
            </p>
          </div>

          {/* Navigation */}
          <FooterColumn heading="NAVIGATION" accentColor={theme.primary}>
            {footer?.navLinks?.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={LINK_CLASS}
                style={{ color: LINK_COLOR }}
              >
                {link.label}
              </Link>
            ))}
          </FooterColumn>

          {/* Specializations */}
          <FooterColumn heading="SPECIALIZATIONS" accentColor={theme.primary}>
            {footer?.specializations?.map((item) =>
              item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className={LINK_CLASS}
                  style={{ color: LINK_COLOR }}
                >
                  {item.label}
                </Link>
              ) : (
                <span key={item.label} className={LINK_CLASS} style={{ color: LINK_COLOR }}>
                  {item.label}
                </span>
              )
            )}
          </FooterColumn>

          {/* Social */}
          <FooterColumn heading="SOCIAL" accentColor={theme.primary}>
            {footer?.socialLinks?.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK_CLASS}
                style={{ color: LINK_COLOR }}
              >
                {link.label}
              </Link>
            ))}
          </FooterColumn>
        </div>
      </div>
    </motion.footer>
  );
}
