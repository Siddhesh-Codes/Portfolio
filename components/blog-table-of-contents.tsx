"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TocHeading } from "@/lib/table-of-contents";

const ACTIVE_HEADING_OFFSET = 160;
const TOC_ROW_HEIGHT = 44;
const TOC_ROW_GAP = 8;
const TOC_FIRST_DOT_OFFSET = TOC_ROW_HEIGHT / 2;

export function BlogTableOfContents({
  headings,
}: {
  headings: TocHeading[];
}) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");
  const [tocProgressHeight, setTocProgressHeight] = useState(0);
  const totalTrackHeight =
    TOC_FIRST_DOT_OFFSET + Math.max(headings.length - 1, 0) * (TOC_ROW_HEIGHT + TOC_ROW_GAP);

  const syncActiveHeading = useEffectEvent(() => {
    const fallbackId = headings[0]?.id ?? "";
    const scrollMarker = window.scrollY + ACTIVE_HEADING_OFFSET;
    let currentId = fallbackId;

    const headingOffsets = headings.map((heading) => {
      const element = document.getElementById(heading.id);
      if (!element) {
        return null;
      }

      return element.getBoundingClientRect().top + window.scrollY;
    });

    for (let index = 0; index < headings.length; index += 1) {
      const offsetTop = headingOffsets[index];
      if (offsetTop === null) {
        continue;
      }

      if (scrollMarker >= offsetTop) {
        currentId = headings[index].id;
      } else {
        break;
      }
    }

    setActiveId((previousId) => (previousId === currentId ? previousId : currentId));

    if (!headings.length) {
      setTocProgressHeight(0);
      return;
    }

    const milestones = [ACTIVE_HEADING_OFFSET, ...headingOffsets];
    const dotCenters = headings.map(
      (_, index) => TOC_FIRST_DOT_OFFSET + index * (TOC_ROW_HEIGHT + TOC_ROW_GAP)
    );

    const nextMilestoneIndex = milestones.findIndex(
      (milestone) => milestone !== null && scrollMarker < milestone
    );

    if (nextMilestoneIndex === -1) {
      setTocProgressHeight(totalTrackHeight);
      return;
    }

    if (nextMilestoneIndex === 0) {
      setTocProgressHeight(0);
      return;
    }

    const previousMilestone = milestones[nextMilestoneIndex - 1];
    const nextMilestone = milestones[nextMilestoneIndex];
    const previousHeight = nextMilestoneIndex === 1 ? 0 : dotCenters[nextMilestoneIndex - 2];
    const nextHeight = dotCenters[nextMilestoneIndex - 1];

    const segmentProgress =
      previousMilestone !== null && nextMilestone !== null && nextMilestone > previousMilestone
        ? (scrollMarker - previousMilestone) / (nextMilestone - previousMilestone)
        : 0;

    const clampedProgress = Math.min(Math.max(segmentProgress, 0), 1);
    const nextProgressHeight =
      previousHeight + (nextHeight - previousHeight) * clampedProgress;

    setTocProgressHeight((previousHeightValue) =>
      Math.abs(previousHeightValue - nextProgressHeight) < 0.4
        ? previousHeightValue
        : nextProgressHeight
    );
  });

  useEffect(() => {
    if (!headings.length) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      syncActiveHeading();
    });

    const handlePositionChange = () => {
      syncActiveHeading();
    };

    window.addEventListener("scroll", handlePositionChange, { passive: true });
    window.addEventListener("resize", handlePositionChange);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", handlePositionChange);
      window.removeEventListener("resize", handlePositionChange);
    };
  }, [headings]);

  if (!headings.length) {
    return null;
  }

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28 overflow-hidden rounded-[28px] border border-border/70 bg-gradient-to-b from-card via-card to-accent/5 p-6 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.6)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <List className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-accent/70">
              On This Page
            </p>
            <h2 className="text-lg font-semibold text-foreground">
              Table of Contents
            </h2>
          </div>
        </div>

        <nav aria-label="Table of contents" className="relative">
          {headings.length > 0 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-5 z-0"
              style={{ height: `${totalTrackHeight}px` }}
            >
              <div className="absolute top-0 left-0 h-full w-px bg-border/70" />
              <div
                className="absolute top-0 left-0 w-px bg-gradient-to-b from-[#C8A96E] via-[#C8A96E] to-[#C8A96E] transition-[height] duration-150 ease-out"
                style={{ height: `${tocProgressHeight}px` }}
              />
            </div>
          )}

          <ol className="relative z-10 space-y-2">
            {headings.map((heading, index) => {
              const isActive = heading.id === activeId;
              const dotCenter =
                TOC_FIRST_DOT_OFFSET + index * (TOC_ROW_HEIGHT + TOC_ROW_GAP);
              const isReached = tocProgressHeight >= dotCenter;

              return (
                <li key={heading.id} className="h-11">
                  <a
                    href={`#${heading.id}`}
                    title={heading.text}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "group flex h-11 items-center gap-4 rounded-2xl px-3 text-sm transition-all duration-300",
                      isActive
                        ? "bg-accent/10 text-foreground ring-1 ring-accent/20"
                        : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-card transition-all duration-300",
                        isReached
                          ? "ring-1 ring-accent/30"
                          : "ring-1 ring-border/80 group-hover:ring-accent/25"
                      )}
                    >
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full transition-all duration-300",
                          isActive
                            ? "bg-accent shadow-[0_0_0_6px_rgba(200,169,110,0.12)]"
                            : isReached
                              ? "bg-accent/80"
                              : "bg-border group-hover:bg-accent/50"
                        )}
                      />
                    </span>
                    <span
                      className={cn(
                        "min-w-0 flex-1 truncate leading-none",
                        heading.level === 3 ? "text-[13px] opacity-[0.85]" : "text-[14px]"
                      )}
                    >
                      {heading.text}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </aside>
  );
}
