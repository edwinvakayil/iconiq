"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { cn } from "@/lib/utils";

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect height="14" rx="2" ry="2" width="14" x="8" y="8" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      height="14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

interface CodeBlockProps {
  /** Code content (use when you need language label) */
  code?: string;
  /** Alias for code – use children for simple snippets */
  children?: React.ReactNode;
  language?: string;
  className?: string;
  /** Flush style for bento / docs tiles (no frame, minimal padding) */
  variant?: "default" | "embedded";
}

export function CodeBlock({
  code,
  children,
  language = "text",
  className,
  variant = "default",
}: CodeBlockProps) {
  const content =
    typeof code === "string"
      ? code
      : typeof children === "string"
        ? children
        : String(children ?? "");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const embedded = variant === "embedded";

  return (
    <div
      className={cn(
        embedded
          ? "my-0 overflow-hidden rounded-none border-0 bg-transparent dark:bg-transparent"
          : "my-8 overflow-hidden border border-border/85 bg-muted/28",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-2",
          embedded
            ? "border-0 bg-transparent px-0 pt-0 pb-3 dark:bg-transparent"
            : "border-border border-b bg-transparent px-4 pt-3 pb-2"
        )}
      >
        <span
          className={cn(
            "inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em]",
            "text-muted-foreground"
          )}
        >
          <CodeIcon className="shrink-0 text-muted-foreground" />
          {language}
        </span>
        <motion.button
          aria-label="Copy code"
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-none border border-transparent bg-transparent p-0",
            "text-muted-foreground transition-colors duration-150 hover:border-border hover:bg-background hover:text-foreground",
            copied && "text-muted-foreground"
          )}
          onClick={handleCopy}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          type="button"
          whileTap={{ scale: 0.88 }}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex"
                exit={{ scale: 0.6, opacity: 0 }}
                initial={{ scale: 0.6, opacity: 0 }}
                key="check"
                transition={{ duration: 0.12, ease: "easeOut" }}
              >
                <CheckIcon className="text-green-600 dark:text-green-400" />
              </motion.span>
            ) : (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex"
                exit={{ scale: 0.6, opacity: 0 }}
                initial={{ scale: 0.6, opacity: 0 }}
                key="copy"
                transition={{ duration: 0.12, ease: "easeOut" }}
              >
                <CopyIcon />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
      <pre
        className={cn(
          "m-0 overflow-x-auto font-mono text-foreground text-sm leading-[1.75]",
          embedded
            ? "bg-transparent px-0 pt-1 pb-0 dark:bg-transparent"
            : "bg-transparent px-5 pt-4 pb-5"
        )}
      >
        <code className="bg-transparent p-0 font-inherit text-inherit">
          {content}
        </code>
      </pre>
    </div>
  );
}
