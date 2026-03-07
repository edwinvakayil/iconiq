"use client";

import { AnimatePresence, motion } from "motion/react";
import { Star, X } from "lucide-react";
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
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="dialog"
          aria-label="Star Iconiq on GitHub"
          className="fixed bottom-24 right-6 z-50 w-full max-w-[240px] overflow-hidden rounded-lg border border-neutral-200/80 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:border-neutral-700/80 dark:bg-neutral-900 dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] sm:right-8 lg:right-[80px]"
          style={{ backdropFilter: "blur(8px)" }}
        >
          <div className="relative p-2.5">
            {/* Accent line */}
            <div
              className="absolute top-0 left-0 h-full w-0.5 rounded-l-lg bg-primary/10 dark:bg-primary/20"
              aria-hidden
            />

            <button
              type="button"
              aria-label="Dismiss"
              className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-1 focus-visible:outline-primary dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              onClick={handleClose}
            >
              <X className="size-3.5" />
            </button>

            <motion.h3
              variants={itemVariants}
              className="pr-6 font-sans font-semibold text-neutral-900 text-xs tracking-tight dark:text-white"
            >
              Support {SITE.NAME} on GitHub
            </motion.h3>
            <motion.p
              variants={itemVariants}
              className="mt-0.5 font-sans text-neutral-500 text-[11px] leading-snug dark:text-neutral-400"
            >
              Star the repo to help others discover it and keep the project
              growing.{" "}
              <motion.span
                aria-hidden
                className="inline-block"
                animate={{ scale: [1, 1.2, 1, 1.15, 1] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  repeatDelay: 0.8,
                }}
              >
                ❤️
              </motion.span>
            </motion.p>

            <motion.div variants={itemVariants} className="mt-2">
              <Link
                href={LINK.GITHUB}
                rel="noopener noreferrer"
                target="_blank"
                className="flex w-full items-center justify-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 font-sans font-medium text-neutral-900 text-[11px] transition-colors hover:bg-neutral-100 focus-visible:outline-1 focus-visible:outline-primary dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
              >
                <Star className="size-3.5" strokeWidth={2} aria-hidden />
                Star on GitHub
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
