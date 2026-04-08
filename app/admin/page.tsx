"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Eye, EyeOff, Lock, Plus, X, FileText, Upload,
  Image as ImageIcon, Bold, Italic, Heading1, Heading2, Heading3,
  Code, Quote, List, Link2, Trash2, Edit3, ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import SendIcon from "@/components/icons/send-icon";
import { MarkdownPreview } from "@/components/markdown-preview";

interface AdminPost {
  slug: string;
  title: string;
  tags: string[];
  published: boolean;
  date: string;
  excerpt: string;
  viewCount: number;
}

// ── Markdown Toolbar Helper ──
function insertMarkdown(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  setContent: (v: string) => void
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selected = text.substring(start, end);
  const replacement = `${before}${selected || "text"}${after}`;
  const newText = text.substring(0, start) + replacement + text.substring(end);
  setContent(newText);

  // Restore cursor position
  requestAnimationFrame(() => {
    textarea.focus();
    const newStart = start + before.length;
    const newEnd = newStart + (selected || "text").length;
    textarea.setSelectionRange(newStart, newEnd);
  });
}

function insertLinePrefix(
  textarea: HTMLTextAreaElement,
  prefix: string,
  setContent: (v: string) => void
) {
  const start = textarea.selectionStart;
  const text = textarea.value;
  const lineStart = text.lastIndexOf("\n", start - 1) + 1;
  const newText = text.substring(0, lineStart) + prefix + text.substring(lineStart);
  setContent(newText);

  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(start + prefix.length, start + prefix.length);
  });
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // View state
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  // Posts list
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postsError, setPostsError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Editor state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Image upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const clearExpiredSession = useCallback(() => {
    sessionStorage.removeItem("admin_token");
    setToken(null);
    setPosts([]);
    setLoginError("Your admin session expired. Please sign in again.");
  }, []);

  // Check for stored token on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("admin_token");
    if (stored) setToken(stored);
  }, []);

  // Auto-generate slug from title (only for new posts)
  useEffect(() => {
    if (title && !editingSlug) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim()
      );
    }
  }, [title, editingSlug]);

  // Fetch posts list
  const fetchPosts = useCallback(async () => {
    if (!token) return;
    setLoadingPosts(true);
    setPostsError("");
    try {
      const res = await fetch("/api/admin/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        clearExpiredSession();
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      } else {
        const data = await res.json().catch(() => ({}));
        setPostsError(data.error || "Unable to load posts.");
      }
    } catch {
      setPostsError("Unable to load posts.");
    } finally {
      setLoadingPosts(false);
    }
  }, [token, clearExpiredSession]);

  useEffect(() => {
    if (token && view === "list") {
      fetchPosts();
    }
  }, [token, view, fetchPosts]);

  // Keyboard shortcuts for markdown toolbar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!textareaRef.current) return;
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "b") {
          e.preventDefault();
          insertMarkdown(textareaRef.current, "**", "**", setContent);
        } else if (e.key === "i") {
          e.preventDefault();
          insertMarkdown(textareaRef.current, "*", "*", setContent);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });
      if (res.ok) {
        const { token: newToken } = await res.json();
        setToken(newToken);
        sessionStorage.setItem("admin_token", newToken);
        setPassword("");
        setPostsError("");
      } else {
        const data = await res.json();
        setLoginError(data.error || "Login failed");
      }
    } catch {
      setLoginError("Network error");
    } finally {
      setLoggingIn(false);
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.status === 401) {
        clearExpiredSession();
        return;
      }
      const data = await res.json();
      if (res.ok) {
        setCoverImage(data.url);
      } else {
        setUploadError(data.error || "Upload failed");
      }
    } catch {
      setUploadError("Network error during upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const resetEditor = () => {
    setTitle("");
    setSlug("");
    setTags([]);
    setCoverImage("");
    setExcerpt("");
    setContent("");
    setEditingSlug(null);
    setPublishResult(null);
    setShowPreview(false);
  };

  const handleNewPost = () => {
    resetEditor();
    setView("editor");
  };

  const handleEditPost = async (postSlug: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/posts/${postSlug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        clearExpiredSession();
        return;
      }
      if (res.ok) {
        const { post } = await res.json();
        setTitle(post.title);
        setSlug(post.slug);
        setTags(post.tags || []);
        setCoverImage(post.cover_image || "");
        setExcerpt(post.excerpt || "");
        setContent(post.content || "");
        setEditingSlug(post.slug);
        setView("editor");
      }
    } catch {
      // ignore
    }
  };

  const handleDeletePost = async (postSlug: string) => {
    if (!token) return;
    try {
      const res = await fetch("/api/admin/posts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slug: postSlug }),
      });
      if (res.status === 401) {
        clearExpiredSession();
        return;
      }
      if (res.ok) {
        setPosts(posts.filter((p) => p.slug !== postSlug));
        setDeleteConfirm(null);
      }
    } catch {
      // ignore
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) return;
    setPublishing(true);
    setPublishResult(null);

    const isUpdate = !!editingSlug;
    const url = isUpdate ? `/api/admin/posts/${editingSlug}` : "/api/admin/publish";
    const method = isUpdate ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          slug,
          tags,
          coverImage: coverImage.trim() || undefined,
          excerpt: excerpt.trim() || undefined,
          date: new Date().toISOString().split("T")[0],
          content: content.trim(),
        }),
      });
      if (res.status === 401) {
        clearExpiredSession();
        return;
      }
      const data = await res.json();
      if (res.ok) {
        setPublishResult({
          success: true,
          message: isUpdate ? "Post updated successfully!" : data.message,
        });
        if (!isUpdate) resetEditor();
      } else {
        setPublishResult({ success: false, message: data.error || "Failed" });
      }
    } catch {
      setPublishResult({ success: false, message: "Network error" });
    } finally {
      setPublishing(false);
    }
  };

  // ── Login Screen ──
  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center">
              <Lock className="w-7 h-7 text-accent" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-2">Enter your password to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-3 pr-12 rounded-xl bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {loginError && <p className="text-sm text-red-500 text-center">{loginError}</p>}
            <button
              type="submit"
              disabled={loggingIn || !password.trim()}
              className="w-full py-3 rounded-xl bg-accent text-background font-medium text-sm hover:shadow-lg hover:shadow-accent/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
            >
              {loggingIn ? "Authenticating..." : "Enter"}
            </button>
            <p className="text-center text-[11px] text-muted-foreground/55">
              Uses the <span className="font-mono">ADMIN_PASSWORD</span> value from{" "}
              <span className="font-mono">.env.local</span>. Restart the dev server after
              changing env vars.
            </p>
          </form>
        </div>
      </main>
    );
  }

  // ── Posts List View ──
  if (view === "list") {
    return (
      <main className="min-h-screen pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-6 h-6 text-accent" />
                Blog Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {posts.length} posts
              </p>
            </div>
            <button
              onClick={handleNewPost}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-background text-sm font-medium hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Post
            </button>
          </div>

          {loadingPosts ? (
            <div className="text-center py-16 text-muted-foreground">
              Loading posts...
            </div>
          ) : postsError ? (
            <div className="text-center py-16 space-y-4">
              <p className="text-sm text-red-500">{postsError}</p>
              <button
                onClick={fetchPosts}
                className="text-accent hover:underline text-sm cursor-pointer"
              >
                Try loading again
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <p className="text-muted-foreground">No posts yet.</p>
              <button
                onClick={handleNewPost}
                className="text-accent hover:underline text-sm cursor-pointer"
              >
                Create your first post →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.slug}
                  className="group flex items-center justify-between p-5 rounded-xl bg-card border border-border hover:border-accent/30 transition-all duration-300"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground truncate">
                        {post.title}
                      </h3>
                      {!post.published && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
                          Draft
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{post.date}</span>
                      <span className="inline-flex items-center gap-1.5">
                        <Eye className="h-3.5 w-3.5" />
                        {post.viewCount} {post.viewCount === 1 ? "view" : "views"}
                      </span>
                      {post.tags.length > 0 && (
                        <span className="truncate">
                          {post.tags.slice(0, 3).join(", ")}
                          {post.tags.length > 3 && ` +${post.tags.length - 3}`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditPost(post.slug)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {deleteConfirm === post.slug ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDeletePost(post.slug)}
                          className="px-3 py-1.5 rounded-lg text-xs bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(post.slug)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Logout */}
          <div className="mt-12 pt-6 border-t border-border/50 text-center">
            <button
              onClick={() => {
                sessionStorage.removeItem("admin_token");
                setToken(null);
              }}
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── Editor View ──
  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                resetEditor();
                setView("list");
              }}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-6 h-6 text-accent" />
                {editingSlug ? "Edit Post" : "New Post"}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {editingSlug ? `Editing: ${editingSlug}` : "Write, preview, and publish"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground hover:border-accent/50 transition-all cursor-pointer"
            >
              {showPreview ? "Editor" : "Preview"}
            </button>
            <button
              onClick={handlePublish}
              disabled={publishing || !title.trim() || !content.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-accent text-background text-sm font-medium hover:shadow-lg hover:shadow-accent/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
            >
              <SendIcon size={16} />
              {publishing
                ? "Saving..."
                : editingSlug
                ? "Update"
                : "Publish"}
            </button>
          </div>
        </div>

        {/* Publish Result */}
        {publishResult && (
          <div
            className={`mb-6 p-4 rounded-xl border text-sm ${
              publishResult.success
                ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
            }`}
          >
            {publishResult.message}
            {publishResult.success && (
              <Link href="/blog" className="ml-2 underline underline-offset-2">
                View blog →
              </Link>
            )}
          </div>
        )}

        {showPreview ? (
          /* ── Preview Mode ── */
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-12">
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              {title || "Untitled Post"}
            </h1>
            {excerpt && (
              <p className="text-muted-foreground mb-8 text-lg italic">{excerpt}</p>
            )}
            {coverImage && (
              <div className="aspect-[2/1] rounded-xl overflow-hidden bg-muted mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              </div>
            )}
            {content ? (
              <MarkdownPreview content={content} />
            ) : (
              <div className="prose text-muted-foreground italic">
                Start writing your blog post...
              </div>
            )}
          </div>
        ) : (
          /* ── Editor Mode ── */
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block uppercase tracking-wider">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My awesome blog post..."
                className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground text-lg font-semibold placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block uppercase tracking-wider">
                Slug (URL)
              </label>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-card border border-border">
                <span className="text-sm text-muted-foreground/50">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="my-blog-post"
                  disabled={!!editingSlug}
                  className="flex-1 bg-transparent text-foreground text-sm focus:outline-none placeholder:text-muted-foreground/40 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block uppercase tracking-wider">
                Tags
              </label>
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-card border border-border">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-foreground transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <div className="inline-flex items-center">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add tag..."
                    className="bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/40 w-24"
                  />
                  <button
                    onClick={addTag}
                    className="text-muted-foreground hover:text-accent transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Cover Image & Excerpt */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block uppercase tracking-wider">
                  Cover Image
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="URL or upload..."
                      className="flex-1 px-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent/50 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="px-4 py-3 rounded-xl bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 disabled:opacity-40 transition-all cursor-pointer"
                      title="Upload image"
                    >
                      {uploading ? (
                        <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                      ) : (
                        <Upload className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
                  {coverImage ? (
                    <div className="relative aspect-[2/1] rounded-lg overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setCoverImage("")}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full aspect-[2/1] rounded-lg border-2 border-dashed border-border hover:border-accent/30 bg-muted/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-accent transition-all cursor-pointer disabled:opacity-40"
                    >
                      <ImageIcon className="w-8 h-8 opacity-40" />
                      <span className="text-xs">
                        {uploading ? "Uploading..." : "Click to upload"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block uppercase tracking-wider">
                  Excerpt (optional)
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A brief summary..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent/50 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Content with Toolbar */}
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block uppercase tracking-wider">
                Content (Markdown)
              </label>

              {/* ── Markdown Toolbar ── */}
              <div className="flex flex-wrap items-center gap-1 p-2 bg-card border border-border border-b-0 rounded-t-xl">
                <button
                  type="button"
                  onClick={() =>
                    textareaRef.current &&
                    insertMarkdown(textareaRef.current, "**", "**", setContent)
                  }
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    textareaRef.current &&
                    insertMarkdown(textareaRef.current, "*", "*", setContent)
                  }
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-border mx-1" />
                <button
                  type="button"
                  onClick={() =>
                    textareaRef.current &&
                    insertLinePrefix(textareaRef.current, "# ", setContent)
                  }
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  title="Heading 1"
                >
                  <Heading1 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    textareaRef.current &&
                    insertLinePrefix(textareaRef.current, "## ", setContent)
                  }
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    textareaRef.current &&
                    insertLinePrefix(textareaRef.current, "### ", setContent)
                  }
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  title="Heading 3"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-border mx-1" />
                <button
                  type="button"
                  onClick={() =>
                    textareaRef.current &&
                    insertMarkdown(textareaRef.current, "`", "`", setContent)
                  }
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  title="Inline Code"
                >
                  <Code className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    textareaRef.current &&
                    insertLinePrefix(textareaRef.current, "> ", setContent)
                  }
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  title="Quote"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    textareaRef.current &&
                    insertLinePrefix(textareaRef.current, "- ", setContent)
                  }
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  title="List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    textareaRef.current &&
                    insertMarkdown(
                      textareaRef.current,
                      "[",
                      "](url)",
                      setContent
                    )
                  }
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  title="Link"
                >
                  <Link2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    textareaRef.current &&
                    insertMarkdown(
                      textareaRef.current,
                      "![alt](",
                      ")",
                      setContent
                    )
                  }
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  title="Image"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>

              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your content here..."
                rows={24}
                className="w-full px-5 py-4 rounded-b-xl border border-border bg-card text-foreground font-mono text-sm leading-relaxed placeholder:text-muted-foreground/30 focus:outline-none focus:border-accent/50 transition-colors resize-y"
              />
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="mt-12 pt-6 border-t border-border/50 text-center">
          <button
            onClick={() => {
              sessionStorage.removeItem("admin_token");
              setToken(null);
            }}
            className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
