/**
 * lib/rateLimit.ts
 *
 * In-memory sliding/fixed window rate limiter behind an interface.
 *
 * SERVERLESS LIMITATION NOTE:
 * In-memory rate limiting works reliably on a single stateful server or single instance.
 * On serverless hosting (e.g. Vercel / AWS Lambda), each function invocation may run
 * on an isolated container with its own memory space, and cold starts wipe in-memory state.
 * For production multi-instance serverless deployments, this interface should be
 * backed by an external atomic store such as Upstash Redis (@upstash/ratelimit).
 *
 * PRIVACY RULE:
 * This store holds only numeric counters and timestamps keyed by IP and endpoint name.
 * It NEVER stores names, phone numbers, messages, or any personal data (api.md §1).
 */

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the client can retry (present when rate limited) */
  retryAfter?: number;
}

export interface IRateLimiter {
  check(key: string, limit: number, windowMs: number): Promise<RateLimitResult>;
  peek(key: string, limit: number): { allowed: boolean; retryAfter?: number };
  delete(key: string): void;
}

interface WindowRecord {
  count: number;
  resetAt: number;
}

class MemoryRateLimiter implements IRateLimiter {
  private store = new Map<string, WindowRecord>();
  private lastCleanup = Date.now();

  private cleanup(now: number) {
    // Clean up expired keys every 5 minutes to prevent memory leaks
    if (now - this.lastCleanup > 300_000) {
      this.lastCleanup = now;
      for (const [key, record] of this.store.entries()) {
        if (now > record.resetAt) {
          this.store.delete(key);
        }
      }
    }
  }

  peek(key: string, limit: number): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const record = this.store.get(key);
    if (!record || now >= record.resetAt) {
      return { allowed: true };
    }
    if (record.count >= limit) {
      const retryAfter = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
      return { allowed: false, retryAfter };
    }
    return { allowed: true };
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  async check(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    const now = Date.now();
    this.cleanup(now);

    const record = this.store.get(key);

    if (!record || now >= record.resetAt) {
      // First hit in this window or window expired
      this.store.set(key, { count: 1, resetAt: now + windowMs });
      return {
        allowed: true,
        limit,
        remaining: limit - 1,
      };
    }

    if (record.count >= limit) {
      const retryAfter = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
      return {
        allowed: false,
        limit,
        remaining: 0,
        retryAfter,
      };
    }

    record.count += 1;
    return {
      allowed: true,
      limit,
      remaining: limit - record.count,
    };
  }

  /** Test helper to reset counters between test runs */
  reset() {
    this.store.clear();
  }
}

export const rateLimiter = new MemoryRateLimiter();

/**
 * Checks both hourly and daily rate limits for a given IP and endpoint.
 *
 * Limits per api.md §1:
 * - Customer: 5/hour and 20/day
 * - Applicant: 3/hour and 10/day
 */
export async function checkEndpointRateLimit(
  endpoint: 'customer' | 'applicant',
  ip: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const ONE_HOUR_MS = 60 * 60 * 1000;
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  const limits = {
    customer: { hourly: 5, daily: 20 },
    applicant: { hourly: 3, daily: 10 },
  }[endpoint];

  // 1. Check hourly limit
  const hourKey = `rl:${endpoint}:hr:${ip}`;
  const hourResult = await rateLimiter.check(hourKey, limits.hourly, ONE_HOUR_MS);
  if (!hourResult.allowed) {
    return { allowed: false, retryAfter: hourResult.retryAfter };
  }

  // 2. Check daily limit
  const dayKey = `rl:${endpoint}:day:${ip}`;
  const dayResult = await rateLimiter.check(dayKey, limits.daily, ONE_DAY_MS);
  if (!dayResult.allowed) {
    return { allowed: false, retryAfter: dayResult.retryAfter };
  }

  return { allowed: true };
}

/**
 * Checks login rate limit: 5 failures per 15 minutes per IP (api.md §3).
 */
export async function checkLoginRateLimit(
  ip: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
  const key = `rl:login:fail:${ip}`;
  const result = await rateLimiter.check(key, 5, FIFTEEN_MINUTES_MS);
  return { allowed: result.allowed, retryAfter: result.retryAfter };
}

/**
 * Resets failed login attempts for this IP on successful login.
 */
export function resetLoginFailures(ip: string): void {
  const key = `rl:login:fail:${ip}`;
  rateLimiter.delete(key);
}


