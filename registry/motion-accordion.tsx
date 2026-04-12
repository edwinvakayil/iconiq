"use client";

import { AnimatePresence, motion } from "framer-motion";
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

export function Accordion({ items, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <div className={cn("mx-auto w-full max-w-2xl space-y-3", className)}>
      {items.map((item, index) => {
        const isOpen = openId === item.id;
        const contentId = `accordion-content-${item.id}`;
        return (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="group"
            initial={{ opacity: 0, y: 20 }}
            key={item.id}
            transition={{
              delay: index * 0.08,
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <motion.div
              className="overflow-hidden rounded-2xl border border-border/50 bg-transparent"
              layout
              transition={{
                layout: { type: "spring", stiffness: 200, damping: 25 },
              }}
            >
              <button
                aria-controls={contentId}
                aria-expanded={isOpen}
                className="flex w-full cursor-pointer items-center justify-between rounded-2xl px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={() => toggle(item.id)}
                type="button"
              >
                <motion.span
                  animate={{ x: isOpen ? 4 : 0 }}
                  className="pr-4 font-medium text-base text-foreground"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {item.title}
                </motion.span>
                <motion.div
                  animate={{
                    rotate: isOpen ? 45 : 0,
                    scale: isOpen ? 1.1 : 1,
                  }}
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center text-foreground"
                  transition={{ type: "spring", stiffness: 350, damping: 18 }}
                >
                  <Plus className="h-4 w-4 opacity-70" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    animate={{ height: "auto", opacity: 1 }}
                    className="overflow-hidden"
                    exit={{ height: 0, opacity: 0 }}
                    id={contentId}
                    initial={{ height: 0, opacity: 0 }}
                    transition={{
                      height: {
                        type: "spring",
                        stiffness: 180,
                        damping: 22,
                        mass: 0.8,
                      },
                      opacity: { duration: 0.2, delay: 0.05 },
                    }}
                  >
                    <div className="px-6 pb-5">
                      <p className="flex flex-wrap gap-x-[0.3em] text-muted-foreground text-sm leading-relaxed">
                        {item.content.split(" ").map((word, i) => (
                          <motion.span
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -4, filter: "blur(2px)" }}
                            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                            key={`${item.id}-${i}-${word}`}
                            transition={{
                              type: "spring",
                              stiffness: 260,
                              damping: 20,
                              delay: 0.06 + i * 0.018,
                            }}
                          >
                            {word}
                          </motion.span>
                        ))}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
