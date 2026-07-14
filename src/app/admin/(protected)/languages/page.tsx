import { fetchSiteLanguages } from '@/services/languages';

import { LanguageManager } from '@/components/admin/languages/language-manager';
import { AdminPageHeader } from '@/components/admin/page-header';

import { createClient } from '@/lib/supabase/server';

export default async function AdminLanguagesPage() {
  // Fresh read with the admin's client — shows all languages incl. disabled ones
  const supabase = await createClient();
  const languages = await fetchSiteLanguages(supabase);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Languages"
        description="Choose which languages the website offers. New languages fall back to English until translated."
      />
      <LanguageManager languages={languages} />
    </div>
  );
}
