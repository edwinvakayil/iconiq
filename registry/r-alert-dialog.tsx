"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { AnimatePresence, motion, type Variants } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const alertDialogThemeClassName =
  "[--adlg-surface:#ffffff] [--adlg-foreground:#111111] [--adlg-border:#e3e7ec] [--adlg-ring:rgba(17,17,17,0.16)] [--adlg-muted-foreground:#6d7480] [--adlg-muted:#f5f7fa] [--adlg-action-surface:#111111] [--adlg-action-foreground:#ffffff] [--color-accent:var(--adlg-muted)] [--color-accent-foreground:var(--adlg-foreground)] dark:[--adlg-surface:#0a0a0a] dark:[--adlg-foreground:#f6f3ec] dark:[--adlg-border:#2b2a25] dark:[--adlg-ring:rgba(246,243,236,0.18)] dark:[--adlg-muted-foreground:#9a958a] dark:[--adlg-muted:#1a1a18] dark:[--adlg-action-surface:#f6f3ec] dark:[--adlg-action-foreground:#111111]";

const alertDialogContentClassName =
  "relative flex w-[min(100%,34rem)] max-w-xl flex-col gap-5 rounded-lg border border-[color:color-mix(in_oklch,var(--adlg-border),transparent_25%)] bg-[color:color-mix(in_oklch,var(--adlg-surface),transparent_4%)] p-6 text-[color:var(--adlg-foreground)] shadow-[0_32px_120px_rgba(15,23,42,0.18)] outline-none supports-[backdrop-filter]:bg-[color:color-mix(in_oklch,var(--adlg-surface),transparent_8%)] sm:p-7";

type AlertDialogContextValue = {
  open: boolean;
};

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(
  null
);

const overlayTransition = {
  duration: 0.24,
  ease: [0.16, 1, 0.3, 1],
} as const;

const triggerClassName =
  "inline-flex min-h-11 items-center justify-center rounded-md bg-[color:var(--adlg-action-surface)] px-4 py-2.5 font-medium text-[14px] text-[color:var(--adlg-action-foreground)] tracking-[-0.01em] transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:bg-[color:color-mix(in_oklch,var(--adlg-action-surface),transparent_10%)] active:translate-y-0 active:bg-[color:color-mix(in_oklch,var(--adlg-action-surface),transparent_20%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--adlg-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--adlg-surface)] disabled:pointer-events-none disabled:opacity-50";

const actionClassName =
  "inline-flex min-h-11 items-center justify-center rounded-md bg-rose-600 px-4 py-2.5 font-medium text-[14px] text-white tracking-[-0.01em] transition-[transform,filter] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:brightness-95 active:translate-y-0 active:brightness-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const cancelClassName =
  "inline-flex min-h-11 items-center justify-center rounded-md bg-[color:color-mix(in_oklch,var(--adlg-muted),transparent_45%)] px-4 py-2.5 font-medium text-[14px] text-[color:var(--adlg-muted-foreground)] tracking-[-0.01em] transition-colors duration-150 hover:bg-accent/60 hover:text-[color:var(--adlg-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--adlg-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--adlg-surface)] disabled:pointer-events-none disabled:opacity-50";

const contentVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 26,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 24,
      mass: 0.92,
      staggerChildren: 0.055,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 12,
    filter: "blur(4px)",
    transition: {
      type: "spring",
      stiffness: 340,
      damping: 28,
      mass: 0.86,
    },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      mass: 0.82,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.12, ease: [0.4, 0, 1, 1] },
  },
};

function useAlertDialogContext() {
  const context = React.useContext(AlertDialogContext);

  if (!context) {
    throw new Error("AlertDialog components must be used within AlertDialog.");
  }

  return context;
}

export interface AlertDialogProps {
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
        defaultOpen={defaultOpen}
        onOpenChange={handleOpenChange}
        open={open}
      >
        {children}
      </AlertDialogPrimitive.Root>
    </AlertDialogContext.Provider>
  );
}

const AlertDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, type = "button", ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Trigger
      className={cn(alertDialogThemeClassName, triggerClassName, className)}
      ref={ref}
      type={type}
      {...props}
    />
  );
});
AlertDialogTrigger.displayName = "AlertDialogTrigger";

const AlertDialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { open } = useAlertDialogContext();
  const {
    onAnimationEnd: _onAnimationEnd,
    onAnimationIteration: _onAnimationIteration,
    onAnimationStart: _onAnimationStart,
    onDrag: _onDrag,
    onDragEnd: _onDragEnd,
    onDragStart: _onDragStart,
    ...resolvedProps
  } = props;

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <AlertDialogPrimitive.Portal forceMount>
          <AlertDialogPrimitive.Overlay asChild forceMount>
            <motion.div
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 bg-black/52 backdrop-blur-[10px]"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              transition={overlayTransition}
            />
          </AlertDialogPrimitive.Overlay>
          <AlertDialogPrimitive.Content
            className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4 outline-none"
            forceMount
          >
            <motion.div
              animate="visible"
              className={cn(
                alertDialogThemeClassName,
                alertDialogContentClassName,
                className
              )}
              exit="exit"
              initial="hidden"
              ref={ref}
              variants={contentVariants}
              {...resolvedProps}
            >
              {React.Children.map(children, (child) =>
                child == null ? null : (
                  <motion.div variants={childVariants}>{child}</motion.div>
                )
              )}
            </motion.div>
          </AlertDialogPrimitive.Content>
        </AlertDialogPrimitive.Portal>
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

function AlertDialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

const AlertDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
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
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
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

const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, type = "button", ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(cancelClassName, className)}
      ref={ref}
      type={type}
      {...props}
    />
  );
});
AlertDialogCancel.displayName = "AlertDialogCancel";

const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, type = "button", ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Action
      className={cn(actionClassName, className)}
      ref={ref}
      type={type}
      {...props}
    />
  );
});
AlertDialogAction.displayName = "AlertDialogAction";

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
};
