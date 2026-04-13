"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BookOpen, ChevronRight, LayoutGrid, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SITE_SECTIONS } from "@/lib/site-nav";
import { cn } from "@/lib/utils";

const easeOutExpo = [0.32, 0.72, 0, 1] as const;

const sidebarVariants = {
  section: {
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        height: { duration: 0.28, ease: easeOutExpo },
        opacity: { duration: 0.2 },
      },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        height: { duration: 0.22, ease: easeOutExpo },
        opacity: { duration: 0.14 },
      },
    },
  },
  item: {
    closed: { opacity: 0, x: -6 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.04 + i * 0.028,
        duration: 0.24,
        ease: easeOutExpo,
      },
    }),
    exit: { opacity: 0, x: -4, transition: { duration: 0.12 } },
  },
  chevron: {
    closed: { rotate: 0 },
    open: {
      rotate: 90,
      transition: { type: "spring" as const, stiffness: 300, damping: 28 },
    },
  },
};

interface SidebarItem {
  label: string;
  href: string;
  badge?: string;
}

interface SidebarSection {
  title: string;
  icon: React.ElementType;
  items: SidebarItem[];
}

const sections: SidebarSection[] = [
  {
    title: "Getting Started",
    icon: BookOpen,
    items: [
      { label: "Introduction", href: "/introduction" },
      { label: "Installation", href: "/installation" },
    ],
  },
  ...SITE_SECTIONS.map((section) => ({
    title: section.label,
    icon: section.label === "Icons" ? Package : LayoutGrid,
    items: section.children.map((c) => ({ label: c.label, href: c.href })),
  })),
];

export function SidebarNav() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [expanded, setExpanded] = useState<string[]>([
    "Getting Started",
    "Icons",
    "Components",
  ]);

  const toggleSection = (title: string) => {
    setExpanded((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <motion.aside
      animate={{ opacity: 1, x: 0 }}
      aria-label="Main navigation"
      className="hidden w-[260px] shrink-0 border-neutral-200/40 border-r-[0.5px] bg-background md:block dark:border-neutral-700/30"
      initial={prefersReducedMotion ? false : { opacity: 0, x: -12 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 300, damping: 32, delay: 0.04 }
      }
    >
      <nav className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-5 pr-4 pl-3">
        {sections.map((section) => {
          const isExpanded = expanded.includes(section.title);
          const Icon = section.icon;
          return (
            <motion.div className="mb-1" initial={false} key={section.title}>
              <motion.button
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 font-medium text-foreground text-sm transition-colors hover:bg-muted"
                onClick={() => toggleSection(section.title)}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <motion.span
                  className="flex shrink-0 text-muted-foreground"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  whileHover={{ scale: 1.08 }}
                >
                  <Icon className="h-4 w-4" />
                </motion.span>
                <span className="flex-1 text-left">{section.title}</span>
                <motion.span
                  animate={isExpanded ? "open" : "closed"}
                  className="inline-flex text-muted-foreground"
                  initial={false}
                  variants={sidebarVariants.chevron}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </motion.span>
              </motion.button>
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.ul
                    animate="open"
                    className="mt-1 mb-3 ml-[18px] overflow-hidden border-neutral-200/40 border-l-[0.5px] pl-3 dark:border-neutral-700/30"
                    exit="closed"
                    initial="closed"
                    variants={sidebarVariants.section}
                  >
                    {section.items.map((item, index) => {
                      const isActive = pathname === item.href;
                      return (
                        <motion.li
                          custom={index}
                          exit="exit"
                          key={item.label}
                          variants={sidebarVariants.item}
                        >
                          <motion.div
                            className="rounded-md"
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                            whileHover={{
                              backgroundColor: isActive
                                ? undefined
                                : "var(--muted)",
                            }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <Link
                              className={cn(
                                "relative flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                                isActive
                                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                              href={item.href}
                            >
                              {isActive && (
                                <motion.span
                                  className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[#16d75d] dark:bg-[#16a34a]"
                                  layoutId="sidebar-active"
                                  transition={{
                                    type: "spring",
                                    stiffness: 380,
                                    damping: 30,
                                  }}
                                />
                              )}
                              <span className="flex-1 text-left">
                                {item.label}
                              </span>
                              {item.badge && (
                                <span
                                  className={cn(
                                    "rounded-full px-1.5 py-0.5 font-bold text-[9px] uppercase tracking-wider",
                                    item.badge === "New"
                                      ? "bg-primary/10 text-primary"
                                      : "bg-accent/20 text-accent-foreground"
                                  )}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          </motion.div>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </nav>
    </motion.aside>
  );
}
