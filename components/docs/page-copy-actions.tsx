"use client";

import { Check, ChevronDown, Copy, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";

import { SITE } from "@/constants";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/popover";

function getChatGptPrompt(pageUrl: string, title: string) {
  return encodeURIComponent(
    `I'm looking at the Iconiq documentation page "${title}" (${pageUrl}). Help me understand the component, installation, props, and implementation details.`
  );
}

export function PageCopyActions({
  componentName,
  pageContent,
  title,
}: {
  componentName: string;
  pageContent: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const pageUrl = `${SITE.URL}/components/${componentName}`;
  const registryUrl = `${SITE.URL}/r/${componentName}.json`;

  const menuItems = useMemo(
    () => [
      {
        href: registryUrl,
        label: "View registry JSON",
      },
      {
        href: `https://v0.dev/chat/api/open?url=${registryUrl}`,
        label: "Open in v0",
      },
      {
        href: `https://chatgpt.com/?q=${getChatGptPrompt(pageUrl, title)}`,
        label: "Ask ChatGPT",
      },
    ],
    [pageUrl, registryUrl, title]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pageContent);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative mr-2 inline-flex shrink-0 -space-x-px rounded-full text-sm shadow-none">
      <button
        className="relative inline-flex h-8 shrink-0 items-center gap-2 whitespace-nowrap rounded-none rounded-l-md bg-transparent px-3 font-medium text-foreground shadow-none transition-colors hover:bg-muted/55 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:border-border/80 dark:border-r dark:bg-[var(--secondary-bg)] dark:hover:bg-[#1d1d1b]"
        onClick={handleCopy}
        type="button"
      >
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="relative inline-flex size-4 items-center justify-center">
            <Copy
              className={cn(
                "absolute size-4 text-muted-foreground transition-all dark:text-[#b5b5b5]",
                copied
                  ? "scale-70 opacity-0 blur-[2px]"
                  : "scale-100 opacity-100 blur-none"
              )}
            />
            <Check
              className={cn(
                "absolute size-4 text-emerald-500 transition-all",
                copied
                  ? "scale-100 opacity-100 blur-none"
                  : "scale-70 opacity-0 blur-[2px]"
              )}
            />
          </span>
          <span className="whitespace-nowrap">Copy this page</span>
        </div>
      </button>

      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <button
            className="flex size-8 shrink-0 items-center justify-center rounded-none rounded-r-md bg-transparent text-muted-foreground shadow-none transition-colors hover:bg-muted/55 hover:text-foreground focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-[var(--secondary-bg)] dark:hover:bg-[#1d1d1b]"
            type="button"
          >
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                open && "rotate-180"
              )}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="z-20 mt-2 w-48 rounded-2xl border border-border/80 bg-background p-1.5 shadow-[0_20px_60px_rgba(15,23,42,0.12)] dark:bg-neutral-950"
          open={open}
          side="bottom"
          sideOffset={8}
        >
          {menuItems.map((item) => (
            <a
              className="flex items-center justify-between whitespace-nowrap rounded-xl px-3 py-2 text-[14px] text-foreground transition-colors hover:bg-muted/70"
              href={item.href}
              key={item.label}
              onClick={() => setOpen(false)}
              rel="noreferrer"
              target="_blank"
            >
              <span>{item.label}</span>
              <ExternalLink className="size-3.5 text-muted-foreground" />
            </a>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
