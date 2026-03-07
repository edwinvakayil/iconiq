"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

type CodeBlockProps = {
  children: string;
  className?: string;
};

const blockClassName =
  "rounded-lg border border-neutral-200 bg-transparent px-4 py-3 pr-12 font-mono text-[13px] leading-relaxed text-neutral-900 overflow-x-auto relative";

export function CodeBlock({ children, className = "" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="relative">
      <pre className={`${blockClassName} ${className}`}>
        <code className="whitespace-pre">{children}</code>
      </pre>
      <button
        aria-label="Copy code"
        className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-900 focus-visible:outline-1 focus-visible:outline-primary"
        onClick={handleCopy}
        type="button"
      >
        {copied ? (
          <Check aria-hidden className="size-4 text-green-600" />
        ) : (
          <Copy aria-hidden className="size-4" />
        )}
      </button>
    </div>
  );
}
