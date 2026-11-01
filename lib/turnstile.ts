/**
 * lib/turnstile.ts
 *
 * Cloudflare Turnstile server-side verification helper.
 * Feature-flagged: only active if TURNSTILE_SECRET_KEY is defined in env.
 */

export async function verifyTurnstile(
  token: string | undefined,
  remoteIp?: string
): Promise<{ success: boolean; message?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // Turnstile is optional — if secret key is not set, skip verification
  if (!secretKey) {
    return { success: true };
  }

  if (!token) {
    return { success: false, message: 'Bot verification token missing' };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    if (!res.ok) {
      return { success: false, message: 'Turnstile verification service unavailable' };
    }

    const outcome = await res.json();
    if (outcome.success) {
      return { success: true };
    }

    return { success: false, message: 'Security check failed. Please refresh and try again.' };
  } catch {
    return { success: false, message: 'Security verification error' };
  }
}

