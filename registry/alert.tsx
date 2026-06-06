"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion, type Variants } from "motion/react";
import {
  Children,
  type ComponentPropsWithoutRef,
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
  "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-xl border border-foreground/8 px-3.5 py-2.5 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
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

export type AlertAppearance = NonNullable<
  VariantProps<typeof alertVariants>["appearance"]
>;

type AlertContextValue = {
  descriptionId: string;
  titleId: string;
};

const AlertContext = createContext<AlertContextValue | null>(null);

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

/** Entry direction per position (desktop). On mobile all arrive from top. */
const entryY: Record<AlertPosition, number> = {
  "top-left": -10,
  "top-center": -10,
  "top-right": -10,
  "bottom-left": 10,
  "bottom-center": 10,
  "bottom-right": 10,
};

const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const EASE_IN: [number, number, number, number] = [0.4, 0, 1, 1];

/** Shared stagger children — subtle lift + blur fade */
const childVariants: Variants = {
  hidden: { opacity: 0, y: 4, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.28, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.12, ease: "easeIn" },
  },
};

/** Icon — soft spring scale-up from a visible start */
const iconVariants: Variants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 340,
      damping: 22,
      delay: 0.06,
    },
  },
  exit: {
    scale: 0.6,
    opacity: 0,
    transition: { duration: 0.12, ease: "easeIn" },
  },
};

const AlertTitle = forwardRef<HTMLDivElement, AlertTitleProps>(
  ({ children, className, id, ...props }, ref) => {
    const context = useContext(AlertContext);

    return (
      <motion.div
        className={cn(
          "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
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
          "col-start-2 grid justify-items-start gap-1 text-muted-foreground text-sm [&_p]:leading-relaxed",
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
  return isValidElement(child) && child.type === AlertTitle;
}

function isAlertDescriptionChild(child: ReactNode) {
  return isValidElement(child) && child.type === AlertDescription;
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
    if (timeoutIdRef.current !== null || remainingTimeRef.current <= 0) {
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

function AlertDismissButton({
  className,
  onDismiss,
  show,
}: {
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
        "relative -my-2 -mr-2 inline-flex size-10 shrink-0 items-center justify-center self-start rounded-md text-foreground/35 transition-colors hover:bg-accent/60 hover:text-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
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
  contextValue,
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
  titleId,
  variants,
  variant,
  visible,
}: {
  appearance?: VariantProps<typeof alertVariants>["appearance"];
  className?: MotionDivProps["className"];
  content: ReactNode;
  contextValue: AlertContextValue;
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
  titleId: string;
  variants: Variants;
  variant: AlertVariant;
  visible: boolean;
}) {
  const dismissColumnClass = hasIcon
    ? "col-start-3 row-start-1"
    : "col-start-2 row-start-1";

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {visible ? (
        <AlertContext.Provider value={contextValue}>
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
              variant === "toast" ? "sm:max-w-[400px]" : "max-w-[400px]",
              position ? positionClasses[position] : undefined,
              position && "z-300",
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
            variants={variants}
          >
            {icon ? <AlertIcon>{icon}</AlertIcon> : null}
            {content}
            <AlertDismissButton
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

function getAlertAction(action?: ReactNode) {
  if (!action) {
    return null;
  }

  return (
    <motion.div
      className="col-start-2 mt-2 flex flex-wrap items-center gap-2"
      variants={childVariants}
    >
      {action}
    </motion.div>
  );
}

function getLegacyAlertContent({
  action,
  message,
  title,
}: {
  action?: ReactNode;
  message?: ReactNode;
  title?: ReactNode;
}) {
  return (
    <>
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      {message ? <AlertDescription>{message}</AlertDescription> : null}
      {getAlertAction(action)}
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

    return {
      hasDescription: contentChildren.some(isAlertDescriptionChild),
      hasTitle: contentChildren.some(isAlertTitleChild),
      renderedContent: (
        <>
          {contentChildren}
          {getAlertAction(action)}
        </>
      ),
      renderedIcon: icon ?? leadingIcon,
    };
  }

  return {
    hasDescription: Boolean(message),
    hasTitle: Boolean(title),
    renderedContent: getLegacyAlertContent({ action, message, title }),
    renderedIcon: icon,
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

  const dy = resolvedPosition ? entryY[resolvedPosition] : -8;

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: dy, scale: 0.97, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        opacity: { duration: 0.22, ease: "easeOut" },
        y: { type: "spring" as const, stiffness: 320, damping: 26 },
        scale: { type: "spring" as const, stiffness: 320, damping: 26 },
        filter: { duration: 0.3, ease: "easeOut" },
        staggerChildren: 0.05,
        delayChildren: 0.08,
      },
    },
    exit: {
      opacity: 0,
      y: dy,
      scale: 0.97,
      filter: "blur(4px)",
      transition: { duration: 0.18, ease: EASE_IN },
    },
  };
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
      contextValue={{ descriptionId: messageId, titleId }}
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
      titleId={titleId}
      variant={resolvedVariant}
      variants={containerVariants}
      visible={visible}
    />
  );

  /**
   * When a position is given, portal the alert to document.body so it
   * escapes any ancestor CSS transform (Motion scale/y), which
   * would otherwise make `position: fixed` relative to the transformed
   * element instead of the viewport.
   */
  if (resolvedVariant === "toast") {
    return mounted ? createPortal(card, document.body) : null;
  }

  return card;
};

export default Alert;
export { AlertDescription, AlertTitle };
