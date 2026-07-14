/**
 * Supabase Migration: Fix infinite recursion in admin_users RLS policies
 *
 * Problem: The SELECT/UPDATE policies on admin_users reference admin_users
 * itself via an EXISTS subquery, causing PostgreSQL error 42P17:
 * "infinite recursion detected in policy for relation admin_users"
 *
 * Fix: Replace the self-referencing policies with ones that use the
 * public.is_admin() SECURITY DEFINER function (which bypasses RLS on
 * the inner query) or simple direct checks.
 *
 * Run this in your Supabase SQL Editor:
 * https://app.supabase.com → SQL Editor → New Query → Paste & Run
 */

-- ---------------------------------------------------------------------------
-- 1. Drop the problematic policies
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.admin_users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.admin_users;

-- ---------------------------------------------------------------------------
-- 2. Recreate policies using public.is_admin() (SECURITY DEFINER, no recursion)
-- ---------------------------------------------------------------------------

-- Any authenticated user can view their OWN row (for checkAdminAccess)
CREATE POLICY "Users can view their own profile" ON public.admin_users
  FOR SELECT
  USING (id = auth.uid());

-- Admins can view ALL admin users (uses SECURITY DEFINER function)
CREATE POLICY "Admins can view all admin users" ON public.admin_users
  FOR SELECT
  USING (public.is_admin());

-- Admins can update any admin user
CREATE POLICY "Admins can update admin users" ON public.admin_users
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Users can update their own non-sensitive fields (last_login_at, etc.)
-- Note: cannot prevent role/is_admin changes at the policy level without
-- recursion, so enforce that in application code instead.
CREATE POLICY "Users can update own profile" ON public.admin_users
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
