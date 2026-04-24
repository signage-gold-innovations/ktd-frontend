import { getAuthUser } from '@/services/auth';

import { AdminPageHeader } from '@/components/admin/page-header';
import { StatCard } from '@/components/admin/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminDashboardPage() {
  const user = await getAuthUser();

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Dashboard" description={`Welcome back, ${user?.email}`} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Pages" value="0" description="Published pages" />
        <StatCard title="Content" value="0" description="Content entries" />
        <StatCard title="Media" value="0" description="Uploaded files" />
        <StatCard title="Users" value="1" description="Admin users" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground flex flex-col gap-2 text-sm">
            <p>→ Create a new page</p>
            <p>→ Upload media</p>
            <p>→ Edit site settings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest changes</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            <p>No recent activity yet.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
