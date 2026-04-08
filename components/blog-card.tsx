import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { BlogPostMeta } from "@/lib/blog";
import { Clock } from "lucide-react";

export function BlogCard({ post }: { post: BlogPostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl overflow-hidden bg-card border border-border hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all duration-500 hover:-translate-y-1"
    >
      {/* Cover Image */}
      <div className="relative aspect-[2/1] bg-muted overflow-hidden">
        <div
          className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: post.coverImage
              ? `url(${post.coverImage})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Reading time badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {post.readingTime}
        </div>
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors duration-300 line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {post.excerpt}
          </p>
        )}

        {/* Date */}
        <time
          dateTime={new Date(post.date).toISOString()}
          className="text-xs text-muted-foreground/60"
        >
          {formatDate(post.date)}
        </time>
      </div>
    </Link>
  );
}
