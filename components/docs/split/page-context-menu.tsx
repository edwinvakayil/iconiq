"use client";

import { Check, ChevronDown, Copy } from "lucide-react";
import * as React from "react";

import { SITE } from "@/constants";
import { cn } from "@/lib/utils";

interface PageContextMenuProps {
  content: string;
  pageUrl?: string;
  className?: string;
}

function MarkdownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 22 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M19.5 2.25H2.5C1.80964 2.25 1.25 2.80964 1.25 3.5V12.5C1.25 13.1904 1.80964 13.75 2.5 13.75H19.5C20.1904 13.75 20.75 13.1904 20.75 12.5V3.5C20.75 2.80964 20.1904 2.25 19.5 2.25ZM2.5 1C1.11929 1 0 2.11929 0 3.5V12.5C0 13.8807 1.11929 15 2.5 15H19.5C20.8807 15 22 13.8807 22 12.5V3.5C22 2.11929 20.8807 1 19.5 1H2.5ZM3 4.5H4H4.25H4.6899L4.98715 4.82428L7 7.02011L9.01285 4.82428L9.3101 4.5H9.75H10H11V5.5V11.5H9V7.79807L7.73715 9.17572L7 9.97989L6.26285 9.17572L5 7.79807V11.5H3V5.5V4.5ZM15 8V4.5H17V8H19.5L17 10.5L16 11.5L15 10.5L12.5 8H15Z"
        fillRule="evenodd"
      />
    </svg>
  );
}

function ChatGPTIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5Z" />
    </svg>
  );
}

const menuItemClass =
  "relative flex w-full items-center gap-2.5 px-2.5 py-2 text-left font-medium text-[13px] text-zinc-700 transition-[background-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] before:pointer-events-none before:absolute before:inset-0 before:bg-zinc-100/90 before:opacity-0 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.22,1,0.36,1)] hover:before:opacity-100 dark:text-zinc-300 dark:before:bg-zinc-800/80";

const segmentClass =
  "relative overflow-hidden transition-[color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] before:pointer-events-none before:absolute before:inset-0 before:bg-zinc-200/60 before:opacity-0 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.22,1,0.36,1)] hover:before:opacity-100 active:scale-[0.985] dark:before:bg-zinc-800/70";

export function PageContextMenu({
  content,
  pageUrl,
  className,
}: PageContextMenuProps) {
  const [copied, setCopied] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resolvedPageUrl = pageUrl
    ? pageUrl.startsWith("http")
      ? pageUrl
      : `${SITE.URL}${pageUrl}`
    : typeof window !== "undefined"
      ? window.location.href
      : SITE.URL;

  const openChatGpt = async () => {
    await navigator.clipboard.writeText(content);
    const prompt = encodeURIComponent(
      `I'm looking at this Iconiq documentation: ${resolvedPageUrl}. The full docs are copied to my clipboard as markdown. Help me install, use, and customize this component.`
    );
    window.open(
      `https://chatgpt.com/?q=${prompt}`,
      "_blank",
      "noopener,noreferrer"
    );
    setIsOpen(false);
  };

  const viewMarkdown = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setIsOpen(false);
  };

  return (
    <div className={cn("relative inline-flex", className)} ref={dropdownRef}>
      <div className="inline-flex items-stretch overflow-hidden rounded-lg border border-border/40 bg-zinc-100/80 shadow-sm backdrop-blur-sm dark:border-white/[0.06] dark:bg-zinc-900/50">
        <button
          className={cn(
            segmentClass,
            "inline-flex items-center gap-2 px-3 py-2 font-medium text-[13px]",
            copied ? "text-foreground" : "text-zinc-600 dark:text-zinc-400"
          )}
          onClick={handleCopy}
          type="button"
        >
          <span className="relative z-[1] inline-flex items-center gap-2">
            <span className="relative size-3.5">
              <Copy
                className={cn(
                  "absolute inset-0 size-3.5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  copied ? "scale-75 opacity-0" : "scale-100 opacity-100"
                )}
              />
              <Check
                className={cn(
                  "absolute inset-0 size-3.5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  copied ? "scale-100 opacity-100" : "scale-75 opacity-0"
                )}
              />
            </span>
            <span className="transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
              {copied ? "Copied" : "Copy as Markdown"}
            </span>
          </span>
        </button>

        <button
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label="More export options"
          className={cn(
            segmentClass,
            "flex items-center justify-center self-stretch px-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200",
            isOpen && "text-zinc-800 before:opacity-100 dark:text-zinc-200"
          )}
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          <ChevronDown
            className={cn(
              "relative z-[1] size-3.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </div>

      {isOpen ? (
        <div
          className="fade-in zoom-in-95 absolute top-full left-0 z-50 mt-1.5 w-56 animate-in overflow-hidden rounded-lg border border-border/40 bg-white/95 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xl duration-100 dark:border-white/[0.06] dark:bg-[#121212]/95"
          role="menu"
        >
          <button
            className={menuItemClass}
            onClick={viewMarkdown}
            role="menuitem"
            type="button"
          >
            <span className="relative z-[1] inline-flex items-center gap-2.5">
              <MarkdownIcon className="size-4 text-zinc-500 dark:text-zinc-400" />
              View as Markdown
            </span>
          </button>

          <button
            className={menuItemClass}
            onClick={openChatGpt}
            role="menuitem"
            type="button"
          >
            <span className="relative z-[1] inline-flex items-center gap-2.5">
              <ChatGPTIcon className="size-4 shrink-0" />
              Open in ChatGPT
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
