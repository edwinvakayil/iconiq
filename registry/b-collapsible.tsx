"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { ChevronDown } from "lucide-react";
import { motion, type Transition, useReducedMotion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

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

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(
  null
);

const triggerPressTransition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 30,
  mass: 0.7,
};

const expandSpring = {
  type: "spring" as const,
  stiffness: 150,
  damping: 26,
  mass: 1.05,
};

const collapseSpring = {
  type: "spring" as const,
  stiffness: 190,
  damping: 30,
  mass: 1.1,
};

const contentEase = [0.16, 1, 0.3, 1] as const;

const iconTransition = {
  type: "spring" as const,
  stiffness: 360,
  damping: 24,
  mass: 0.66,
};

const instantTransition: Transition = { duration: 0.01 };

const defaultContentCopyClassName =
  "space-y-3 pr-8 pb-3 text-sm leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_li+li]:mt-1.5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5";

const defaultTriggerClassName =
  "flex w-full items-center justify-between gap-4 py-3 text-left text-foreground transition-[color,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T) => {
    for (const ref of refs) {
      setRef(ref, value);
    }
  };
}

function getSingleChild(
  children: React.ReactNode,
  componentName: string
): React.ReactElement<Record<string, unknown>> {
  const child = React.Children.only(children);

  if (!React.isValidElement(child)) {
    throw new Error(
      `${componentName} with asChild expects a single React element child.`
    );
  }

  return child as React.ReactElement<Record<string, unknown>>;
}

function useCollapsibleContext() {
  const context = React.useContext(CollapsibleContext);

  if (!context) {
    throw new Error("Collapsible parts must be used within Collapsible.");
  }

  return context;
}

function getHeightTransition(reduceMotion: boolean, isOpen: boolean) {
  if (reduceMotion) {
    return instantTransition;
  }

  return isOpen ? expandSpring : collapseSpring;
}

function getContentTransition(reduceMotion: boolean, isOpen: boolean) {
  if (reduceMotion) {
    return instantTransition;
  }

  return {
    opacity: {
      duration: isOpen ? 0.28 : 0.18,
      ease: contentEase,
      delay: isOpen ? 0.04 : 0,
    },
    y: isOpen ? expandSpring : collapseSpring,
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

function mergeClickHandlers(
  ...handlers: Array<React.MouseEventHandler<HTMLButtonElement> | undefined>
) {
  return (event: React.MouseEvent<HTMLButtonElement>) => {
    for (const handler of handlers) {
      handler?.(event);
    }
  };
}

export interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Disables trigger interaction. */
  disabled?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Controlled open state. */
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
      ...props
    },
    ref
  ) => {
    const reduceMotion = useReducedMotion() === true;
    const isControlled = openProp !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const open = isControlled ? openProp : uncontrolledOpen;

    const handleOpenChange = React.useCallback(
      (nextOpen: boolean) => {
        if (!isControlled) {
          setUncontrolledOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);
      },
      [isControlled, onOpenChange]
    );

    const contextValue = React.useMemo(
      () => ({ disabled, open, reduceMotion }),
      [disabled, open, reduceMotion]
    );

    return (
      <CollapsibleContext.Provider value={contextValue}>
        <CollapsiblePrimitive.Root
          {...props}
          className={cn(
            componentThemeClassName,
            "block w-full min-w-0 overflow-hidden border-border border-b bg-transparent",
            className
          )}
          disabled={disabled}
          onOpenChange={handleOpenChange}
          open={open}
          ref={ref}
        >
          {children}
        </CollapsiblePrimitive.Root>
      </CollapsibleContext.Provider>
    );
  }
);

Collapsible.displayName = "Collapsible";

export interface CollapsibleTriggerProps extends ButtonHTMLAttributesForMotion {
  /** Merge trigger semantics onto the child element instead of rendering a button. */
  asChild?: boolean;
  /** Custom indicator node. Defaults to a chevron. */
  icon?: React.ReactNode;
  /** Indicator position when using the default trigger layout. */
  iconPosition?: "start" | "end";
  /** Show the built-in indicator. Ignored when `asChild` is true. */
  showIcon?: boolean;
}

function CollapsibleTriggerIcon({
  icon,
  open,
  reduceMotion,
}: {
  icon?: React.ReactNode;
  open: boolean;
  reduceMotion: boolean;
}) {
  return (
    <motion.span
      animate={
        reduceMotion
          ? undefined
          : {
              rotate: open ? 180 : 0,
              scale: open ? 1.04 : 1,
              y: open ? 1 : 0,
            }
      }
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center text-muted-foreground"
      transition={iconTransition}
    >
      {icon ?? (
        <ChevronDown aria-hidden className="h-4 w-4" strokeWidth={2.2} />
      )}
    </motion.span>
  );
}

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  CollapsibleTriggerProps
>(
  (
    {
      asChild = false,
      children,
      className,
      icon,
      iconPosition = "end",
      onClick,
      showIcon = true,
      type = "button",
      ...props
    },
    ref
  ) => {
    const { disabled, open, reduceMotion } = useCollapsibleContext();

    return (
      <CollapsiblePrimitive.Trigger
        nativeButton={!asChild}
        render={(triggerProps) => {
          const {
            resolvedTriggerProps,
            triggerClassName,
            triggerRef,
            triggerStyle,
          } = resolveTriggerProps(triggerProps);

          if (asChild) {
            const child = getSingleChild(children, "CollapsibleTrigger");
            const childProps = child.props;

            return React.cloneElement(child, {
              ...childProps,
              ...props,
              className: cn(
                triggerClassName,
                childProps.className as string | undefined,
                className
              ),
              disabled: disabled || resolvedTriggerProps.disabled,
              onClick: mergeClickHandlers(
                childProps.onClick as
                  | React.MouseEventHandler<HTMLButtonElement>
                  | undefined,
                resolvedTriggerProps.onClick,
                onClick
              ),
              ref: mergeRefs(
                triggerRef,
                ref,
                childProps.ref as React.Ref<HTMLButtonElement> | undefined
              ),
              style: {
                ...(childProps.style as React.CSSProperties),
                ...triggerStyle,
              },
            });
          }

          const indicator = showIcon ? (
            <CollapsibleTriggerIcon
              icon={icon}
              open={open}
              reduceMotion={reduceMotion}
            />
          ) : null;

          return (
            <motion.button
              {...props}
              {...resolvedTriggerProps}
              className={cn(
                defaultTriggerClassName,
                triggerClassName,
                className
              )}
              disabled={disabled || resolvedTriggerProps.disabled}
              onClick={mergeClickHandlers(
                resolvedTriggerProps.onClick,
                onClick
              )}
              ref={mergeRefs(triggerRef, ref)}
              style={triggerStyle}
              transition={triggerPressTransition}
              type={type}
              whileTap={
                disabled
                  ? undefined
                  : { scale: 0.992, y: 0, transition: triggerPressTransition }
              }
            >
              {showIcon && iconPosition === "start" ? indicator : null}
              <span className="min-w-0 flex-1 font-medium text-[15px] leading-6 tracking-[-0.01em]">
                {children}
              </span>
              {showIcon && iconPosition === "end" ? indicator : null}
            </motion.button>
          );
        }}
      />
    );
  }
);

CollapsibleTrigger.displayName = "CollapsibleTrigger";

export interface CollapsibleContentProps extends DivHTMLAttributesForMotion {
  /** Merge panel semantics onto the child element instead of rendering animated wrappers. */
  asChild?: boolean;
  /** Classes for the inner content wrapper. Ignored when `asChild` is true. */
  contentClassName?: string;
  /** Keep content mounted while closed so exit animation can run. */
  forceMount?: boolean;
}

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  CollapsibleContentProps
>(
  (
    {
      asChild = false,
      children,
      className,
      contentClassName,
      forceMount = true,
      ...props
    },
    ref
  ) => {
    const { reduceMotion } = useCollapsibleContext();

    return (
      <CollapsiblePrimitive.Panel
        keepMounted={forceMount}
        render={(panelProps, state) => {
          const isOpen = state.open;
          const { panelClassName, panelRef, panelStyle, resolvedPanelProps } =
            resolvePanelProps(panelProps);

          if (asChild) {
            const child = getSingleChild(children, "CollapsibleContent");
            const childProps = child.props;

            return React.cloneElement(child, {
              ...childProps,
              ...props,
              ...resolvedPanelProps,
              "aria-hidden": !isOpen,
              className: cn(
                panelClassName,
                childProps.className as string | undefined,
                className
              ),
              inert: isOpen ? undefined : true,
              ref: mergeRefs(
                panelRef,
                ref,
                childProps.ref as React.Ref<HTMLDivElement> | undefined
              ),
              style: {
                ...(childProps.style as React.CSSProperties),
                ...panelStyle,
              },
            });
          }

          return (
            <div
              {...resolvedPanelProps}
              className={cn("overflow-hidden", panelClassName, className)}
              ref={panelRef}
              style={panelStyle}
            >
              <motion.div
                animate={{ height: isOpen ? "auto" : 0 }}
                className="overflow-hidden"
                initial={false}
                transition={getHeightTransition(reduceMotion, isOpen)}
              >
                <motion.div
                  {...props}
                  animate={{
                    opacity: isOpen ? 1 : 0,
                    y: isOpen || reduceMotion ? 0 : -4,
                  }}
                  aria-hidden={!isOpen}
                  className={cn(defaultContentCopyClassName, contentClassName)}
                  inert={isOpen ? undefined : true}
                  initial={false}
                  ref={ref}
                  transition={getContentTransition(reduceMotion, isOpen)}
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          );
        }}
      />
    );
  }
);

CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
