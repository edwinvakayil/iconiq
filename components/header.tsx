"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  Github,
  LayoutGrid,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteSearch } from "@/components/site-search";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LINK, SITE } from "@/constants";
import { BASE_LINKS, SITE_SECTIONS } from "@/lib/site-nav";

const componentsSection = SITE_SECTIONS.find((s) => s.label === "Components");

const mobileNavSections = [
  {
    title: "Getting Started",
    icon: BookOpen,
    items: BASE_LINKS.map((item) => ({ label: item.label, href: item.href })),
  },
  ...(componentsSection
    ? [
        {
          title: componentsSection.label,
          icon: LayoutGrid,
          items: componentsSection.children.map((item) => ({
            label: item.label,
            href: item.href,
          })),
        },
      ]
    : []),
];

const easeOutExpo = [0.32, 0.72, 0, 1] as const;

const mobileNavVariants = {
  container: {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: easeOutExpo,
        when: "beforeChildren",
      },
    },
    closed: {
      opacity: 0,
      y: -8,
      transition: {
        duration: 0.25,
        ease: easeOutExpo,
        when: "afterChildren",
      },
    },
  },
  backdrop: {
    open: { opacity: 1, transition: { duration: 0.2 } },
    closed: { opacity: 0, transition: { duration: 0.2 } },
  },
  panel: {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 30,
        mass: 0.8,
      },
    },
    closed: {
      opacity: 0,
      y: -12,
      transition: {
        duration: 0.2,
        ease: easeOutExpo,
      },
    },
  },
  section: {
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.04 + i * 0.03, duration: 0.28, ease: easeOutExpo },
    }),
    closed: { opacity: 0, y: -4 },
  },
  expandContent: {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.28, ease: easeOutExpo },
        opacity: { duration: 0.2 },
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.22, ease: easeOutExpo },
        opacity: { duration: 0.14 },
      },
    },
  },
  expandItem: {
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.05 + i * 0.025,
        duration: 0.22,
        ease: easeOutExpo,
      },
    }),
    closed: { opacity: 0, x: -6 },
  },
};

const GITHUB_REPO_API = "https://api.github.com/repos/edwinvakayil/iconiq";
const desktopIconActionClass =
  "flex size-10 items-center justify-center rounded-xl text-neutral-950 transition-colors hover:text-neutral-600 focus-visible:outline-1 focus-visible:outline-primary dark:text-white dark:hover:text-neutral-300";
const desktopGithubBadgeClass =
  "inline-flex h-12 items-center gap-3 rounded-[18px] bg-muted/72 px-5 text-neutral-950 transition-colors hover:bg-muted dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.1]";

function XLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function formatStarCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
  return n.toLocaleString();
}

export function Header() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string[]>([
    "Getting Started",
    ...(componentsSection ? [componentsSection.label] : []),
  ]);
  const [starCount, setStarCount] = useState<number | null>(null);

  const toggleMobileSection = (title: string) => {
    setExpandedMobile((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  useEffect(() => {
    fetch(GITHUB_REPO_API, {
      headers: { Accept: "application/vnd.github.v3+json" },
    })
      .then((res) => res.json())
      .then((data: { stargazers_count?: number }) => {
        if (typeof data?.stargazers_count === "number") {
          setStarCount(data.stargazers_count);
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!pathname) return;
    setMobileMenuOpen(false);
  }, [pathname]);

  /* Prevent body scroll when menu open */
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.header
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-[150] w-full border-neutral-200/80 border-b bg-white/[0.92] backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-950/[0.88]"
        initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 320, damping: 34, mass: 0.9 }
        }
      >
        <div className="mx-auto flex h-[var(--header-height-mobile)] items-center justify-between px-4 sm:px-6 lg:hidden">
          <Link
            className="font-semibold text-[18px] text-foreground tracking-[-0.03em]"
            href="/"
          >
            {SITE.LOGO}
          </Link>

          <div className="flex items-center gap-2">
            <SiteSearch variant="mobile" />
            <ThemeToggle />

            <span className="hidden h-5 w-px bg-neutral-200 sm:block dark:bg-neutral-700" />

            <a
              className="hidden items-center gap-2 rounded-xl bg-muted/60 px-3 py-1.5 text-neutral-600 text-sm hover:bg-muted hover:text-neutral-900 sm:flex dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:bg-white/[0.08] dark:hover:text-white"
              href={LINK.GITHUB}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Github className="size-4" />
              <span className="font-medium">GitHub</span>
              <span className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
                {starCount !== null ? formatStarCount(starCount) : "—"}
              </span>
            </a>

            <span className="hidden h-5 w-px bg-neutral-200 sm:block dark:bg-neutral-700" />

            <a
              className="hidden size-9 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 sm:flex dark:hover:bg-white/10 dark:hover:text-white"
              href={LINK.TWITTER}
              rel="noopener noreferrer"
              target="_blank"
            >
              <XLogoIcon className="size-5" />
            </a>

            <button
              aria-expanded={mobileMenuOpen}
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
            >
              {mobileMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>

        <div className="mx-auto hidden h-[var(--header-height-desktop)] items-center justify-between gap-8 px-6 lg:flex xl:px-10 2xl:px-12">
          <div className="flex min-w-0 items-center">
            <Link
              className="shrink-0 font-semibold text-[17px] text-foreground tracking-[-0.03em]"
              href="/"
            >
              {SITE.LOGO}
            </Link>
          </div>

          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2">
              <SiteSearch />
              <ThemeToggle className={desktopIconActionClass} />
              <a
                className={desktopIconActionClass}
                href={LINK.TWITTER}
                rel="noopener noreferrer"
                target="_blank"
              >
                <XLogoIcon className="size-[18px]" />
              </a>
              <a
                aria-label="GitHub stars"
                className={desktopGithubBadgeClass}
                href={LINK.GITHUB}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Github className="size-5" />
                <span className="font-semibold text-[14px] tracking-[-0.03em]">
                  {starCount !== null ? formatStarCount(starCount) : "—"}
                </span>
              </a>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            animate="open"
            className="fixed inset-x-0 top-[var(--header-height-mobile)] z-[200] sm:hidden"
            exit="closed"
            initial="closed"
            key="mobile-nav"
            variants={mobileNavVariants.container}
          >
            {/* Backdrop */}
            <motion.button
              animate="open"
              aria-hidden={!mobileMenuOpen}
              className="fixed inset-0 top-[var(--header-height-mobile)] bg-background/60 backdrop-blur-sm"
              initial="closed"
              onClick={() => setMobileMenuOpen(false)}
              type="button"
              variants={mobileNavVariants.backdrop}
            />

            {/* Panel */}
            <motion.div
              animate="open"
              className="relative z-[201] mx-3 mt-2 max-h-[70vh] overflow-y-auto rounded-xl border border-border bg-card shadow-2xl shadow-primary/5"
              initial="closed"
              variants={mobileNavVariants.panel}
            >
              {/* Navigation sections */}
              <nav className="p-2">
                {mobileNavSections.map((section, sectionIndex) => {
                  const isExpanded = expandedMobile.includes(section.title);
                  const Icon = section.icon;
                  return (
                    <motion.div
                      animate="open"
                      className="mb-0.5"
                      custom={sectionIndex}
                      initial="closed"
                      key={section.title}
                      variants={mobileNavVariants.section}
                    >
                      <motion.button
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 font-medium text-[13px] text-foreground transition-colors hover:bg-muted active:bg-muted"
                        onClick={() => toggleMobileSection(section.title)}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="flex-1 text-left">
                          {section.title}
                        </span>
                        <motion.span
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          className="inline-flex"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 28,
                          }}
                        >
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        </motion.span>
                      </motion.button>
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.ul
                            animate="open"
                            className="mt-0.5 mb-2 ml-[18px] overflow-hidden border-neutral-200 border-l pl-2 dark:border-neutral-800/50"
                            exit="closed"
                            initial="closed"
                            variants={mobileNavVariants.expandContent}
                          >
                            {section.items.map((item, itemIndex) => (
                              <motion.li
                                custom={itemIndex}
                                key={`${section.title}-${item.href}`}
                                variants={mobileNavVariants.expandItem}
                              >
                                <Link
                                  className="flex w-full items-center rounded-md px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:bg-muted"
                                  href={item.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {item.label}
                                </Link>
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Bottom link */}
              <div className="border-neutral-200 border-t p-3 dark:border-neutral-800/50">
                <a
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 font-medium text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                  href={LINK.GITHUB}
                  onClick={() => setMobileMenuOpen(false)}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  GitHub
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
