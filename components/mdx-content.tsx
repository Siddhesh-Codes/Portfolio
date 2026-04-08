import { MDXRemote } from "next-mdx-remote/rsc";
import { type DocumentHeading, createHeadingId, normalizeHeadingText } from "@/lib/table-of-contents";
import { CopyCodeButton } from "./copy-code-button";

function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && node !== null && "props" in node) {
    const el = node as { props: { children?: React.ReactNode } };
    return extractText(el.props.children);
  }
  return "";
}

function createHeadingResolver(headings: DocumentHeading[]) {
  const headingLookup = new Map<string, string[]>();
  const fallbackIds = new Map<string, number>();

  for (const heading of headings) {
    const key = `${heading.level}:${normalizeHeadingText(heading.text)}`;
    const existing = headingLookup.get(key) ?? [];
    existing.push(heading.id);
    headingLookup.set(key, existing);
  }

  return (level: 1 | 2 | 3 | 4, children: React.ReactNode) => {
    const text = normalizeHeadingText(extractText(children));
    const key = `${level}:${text}`;
    const ids = headingLookup.get(key);

    if (ids && ids.length > 0) {
      return ids.shift() ?? createHeadingId(text, fallbackIds);
    }

    return createHeadingId(text, fallbackIds);
  };
}

export async function MDXContent({
  source,
  headings = [],
}: {
  source: string;
  headings?: DocumentHeading[];
}) {
  const resolveHeadingId = createHeadingResolver(headings);
  const components = {
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
      const id = resolveHeadingId(1, props.children);
      return <h1 {...props} id={id} className="mt-10 mb-4 scroll-mt-32 text-3xl font-bold" />;
    },
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
      const id = resolveHeadingId(2, props.children);
      return <h2 {...props} id={id} className="mt-8 mb-3 scroll-mt-32 text-2xl font-bold" />;
    },
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
      const id = resolveHeadingId(3, props.children);
      return <h3 {...props} id={id} className="mt-6 mb-2 scroll-mt-32 text-xl font-semibold" />;
    },
    h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
      const id = resolveHeadingId(4, props.children);
      return <h4 {...props} id={id} className="mt-6 mb-2 scroll-mt-32 text-lg font-semibold" />;
    },
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p {...props} className="mb-5 leading-relaxed" />
    ),
    a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a {...props} className="text-accent underline underline-offset-2 hover:opacity-80 transition-opacity" />
    ),
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
      <ul {...props} className="mb-5 list-disc space-y-2 pl-6" />
    ),
    ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
      <ol {...props} className="mb-5 list-decimal space-y-2 pl-6" />
    ),
    blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote {...props} className="my-8 rounded-r-xl border-l-[5px] border-accent bg-accent/[0.04] py-4 pl-6 pr-4 not-italic text-foreground" />
    ),
    code: (props: React.HTMLAttributes<HTMLElement>) => {
      const isInline = typeof props.children === "string";
      if (isInline) {
        return (
          <code
            {...props}
            className="rounded border border-border bg-muted px-1.5 py-0.5 text-sm font-mono"
          />
        );
      }
      return <code {...props} />;
    },
    pre: (props: React.HTMLAttributes<HTMLPreElement>) => {
      const codeText = extractText(props.children);
      return (
        <div className="group relative">
          <CopyCodeButton code={codeText} />
          <pre
            {...props}
            className="mb-5 overflow-x-auto rounded-xl border border-border bg-muted p-5 text-sm leading-7 font-mono"
          />
        </div>
      );
    },
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img {...props} alt={props.alt || ""} className="my-6 w-full rounded-xl" />
    ),
  };

  return (
    <div className="prose">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
