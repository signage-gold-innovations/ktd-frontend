import { EmptyState } from '@/components/admin/empty-state';
import { AdminPageHeader } from '@/components/admin/page-header';

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Settings" description="Configure your CMS" />
      <EmptyState
        title="General Settings"
        description="Site configuration"
        message="Settings will be available here once the CMS is fully configured."
      />
    </div>
  );
}
