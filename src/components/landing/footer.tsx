'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { faFacebook, faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SOCIAL_ICONS = [
  { icon: faFacebook, label: 'Facebook', href: '#' },
  { icon: faYoutube, label: 'Youtube', href: '#' },
  { icon: faXTwitter, label: 'X', href: '#' },
  { icon: faGlobe, label: 'Website', href: '#' },
] as const;

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer
      id="contact"
      className="py-8"
      style={{ background: 'linear-gradient(360deg, #39005D 0%, #010214 100%)' }}
    >
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 md:px-8">
        <p className="font-anuphan text-[16px] font-normal text-white">
          &copy;{CURRENT_YEAR}. {t?.footer?.rights}
        </p>
        <div className="flex items-center gap-5">
          {SOCIAL_ICONS.map(({ icon, label, href }) => (
            <Link
              key={label}
              href={href}
              aria-label={label}
              className="text-white transition-opacity hover:opacity-70"
            >
              <FontAwesomeIcon icon={icon} style={{ width: 20, height: 20 }} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
