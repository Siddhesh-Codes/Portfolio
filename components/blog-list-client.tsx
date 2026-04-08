"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { BlogCard } from "@/components/blog-card";
import type { BlogPostMeta } from "@/lib/blog";
import { TAG_CATEGORIES, getCategoryForTag } from "@/lib/tag-categories";

export function BlogListClient({
  posts,
  allTags,
}: {
  posts: BlogPostMeta[];
  allTags: string[];
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Find which super categories actually have posts
  const activeCategories = useMemo(() => {
    const activeSlugs = new Set<string>();
    for (const tag of allTags) {
      const cat = getCategoryForTag(tag);
      if (cat) activeSlugs.add(cat.slug);
    }
    return TAG_CATEGORIES.filter((c) => activeSlugs.has(c.slug));
  }, [allTags]);

  const filtered = useMemo(() => {
    let result = posts;

    // Filter by super tag category
    if (selectedCategory) {
      const category = TAG_CATEGORIES.find((c) => c.slug === selectedCategory);
      if (category) {
        result = result.filter((post) =>
          post.tags.some((tag) => category.tags.includes(tag.toLowerCase()))
        );
      }
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          (p.excerpt && p.excerpt.toLowerCase().includes(q))
      );
    }

    return result;
  }, [posts, search, selectedCategory]);

  return (
    <>
      {/* Search + Category Filter */}
      <div className="space-y-4 mb-10">
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>

        {/* Super Tag Categories */}
        {activeCategories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`text-xs px-4 py-2 rounded-full border transition-all duration-300 ${
                selectedCategory === null
                  ? "bg-accent text-background border-accent shadow-md shadow-accent/20"
                  : "bg-card text-muted-foreground border-border hover:border-accent/30 hover:text-foreground"
              }`}
            >
              All
            </button>
            {activeCategories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.slug ? null : cat.slug
                  )
                }
                className={`text-xs px-4 py-2 rounded-full border transition-all duration-300 ${
                  selectedCategory === cat.slug
                    ? "shadow-md text-white border-transparent"
                    : "bg-card text-muted-foreground border-border hover:border-accent/30 hover:text-foreground"
                }`}
                style={
                  selectedCategory === cat.slug
                    ? { backgroundColor: cat.color, borderColor: cat.color }
                    : undefined
                }
              >
                {cat.name}
              </button>
            ))}
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs px-2 py-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                title="Clear filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-16">
          No articles found. Try a different search or category.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
