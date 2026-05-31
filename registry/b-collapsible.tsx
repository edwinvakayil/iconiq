"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
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
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

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

type TriggerRenderProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
};

type PanelRenderProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
};

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

function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

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

function resolveTriggerProps(triggerProps: TriggerRenderProps) {
  const {
    children: _triggerChildren,
    className: triggerClassName,
    onAnimationEnd: _onAnimationEnd,
    onAnimationIteration: _onAnimationIteration,
    onAnimationStart: _onAnimationStart,
    onDrag: _onDrag,
    onDragEnd: _onDragEnd,
    onDragEnter: _onDragEnter,
    onDragExit: _onDragExit,
    onDragLeave: _onDragLeave,
    onDragOver: _onDragOver,
    onDragStart: _onDragStart,
    onDrop: _onDrop,
    ref: triggerRef,
    style: triggerStyle,
    ...resolvedTriggerProps
  } = triggerProps;

  return {
    resolvedTriggerProps,
    triggerClassName,
    triggerRef,
    triggerStyle,
  };
}

function resolvePanelProps(panelProps: PanelRenderProps) {
  const {
    children: _panelChildren,
    className: panelClassName,
    hidden: _panelHidden,
    onAnimationEnd: _onAnimationEnd,
    onAnimationIteration: _onAnimationIteration,
    onAnimationStart: _onAnimationStart,
    onDrag: _onDrag,
    onDragEnd: _onDragEnd,
    onDragEnter: _onDragEnter,
    onDragExit: _onDragExit,
    onDragLeave: _onDragLeave,
    onDragOver: _onDragOver,
    onDragStart: _onDragStart,
    onDrop: _onDrop,
    ref: panelRef,
    style: panelStyle,
    ...resolvedPanelProps
  } = panelProps;

  return {
    panelClassName,
    panelRef,
    panelStyle,
    resolvedPanelProps,
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
            onOpenChange={(nextOpen) => {
              handleOpenChange(nextOpen);
            }}
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
    <CollapsiblePrimitive.Trigger
      nativeButton
      render={(triggerProps) => {
        const {
          resolvedTriggerProps,
          triggerClassName,
          triggerRef,
          triggerStyle,
        } = resolveTriggerProps(triggerProps);

        return (
          <motion.button
            {...resolvedTriggerProps}
            className={cn(
              "flex w-full items-center justify-between gap-4 py-3 text-left text-foreground transition-[color,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
              triggerClassName,
              className
            )}
            ref={(node) => {
              setRef(triggerRef, node);
              setRef(ref, node);
            }}
            style={triggerStyle}
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
        );
      }}
    />
  );
});

CollapsibleTrigger.displayName = "CollapsibleTrigger";

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  DivHTMLAttributesForMotion
>(({ children, className, ...props }, ref) => {
  const { open, reduceMotion } = useCollapsibleContext();

  return (
    <CollapsiblePrimitive.Panel
      keepMounted
      render={(panelProps) => {
        const { panelClassName, panelRef, panelStyle, resolvedPanelProps } =
          resolvePanelProps(panelProps);

        return (
          <motion.div
            {...resolvedPanelProps}
            animate={getContentAnimate(open, reduceMotion)}
            aria-hidden={!open}
            className={cn(
              "origin-top overflow-hidden will-change-[height,opacity,clip-path]",
              panelClassName,
              className
            )}
            inert={open ? undefined : true}
            initial={false}
            ref={(node) => {
              setRef(panelRef, node);
              setRef(ref, node);
            }}
            style={panelStyle}
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
        );
      }}
    />
  );
});

CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
