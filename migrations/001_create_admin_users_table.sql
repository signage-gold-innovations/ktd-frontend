/**
 * Supabase Migration: Create Admin Users Table with RLS
 * 
 * This migration creates a table to manage admin users with proper
 * Row Level Security policies. This is the LATEST STANDARD (2026) for
 * managing admin access in Supabase.
 * 
 * IMPORTANT: Run this in your Supabase SQL Editor or apply via:
 * supabase migration new create_admin_users_table
 * 
 * Then paste the SQL below and run:
 * supabase db push
 */

-- Create the admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  role TEXT NOT NULL DEFAULT 'moderator', -- 'admin' | 'moderator' | 'editor'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::TEXT, NOW()) NOT NULL,
  last_login_at TIMESTAMP WITH TIME ZONE,
  
  PRIMARY KEY (id),
  UNIQUE (email)
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policy 1: Admins can view all admin users
CREATE POLICY "Admins can view admin users" ON public.admin_users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Policy 2: Admins can update admin users
CREATE POLICY "Admins can update admin users" ON public.admin_users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Policy 3: Users can view their own admin profile
CREATE POLICY "Users can view their own profile" ON public.admin_users
  FOR SELECT
  USING (id = auth.uid());

-- Policy 4: Users can update their own profile (except is_admin)
CREATE POLICY "Users can update their own profile" ON public.admin_users
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() AND
    (is_admin = (SELECT is_admin FROM public.admin_users WHERE id = auth.uid())) -- Cannot change own admin status
  );

-- Create indexes for performance
CREATE INDEX idx_admin_users_email ON public.admin_users(email);
CREATE INDEX idx_admin_users_is_admin ON public.admin_users(is_admin);
CREATE INDEX idx_admin_users_role ON public.admin_users(role);

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('UTC'::TEXT, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_admin_users_updated_at();

-- Create or replace function to update last_login_at
CREATE OR REPLACE FUNCTION public.update_admin_users_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.admin_users
  SET last_login_at = TIMEZONE('UTC'::TEXT, NOW())
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users to update last_login_at (requires event triggers)
-- Note: This requires Supabase webhook or Edge Function to trigger

-- Add comments for documentation
COMMENT ON TABLE public.admin_users IS 'Stores admin user information with role-based access control';
COMMENT ON COLUMN public.admin_users.is_admin IS 'Legacy field - use role field instead for more granular control';
COMMENT ON COLUMN public.admin_users.role IS 'User role: admin (full access), moderator (content), editor (posts only)';
