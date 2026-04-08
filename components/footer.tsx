"use client";

import { useEffect, useState } from "react";

function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // Single POST to increment + get count — no polling to save Vercel invocations
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: "__site_visitors" }),
    })
      .then((res) => res.json())
      .then((data) => setCount(data.views))
      .catch(() => {});
  }, []);

  if (count === null) return <span className="opacity-50">—</span>;
  return <span className="font-bold text-foreground">#{count}</span>;
}

function getIST() {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

function ISTClock() {
  const [time, setTime] = useState(getIST);

  useEffect(() => {
    const interval = setInterval(() => setTime(getIST()), 1000);
    return () => clearInterval(interval);
  }, []);

  return <>{time}</>;
}

export function Footer() {
  return (
    <footer className="border-t border-border/30 py-8 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start justify-between gap-4 text-sm text-muted-foreground font-mono">
        {/* Left column */}
        <div className="space-y-1">
          <p>
            Designed & Developed by{" "}
            <span className="font-bold text-foreground">Siddhesh</span>
          </p>
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>

        {/* Right column */}
        <div className="space-y-1 sm:text-right">
          <p>
            Visitors <VisitorCount />
          </p>
          <p>
            Navi Mumbai, India{" "}
            <span className="text-foreground">
              <ISTClock />
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
