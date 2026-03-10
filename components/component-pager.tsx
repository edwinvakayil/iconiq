"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SITE_SECTIONS } from "@/lib/site-nav";

const COMPONENT_ROUTES =
  SITE_SECTIONS.find((section) => section.label === "Animated Components")
    ?.children ?? [];

export function ComponentPager() {
  const pathname = usePathname();

  const index = COMPONENT_ROUTES.findIndex((item) => item.href === pathname);
  if (index === -1) return null;

  const prev = COMPONENT_ROUTES[index - 1];
  const next = COMPONENT_ROUTES[index + 1];

  return (
    <div className="flex items-center gap-2">
      <PagerButton direction="prev" target={prev} />
      <PagerButton direction="next" target={next} />
    </div>
  );
}

function PagerButton({
  direction,
  target,
}: {
  direction: "prev" | "next";
  target?: { href: string; label: string };
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  const isDisabled = !target;

  const commonClasses =
    "inline-flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800 transition-colors hover:bg-neutral-200 focus-visible:outline-1 focus-visible:outline-primary dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800";

  if (isDisabled) {
    return (
      <button
        aria-disabled="true"
        className={`${commonClasses} cursor-not-allowed opacity-40`}
        type="button"
      >
        <Icon aria-hidden className="size-5" />
      </button>
    );
  }

  return (
    <Link
      aria-label={
        direction === "prev"
          ? `Previous component: ${target.label}`
          : `Next component: ${target.label}`
      }
      className={commonClasses}
      href={target.href}
    >
      <Icon aria-hidden className="size-5" />
    </Link>
  );
}
