import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ── Database types ──
export interface DbPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  cover_image: string;
  tags: string[];
  published: boolean;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface DbView {
  slug: string;
  count: number;
}

export interface DbComment {
  id: string;
  post_slug: string;
  name: string;
  comment: string;
  created_at: string;
}

// ── Anon client (public reads, comments) ──
let anonInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  if (!anonInstance) {
    anonInstance = createClient(url, key);
  }
  return anonInstance;
}

// ── Service role client (admin operations — bypasses RLS) ──
let serviceInstance: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  if (!serviceInstance) {
    serviceInstance = createClient(url, key);
  }
  return serviceInstance;
}
