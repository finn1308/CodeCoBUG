import crypto from 'crypto';
import { UserProfile } from './authManager';

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

    const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const payload: SessionPayload = JSON.parse(payloadJson);

    // Check expiration
    if (Date.now() > payload.expiresAt) {
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

