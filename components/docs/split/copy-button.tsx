"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CopyButtonProps {
  code: string;
  className?: string;
  absolute?: boolean;
}

export function CopyButton({
  code,
  className,
  absolute = true,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      aria-label={copied ? "Copied" : "Copy code"}
      className={`${absolute ? "absolute top-3 right-3" : ""} z-10 rounded-lg p-2 transition-colors duration-200 ${
        copied
          ? "bg-transparent text-green-600 dark:text-green-400"
          : "bg-transparent text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
      } ${className || ""}`}
      onClick={handleCopy}
      type="button"
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
    </button>
  );
}
