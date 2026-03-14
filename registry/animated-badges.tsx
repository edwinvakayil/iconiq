"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type BadgeVariant = "live" | "pending" | "critical";

export interface StatusBadgeProps {
  label?: string;
  variant?: BadgeVariant;
  className?: string;
  visible?: boolean;
}

const variantStyles: Record<
  BadgeVariant,
  { container: string; dot: string; ping: string; shimmer: string }
> = {
  live: {
    container: "bg-badge text-badge-foreground",
    dot: "bg-badge-dot",
    ping: "bg-badge-ping",
    shimmer: "from-transparent via-badge-dot/10 to-transparent",
  },
  pending: {
    container: "bg-badge-pending text-badge-pending-foreground",
    dot: "bg-badge-pending-dot",
    ping: "bg-badge-pending-ping",
    shimmer: "from-transparent via-badge-pending-dot/10 to-transparent",
  },
  critical: {
    container: "bg-badge-critical text-badge-critical-foreground",
    dot: "bg-badge-critical-dot",
    ping: "bg-badge-critical-ping",
    shimmer: "from-transparent via-badge-critical-dot/10 to-transparent",
  },
};

export function StatusBadge({
  label = "Live",
  variant = "live",
  className,
  visible = true,
}: StatusBadgeProps) {
  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className={cn(
            "relative inline-flex items-center gap-1.5 overflow-hidden rounded-full px-2.5 py-1",
            "font-semibold text-[11px] uppercase tracking-wider",
            "cursor-default select-none whitespace-nowrap antialiased shadow-badge",
            styles.container,
            className
          )}
          exit={{ opacity: 0, scale: 0.8, y: -4 }}
          initial={{ opacity: 0, scale: 0.8, y: 6 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          whileHover={{
            scale: 1.08,
            boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.1)",
          }}
          whileTap={{ scale: 0.97 }}
        >
          {/* Shimmer sweep */}
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            className={cn("absolute inset-0 bg-linear-to-r", styles.shimmer)}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 4,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          />

          {/* Ping dot */}
          <div className="relative flex h-2 w-2">
            <motion.span
              animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
              className={cn(
                "absolute inline-flex h-full w-full rounded-full",
                styles.ping
              )}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            />
            <motion.span
              animate={{ scale: [1, 0.85, 1] }}
              className={cn(
                "relative inline-flex h-2 w-2 rounded-full",
                styles.dot
              )}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </div>

          <span className="relative pt-px tabular-nums leading-none">
            {label}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
