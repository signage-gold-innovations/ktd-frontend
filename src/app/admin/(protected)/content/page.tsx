import { AdminPageHeader } from '@/components/admin/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminContentPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Content" description="Manage your content entries" />
      <Card>
        <CardHeader>
          <CardTitle>All Content</CardTitle>
          <CardDescription>No content entries yet</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          <p>Create your first content entry to get started.</p>
        </CardContent>
      </Card>
    </div>
  );
}
