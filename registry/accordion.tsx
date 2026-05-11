"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

export type AccordionVariant = "default" | "editorial";

export interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  multiple?: boolean;
  variant?: AccordionVariant;
}

const contentShellTransition: Transition = {
  height: {
    type: "spring",
    stiffness: 138,
    damping: 27,
    mass: 0.98,
  },
  opacity: { duration: 0.26, ease: [0.18, 1, 0.32, 1] },
};

const contentMaskTransition: Transition = {
  duration: 0.38,
  ease: [0.16, 1, 0.3, 1],
};

const contentCopyTransition: Transition = {
  y: {
    type: "spring",
    stiffness: 146,
    damping: 23,
    mass: 0.98,
  },
  scale: {
    duration: 0.32,
    ease: [0.18, 1, 0.32, 1],
  },
  opacity: {
    duration: 0.22,
    ease: [0.18, 1, 0.32, 1],
    delay: 0.05,
  },
  filter: {
    duration: 0.28,
    ease: [0.18, 1, 0.32, 1],
    delay: 0.05,
  },
};

type AccordionRowProps = {
  item: AccordionItem;
  index: number;
  isEditorial: boolean;
  isOpen: boolean;
  baseId: string;
  onToggle: (id: string) => void;
};

function getRowClassName(index: number, isEditorial: boolean, isOpen: boolean) {
  return cn(
    "group",
    index !== 0 && "border-border/80 border-t",
    isEditorial &&
      isOpen &&
      "bg-linear-to-r from-transparent via-muted/20 to-transparent"
  );
}

function getTriggerClassName(isEditorial: boolean, isOpen: boolean) {
  if (isEditorial) {
    return isOpen ? "px-0 pt-6 pb-4" : "px-0 py-6";
  }

  return isOpen ? "px-1 pt-5 pb-3" : "px-1 py-5";
}

function getContentWrapClassName(isEditorial: boolean) {
  return isEditorial ? "pr-10 pb-6 pl-8 sm:pl-9" : "px-1 pr-12 pb-5";
}

function getContentMaskClassName(isEditorial: boolean) {
  return cn("overflow-hidden", isEditorial && "border-border/60 border-l pl-4");
}

function getContentCopyClassName(isEditorial: boolean) {
  return cn(
    "text-sm leading-relaxed will-change-transform",
    isEditorial ? "max-w-[60ch] text-foreground/72" : "text-muted-foreground"
  );
}

function AccordionTriggerLabel({
  isEditorial,
  isOpen,
  itemNumber,
  title,
}: {
  isEditorial: boolean;
  isOpen: boolean;
  itemNumber: string;
  title: string;
}) {
  if (isEditorial) {
    return (
      <div className="flex min-w-0 items-start gap-4">
        <span
          aria-hidden
          className="pt-1 font-mono text-[11px] text-muted-foreground/70 uppercase tabular-nums tracking-[0.24em]"
        >
          {itemNumber}
        </span>
        <motion.span
          animate={{ x: isOpen ? 4 : 0 }}
          className="pr-2 font-medium text-[15px] text-foreground leading-6 tracking-[-0.02em] sm:text-base"
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          {title}
        </motion.span>
      </div>
    );
  }

  return (
    <motion.span
      animate={{ x: 0 }}
      className="pr-4 font-medium text-[15px] text-foreground leading-6 tracking-[-0.02em] sm:text-base"
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      {title}
    </motion.span>
  );
}

function AccordionTriggerIndicator({
  isEditorial,
  isOpen,
}: {
  isEditorial: boolean;
  isOpen: boolean;
}) {
  if (isEditorial) {
    return (
      <motion.span
        animate={{
          opacity: isOpen ? 1 : 0.7,
          rotate: isOpen ? 180 : 0,
          y: isOpen ? 1 : 0,
        }}
        aria-hidden
        className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground"
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
      >
        <ChevronDown className="h-4 w-4" />
      </motion.span>
    );
  }

  return (
    <motion.div
      animate={{ opacity: isOpen ? 1 : 0.72 }}
      aria-hidden
      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-foreground"
      transition={{ type: "spring", stiffness: 360, damping: 24 }}
    >
      <span className="relative flex h-3 w-3 items-center justify-center">
        <span className="absolute h-px w-3 rounded-full bg-current" />
        <motion.span
          animate={{
            opacity: isOpen ? 0 : 1,
            scaleY: isOpen ? 0 : 1,
          }}
          className="absolute h-3 w-px origin-center rounded-full bg-current"
          transition={{
            duration: 0.18,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </span>
    </motion.div>
  );
}

function AccordionRow({
  item,
  index,
  isEditorial,
  isOpen,
  baseId,
  onToggle,
}: AccordionRowProps) {
  const contentId = `${baseId}-content-${item.id}`;
  const triggerId = `${baseId}-trigger-${item.id}`;
  const itemNumber = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={getRowClassName(index, isEditorial, isOpen)}
      initial={{ opacity: 0, y: 12 }}
      transition={{
        delay: index * 0.05,
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <button
        aria-controls={contentId}
        aria-expanded={isOpen}
        className={cn(
          "flex w-full cursor-pointer items-start justify-between gap-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
          getTriggerClassName(isEditorial, isOpen)
        )}
        id={triggerId}
        onClick={() => onToggle(item.id)}
        type="button"
      >
        <AccordionTriggerLabel
          isEditorial={isEditorial}
          isOpen={isOpen}
          itemNumber={itemNumber}
          title={item.title}
        />
        <AccordionTriggerIndicator isEditorial={isEditorial} isOpen={isOpen} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            animate={{
              height: "auto",
              opacity: 1,
              clipPath: "inset(0% 0% 0% 0%)",
            }}
            aria-labelledby={triggerId}
            className="overflow-hidden"
            exit={{
              height: 0,
              opacity: 0,
              clipPath: "inset(0% 0% 100% 0%)",
            }}
            id={contentId}
            initial={{
              height: 0,
              opacity: 0,
              clipPath: "inset(0% 0% 100% 0%)",
            }}
            role="region"
            transition={contentShellTransition}
          >
            <div className={getContentWrapClassName(isEditorial)}>
              <motion.div
                animate={{
                  clipPath: "inset(0% 0% 0% 0%)",
                  opacity: 1,
                }}
                className={getContentMaskClassName(isEditorial)}
                exit={{
                  clipPath: "inset(0% 100% 0% 0%)",
                  opacity: 0.68,
                }}
                initial={{
                  clipPath: "inset(0% 100% 0% 0%)",
                  opacity: 0.68,
                }}
                transition={contentMaskTransition}
              >
                <motion.p
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                  }}
                  className={getContentCopyClassName(isEditorial)}
                  exit={{
                    opacity: 0,
                    y: -2,
                    scale: 0.996,
                    filter: "blur(1.5px)",
                  }}
                  initial={{
                    opacity: 0,
                    y: 7,
                    scale: 0.998,
                    filter: "blur(3px)",
                  }}
                  transition={contentCopyTransition}
                >
                  {item.content}
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Accordion({
  items,
  className,
  multiple = false,
  variant = "default",
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const baseId = useId();
  const isEditorial = variant === "editorial";

  const toggle = (id: string) =>
    setOpenItems((current) => {
      if (current.includes(id)) {
        return current.filter((itemId) => itemId !== id);
      }

      return multiple ? [...current, id] : [id];
    });

  return (
    <div className={cn("mx-auto w-full max-w-2xl", className)}>
      {items.map((item, index) => (
        <AccordionRow
          baseId={baseId}
          index={index}
          isEditorial={isEditorial}
          isOpen={openItems.includes(item.id)}
          item={item}
          key={item.id}
          onToggle={toggle}
        />
      ))}
    </div>
  );
}
