import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase Browser Client
 * Uses safe public anonymous keys only (NEXT_PUBLIC_SUPABASE_ANON_KEY).
 * Protected by Row Level Security (RLS) on PostgreSQL.
 */
export function createBrowserSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
