"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Slot } from "@radix-ui/react-slot";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

type Side = "top" | "bottom" | "left" | "right";
type TooltipTriggerElement = React.ReactElement<{
  "aria-describedby"?: string;
}>;

export interface TooltipProps {
  children: TooltipTriggerElement;
  content: string;
  side?: Side;
  delay?: number;
  className?: string;
}

const MAX_TOOLTIP_CHARACTERS = 80;

function isTooltipTriggerElement(
  node: React.ReactNode
): node is TooltipTriggerElement {
  return React.isValidElement(node) && node.type !== React.Fragment;
}

function mergeDescribedBy(...ids: Array<string | undefined>) {
  const merged = ids.filter(Boolean).join(" ");

  return merged.length > 0 ? merged : undefined;
}

export function Tooltip({
  children,
  content,
  side = "top",
  delay = 0.15,
  className,
}: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const tooltipId = React.useId();
  const normalizedContent = content.trim();

  if (!isTooltipTriggerElement(children)) {
    throw new Error(
      "Tooltip expects a single element child so it can forward hover, focus, and accessibility props."
    );
  }

  React.useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" &&
      (normalizedContent.length > MAX_TOOLTIP_CHARACTERS ||
        normalizedContent.includes("\n"))
    ) {
      console.warn(
        "Tooltip content should stay short, single-line, and non-interactive. Use Popover for longer or multiline content."
      );
    }
  }, [normalizedContent]);

  const childAriaDescribedBy = children.props["aria-describedby"];
  const triggerDescription = open
    ? mergeDescribedBy(childAriaDescribedBy, tooltipId)
    : childAriaDescribedBy;

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(true), delay * 1000);
  };
  const handleLeave = () => {
    clearTimeout(timeoutRef.current);
    setOpen(false);
  };

  React.useEffect(() => () => clearTimeout(timeoutRef.current), []);

  if (normalizedContent.length === 0) {
    return children;
  }

  return (
    <PopoverPrimitive.Root modal={false} onOpenChange={setOpen} open={open}>
      <PopoverPrimitive.Anchor asChild>
        <Slot
          aria-describedby={triggerDescription}
          onBlur={handleLeave}
          onFocus={handleEnter}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          {children}
        </Slot>
      </PopoverPrimitive.Anchor>

      <AnimatePresence>
        {open && (
          <PopoverPrimitive.Portal forceMount>
            <PopoverPrimitive.Content
              align="center"
              asChild
              avoidCollisions
              collisionPadding={12}
              forceMount
              onCloseAutoFocus={(event) => event.preventDefault()}
              onOpenAutoFocus={(event) => event.preventDefault()}
              side={side}
              sideOffset={10}
            >
              <motion.div
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                }}
                className={cn(
                  "group/tooltip pointer-events-none relative z-50 max-w-60 whitespace-normal rounded-lg bg-foreground px-3 py-1.5 font-medium text-background text-xs leading-snug shadow-[0_4px_24px_-4px_rgba(0,0,0,0.25)]",
                  className
                )}
                exit={{
                  opacity: 0,
                  scale: 0.92,
                  filter: "blur(4px)",
                }}
                id={tooltipId}
                initial={{
                  opacity: 0,
                  scale: 0.92,
                  filter: "blur(4px)",
                }}
                role="tooltip"
                style={{
                  transformOrigin:
                    "var(--radix-popover-content-transform-origin)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 24,
                  mass: 0.6,
                }}
              >
                <motion.span
                  animate={{ scale: 1 }}
                  className="absolute h-2 w-2 rotate-45 bg-foreground group-data-[side=bottom]/tooltip:-top-1 group-data-[side=left]/tooltip:top-1/2 group-data-[side=right]/tooltip:top-1/2 group-data-[side=left]/tooltip:-right-1 group-data-[side=top]/tooltip:-bottom-1 group-data-[side=bottom]/tooltip:left-1/2 group-data-[side=right]/tooltip:-left-1 group-data-[side=top]/tooltip:left-1/2 group-data-[side=bottom]/tooltip:-translate-x-1/2 group-data-[side=top]/tooltip:-translate-x-1/2 group-data-[side=left]/tooltip:-translate-y-1/2 group-data-[side=right]/tooltip:-translate-y-1/2"
                  exit={{ scale: 0 }}
                  initial={{ scale: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 28,
                    delay: 0.03,
                  }}
                />
                {normalizedContent}
              </motion.div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        )}
      </AnimatePresence>
    </PopoverPrimitive.Root>
  );
}

export { Tooltip as tooltip };
