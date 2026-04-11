import Link from 'next/link';
import {
  FacebookIcon,
  InternetIcon,
  NewTwitterIcon,
  YoutubeIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const socialIcons = [
  { icon: FacebookIcon, href: '#', label: 'Facebook' },
  { icon: YoutubeIcon, href: '#', label: 'YouTube' },
  { icon: NewTwitterIcon, href: '#', label: 'X' },
  { icon: InternetIcon, href: '#', label: 'Website' },
];

export function Footer() {
  return (
    <footer className="bg-zinc-900 py-8">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 md:px-8">
        <p className="text-sm text-zinc-400">©2025. All rights reserved.</p>
        <div className="flex items-center gap-4">
          {socialIcons.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              className="text-zinc-400 transition-colors hover:text-white"
              aria-label={social.label}
            >
              <HugeiconsIcon icon={social.icon} style={{ width: 24, height: 24 }} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
