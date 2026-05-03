"use client";

import { CopyIcon } from "lucide-react";
import type { ReactNode } from "react";

import { ActionState, type ActionStatus } from "@/components/ui/action-state";
import { cn } from "@/lib/utils";

type CommandBarProps = {
  srLabel: string;
  status: ActionStatus;
  onCopy: () => void;
  children: ReactNode;
  className?: string;
};

export function CommandBar({
  srLabel,
  status,
  onCopy,
  children,
  className,
}: CommandBarProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center overflow-hidden rounded-lg border border-border/70 bg-background/90",
        className
      )}
    >
      <div className="min-w-0 flex-1 overflow-x-auto px-4 py-3 sm:px-5">
        <span className="sr-only">{srLabel}</span>
        <div
          aria-hidden="true"
          className="inline-flex min-w-full items-center gap-[0.55ch] whitespace-nowrap font-mono text-[13px] text-foreground leading-none tracking-[-0.04em] sm:text-[14px]"
        >
          {children}
        </div>
      </div>
      <button
        aria-disabled={status !== "idle"}
        aria-label="Copy to clipboard"
        className="mr-1 inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-muted/[0.14] text-muted-foreground transition-colors duration-150 hover:bg-muted/26 hover:text-foreground focus-visible:outline-1 focus-visible:outline-primary dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
        onClick={onCopy}
        tabIndex={0}
        type="button"
      >
        <ActionState status={status}>
          <CopyIcon aria-hidden="true" className="size-4" />
        </ActionState>
      </button>
    </div>
  );
}
