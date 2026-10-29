import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Admin Client
 * Uses privileged SUPABASE_SERVICE_ROLE_KEY.
 * STRICT SECURITY: ONLY FOR BACKEND EXECUTION! NEVER IMPORT OR USE IN BROWSER CODE!
 */
export function createAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
