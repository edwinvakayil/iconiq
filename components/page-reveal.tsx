"use client";

import { motion, useReducedMotion } from "motion/react";
import { createContext, type ReactNode, useContext } from "react";

import type { MotionTier } from "@/lib/motion-tier";
import { cn } from "@/lib/utils";
import { useMotionTier } from "@/providers/motion-tier";

const PAGE_MOTION_EASE = [0.22, 1, 0.36, 1] as const;
const PAGE_REVEAL_INITIAL = { opacity: 0, y: 8 };
const PAGE_REVEAL_LITE_INITIAL = { opacity: 0 };
const PAGE_REVEAL_ANIMATE = { opacity: 1, y: 0 };
const PAGE_REVEAL_LITE_ANIMATE = { opacity: 1 };
const PAGE_REVEAL_VIEWPORT = {
  once: true,
  amount: 0.12,
  margin: "0px 0px -4% 0px",
} as const;

const PageStaggerEnabledContext = createContext(true);

function getPageRevealTransition(tier: MotionTier, delay = 0) {
  if (tier === "lite") {
    return {
      duration: 0.16,
      ease: PAGE_MOTION_EASE,
      delay,
    };
  }

  return {
    opacity: {
      duration: 0.2,
      ease: PAGE_MOTION_EASE,
      delay,
    },
    y: {
      duration: 0.2,
      ease: PAGE_MOTION_EASE,
      delay,
    },
  };
}

function shouldAnimatePageReveal(
  tier: MotionTier,
  prefersReducedMotion: boolean | null,
  inView: boolean
) {
  if (prefersReducedMotion || tier === "none") {
    return false;
  }

  if (tier === "lite" && inView) {
    return false;
  }

  return true;
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
  const tier = useMotionTier();
  const prefersReducedMotion = useReducedMotion();
  const animate = shouldAnimatePageReveal(tier, prefersReducedMotion, inView);
  const isLite = tier === "lite";

  if (!animate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate={inView ? undefined : PAGE_REVEAL_ANIMATE}
      className={className}
      initial={isLite ? PAGE_REVEAL_LITE_INITIAL : PAGE_REVEAL_INITIAL}
      transition={getPageRevealTransition(tier, delay)}
      viewport={inView ? PAGE_REVEAL_VIEWPORT : undefined}
      whileInView={
        inView
          ? isLite
            ? PAGE_REVEAL_LITE_ANIMATE
            : PAGE_REVEAL_ANIMATE
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}

type PageStaggerProps = {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  enabled?: boolean;
  staggerChildren?: number;
};

export function PageStagger({
  children,
  className,
  delayChildren = 0,
  enabled = true,
  staggerChildren = 0.06,
}: PageStaggerProps) {
  const tier = useMotionTier();
  const prefersReducedMotion = useReducedMotion();
  const staggerEnabled =
    !prefersReducedMotion && enabled && tier !== "none" && tier !== "lite";

  if (!staggerEnabled) {
    return (
      <PageStaggerEnabledContext.Provider value={false}>
        <div className={className}>{children}</div>
      </PageStaggerEnabledContext.Provider>
    );
  }

  return (
    <PageStaggerEnabledContext.Provider value>
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
    </PageStaggerEnabledContext.Provider>
  );
}

export function PageStaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const tier = useMotionTier();
  const prefersReducedMotion = useReducedMotion();
  const staggerEnabled = useContext(PageStaggerEnabledContext);

  if (prefersReducedMotion || !staggerEnabled) {
    return <div className={className}>{children}</div>;
  }

  const initial =
    tier === "lite" ? PAGE_REVEAL_LITE_INITIAL : PAGE_REVEAL_INITIAL;
  const animate =
    tier === "lite" ? PAGE_REVEAL_LITE_ANIMATE : PAGE_REVEAL_ANIMATE;

  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: initial,
        visible: {
          ...animate,
          transition: getPageRevealTransition(tier),
        },
      }}
    >
      {children}
    </motion.div>
  );
}
