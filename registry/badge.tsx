"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export interface BadgeProps {
  children: ReactNode;
  className?: string;
  bgColor?: string;
  textColor?: string;
  waveColor?: string;
}

export function Badge({
  children,
  className = "",
  bgColor,
  textColor,
  waveColor,
}: BadgeProps) {
  return (
    <motion.span
      animate={{ opacity: 1, scale: 1 }}
      className={`relative inline-flex items-center overflow-hidden rounded-full border border-transparent px-3 py-1 font-medium text-xs ${bgColor ? "" : "bg-neutral-900 dark:bg-white"} ${textColor ? "" : "text-white dark:text-neutral-900"} ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      style={{
        ...(bgColor ? { backgroundColor: bgColor } : {}),
        ...(textColor ? { color: textColor } : {}),
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        animate={{ x: ["-100%", "200%"] }}
        className="pointer-events-none absolute inset-0 rounded-full [--wave-color:rgba(255,255,255,0.12)] dark:[--wave-color:rgba(0,0,0,0.08)]"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${waveColor || "var(--wave-color)"} 50%, transparent 100%)`,
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 1.5,
          ease: "easeInOut",
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.span>
  );
}

export default Badge;
