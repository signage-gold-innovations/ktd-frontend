import { createClient } from './server'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

/**
 * ✅ LATEST STANDARD: Admin helper to check admin privileges
 * 
 * Usage in Server Components or API Routes:
 * const isAdmin = await checkAdminAccess()
 */

export async function checkAdminAccess(userId?: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return false
  }

  const targetId = userId || user.id

  const { data, error } = await supabase
    .from('admin_users')
    .select('is_admin, role')
    .eq('id', targetId)
    .single()

  if (error || !data) {
    return false
  }

  return data.is_admin || data.role === 'admin'
}

/**
 * ✅ LATEST STANDARD: Get admin role with error handling
 */
export async function getAdminRole() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return null
  }

  const { data, error } = await supabase
    .from('admin_users')
    .select('role, is_admin')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching admin role:', error)
    return null
  }

  return data?.role || null
}

/**
 * ✅ LATEST STANDARD: Middleware helper to validate admin access
 * Usage in middleware.ts for route protection
 */
export async function validateAdminMiddleware(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<{ isAdmin: boolean; role: string | null }> {
  type AdminUserRow = Database['public']['Tables']['admin_users']['Row']
  
  const { data, error } = await supabase
    .from('admin_users')
    .select('is_admin, role')
    .eq('id', userId)
    .single()

  if (error || !data) {
    return { isAdmin: false, role: null }
  }

  const adminData = data as unknown as Pick<AdminUserRow, 'is_admin' | 'role'>
  return {
    isAdmin: adminData.is_admin || adminData.role === 'admin',
    role: adminData.role,
  }
}
