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
    <div className="sticky top-0 z-[160] w-full border-sky-200/70 border-b bg-sky-50 text-foreground dark:border-sky-500/15 dark:bg-sky-500/10">
      <div className="mx-auto flex h-[var(--announcement-height-mobile)] w-full items-center justify-between gap-3 px-4 sm:px-6 lg:h-[var(--announcement-height-desktop)] lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <p className="truncate text-[13px] text-foreground/90 tracking-[-0.02em] sm:text-[14px]">
            <span className="font-semibold text-sky-600 dark:text-sky-400">
              New:
            </span>{" "}
            Track the latest features, bug fixes, and improvements on Iconiq.
          </p>
          <Link
            className="hidden shrink-0 items-center gap-1.5 rounded-lg bg-sky-500 px-3 py-1.5 font-medium text-[12px] text-white transition-colors hover:bg-sky-600 sm:inline-flex dark:bg-sky-400 dark:text-sky-950 dark:hover:bg-sky-300"
            href="/changelog"
          >
            <span>Visit changelog</span>
            <ChevronRight className="size-3" />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-sky-500 px-2.5 py-1.5 font-medium text-[11px] text-white transition-colors hover:bg-sky-600 sm:hidden dark:bg-sky-400 dark:text-sky-950 dark:hover:bg-sky-300"
            href="/changelog"
          >
            <span>Changelog</span>
            <ChevronRight className="size-3" />
          </Link>
          <button
            aria-label="Dismiss announcement"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground/55 transition-colors hover:bg-sky-200/60 hover:text-foreground dark:text-sky-100/70 dark:hover:bg-sky-500/15 dark:hover:text-sky-50"
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
