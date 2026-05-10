import { AdminPageHeader } from '@/components/admin/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminMediaPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Media" description="Manage uploaded files" />
      <Card>
        <CardHeader>
          <CardTitle>Media Library</CardTitle>
          <CardDescription>No files uploaded yet</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          <p>Upload your first file to get started.</p>
        </CardContent>
      </Card>
    </div>
  );
}
