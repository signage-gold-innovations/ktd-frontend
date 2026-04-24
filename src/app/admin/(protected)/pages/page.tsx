import { EmptyState } from '@/components/admin/empty-state';
import { AdminPageHeader } from '@/components/admin/page-header';

export default function AdminPagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Pages" description="Manage your site pages" />
      <EmptyState
        title="All Pages"
        description="No pages created yet"
        message="Create your first page to get started."
      />
    </div>
  );
}
