'use client';

import { useRouter } from 'next/navigation';
import { Logout2Icon } from '@solar-icons/react/linear/logout-2';

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
        <Logout2Icon size={16} color="currentColor" aria-hidden />
        Sign out
      </Button>
    </header>
  );
}
