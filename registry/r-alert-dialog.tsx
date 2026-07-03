"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
  useReducedMotion,
  type Variants,
} from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const controlCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[11px]";

const surfaceCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[12px]";

const alertDialogThemeClassName =
  "[--adlg-surface:#ffffff] [--adlg-foreground:#111111] [--adlg-border:#e3e7ec] [--adlg-ring:rgba(17,17,17,0.16)] [--adlg-muted-foreground:#6d7480] [--adlg-muted:#f5f7fa] [--adlg-action-surface:#111111] [--adlg-action-foreground:#ffffff] [--adlg-destructive:#dc2626] [--adlg-destructive-foreground:#ffffff] [--color-accent:var(--adlg-muted)] [--color-accent-foreground:var(--adlg-foreground)] dark:[--adlg-surface:#0a0a0a] dark:[--adlg-foreground:#f6f3ec] dark:[--adlg-border:#2b2a25] dark:[--adlg-ring:rgba(246,243,236,0.18)] dark:[--adlg-muted-foreground:#9a958a] dark:[--adlg-muted:#1a1a18] dark:[--adlg-action-surface:#f6f3ec] dark:[--adlg-action-foreground:#111111] dark:[--adlg-destructive:#f87171] dark:[--adlg-destructive-foreground:#111111]";

const alertDialogContentClassName = cn(
  surfaceCornerClassName,
  "relative flex w-[min(100%,34rem)] max-w-xl transform-gpu flex-col gap-5 border border-[color:color-mix(in_oklch,var(--adlg-border),transparent_25%)] bg-[color:color-mix(in_oklch,var(--adlg-surface),transparent_4%)] p-6 text-[color:var(--adlg-foreground)] shadow-[0_32px_120px_rgba(15,23,42,0.18)] outline-none supports-[backdrop-filter]:bg-[color:color-mix(in_oklch,var(--adlg-surface),transparent_8%)] sm:p-7"
);

type AlertDialogContextValue = {
  open: boolean;
};

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(
  null
);

const FLUID_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const FLUID_EXIT_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

const overlayEnterTransition: Transition = {
  opacity: { duration: 0.44, ease: FLUID_EASE },
  backdropFilter: { duration: 0.52, ease: FLUID_EASE },
};

const overlayExitTransition: Transition = {
  opacity: { duration: 0.32, ease: FLUID_EXIT_EASE },
  backdropFilter: { duration: 0.28, ease: FLUID_EXIT_EASE },
};

const overlayVariants: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: overlayExitTransition,
  },
  visible: {
    opacity: 1,
    backdropFilter: "blur(10px)",
    transition: overlayEnterTransition,
  },
};

const reducedOverlayVariants: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.1, ease: FLUID_EXIT_EASE } },
  visible: { opacity: 1, transition: { duration: 0.12, ease: FLUID_EASE } },
};

const alertDialogTriggerClassName = cn(
  controlCornerClassName,
  "inline-flex min-h-11 items-center justify-center bg-[color:var(--adlg-action-surface)] px-4 py-2.5 font-medium text-[14px] text-[color:var(--adlg-action-foreground)] tracking-[-0.01em] transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:bg-[color:color-mix(in_oklch,var(--adlg-action-surface),transparent_10%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--adlg-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--adlg-surface)] active:translate-y-0 active:bg-[color:color-mix(in_oklch,var(--adlg-action-surface),transparent_20%)] disabled:pointer-events-none disabled:opacity-50"
);

const alertDialogTriggerSmClassName = cn(
  controlCornerClassName,
  "inline-flex h-8 min-h-8 translate-y-px items-center bg-[color:var(--adlg-action-surface)] px-3 py-0 font-medium text-[13px] text-[color:var(--adlg-action-foreground)] tracking-[-0.01em] transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:bg-[color:color-mix(in_oklch,var(--adlg-action-surface),transparent_10%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--adlg-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--adlg-surface)] active:translate-y-0 active:bg-[color:color-mix(in_oklch,var(--adlg-action-surface),transparent_20%)] disabled:pointer-events-none disabled:opacity-50"
);

const alertDialogActionClassName = cn(
  controlCornerClassName,
  "inline-flex min-h-11 items-center justify-center bg-[color:var(--adlg-destructive)] px-4 py-2.5 font-medium text-[14px] text-[color:var(--adlg-destructive-foreground)] tracking-[-0.01em] transition-[transform,filter] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--adlg-destructive),transparent_30%)] focus-visible:ring-offset-2 active:translate-y-0 active:brightness-90 disabled:pointer-events-none disabled:opacity-50"
);

const alertDialogDefaultActionClassName = cn(
  controlCornerClassName,
  "inline-flex min-h-11 items-center justify-center bg-[color:var(--adlg-action-surface)] px-4 py-2.5 font-medium text-[14px] text-[color:var(--adlg-action-foreground)] tracking-[-0.01em] transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:bg-[color:color-mix(in_oklch,var(--adlg-action-surface),transparent_10%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--adlg-ring),transparent_50%)] focus-visible:ring-offset-2 active:translate-y-0 active:bg-[color:color-mix(in_oklch,var(--adlg-action-surface),transparent_20%)] disabled:pointer-events-none disabled:opacity-50"
);

const alertDialogCancelClassName = cn(
  controlCornerClassName,
  "inline-flex min-h-11 items-center justify-center bg-[color:color-mix(in_oklch,var(--adlg-muted),transparent_45%)] px-4 py-2.5 font-medium text-[14px] text-[color:var(--adlg-muted-foreground)] tracking-[-0.01em] transition-colors duration-150 hover:bg-accent/60 hover:text-[color:var(--adlg-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--adlg-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--adlg-surface)] disabled:pointer-events-none disabled:opacity-50"
);

const contentVariants: Variants = {
  hidden: {
    opacity: 0,
    scaleX: 0.94,
    scaleY: 0.82,
    y: 24,
    filter: "blur(14px)",
  },
  visible: {
    opacity: 1,
    scaleX: 1,
    scaleY: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      opacity: { duration: 0.46, ease: FLUID_EASE },
      scaleX: { duration: 0.54, ease: FLUID_EASE },
      scaleY: { duration: 0.58, ease: FLUID_EASE },
      y: { duration: 0.52, ease: FLUID_EASE },
      filter: { duration: 0.56, ease: FLUID_EASE },
      staggerChildren: 0.065,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scaleX: 0.98,
    scaleY: 0.92,
    y: 12,
    filter: "blur(6px)",
    transition: {
      opacity: { duration: 0.28, ease: FLUID_EXIT_EASE },
      scaleX: { duration: 0.3, ease: FLUID_EXIT_EASE },
      scaleY: { duration: 0.32, ease: FLUID_EXIT_EASE },
      y: { duration: 0.3, ease: FLUID_EXIT_EASE },
      filter: { duration: 0.26, ease: FLUID_EXIT_EASE },
    },
  },
};

const reducedContentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.12, ease: FLUID_EASE },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1, ease: FLUID_EXIT_EASE },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.96, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      opacity: { duration: 0.4, ease: FLUID_EASE },
      y: { duration: 0.44, ease: FLUID_EASE },
      scale: { duration: 0.42, ease: FLUID_EASE },
      filter: { duration: 0.46, ease: FLUID_EASE },
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.98,
    filter: "blur(2px)",
    transition: { duration: 0.22, ease: FLUID_EXIT_EASE },
  },
};

const reducedChildVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.08 } },
};

function mapStaggeredChildren(children: React.ReactNode, variants: Variants) {
  return React.Children.map(children, (child, index) => {
    if (child == null) {
      return null;
    }

    const key =
      React.isValidElement(child) && child.key != null ? child.key : index;

    return (
      <motion.div key={key} variants={variants}>
        {child}
      </motion.div>
    );
  });
}

function useAlertDialogContext() {
  const context = React.useContext(AlertDialogContext);

  if (!context) {
    throw new Error("AlertDialog components must be used within AlertDialog.");
  }

  return context;
}

export interface AlertDialogProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root>,
    "children" | "defaultOpen" | "onOpenChange" | "open"
  > {
  children: React.ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

function AlertDialog({
  children,
  defaultOpen = false,
  onOpenChange,
  open: openProp,
  ...props
}: AlertDialogProps) {
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

  return (
    <AlertDialogContext.Provider value={{ open }}>
      <AlertDialogPrimitive.Root
        {...props}
        defaultOpen={isControlled ? undefined : defaultOpen}
        onOpenChange={handleOpenChange}
        open={open}
      >
        {children}
      </AlertDialogPrimitive.Root>
    </AlertDialogContext.Provider>
  );
}

type AlertDialogButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

const AlertDialogTrigger = React.forwardRef<
  HTMLElement,
  AlertDialogButtonProps
>(({ asChild, children, className, type = "button", ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Trigger
      {...props}
      asChild={asChild}
      className={
        asChild
          ? cn(alertDialogThemeClassName, className)
          : cn(
              alertDialogThemeClassName,
              className ?? alertDialogTriggerClassName
            )
      }
      ref={ref as React.Ref<HTMLButtonElement>}
      type={asChild ? undefined : type}
    >
      {children}
    </AlertDialogPrimitive.Trigger>
  );
});
AlertDialogTrigger.displayName = "AlertDialogTrigger";

const AlertDialogPortal = AlertDialogPrimitive.Portal;

export interface AlertDialogContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>,
    "asChild" | "children" | "className"
  > {
  children: React.ReactNode;
  className?: string;
  open?: boolean;
}

const AlertDialogContent = React.forwardRef<
  HTMLDivElement,
  AlertDialogContentProps
>(({ children, className, open: openProp, ...props }, ref) => {
  const context = useAlertDialogContext();
  const open = openProp ?? context.open;
  const reduceMotion = useReducedMotion() === true;
  const contentVariantConfig = reduceMotion
    ? reducedContentVariants
    : contentVariants;
  const childVariantConfig = reduceMotion
    ? reducedChildVariants
    : childVariants;
  const overlayVariantConfig = reduceMotion
    ? reducedOverlayVariants
    : overlayVariants;

  return (
    <AnimatePresence initial={false} mode="wait">
      {open ? (
        <AlertDialogPortal forceMount key="alert-dialog">
          <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
            <AlertDialogPrimitive.Overlay asChild forceMount>
              <motion.div
                animate="visible"
                className="fixed inset-0 z-50 bg-black/52"
                exit="hidden"
                initial="hidden"
                variants={overlayVariantConfig}
              />
            </AlertDialogPrimitive.Overlay>
            <div className="pointer-events-none fixed inset-0 z-[51] grid place-items-center overflow-y-auto p-4">
              <AlertDialogPrimitive.Content asChild forceMount {...props}>
                <motion.div
                  animate="visible"
                  className={cn(
                    alertDialogThemeClassName,
                    alertDialogContentClassName,
                    "pointer-events-auto",
                    className
                  )}
                  exit="exit"
                  initial="hidden"
                  ref={ref}
                  style={{ transformOrigin: "center center" }}
                  variants={contentVariantConfig}
                >
                  {mapStaggeredChildren(children, childVariantConfig)}
                </motion.div>
              </AlertDialogPrimitive.Content>
            </div>
          </MotionConfig>
        </AlertDialogPortal>
      ) : null}
    </AnimatePresence>
  );
});
AlertDialogContent.displayName = "AlertDialogContent";

function AlertDialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-2 text-left", className)}
      {...props}
    />
  );
}

function AlertDialogMedia({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-full bg-[color:color-mix(in_oklch,var(--adlg-destructive),transparent_90%)] text-[color:var(--adlg-destructive)]",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 pt-1 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Title
      className={cn(
        "font-semibold text-[1.35rem] text-[color:var(--adlg-foreground)] leading-tight tracking-[-0.03em]",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
AlertDialogTitle.displayName = "AlertDialogTitle";

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Description
      className={cn(
        "max-w-[46ch] text-[15px] text-[color:var(--adlg-muted-foreground)] leading-6",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
AlertDialogDescription.displayName = "AlertDialogDescription";

type AlertDialogActionVariant = "default" | "destructive";

interface AlertDialogActionProps extends AlertDialogButtonProps {
  closeOnClick?: boolean;
  variant?: AlertDialogActionVariant;
}

interface AlertDialogCancelProps extends AlertDialogButtonProps {
  closeOnClick?: boolean;
}

const AlertDialogCancel = React.forwardRef<HTMLElement, AlertDialogCancelProps>(
  (
    {
      asChild,
      children,
      className,
      closeOnClick = true,
      onClick,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <AlertDialogPrimitive.Cancel
        {...props}
        asChild={asChild}
        className={cn(alertDialogCancelClassName, className)}
        onClick={(event) => {
          onClick?.(event);

          if (!closeOnClick) {
            event.preventDefault();
          }
        }}
        ref={ref as React.Ref<HTMLButtonElement>}
        type={asChild ? undefined : type}
      >
        {children}
      </AlertDialogPrimitive.Cancel>
    );
  }
);
AlertDialogCancel.displayName = "AlertDialogCancel";

const AlertDialogAction = React.forwardRef<HTMLElement, AlertDialogActionProps>(
  (
    {
      asChild,
      children,
      className,
      closeOnClick = true,
      onClick,
      type = "button",
      variant = "destructive",
      ...props
    },
    ref
  ) => {
    const actionClassName =
      variant === "default"
        ? alertDialogDefaultActionClassName
        : alertDialogActionClassName;

    return (
      <AlertDialogPrimitive.Action
        {...props}
        asChild={asChild}
        className={cn(actionClassName, className)}
        onClick={(event) => {
          onClick?.(event);

          if (!closeOnClick) {
            event.preventDefault();
          }
        }}
        ref={ref as React.Ref<HTMLButtonElement>}
        type={asChild ? undefined : type}
      >
        {children}
      </AlertDialogPrimitive.Action>
    );
  }
);
AlertDialogAction.displayName = "AlertDialogAction";

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  alertDialogActionClassName,
  alertDialogCancelClassName,
  alertDialogDefaultActionClassName,
  alertDialogThemeClassName,
  alertDialogTriggerClassName,
  alertDialogTriggerSmClassName,
};
