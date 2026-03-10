"use client";
import { RotateCw } from "lucide-react";
import type React from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface HoverFlipCardProps {
  className?: string;
  height?: number;
  width?: number;
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
}

export function HoverFlipCard({
  className,
  frontContent,
  backContent,
  height = 300,
  width = 350,
}: HoverFlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="group/flipping-card [perspective:1000px]"
      style={
        {
          "--height": `${height}px`,
          "--width": `${width}px`,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "relative rounded-xl border border-neutral-200 bg-white shadow-lg transition-transform duration-700 [transform-style:preserve-3d] dark:border-neutral-800 dark:bg-neutral-950 group-hover/flipping-card:[transform:rotateY(180deg)]",
          "h-[var(--height)] w-[var(--width)]",
          flipped && "[transform:rotateY(180deg)]",
          className
        )}
      >
        {/* Mobile toggle button */}
        <button
          aria-label={flipped ? "Show front" : "Show back"}
          className="absolute right-3 bottom-3 z-10 inline-flex size-8 items-center justify-center rounded-full bg-neutral-900/80 text-white shadow-sm ring-1 ring-black/10 transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
          onClick={() => setFlipped((prev) => !prev)}
          type="button"
        >
          <RotateCw aria-hidden className="size-4" />
        </button>

        {/* Front Face */}
        <div className="absolute inset-0 h-full w-full rounded-[inherit] bg-white text-neutral-950 [backface-visibility:hidden] [transform-style:preserve-3d] [transform:rotateY(0deg)] dark:bg-zinc-950 dark:text-neutral-50">
          <div className="h-full w-full [transform:translateZ(70px)_scale(.93)]">
            {frontContent}
          </div>
        </div>
        {/* Back Face */}
        <div className="absolute inset-0 h-full w-full rounded-[inherit] bg-white text-neutral-950 [backface-visibility:hidden] [transform-style:preserve-3d] [transform:rotateY(180deg)] dark:bg-zinc-950 dark:text-neutral-50">
          <div className="h-full w-full [transform:translateZ(70px)_scale(.93)]">
            {backContent}
          </div>
        </div>
      </div>
    </div>
  );
}
