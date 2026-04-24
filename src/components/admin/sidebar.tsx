'use client';

import type { ComponentType } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebarStore } from '@/stores/sidebar';
import type { SolarIconProps } from 'solar-icon-set';
import {
  CloseCircleBoldDuotone,
  DocumentTextBoldDuotone,
  GalleryBoldDuotone,
  HamburgerMenuLineDuotone,
  HomeBoldDuotone,
  PenNewSquareBoldDuotone,
  SettingsBoldDuotone,
} from 'solar-icon-set';

import type { User } from '@supabase/supabase-js';

import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

const navItems: { label: string; href: string; icon: ComponentType<SolarIconProps> }[] = [
  { label: 'Dashboard', href: '/admin', icon: HomeBoldDuotone },
  { label: 'Pages', href: '/admin/pages', icon: DocumentTextBoldDuotone },
  { label: 'Content', href: '/admin/content', icon: PenNewSquareBoldDuotone },
  { label: 'Media', href: '/admin/media', icon: GalleryBoldDuotone },
  { label: 'Settings', href: '/admin/settings', icon: SettingsBoldDuotone },
];

function SidebarNav({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {navItems.map((item) => {
        const isActive =
          item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={cn(
              'flex items-center rounded-lg text-sm font-medium transition',
              collapsed ? 'justify-center px-2 py-2' : 'gap-2.5 px-3 py-2',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon size={18} />
            <span
              className={cn(
                'overflow-hidden whitespace-nowrap transition-opacity duration-150',
                collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 delay-100'
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar({ user }: { user: User }) {
  const { collapsed, toggle, mobileOpen, setMobileOpen } = useSidebarStore();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'border-border bg-card fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r transition-transform duration-200 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="border-border flex h-14 items-center justify-between border-b px-4">
          <span className="text-base font-semibold tracking-tight">Admin CMS</span>
          <Button
            variant="ghost"
            size="icon-sm"
            className="cursor-pointer"
            onClick={() => setMobileOpen(false)}
          >
            <CloseCircleBoldDuotone size={18} />
          </Button>
        </div>
        <SidebarNav collapsed={false} />
        <div className="border-border border-t p-3">
          <div className="text-muted-foreground truncate px-3 py-2 text-xs">{user.email}</div>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'border-border bg-card hidden shrink-0 border-r transition-[width] duration-200 lg:flex lg:flex-col',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        <div
          className={cn(
            'border-border flex h-14 items-center border-b',
            collapsed ? 'justify-center px-2' : 'justify-between px-4'
          )}
        >
          <span
            className={cn(
              'overflow-hidden text-base font-semibold tracking-tight whitespace-nowrap transition-opacity duration-150',
              collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 delay-100'
            )}
          >
            Admin CMS
          </span>
          <button
            onClick={toggle}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="text-muted-foreground hover:bg-muted hover:text-foreground flex cursor-pointer items-center justify-center rounded-lg px-2 py-2 text-sm font-medium transition"
          >
            <HamburgerMenuLineDuotone size={18} />
          </button>
        </div>

        <SidebarNav collapsed={collapsed} />

        <div
          className={cn(
            'border-border overflow-hidden border-t transition-opacity duration-150',
            collapsed ? 'h-0 border-none opacity-0' : 'p-3 opacity-100 delay-100'
          )}
        >
          <div className="text-muted-foreground truncate px-3 py-2 text-xs">{user.email}</div>
        </div>
      </aside>
    </>
  );
}
