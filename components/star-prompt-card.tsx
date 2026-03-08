"use client";

import { Star, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

import { LINK, SITE } from "@/constants";

const cardVariants = {
  hidden: {
    opacity: 0,
    x: 24,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    x: 16,
    scale: 0.96,
    transition: { duration: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export function StarPromptCard() {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          animate="visible"
          aria-label="Star Iconiq on GitHub"
          className="fixed right-6 bottom-24 z-50 hidden w-full max-w-[240px] overflow-hidden rounded-lg border border-neutral-200/80 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:right-8 sm:block lg:right-[80px] dark:border-neutral-700/80 dark:bg-neutral-900 dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
          exit="exit"
          initial="hidden"
          role="dialog"
          style={{ backdropFilter: "blur(8px)" }}
          variants={cardVariants}
        >
          <div className="relative p-2.5">
            {/* Accent line */}
            <div
              aria-hidden
              className="absolute top-0 left-0 h-full w-0.5 rounded-l-lg bg-primary/10 dark:bg-primary/20"
            />

            <button
              aria-label="Dismiss"
              className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-1 focus-visible:outline-primary dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              onClick={handleClose}
              type="button"
            >
              <X className="size-3.5" />
            </button>

            <motion.h3
              className="pr-6 font-sans font-semibold text-neutral-900 text-xs tracking-tight dark:text-white"
              variants={itemVariants}
            >
              Support {SITE.NAME} on GitHub
            </motion.h3>
            <motion.p
              className="mt-0.5 font-sans text-[11px] text-neutral-500 leading-snug dark:text-neutral-400"
              variants={itemVariants}
            >
              Star the repo to help others discover it and keep the project
              growing.{" "}
              <motion.span
                animate={{ scale: [1, 1.2, 1, 1.15, 1] }}
                aria-hidden
                className="inline-block"
                transition={{
                  duration: 1.2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 0.8,
                }}
              >
                ❤️
              </motion.span>
            </motion.p>

            <motion.div className="mt-2" variants={itemVariants}>
              <Link
                className="flex w-full items-center justify-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 font-medium font-sans text-[11px] text-neutral-900 transition-colors hover:bg-neutral-100 focus-visible:outline-1 focus-visible:outline-primary dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
                href={LINK.GITHUB}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Star aria-hidden className="size-3.5" strokeWidth={2} />
                Star on GitHub
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
