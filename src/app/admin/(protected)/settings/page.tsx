import { AdminPageHeader } from '@/components/admin/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Settings" description="Configure your CMS" />
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Site configuration</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          <p>Settings will be available here once the CMS is fully configured.</p>
        </CardContent>
      </Card>
    </div>
  );
}
