"use client";

import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const separatorVariants = {
  initial: { opacity: 0, scale: 0, rotate: -90 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
  exit: { opacity: 0, scale: 0, rotate: 90 },
};
const itemVariants = {
  initial: { opacity: 0, x: -12, scale: 0.85 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 12, scale: 0.85 },
};
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="breadcrumb" className={cn("inline-flex", className)}>
      <ol className="flex items-center gap-1">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <motion.li
                animate="animate"
                className="flex items-center gap-1"
                exit="exit"
                initial="initial"
                key={item.label}
                layout
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  delay: index * 0.06,
                }}
                variants={itemVariants}
              >
                {index > 0 && (
                  <motion.span
                    className="mx-0.5 text-muted-foreground"
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    variants={separatorVariants}
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </motion.span>
                )}
                <motion.a
                  className={cn(
                    "relative inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium text-sm transition-colors",
                    isLast
                      ? "cursor-default text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  href={item.href || "#"}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  whileHover={isLast ? undefined : { scale: 1.06, y: -1 }}
                  whileTap={isLast ? undefined : { scale: 0.96 }}
                >
                  {/* Hover background glow */}
                  {!isLast && (
                    <motion.span
                      className="absolute inset-0 rounded-lg bg-accent"
                      initial={{ opacity: 0 }}
                      style={{ zIndex: -1 }}
                      transition={{ duration: 0.2 }}
                      whileHover={{ opacity: 1 }}
                    />
                  )}
                  {/* Shimmer on active item */}
                  {isLast && (
                    <motion.span
                      className="absolute inset-0 overflow-hidden rounded-lg"
                      style={{ zIndex: -1 }}
                    >
                      <motion.span
                        animate={{ x: ["-100%", "200%"] }}
                        className="absolute inset-0 bg-linear-to-r from-transparent via-accent to-transparent"
                        transition={{
                          duration: 2.5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatDelay: 3,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.span>
                  )}
                  {item.icon && (
                    <motion.span
                      animate={{ rotate: 0, opacity: 1 }}
                      initial={{ rotate: -20, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: index * 0.06 + 0.1,
                      }}
                    >
                      {item.icon}
                    </motion.span>
                  )}
                  <span>{item.label}</span>
                  {/* Active dot indicator */}
                  {isLast && (
                    <motion.span
                      animate={{ scale: [1, 1.4, 1] }}
                      className="ml-0.5 h-1.5 w-1.5 rounded-full bg-primary"
                      initial={{ scale: 0 }}
                      transition={{
                        scale: {
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        },
                        delay: 0.3,
                      }}
                    />
                  )}
                </motion.a>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
    </nav>
  );
}
