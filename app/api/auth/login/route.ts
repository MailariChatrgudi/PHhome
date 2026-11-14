import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  createSessionToken,
  verifyAdminEmail,
  verifyAdminPassword,
  SESSION_COOKIE_NAME,
} from '@/lib/auth';
import { checkLoginRateLimit, resetLoginFailures } from '@/lib/rateLimit';

export async function POST(request: Request) {
  // Extract client IP
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

  // Check rate limit: 5 failures per 15 minutes per IP
  const rateLimitStatus = await checkLoginRateLimit(ip);
  if (!rateLimitStatus.allowed) {
    return NextResponse.json(
      {
        error: 'RATE_LIMIT_EXCEEDED',
        message: `Too many failed login attempts. Try again in ${rateLimitStatus.retryAfter || 900} seconds.`,
        retryAfter: rateLimitStatus.retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimitStatus.retryAfter || 900),
        },
      }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'BAD_REQUEST', message: 'Invalid JSON payload' },
      { status: 400 }
    );
  }

  const { email, password } = body;
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json(
      { error: 'UNAUTHENTICATED', message: 'Invalid email or password' },
      { status: 401 }
    );
  }

  const emailValid = verifyAdminEmail(email);
  const passwordValid = await verifyAdminPassword(password);

  if (!emailValid || !passwordValid) {
    // Identical error message for wrong email or password (api.md §3)
    return NextResponse.json(
      { error: 'UNAUTHENTICATED', message: 'Invalid email or password' },
      { status: 401 }
    );
  }

  // Clear previous failed attempts on successful authentication
  resetLoginFailures(ip);

  // Generate signed JWT session token
  const token = await createSessionToken(email.trim().toLowerCase());

  // Set HTTP-only session cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}

