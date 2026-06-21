"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const LEFT_COLUMN_TOP_FADE_MASK =
  "linear-gradient(to bottom, black 0%, rgba(0, 0, 0, 0.88) 44%, transparent 100%)";

const SCROLL_BLUR_FULL_AT = 48;

export function DocsLeftColumn({
  children,
  fullWidth = false,
}: {
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);

  const handleScroll = React.useCallback(() => {
    setScrollTop(scrollRef.current?.scrollTop ?? 0);
  }, []);

  React.useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  const blurProgress = Math.min(scrollTop / SCROLL_BLUR_FULL_AT, 1);

  return (
    <div
      className={cn(
        "relative z-10 flex h-full w-full flex-col bg-white dark:bg-[#080808]",
        fullWidth ? "min-h-screen flex-1" : "lg:max-w-1/2 lg:basis-1/2"
      )}
      data-docs-left-column
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-30 h-20 bg-gradient-to-b from-white via-white/75 to-transparent backdrop-blur-md transition-opacity duration-200 dark:from-[#080808] dark:via-[#080808]/75"
        style={{
          opacity: blurProgress,
          WebkitMaskImage: LEFT_COLUMN_TOP_FADE_MASK,
          maskImage: LEFT_COLUMN_TOP_FADE_MASK,
        }}
      />

      <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-30 h-24 bg-gradient-to-t from-white to-transparent dark:from-[#080808]" />

      <div
        className="flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={handleScroll}
        ref={scrollRef}
      >
        {children}
      </div>
    </div>
  );
}
