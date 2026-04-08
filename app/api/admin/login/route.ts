import { NextRequest, NextResponse } from "next/server";
import { createAdminToken, verifyAdminPassword } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/request-security";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`admin-login:${ip}`, {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      }
    );
  }

  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: "Admin password not configured. Set ADMIN_PASSWORD in .env.local" },
      { status: 500 }
    );
  }

  if (typeof password !== "string" || !verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = createAdminToken();
  if (!token) {
    return NextResponse.json(
      { error: "Unable to create an admin session token" },
      { status: 500 }
    );
  }

  return NextResponse.json({ token });
}
