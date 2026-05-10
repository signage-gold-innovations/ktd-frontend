/**
 * ✅ LATEST STANDARD (2026): Supabase TypeScript Types
 * 
 * Generated types for your Supabase schema.
 * To regenerate: npx supabase gen types typescript --project-id your-project-id > src/types/database.ts
 * 
 * Or use the MCP tool:
 * supabase generate_typescript_types
 * 
 * This file provides complete type safety for your database queries.
 */

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          email: string
          is_admin: boolean
          role: 'admin' | 'moderator' | 'editor'
          created_at: string
          updated_at: string
          last_login_at: string | null
        }
        Insert: {
          id: string
          email: string
          is_admin?: boolean
          role?: 'admin' | 'moderator' | 'editor'
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          is_admin?: boolean
          role?: 'admin' | 'moderator' | 'editor'
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
      }
      // Add your other tables here...
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: 'admin' | 'moderator' | 'editor'
    }
  }
}

/**
 * ✅ Helper type for typed queries
 * 
 * Usage:
 * const { data, error } = await supabase
 *   .from('admin_users')
 *   .select()
 *   .returns<Database['public']['Tables']['admin_users']['Row'][]>()
 */
export type AdminUser = Database['public']['Tables']['admin_users']['Row']
export type AdminUserInsert = Database['public']['Tables']['admin_users']['Insert']
export type AdminUserUpdate = Database['public']['Tables']['admin_users']['Update']
