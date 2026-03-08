"use client";

import { RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Highlighter } from "@/registry/highlighter";

const blockClassName =
  "my-8 overflow-hidden rounded-[14px] border border-black/8 bg-[#F9F9F9] dark:border-neutral-600 dark:bg-[#1c1c1e]";

export function HighlighterPreviewBlock({ className }: { className?: string }) {
  const [replayKey, setReplayKey] = useState(0);

  const handleReplay = () => {
    setReplayKey(-1);
    requestAnimationFrame(() => {
      setReplayKey((k) => (k === -1 ? 0 : k + 1));
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
          aria-label="Replay animation"
          className={cn(
            "inline-flex cursor-pointer items-center gap-1.5 rounded-md border-0 bg-transparent px-2 py-1.5 font-medium text-xs",
            "text-gray-800 transition-colors duration-150 hover:bg-black/6 hover:text-gray-900",
            "dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
          )}
          onClick={handleReplay}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          type="button"
          whileTap={{ scale: 0.96 }}
        >
          <RotateCcw className="size-3.5" />
          Replay
        </motion.button>
      </div>
      <div
        className={cn(
          "min-h-[80px] overflow-visible px-5 pt-4 pr-10 pb-10",
          "bg-[#F9F9F9] dark:bg-[#1c1c1e]"
        )}
      >
        <div className="font-sans text-lg text-neutral-600 dark:text-neutral-400">
          Motion-powered icons for your{" "}
          {replayKey >= 0 ? (
            <Highlighter
              containerClassName="inline-block align-baseline"
              key={replayKey}
              pointerColor="#ed0eb9"
            >
              <span className="relative z-10 px-1 py-1">React projects</span>
            </Highlighter>
          ) : (
            <span className="relative z-10 px-1 py-1">React projects</span>
          )}
        </div>
      </div>
    </div>
  );
}
