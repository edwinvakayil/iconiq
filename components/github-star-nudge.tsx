"use client";

import { Star, X } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LINK, SITE } from "@/constants";
import { recordGithubClick } from "@/lib/record-github-click";
import { cn } from "@/lib/utils";

const DISMISS_STORAGE_KEY = "iconiq:github-star-nudge-dismissed";
const NUDGE_ENTRY_DELAY_MS = 1200;
const NUDGE_MIN_WIDTH_QUERY = "(min-width: 768px)";

const nudgeShellVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 72,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 320,
      damping: 32,
      mass: 0.85,
    },
  },
  exit: {
    opacity: 0,
    x: 72,
    scale: 0.98,
    transition: {
      duration: 0.22,
      ease: [0.32, 0, 0.67, 0],
    },
  },
};

export function GitHubStarNudge() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname === "/") {
      setVisible(false);
      return;
    }

    if (localStorage.getItem(DISMISS_STORAGE_KEY) === "1") {
      setVisible(false);
      return;
    }

    setVisible(false);

    const mediaQuery = window.matchMedia(NUDGE_MIN_WIDTH_QUERY);

    const syncVisibility = () => {
      if (!mediaQuery.matches) {
        setVisible(false);
        return;
      }

      if (localStorage.getItem(DISMISS_STORAGE_KEY) === "1") {
        setVisible(false);
        return;
      }

      setVisible(true);
    };

    const timer = window.setTimeout(syncVisibility, NUDGE_ENTRY_DELAY_MS);
    mediaQuery.addEventListener("change", syncVisibility);

    return () => {
      window.clearTimeout(timer);
      mediaQuery.removeEventListener("change", syncVisibility);
    };
  }, [pathname]);

  if (pathname === "/") {
    return null;
  }

  const dismiss = () => {
    localStorage.setItem(DISMISS_STORAGE_KEY, "1");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.aside
          animate="visible"
          className={cn(
            "group/nudge fixed right-4 bottom-4 z-40 hidden w-[14.75rem] max-w-[calc(100vw-2rem)] md:block",
            "rounded-2xl border-[0.5px] border-border/90 bg-background/95 p-3 pr-9",
            "shadow-[0_10px_30px_-20px_rgba(15,23,42,0.22)] backdrop-blur-md",
            "supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[18px]",
            "sm:right-6 sm:bottom-6"
          )}
          exit="exit"
          initial="hidden"
          role="status"
          variants={nudgeShellVariants}
          whileHover={{ y: -1 }}
        >
          <button
            aria-label="Dismiss GitHub star prompt"
            className={cn(
              "absolute top-2 right-2 inline-flex size-6 items-center justify-center rounded-md",
              "text-muted-foreground/70 transition-colors",
              "hover:bg-muted/70 hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
            onClick={dismiss}
            type="button"
          >
            <X aria-hidden className="size-3" />
          </button>

          <a
            aria-label={`Star ${SITE.NAME} on GitHub`}
            className={cn(
              "flex items-start gap-2 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
            href={LINK.GITHUB}
            onClick={recordGithubClick}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="mt-0.5 inline-flex shrink-0">
              <Star
                aria-hidden
                className="size-3.5 transition-[color,fill] duration-200 group-hover/nudge:fill-foreground/15 group-hover/nudge:text-foreground"
                strokeWidth={1.75}
              />
            </span>
            <span className="min-w-0">
              <span className="block font-medium text-[12px] text-foreground tracking-[-0.02em]">
                Like what you see?
              </span>
              <span className="mt-0.5 block text-[11px] text-muted-foreground leading-snug tracking-[-0.01em]">
                Consider leaving a star — it&apos;s free and means a lot.
              </span>
            </span>
          </a>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
