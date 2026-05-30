"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { motion, type Transition } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--background:#ffffff] [--foreground:#111111] [--primary:#111111] [--secondary:#646b75] [--surface-border:#e9edf2] [--border:#e3e7ec] [--card:#ffffff] [--card-foreground:#111111] [--muted:#f5f7fa] [--muted-foreground:#6d7480] [--accent:#f3f5f8] [--accent-foreground:#111111] [--input:#e3e7ec] [--ring:rgba(17,17,17,0.16)] [--destructive:#dc2626] [--paper:#fcfcfd] [--popover-foreground:#111111] [--brand:#0ea5e9] [--brand-soft:#bae6fd] [--shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--chart-1:oklch(0.52_0.19_254)] [--chart-2:oklch(0.74_0.11_232)] [--chart-3:oklch(0.42_0.16_262)] [--chart-4:oklch(0.84_0.07_228)] [--chart-5:oklch(0.62_0.14_240)] [--color-background:var(--background)] [--color-foreground:var(--foreground)] [--color-primary:var(--primary)] [--color-secondary:var(--secondary)] [--color-border:var(--border)] [--color-card:var(--card)] [--color-card-foreground:var(--card-foreground)] [--color-muted:var(--muted)] [--color-muted-foreground:var(--muted-foreground)] [--color-accent:var(--accent)] [--color-accent-foreground:var(--accent-foreground)] [--color-input:var(--input)] [--color-ring:var(--ring)] [--color-destructive:var(--destructive)] [--color-paper:var(--paper)] [--color-popover-foreground:var(--popover-foreground)] [--color-brand:var(--brand)] [--color-brand-soft:var(--brand-soft)] [--color-chart-1:var(--chart-1)] [--color-chart-2:var(--chart-2)] [--color-chart-3:var(--chart-3)] [--color-chart-4:var(--chart-4)] [--color-chart-5:var(--chart-5)] dark:[--background:#111111] dark:[--foreground:#f6f3ec] dark:[--primary:#f6f3ec] dark:[--secondary:#cbc6bb] dark:[--surface-border:#2a2a25] dark:[--border:#2b2a25] dark:[--card:#111111] dark:[--card-foreground:#f6f3ec] dark:[--muted:#171716] dark:[--muted-foreground:#9a958a] dark:[--accent:#1a1a18] dark:[--accent-foreground:#f6f3ec] dark:[--input:#2b2a25] dark:[--ring:rgba(246,243,236,0.18)] dark:[--destructive:#f87171] dark:[--paper:#171716] dark:[--popover-foreground:#f6f3ec] dark:[--brand:#38bdf8] dark:[--brand-soft:#0c4a6e] dark:[--shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--chart-1:oklch(0.68_0.17_250)] dark:[--chart-2:oklch(0.82_0.09_225)] dark:[--chart-3:oklch(0.58_0.15_260)] dark:[--chart-4:oklch(0.75_0.12_235)] dark:[--chart-5:oklch(0.88_0.06_220)]";

type ButtonHTMLAttributesForMotion = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onAnimationStart"
  | "onDrag"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDragStart"
  | "onDrop"
>;

type DivHTMLAttributesForMotion = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onAnimationStart"
  | "onDrag"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDragStart"
  | "onDrop"
>;

type CollapsibleContextValue = {
  disabled?: boolean;
  open: boolean;
  reduceMotion: boolean;
};

const settleEase = [0.22, 1, 0.36, 1] as const;

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(
  null
);

const triggerPressTransition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 30,
  mass: 0.7,
};

const contentShellTransition: Transition = {
  height: {
    type: "spring",
    stiffness: 142,
    damping: 25,
    mass: 0.96,
  },
  opacity: {
    duration: 0.24,
    ease: [0.18, 1, 0.32, 1],
  },
  clipPath: {
    duration: 0.34,
    ease: [0.16, 1, 0.3, 1],
  },
};

const contentMaskTransition: Transition = {
  duration: 0.34,
  ease: [0.16, 1, 0.3, 1],
};

const contentCopyTransition: Transition = {
  y: {
    type: "spring",
    stiffness: 148,
    damping: 23,
    mass: 0.96,
  },
  scale: {
    duration: 0.28,
    ease: [0.18, 1, 0.32, 1],
  },
  opacity: {
    duration: 0.22,
    ease: [0.18, 1, 0.32, 1],
    delay: 0.03,
  },
  filter: {
    duration: 0.24,
    ease: [0.18, 1, 0.32, 1],
    delay: 0.03,
  },
};

function useCollapsibleContext() {
  const context = React.useContext(CollapsibleContext);

  if (!context) {
    throw new Error("Collapsible parts must be used within Collapsible.");
  }

  return context;
}

function getContentTransition(reduceMotion: boolean) {
  if (reduceMotion) {
    return {
      duration: 0.16,
      ease: settleEase,
    };
  }

  return contentShellTransition;
}

function getMaskTransition(reduceMotion: boolean) {
  if (reduceMotion) {
    return {
      duration: 0.14,
      ease: settleEase,
    };
  }

  return contentMaskTransition;
}

function getInnerTransition(reduceMotion: boolean) {
  if (reduceMotion) {
    return {
      duration: 0.14,
      ease: settleEase,
    };
  }

  return contentCopyTransition;
}

function getIconTransition(reduceMotion: boolean) {
  if (reduceMotion) {
    return {
      duration: 0.14,
      ease: settleEase,
    };
  }

  return {
    type: "spring" as const,
    stiffness: 360,
    damping: 24,
    mass: 0.66,
  };
}

function getContentAnimate(open: boolean, reduceMotion: boolean) {
  if (reduceMotion) {
    return {
      height: open ? "auto" : 0,
      opacity: open ? 1 : 0,
    };
  }

  return {
    height: open ? "auto" : 0,
    clipPath: open ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
    opacity: open ? 1 : 0,
  };
}

function getMaskAnimate(open: boolean, reduceMotion: boolean) {
  if (reduceMotion) {
    return {
      opacity: open ? 1 : 0,
    };
  }

  return {
    clipPath: open ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
    opacity: open ? 1 : 0.68,
  };
}

function getInnerAnimate(open: boolean, reduceMotion: boolean) {
  if (reduceMotion) {
    return {
      opacity: open ? 1 : 0,
      y: 0,
    };
  }

  return {
    scale: open ? 1 : 0.996,
    opacity: open ? 1 : 0,
    y: open ? 0 : -3,
    filter: open ? "blur(0px)" : "blur(1.5px)",
  };
}

export interface CollapsibleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ReducedMotionProp {
  children: React.ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  (
    {
      children,
      className,
      defaultOpen = false,
      disabled = false,
      onOpenChange,
      open: openProp,
      reducedMotion,
      ...props
    },
    ref
  ) => {
    const isControlled = openProp !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const open = isControlled ? openProp : uncontrolledOpen;
    const reduceMotion = useResolvedReducedMotion(reducedMotion);

    const handleOpenChange = React.useCallback(
      (nextOpen: boolean) => {
        if (!isControlled) {
          setUncontrolledOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);
      },
      [isControlled, onOpenChange]
    );

    return (
      <ReducedMotionConfig reducedMotion={reducedMotion}>
        <CollapsibleContext.Provider value={{ disabled, open, reduceMotion }}>
          <CollapsiblePrimitive.Root
            className={cn(
              componentThemeClassName,
              "block w-full min-w-0 overflow-hidden border-border/60 border-b bg-transparent",
              className
            )}
            disabled={disabled}
            onOpenChange={handleOpenChange}
            open={open}
            ref={ref}
            {...props}
          >
            {children}
          </CollapsiblePrimitive.Root>
        </CollapsibleContext.Provider>
      </ReducedMotionConfig>
    );
  }
);

Collapsible.displayName = "Collapsible";

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributesForMotion
>(({ children, className, type = "button", ...props }, ref) => {
  const { disabled, open, reduceMotion } = useCollapsibleContext();

  return (
    <CollapsiblePrimitive.Trigger asChild>
      <motion.button
        className={cn(
          "flex w-full items-center justify-between gap-4 py-3 text-left text-foreground transition-[color,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        ref={ref}
        transition={triggerPressTransition}
        type={type}
        whileTap={
          disabled || reduceMotion
            ? undefined
            : { scale: 0.992, y: 0, transition: triggerPressTransition }
        }
        {...props}
      >
        <span className="min-w-0 font-medium text-[15px] leading-6 tracking-[-0.01em]">
          {children}
        </span>
        <motion.span
          animate={{
            rotate: open ? 180 : 0,
            scale: open && !reduceMotion ? 1.04 : 1,
            y: open && !reduceMotion ? 1 : 0,
          }}
          className="inline-flex shrink-0 items-center justify-center text-muted-foreground"
          transition={getIconTransition(reduceMotion)}
        >
          <ChevronDown className="h-4 w-4" strokeWidth={2.2} />
        </motion.span>
      </motion.button>
    </CollapsiblePrimitive.Trigger>
  );
});

CollapsibleTrigger.displayName = "CollapsibleTrigger";

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  DivHTMLAttributesForMotion
>(({ children, className, ...props }, ref) => {
  const { open, reduceMotion } = useCollapsibleContext();

  return (
    <CollapsiblePrimitive.Content asChild forceMount>
      <motion.div
        animate={getContentAnimate(open, reduceMotion)}
        className={cn(
          "origin-top overflow-hidden will-change-[height,opacity,clip-path]",
          className
        )}
        initial={false}
        ref={ref}
        transition={getContentTransition(reduceMotion)}
        {...props}
      >
        <motion.div
          animate={getMaskAnimate(open, reduceMotion)}
          className="overflow-hidden will-change-[clip-path,opacity]"
          initial={false}
          transition={getMaskTransition(reduceMotion)}
        >
          <motion.div
            animate={getInnerAnimate(open, reduceMotion)}
            className="pr-8 pb-3 text-muted-foreground text-sm leading-6 will-change-transform"
            initial={false}
            transition={getInnerTransition(reduceMotion)}
          >
            {children}
          </motion.div>
        </motion.div>
      </motion.div>
    </CollapsiblePrimitive.Content>
  );
});

CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
