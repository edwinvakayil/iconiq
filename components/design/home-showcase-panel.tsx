"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";

import { Button } from "@/components/home-button";
import { GridCornerDots } from "@/components/design/line-grid";
import { cn } from "@/lib/utils";

export const homeShowcaseColSpan = {
  4: "col-span-full min-w-0 md:col-span-4",
  5: "col-span-full min-w-0 md:col-span-5",
  6: "col-span-full min-w-0 md:col-span-6",
  7: "col-span-full min-w-0 md:col-span-7",
  12: "col-span-full min-w-0 md:col-span-12",
} as const;

export function HomeShowcasePanel({
  children,
  className,
  href,
  title,
}: {
  children: ReactNode;
  className?: string;
  href: string;
  title: string;
}) {
  const [hoverFine, setHoverFine] = useState(false);
  const [focused, setFocused] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCoarsePointer(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const showActions = coarsePointer || hoverFine || focused;

  return (
    <div
      className={cn(
        "relative flex min-h-[240px] flex-col overflow-visible border-border border-r border-b md:min-h-[300px] md:overflow-hidden",
        className
      )}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false);
        }
      }}
      onFocusCapture={() => setFocused(true)}
      onPointerEnter={() => setHoverFine(true)}
      onPointerLeave={() => setHoverFine(false)}
    >
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-background dark:bg-background"
      />
      <GridCornerDots className="z-3 md:hidden" columns={1} rows={1} />
      <div
        className={cn(
          "absolute top-3 right-3 z-10 transition-opacity duration-150",
          showActions ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <Button href={href} size="sm" variant="outline">
          {title}
        </Button>
      </div>
      <div className="absolute inset-0 z-2 flex items-center justify-center p-4 pt-11 sm:p-4 sm:pt-11 md:p-5 md:pt-12">
        <div className="flex size-full max-h-full min-w-0 items-center justify-center">
          {children}
        </div>
      </div>
      <Link className="sr-only" href={href}>
        Open {title} docs
      </Link>
    </div>
  );
}
