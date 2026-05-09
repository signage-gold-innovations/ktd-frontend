import Image from 'next/image';
import Link from 'next/link';

const socialIcons = [
  { src: '/assets/icon/logo-fb.png', href: '#', label: 'Facebook' },
  { src: '/assets/icon/logo-ig.png', href: '#', label: 'Instagram' },
  { src: '/assets/icon/logo-web.png', href: '#', label: 'Website' },
];

export function Footer() {
  return (
    <footer className="bg-black py-8">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 md:px-8">
        <p className="text-sm text-zinc-400">©2025. All rights reserved.</p>
        <div className="flex items-center gap-4">
          {socialIcons.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              className="opacity-60 transition-opacity hover:opacity-100"
              aria-label={social.label}
            >
              <Image
                src={social.src}
                alt={social.label}
                width={24}
                height={24}
                className="size-6 object-contain"
              />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
