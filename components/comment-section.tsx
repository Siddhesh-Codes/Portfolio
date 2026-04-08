"use client";

import { useState, useEffect, useCallback } from "react";
import { formatDate } from "@/lib/utils";
import { MessageCircle, User } from "lucide-react";
import SendIcon from "@/components/icons/send-icon";

interface Comment {
  id: string;
  post_slug: string;
  name: string;
  comment: string;
  created_at: string;
}

export function CommentSection({ postSlug }: { postSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments?slug=${postSlug}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoading(false);
    }
  }, [postSlug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postSlug, name: name.trim(), comment: comment.trim() }),
      });
      if (res.ok) {
        setName("");
        setComment("");
        fetchComments();
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-8">
        <MessageCircle className="w-5 h-5 text-accent" />
        Discussion
        {comments.length > 0 && (
          <span className="text-sm font-normal text-muted-foreground">
            ({comments.length})
          </span>
        )}
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-10 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="comment-name" className="text-xs text-muted-foreground mb-1.5 block">
              Your Name
            </label>
            <input
              id="comment-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
        </div>
        <div>
          <label htmlFor="comment-text" className="text-xs text-muted-foreground mb-1.5 block">
            Comment
          </label>
          <textarea
            id="comment-text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            required
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 transition-colors resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !name.trim() || !comment.trim()}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent text-background text-sm font-medium hover:shadow-lg hover:shadow-accent/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
        >
          <SendIcon size={16} />
          {submitting ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageCircle className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {formatDate(c.created_at)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed pl-11">
                {c.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
