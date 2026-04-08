"use client";

import { useEffect } from "react";

/**
 * Silently increments a blog post's view count on mount.
 * Does not render anything visible.
 */
export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    }).catch(() => {});
  }, [slug]);

  return null;
}
