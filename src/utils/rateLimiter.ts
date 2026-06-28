/**
 * Local rate limiter logic checking against stored run timestamps.
 */

export interface RateLimitResult {
  allowed: boolean;
  limitType: 'minute' | 'hour' | null;
  remainingMin: number;
  remainingHour: number;
  remainingTotal: number;
  cooldownSeconds: number;
}

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

export function checkRateLimit(timestamps: number[]): RateLimitResult {
  const now = Date.now();
  
  // Clean up outdated timestamps to prevent memory leaks
  const validTimestamps = timestamps.filter(t => now - t < HOUR_MS);
  
  // Filter for last minute and last hour
  const lastMinuteRuns = validTimestamps.filter(t => now - t < MINUTE_MS);
  const lastHourRuns = validTimestamps; // Already filtered for hour

  const countMin = lastMinuteRuns.length;
  const countHour = lastHourRuns.length;

  const remainingMin = Math.max(0, 5 - countMin);
  const remainingHour = Math.max(0, 10 - countHour);
  const remainingTotal = Math.min(remainingMin, remainingHour);

  // Check if blocked
  if (countMin >= 5) {
    // Blocked by minute rate limit. Find when the oldest run in the last minute expires.
    const oldestInMin = Math.min(...lastMinuteRuns);
    const cooldownMs = MINUTE_MS - (now - oldestInMin);
    
    return {
      allowed: false,
      limitType: 'minute',
      remainingMin,
      remainingHour,
      remainingTotal: 0,
      cooldownSeconds: Math.ceil(Math.max(0, cooldownMs) / 1000)
    };
  }

  if (countHour >= 10) {
    // Blocked by hour rate limit. Find when the oldest run in the last hour expires.
    const oldestInHour = Math.min(...lastHourRuns);
    const cooldownMs = HOUR_MS - (now - oldestInHour);

    return {
      allowed: false,
      limitType: 'hour',
      remainingMin,
      remainingHour,
      remainingTotal: 0,
      cooldownSeconds: Math.ceil(Math.max(0, cooldownMs) / 1000)
    };
  }

  // Not blocked
  return {
    allowed: true,
    limitType: null,
    remainingMin,
    remainingHour,
    remainingTotal,
    cooldownSeconds: 0
  };
}
