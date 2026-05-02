"use client";

import { ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function AnnouncementBanner() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);
  const isHiddenRoute = pathname === "/changelog";

  useEffect(() => {
    document.documentElement.dataset.bannerHidden =
      dismissed || isHiddenRoute ? "true" : "false";
  }, [dismissed, isHiddenRoute]);

  const handleDismiss = () => {
    setDismissed(true);
  };

  if (dismissed || isHiddenRoute) {
    return null;
  }

  return (
    <div className="sticky top-0 z-[160] hidden w-full border-white/10 border-b bg-neutral-950 text-white lg:block dark:border-neutral-200/70 dark:bg-white dark:text-neutral-950">
      <div className="mx-auto flex h-[var(--announcement-height-mobile)] w-full items-center justify-between gap-3 px-4 sm:px-6 lg:h-[var(--announcement-height-desktop)] lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <p className="truncate text-[13px] text-white/92 tracking-[-0.02em] sm:text-[14px] dark:text-neutral-950/88">
            <span className="font-semibold">New:</span> Major updates across
            components, docs, and installation.
          </p>
          <Link
            className="hidden shrink-0 items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 font-medium text-[12px] text-neutral-950 transition-colors hover:bg-white/90 sm:inline-flex dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900"
            href="/changelog"
          >
            <span>Visit changelog</span>
            <ChevronRight className="size-3" />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 font-medium text-[11px] text-neutral-950 transition-colors hover:bg-white/90 sm:hidden dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900"
            href="/changelog"
          >
            <span>Changelog</span>
            <ChevronRight className="size-3" />
          </Link>
          <button
            aria-label="Dismiss announcement"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/8 hover:text-white dark:text-neutral-950/62 dark:hover:bg-neutral-950/6 dark:hover:text-neutral-950"
            onClick={handleDismiss}
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
