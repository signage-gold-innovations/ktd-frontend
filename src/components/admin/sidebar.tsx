'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChartSquareIcon } from '@solar-icons/react/linear/chart-square';
import { DocumentTextIcon } from '@solar-icons/react/linear/document-text';
import { FireIcon } from '@solar-icons/react/linear/fire';
import { GalleryIcon } from '@solar-icons/react/linear/gallery';
import { TranslationIcon } from '@solar-icons/react/linear/translation';

import type { User } from '@supabase/supabase-js';

import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: ChartSquareIcon },
  { label: 'Heatmap', href: '/admin/heatmap', icon: FireIcon },
  { label: 'Content', href: '/admin/content', icon: DocumentTextIcon },
  { label: 'Media', href: '/admin/media', icon: GalleryIcon },
  { label: 'Languages', href: '/admin/languages', icon: TranslationIcon },
];

export function AdminSidebar({ user }: { user: User }) {
  const pathname = usePathname();

  return (
    <aside className="border-border bg-card hidden w-60 shrink-0 border-r lg:flex lg:flex-col">
      <div className="border-border flex h-14 items-center gap-2 border-b px-4">
        <span className="text-base font-semibold tracking-tight">Admin CMS</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon size={18} color="currentColor" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-border border-t p-3">
        <div className="text-muted-foreground truncate px-3 py-2 text-xs">{user.email}</div>
      </div>
    </aside>
  );
}
