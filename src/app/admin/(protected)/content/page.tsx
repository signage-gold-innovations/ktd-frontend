import { EmptyState } from '@/components/admin/empty-state';
import { AdminPageHeader } from '@/components/admin/page-header';

export default function AdminContentPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Content" description="Manage your content entries" />
      <EmptyState
        title="All Content"
        description="No content entries yet"
        message="Create your first content entry to get started."
      />
    </div>
  );
}
