import { redirect } from 'next/navigation';
import { getAuthUser } from '@/services/auth';

import { AdminHeader } from '@/components/admin/header';
import { AdminSidebar } from '@/components/admin/sidebar';
import { ToastProvider } from '@/components/admin/toast-provider';

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    // h-dvh + overflow-hidden pins the shell to the viewport; only <main> scrolls
    <div className="bg-muted/40 flex h-dvh overflow-hidden">
      <AdminSidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <ToastProvider />
    </div>
  );
}
