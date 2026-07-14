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

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          email: string;
          is_admin: boolean;
          role: 'admin' | 'moderator' | 'editor';
          created_at: string;
          updated_at: string;
          last_login_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          is_admin?: boolean;
          role?: 'admin' | 'moderator' | 'editor';
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          is_admin?: boolean;
          role?: 'admin' | 'moderator' | 'editor';
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
      };
      landing_sections: {
        Row: {
          key: 'nav' | 'hero' | 'about' | 'services' | 'footer' | 'social';
          content: Json;
          images: Json | null;
          updated_at: string;
        };
        Insert: {
          key: 'nav' | 'hero' | 'about' | 'services' | 'footer' | 'social';
          content?: Json;
          images?: Json | null;
          updated_at?: string;
        };
        Update: {
          key?: 'nav' | 'hero' | 'about' | 'services' | 'footer' | 'social';
          content?: Json;
          images?: Json | null;
          updated_at?: string;
        };
      };
      landing_companies: {
        Row: {
          slug: string;
          name: Json;
          description: Json;
          bg_color: string;
          bottom_image: string | null;
          social_links: Json;
          images: string[];
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          slug: string;
          name?: Json;
          description?: Json;
          bg_color: string;
          bottom_image?: string | null;
          social_links?: Json;
          images?: string[];
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          name?: Json;
          description?: Json;
          bg_color?: string;
          bottom_image?: string | null;
          social_links?: Json;
          images?: string[];
          sort_order?: number;
          updated_at?: string;
        };
      };
      landing_events: {
        Row: {
          id: string;
          occurred_at: string;
          session_id: string;
          event_type: 'page_view' | 'language_switch' | 'cta_click' | 'social_click' | 'nav_click';
          path: string;
          language: string | null;
          referrer: string | null;
          target: string | null;
          device: 'mobile' | 'tablet' | 'desktop' | null;
        };
        Insert: {
          id?: string;
          occurred_at?: string;
          session_id: string;
          event_type: 'page_view' | 'language_switch' | 'cta_click' | 'social_click' | 'nav_click';
          path: string;
          language?: string | null;
          referrer?: string | null;
          target?: string | null;
          device?: 'mobile' | 'tablet' | 'desktop' | null;
        };
        Update: {
          id?: string;
          occurred_at?: string;
          session_id?: string;
          event_type?: 'page_view' | 'language_switch' | 'cta_click' | 'social_click' | 'nav_click';
          path?: string;
          language?: string | null;
          referrer?: string | null;
          target?: string | null;
          device?: 'mobile' | 'tablet' | 'desktop' | null;
        };
      };
      site_languages: {
        Row: {
          code: string;
          label: string;
          name: string;
          native_name: string;
          enabled: boolean;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          code: string;
          label: string;
          name: string;
          native_name: string;
          enabled?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          code?: string;
          label?: string;
          name?: string;
          native_name?: string;
          enabled?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
      };
      // Add your other tables here...
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: 'admin' | 'moderator' | 'editor';
    };
  };
};

/**
 * ✅ Helper type for typed queries
 *
 * Usage:
 * const { data, error } = await supabase
 *   .from('admin_users')
 *   .select()
 *   .returns<Database['public']['Tables']['admin_users']['Row'][]>()
 */
export type AdminUser = Database['public']['Tables']['admin_users']['Row'];
export type AdminUserInsert = Database['public']['Tables']['admin_users']['Insert'];
export type AdminUserUpdate = Database['public']['Tables']['admin_users']['Update'];

export type LandingSectionRecord = Database['public']['Tables']['landing_sections']['Row'];
export type LandingCompanyRecord = Database['public']['Tables']['landing_companies']['Row'];
export type LandingEventRecord = Database['public']['Tables']['landing_events']['Row'];
export type SiteLanguageRecord = Database['public']['Tables']['site_languages']['Row'];
