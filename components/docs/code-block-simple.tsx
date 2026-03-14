"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CodeBlockSimple({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group flex min-w-0 flex-col gap-2 rounded-2xl border border-border bg-card px-3 py-3 font-mono text-foreground/90 transition-all hover:border-primary/20 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:px-5 sm:py-3.5 dark:border-border dark:bg-card dark:text-foreground/90">
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre text-[12px] [scrollbar-width:thin] sm:text-[13px]">
        {code}
      </code>
      <button
        aria-label="Copy code"
        className="shrink-0 self-end rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-muted hover:text-foreground sm:ml-4 sm:self-auto dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground"
        onClick={handleCopy}
        type="button"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-primary" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
