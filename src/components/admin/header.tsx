'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { createClient } from '@/lib/supabase/client';

export function AdminHeader() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <header className="border-border bg-card flex h-14 shrink-0 items-center justify-between border-b px-6">
      <div className="text-sm font-medium lg:hidden">Admin CMS</div>
      <div className="hidden lg:block" />
      <Button variant="outline" size="sm" onClick={handleSignOut}>
        Sign out
      </Button>
    </header>
  );
}
