"use client";

import type { LucideIcon } from "lucide-react";

import { CopyButton } from "@/components/docs/split/copy-button";
import { cn } from "@/lib/utils";

export interface DocsCodePanelTab {
  id: string;
  label: string;
}

interface DocsCodePanelProps {
  icon?: LucideIcon;
  copyCode: string;
  tabs?: DocsCodePanelTab[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  tabListAriaLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export function DocsCodePanel({
  icon: Icon,
  copyCode,
  tabs,
  activeTab,
  onTabChange,
  tabListAriaLabel = "Options",
  children,
  className,
}: DocsCodePanelProps) {
  const hasTabs = tabs && tabs.length > 0;

  return (
    <div
      className={cn(
        "relative w-full max-w-full overflow-hidden rounded-xl border-[0.5px] border-zinc-200/80 bg-white text-sm shadow-none dark:border-zinc-800/80 dark:bg-zinc-950",
        className
      )}
      data-code-block
      data-line-numbers="false"
    >
      <div className="flex items-center justify-between gap-3 border-zinc-200/80 border-b-[0.5px] px-4 py-2.5 dark:border-zinc-800/80">
        <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
          {Icon ? (
            <Icon
              aria-hidden
              className="size-3.5 shrink-0 text-muted-foreground"
            />
          ) : null}

          {hasTabs ? (
            <div
              aria-label={tabListAriaLabel}
              className="flex items-center gap-1"
              role="tablist"
            >
              {tabs.map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    aria-selected={isSelected}
                    className={cn(
                      "shrink-0 rounded-md px-2.5 py-1 font-medium text-[13px] outline-none transition-colors",
                      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                      isSelected
                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                        : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                    )}
                    key={tab.id}
                    onClick={() => onTabChange?.(tab.id)}
                    role="tab"
                    type="button"
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <CopyButton
          absolute={false}
          className="shrink-0 p-1.5"
          code={copyCode}
        />
      </div>

      <div className="relative">{children}</div>
    </div>
  );
}
