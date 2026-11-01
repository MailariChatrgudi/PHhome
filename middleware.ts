import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth-token';

/**
 * middleware.ts — spec: Phase 8 & api.md §3
 * Protects /admin/* and /api/admin/* routes.
 * Uses Edge-compatible JWT verification.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/admin/login';
  const isApiAdmin = pathname.startsWith('/api/admin');
  const isAdminPage = pathname.startsWith('/admin') && !isLoginPage;

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = sessionCookie ? await verifySessionToken(sessionCookie) : null;
  const isAuthenticated = Boolean(session);

  // 1. If trying to access admin login while already signed in, redirect to updates
  if (isLoginPage && isAuthenticated) {
    const updatesUrl = new URL('/admin/updates', request.url);
    return NextResponse.redirect(updatesUrl);
  }

  // 2. Protect /api/admin/* endpoints
  if (isApiAdmin && !isAuthenticated) {
    return NextResponse.json(
      { error: 'UNAUTHENTICATED', message: 'Admin authentication required' },
      { status: 401 }
    );
  }

  // 3. Protect /admin/* pages (except /admin/login)
  if (isAdminPage && !isAuthenticated) {
    const loginUrl = new URL('/admin/login', request.url);
    // Store intended destination in query param
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

