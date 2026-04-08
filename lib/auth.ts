import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";

const ADMIN_TOKEN_VERSION = "v1";
const ADMIN_TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

function getAdminSecret(): string | null {
  return process.env.ADMIN_PASSWORD ?? null;
}

export function verifyAdminPassword(password: string): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;

  const suppliedHash = createHash("sha256").update(password).digest();
  const secretHash = createHash("sha256").update(secret).digest();

  return timingSafeEqual(suppliedHash, secretHash);
}

function signAdminToken(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createAdminToken(now = Date.now()): string | null {
  const secret = getAdminSecret();
  if (!secret) return null;

  const expiresAt = now + ADMIN_TOKEN_TTL_MS;
  const nonce = randomBytes(24).toString("base64url");
  const payload = [ADMIN_TOKEN_VERSION, String(expiresAt), nonce].join(".");
  const signature = signAdminToken(payload, secret);

  return `${payload}.${signature}`;
}

/**
 * Validates an admin Bearer token from the Authorization header.
 *
 * Token format: v1.{expiresAt}.{randomNonce}.{hmacSignature}
 */
export function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;

  const secret = getAdminSecret();
  if (!secret) return false;

  const token = authHeader.slice(7).trim();
  const parts = token.split(".");
  if (parts.length !== 4) return false;

  const [version, expiresAtRaw, nonce, signature] = parts;
  if (version !== ADMIN_TOKEN_VERSION || !nonce || !signature) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  const payload = [version, expiresAtRaw, nonce].join(".");
  const expectedSignature = signAdminToken(payload, secret);

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (signatureBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(signatureBuffer, expectedBuffer);
}
