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

/** Badge colors kept in component; no globals.css required. */
const variantStyles: Record<
  BadgeVariant,
  { container: string; dot: string; ping: string; shimmer: string }
> = {
  live: {
    container: "bg-[#22c55e] text-white dark:bg-[#16a34a] dark:text-white",
    dot: "bg-[#16a34a] dark:bg-[#15803d]",
    ping: "bg-[#22c55e] dark:bg-[#22c55e]",
    shimmer:
      "from-transparent via-[#16a34a]/10 to-transparent dark:via-[#15803d]/10",
  },
  pending: {
    container: "bg-[#eab308] text-black dark:bg-[#ca8a04] dark:text-white",
    dot: "bg-[#ca8a04] dark:bg-[#a16207]",
    ping: "bg-[#eab308] dark:bg-[#eab308]",
    shimmer:
      "from-transparent via-[#ca8a04]/10 to-transparent dark:via-[#a16207]/10",
  },
  critical: {
    container: "bg-[#ef4444] text-white dark:bg-[#dc2626] dark:text-white",
    dot: "bg-[#dc2626] dark:bg-[#b91c1c]",
    ping: "bg-[#ef4444] dark:bg-[#ef4444]",
    shimmer:
      "from-transparent via-[#dc2626]/10 to-transparent dark:via-[#b91c1c]/10",
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
            "cursor-default select-none whitespace-nowrap antialiased shadow-[0_1px_2px_rgba(0,0,0,0.06)]",
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
