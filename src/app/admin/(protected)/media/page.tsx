import { EmptyState } from '@/components/admin/empty-state';
import { AdminPageHeader } from '@/components/admin/page-header';

export default function AdminMediaPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Media" description="Manage uploaded files" />
      <EmptyState
        title="Media Library"
        description="No files uploaded yet"
        message="Upload your first file to get started."
      />
    </div>
  );
}
