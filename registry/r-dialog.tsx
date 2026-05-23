"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { registryTheme } from "@/lib/registry-theme";
import { cn } from "@/lib/utils";

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
  reduceMotion: boolean;
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
    >,
    ReducedMotionProp {
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
  reducedMotion,
  ...props
}: DialogProps) {
  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = isControlled ? openProp : uncontrolledOpen;
  const reduceMotion = useResolvedReducedMotion(reducedMotion);

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
    <ReducedMotionConfig reducedMotion={reducedMotion}>
      <DialogContext.Provider value={{ open, reduceMotion }}>
        <DialogPrimitive.Root
          {...props}
          defaultOpen={defaultOpen}
          onOpenChange={handleOpenChange}
          open={open}
        >
          {children}
        </DialogPrimitive.Root>
      </DialogContext.Provider>
    </ReducedMotionConfig>
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
    >,
    ReducedMotionProp {
  children: React.ReactNode;
  className?: string;
  open?: boolean;
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, className, open: openProp, reducedMotion, ...props }, ref) => {
    const context = useDialogContext();
    const open = openProp ?? context.open;

    return (
      <ReducedMotionConfig reducedMotion={reducedMotion}>
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
                    registryTheme,
                    "relative flex w-[min(100%,34rem)] max-w-xl flex-col gap-5 rounded-[12px] border border-border/75 bg-background/96 p-6 text-foreground shadow-[0_32px_120px_rgba(15,23,42,0.18)] supports-[backdrop-filter]:bg-background/92 sm:p-7 dark:bg-neutral-950/94",
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
                    className={cn(
                      "absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors",
                      "hover:bg-muted/70 hover:text-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    )}
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
      </ReducedMotionConfig>
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
        "font-semibold text-[1.35rem] text-foreground leading-tight tracking-[-0.03em]",
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
        "max-w-[46ch] text-[15px] text-muted-foreground leading-6",
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
