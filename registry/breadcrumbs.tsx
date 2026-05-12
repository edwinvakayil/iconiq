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

const subtleEase = [0.22, 1, 0.36, 1] as const;

const separatorVariants = {
  initial: { opacity: 0, x: -4 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 4 },
};

const itemVariants = {
  initial: { opacity: 0, x: -6 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 6 },
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="breadcrumb" className={cn("inline-flex", className)}>
      <ol className="flex items-center gap-1">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isInteractive = Boolean(item.href) && !isLast;
            const key = item.href
              ? `${item.label}-${item.href}`
              : `${item.label}-${index}`;
            const content = (
              <>
                {item.icon && (
                  <motion.span
                    animate={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: -4 }}
                    transition={{ duration: 0.18, ease: subtleEase }}
                  >
                    {item.icon}
                  </motion.span>
                )}
                <span>{item.label}</span>
              </>
            );

            return (
              <motion.li
                animate="animate"
                className="flex items-center gap-1"
                exit="exit"
                initial="initial"
                key={key}
                layout
                transition={{ duration: 0.18, ease: subtleEase }}
                variants={itemVariants}
              >
                {index > 0 && (
                  <motion.span
                    aria-hidden="true"
                    className="mx-0.5 text-muted-foreground"
                    transition={{ duration: 0.18, ease: subtleEase }}
                    variants={separatorVariants}
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </motion.span>
                )}
                {isInteractive ? (
                  <motion.a
                    className="inline-flex min-h-10 touch-manipulation items-center gap-1.5 rounded-lg px-3 py-2 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    href={item.href}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                  >
                    {content}
                  </motion.a>
                ) : (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 py-2 font-medium text-sm",
                      isLast ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {content}
                  </span>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
    </nav>
  );
}
