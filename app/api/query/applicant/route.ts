import { NextResponse } from 'next/server';
import { ApplicantApplicationSchema, formatZodErrors } from '@/lib/validators';
import { checkEndpointRateLimit } from '@/lib/rateLimit';
import { verifyTurnstile } from '@/lib/turnstile';
import { sendApplicantApplication } from '@/lib/mail';

/**
 * POST /api/query/applicant
 * Spec: api.md §1.2 & antigravity-prompt (1).md Phase 6
 *
 * HARD CONSTRAINTS:
 * - NO database storage (no MongoDB, no SQLite, no file persist).
 * - Log strictly restricted to { form, status, timestamp } (handled in lib/mail.ts).
 * - No CV or file upload.
 * - Max payload: 10 KB.
 * - Rate limit: 3/hour and 10/day per IP.
 */

const MAX_BODY_BYTES = 10 * 1024; // 10 KB

function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0].trim();
    if (first) return first;
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

export async function POST(req: Request) {
  // 1. Check body size limit via Content-Length header if present
  const contentLength = req.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: { code: 'PAYLOAD_TOO_LARGE', message: 'Payload exceeds 10 KB limit' } },
      { status: 413 }
    );
  }

  // Read raw body text and verify byte length
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Unable to read request body' } },
      { status: 400 }
    );
  }

  if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: { code: 'PAYLOAD_TOO_LARGE', message: 'Payload exceeds 10 KB limit' } },
      { status: 413 }
    );
  }

  const contentType = req.headers.get('content-type') || '';
  const isFormUrlEncoded = contentType.includes('application/x-www-form-urlencoded');

  // Parse body (JSON or form-urlencoded fallback)
  let body: unknown;
  if (isFormUrlEncoded) {
    const params = new URLSearchParams(rawBody);
    body = Object.fromEntries(params.entries());
  } else {
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid JSON format' } },
        { status: 400 }
      );
    }
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Request body must be a JSON object' } },
      { status: 400 }
    );
  }

  const record = body as Record<string, unknown>;

  // 2. Honeypot check: If non-empty, silently return 200 (don't alert bots, don't send mail)
  if (record.website && typeof record.website === 'string' && record.website.trim() !== '') {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // 3. Rate limit check (3/hour, 10/day per IP)
  const ip = getClientIp(req);
  const rateLimitResult = await checkEndpointRateLimit('applicant', ip);
  if (!rateLimitResult.allowed) {
    const headers: Record<string, string> = {};
    if (rateLimitResult.retryAfter) {
      headers['Retry-After'] = String(rateLimitResult.retryAfter);
    }
    return NextResponse.json(
      { error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' } },
      { status: 429, headers }
    );
  }

  // 4. Validate with Zod
  const validation = ApplicantApplicationSchema.safeParse(record);
  if (!validation.success) {
    const fields = formatZodErrors(validation.error);
    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Please correct the highlighted fields',
          fields,
        },
      },
      { status: 400 }
    );
  }

  // 5. Verify Cloudflare Turnstile if token provided or required
  const turnstile = await verifyTurnstile(validation.data.turnstileToken, ip);
  if (!turnstile.success) {
    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: turnstile.message || 'Security verification failed',
        },
      },
      { status: 400 }
    );
  }

  // 6 & 7. Send email via Resend SDK (escaping and header sanitization in lib/mail.ts)
  try {
    await sendApplicantApplication({
      name: validation.data.name,
      phone: validation.data.phone,
      email: validation.data.email,
      role: validation.data.role,
    });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: 'MAIL_FAILED',
          message: 'Could not deliver your application. Please call our team directly.',
        },
      },
      { status: 502 }
    );
  }

  // 8. Return success response
  if (isFormUrlEncoded) {
    return NextResponse.redirect(new URL('/careers?application=success', req.url), 303);
  }
  return NextResponse.json({ ok: true }, { status: 200 });
}

