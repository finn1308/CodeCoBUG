import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { UserProfile } from './authManager';
import { createServerSupabaseClient } from '../supabase/server';

const AUTH_SECRET = process.env.AUTH_SECRET || 'codecobug-secure-session-secret-key-32bytes!';
const DEFAULT_TOKEN_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface SessionPayload {
  userId: string;
  email: string;
  displayName: string;
  role: 'learner' | 'instructor' | 'admin';
  points: number;
  issuedAt: number;
  expiresAt: number;
}

/**
 * Creates a cryptographically signed HMAC-SHA256 session token for a UserProfile.
 */
export function createSessionToken(user: UserProfile, expiresInMs = DEFAULT_TOKEN_EXPIRY_MS): string {
  const now = Date.now();
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    points: user.points,
    issuedAt: now,
    expiresAt: now + expiresInMs,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const hmac = crypto.createHmac('sha256', AUTH_SECRET);
  hmac.update(payloadB64);
  const signature = hmac.digest('base64url');

  return `${payloadB64}.${signature}`;
}

/**
 * Verifies the cryptographic signature and expiration of a session token.
 * Returns the decoded UserProfile if valid, or null if tampered/expired.
 */
export function verifySessionToken(token: string): UserProfile | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;

  // Recalculate HMAC signature
  const hmac = crypto.createHmac('sha256', AUTH_SECRET);
  hmac.update(payloadB64);
  const expectedSig = hmac.digest('base64url');

  // Timing safe compare to avoid side-channel attacks
  try {
    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }
  } catch {
    return null;
  }

  // Parse payload
  try {
    const rawPayload = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const payload: SessionPayload = JSON.parse(rawPayload);

    // Verify expiration
    if (payload.expiresAt && Date.now() > payload.expiresAt) {
      return null;
    }

    return {
      id: payload.userId,
      email: payload.email,
      displayName: payload.displayName,
      role: payload.role,
      points: payload.points || 0,
      createdAt: new Date(payload.issuedAt).toISOString(),
    };
  } catch {
    return null;
  }
}

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
