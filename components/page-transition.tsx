"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <motion.div className="relative min-h-0 w-full min-w-0" key={pathname}>
      <motion.div
        animate={
          reduce
            ? undefined
            : {
                opacity: 1,
                scaleX: 1,
                y: 0,
              }
        }
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 origin-top bg-[radial-gradient(75%_100%_at_50%_0%,rgba(17,17,17,0.06),transparent_72%)] blur-2xl dark:bg-[radial-gradient(75%_100%_at_50%_0%,rgba(255,255,255,0.06),transparent_72%)]"
        initial={
          reduce
            ? false
            : {
                opacity: 0,
                scaleX: 0.96,
                y: -8,
              }
        }
        transition={
          reduce
            ? { duration: 0 }
            : {
                duration: 0.62,
                ease: [0.22, 1, 0.36, 1],
              }
        }
      />

      <motion.div
        animate={
          reduce
            ? { opacity: 1, y: 0 }
            : {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                scale: 1,
                clipPath: "inset(0% 0% 0% 0%)",
              }
        }
        className="min-h-0 w-full min-w-0"
        initial={
          reduce
            ? false
            : {
                opacity: 0,
                y: 22,
                filter: "blur(12px)",
                scale: 0.994,
                clipPath: "inset(0% 0% 5% 0%)",
              }
        }
        transition={
          reduce
            ? { duration: 0 }
            : {
                opacity: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
                y: {
                  type: "spring",
                  stiffness: 180,
                  damping: 24,
                  mass: 0.92,
                },
                scale: {
                  type: "spring",
                  stiffness: 220,
                  damping: 24,
                  mass: 0.9,
                },
                filter: { duration: 0.44, ease: [0.22, 1, 0.36, 1] },
                clipPath: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              }
        }
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
