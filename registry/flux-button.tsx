"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { animate, motion, useMotionValue } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonThemeClassName =
  "[--button-destructive:#dc2626] [--button-input:#e3e7ec] [--button-primary-foreground:#ffffff] [--button-ring:rgba(17,17,17,0.16)] [--button-ripple:color-mix(in_oklch,var(--foreground),transparent_52%)] [--button-secondary:#eceff3] [--button-secondary-foreground:#111111] dark:[--button-destructive:#f87171] dark:[--button-input:#2b2a25] dark:[--button-primary-foreground:#111111] dark:[--button-ring:rgba(246,243,236,0.18)] dark:[--button-ripple:color-mix(in_oklch,var(--foreground),transparent_30%)] dark:[--button-secondary:#2a2a27] dark:[--button-secondary-foreground:#f6f3ec]";

const SUCCESS_HOLD_MS = 1000;

const FLUID_WIDTH = {
  type: "spring" as const,
  stiffness: 210,
  damping: 28,
  mass: 1.08,
};

const FLUID_CONTENT = {
  type: "spring" as const,
  stiffness: 340,
  damping: 32,
  mass: 0.92,
};

const FLUID_ICON = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
  mass: 0.76,
};

const FLUID_REVEAL = {
  type: "spring" as const,
  stiffness: 260,
  damping: 30,
  mass: 0.98,
};

const FLUID_TAP = {
  type: "spring" as const,
  stiffness: 520,
  damping: 34,
  mass: 0.72,
};

const NO_TRANSITION = { duration: 0 } as const;

type FlowPhase = "idle" | "loading" | "success" | "shrinking";

function getWidthTarget(
  phase: FlowPhase,
  widths: { idle: number; loading: number; success: number }
) {
  switch (phase) {
    case "loading":
      return widths.loading;
    case "success":
      return widths.success;
    default:
      return widths.idle;
  }
}

const SIZE_METRICS = {
  xs: { height: 24, paddingX: 8 },
  sm: { height: 28, paddingX: 10 },
  default: { height: 32, paddingX: 10 },
  lg: { height: 40, paddingX: 16 },
} as const;

const LINK_PADDING_X = {
  xs: 6,
  sm: 8,
  default: 8,
  lg: 10,
} as const;

const ICON_SLOT_CLASS = {
  xs: "size-3",
  sm: "size-3.5",
  default: "size-4",
  lg: "size-4",
} as const;

const BUSY_GAP_CLASS = {
  xs: "gap-1",
  sm: "gap-1",
  default: "gap-1.5",
  lg: "gap-1.5",
} as const;

const SHRINK_FALLBACK_MS = 900;

const fluxButtonVariants = cva(
  cn(
    buttonThemeClassName,
    "relative inline-flex shrink-0 cursor-pointer touch-manipulation select-none items-center justify-center overflow-hidden whitespace-nowrap rounded-lg border border-transparent bg-clip-padding font-medium text-sm no-underline outline-none [-webkit-tap-highlight-color:transparent] focus-visible:border-[color:var(--button-ring)] focus-visible:ring-3 focus-visible:ring-[color:color-mix(in_oklch,var(--button-ring),transparent_50%)] active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
  ),
  {
    variants: {
      variant: {
        default:
          "visited:!text-primary-foreground hover:!text-primary-foreground focus-visible:!text-primary-foreground active:!text-primary-foreground bg-primary text-primary-foreground hover:bg-primary dark:[--button-ripple:color-mix(in_oklch,#111111,transparent_10%)] [&_svg]:text-primary-foreground",
        outline:
          "visited:!text-foreground hover:!text-foreground focus-visible:!text-foreground active:!text-foreground border-border bg-background text-foreground hover:bg-accent/60 dark:border-[color:var(--button-input)] dark:bg-[color-mix(in_oklch,var(--button-input),transparent_70%)] dark:hover:bg-[color-mix(in_oklch,var(--button-input),transparent_50%)]",
        secondary:
          "visited:!text-[color:var(--button-secondary-foreground)] hover:!text-[color:var(--button-secondary-foreground)] focus-visible:!text-[color:var(--button-secondary-foreground)] active:!text-[color:var(--button-secondary-foreground)] bg-[color:var(--button-secondary)] text-[color:var(--button-secondary-foreground)] hover:bg-[color-mix(in_oklch,var(--button-secondary),var(--foreground)_7%)] dark:hover:bg-[color-mix(in_oklch,var(--button-secondary),var(--foreground)_11%)] [&_svg]:text-[color:var(--button-secondary-foreground)]",
        ghost:
          "visited:!text-foreground hover:!text-foreground focus-visible:!text-foreground active:!text-foreground text-foreground hover:bg-accent/60 dark:hover:bg-muted/50",
        destructive:
          "visited:!text-[color:var(--button-destructive)] hover:!text-[color:var(--button-destructive)] focus-visible:!text-[color:var(--button-destructive)] active:!text-[color:var(--button-destructive)] bg-[color-mix(in_oklch,var(--button-destructive),transparent_90%)] text-[color:var(--button-destructive)] hover:bg-[color-mix(in_oklch,var(--button-destructive),transparent_80%)] focus-visible:border-[color:color-mix(in_oklch,var(--button-destructive),transparent_60%)] focus-visible:ring-[color:color-mix(in_oklch,var(--button-destructive),transparent_80%)] dark:bg-[color-mix(in_oklch,var(--button-destructive),transparent_80%)] dark:focus-visible:ring-[color:color-mix(in_oklch,var(--button-destructive),transparent_60%)] dark:hover:bg-[color-mix(in_oklch,var(--button-destructive),transparent_70%)]",
        link: "visited:!text-foreground hover:!text-foreground focus-visible:!text-foreground text-foreground underline-offset-4 shadow-none hover:underline active:translate-y-0",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-1.5 px-4 text-base leading-5 has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5",
      },
    },
    compoundVariants: [
      {
        variant: "link",
        size: "default",
        class: "h-8 px-2 text-sm leading-5",
      },
      {
        variant: "link",
        size: "lg",
        class: "h-10 px-2.5 text-base leading-5",
      },
      {
        variant: "link",
        size: "sm",
        class: "h-7 px-2 text-[0.8rem]",
      },
      {
        variant: "link",
        size: "xs",
        class: "h-6 px-1.5 text-xs",
      },
    ],
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

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

type ButtonRenderProps = React.HTMLAttributes<HTMLButtonElement> & {
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
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

function resolvePrimitiveButtonProps(buttonProps: ButtonRenderProps) {
  const {
    children: _buttonChildren,
    className: primitiveClassName,
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
    ref: primitiveRef,
    style: primitiveStyle,
    ...resolvedButtonProps
  } = buttonProps;

  return {
    primitiveClassName,
    primitiveRef,
    primitiveStyle,
    resolvedButtonProps,
  };
}

type FluxButtonProps = Omit<ButtonHTMLAttributesForMotion, "type"> &
  VariantProps<typeof fluxButtonVariants> & {
    idleLabel: string;
    loadingLabel: string;
    successLabel: string;
    successIcon?: React.ReactNode;
    onAction: () => void | Promise<void>;
    successHold?: number;
    type?: "button" | "submit";
  };

function getLayoutMetrics(
  size: NonNullable<FluxButtonProps["size"]>,
  variant: NonNullable<FluxButtonProps["variant"]>
) {
  const metrics = SIZE_METRICS[size];

  return {
    height: metrics.height,
    paddingX: variant === "link" ? LINK_PADDING_X[size] : metrics.paddingX,
  };
}

function useMeasuredWidths(paddingX: number, minWidth: number) {
  const measureRef = React.useRef<HTMLDivElement>(null);
  const [widths, setWidths] = React.useState({
    idle: minWidth,
    loading: minWidth,
    success: minWidth,
  });

  React.useLayoutEffect(() => {
    const root = measureRef.current;
    if (!root) {
      return;
    }

    const readWidth = (selector: string) => {
      const node = root.querySelector<HTMLElement>(selector);
      return Math.max(minWidth, (node?.offsetWidth ?? 0) + paddingX * 2);
    };

    const measure = () => {
      setWidths({
        idle: readWidth('[data-width="idle"]'),
        loading: readWidth('[data-width="loading"]'),
        success: readWidth('[data-width="success"]'),
      });
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(root);

    return () => resizeObserver.disconnect();
  }, [minWidth, paddingX]);

  return { measureRef, widths };
}

type FlowContentProps = {
  animateEnabled: boolean;
  labels: { idle: string; loading: string; success: string };
  phase: FlowPhase;
  size: NonNullable<FluxButtonProps["size"]>;
  successIcon?: React.ReactNode;
};

function useFlowContentMotion(animateEnabled: boolean, phase: FlowPhase) {
  const motionEnabled = animateEnabled;
  const contentTransition = motionEnabled ? FLUID_CONTENT : NO_TRANSITION;
  const iconTransition = motionEnabled ? FLUID_ICON : NO_TRANSITION;
  const shrinkTransition = motionEnabled ? FLUID_REVEAL : NO_TRANSITION;
  const isShrinking = phase === "shrinking";

  return {
    contentTransition,
    iconTransition,
    idleTransition: isShrinking ? shrinkTransition : contentTransition,
    busyTransition: isShrinking ? NO_TRANSITION : contentTransition,
  };
}

function FlowIdleLayer({
  idleLabel,
  idleOpacity,
  idleTransition,
  isIdle,
  isShrinking,
}: {
  idleLabel: string;
  idleOpacity: number;
  idleTransition:
    | typeof FLUID_CONTENT
    | typeof FLUID_REVEAL
    | typeof NO_TRANSITION;
  isIdle: boolean;
  isShrinking: boolean;
}) {
  return (
    <motion.span
      animate={{ opacity: idleOpacity }}
      aria-hidden={!(isIdle || isShrinking)}
      className="absolute inset-0 inline-flex items-center justify-center whitespace-nowrap"
      initial={false}
      style={{ pointerEvents: "none", zIndex: idleOpacity > 0.5 ? 1 : 0 }}
      transition={idleTransition}
    >
      {idleLabel}
    </motion.span>
  );
}

function FlowIconSlot({
  iconSlotClassName,
  iconTransition,
  isLoading,
  isSuccess,
  showSuccessIcon,
  successIcon,
}: {
  iconSlotClassName: string;
  iconTransition: typeof FLUID_ICON | typeof NO_TRANSITION;
  isLoading: boolean;
  isSuccess: boolean;
  showSuccessIcon: boolean;
  successIcon?: React.ReactNode;
}) {
  return (
    <span
      className={cn("relative shrink-0 [&_svg]:size-[1em]", iconSlotClassName)}
    >
      <motion.span
        animate={{
          opacity: isLoading ? 1 : 0,
          rotate: isLoading ? 0 : 72,
          scale: isLoading ? 1 : 0.82,
        }}
        aria-hidden={!isLoading}
        className="absolute inset-0 inline-flex items-center justify-center"
        initial={false}
        transition={iconTransition}
      >
        <Loader2
          aria-hidden
          className={cn(iconSlotClassName, isLoading && "animate-spin")}
        />
      </motion.span>

      {showSuccessIcon ? (
        <motion.span
          animate={{
            opacity: isSuccess ? 1 : 0,
            rotate: isSuccess ? 0 : -72,
            scale: isSuccess ? 1 : 0.82,
          }}
          aria-hidden={!isSuccess}
          className="absolute inset-0 inline-flex items-center justify-center"
          initial={false}
          transition={iconTransition}
        >
          {successIcon}
        </motion.span>
      ) : null}
    </span>
  );
}

function FlowBusyLabels({
  contentTransition,
  isLoading,
  isSuccess,
  loadingLabel,
  successLabel,
}: {
  contentTransition: typeof FLUID_CONTENT | typeof NO_TRANSITION;
  isLoading: boolean;
  isSuccess: boolean;
  loadingLabel: string;
  successLabel: string;
}) {
  return (
    <span className="relative inline-grid [grid-template-columns:max-content] [grid-template-rows:1.25em]">
      <motion.span
        animate={{ opacity: isLoading ? 1 : 0 }}
        aria-hidden={!isLoading}
        className="col-start-1 row-start-1 inline-flex items-center whitespace-nowrap"
        initial={false}
        style={{ zIndex: isLoading ? 1 : 0 }}
        transition={contentTransition}
      >
        {loadingLabel}
      </motion.span>
      <motion.span
        animate={{ opacity: isSuccess ? 1 : 0 }}
        aria-hidden={!isSuccess}
        className="col-start-1 row-start-1 inline-flex items-center whitespace-nowrap"
        initial={false}
        style={{ zIndex: isSuccess ? 1 : 0 }}
        transition={contentTransition}
      >
        {successLabel}
      </motion.span>
    </span>
  );
}

function FlowContent({
  animateEnabled,
  labels,
  phase,
  size,
  successIcon,
}: FlowContentProps) {
  const { busyTransition, contentTransition, iconTransition, idleTransition } =
    useFlowContentMotion(animateEnabled, phase);

  const isIdle = phase === "idle";
  const isShrinking = phase === "shrinking";
  const isLoading = phase === "loading";
  const isSuccess = phase === "success";
  const isBusy = isLoading || isSuccess;
  const showSuccessIcon = Boolean(successIcon);
  const showIconSlot = isLoading || (isSuccess && showSuccessIcon);
  const iconSlotClassName = ICON_SLOT_CLASS[size];
  const busyGapClassName = BUSY_GAP_CLASS[size];
  const idleOpacity = isIdle || isShrinking ? 1 : 0;
  const busyOpacity = isBusy ? 1 : 0;

  return (
    <span className="relative h-[1.25em] w-full leading-none">
      <FlowIdleLayer
        idleLabel={labels.idle}
        idleOpacity={idleOpacity}
        idleTransition={idleTransition}
        isIdle={isIdle}
        isShrinking={isShrinking}
      />

      <motion.span
        animate={{ opacity: busyOpacity }}
        aria-hidden={!isBusy}
        className={cn(
          "absolute inset-0 inline-flex items-center justify-center whitespace-nowrap",
          showIconSlot && busyGapClassName
        )}
        initial={false}
        style={{ pointerEvents: "none", zIndex: busyOpacity > 0.5 ? 1 : 0 }}
        transition={busyTransition}
      >
        {showIconSlot ? (
          <FlowIconSlot
            iconSlotClassName={iconSlotClassName}
            iconTransition={iconTransition}
            isLoading={isLoading}
            isSuccess={isSuccess}
            showSuccessIcon={showSuccessIcon}
            successIcon={successIcon}
          />
        ) : null}

        <FlowBusyLabels
          contentTransition={contentTransition}
          isLoading={isLoading}
          isSuccess={isSuccess}
          loadingLabel={labels.loading}
          successLabel={labels.success}
        />
      </motion.span>
    </span>
  );
}

const FluxButton = React.forwardRef<HTMLButtonElement, FluxButtonProps>(
  (
    {
      className,
      disabled = false,
      idleLabel,
      loadingLabel,
      onAction,
      onClick,
      onKeyDown,
      onPointerDown,
      size = "default",
      successHold = SUCCESS_HOLD_MS,
      successIcon,
      successLabel,
      type = "button",
      variant = "default",
      ...props
    },
    ref
  ) => {
    const resetTimeoutRef = React.useRef<number | null>(null);
    const widthAnimationRef = React.useRef<ReturnType<typeof animate> | null>(
      null
    );
    const mountedRef = React.useRef(true);
    const phaseRef = React.useRef<FlowPhase>("idle");
    const actionGenerationRef = React.useRef(0);
    const onActionRef = React.useRef(onAction);
    const [hasInteracted, setHasInteracted] = React.useState(false);
    const [phase, setPhase] = React.useState<FlowPhase>("idle");

    const resolvedSize = size ?? "default";
    const resolvedVariant = variant ?? "default";
    const layout = getLayoutMetrics(resolvedSize, resolvedVariant);
    const initialWidth: number = layout.height;
    const widthMv = useMotionValue(initialWidth);
    const iconSlotClassName = ICON_SLOT_CLASS[resolvedSize];
    const busyGapClassName = BUSY_GAP_CLASS[resolvedSize];
    const resolvedSuccessHold = Math.max(0, successHold);

    phaseRef.current = phase;
    onActionRef.current = onAction;

    const safeSetPhase = React.useCallback((nextPhase: FlowPhase) => {
      if (mountedRef.current) {
        setPhase(nextPhase);
      }
    }, []);

    const labels = React.useMemo(
      () => ({
        idle: idleLabel,
        loading: loadingLabel,
        success: successLabel,
      }),
      [idleLabel, loadingLabel, successLabel]
    );

    const { measureRef, widths } = useMeasuredWidths(
      layout.paddingX,
      layout.height
    );

    const animateEnabled = hasInteracted;
    const isBusy = phase !== "idle";
    const isLocked = Boolean(disabled || isBusy);
    const buttonClassName = cn(
      fluxButtonVariants({ size, variant }),
      isBusy && "pointer-events-none",
      className
    );

    React.useLayoutEffect(() => {
      if (phase !== "idle" && hasInteracted) {
        return;
      }

      widthMv.set(widths.idle);
    }, [hasInteracted, phase, widthMv, widths.idle]);

    React.useEffect(() => {
      const target = getWidthTarget(phase, widths);

      widthAnimationRef.current?.stop();

      const finishShrinking = () => {
        if (phaseRef.current === "shrinking") {
          safeSetPhase("idle");
        }
      };

      if (Math.abs(widthMv.get() - target) < 0.5) {
        widthMv.set(target);
        finishShrinking();
        return;
      }

      if (!animateEnabled) {
        widthMv.set(target);
        finishShrinking();
        return;
      }

      widthAnimationRef.current = animate(widthMv, target, {
        ...FLUID_WIDTH,
        velocity: widthMv.getVelocity(),
      });

      if (phase !== "shrinking") {
        return;
      }

      let cancelled = false;

      widthAnimationRef.current
        .then(() => {
          if (!cancelled) {
            finishShrinking();
          }
        })
        .catch(() => undefined);

      return () => {
        cancelled = true;
        widthAnimationRef.current?.stop();
      };
    }, [animateEnabled, phase, safeSetPhase, widthMv, widths]);

    React.useEffect(() => {
      if (phase !== "shrinking") {
        return;
      }

      const fallback = window.setTimeout(() => {
        safeSetPhase("idle");
      }, SHRINK_FALLBACK_MS);

      return () => window.clearTimeout(fallback);
    }, [phase, safeSetPhase]);

    React.useEffect(() => {
      mountedRef.current = true;

      return () => {
        mountedRef.current = false;

        if (resetTimeoutRef.current !== null) {
          window.clearTimeout(resetTimeoutRef.current);
        }

        widthAnimationRef.current?.stop();
      };
    }, []);

    const beginShrink = React.useCallback(() => {
      safeSetPhase("shrinking");
    }, [safeSetPhase]);

    const runAction = React.useCallback(async () => {
      if (phaseRef.current !== "idle" || disabled) {
        return;
      }

      const generation = actionGenerationRef.current + 1;
      actionGenerationRef.current = generation;

      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }

      setHasInteracted(true);
      safeSetPhase("loading");

      try {
        await onActionRef.current();

        if (!mountedRef.current || actionGenerationRef.current !== generation) {
          return;
        }

        safeSetPhase("success");

        resetTimeoutRef.current = window.setTimeout(() => {
          resetTimeoutRef.current = null;

          if (
            !mountedRef.current ||
            actionGenerationRef.current !== generation
          ) {
            return;
          }

          beginShrink();
        }, resolvedSuccessHold);
      } catch {
        if (!mountedRef.current || actionGenerationRef.current !== generation) {
          return;
        }

        beginShrink();
      }
    }, [beginShrink, disabled, resolvedSuccessHold, safeSetPhase]);

    return (
      <>
        <div
          aria-hidden
          className={cn(
            buttonClassName,
            "pointer-events-none invisible absolute -z-10 inline-flex flex-col whitespace-nowrap"
          )}
          ref={measureRef}
        >
          <span data-width="idle">{labels.idle}</span>
          <span
            className={cn("inline-flex items-center", busyGapClassName)}
            data-width="loading"
          >
            <span className={cn("inline-flex shrink-0", iconSlotClassName)} />
            <span>{labels.loading}</span>
          </span>
          <span
            className={cn(
              "inline-flex items-center",
              successIcon && busyGapClassName
            )}
            data-width="success"
          >
            {successIcon ? (
              <span className={cn("inline-flex shrink-0", iconSlotClassName)} />
            ) : null}
            <span>{labels.success}</span>
          </span>
        </div>

        <ButtonPrimitive
          {...props}
          aria-busy={phase === "loading" || undefined}
          aria-disabled={isLocked || undefined}
          aria-live="polite"
          className={buttonClassName}
          data-slot="button"
          disabled={Boolean(disabled)}
          onClick={(event) => {
            onClick?.(event);
            if (event.defaultPrevented || isLocked) {
              return;
            }
            event.preventDefault();
            runAction().catch(() => undefined);
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (
              event.defaultPrevented ||
              isLocked ||
              event.repeat ||
              (event.key !== " " && event.key !== "Enter")
            ) {
              return;
            }
            if (event.key === " ") {
              event.preventDefault();
            }
            runAction().catch(() => undefined);
          }}
          onPointerDown={onPointerDown}
          render={(buttonProps) => {
            const {
              primitiveClassName,
              primitiveRef,
              primitiveStyle,
              resolvedButtonProps,
            } = resolvePrimitiveButtonProps(buttonProps);

            return (
              <motion.button
                {...resolvedButtonProps}
                className={primitiveClassName}
                ref={(node) => {
                  setRef(primitiveRef, node);
                  setRef(ref, node);
                }}
                style={{
                  ...primitiveStyle,
                  height: layout.height,
                  minWidth: layout.height,
                  width: widthMv,
                }}
                transition={FLUID_TAP}
                type={type}
                whileTap={
                  isLocked || !animateEnabled || variant === "link"
                    ? undefined
                    : { scale: 0.988 }
                }
              >
                <span className="relative z-10 inline-flex w-full items-center justify-center">
                  <FlowContent
                    animateEnabled={hasInteracted}
                    labels={labels}
                    phase={phase}
                    size={resolvedSize}
                    successIcon={successIcon}
                  />
                </span>
              </motion.button>
            );
          }}
          type={type}
        />
      </>
    );
  }
);
FluxButton.displayName = "FluxButton";

export { FluxButton, fluxButtonVariants };
export type { FluxButtonProps };
