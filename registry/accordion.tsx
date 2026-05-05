"use client";

import { Plus } from "lucide-react";
import { AnimatePresence, motion, type Transition } from "motion/react";
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
                animate={{ x: 0 }}
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
                    <motion.div
                      animate={{
                        clipPath: "inset(0% 0% 0% 0%)",
                        opacity: 1,
                      }}
                      className="overflow-hidden"
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
                        className="text-muted-foreground text-sm leading-relaxed will-change-transform"
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
      })}
    </div>
  );
}
