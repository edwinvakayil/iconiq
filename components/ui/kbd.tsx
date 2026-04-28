import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function Kbd({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-[6px] border border-neutral-200/90 in-data-[slot=tooltip-content]:border-white/15 bg-white in-data-[slot=tooltip-content]:bg-background/20 px-1.5 font-medium font-sans in-data-[slot=tooltip-content]:text-background text-[11px] text-neutral-500 shadow-[0_1px_0_rgba(17,17,17,0.03)] dark:border-neutral-800 dark:in-data-[slot=tooltip-content]:border-white/10 dark:bg-neutral-950 dark:in-data-[slot=tooltip-content]:bg-background/10 dark:text-neutral-300 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      data-slot="kbd"
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      data-slot="kbd-group"
      {...props}
    />
  );
}

export { Kbd, KbdGroup };
