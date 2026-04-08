import { NextRequest } from "next/server";

type RateLimitOptions = {
  maxRequests: number;
  windowMs: number;
};

type RateLimitEntry = {
  timestamps: number[];
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function pruneTimestamps(timestamps: number[], now: number, windowMs: number) {
  return timestamps.filter((timestamp) => now - timestamp < windowMs);
}

export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

export function checkRateLimit(
  key: string,
  { maxRequests, windowMs }: RateLimitOptions
) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  const recentTimestamps = pruneTimestamps(entry?.timestamps ?? [], now, windowMs);

  if (recentTimestamps.length >= maxRequests) {
    const retryAfterMs = windowMs - (now - recentTimestamps[0]);
    rateLimitStore.set(key, { timestamps: recentTimestamps });

    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  recentTimestamps.push(now);
  rateLimitStore.set(key, { timestamps: recentTimestamps });

  if (rateLimitStore.size > 5000) {
    for (const [entryKey, value] of rateLimitStore.entries()) {
      const pruned = pruneTimestamps(value.timestamps, now, windowMs);
      if (pruned.length === 0) {
        rateLimitStore.delete(entryKey);
      } else {
        rateLimitStore.set(entryKey, { timestamps: pruned });
      }
    }
  }

  return {
    allowed: true,
    retryAfterSeconds: 0,
  };
}

export function normalizeSingleLineInput(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizeMultilineInput(value: string) {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/\u0000/g, "")
    .trim();
}

export function isSafeSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}
