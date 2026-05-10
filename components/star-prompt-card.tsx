"use client";

import { ArrowUpRight, Star, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LINK, SITE } from "@/constants";

const STAR_PROMPT_SESSION_KEY = "iconiq:star-prompt:dismissed";

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 280,
      damping: 26,
      staggerChildren: 0.06,
      delayChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    y: 12,
    scale: 0.97,
    transition: { duration: 0.18 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

export function StarPromptCard() {
  const pathname = usePathname();
  const [visible, setVisible] = useState<boolean | null>(null);

  useEffect(() => {
    const dismissed =
      window.sessionStorage.getItem(STAR_PROMPT_SESSION_KEY) === "true";

    setVisible(!dismissed);
  }, []);

  const handleClose = () => {
    window.sessionStorage.setItem(STAR_PROMPT_SESSION_KEY, "true");
    setVisible(false);
  };

  if (pathname === "/" || visible === null) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          animate="visible"
          aria-label="Star Iconiq on GitHub"
          className="fixed right-5 bottom-24 z-50 hidden w-full max-w-[292px] overflow-hidden rounded-lg border border-border/80 bg-background shadow-[0_8px_24px_rgba(15,23,42,0.06)] sm:right-8 sm:block lg:right-10 xl:right-[76px] dark:shadow-[0_10px_28px_rgba(0,0,0,0.2)]"
          exit="exit"
          initial="hidden"
          role="complementary"
          variants={cardVariants}
        >
          <div className="px-4 py-3.5">
            <div className="flex items-center justify-between gap-3">
              <motion.div
                className="flex min-w-0 items-center gap-2"
                variants={itemVariants}
              >
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.16em]">
                  Open source note
                </span>
              </motion.div>
              <motion.div className="shrink-0" variants={itemVariants}>
                <button
                  aria-label="Dismiss star prompt"
                  className="inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onClick={handleClose}
                  type="button"
                >
                  <X className="size-3" />
                </button>
              </motion.div>
            </div>

            <motion.div className="mt-3.5 flex gap-3" variants={itemVariants}>
              <div className="w-px shrink-0 bg-border/80" />
              <div className="space-y-1.5">
                <h3 className="max-w-[15rem] font-medium text-[14px] text-foreground leading-5">
                  If {SITE.NAME} was useful, star the repository.
                </h3>
                <p className="max-w-[16rem] text-[12px] text-secondary leading-5">
                  That small gesture helps more people discover the library and
                  supports the project.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="mt-4 flex items-center justify-between border-border/70 border-t pt-3"
              variants={itemVariants}
            >
              <Link
                className="group inline-flex items-center gap-2 font-medium text-[12px] text-foreground transition-colors hover:text-foreground/70"
                href={LINK.GITHUB}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Star aria-hidden className="size-3.5" strokeWidth={2} />
                <span>Star on GitHub</span>
                <ArrowUpRight
                  aria-hidden
                  className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </motion.div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
