import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAuthorized } from "@/lib/auth";
import { revalidateBlogContent } from "@/lib/blog-cache";

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, slug, tags, coverImage, excerpt, date, content } =
    await request.json();

  if (!title || !slug || !content) {
    return NextResponse.json(
      { error: "Title, slug, and content are required" },
      { status: 400 }
    );
  }

  // Sanitize slug
  const safeSlug = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    );
  }

  // Check if slug already exists
  const { data: existing } = await supabase
    .from("posts")
    .select("id")
    .eq("slug", safeSlug)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: `A post with slug "${safeSlug}" already exists` },
      { status: 409 }
    );
  }

  // Insert into Supabase
  const { error } = await supabase.from("posts").insert([
    {
      slug: safeSlug,
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt?.trim() || null,
      cover_image: coverImage || "/images/blog/default-cover.jpg",
      tags: tags || [],
      date: date || new Date().toISOString().split("T")[0],
      published: true,
    },
  ]);

  if (error) {
    console.error("Publish error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidateBlogContent(safeSlug);

  return NextResponse.json({
    success: true,
    slug: safeSlug,
    message: `Published "${title}" successfully!`,
  });
}
