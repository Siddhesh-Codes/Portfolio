import { getAllPosts, getAllTags } from "@/lib/blog";
import { BlogListClient } from "@/components/blog-list-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Siddhesh",
  description: "Articles on competitive programming, SaaS development, system design, and daily learning.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  const allTags = await getAllTags();

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif italic text-foreground mb-4">
            Blog
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Thoughts on programming, building products, and everything I learn along the way.
          </p>
        </div>

        <BlogListClient posts={posts} allTags={allTags} />
      </div>
    </main>
  );
}
