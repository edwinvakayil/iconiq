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
  "[--dlg-surface:#ffffff] [--dlg-foreground:#111111] [--dlg-border:#e3e7ec] [--dlg-muted:#f5f7fa] [--color-accent:var(--dlg-muted)] [--color-accent-foreground:var(--dlg-foreground)] [--dlg-muted-foreground:#6d7480] dark:[--dlg-surface:#171717] dark:[--dlg-foreground:#f6f3ec] dark:[--dlg-border:#2b2a25] dark:[--dlg-muted:#1a1a18] dark:[--dlg-muted-foreground:#9a958a]";

const dialogContentClassName = cn(
  surfaceCornerClassName,
  "relative flex w-[min(100%,32rem)] max-w-lg flex-col gap-4 overflow-y-auto border border-[color:var(--dlg-border)] bg-[color:var(--dlg-surface)] p-6 text-[color:var(--dlg-foreground)] shadow-2xl"
);

const dialogCloseClassName = cn(
  controlCornerClassName,
  "absolute top-4 right-4 p-1.5 text-[color:var(--dlg-foreground)] opacity-70 transition-colors hover:bg-accent/60 hover:opacity-100 focus:outline-none disabled:pointer-events-none"
);

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
const DialogPortal = DialogPrimitive.Portal;

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

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    open?: boolean;
  }
>(({ className, children, open, ...props }, ref) => (
  <AnimatePresence>
    {open && (
      <DialogPortal forceMount>
        <DialogPrimitive.Overlay asChild forceMount>
          <motion.div
            animate="visible"
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm dark:bg-black/60"
            exit="hidden"
            initial="hidden"
            transition={{ duration: 0.25, ease: "easeOut" }}
            variants={overlayVariants}
          />
        </DialogPrimitive.Overlay>
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-transparent p-4 outline-none"
          forceMount
          ref={ref}
          {...props}
        >
          <motion.div
            animate="visible"
            className={cn(
              dialogThemeClassName,
              dialogContentClassName,
              "max-h-[min(90svh,calc(100svh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-2rem))]",
              className
            )}
            exit="exit"
            initial="hidden"
            variants={contentVariants}
          >
            {React.Children.map(children, (child) => (
              <motion.div variants={childVariants}>{child}</motion.div>
            ))}
            <DialogPrimitive.Close className={dialogCloseClassName}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPortal>
    )}
  </AnimatePresence>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-start", className)}
    {...props}
  />
);

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-0 sm:space-x-2",
      className
    )}
    {...props}
  />
);

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    className={cn(
      "mb-4 font-semibold text-lg leading-none tracking-tight",
      className
    )}
    ref={ref}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    className={cn(
      "text-[color:var(--dlg-muted-foreground)] text-sm",
      className
    )}
    ref={ref}
    {...props}
  />
));
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
