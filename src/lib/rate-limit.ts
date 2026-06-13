import type { NextRequest } from 'next/server'

/**
 * Lightweight in-memory fixed-window rate limiter.
 *
 * Suitable for this app's single-instance `output: 'standalone'` deployment.
 * If the app is ever scaled to multiple instances, replace the backing store
 * with a shared one (e.g. Redis / Upstash) — the call sites stay the same.
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

// Opportunistic cleanup so the map can't grow without bound under abuse.
function prune(now: number) {
  if (buckets.size < 5000) return
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key)
  }
}

export type RateLimitResult = {
  ok: boolean
  remaining: number
  /** Seconds until the window resets (for a Retry-After header). */
  retryAfter: number
}

/**
 * @param key       Unique bucket key, e.g. `login:1.2.3.4`.
 * @param limit     Max requests allowed per window.
 * @param windowMs  Window length in milliseconds.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  prune(now)

  const bucket = buckets.get(key)

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1, retryAfter: 0 }
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) }
  }

  bucket.count += 1
  return { ok: true, remaining: limit - bucket.count, retryAfter: 0 }
}

/** Best-effort client IP extraction from common proxy headers. */
export function getClientIp(request: NextRequest | Request): string {
  const headers = request.headers
  const cf = headers.get('cf-connecting-ip')
  if (cf) return cf.trim()

  const real = headers.get('x-real-ip')
  if (real) return real.trim()

  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()

  return 'unknown'
}
