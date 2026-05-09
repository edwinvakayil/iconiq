"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BASE_LINKS, SITE_SECTIONS } from "@/lib/site-nav";
import { cn } from "@/lib/utils";

type SidebarItem = {
  label: string;
  href: string;
};

type SidebarSection = {
  title: string;
  items: SidebarItem[];
};

function SidebarActiveStroke({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean;
}) {
  return (
    <motion.span
      animate={{ opacity: 1, scaleX: 1, y: 0 }}
      aria-hidden="true"
      className="mt-1 block h-[2px] w-full origin-left rotate-[-1.35deg] rounded-[999px_140px_999px_85px/72%_36%_88%_52%] bg-sky-500/80 dark:bg-sky-400/90"
      initial={
        prefersReducedMotion ? false : { opacity: 0, scaleX: 0.82, y: 1 }
      }
      layoutId="sidebar-active-stroke"
      transition={{
        layout: prefersReducedMotion
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 460,
              damping: 34,
              mass: 0.58,
            },
        opacity: {
          duration: prefersReducedMotion ? 0 : 0.16,
        },
        scaleX: prefersReducedMotion
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 420,
              damping: 30,
              mass: 0.48,
            },
        y: prefersReducedMotion
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 380,
              damping: 28,
              mass: 0.44,
            },
      }}
    />
  );
}

const sections: SidebarSection[] = [
  {
    title: "Getting Started",
    items: BASE_LINKS.filter(
      (item) => item.href !== "/" && item.href !== "/changelog"
    ).map((item) => ({
      label: item.label,
      href: item.href,
    })),
  },
  ...SITE_SECTIONS.map((section) => ({
    title: section.label,
    items: section.children.map((item) => ({
      label: item.label,
      href: item.href,
    })),
  })),
];

export function SidebarNav() {
  const pathname = usePathname();
  const prefersReducedMotion = Boolean(useReducedMotion());

  return (
    <motion.aside
      animate={{ opacity: 1, x: 0 }}
      aria-label="Documentation navigation"
      className="hidden w-64 shrink-0 bg-background md:block"
      initial={prefersReducedMotion ? false : { opacity: 0, x: -12 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 320, damping: 34, delay: 0.04 }
      }
    >
      <nav className="sticky top-[var(--nav-stack-height-mobile)] h-[calc(100vh-var(--nav-stack-height-mobile))] lg:top-[var(--nav-stack-height-desktop)] lg:h-[calc(100vh-var(--nav-stack-height-desktop))]">
        <div
          className="flex max-h-full flex-col overflow-y-auto"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0, rgba(0,0,0,0.2) 1rem, black 2rem, black calc(100% - 2rem), rgba(0,0,0,0.2) calc(100% - 1rem), transparent 100%)",
          }}
        >
          <div className="h-4 shrink-0" />
          {sections.map((section) => (
            <section className="p-2" key={section.title}>
              <h2 className="flex h-8 shrink-0 items-center px-2 font-medium text-foreground/70 text-xs">
                {section.title}
              </h2>
              <ul className="flex flex-col gap-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <li className="group/menu-item relative" key={item.href}>
                      <Link
                        className={cn(
                          "flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left font-[450] text-foreground text-sm outline-none transition-all",
                          isActive
                            ? "text-foreground"
                            : "hover:bg-muted hover:text-foreground"
                        )}
                        href={item.href}
                      >
                        <span className="inline-flex min-w-0 max-w-full flex-col items-start">
                          <span className="truncate font-medium">
                            {item.label}
                          </span>
                          {isActive ? (
                            <SidebarActiveStroke
                              prefersReducedMotion={prefersReducedMotion}
                            />
                          ) : null}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
          <div className="h-4 shrink-0" />
        </div>
      </nav>
    </motion.aside>
  );
}
