"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
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

const dialogThemeClassName =
  "[--dlg-surface:var(--popover,#ffffff)] [--dlg-foreground:var(--popover-foreground,#111111)] [--dlg-border:var(--border,#e3e7ec)] [--dlg-ring:var(--ring,rgba(17,17,17,0.16))] [--dlg-muted-foreground:var(--muted-foreground,#6d7480)] [--dlg-muted:var(--muted,#f5f7fa)] [--dlg-destructive:var(--destructive,#dc2626)] [--dlg-destructive-foreground:var(--destructive-foreground,#ffffff)] [--color-accent:var(--dlg-muted)] [--color-accent-foreground:var(--dlg-foreground)] dark:[--dlg-surface:var(--popover,#0a0a0a)] dark:[--dlg-foreground:var(--popover-foreground,#f6f3ec)] dark:[--dlg-border:var(--border,#2b2a25)] dark:[--dlg-ring:var(--ring,rgba(246,243,236,0.18))] dark:[--dlg-muted-foreground:var(--muted-foreground,#9a958a)] dark:[--dlg-muted:var(--muted,#1a1a18)] dark:[--dlg-destructive:var(--destructive,#f87171)] dark:[--dlg-destructive-foreground:var(--destructive-foreground,#111111)]";

const dialogContentMaxHeightClassName =
  "max-h-[min(90svh,calc(100svh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-2rem))] overflow-y-auto";

const dialogContentBaseClassName = cn(
  surfaceCornerClassName,
  "relative flex min-h-0 transform-gpu flex-col gap-5 border border-[color:color-mix(in_oklch,var(--dlg-border),transparent_25%)] bg-[color:color-mix(in_oklch,var(--dlg-surface),transparent_4%)] p-6 text-[color:var(--dlg-foreground)] shadow-[0_32px_120px_rgba(15,23,42,0.18)] outline-none supports-[backdrop-filter]:bg-[color:color-mix(in_oklch,var(--dlg-surface),transparent_8%)] sm:p-7"
);

const dialogContentSizeClassNames = {
  sm: "w-[min(100%,28rem)] max-w-md",
  default: "w-[min(100%,34rem)] max-w-xl",
  lg: "w-[min(100%,42rem)] max-w-2xl",
  full: "w-[min(100%,calc(100vw-2rem))] max-w-none",
} as const;

type DialogContentSize = keyof typeof dialogContentSizeClassNames;

const dialogCloseClassName = cn(
  controlCornerClassName,
  "absolute top-4 right-4 z-10 grid size-9 shrink-0 place-items-center text-[color:var(--dlg-muted-foreground)] transition-colors hover:bg-accent/60 hover:text-[color:var(--dlg-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--dlg-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--dlg-surface)] active:bg-accent/80 [&_svg]:block [&_svg]:size-4 [&_svg]:shrink-0"
);

const dialogTriggerClassName = cn(
  controlCornerClassName,
  "inline-flex min-h-11 items-center justify-center bg-[color:var(--dlg-foreground)] px-4 py-2.5 font-medium text-[14px] text-[color:var(--dlg-surface)] tracking-[-0.01em] transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:bg-[color:color-mix(in_oklch,var(--dlg-foreground),transparent_10%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--dlg-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--dlg-surface)] active:translate-y-0 active:bg-[color:color-mix(in_oklch,var(--dlg-foreground),transparent_20%)] disabled:pointer-events-none disabled:opacity-50"
);

const dialogTriggerSmClassName = cn(
  controlCornerClassName,
  "inline-flex h-8 min-h-8 translate-y-px items-center bg-[color:var(--dlg-foreground)] px-3 py-0 font-medium text-[13px] text-[color:var(--dlg-surface)] tracking-[-0.01em] transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:bg-[color:color-mix(in_oklch,var(--dlg-foreground),transparent_10%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--dlg-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--dlg-surface)] active:translate-y-0 active:bg-[color:color-mix(in_oklch,var(--dlg-foreground),transparent_20%)] disabled:pointer-events-none disabled:opacity-50"
);

const dialogCancelClassName = cn(
  controlCornerClassName,
  "inline-flex min-h-11 items-center justify-center bg-[color:color-mix(in_oklch,var(--dlg-muted),transparent_45%)] px-4 py-2.5 font-medium text-[14px] text-[color:var(--dlg-muted-foreground)] tracking-[-0.01em] transition-colors duration-150 hover:bg-accent/60 hover:text-[color:var(--dlg-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--dlg-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--dlg-surface)] active:bg-accent/80 disabled:pointer-events-none disabled:opacity-50"
);

const dialogActionClassName = cn(
  controlCornerClassName,
  "inline-flex min-h-11 items-center justify-center bg-[color:var(--dlg-foreground)] px-4 py-2.5 font-medium text-[14px] text-[color:var(--dlg-surface)] tracking-[-0.01em] transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:bg-[color:color-mix(in_oklch,var(--dlg-foreground),transparent_10%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--dlg-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--dlg-surface)] active:translate-y-0 active:bg-[color:color-mix(in_oklch,var(--dlg-foreground),transparent_20%)] disabled:pointer-events-none disabled:opacity-50"
);

const dialogDestructiveActionClassName = cn(
  controlCornerClassName,
  "inline-flex min-h-11 items-center justify-center bg-[color:var(--dlg-destructive)] px-4 py-2.5 font-medium text-[14px] text-[color:var(--dlg-destructive-foreground)] tracking-[-0.01em] transition-[transform,filter] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--dlg-destructive),transparent_30%)] focus-visible:ring-offset-2 active:translate-y-0 active:brightness-90 disabled:pointer-events-none disabled:opacity-50"
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

const contentVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    y: 30,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 300,
      mass: 0.8,
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 15,
    filter: "blur(4px)",
    transition: {
      type: "spring" as const,
      damping: 30,
      stiffness: 400,
      duration: 0.2,
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
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 20, stiffness: 300 },
  },
};

const reducedChildVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
};

type DialogContextValue = {
  open: boolean;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const context = React.useContext(DialogContext);

  if (!context) {
    throw new Error("Dialog components must be used within Dialog.");
  }

  return context;
}

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

export interface DialogProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>,
    "children" | "defaultOpen" | "onOpenChange" | "open"
  > {
  children: React.ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

function Dialog({
  children,
  defaultOpen = false,
  onOpenChange,
  open: openProp,
  ...props
}: DialogProps) {
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
    <DialogContext.Provider value={{ open }}>
      <DialogPrimitive.Root
        {...props}
        defaultOpen={isControlled ? undefined : defaultOpen}
        onOpenChange={handleOpenChange}
        open={open}
      >
        {children}
      </DialogPrimitive.Root>
    </DialogContext.Provider>
  );
}

type TriggerOrCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

const DialogTrigger = React.forwardRef<HTMLElement, TriggerOrCloseProps>(
  ({ asChild, children, className, type = "button", ...props }, ref) => {
    return (
      <DialogPrimitive.Trigger
        {...props}
        asChild={asChild}
        className={
          asChild
            ? cn(dialogThemeClassName, className)
            : cn(dialogThemeClassName, className ?? dialogTriggerClassName)
        }
        ref={ref as React.Ref<HTMLButtonElement>}
        type={asChild ? undefined : type}
      >
        {children}
      </DialogPrimitive.Trigger>
    );
  }
);
DialogTrigger.displayName = "DialogTrigger";

const DialogClose = React.forwardRef<HTMLButtonElement, TriggerOrCloseProps>(
  ({ asChild, children, className, type = "button", ...props }, ref) => {
    return (
      <DialogPrimitive.Close
        {...props}
        asChild={asChild}
        className={cn(dialogThemeClassName, className)}
        ref={ref}
        type={asChild ? undefined : type}
      >
        {children}
      </DialogPrimitive.Close>
    );
  }
);
DialogClose.displayName = "DialogClose";

const DialogPortal = DialogPrimitive.Portal;

export interface DialogOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {
  className?: string;
}

const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, ...props }, ref) => {
    const { open } = useDialogContext();
    const reduceMotion = useReducedMotion() === true;
    const overlayVariantConfig = reduceMotion
      ? reducedOverlayVariants
      : overlayVariants;

    return (
      <DialogPrimitive.Overlay asChild forceMount {...props}>
        <motion.div
          animate={open ? "visible" : "hidden"}
          className={cn("fixed inset-0 z-50 bg-black/52", className)}
          exit="hidden"
          initial="hidden"
          ref={ref}
          variants={overlayVariantConfig}
        />
      </DialogPrimitive.Overlay>
    );
  }
);
DialogOverlay.displayName = "DialogOverlay";

export interface DialogContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    "asChild" | "children" | "className"
  > {
  children: React.ReactNode;
  className?: string;
  open?: boolean;
  showCloseButton?: boolean;
  size?: DialogContentSize;
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  (
    {
      children,
      className,
      open: openProp,
      showCloseButton = true,
      size = "default",
      ...props
    },
    ref
  ) => {
    const context = useDialogContext();
    const resolvedOpen = openProp ?? context.open;
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
        {resolvedOpen ? (
          <DialogPortal forceMount key="dialog">
            <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
              <DialogPrimitive.Overlay asChild forceMount>
                <motion.div
                  animate="visible"
                  className="fixed inset-0 z-50 bg-black/52"
                  exit="hidden"
                  initial="hidden"
                  variants={overlayVariantConfig}
                />
              </DialogPrimitive.Overlay>
              <div className="pointer-events-none fixed inset-0 z-[51] grid place-items-center overflow-y-auto overscroll-contain p-4">
                <DialogPrimitive.Content asChild forceMount {...props}>
                  <motion.div
                    animate="visible"
                    className={cn(
                      dialogThemeClassName,
                      dialogContentBaseClassName,
                      dialogContentMaxHeightClassName,
                      dialogContentSizeClassNames[size],
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
                    {showCloseButton ? (
                      <DialogPrimitive.Close
                        className={dialogCloseClassName}
                        type="button"
                      >
                        <X aria-hidden="true" className="size-4" />
                        <span className="sr-only">Close</span>
                      </DialogPrimitive.Close>
                    ) : null}
                  </motion.div>
                </DialogPrimitive.Content>
              </div>
            </MotionConfig>
          </DialogPortal>
        ) : null}
      </AnimatePresence>
    );
  }
);
DialogContent.displayName = "DialogContent";

function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-2 pr-10 text-left", className)}
      {...props}
    />
  );
}

function DialogBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("-mx-1 min-h-0 flex-1 overflow-y-auto px-1", className)}
      {...props}
    />
  );
}

function DialogMedia({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-full bg-[color:color-mix(in_oklch,var(--dlg-foreground),transparent_90%)] text-[color:var(--dlg-foreground)] [&_svg]:block [&_svg]:size-5 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  );
}

function DialogFooter({
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

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Title
      className={cn(
        "font-semibold text-[1.35rem] text-[color:var(--dlg-foreground)] leading-tight tracking-[-0.03em]",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Description
      className={cn(
        "max-w-[46ch] text-[15px] text-[color:var(--dlg-muted-foreground)] leading-6",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
DialogDescription.displayName = "DialogDescription";

type DialogButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  closeOnClick?: boolean;
};

const DialogCancel = React.forwardRef<HTMLElement, DialogButtonProps>(
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
      <DialogPrimitive.Close
        {...props}
        asChild={asChild}
        className={asChild ? className : cn(dialogCancelClassName, className)}
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
      </DialogPrimitive.Close>
    );
  }
);
DialogCancel.displayName = "DialogCancel";

type DialogActionVariant = "default" | "destructive";

interface DialogActionProps extends DialogButtonProps {
  variant?: DialogActionVariant;
}

const DialogAction = React.forwardRef<HTMLElement, DialogActionProps>(
  (
    {
      asChild,
      children,
      className,
      closeOnClick = true,
      onClick,
      type = "button",
      variant = "default",
      ...props
    },
    ref
  ) => {
    const actionClassName =
      variant === "destructive"
        ? dialogDestructiveActionClassName
        : dialogActionClassName;

    return (
      <DialogPrimitive.Close
        {...props}
        asChild={asChild}
        className={asChild ? className : cn(actionClassName, className)}
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
      </DialogPrimitive.Close>
    );
  }
);
DialogAction.displayName = "DialogAction";

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogMedia,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogAction,
  DialogCancel,
  dialogActionClassName,
  dialogCancelClassName,
  dialogDestructiveActionClassName,
  dialogThemeClassName,
  dialogTriggerClassName,
  dialogTriggerSmClassName,
};
