"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Slot } from "@radix-ui/react-slot";
import { X } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const dialogThemeClassName =
  "[--dlg-surface:#ffffff] [--dlg-foreground:#111111] [--dlg-border:#e3e7ec] [--dlg-ring:rgba(17,17,17,0.16)] [--dlg-muted-foreground:#6d7480] [--dlg-muted:#f5f7fa] [--color-accent:var(--dlg-muted)] [--color-accent-foreground:var(--dlg-foreground)] dark:[--dlg-surface:#0a0a0a] dark:[--dlg-foreground:#f6f3ec] dark:[--dlg-border:#2b2a25] dark:[--dlg-ring:rgba(246,243,236,0.18)] dark:[--dlg-muted-foreground:#9a958a] dark:[--dlg-muted:#1a1a18]";

const dialogContentClassName =
  "relative flex w-[min(100%,34rem)] max-w-xl flex-col gap-5 rounded-lg border border-[color:color-mix(in_oklch,var(--dlg-border),transparent_25%)] bg-[color:color-mix(in_oklch,var(--dlg-surface),transparent_4%)] p-6 text-[color:var(--dlg-foreground)] shadow-[0_32px_120px_rgba(15,23,42,0.18)] outline-none supports-[backdrop-filter]:bg-[color:color-mix(in_oklch,var(--dlg-surface),transparent_8%)] sm:p-7";

const dialogCloseClassName =
  "absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-md text-[color:var(--dlg-muted-foreground)] transition-colors hover:bg-accent/60 hover:text-[color:var(--dlg-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--dlg-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--dlg-surface)]";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const contentVariants = {
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

const childVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 20, stiffness: 300 },
  },
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

function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T>).current = value;
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
        defaultOpen={defaultOpen}
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
  ({ asChild, children, type = "button", ...props }, ref) => {
    return (
      <DialogPrimitive.Trigger
        {...props}
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
  ({ asChild, children, type = "button", ...props }, ref) => {
    return (
      <DialogPrimitive.Close
        {...props}
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

export interface DialogContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Popup>,
    "children" | "className" | "render"
  > {
  children: React.ReactNode;
  className?: string;
  open?: boolean;
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, className, open: _open, ...props }, ref) => {
    const { actionsRef, open } = useDialogContext();

    return (
      <DialogPrimitive.Portal>
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
                animate={open ? "visible" : "hidden"}
                className={cn(
                  backdropClassName,
                  "fixed inset-0 z-50 bg-black/52 backdrop-blur-[10px]"
                )}
                exit="hidden"
                initial="hidden"
                ref={(node) => {
                  setRef(backdropRef, node);
                }}
                style={backdropStyle}
                transition={{ duration: 0.25, ease: "easeOut" }}
                variants={overlayVariants}
              />
            );
          }}
        />
        <DialogPrimitive.Viewport className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4">
          <DialogPrimitive.Popup
            {...props}
            className={className}
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
                  animate={open ? "visible" : "exit"}
                  className={cn(
                    dialogThemeClassName,
                    dialogContentClassName,
                    popupClassName
                  )}
                  exit="exit"
                  initial="hidden"
                  onAnimationComplete={() => {
                    if (!open) {
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
            <DialogPrimitive.Close
              className={dialogCloseClassName}
              type="button"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </DialogPrimitive.Popup>
        </DialogPrimitive.Viewport>
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
      className={cn("flex flex-col gap-2 text-left", className)}
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

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
