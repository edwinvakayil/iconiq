"use client";

import { Slot } from "@radix-ui/react-slot";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--background:#ffffff] [--foreground:#111111] [--primary:#111111] [--secondary:#646b75] [--surface-border:#e9edf2] [--border:#e3e7ec] [--card:#ffffff] [--card-foreground:#111111] [--muted:#f5f7fa] [--muted-foreground:#6d7480] [--accent:#f3f5f8] [--accent-foreground:#111111] [--input:#e3e7ec] [--ring:rgba(17,17,17,0.16)] [--destructive:#dc2626] [--paper:#fcfcfd] [--popover-foreground:#111111] [--brand:#0ea5e9] [--brand-soft:#bae6fd] [--shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--chart-1:oklch(0.52_0.19_254)] [--chart-2:oklch(0.74_0.11_232)] [--chart-3:oklch(0.42_0.16_262)] [--chart-4:oklch(0.84_0.07_228)] [--chart-5:oklch(0.62_0.14_240)] [--color-background:var(--background)] [--color-foreground:var(--foreground)] [--color-primary:var(--primary)] [--color-secondary:var(--secondary)] [--color-border:var(--border)] [--color-card:var(--card)] [--color-card-foreground:var(--card-foreground)] [--color-muted:var(--muted)] [--color-muted-foreground:var(--muted-foreground)] [--color-accent:var(--accent)] [--color-accent-foreground:var(--accent-foreground)] [--color-input:var(--input)] [--color-ring:var(--ring)] [--color-destructive:var(--destructive)] [--color-paper:var(--paper)] [--color-popover-foreground:var(--popover-foreground)] [--color-brand:var(--brand)] [--color-brand-soft:var(--brand-soft)] [--color-chart-1:var(--chart-1)] [--color-chart-2:var(--chart-2)] [--color-chart-3:var(--chart-3)] [--color-chart-4:var(--chart-4)] [--color-chart-5:var(--chart-5)] dark:[--background:#111111] dark:[--foreground:#f6f3ec] dark:[--primary:#f6f3ec] dark:[--secondary:#cbc6bb] dark:[--surface-border:#2a2a25] dark:[--border:#2b2a25] dark:[--card:#111111] dark:[--card-foreground:#f6f3ec] dark:[--muted:#171716] dark:[--muted-foreground:#9a958a] dark:[--accent:#1a1a18] dark:[--accent-foreground:#f6f3ec] dark:[--input:#2b2a25] dark:[--ring:rgba(246,243,236,0.18)] dark:[--destructive:#f87171] dark:[--paper:#171716] dark:[--popover-foreground:#f6f3ec] dark:[--brand:#38bdf8] dark:[--brand-soft:#0c4a6e] dark:[--shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--chart-1:oklch(0.68_0.17_250)] dark:[--chart-2:oklch(0.82_0.09_225)] dark:[--chart-3:oklch(0.58_0.15_260)] dark:[--chart-4:oklch(0.75_0.12_235)] dark:[--chart-5:oklch(0.88_0.06_220)]";

type Side = "top" | "bottom" | "left" | "right";
type TooltipTriggerElement = React.ReactElement<{
  "aria-describedby"?: string;
}>;

export interface TooltipProps extends ReducedMotionProp {
  children: TooltipTriggerElement;
  content: string;
  side?: Side;
  delay?: number;
  className?: string;
}

const MAX_TOOLTIP_CHARACTERS = 80;

function isTooltipTriggerElement(
  node: React.ReactNode
): node is TooltipTriggerElement {
  return React.isValidElement(node) && node.type !== React.Fragment;
}

function mergeDescribedBy(...ids: Array<string | undefined>) {
  const merged = ids.filter(Boolean).join(" ");

  return merged.length > 0 ? merged : undefined;
}

export function Tooltip({
  children,
  content,
  side = "top",
  delay = 0.15,
  className,
  reducedMotion,
}: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const tooltipId = React.useId();
  const normalizedContent = content.trim();

  if (!isTooltipTriggerElement(children)) {
    throw new Error(
      "Tooltip expects a single element child so it can forward hover, focus, and accessibility props."
    );
  }

  React.useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" &&
      (normalizedContent.length > MAX_TOOLTIP_CHARACTERS ||
        normalizedContent.includes("\n"))
    ) {
      console.warn(
        "Tooltip content should stay short, single-line, and non-interactive. Use Popover for longer or multiline content."
      );
    }
  }, [normalizedContent]);

  const childAriaDescribedBy = children.props["aria-describedby"];
  const triggerDescription = open
    ? mergeDescribedBy(childAriaDescribedBy, tooltipId)
    : childAriaDescribedBy;

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      clearTimeout(timeoutRef.current);

      if (nextOpen) {
        if (open) {
          return;
        }

        timeoutRef.current = setTimeout(() => setOpen(true), delay * 1000);
        return;
      }

      setOpen(false);
    },
    [delay, open]
  );

  React.useEffect(() => () => clearTimeout(timeoutRef.current), []);

  if (normalizedContent.length === 0) {
    return children;
  }

  return (
    <ReducedMotionConfig reducedMotion={reducedMotion}>
      <TooltipPrimitive.Provider delayDuration={0} skipDelayDuration={0}>
        <TooltipPrimitive.Root
          delayDuration={0}
          onOpenChange={handleOpenChange}
          open={open}
        >
          <TooltipPrimitive.Trigger asChild>
            <Slot aria-describedby={triggerDescription}>{children}</Slot>
          </TooltipPrimitive.Trigger>

          <AnimatePresence>
            {open && (
              <TooltipPrimitive.Portal forceMount>
                <TooltipPrimitive.Content
                  align="center"
                  asChild
                  avoidCollisions
                  collisionPadding={12}
                  forceMount
                  side={side}
                  sideOffset={10}
                >
                  <motion.div
                    animate={{
                      opacity: 1,
                      scale: 1,
                      filter: "blur(0px)",
                    }}
                    className={cn(
                      componentThemeClassName,
                      "group/tooltip pointer-events-none relative z-50 max-w-60 whitespace-normal rounded-lg bg-foreground px-3 py-1.5 font-medium text-background text-xs leading-snug shadow-[0_4px_24px_-4px_rgba(0,0,0,0.25)]",
                      className
                    )}
                    exit={{
                      opacity: 0,
                      scale: 0.92,
                      filter: "blur(4px)",
                    }}
                    id={tooltipId}
                    initial={{
                      opacity: 0,
                      scale: 0.92,
                      filter: "blur(4px)",
                    }}
                    role="tooltip"
                    style={{
                      transformOrigin:
                        "var(--radix-tooltip-content-transform-origin)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 24,
                      mass: 0.6,
                    }}
                  >
                    <motion.span
                      animate={{ scale: 1 }}
                      className="absolute h-2 w-2 rotate-45 bg-foreground group-data-[side=bottom]/tooltip:-top-1 group-data-[side=left]/tooltip:top-1/2 group-data-[side=right]/tooltip:top-1/2 group-data-[side=left]/tooltip:-right-1 group-data-[side=top]/tooltip:-bottom-1 group-data-[side=bottom]/tooltip:left-1/2 group-data-[side=right]/tooltip:-left-1 group-data-[side=top]/tooltip:left-1/2 group-data-[side=bottom]/tooltip:-translate-x-1/2 group-data-[side=top]/tooltip:-translate-x-1/2 group-data-[side=left]/tooltip:-translate-y-1/2 group-data-[side=right]/tooltip:-translate-y-1/2"
                      exit={{ scale: 0 }}
                      initial={{ scale: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 28,
                        delay: 0.03,
                      }}
                    />
                    {normalizedContent}
                  </motion.div>
                </TooltipPrimitive.Content>
              </TooltipPrimitive.Portal>
            )}
          </AnimatePresence>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    </ReducedMotionConfig>
  );
}

export { Tooltip as tooltip };
