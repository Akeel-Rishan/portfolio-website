"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StreamingTextProps {
  text: string;
  isStreaming?: boolean;
  className?: string;
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold text-text-primary">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={`${part}-${index}`} className="rounded bg-dark-bg px-1.5 py-0.5 font-mono text-brand-cyan">
          {part.slice(1, -1)}
        </code>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function MarkdownBlock({ text }: { text: string }) {
  const blocks: JSX.Element[] = [];
  const lines = text.split("\n");
  let codeBuffer: string[] = [];
  let listBuffer: string[] = [];
  let inCode = false;

  const flushList = () => {
    if (!listBuffer.length) return;
    blocks.push(
      <ul key={`list-${blocks.length}`} className="my-3 list-disc space-y-1 pl-5">
        {listBuffer.map((item, index) => (
          <li key={`${item}-${index}`}>{renderInlineMarkdown(item)}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  const flushCode = () => {
    if (!codeBuffer.length) return;
    blocks.push(
      <pre key={`code-${blocks.length}`} className="my-3 overflow-x-auto rounded-xl border border-dark-border bg-dark-bg p-4">
        <code className="font-mono text-sm text-cyan-100">{codeBuffer.join("\n")}</code>
      </pre>
    );
    codeBuffer = [];
  };

  lines.forEach((line) => {
    if (line.trim().startsWith("```")) {
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        flushList();
        inCode = true;
      }
      return;
    }

    if (inCode) {
      codeBuffer.push(line);
      return;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      listBuffer.push(line.replace(/^\s*[-*]\s+/, ""));
      return;
    }

    flushList();

    if (line.trim()) {
      blocks.push(
        <p key={`p-${blocks.length}`} className="my-2 leading-7">
          {renderInlineMarkdown(line)}
        </p>
      );
    }
  });

  flushList();
  flushCode();

  return <>{blocks}</>;
}

export function StreamingText({ text, isStreaming = false, className }: StreamingTextProps) {
  const words = text.split(/(\s+)/).filter((word) => word.length > 0);

  if (!text) {
    return (
      <span className={cn("inline-flex items-center text-muted-foreground", className)}>
        {isStreaming && <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-brand-cyan" />}
      </span>
    );
  }

  return (
    <div className={cn("text-sm text-muted-foreground", className)}>
      <div className="sr-only">{text}</div>
      <div aria-hidden="true" className="hidden">
        {words.map((word, index) => (
          <motion.span key={`${word}-${index}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {word}
          </motion.span>
        ))}
      </div>
      <MarkdownBlock text={text} />
      {isStreaming && <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-brand-cyan align-middle" />}
    </div>
  );
}
