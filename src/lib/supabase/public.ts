import { createClient } from '@supabase/supabase-js';

/**
 * Anonymous, cookie-less Supabase client for cached public reads.
 *
 * Unlike src/lib/supabase/server.ts this never touches cookies()/headers(),
 * which makes it safe to use inside unstable_cache scopes (Request-time APIs
 * are not supported there). Only use it for public data guarded by RLS.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: { persistSession: false },
    }
  );
}
