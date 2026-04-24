'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSidebarStore } from '@/stores/sidebar';
import { HamburgerMenuLineDuotone, Logout3BoldDuotone } from 'solar-icon-set';

import type { User } from '@supabase/supabase-js';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

import { createClient } from '@/lib/supabase/client';

export function AdminHeader({ user }: { user: User }) {
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <header className="border-border bg-card flex h-14 items-center justify-between border-b px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        className="cursor-pointer lg:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <HamburgerMenuLineDuotone size={18} />
      </Button>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground hidden text-sm sm:inline">{user.email}</span>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          disabled={signingOut}
          onClick={handleSignOut}
        >
          {signingOut ? <Spinner /> : <Logout3BoldDuotone size={16} />}
          {signingOut ? 'Signing out...' : 'Sign out'}
        </Button>
      </div>
    </header>
  );
}
