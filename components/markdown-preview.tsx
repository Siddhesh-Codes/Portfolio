"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

export function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children, ...props }) => (
            <h1 {...props} className="text-3xl font-bold mt-10 mb-4">{children}</h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 {...props} className="text-2xl font-bold mt-8 mb-3">{children}</h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 {...props} className="text-xl font-semibold mt-6 mb-2">{children}</h3>
          ),
          p: ({ children, ...props }) => (
            <p {...props} className="mb-5 leading-relaxed">{children}</p>
          ),
          a: ({ children, ...props }) => (
            <a {...props} className="text-accent underline underline-offset-2 hover:opacity-80 transition-opacity">{children}</a>
          ),
          ul: ({ children, ...props }) => (
            <ul {...props} className="list-disc pl-6 mb-5 space-y-2">{children}</ul>
          ),
          ol: ({ children, ...props }) => (
            <ol {...props} className="list-decimal pl-6 mb-5 space-y-2">{children}</ol>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote {...props} className="border-l-[5px] border-accent pl-6 pr-4 py-4 my-8 rounded-r-xl bg-accent/[0.04] not-italic text-foreground">{children}</blockquote>
          ),
          code: ({ children, className, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  {...props}
                  className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono border border-border"
                >
                  {children}
                </code>
              );
            }
            return <code {...props} className={className}>{children}</code>;
          },
          pre: ({ children, ...props }) => {
            const codeText = extractText(children);
            return (
              <div className="relative group">
                <CopyCodeButton code={codeText} />
                <pre
                  {...props}
                  className="bg-muted border border-border rounded-xl p-5 overflow-x-auto mb-5 text-sm leading-7 font-mono"
                >
                  {children}
                </pre>
              </div>
            );
          },
          img: ({ alt, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img {...props} alt={alt || ""} className="rounded-xl my-6 w-full" />
          ),
          hr: () => (
            <hr className="border-border my-8" />
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-foreground">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
