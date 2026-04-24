'use client';

import Link from 'next/link';
import { MenuIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  return (
    <header className="fixed top-[40px] right-[42px] left-[42px] z-50 rounded-[8px] border border-white/10 bg-white/10 shadow-lg backdrop-blur-xl md:top-[48px] md:right-[60px] md:left-[60px] md:rounded-[12px]">
      <div className="flex h-[54px] w-full items-center gap-3 px-6 py-3 md:h-[68px] md:px-10">
        {/* Mobile/all-screen hamburger menu */}
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="text-white" />}>
            <HugeiconsIcon icon={MenuIcon} className="size-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-black text-white">
            <SheetHeader className="flex items-center justify-center">
              <SheetTitle
                className="text-center text-white"
                style={{
                  fontFamily: 'var(--font-anuphan)',
                  fontWeight: 700,
                  fontSize: '24px',
                  lineHeight: '120%',
                  letterSpacing: '0%',
                }}
              >
                Company Name
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-4 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/80 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo / Company Name */}
        <Link
          href="/"
          className="text-white md:text-[30px]"
          style={{
            fontFamily: 'var(--font-anuphan)',
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: '120%',
            letterSpacing: '0%',
          }}
        >
          Company Name
        </Link>
      </div>
    </header>
  );
}
