"use client";

import {
  AnimatePresence,
  motion,
  type Transition,
  type Variants,
} from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

const contentShellTransition: Transition = {
  height: {
    type: "spring",
    stiffness: 170,
    damping: 24,
    mass: 0.82,
  },
  opacity: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
};

const contentTextVariants: Variants = {
  closed: {
    opacity: 0,
    y: -6,
    filter: "blur(6px)",
    transition: {
      duration: 0.16,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.008,
      staggerDirection: -1,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.04,
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
      delayChildren: 0.015,
      staggerChildren: 0.014,
    },
  },
};

const contentWordVariants: Variants = {
  closed: {
    opacity: 0,
    y: 10,
    filter: "blur(6px)",
  },
  open: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 250,
      damping: 22,
      mass: 0.8,
    },
  },
};

export function Accordion({ items, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) =>
    setOpenId((current) => (current === id ? null : id));

  return (
    <div className={cn("mx-auto w-full max-w-2xl", className)}>
      {items.map((item, index) => {
        const isOpen = openId === item.id;
        const contentId = `accordion-content-${item.id}`;
        const triggerId = `accordion-trigger-${item.id}`;

        return (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={cn("group", index !== 0 && "border-border/80 border-t")}
            initial={{ opacity: 0, y: 12 }}
            key={item.id}
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
                "flex w-full cursor-pointer items-start justify-between gap-6 px-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                isOpen ? "pt-5 pb-3" : "py-5"
              )}
              id={triggerId}
              onClick={() => toggle(item.id)}
              type="button"
            >
              <motion.span
                animate={{ x: isOpen ? 6 : 0 }}
                className="pr-4 font-medium text-[15px] text-foreground leading-6 tracking-[-0.02em] sm:text-base"
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              >
                {item.title}
              </motion.span>
              <motion.div
                animate={{
                  rotate: isOpen ? 45 : 0,
                  opacity: isOpen ? 1 : 0.72,
                }}
                aria-hidden
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-foreground"
                transition={{ type: "spring", stiffness: 360, damping: 24 }}
              >
                <Plus className="h-4 w-4" />
              </motion.div>
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
                  <div className="px-1 pr-12 pb-5">
                    <motion.p
                      animate="open"
                      className="flex flex-wrap gap-x-[0.3em] text-muted-foreground text-sm leading-relaxed will-change-transform"
                      exit="closed"
                      initial="closed"
                      variants={contentTextVariants}
                    >
                      {item.content.split(" ").map((word, i) => (
                        <motion.span
                          key={`${item.id}-${i}-${word}`}
                          variants={contentWordVariants}
                        >
                          {word}
                        </motion.span>
                      ))}
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
