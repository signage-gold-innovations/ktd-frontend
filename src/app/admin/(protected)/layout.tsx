import { redirect } from 'next/navigation';
import { getAuthUser } from '@/services/auth';

import { AdminHeader } from '@/components/admin/header';
import { AdminSidebar } from '@/components/admin/sidebar';

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="bg-muted/40 flex min-h-screen">
      <AdminSidebar user={user} />
      <div className="flex flex-1 flex-col">
        <AdminHeader user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
