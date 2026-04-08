import { getSupabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  isSafeSlug,
  normalizeMultilineInput,
  normalizeSingleLineInput,
} from "@/lib/request-security";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug || !isSafeSlug(slug)) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_slug", slug)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`comments:${ip}`, {
    maxRequests: 5,
    windowMs: 10 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many comments submitted. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      }
    );
  }

  const body = await request.json();
  const { postSlug, name, comment } = body;

  if (
    typeof postSlug !== "string" ||
    typeof name !== "string" ||
    typeof comment !== "string"
  ) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const safePostSlug = postSlug.trim().toLowerCase();
  const safeName = normalizeSingleLineInput(name);
  const safeComment = normalizeMultilineInput(comment);

  if (!safePostSlug || !safeName || !safeComment) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!isSafeSlug(safePostSlug)) {
    return NextResponse.json({ error: "Invalid post slug" }, { status: 400 });
  }

  if (safeName.length > 80) {
    return NextResponse.json({ error: "Name is too long" }, { status: 400 });
  }

  if (safeComment.length > 2000) {
    return NextResponse.json({ error: "Comment is too long" }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Comments are temporarily unavailable" },
      { status: 503 }
    );
  }

  const { data: postData, error: postError } = await supabase
    .from("posts")
    .select("slug")
    .eq("slug", safePostSlug)
    .eq("published", true)
    .maybeSingle();

  if (postError) {
    return NextResponse.json({ error: postError.message }, { status: 500 });
  }

  if (!postData) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("comments")
    .insert([{ post_slug: safePostSlug, name: safeName, comment: safeComment }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
