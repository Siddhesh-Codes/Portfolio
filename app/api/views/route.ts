import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";

function isUniqueViolation(error: { code?: string } | null): boolean {
  return error?.code === "23505";
}

async function incrementViewsAtomically(slug: string): Promise<number> {
  const supabase = getSupabaseAdmin() ?? getSupabase();

  if (!supabase) {
    return 0;
  }

  const maxAttempts = 5;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const { data: existing, error: readError } = await supabase
      .from("views")
      .select("count")
      .eq("slug", slug)
      .maybeSingle();

    if (readError) {
      throw new Error(readError.message);
    }

    if (!existing) {
      const { error: insertError } = await supabase
        .from("views")
        .insert([{ slug, count: 1 }]);

      if (!insertError) {
        return 1;
      }

      if (isUniqueViolation(insertError)) {
        continue;
      }

      throw new Error(insertError.message);
    }

    const nextCount = existing.count + 1;
    const { data: updated, error: updateError } = await supabase
      .from("views")
      .update({ count: nextCount })
      .eq("slug", slug)
      .eq("count", existing.count)
      .select("count")
      .maybeSingle();

    if (updateError) {
      throw new Error(updateError.message);
    }

    if (updated) {
      return updated.count;
    }
  }

  throw new Error(`Failed to increment views for "${slug}" after retrying`);
}

// GET /api/views?slug=my-post  OR  GET /api/views (all views)
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slug = request.nextUrl.searchParams.get("slug");
  const supabase = getSupabaseAdmin() ?? getSupabase();

  if (!supabase) {
    return slug
      ? NextResponse.json({ slug, views: 0 })
      : NextResponse.json({});
  }

  if (slug) {
    const { data } = await supabase
      .from("views")
      .select("count")
      .eq("slug", slug)
      .maybeSingle();

    return NextResponse.json({ slug, views: data?.count || 0 });
  }

  const { data } = await supabase.from("views").select("*");
  const viewMap: Record<string, number> = {};
  (data || []).forEach((row: { slug: string; count: number }) => {
    viewMap[row.slug] = row.count;
  });

  return NextResponse.json(viewMap);
}

// POST /api/views  { slug: "my-post" }  — increments view count
export async function POST(request: NextRequest) {
  const { slug } = await request.json();

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  try {
    const views = await incrementViewsAtomically(slug);
    return NextResponse.json({ slug, views });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update view count";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
