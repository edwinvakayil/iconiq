"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const controlCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[11px]";

const surfaceCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[12px]";

const dialogThemeClassName =
  "[--dlg-surface:#ffffff] [--dlg-foreground:#111111] [--dlg-border:#e3e7ec] [--dlg-ring:rgba(17,17,17,0.16)] [--dlg-muted-foreground:#6d7480] [--dlg-muted:#f5f7fa] [--color-accent:var(--dlg-muted)] [--color-accent-foreground:var(--dlg-foreground)] dark:[--dlg-surface:#0a0a0a] dark:[--dlg-foreground:#f6f3ec] dark:[--dlg-border:#2b2a25] dark:[--dlg-ring:rgba(246,243,236,0.18)] dark:[--dlg-muted-foreground:#9a958a] dark:[--dlg-muted:#1a1a18]";

const dialogContentClassName = cn(
  surfaceCornerClassName,
  "relative flex w-[min(100%,34rem)] max-w-xl flex-col gap-5 border border-[color:color-mix(in_oklch,var(--dlg-border),transparent_25%)] bg-[color:color-mix(in_oklch,var(--dlg-surface),transparent_4%)] p-6 text-[color:var(--dlg-foreground)] shadow-[0_32px_120px_rgba(15,23,42,0.18)] outline-none supports-[backdrop-filter]:bg-[color:color-mix(in_oklch,var(--dlg-surface),transparent_8%)] sm:p-7"
);

const dialogCloseClassName = cn(
  controlCornerClassName,
  "absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center text-[color:var(--dlg-muted-foreground)] transition-colors hover:bg-accent/60 hover:text-[color:var(--dlg-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--dlg-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--dlg-surface)]"
);

const dialogTriggerClassName = cn(
  controlCornerClassName,
  "inline-flex items-center justify-center bg-[color:var(--dlg-foreground)] px-4 py-2.5 font-medium text-[14px] text-[color:var(--dlg-surface)] tracking-[-0.01em] transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:bg-[color:color-mix(in_oklch,var(--dlg-foreground),transparent_10%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--dlg-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--dlg-surface)] disabled:pointer-events-none disabled:opacity-50"
);

const dialogTriggerSmClassName = cn(
  controlCornerClassName,
  "inline-flex h-8 min-h-8 translate-y-px items-center bg-[color:var(--dlg-foreground)] px-3 py-0 font-medium text-[13px] text-[color:var(--dlg-surface)] tracking-[-0.01em] transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:bg-[color:color-mix(in_oklch,var(--dlg-foreground),transparent_10%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--dlg-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--dlg-surface)] disabled:pointer-events-none disabled:opacity-50"
);

const dialogCancelClassName = cn(
  controlCornerClassName,
  "inline-flex min-h-11 items-center justify-center bg-[color:color-mix(in_oklch,var(--dlg-muted),transparent_45%)] px-4 py-2.5 font-medium text-[14px] text-[color:var(--dlg-muted-foreground)] tracking-[-0.01em] transition-colors duration-150 hover:bg-accent/60 hover:text-[color:var(--dlg-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--dlg-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--dlg-surface)] disabled:pointer-events-none disabled:opacity-50"
);

const dialogActionClassName = cn(
  controlCornerClassName,
  "inline-flex min-h-11 items-center justify-center bg-[color:var(--dlg-foreground)] px-4 py-2.5 font-medium text-[14px] text-[color:var(--dlg-surface)] tracking-[-0.01em] transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:bg-[color:color-mix(in_oklch,var(--dlg-foreground),transparent_10%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--dlg-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--dlg-surface)] disabled:pointer-events-none disabled:opacity-50"
);

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

const DialogTrigger = React.forwardRef<HTMLButtonElement, TriggerOrCloseProps>(
  ({ asChild, type = "button", ...props }, ref) => {
    return (
      <DialogPrimitive.Trigger
        {...props}
        asChild={asChild}
        ref={ref}
        type={asChild ? undefined : type}
      />
    );
  }
);
DialogTrigger.displayName = "DialogTrigger";

const DialogClose = React.forwardRef<HTMLButtonElement, TriggerOrCloseProps>(
  ({ asChild, type = "button", ...props }, ref) => {
    return (
      <DialogPrimitive.Close
        {...props}
        asChild={asChild}
        ref={ref}
        type={asChild ? undefined : type}
      />
    );
  }
);
DialogClose.displayName = "DialogClose";

const DialogPortal = DialogPrimitive.Portal;

export interface DialogContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    "children" | "className"
  > {
  children: React.ReactNode;
  className?: string;
  open?: boolean;
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, className, open: openProp, ...props }, ref) => {
    const context = useDialogContext();
    const open = openProp ?? context.open;

    return (
      <AnimatePresence initial={false}>
        {open ? (
          <DialogPortal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                animate="visible"
                className="fixed inset-0 z-50 bg-black/52 backdrop-blur-[10px]"
                exit="hidden"
                initial="hidden"
                transition={{ duration: 0.25, ease: "easeOut" }}
                variants={overlayVariants}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content
              className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4 outline-none"
              forceMount
              ref={ref}
              {...props}
            >
              <motion.div
                animate="visible"
                className={cn(
                  dialogThemeClassName,
                  dialogContentClassName,
                  className
                )}
                exit="exit"
                initial="hidden"
                variants={contentVariants}
              >
                {React.Children.map(children, (child) =>
                  child == null ? null : (
                    <motion.div variants={childVariants}>{child}</motion.div>
                  )
                )}
                <DialogPrimitive.Close
                  className={cn(dialogCloseClassName)}
                  type="button"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
              </motion.div>
            </DialogPrimitive.Content>
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

const DialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, type = "button", ...props }, ref) => {
  return (
    <DialogPrimitive.Close
      className={cn(dialogCancelClassName, className)}
      ref={ref}
      type={type}
      {...props}
    />
  );
});
DialogCancel.displayName = "DialogCancel";

const DialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, type = "button", ...props }, ref) => {
  return (
    <DialogPrimitive.Close
      className={cn(dialogActionClassName, className)}
      ref={ref}
      type={type}
      {...props}
    />
  );
});
DialogAction.displayName = "DialogAction";

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
  DialogAction,
  DialogCancel,
  dialogActionClassName,
  dialogCancelClassName,
  dialogThemeClassName,
  dialogTriggerClassName,
  dialogTriggerSmClassName,
};
