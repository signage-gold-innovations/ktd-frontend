import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types/database';

import { createClient } from '@/lib/supabase/server';

import { getAuthUser } from './auth';

/**
 * Check admin privileges. Accepts an optional userId to avoid
 * redundant getUser() calls when the caller already has the user.
 *
 * Returns true for any authenticated user in the admin_users table
 * (admin, moderator, or editor). The presence of a row in admin_users
 * with any valid role grants CMS access.
 */
export async function checkAdminAccess(userId?: string): Promise<boolean> {
  // Use a SINGLE client for both auth and DB query to ensure token
  // refresh (if triggered by getUser()) is reflected in the DB request.
  const supabase = await createClient();

  let targetId = userId;
  if (!targetId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    targetId = user?.id;
  }

  if (!targetId) {
    console.error('[checkAdminAccess] No authenticated user found');
    return false;
  }

  const { data, error } = await supabase
    .from('admin_users')
    .select('is_admin, role')
    .eq('id', targetId)
    .single();

  if (error) {
    console.error('[checkAdminAccess] Query error:', error.message, '| code:', error.code);
    return false;
  }

  if (!data) {
    console.error('[checkAdminAccess] No admin_users row for user:', targetId);
    return false;
  }

  // Any valid role in admin_users grants CMS access (admin, moderator, editor)
  const validRoles = ['admin', 'moderator', 'editor'];
  return data.is_admin || validRoles.includes(data.role);
}

/**
 * Get admin role. Accepts an optional userId to skip the getUser() call.
 */
export async function getAdminRole(userId?: string): Promise<string | null> {
  const supabase = await createClient();

  const targetId = userId ?? (await getAuthUser())?.id;
  if (!targetId) return null;

  const { data, error } = await supabase
    .from('admin_users')
    .select('role, is_admin')
    .eq('id', targetId)
    .single();

  if (error) {
    console.error('Error fetching admin role:', error);
    return null;
  }

  return data?.role ?? null;
}

/**
 * Validate admin access from middleware context where you already
 * have a Supabase client instance and user ID.
 */
export async function validateAdminMiddleware(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<{ isAdmin: boolean; role: string | null }> {
  type AdminRow = Database['public']['Tables']['admin_users']['Row'];

  const { data, error } = await supabase
    .from('admin_users')
    .select('is_admin, role')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return { isAdmin: false, role: null };
  }

  const row = data as unknown as Pick<AdminRow, 'is_admin' | 'role'>;
  return {
    isAdmin: row.is_admin || row.role === 'admin',
    role: row.role,
  };
}
