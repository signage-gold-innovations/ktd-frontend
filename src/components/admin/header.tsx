'use client';

import { useRouter } from 'next/navigation';

import type { User } from '@supabase/supabase-js';

import { Button } from '@/components/ui/button';

import { createClient } from '@/lib/supabase/client';

export function AdminHeader({ user }: { user: User }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <header className="border-border bg-card flex h-14 items-center justify-between border-b px-6">
      <div className="text-sm font-medium lg:hidden">Admin CMS</div>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground hidden text-sm sm:inline">{user.email}</span>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
