"use client";

import { RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { AccessRequestBanner } from "@/registry/accessrequest";

const blockClassName =
  "my-4 overflow-hidden rounded-[14px] border border-black/8 bg-[#F9F9F9] dark:border-neutral-600 dark:bg-[#1c1c1e]";

export function AccessRequestPreviewBlock({
  className,
}: {
  className?: string;
}) {
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey(-1);
    requestAnimationFrame(() => {
      setResetKey((k) => (k === -1 ? 0 : k + 1));
    });
  };

  return (
    <div className={cn(blockClassName, className)}>
      <div
        className={cn(
          "relative z-10 flex items-center justify-between gap-2 px-4 pt-2.5 pb-2",
          "bg-[#F9F9F9] dark:bg-[#1c1c1e]"
        )}
      >
        <span
          className={cn(
            "inline-flex items-center gap-1.5 font-medium text-xs",
            "text-gray-800 dark:text-neutral-300"
          )}
        >
          Preview
        </span>
        <motion.button
          aria-label="Reset banner state"
          className={cn(
            "inline-flex cursor-pointer items-center gap-1.5 rounded-md border-0 bg-transparent px-2 py-1.5 font-medium text-xs",
            "text-gray-800 transition-colors duration-150 hover:bg-black/6 hover:text-gray-900",
            "dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
          )}
          onClick={handleReset}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          type="button"
          whileTap={{ scale: 0.96 }}
        >
          <RotateCcw className="size-3.5" />
          Reset
        </motion.button>
      </div>
      <div
        className={cn(
          "relative min-h-[120px] overflow-visible px-5 pt-6 pb-10",
          "bg-[#F9F9F9] dark:bg-[#1c1c1e]"
        )}
      >
        <div className="relative mx-auto max-w-xl">
          <div className="[&>div]:relative [&>div]:top-0 [&>div]:left-1/2 [&>div]:z-0 [&>div]:-translate-x-1/2">
            {resetKey >= 0 ? (
              <AccessRequestBanner key={resetKey} />
            ) : (
              <AccessRequestBanner />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
