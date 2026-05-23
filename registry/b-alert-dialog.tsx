"use client";

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { motion, type Variants } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { registryTheme } from "@/lib/registry-theme";
import { cn } from "@/lib/utils";

type AlertDialogContextValue = {
  actionsRef: React.RefObject<AlertDialogPrimitive.Root.Actions | null>;
  open: boolean;
  reduceMotion: boolean;
};

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(
  null
);

const overlayTransition = {
  duration: 0.24,
  ease: [0.16, 1, 0.3, 1],
} as const;

const triggerClassName =
  "inline-flex min-h-11 items-center justify-center rounded-md bg-foreground px-4 py-2.5 font-medium text-[14px] text-background tracking-[-0.01em] transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:bg-foreground/90 active:translate-y-0 active:bg-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const actionClassName =
  "inline-flex min-h-11 items-center justify-center rounded-md bg-rose-600 px-4 py-2.5 font-medium text-[14px] text-white tracking-[-0.01em] transition-[transform,filter] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:brightness-95 active:translate-y-0 active:brightness-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const cancelClassName =
  "inline-flex min-h-11 items-center justify-center rounded-md bg-muted/55 px-4 py-2.5 font-medium text-[14px] text-muted-foreground tracking-[-0.01em] transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

function getContentVariants(reduceMotion: boolean): Variants {
  if (reduceMotion) {
    return {
      hidden: { opacity: 0, y: 12 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] },
      },
      exit: {
        opacity: 0,
        y: 8,
        transition: { duration: 0.12, ease: [0.4, 0, 1, 1] },
      },
    };
  }

  return {
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
}

function getChildVariants(reduceMotion: boolean): Variants {
  if (reduceMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.14 } },
      exit: { opacity: 0, transition: { duration: 0.1 } },
    };
  }

  return {
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
}

function useAlertDialogContext() {
  const context = React.useContext(AlertDialogContext);

  if (!context) {
    throw new Error("AlertDialog components must be used within AlertDialog.");
  }

  return context;
}

export interface AlertDialogProps extends ReducedMotionProp {
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
  reducedMotion,
  ...props
}: AlertDialogProps) {
  const actionsRef = React.useRef<AlertDialogPrimitive.Root.Actions | null>(
    null
  );
  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = isControlled ? openProp : uncontrolledOpen;
  const reduceMotion = useResolvedReducedMotion(reducedMotion);

  const handleOpenChange = React.useCallback(
    (
      nextOpen: boolean,
      eventDetails: AlertDialogPrimitive.Root.ChangeEventDetails
    ) => {
      if (!(nextOpen || reduceMotion)) {
        eventDetails.preventUnmountOnClose();
      }

      onOpenChange?.(nextOpen);

      if (!(eventDetails.isCanceled || isControlled)) {
        setUncontrolledOpen(nextOpen);
      }
    },
    [isControlled, onOpenChange, reduceMotion]
  );

  return (
    <ReducedMotionConfig reducedMotion={reducedMotion}>
      <AlertDialogContext.Provider value={{ actionsRef, open, reduceMotion }}>
        <AlertDialogPrimitive.Root
          {...props}
          actionsRef={actionsRef}
          defaultOpen={defaultOpen}
          onOpenChange={handleOpenChange}
          open={open}
        >
          {children}
        </AlertDialogPrimitive.Root>
      </AlertDialogContext.Provider>
    </ReducedMotionConfig>
  );
}

const AlertDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, type = "button", ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Trigger
      className={cn(registryTheme, triggerClassName, className)}
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
  const { actionsRef, reduceMotion } = useAlertDialogContext();
  const contentVariants = getContentVariants(reduceMotion);
  const childVariants = getChildVariants(reduceMotion);

  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Backdrop
        render={(backdropProps, backdropState) => {
          const {
            className: backdropClassName,
            onAnimationEnd: _onAnimationEnd,
            onAnimationIteration: _onAnimationIteration,
            onAnimationStart: _onAnimationStart,
            onDrag: _onDrag,
            onDragEnd: _onDragEnd,
            onDragStart: _onDragStart,
            style: backdropStyle,
            ...resolvedBackdropProps
          } = backdropProps;

          return (
            <motion.div
              {...resolvedBackdropProps}
              animate={{ opacity: backdropState.open ? 1 : 0 }}
              className={cn(
                backdropClassName,
                "fixed inset-0 z-50 bg-black/52 backdrop-blur-[10px]",
                reduceMotion && "backdrop-blur-0"
              )}
              initial={
                backdropState.transitionStatus === "starting"
                  ? { opacity: 0 }
                  : false
              }
              style={backdropStyle}
              transition={
                reduceMotion
                  ? { duration: 0.14, ease: [0.4, 0, 1, 1] }
                  : overlayTransition
              }
            />
          );
        }}
      />
      <AlertDialogPrimitive.Viewport className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4">
        <AlertDialogPrimitive.Popup
          {...props}
          className={className}
          render={(popupProps, popupState) => {
            const {
              children: popupChildren,
              className: popupClassName,
              onAnimationEnd: _popupOnAnimationEnd,
              onAnimationIteration: _popupOnAnimationIteration,
              onAnimationStart: _popupOnAnimationStart,
              onDrag: _popupOnDrag,
              onDragEnd: _popupOnDragEnd,
              onDragStart: _popupOnDragStart,
              ref: popupRef,
              style: popupStyle,
              ...resolvedPopupProps
            } = popupProps;

            return (
              <motion.div
                {...resolvedPopupProps}
                animate={popupState.open ? "visible" : "exit"}
                className={cn(
                  popupClassName,
                  registryTheme,
                  "relative flex w-[min(100%,34rem)] max-w-xl flex-col gap-5 rounded-[12px] border border-border/75 bg-background/96 p-6 text-foreground shadow-[0_32px_120px_rgba(15,23,42,0.18)] outline-none supports-[backdrop-filter]:bg-background/92 sm:p-7 dark:bg-neutral-950/94"
                )}
                initial={
                  popupState.transitionStatus === "starting" ? "hidden" : false
                }
                onAnimationComplete={() => {
                  if (!(popupState.open || reduceMotion)) {
                    actionsRef.current?.unmount();
                  }
                }}
                ref={(node) => {
                  setRef(popupRef, node);
                  setRef(ref, node);
                }}
                style={popupStyle}
                variants={contentVariants}
              >
                {popupChildren}
              </motion.div>
            );
          }}
        >
          {React.Children.map(children, (child) =>
            child == null ? null : (
              <motion.div variants={childVariants}>{child}</motion.div>
            )
          )}
        </AlertDialogPrimitive.Popup>
      </AlertDialogPrimitive.Viewport>
    </AlertDialogPrimitive.Portal>
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
        "font-semibold text-[1.35rem] text-foreground leading-tight tracking-[-0.03em]",
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
        "max-w-[46ch] text-[15px] text-muted-foreground leading-6",
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
    <AlertDialogPrimitive.Close
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
    <AlertDialogPrimitive.Close
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
