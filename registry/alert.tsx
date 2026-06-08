"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion, type Variants } from "motion/react";
import {
  Children,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  createContext,
  type FocusEvent,
  forwardRef,
  isValidElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border border-foreground/8 px-3.5 py-2.5 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      appearance: {
        default: "bg-card text-card-foreground",
        destructive:
          "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current",
        warning:
          "border-amber-200 bg-amber-50 text-amber-950 *:data-[slot=alert-description]:text-stone-600 dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-50 dark:*:data-[slot=alert-description]:text-amber-100/70 [&>svg]:text-amber-900 dark:[&>svg]:text-amber-200",
      },
    },
    defaultVariants: {
      appearance: "default",
    },
  }
);

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

export type AlertPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type AlertVariant = "inline" | "toast";

export type AlertSize = "sm" | "md" | "lg" | "xl";

export const DEFAULT_ALERT_SIZE: AlertSize = "md";

export type AlertAppearance = NonNullable<
  VariantProps<typeof alertVariants>["appearance"]
>;

const ALERT_SIZE_CLASS: Record<AlertSize, string> = {
  sm: "max-w-[320px]",
  md: "max-w-[400px]",
  lg: "max-w-[480px]",
  xl: "max-w-[560px]",
};

const ALERT_TOAST_SIZE_CLASS: Record<AlertSize, string> = {
  sm: "max-w-full sm:max-w-[320px]",
  md: "max-w-full sm:max-w-[400px]",
  lg: "max-w-full sm:max-w-[480px]",
  xl: "max-w-full sm:max-w-[560px]",
};

function resolveAlertWidth({
  size = DEFAULT_ALERT_SIZE,
  width,
  variant,
}: {
  size?: AlertSize;
  width?: string | number;
  variant: AlertVariant;
}): { className?: string; style?: CSSProperties } {
  if (width !== undefined && width !== "") {
    const maxWidth =
      typeof width === "number"
        ? width > 0
          ? `${width}px`
          : undefined
        : width.trim();

    if (!maxWidth) {
      return {
        className:
          variant === "toast"
            ? ALERT_TOAST_SIZE_CLASS[size]
            : ALERT_SIZE_CLASS[size],
      };
    }

    return {
      className: "max-w-full",
      style: { maxWidth },
    };
  }

  return {
    className:
      variant === "toast"
        ? ALERT_TOAST_SIZE_CLASS[size]
        : ALERT_SIZE_CLASS[size],
  };
}

type AlertContextValue = {
  descriptionId: string;
  hasIcon: boolean;
  titleId: string;
};

const AlertContext = createContext<AlertContextValue | null>(null);

function getComponentDisplayName(type: unknown) {
  if (typeof type === "function" || typeof type === "object") {
    return (type as { displayName?: string }).displayName;
  }

  return undefined;
}

type MotionDivProps = ComponentPropsWithoutRef<typeof motion.div>;

export interface AlertProps
  extends Omit<MotionDivProps, "title">,
    VariantProps<typeof alertVariants> {
  children?: ReactNode;
  /** Leading graphic (e.g. a Lucide icon). You control markup and sizing. */
  icon?: ReactNode;
  title?: ReactNode;
  message?: ReactNode;
  /** Optional action row rendered below the message. */
  action?: ReactNode;
  dismissible?: boolean;
  /** Preset max width. Defaults to md (400px). */
  size?: AlertSize;
  /** Custom max width. Pass a CSS length such as "28rem" or a pixel number. Overrides size when set. */
  width?: string | number;
  /** Explicitly choose inline flow or viewport toast behavior. */
  variant?: AlertVariant;
  position?: AlertPosition;
  /** Auto-dismiss after this many milliseconds. Defaults to 5 000. Pass 0 to disable. */
  timeout?: number;
  onDismiss?: () => void;
}

export interface AlertTitleProps extends MotionDivProps {
  children?: ReactNode;
}

export interface AlertDescriptionProps extends MotionDivProps {
  children?: ReactNode;
}

const DEFAULT_TOAST_POSITION: AlertPosition = "top-right";

/**
 * Mobile-first: every positioned alert sits at the top of the viewport,
 * spanning the full width minus safe margins (inset-x-4). At the sm
 * breakpoint the requested corner takes over.
 */
const positionClasses: Record<AlertPosition, string> = {
  "top-left": "fixed top-4 inset-x-4 sm:inset-x-auto sm:left-4 sm:right-auto",
  "top-center":
    "fixed top-4 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2",
  "top-right": "fixed top-4 inset-x-4 sm:inset-x-auto sm:left-auto sm:right-4",
  "bottom-left":
    "fixed top-4 inset-x-4 sm:inset-x-auto sm:top-auto sm:bottom-4 sm:left-4 sm:right-auto",
  "bottom-center":
    "fixed top-4 inset-x-4 sm:inset-x-auto sm:top-auto sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2",
  "bottom-right":
    "fixed top-4 inset-x-4 sm:inset-x-auto sm:top-auto sm:bottom-4 sm:left-auto sm:right-4",
};

/** Vertical travel only — kept small so motion reads as a drift, not a snap. */
function getAlertMotionOffset(position?: AlertPosition): { y: number } {
  if (!position) {
    return { y: 6 };
  }

  return position.startsWith("top") ? { y: -8 } : { y: 8 };
}

const FLUID_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const FLUID_EXIT_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

function getContainerVariants(position?: AlertPosition): Variants {
  const { y: dy } = getAlertMotionOffset(position);

  return {
    hidden: {
      opacity: 0,
      y: dy,
      scale: 0.982,
      filter: "blur(3px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        opacity: { duration: 0.42, ease: FLUID_EASE },
        y: { duration: 0.48, ease: FLUID_EASE },
        scale: { duration: 0.48, ease: FLUID_EASE },
        filter: { duration: 0.52, ease: FLUID_EASE },
        staggerChildren: 0.055,
        delayChildren: 0.12,
      },
    },
    exit: {
      opacity: 0,
      y: dy * 0.55,
      scale: 0.986,
      filter: "blur(2px)",
      transition: {
        opacity: { duration: 0.3, ease: FLUID_EXIT_EASE },
        y: { duration: 0.34, ease: FLUID_EXIT_EASE },
        scale: { duration: 0.32, ease: FLUID_EXIT_EASE },
        filter: { duration: 0.28, ease: FLUID_EXIT_EASE },
      },
    },
  };
}

/** Text drifts in softly while the container handles exit motion. */
const childVariants: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: FLUID_EASE },
  },
};

/** Icon eases in with the same fluid curve as the container. */
const iconVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.44, ease: FLUID_EASE, delay: 0.1 },
  },
};

const AlertTitle = forwardRef<HTMLDivElement, AlertTitleProps>(
  ({ children, className, id, ...props }, ref) => {
    const context = useContext(AlertContext);

    return (
      <motion.div
        className={cn(
          "line-clamp-1 min-h-4 font-medium tracking-tight",
          context?.hasIcon ? "col-start-2" : "col-start-1",
          className
        )}
        data-slot="alert-title"
        id={id ?? context?.titleId}
        ref={ref}
        variants={childVariants}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

AlertTitle.displayName = "AlertTitle";

const AlertDescription = forwardRef<HTMLDivElement, AlertDescriptionProps>(
  ({ children, className, id, ...props }, ref) => {
    const context = useContext(AlertContext);

    return (
      <motion.div
        className={cn(
          "grid justify-items-start gap-1 text-muted-foreground text-sm [&_p]:leading-relaxed",
          context?.hasIcon ? "col-start-2" : "col-start-1",
          className
        )}
        data-slot="alert-description"
        id={id ?? context?.descriptionId}
        ref={ref}
        variants={childVariants}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

AlertDescription.displayName = "AlertDescription";

function isAlertTitleChild(child: ReactNode) {
  if (!isValidElement(child)) {
    return false;
  }

  return (
    child.type === AlertTitle ||
    getComponentDisplayName(child.type) === AlertTitle.displayName
  );
}

function isAlertDescriptionChild(child: ReactNode) {
  if (!isValidElement(child)) {
    return false;
  }

  return (
    child.type === AlertDescription ||
    getComponentDisplayName(child.type) === AlertDescription.displayName
  );
}

function isAlertTextChild(child: ReactNode) {
  return isAlertTitleChild(child) || isAlertDescriptionChild(child);
}

function splitAlertChildren(children: ReactNode) {
  const childArray = Children.toArray(children);
  const [firstChild, ...remainingChildren] = childArray;

  if (firstChild && !isAlertTextChild(firstChild)) {
    return {
      contentChildren: remainingChildren,
      leadingIcon: firstChild,
    };
  }

  return {
    contentChildren: childArray,
    leadingIcon: null,
  };
}

function useAlertLifecycle(timeout: number, onDismiss?: () => void) {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const [isDocumentHidden, setIsDocumentHidden] = useState(false);
  const timeoutIdRef = useRef<number | null>(null);
  const remainingTimeRef = useRef(timeout);
  const timerStartedAtRef = useRef<number | null>(null);
  const dismissalRequestedRef = useRef(false);
  const previousTimeoutRef = useRef(timeout);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentHidden(document.hidden);
    };

    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const clearTimer = useCallback(() => {
    if (timeoutIdRef.current !== null) {
      window.clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }

    timerStartedAtRef.current = null;
  }, []);

  const requestDismiss = useCallback(() => {
    if (dismissalRequestedRef.current) {
      return;
    }

    dismissalRequestedRef.current = true;
    clearTimer();
    setVisible(false);
  }, [clearTimer]);

  const pauseTimer = useCallback(() => {
    if (timeoutIdRef.current === null || timerStartedAtRef.current === null) {
      return;
    }

    const elapsed = Date.now() - timerStartedAtRef.current;
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    clearTimer();
  }, [clearTimer]);

  const startTimer = useCallback(() => {
    if (remainingTimeRef.current <= 0) {
      if (timeoutIdRef.current === null) {
        requestDismiss();
      }

      return;
    }

    if (timeoutIdRef.current !== null) {
      return;
    }

    timerStartedAtRef.current = Date.now();
    timeoutIdRef.current = window.setTimeout(() => {
      clearTimer();
      requestDismiss();
    }, remainingTimeRef.current);
  }, [clearTimer, requestDismiss]);

  useEffect(() => {
    if (previousTimeoutRef.current === timeout) {
      return;
    }

    previousTimeoutRef.current = timeout;
    clearTimer();
    remainingTimeRef.current = timeout;

    if (
      visible &&
      timeout > 0 &&
      !(isHovered || isFocusWithin || isDocumentHidden)
    ) {
      startTimer();
    }
  }, [
    clearTimer,
    isDocumentHidden,
    isFocusWithin,
    isHovered,
    startTimer,
    timeout,
    visible,
  ]);

  useEffect(() => {
    if (!visible || timeout <= 0) {
      clearTimer();
      return;
    }

    if (isHovered || isFocusWithin || isDocumentHidden) {
      pauseTimer();
      return;
    }

    startTimer();
  }, [
    clearTimer,
    isDocumentHidden,
    isFocusWithin,
    isHovered,
    pauseTimer,
    startTimer,
    timeout,
    visible,
  ]);

  useEffect(() => clearTimer, [clearTimer]);

  const handleBlurCapture = (event: FocusEvent<HTMLDivElement>) => {
    const nextFocusedNode = event.relatedTarget;

    if (
      nextFocusedNode instanceof Node &&
      event.currentTarget.contains(nextFocusedNode)
    ) {
      return;
    }

    setIsFocusWithin(false);
  };

  const handleExitComplete = useCallback(() => {
    if (!dismissalRequestedRef.current) {
      return;
    }

    onDismiss?.();
  }, [onDismiss]);

  return {
    handleBlurCapture,
    handleExitComplete,
    mounted,
    requestDismiss,
    setIsFocusWithin,
    setIsHovered,
    visible,
  };
}

function AlertIcon({ children }: { children: ReactNode }) {
  if (!children) {
    return null;
  }

  return (
    <motion.div
      className="col-start-1 row-start-1 shrink-0 [&_svg]:size-4 [&_svg]:translate-y-0.5 [&_svg]:text-current"
      variants={iconVariants}
    >
      {children}
    </motion.div>
  );
}

function getDismissButtonClasses(
  appearance?: VariantProps<typeof alertVariants>["appearance"]
) {
  switch (appearance) {
    case "warning":
      return "text-amber-900/40 hover:text-amber-900 dark:text-amber-100/45 dark:hover:text-amber-100";
    case "destructive":
      return "text-destructive/40 hover:text-destructive";
    default:
      return "text-foreground/35 hover:text-foreground/70";
  }
}

function AlertDismissButton({
  appearance,
  className,
  onDismiss,
  show,
}: {
  appearance?: VariantProps<typeof alertVariants>["appearance"];
  className?: string;
  onDismiss: () => void;
  show: boolean;
}) {
  if (!show) {
    return null;
  }

  return (
    <motion.button
      aria-label="Dismiss alert"
      className={cn(
        "relative -my-2 -mr-2 inline-flex size-10 shrink-0 items-center justify-center self-start rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        getDismissButtonClasses(appearance),
        className
      )}
      data-slot="alert-dismiss"
      onClick={onDismiss}
      type="button"
      variants={childVariants}
    >
      <svg fill="none" height="14" viewBox="0 0 14 14" width="14">
        <path
          d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.2"
        />
      </svg>
    </motion.button>
  );
}

function getAlertGridClasses({
  hasIcon,
  showDismiss,
}: {
  hasIcon: boolean;
  showDismiss: boolean;
}) {
  if (hasIcon) {
    return showDismiss
      ? "grid-cols-[calc(var(--spacing)*4)_1fr_auto] gap-x-3"
      : "grid-cols-[calc(var(--spacing)*4)_1fr] gap-x-3";
  }

  return showDismiss ? "grid-cols-[1fr_auto]" : undefined;
}

function AlertCard({
  appearance,
  className,
  content,
  descriptionId,
  hasDescription,
  hasIcon,
  hasTitle,
  icon,
  motionProps,
  onBlurCapture,
  onDismiss,
  onExitComplete,
  onFocusCapture,
  onPointerEnter,
  onPointerLeave,
  position,
  showDismiss,
  size,
  titleId,
  variants,
  variant,
  visible,
  width,
}: {
  appearance?: VariantProps<typeof alertVariants>["appearance"];
  className?: MotionDivProps["className"];
  content: ReactNode;
  descriptionId: string;
  hasDescription: boolean;
  hasIcon: boolean;
  hasTitle: boolean;
  icon: ReactNode;
  motionProps: MotionDivProps;
  onBlurCapture: (event: FocusEvent<HTMLDivElement>) => void;
  onDismiss: () => void;
  onExitComplete: () => void;
  onFocusCapture: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  position?: AlertPosition;
  showDismiss: boolean;
  size?: AlertSize;
  titleId: string;
  variants: Variants;
  variant: AlertVariant;
  visible: boolean;
  width?: string | number;
}) {
  const dismissColumnClass = hasIcon
    ? "col-start-3 row-start-1"
    : "col-start-2 row-start-1";
  const alertWidth = resolveAlertWidth({
    size: size ?? DEFAULT_ALERT_SIZE,
    width,
    variant,
  });

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {visible ? (
        <AlertContext.Provider value={{ descriptionId, hasIcon, titleId }}>
          <motion.div
            {...motionProps}
            animate="visible"
            aria-atomic={true}
            aria-describedby={hasDescription ? descriptionId : undefined}
            aria-labelledby={hasTitle ? titleId : undefined}
            aria-live={variant === "toast" ? "polite" : undefined}
            className={cn(
              componentThemeClassName,
              alertVariants({ appearance }),
              getAlertGridClasses({ hasIcon, showDismiss }),
              "transform-gpu will-change-[transform,opacity,filter]",
              alertWidth.className,
              position ? positionClasses[position] : undefined,
              position && "z-[300]",
              className
            )}
            data-slot="alert"
            exit="exit"
            initial="hidden"
            onBlurCapture={onBlurCapture}
            onFocusCapture={onFocusCapture}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            role={variant === "toast" ? "status" : "alert"}
            style={{ ...motionProps.style, ...alertWidth.style }}
            variants={variants}
          >
            {icon ? <AlertIcon>{icon}</AlertIcon> : null}
            {content}
            <AlertDismissButton
              appearance={appearance}
              className={dismissColumnClass}
              onDismiss={onDismiss}
              show={showDismiss}
            />
          </motion.div>
        </AlertContext.Provider>
      ) : null}
    </AnimatePresence>
  );
}

function getAlertConfig({
  dismissible,
  hasCompoundChildren,
  position,
  timeout,
  variant,
}: {
  dismissible?: boolean;
  hasCompoundChildren: boolean;
  position?: AlertPosition;
  timeout?: number;
  variant?: AlertVariant;
}) {
  const resolvedVariant: AlertVariant = position
    ? "toast"
    : (variant ?? "inline");

  return {
    resolvedDismissible:
      dismissible ?? (hasCompoundChildren ? resolvedVariant === "toast" : true),
    resolvedPosition:
      resolvedVariant === "toast"
        ? (position ?? DEFAULT_TOAST_POSITION)
        : undefined,
    resolvedTimeout:
      timeout ??
      (hasCompoundChildren && resolvedVariant === "inline" ? 0 : 5000),
    resolvedVariant,
  };
}

function AlertAction({
  children,
  hasIcon,
}: {
  children: ReactNode;
  hasIcon: boolean;
}) {
  return (
    <motion.div
      className={cn(
        "mt-2 flex flex-wrap items-center gap-2",
        hasIcon ? "col-start-2" : "col-start-1"
      )}
      variants={childVariants}
    >
      {children}
    </motion.div>
  );
}

function getLegacyAlertContent({
  action,
  hasIcon,
  message,
  title,
}: {
  action?: ReactNode;
  hasIcon: boolean;
  message?: ReactNode;
  title?: ReactNode;
}) {
  return (
    <>
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      {message ? <AlertDescription>{message}</AlertDescription> : null}
      {action ? <AlertAction hasIcon={hasIcon}>{action}</AlertAction> : null}
    </>
  );
}

function getAlertContent({
  action,
  children,
  hasCompoundChildren,
  icon,
  message,
  title,
}: {
  action?: ReactNode;
  children?: ReactNode;
  hasCompoundChildren: boolean;
  icon?: ReactNode;
  message?: ReactNode;
  title?: ReactNode;
}) {
  if (hasCompoundChildren) {
    const { contentChildren, leadingIcon } = splitAlertChildren(children);
    const renderedIcon = icon ?? leadingIcon;

    return {
      hasDescription: contentChildren.some(isAlertDescriptionChild),
      hasIcon: Boolean(renderedIcon),
      hasTitle: contentChildren.some(isAlertTitleChild),
      renderedContent: (
        <>
          {contentChildren}
          {action ? (
            <AlertAction hasIcon={Boolean(renderedIcon)}>{action}</AlertAction>
          ) : null}
        </>
      ),
      renderedIcon,
    };
  }

  const renderedIcon = icon;

  return {
    hasDescription: Boolean(message),
    hasIcon: Boolean(renderedIcon),
    hasTitle: Boolean(title),
    renderedContent: getLegacyAlertContent({
      action,
      hasIcon: Boolean(renderedIcon),
      message,
      title,
    }),
    renderedIcon,
  };
}

export const Alert = ({
  appearance,
  children,
  className,
  icon,
  title,
  message,
  action,
  dismissible,
  size = DEFAULT_ALERT_SIZE,
  width,
  variant,
  position,
  timeout,
  onDismiss,
  ...props
}: AlertProps) => {
  const hasCompoundChildren = Children.count(children) > 0;
  const {
    resolvedDismissible,
    resolvedPosition,
    resolvedTimeout,
    resolvedVariant,
  } = getAlertConfig({
    dismissible,
    hasCompoundChildren,
    position,
    timeout,
    variant,
  });
  const {
    handleBlurCapture,
    handleExitComplete,
    mounted,
    requestDismiss,
    setIsFocusWithin,
    setIsHovered,
    visible,
  } = useAlertLifecycle(resolvedTimeout, onDismiss);

  const titleId = useId();
  const messageId = useId();

  const containerVariants = getContainerVariants(resolvedPosition);
  const { hasDescription, hasTitle, renderedContent, renderedIcon } =
    getAlertContent({
      action,
      children,
      hasCompoundChildren,
      icon,
      message,
      title,
    });

  const card = (
    <AlertCard
      appearance={appearance}
      className={className}
      content={renderedContent}
      descriptionId={messageId}
      hasDescription={hasDescription}
      hasIcon={Boolean(renderedIcon)}
      hasTitle={hasTitle}
      icon={renderedIcon}
      motionProps={props}
      onBlurCapture={handleBlurCapture}
      onDismiss={requestDismiss}
      onExitComplete={handleExitComplete}
      onFocusCapture={() => setIsFocusWithin(true)}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      position={resolvedPosition}
      showDismiss={resolvedDismissible}
      size={size}
      titleId={titleId}
      variant={resolvedVariant}
      variants={containerVariants}
      visible={visible}
      width={width}
    />
  );

  /**
   * When a position is given, portal the alert to document.body so it
   * escapes any ancestor CSS transform (Motion scale/y), which
   * would otherwise make `position: fixed` relative to the transformed
   * element instead of the viewport.
   */
  if (resolvedVariant === "toast") {
    if (!mounted || typeof document === "undefined") {
      return null;
    }

    return createPortal(card, document.body);
  }

  return card;
};

export default Alert;
export { AlertDescription, AlertTitle };
