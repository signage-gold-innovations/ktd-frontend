import { MediaLibrary } from '@/components/admin/media/media-library';
import { AdminPageHeader } from '@/components/admin/page-header';

export default function AdminMediaPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Media" description="Upload and manage landing page images" />
      <MediaLibrary />
    </div>
  );
}
