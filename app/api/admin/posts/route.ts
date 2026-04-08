import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAuthorized } from "@/lib/auth";
import { revalidateBlogContent } from "@/lib/blog-cache";

// GET: List all posts (including unpublished) for admin
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("posts")
    .select("slug, title, tags, published, date, excerpt")
    .order("date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const postSlugs = (data || []).map((post) => post.slug);
  const viewCountBySlug: Record<string, number> = {};

  if (postSlugs.length > 0) {
    const { data: viewData, error: viewError } = await supabase
      .from("views")
      .select("slug, count")
      .in("slug", postSlugs);

    if (viewError) {
      return NextResponse.json({ error: viewError.message }, { status: 500 });
    }

    for (const row of viewData || []) {
      viewCountBySlug[row.slug] = row.count;
    }
  }

  const posts = (data || []).map((post) => ({
    ...post,
    viewCount: viewCountBySlug[post.slug] ?? 0,
  }));

  return NextResponse.json({ posts });
}

// DELETE: Delete a post by slug
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { slug } = await request.json();
  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  const { error } = await supabase.from("posts").delete().eq("slug", slug);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidateBlogContent(slug);

  return NextResponse.json({ success: true, message: `Post "${slug}" deleted` });
}
