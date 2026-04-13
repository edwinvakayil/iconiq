"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ComponentProps } from "react";
import { createContext, useContext, useState } from "react";

type CollapsibleCtx = { open: boolean };
const CollapsibleContext = createContext<CollapsibleCtx>({ open: false });

function Collapsible({
  open: openProp,
  defaultOpen,
  onOpenChange,
  ...props
}: ComponentProps<typeof CollapsiblePrimitive.Root>) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const handleChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <CollapsibleContext.Provider value={{ open: open ?? false }}>
      <CollapsiblePrimitive.Root
        data-slot="collapsible"
        onOpenChange={handleChange}
        open={open}
        {...props}
      />
    </CollapsibleContext.Provider>
  );
}

function CollapsibleTrigger({
  ...props
}: ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

// Smooth ease-out-expo — fast start, glides to a stop like flowing water
const waterEase = [0.22, 1, 0.36, 1] as const;

function CollapsibleContent({
  children,
  className,
}: Pick<
  ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>,
  "children" | "className"
>) {
  const { open } = useContext(CollapsibleContext);
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {open && (
        // Outer: height opens like a vessel filling — no bounce, pure flow
        <motion.div
          animate={{ height: "auto" }}
          data-slot="collapsible-content"
          exit={{ height: 0 }}
          initial={{ height: 0 }}
          style={{ overflow: "hidden" }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.9, ease: waterEase }
          }
        >
          {/* Inner: clip-path pours content in from top, drains from bottom on exit */}
          <motion.div
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            className={className}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.82, ease: waterEase, delay: 0.08 }
            }
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
