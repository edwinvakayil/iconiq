"use client";

import { ArrowUpRight, Star, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LINK, SITE } from "@/constants";

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 320,
      damping: 28,
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: 14,
    scale: 0.96,
    transition: { duration: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

export function StarPromptCard() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
  };

  if (pathname === "/") return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          animate="visible"
          aria-label="Star Iconiq on GitHub"
          className="fixed right-6 bottom-24 z-50 hidden w-full max-w-[292px] overflow-hidden border border-neutral-200/80 bg-white shadow-[0_20px_50px_rgba(17,17,17,0.08)] sm:right-8 sm:block lg:right-[80px] dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
          exit="exit"
          initial="hidden"
          role="complementary"
          variants={cardVariants}
        >
          <div className="space-y-4 p-4">
            <div className="flex items-start justify-between gap-4">
              <motion.div className="space-y-2" variants={itemVariants}>
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]">
                  Open Source
                </p>
                <div className="space-y-1.5">
                  <h3 className="max-w-[15rem] text-[15px] text-foreground tracking-[-0.03em]">
                    If {SITE.NAME} is useful, star the repository.
                  </h3>
                  <p className="max-w-[16rem] text-[13px] text-secondary leading-5">
                    It helps more people discover the library and supports the
                    project long term.
                  </p>
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <button
                  aria-label="Dismiss"
                  className="inline-flex size-8 items-center justify-center rounded-full bg-neutral-100/85 text-neutral-400 transition-colors hover:bg-neutral-200/80 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-neutral-900 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                  onClick={handleClose}
                  type="button"
                >
                  <X className="size-3.5" />
                </button>
              </motion.div>
            </div>

            <motion.div
              className="border-neutral-200/80 border-t border-dashed pt-3 dark:border-neutral-800"
              variants={itemVariants}
            >
              <Link
                className="group flex items-center gap-3 text-foreground transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                href={LINK.GITHUB}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="inline-flex size-9 items-center justify-center border border-neutral-200/80 bg-neutral-50 text-foreground transition-colors group-hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:group-hover:bg-neutral-800">
                  <Star aria-hidden className="size-3.5" strokeWidth={2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-[13px] tracking-[-0.02em]">
                    Star on GitHub
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    Open the repo in a new tab
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </motion.div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
