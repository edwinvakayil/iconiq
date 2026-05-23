"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { registryTheme } from "@/lib/registry-theme";
import { cn } from "@/lib/utils";

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

  return {
    type: "spring" as const,
    stiffness: 300,
    damping: 28,
    mass: 0.78,
  };
}

function getInnerTransition(reduceMotion: boolean) {
  if (reduceMotion) {
    return {
      duration: 0.14,
      ease: settleEase,
    };
  }

  return {
    type: "spring" as const,
    stiffness: 320,
    damping: 26,
    mass: 0.72,
  };
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

function getContentAnimate(open: boolean) {
  return {
    height: open ? "auto" : 0,
    opacity: open ? 1 : 0,
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
    opacity: open ? 1 : 0,
    y: open ? 0 : -8,
    filter: open ? "blur(0px)" : "blur(4px)",
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
              registryTheme,
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
            whileHover={
              disabled || reduceMotion
                ? undefined
                : { y: -1, transition: triggerPressTransition }
            }
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
            animate={getContentAnimate(open)}
            className={cn(
              "overflow-hidden transition-[height] duration-[1ms]",
              panelClassName,
              className
            )}
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
              animate={getInnerAnimate(open, reduceMotion)}
              className="pr-8 pb-3 text-muted-foreground text-sm leading-6"
              initial={false}
              transition={getInnerTransition(reduceMotion)}
            >
              {children}
            </motion.div>
          </motion.div>
        );
      }}
    />
  );
});

CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
