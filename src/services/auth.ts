import type { User } from '@supabase/supabase-js';

import { createClient } from '@/lib/supabase/server';

/**
 * Get the authenticated user from a Server Component / Server Action.
 * Returns null if not authenticated. Avoids repeating createClient + getUser everywhere.
 */
export async function getAuthUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
