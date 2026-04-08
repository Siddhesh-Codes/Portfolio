import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { extractHeadings, extractTableOfContents } from "@/lib/table-of-contents";
import { cn, formatDate } from "@/lib/utils";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { BlogTableOfContents } from "@/components/blog-table-of-contents";
import { MDXContent } from "@/components/mdx-content";
import { CommentSection } from "@/components/comment-section";
import { ViewTracker } from "@/components/view-tracker";
import JsonLd from "@/components/json-ld";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt || `Read "${post.title}" on Siddhesh's blog.`,
    keywords: post.tags,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read "${post.title}" on Siddhesh's blog.`,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      authors: ["Siddhesh"],
      tags: post.tags,
      url: `https://siddhesh.dev/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || `Read "${post.title}" on Siddhesh's blog.`,
      creator: "@Siddhesh_2110",
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const documentHeadings = extractHeadings(post.content);
  const headings = extractTableOfContents(post.content);

  const blogPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: {
      "@type": "Person",
      name: "Siddhesh",
      url: "https://siddhesh.dev",
    },
    publisher: {
      "@type": "Person",
      name: "Siddhesh",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://siddhesh.dev/blog/${slug}`,
    },
    keywords: post.tags.join(", "),
    articleSection: "Technology",
    inLanguage: "en-US",
    wordCount: post.content.split(/\s+/).length,
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-14 xl:gap-[4.5rem]">
        <BlogTableOfContents headings={headings} />

        <article
          className={cn(
            "w-full max-w-3xl",
            headings.length > 0 ? "mx-auto lg:mx-0" : "mx-auto"
          )}
        >
          <JsonLd data={blogPostSchema} />
          <ViewTracker slug={slug} />

          {/* Back Link */}
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-12">
            {/* Tags */}
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-accent"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="mb-6 text-3xl leading-tight font-bold text-foreground sm:text-4xl md:text-5xl">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <time dateTime={new Date(post.date).toISOString()}>
                  {formatDate(post.date)}
                </time>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readingTime}
              </span>
            </div>
          </header>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="mb-12 aspect-[2/1] overflow-hidden rounded-2xl bg-muted">
              <div
                className="h-full w-full bg-gradient-to-br from-accent/20 to-accent/5"
                style={{
                  backgroundImage: `url(${post.coverImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>
          )}

          {/* Content */}
          <MDXContent source={post.content} headings={documentHeadings} />

          {/* Comments */}
          <CommentSection postSlug={slug} />
        </article>
      </div>
    </main>
  );
}
