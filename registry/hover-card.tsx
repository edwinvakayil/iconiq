"use client";
import { Slot } from "@radix-ui/react-slot";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

type HoverCardContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const HoverCardContext = React.createContext<HoverCardContextValue | null>(
  null
);

const useHoverCard = () => {
  const context = React.useContext(HoverCardContext);

  if (!context) {
    throw new Error("HoverCard components must be used inside HoverCard");
  }

  return context;
};

type HoverCardProps = {
  className?: string;
  openDelay?: number;
  closeDelay?: number;
  children?: React.ReactNode;
};

const HoverCard = ({
  className,
  openDelay = 80,
  closeDelay = 120,
  children,
}: HoverCardProps) => {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = React.useCallback(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
  }, []);

  const show = () => {
    clearTimer();
    timeoutRef.current = setTimeout(() => setOpen(true), openDelay);
  };

  const hide = () => {
    clearTimer();
    timeoutRef.current = setTimeout(() => setOpen(false), closeDelay);
  };

  React.useEffect(() => clearTimer, [clearTimer]);

  return (
    <HoverCardContext.Provider value={{ open, setOpen }}>
      <span
        className={cn("relative inline-block w-fit", className)}
        onBlur={hide}
        onFocus={show}
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        {children}
      </span>
    </HoverCardContext.Provider>
  );
};

type HoverCardTriggerProps = React.ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean;
};

const HoverCardTrigger = React.forwardRef<
  HTMLButtonElement,
  HoverCardTriggerProps
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn("inline-flex cursor-pointer items-center", className)}
      ref={ref}
      {...props}
    />
  );
});
HoverCardTrigger.displayName = "HoverCardTrigger";

type HoverCardContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof motion.div>,
  "initial" | "animate" | "exit" | "transition"
>;

const HoverCardContent = React.forwardRef<
  HTMLDivElement,
  HoverCardContentProps
>(({ className, children, ...props }, ref) => {
  const { open } = useHoverCard();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          className={cn(
            "absolute top-full left-1/2 z-50 mt-3 w-72 -translate-x-1/2 rounded-xl border border-border bg-white p-4 text-foreground shadow-2xl outline-none dark:bg-black",
            className
          )}
          exit={{ opacity: 0, y: 8, scale: 0.97, filter: "blur(6px)" }}
          initial={{ opacity: 0, y: 10, scale: 0.96, filter: "blur(8px)" }}
          ref={ref}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 24,
            mass: 0.55,
          }}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
});
HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardTrigger, HoverCardContent };
