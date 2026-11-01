import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert';

import { createSessionToken, verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth-token';
import { verifyAdminEmail } from '@/lib/auth';
import { checkLoginRateLimit, rateLimiter } from '@/lib/rateLimit';
import { middleware } from '@/middleware';
import { NextRequest } from 'next/server';

describe('Phase 8: JWT Auth Tokens (lib/auth-token.ts)', () => {
  test('1. Generates and verifies valid session token with email and role', async () => {
    const email = 'owner@homenursingservice.in';
    const token = await createSessionToken(email);

    assert.ok(typeof token === 'string' && token.length > 20, 'Token must be a non-empty JWT string');

    const payload = await verifySessionToken(token);
    assert.ok(payload !== null, 'Payload should verify cleanly');
    assert.strictEqual(payload?.email, email);
    assert.strictEqual(payload?.role, 'admin');
  });

  test('2. Rejects tampered or invalid JWT tokens', async () => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature';
    const payload = await verifySessionToken(invalidToken);
    assert.strictEqual(payload, null, 'Tampered token must return null');
  });

  test('3. Verifies admin email against environment variable', () => {
    const originalEmail = process.env.ADMIN_EMAIL;
    try {
      process.env.ADMIN_EMAIL = 'admin@homenursingservice.in';
      assert.strictEqual(verifyAdminEmail('admin@homenursingservice.in'), true);
      assert.strictEqual(verifyAdminEmail('ADMIN@HOMENURSINGSERVICE.IN'), true);
      assert.strictEqual(verifyAdminEmail('other@example.com'), false);
    } finally {
      process.env.ADMIN_EMAIL = originalEmail;
    }
  });
});

describe('Phase 8: Login Rate Limiting (lib/rateLimit.ts)', () => {
  beforeEach(() => {
    rateLimiter.reset();
  });

  test('3. Allows 5 login failure attempts, then blocks the 6th with 429 retryAfter', async () => {
    const ip = '198.51.100.25';

    for (let i = 1; i <= 5; i++) {
      const res = await checkLoginRateLimit(ip);
      assert.strictEqual(res.allowed, true, `Attempt ${i} should be allowed`);
    }

    // 6th attempt should be blocked
    const blocked = await checkLoginRateLimit(ip);
    assert.strictEqual(blocked.allowed, false, '6th attempt must be rate-limited');
    assert.ok((blocked.retryAfter || 0) > 0, 'retryAfter should be greater than 0');
  });
});

describe('Phase 8: Middleware Route Protection (middleware.ts)', () => {
  test('4. Unauthenticated call to /api/admin/* returns 401 UNAUTHENTICATED', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/updates');
    const res = await middleware(req);

    assert.strictEqual(res.status, 401, 'Must return 401 status');
    const json = await res.json();
    assert.strictEqual(json.error, 'UNAUTHENTICATED');
  });

  test('5. Unauthenticated visit to /admin/updates redirects to /admin/login', async () => {
    const req = new NextRequest('http://localhost:3000/admin/updates');
    const res = await middleware(req);

    assert.strictEqual(res.status, 307, 'Should redirect');
    const location = res.headers.get('location');
    assert.ok(location?.includes('/admin/login'), 'Location must point to /admin/login');
  });

  test('6. Public access to /admin/login is allowed for unauthenticated visitors', async () => {
    const req = new NextRequest('http://localhost:3000/admin/login');
    const res = await middleware(req);

    // 200 or next() (status is 200)
    assert.strictEqual(res.status, 200, 'Login page must be publicly accessible');
  });

  test('7. Authenticated user visiting /admin/updates is allowed through', async () => {
    const token = await createSessionToken('owner@homenursingservice.in');
    const req = new NextRequest('http://localhost:3000/admin/updates', {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${token}`,
      },
    });

    const res = await middleware(req);
    assert.strictEqual(res.status, 200, 'Authenticated request should proceed');
  });

  test('8. Authenticated user visiting /admin/login is redirected to /admin/updates', async () => {
    const token = await createSessionToken('owner@homenursingservice.in');
    const req = new NextRequest('http://localhost:3000/admin/login', {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${token}`,
      },
    });

    const res = await middleware(req);
    assert.strictEqual(res.status, 307, 'Should redirect');
    const location = res.headers.get('location');
    assert.ok(location?.includes('/admin/updates'), 'Must redirect to /admin/updates');
  });
});

