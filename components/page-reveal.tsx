"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const PAGE_MOTION_EASE = [0.22, 1, 0.36, 1] as const;
const PAGE_REVEAL_INITIAL = {
  opacity: 0,
  y: 18,
  filter: "blur(10px)",
};
const PAGE_REVEAL_ANIMATE = {
  opacity: 1,
  y: 0,
  filter: "blur(0px)",
};
const PAGE_REVEAL_VIEWPORT = {
  once: true,
  amount: 0.16,
  margin: "0px 0px -10% 0px",
} as const;

function getPageRevealTransition(delay = 0) {
  return {
    opacity: {
      duration: 0.34,
      ease: PAGE_MOTION_EASE,
      delay,
    },
    y: {
      type: "spring" as const,
      stiffness: 220,
      damping: 26,
      mass: 0.92,
      delay,
    },
    filter: {
      duration: 0.44,
      ease: PAGE_MOTION_EASE,
      delay,
    },
  };
}

type PageRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  inView?: boolean;
};

export function PageReveal({
  children,
  className,
  delay = 0,
  inView = false,
}: PageRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate={inView ? undefined : PAGE_REVEAL_ANIMATE}
      className={className}
      initial={PAGE_REVEAL_INITIAL}
      transition={getPageRevealTransition(delay)}
      viewport={inView ? PAGE_REVEAL_VIEWPORT : undefined}
      whileInView={inView ? PAGE_REVEAL_ANIMATE : undefined}
    >
      {children}
    </motion.div>
  );
}

type PageStaggerProps = {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
};

export function PageStagger({
  children,
  className,
  delayChildren = 0,
  staggerChildren = 0.08,
}: PageStaggerProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate="visible"
      className={className}
      initial="hidden"
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren,
            staggerChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function PageStaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: PAGE_REVEAL_INITIAL,
        visible: {
          ...PAGE_REVEAL_ANIMATE,
          transition: getPageRevealTransition(),
        },
      }}
    >
      {children}
    </motion.div>
  );
}
