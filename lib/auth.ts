import bcrypt from 'bcryptjs';

/**
 * lib/auth.ts
 *
 * Node.js-only authentication helpers for admin credentials (bcrypt verification).
 * JWT token helpers are exported from Edge-compatible lib/auth-token.ts.
 */

export * from './auth-token';

/**
 * Verifies admin password against bcrypt hash from environment.
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    console.warn('ADMIN_PASSWORD_HASH is not set in environment.');
    return false;
  }
  return bcrypt.compare(password, hash);
}

/**
 * Helper to check if given email matches ADMIN_EMAIL.
 */
export function verifyAdminEmail(email: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (!adminEmail) return false;
  
  return email.trim().toLowerCase() === adminEmail.trim().toLowerCase();
}
