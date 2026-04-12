"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="min-h-0 w-full min-w-0"
      initial={reduce ? false : { opacity: 0, y: 10 }}
      key={pathname}
      transition={
        reduce
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 340,
              damping: 34,
              mass: 0.82,
            }
      }
    >
      {children}
    </motion.div>
  );
}
