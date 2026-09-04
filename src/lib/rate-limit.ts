interface RateLimitRecord {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitRecord>()

/**
 * Check if a key is within its rate limit
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxAttempts - 1 }
  }

  if (record.count >= maxAttempts) {
    return { allowed: false, remaining: 0 }
  }

  record.count += 1
  return { allowed: true, remaining: maxAttempts - record.count }
}
