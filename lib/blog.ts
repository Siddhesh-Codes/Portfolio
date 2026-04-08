import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getSupabase } from "@/lib/supabase";
import type { DbPost } from "@/lib/supabase";
import readingTime from "reading-time";

// ── Public types (match existing BlogPostMeta / BlogPost interfaces) ──
export interface BlogPostMeta {
  slug: string;
  title: string;
  coverImage: string;
  tags: string[];
  date: string;
  readingTime: string;
  excerpt: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

// ── Transform DB row → public shape ──
function toMeta(row: DbPost): BlogPostMeta {
  const stats = readingTime(row.content);
  return {
    slug: row.slug,
    title: row.title,
    coverImage: row.cover_image || "/images/blog/default-cover.jpg",
    tags: row.tags || [],
    date: row.date,
    readingTime: stats.text,
    excerpt:
      row.excerpt ||
      row.content
        .replace(/```[\s\S]*?```/g, "")     // remove code blocks
        .replace(/`[^`]+`/g, "")             // remove inline code
        .replace(/!\[.*?\]\(.*?\)/g, "")     // remove images
        .replace(/\[([^\]]+)\]\(.*?\)/g, "$1") // links → text only
        .replace(/^#{1,6}\s+/gm, "")         // remove heading markers
        .replace(/^>\s?/gm, "")              // remove blockquote markers
        .replace(/^---+$/gm, "")             // remove horizontal rules
        .replace(/\*\*([^*]+)\*\*/g, "$1")   // bold → text
        .replace(/\*([^*]+)\*/g, "$1")       // italic → text
        .replace(/~~([^~]+)~~/g, "$1")       // strikethrough → text
        .replace(/^\d+\.\s/gm, "")           // remove ordered list markers
        .replace(/^[-*+]\s/gm, "")           // remove unordered list markers
        .replace(/\n{2,}/g, " ")             // collapse multiple newlines
        .replace(/\n/g, " ")                 // remaining newlines → spaces
        .replace(/\s{2,}/g, " ")             // collapse multiple spaces
        .trim()
        .slice(0, 160)
        .trim() + "...",
  };
}

function toPost(row: DbPost): BlogPost {
  return {
    ...toMeta(row),
    content: row.content,
  };
}

// ── Cached data fetchers ──

/**
 * Get all published posts, sorted by date descending.
 * Cached across requests; busted via revalidateTag('posts').
 */
export const getAllPosts = unstable_cache(
  async (): Promise<BlogPostMeta[]> => {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("date", { ascending: false });

    if (error) {
      console.error("Failed to fetch posts:", error.message);
      return [];
    }

    return (data as DbPost[]).map(toMeta);
  },
  ["all-posts"],
  { tags: ["posts"], revalidate: false }
);

/**
 * Get a single post by slug.
 * Cached per slug; busted via revalidateTag('posts') or revalidateTag('post-{slug}').
 */
export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  return getPostBySlugCached(slug);
});

const getPostBySlugCached = unstable_cache(
  async (slug: string): Promise<BlogPost | null> => {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error || !data) return null;

    return toPost(data as DbPost);
  },
  ["post-by-slug"],
  { tags: ["posts"], revalidate: false }
);

/**
 * Get all unique tags from published posts.
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tagSet = new Set<string>();
  posts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}
