export interface DocumentHeading {
  id: string;
  text: string;
  level: 1 | 2 | 3 | 4;
}

export interface TocHeading extends DocumentHeading {
  level: 2 | 3;
}

export function normalizeHeadingText(value: string): string {
  return value
    .replace(/!\[([^\]]*)\]\((.*?)\)/g, "$1")
    .replace(/\[([^\]]+)\]\((.*?)\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&[#A-Za-z0-9]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function createHeadingId(value: string, seen: Map<string, number>): string {
  const baseId =
    normalizeHeadingText(value)
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "section";

  const currentCount = seen.get(baseId) ?? 0;
  seen.set(baseId, currentCount + 1);

  return currentCount === 0 ? baseId : `${baseId}-${currentCount + 1}`;
}

export function extractHeadings(content: string): DocumentHeading[] {
  const headings: DocumentHeading[] = [];
  const seen = new Map<string, number>();
  let insideCodeFence = false;

  for (const line of content.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (/^(```|~~~)/.test(trimmedLine)) {
      insideCodeFence = !insideCodeFence;
      continue;
    }

    if (insideCodeFence) {
      continue;
    }

    const match = /^(#{1,4})\s+(.+)$/.exec(trimmedLine);
    if (!match) {
      continue;
    }

    const level = match[1].length as 1 | 2 | 3 | 4;
    const text = normalizeHeadingText(match[2]);

    if (!text) {
      continue;
    }

    headings.push({
      id: createHeadingId(text, seen),
      text,
      level,
    });
  }

  return headings;
}

export function extractTableOfContents(content: string): TocHeading[] {
  return extractHeadings(content).filter(
    (heading): heading is TocHeading => heading.level === 2 || heading.level === 3
  );
}
