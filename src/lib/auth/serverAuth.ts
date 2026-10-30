import { NextRequest } from 'next/server';
import { UserProfile } from './authManager';
import { createServerSupabaseClient } from '../supabase/server';
import {
  createSessionToken,
  verifySessionToken,
  SessionPayload,
} from './sessionToken';

export { createSessionToken, verifySessionToken, type SessionPayload };

/**
 * Authoritative Server-Side User Identification:
 * 1. Checks Supabase auth cookie via createServerSupabaseClient() if available.
 * 2. Checks Authorization header ('Bearer <token>') with cryptographic HMAC verification.
 * 3. Checks custom x-codecobug-session header or cookie.
 * 
 * CRITICAL SECURITY INVARIANT:
 * NEVER trusts client-supplied user IDs without cryptographic authorization verification!
 */
export async function getServerAuthenticatedUser(
  req: NextRequest | Request
): Promise<UserProfile | null> {
  // 1. Check Authorization header: Bearer <token>
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const verified = verifySessionToken(token);
    if (verified) return verified;
  }

  // 2. Check custom x-codecobug-session header
  const customHeader = req.headers.get('x-codecobug-session');
  if (customHeader) {
    const verified = verifySessionToken(customHeader.trim());
    if (verified) return verified;
  }

  // 3. Check Supabase server cookies if Supabase environment is active
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
  ) {
    try {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user && !error) {
        return {
          id: user.id,
          email: user.email || '',
          displayName: user.user_metadata?.display_name || user.email?.split('@')[0] || 'Học viên',
          role: (user.user_metadata?.role as any) || 'learner',
          points: user.user_metadata?.points || 0,
          createdAt: user.created_at,
        };
      }
    } catch {
      // Supabase server client unavailable
    }
  }

  // 4. Check cookie header directly if present
  const cookieHeader = req.headers.get('cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(/codecobug_session=([^;]+)/);
    if (match && match[1]) {
      const verified = verifySessionToken(decodeURIComponent(match[1]));
      if (verified) return verified;
    }
  }

  return null;
}
