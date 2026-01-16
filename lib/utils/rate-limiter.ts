/**
 * Simple in-memory rate limiter using token bucket algorithm
 */

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry>;
  private maxTokens: number;
  private refillRate: number; // tokens per second
  private cleanupInterval: NodeJS.Timeout | null;

  constructor(maxTokens: number = 10, refillRate: number = 1) {
    this.requests = new Map();
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
    this.cleanupInterval = null;

    // Start cleanup process to prevent memory leaks
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => {
        this.cleanup();
      }, 60000); // Cleanup every minute
    }
  }

  /**
   * Check if a request should be allowed
   * @param identifier - Unique identifier (e.g., IP address)
   * @returns true if allowed, false if rate limited
   */
  check(identifier: string): boolean {
    const now = Date.now();
    let entry = this.requests.get(identifier);

    if (!entry) {
      // First request from this identifier
      entry = {
        tokens: this.maxTokens - 1,
        lastRefill: now,
      };
      this.requests.set(identifier, entry);
      return true;
    }

    // Calculate tokens to add based on time elapsed
    const timeSinceLastRefill = (now - entry.lastRefill) / 1000; // seconds
    const tokensToAdd = timeSinceLastRefill * this.refillRate;
    entry.tokens = Math.min(this.maxTokens, entry.tokens + tokensToAdd);
    entry.lastRefill = now;

    if (entry.tokens >= 1) {
      entry.tokens -= 1;
      this.requests.set(identifier, entry);
      return true;
    }

    return false;
  }

  /**
   * Get remaining tokens for an identifier
   */
  getRemaining(identifier: string): number {
    const entry = this.requests.get(identifier);
    if (!entry) return this.maxTokens;

    const now = Date.now();
    const timeSinceLastRefill = (now - entry.lastRefill) / 1000;
    const tokensToAdd = timeSinceLastRefill * this.refillRate;
    const tokens = Math.min(this.maxTokens, entry.tokens + tokensToAdd);

    return Math.floor(tokens);
  }

  /**
   * Get reset time in seconds for an identifier
   */
  getResetTime(identifier: string): number {
    const entry = this.requests.get(identifier);
    if (!entry || entry.tokens >= this.maxTokens) return 0;

    const tokensNeeded = 1 - entry.tokens;
    const timeToRefill = tokensNeeded / this.refillRate;

    return Math.ceil(timeToRefill);
  }

  /**
   * Clean up old entries to prevent memory leaks
   */
  private cleanup(): void {
    const now = Date.now();
    const maxAge = 300000; // 5 minutes

    for (const [identifier, entry] of this.requests.entries()) {
      if (now - entry.lastRefill > maxAge) {
        this.requests.delete(identifier);
      }
    }
  }

  /**
   * Stop the cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Create a singleton rate limiter instance
// 20 requests per client, refills at 2 requests per second
const rateLimiter = new RateLimiter(20, 2);

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers (works with most proxies/CDNs)
  const headers = request.headers;
  const forwarded = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');
  const cfConnectingIp = headers.get('cf-connecting-ip'); // Cloudflare

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, use the first one
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback to a generic identifier
  return 'unknown';
}

/**
 * Check if request should be rate limited
 * @returns { limited: boolean, remaining: number, reset: number }
 */
export function checkRateLimit(request: Request): {
  limited: boolean;
  remaining: number;
  reset: number;
} {
  const identifier = getClientIdentifier(request);
  const allowed = rateLimiter.check(identifier);
  const remaining = rateLimiter.getRemaining(identifier);
  const reset = rateLimiter.getResetTime(identifier);

  return {
    limited: !allowed,
    remaining,
    reset,
  };
}

export { rateLimiter };
