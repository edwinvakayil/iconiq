"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const TRAILING_NEWLINE_RE = /\n$/;

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
  scrollable?: boolean;
  heightClassName?: string;
}

export function CodeBlock({
  code,
  children,
  language = "text",
  className,
  variant = "default",
  scrollable = false,
  heightClassName,
}: CodeBlockProps) {
  const content =
    typeof code === "string"
      ? code
      : typeof children === "string"
        ? children
        : String(children ?? "");
  const lines = content.replace(TRAILING_NEWLINE_RE, "").split("\n");
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
  const showUtilityRow = !embedded;
  const shellClassName = embedded
    ? "my-0 overflow-hidden border-y border-border/55 bg-transparent"
    : "my-8 overflow-hidden border-y border-border/60 bg-transparent";
  const headerClassName = embedded ? "" : "border-border/55 border-b px-0 py-3";
  const contentClassName = embedded ? "py-4" : "py-3.5";

  return (
    <div
      className={cn(
        shellClassName,
        scrollable && "flex flex-col",
        scrollable && heightClassName,
        className
      )}
    >
      {showUtilityRow ? (
        <div
          className={cn(
            "flex items-center justify-between gap-2",
            headerClassName
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
              "inline-flex size-8 items-center justify-center rounded-md bg-transparent p-0",
              "text-muted-foreground transition-colors duration-150 hover:bg-muted/25 hover:text-foreground dark:hover:bg-white/[0.05]",
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
      ) : null}
      <pre
        className={cn(
          "m-0 font-mono text-[13px] text-foreground leading-7 sm:text-[13.5px]",
          scrollable
            ? "min-h-0 flex-1 overflow-auto overscroll-contain"
            : "overflow-x-auto",
          embedded && "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          contentClassName
        )}
      >
        <code className="relative block min-w-max bg-transparent p-0 font-inherit text-inherit">
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 w-11 bg-muted/[0.12] dark:bg-white/[0.025]"
            )}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-11 w-px bg-border/55"
          />
          {lines.map((line, index) => (
            <span
              className="grid min-h-[2rem] grid-cols-[2.75rem_minmax(0,1fr)] gap-x-0 px-0"
              key={`${index + 1}-${line}`}
            >
              <span
                aria-hidden="true"
                className="select-none px-3 py-1.5 text-right font-mono text-[11px] text-muted-foreground/65"
              >
                {index + 1}
              </span>
              <span className="whitespace-pre px-5 py-1.5 pr-4 tracking-[-0.015em] sm:pr-5">
                {line || " "}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
