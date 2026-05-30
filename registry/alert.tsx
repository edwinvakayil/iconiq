"use client";

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

const componentThemeClassName =
  "[--background:#ffffff] [--foreground:#111111] [--primary:#111111] [--secondary:#646b75] [--surface-border:#e9edf2] [--border:#e3e7ec] [--card:#ffffff] [--card-foreground:#111111] [--muted:#f5f7fa] [--muted-foreground:#6d7480] [--accent:#f3f5f8] [--accent-foreground:#111111] [--input:#e3e7ec] [--ring:rgba(17,17,17,0.16)] [--destructive:#dc2626] [--paper:#fcfcfd] [--popover-foreground:#111111] [--brand:#0ea5e9] [--brand-soft:#bae6fd] [--shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--chart-1:oklch(0.52_0.19_254)] [--chart-2:oklch(0.74_0.11_232)] [--chart-3:oklch(0.42_0.16_262)] [--chart-4:oklch(0.84_0.07_228)] [--chart-5:oklch(0.62_0.14_240)] [--color-background:var(--background)] [--color-foreground:var(--foreground)] [--color-primary:var(--primary)] [--color-secondary:var(--secondary)] [--color-border:var(--border)] [--color-card:var(--card)] [--color-card-foreground:var(--card-foreground)] [--color-muted:var(--muted)] [--color-muted-foreground:var(--muted-foreground)] [--color-accent:var(--accent)] [--color-accent-foreground:var(--accent-foreground)] [--color-input:var(--input)] [--color-ring:var(--ring)] [--color-destructive:var(--destructive)] [--color-paper:var(--paper)] [--color-popover-foreground:var(--popover-foreground)] [--color-brand:var(--brand)] [--color-brand-soft:var(--brand-soft)] [--color-chart-1:var(--chart-1)] [--color-chart-2:var(--chart-2)] [--color-chart-3:var(--chart-3)] [--color-chart-4:var(--chart-4)] [--color-chart-5:var(--chart-5)] dark:[--background:#111111] dark:[--foreground:#f6f3ec] dark:[--primary:#f6f3ec] dark:[--secondary:#cbc6bb] dark:[--surface-border:#2a2a25] dark:[--border:#2b2a25] dark:[--card:#111111] dark:[--card-foreground:#f6f3ec] dark:[--muted:#171716] dark:[--muted-foreground:#9a958a] dark:[--accent:#1a1a18] dark:[--accent-foreground:#f6f3ec] dark:[--input:#2b2a25] dark:[--ring:rgba(246,243,236,0.18)] dark:[--destructive:#f87171] dark:[--paper:#171716] dark:[--popover-foreground:#f6f3ec] dark:[--brand:#38bdf8] dark:[--brand-soft:#0c4a6e] dark:[--shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--chart-1:oklch(0.68_0.17_250)] dark:[--chart-2:oklch(0.82_0.09_225)] dark:[--chart-3:oklch(0.58_0.15_260)] dark:[--chart-4:oklch(0.75_0.12_235)] dark:[--chart-5:oklch(0.88_0.06_220)]";

export type AlertPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type AlertVariant = "inline" | "toast";

type AlertContextValue = {
  descriptionId: string;
  titleId: string;
};

const AlertContext = createContext<AlertContextValue | null>(null);

type MotionDivProps = ComponentPropsWithoutRef<typeof motion.div>;

export interface AlertProps extends Omit<MotionDivProps, "title"> {
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
  /** Auto-dismiss after this many milliseconds. Defaults to 10 000. Pass 0 to disable. */
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
          "font-medium text-foreground text-sm leading-5 tracking-[-0.01em]",
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
          "mt-1 text-[13px] text-foreground/65 leading-5",
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
      className="mt-0.5 shrink-0 text-black dark:text-white [&_svg]:h-[18px] [&_svg]:w-[18px]"
      variants={iconVariants}
    >
      {children}
    </motion.div>
  );
}

function AlertDismissButton({
  onDismiss,
  show,
}: {
  onDismiss: () => void;
  show: boolean;
}) {
  if (!show) {
    return null;
  }

  return (
    <motion.button
      aria-label="Dismiss alert"
      className="relative -my-2 -mr-2 inline-flex size-10 shrink-0 items-center justify-center self-start rounded-md text-foreground/35 transition-colors hover:bg-foreground/5 hover:text-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

function AlertCard({
  className,
  content,
  contextValue,
  descriptionId,
  hasDescription,
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
  className?: MotionDivProps["className"];
  content: ReactNode;
  contextValue: AlertContextValue;
  descriptionId: string;
  hasDescription: boolean;
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
            aria-live="polite"
            className={cn(
              componentThemeClassName,
              "relative flex items-start gap-3 overflow-hidden rounded-lg border border-foreground/8 bg-card px-3.5 shadow-[0_2px_14px_0_rgba(0,0,0,0.07)]",
              variant === "toast"
                ? "py-3 sm:max-w-sm sm:py-2.5"
                : "w-full max-w-sm py-3",
              position ? positionClasses[position] : undefined,
              position && "z-300",
              className
            )}
            exit="exit"
            initial="hidden"
            onBlurCapture={onBlurCapture}
            onFocusCapture={onFocusCapture}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            role="status"
            variants={variants}
          >
            <AlertIcon>{icon}</AlertIcon>
            <div className="min-w-0 flex-1">{content}</div>
            <AlertDismissButton onDismiss={onDismiss} show={showDismiss} />
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
      (hasCompoundChildren && resolvedVariant === "inline" ? 0 : 10_000),
    resolvedVariant,
  };
}

function getAlertAction(action?: ReactNode) {
  if (!action) {
    return null;
  }

  return (
    <motion.div
      className="mt-2 flex flex-wrap items-center gap-2"
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
      className={className}
      content={renderedContent}
      contextValue={{ descriptionId: messageId, titleId }}
      descriptionId={messageId}
      hasDescription={hasDescription}
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
