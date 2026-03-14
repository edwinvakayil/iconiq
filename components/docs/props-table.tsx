"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface PropsTableRow {
  name: string;
  type: string;
  desc: string;
}

export function PropsTable({
  componentTag,
  props,
}: {
  componentTag: string;
  props: PropsTableRow[];
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 8 }}
      transition={{ delay: 0.25, duration: 0.3 }}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-5 sm:gap-3">
        <span className="rounded-lg bg-primary/10 px-2.5 py-1 font-mono font-semibold text-[10px] text-primary tracking-wide sm:text-[11px] dark:bg-primary/20 dark:text-primary">
          {componentTag.toUpperCase()}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wide sm:text-[11px] dark:text-muted-foreground">
          Props
        </span>
      </div>
      <div className="min-w-0 overflow-x-auto rounded-2xl border border-border bg-card [scrollbar-width:thin] dark:border-border dark:bg-card">
        {props.map((p, i) => (
          <div
            className={cn(
              "flex min-w-0 flex-col gap-3 border-border px-4 py-4 transition-colors hover:bg-muted/30 sm:flex-row sm:gap-6 sm:px-6 sm:py-5 dark:border-border dark:hover:bg-muted/20",
              i !== props.length - 1 && "border-b"
            )}
            key={p.name}
          >
            <div className="flex min-w-0 shrink-0 items-center gap-2 sm:w-[140px]">
              <span className="font-mono font-semibold text-[12px] text-foreground sm:text-[13px] dark:text-foreground">
                {p.name}
              </span>
            </div>
            <span className="w-fit shrink-0 rounded-md bg-muted px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground leading-tight sm:text-[11px] dark:bg-muted dark:text-muted-foreground">
              {p.type}
            </span>
            <span className="min-w-0 text-[12px] text-muted-foreground leading-relaxed sm:text-[13px] dark:text-muted-foreground">
              {p.desc}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
