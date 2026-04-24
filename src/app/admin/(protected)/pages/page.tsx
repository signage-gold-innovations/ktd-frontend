import { AdminPageHeader } from '@/components/admin/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Pages" description="Manage your site pages" />
      <Card>
        <CardHeader>
          <CardTitle>All Pages</CardTitle>
          <CardDescription>No pages created yet</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          <p>Create your first page to get started.</p>
        </CardContent>
      </Card>
    </div>
  );
}
