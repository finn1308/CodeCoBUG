import crypto from 'crypto';

/**
 * CodeCoBUG AI Security & Cryptography Module
 * Implements AES-256-GCM encryption for user-provided API credentials (BYOK).
 * Enforces key redaction so secrets never leak to browser logs or error traces.
 */

// Encryption secret from environment or fallback derivation salt
const ENCRYPTION_SECRET = process.env.AI_ENCRYPTION_SECRET || 'codecobug-sec-key-32-bytes-salt-2026';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits for GCM
const KEY_BUFFER = crypto.createHash('sha256').update(ENCRYPTION_SECRET).digest();

/**
 * Encrypt plain API key using AES-256-GCM
 */
export function encryptApiKey(plainKey: string): string {
  if (!plainKey || typeof plainKey !== 'string') return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY_BUFFER, iv);
  
  let encrypted = cipher.update(plainKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  // Format: iv:authTag:encryptedHex
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypt ciphertext back to plain API key
 */
export function decryptApiKey(cipherText: string): string {
  if (!cipherText || typeof cipherText !== 'string') return '';
  const parts = cipherText.split(':');
  if (parts.length !== 3) {
    // If not in encrypted format (e.g. direct raw key in transit), return as is
    return cipherText;
  }

  const [ivHex, authTagHex, encryptedHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY_BUFFER, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * Mask an API key for safe UI display (e.g. "AIzaSy...8x9q")
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 10) return '••••••••';
  const prefix = apiKey.substring(0, 6);
  const suffix = apiKey.substring(apiKey.length - 4);
  return `${prefix}...${suffix}`;
}

/**
 * Redact all occurrences of an API key from error text or tracebacks
 */
export function redactApiKey(text: string, apiKey?: string): string {
  if (!text) return '';
  let sanitized = text;

  // Redact specific key if provided
  if (apiKey && apiKey.length >= 8) {
    sanitized = sanitized.split(apiKey).join('[REDACTED_API_KEY]');
  }

  // Redact common API key patterns: AIzaSy..., sk-..., etc.
  sanitized = sanitized.replace(/AIzaSy[A-Za-z0-9_-]{33}/g, '[REDACTED_GEMINI_KEY]');
  sanitized = sanitized.replace(/sk-[A-Za-z0-9_-]{20,}/g, '[REDACTED_OPENAI_KEY]');
  sanitized = sanitized.replace(/sk-ant-[A-Za-z0-9_-]{20,}/g, '[REDACTED_ANTHROPIC_KEY]');

  return sanitized;
}
