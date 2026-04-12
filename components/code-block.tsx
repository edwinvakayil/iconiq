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
}

export function CodeBlock({
  code,
  children,
  language = "text",
  className,
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

  return (
    <div
      className={cn(
        "my-8 overflow-hidden rounded-[14px] border border-neutral-200/50 bg-white",
        "dark:border-neutral-800/60 dark:bg-neutral-950",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-2 border-neutral-200/40 border-b px-4 pt-2.5 pb-2",
          "bg-white dark:border-neutral-800/50 dark:bg-neutral-950"
        )}
      >
        <span
          className={cn(
            "inline-flex items-center gap-1.5 font-medium text-xs",
            "text-gray-800 dark:text-neutral-300"
          )}
        >
          <CodeIcon className="shrink-0 text-gray-800 dark:text-neutral-300" />
          {language}
        </span>
        <motion.button
          aria-label="Copy code"
          className={cn(
            "inline-flex size-7 items-center justify-center rounded-md border-0 bg-transparent p-0",
            "text-gray-800 transition-colors duration-150 hover:bg-neutral-100 hover:text-gray-900",
            "dark:text-neutral-300 dark:hover:bg-neutral-800/80 dark:hover:text-white",
            copied && "text-gray-800 dark:text-neutral-300"
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
          "m-0 overflow-x-auto bg-white px-5 pt-4 pb-5 font-mono text-gray-800 text-sm leading-[1.65]",
          "dark:bg-neutral-950 dark:text-neutral-200"
        )}
      >
        <code className="bg-transparent p-0 font-inherit text-inherit">
          {content}
        </code>
      </pre>
    </div>
  );
}
