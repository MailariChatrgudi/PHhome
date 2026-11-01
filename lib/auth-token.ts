import { SignJWT } from 'jose/jwt/sign';
import { jwtVerify } from 'jose/jwt/verify';

/**
 * lib/auth-token.ts
 *
 * Edge-compatible JWT session helpers (no Node.js crypto or bcrypt dependencies).
 * Safe for use in middleware.ts and route handlers.
 */

const JWT_SECRET = process.env.JWT_SECRET || 'ph-home-default-super-secret-key-32-chars';
const secretKey = new TextEncoder().encode(JWT_SECRET);

export const SESSION_COOKIE_NAME = 'session';

export interface SessionPayload {
  email: string;
  role: 'admin';
}

/**
 * Creates a signed JWT session token valid for 7 days.
 */
export async function createSessionToken(email: string): Promise<string> {
  return new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

/**
 * Verifies a JWT session token and extracts the payload.
 * Fully Edge-compatible using Web Crypto API.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (!payload.email || typeof payload.email !== 'string') {
      return null;
    }
    return {
      email: payload.email,
      role: 'admin',
    };
  } catch {
    return null;
  }
}

