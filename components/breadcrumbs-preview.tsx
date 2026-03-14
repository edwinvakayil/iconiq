"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";

import {
  AnimatedBreadcrumbs,
  type BreadcrumbItem,
} from "@/registry/breadcrumbs";

export function BreadcrumbsPreview({ items }: { items: BreadcrumbItem[] }) {
  const [replayKey, setReplayKey] = useState(0);

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AnimatedBreadcrumbs items={items} key={replayKey} />
        <button
          aria-label="Replay breadcrumb animation"
          className="inline-flex items-center gap-1 rounded-md font-medium font-sans text-neutral-500 text-xs transition-colors hover:text-neutral-900 focus-visible:outline-1 focus-visible:outline-primary dark:text-neutral-400 dark:hover:text-white"
          onClick={() => setReplayKey((k) => k + 1)}
          type="button"
        >
          <RotateCcw className="h-3 w-3" />
          Replay
        </button>
      </div>
    </div>
  );
}
