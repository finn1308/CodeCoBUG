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
 * Universal base64url helpers compatible with both Node.js and browser Webpack buffer polyfills.
 */
function toBase64Url(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(base64url: string): string {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  return base64;
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

  const payloadB64 = toBase64Url(Buffer.from(JSON.stringify(payload), 'utf8').toString('base64'));
  const hmac = crypto.createHmac('sha256', AUTH_SECRET);
  hmac.update(payloadB64);
  const signature = toBase64Url(hmac.digest('base64'));

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
  const expectedSig = toBase64Url(hmac.digest('base64'));

  // Timing safe compare to avoid side-channel attacks
  try {
    const sigBuf = Buffer.from(signature, 'utf8');
    const expectedBuf = Buffer.from(expectedSig, 'utf8');
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }

    const payloadJson = Buffer.from(fromBase64Url(payloadB64), 'base64').toString('utf8');
    const payload: SessionPayload = JSON.parse(payloadJson);

    // Defensively ensure payload object integrity and valid userId
    if (!payload || typeof payload !== 'object' || typeof payload.userId !== 'string' || !payload.userId.trim()) {
      return null;
    }

    // Check expiration
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
