"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Slot } from "@radix-ui/react-slot";
import { X } from "lucide-react";
import {
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
  actionsRef: React.RefObject<DialogPrimitive.Root.Actions | null>;
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

type PopupRenderProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
};

type BackdropRenderProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
};

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
}

function resolvePopupProps(popupProps: PopupRenderProps) {
  const {
    children: popupChildren,
    className: popupClassName,
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
    ref: popupRef,
    style: popupStyle,
    ...resolvedPopupProps
  } = popupProps;

  return {
    popupChildren,
    popupClassName,
    popupRef,
    popupStyle,
    resolvedPopupProps,
  };
}

function resolveBackdropProps(backdropProps: BackdropRenderProps) {
  const {
    className: backdropClassName,
    onAnimationEnd: _onAnimationEnd,
    onAnimationIteration: _onAnimationIteration,
    onAnimationStart: _onAnimationStart,
    onDrag: _onDrag,
    onDragEnd: _onDragEnd,
    onDragStart: _onDragStart,
    ref: backdropRef,
    style: backdropStyle,
    ...resolvedBackdropProps
  } = backdropProps;

  return {
    backdropClassName,
    backdropRef,
    backdropStyle,
    resolvedBackdropProps,
  };
}

function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    for (const ref of refs) {
      setRef(ref, value);
    }
  };
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
  const actionsRef = React.useRef<DialogPrimitive.Root.Actions | null>(null);
  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = isControlled ? openProp : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (
      nextOpen: boolean,
      eventDetails: DialogPrimitive.Root.ChangeEventDetails
    ) => {
      if (!nextOpen) {
        eventDetails.preventUnmountOnClose();
      }

      onOpenChange?.(nextOpen);

      if (!(eventDetails.isCanceled || isControlled)) {
        setUncontrolledOpen(nextOpen);
      }
    },
    [isControlled, onOpenChange]
  );

  return (
    <DialogContext.Provider value={{ actionsRef, open }}>
      <DialogPrimitive.Root
        {...props}
        actionsRef={actionsRef}
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

type DialogTriggerRef = React.ComponentProps<
  typeof DialogPrimitive.Trigger
>["ref"];

const DialogTrigger = React.forwardRef<HTMLElement, TriggerOrCloseProps>(
  ({ asChild, children, className, type = "button", ...props }, ref) => {
    return (
      <DialogPrimitive.Trigger
        {...props}
        className={
          asChild
            ? cn(dialogThemeClassName, className)
            : cn(dialogThemeClassName, className ?? dialogTriggerClassName)
        }
        ref={ref as DialogTriggerRef}
        render={asChild ? <Slot /> : undefined}
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
        className={cn(dialogThemeClassName, className)}
        ref={ref}
        render={asChild ? <Slot /> : undefined}
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
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Backdrop>,
    "render"
  > {
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
      <DialogPrimitive.Backdrop
        {...props}
        render={(backdropProps) => {
          const {
            backdropClassName,
            backdropRef,
            backdropStyle,
            resolvedBackdropProps,
          } = resolveBackdropProps(backdropProps);

          return (
            <motion.div
              {...resolvedBackdropProps}
              animate={open ? "visible" : "hidden"}
              className={cn(
                backdropClassName,
                "fixed inset-0 z-50 bg-black/52",
                className
              )}
              initial="hidden"
              ref={(node) => {
                setRef(backdropRef, node);
                setRef(ref, node);
              }}
              style={backdropStyle}
              variants={overlayVariantConfig}
            />
          );
        }}
      />
    );
  }
);
DialogOverlay.displayName = "DialogOverlay";

export interface DialogContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Popup>,
    "children" | "className" | "render"
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
    const { actionsRef, open: contextOpen } = useDialogContext();
    const resolvedOpen = openProp ?? contextOpen;
    const [present, setPresent] = React.useState(resolvedOpen);
    const hasOpenedRef = React.useRef(resolvedOpen);
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

    React.useEffect(() => {
      if (resolvedOpen) {
        setPresent(true);
        hasOpenedRef.current = true;
      }
    }, [resolvedOpen]);

    if (!present) {
      return null;
    }

    const contentAnimationState = resolvedOpen
      ? "visible"
      : hasOpenedRef.current
        ? "exit"
        : "hidden";

    return (
      <DialogPrimitive.Portal>
        <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
          <DialogPrimitive.Backdrop
            render={(backdropProps) => {
              const {
                backdropClassName,
                backdropRef,
                backdropStyle,
                resolvedBackdropProps,
              } = resolveBackdropProps(backdropProps);

              return (
                <motion.div
                  {...resolvedBackdropProps}
                  animate={resolvedOpen ? "visible" : "hidden"}
                  className={cn(
                    backdropClassName,
                    "fixed inset-0 z-50 bg-black/52",
                    !resolvedOpen && "pointer-events-none"
                  )}
                  initial="hidden"
                  ref={(node) => {
                    setRef(backdropRef, node);
                  }}
                  style={backdropStyle}
                  variants={overlayVariantConfig}
                />
              );
            }}
          />
          <DialogPrimitive.Viewport className="pointer-events-none fixed inset-0 z-[51] grid place-items-center overflow-y-auto overscroll-contain p-4">
            <DialogPrimitive.Popup
              {...props}
              finalFocus
              render={(popupProps) => {
                const {
                  popupChildren,
                  popupClassName,
                  popupRef,
                  popupStyle,
                  resolvedPopupProps,
                } = resolvePopupProps(popupProps);

                return (
                  <motion.div
                    {...resolvedPopupProps}
                    animate={contentAnimationState}
                    className={cn(
                      dialogThemeClassName,
                      dialogContentBaseClassName,
                      dialogContentMaxHeightClassName,
                      dialogContentSizeClassNames[size],
                      "pointer-events-auto",
                      className,
                      popupClassName
                    )}
                    initial="hidden"
                    onAnimationComplete={(definition) => {
                      if (!resolvedOpen && definition === "exit") {
                        actionsRef.current?.unmount();
                        setPresent(false);
                      }
                    }}
                    ref={composeRefs(popupRef, ref)}
                    style={{
                      ...popupStyle,
                      transformOrigin: "center center",
                    }}
                    variants={contentVariantConfig}
                  >
                    {popupChildren}
                  </motion.div>
                );
              }}
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
            </DialogPrimitive.Popup>
          </DialogPrimitive.Viewport>
        </MotionConfig>
      </DialogPrimitive.Portal>
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

type DialogCloseRef = React.ComponentProps<typeof DialogPrimitive.Close>["ref"];

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
        className={cn(dialogCancelClassName, className)}
        onClick={(event) => {
          onClick?.(event);

          if (!closeOnClick) {
            event.preventDefault();
          }
        }}
        ref={ref as DialogCloseRef}
        render={asChild ? <Slot /> : undefined}
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
        className={cn(actionClassName, className)}
        onClick={(event) => {
          onClick?.(event);

          if (!closeOnClick) {
            event.preventDefault();
          }
        }}
        ref={ref as DialogCloseRef}
        render={asChild ? <Slot /> : undefined}
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
