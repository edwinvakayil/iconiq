"use client";

import { Github } from "lucide-react";
import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandLink } from "@/components/brand-wordmark";
import { HomeHeaderNav } from "@/components/home-header-nav";
import { SiteSearch } from "@/components/site-search";
import { SiteThemeToggle } from "@/components/ui/site-theme-toggle";
import { LINK } from "@/constants";
import { isSplitDocsPage } from "@/lib/is-component-doc-page";
import { recordGithubClick } from "@/lib/record-github-click";
import { SITE_SECTIONS } from "@/lib/site-nav";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/popover";

type HeaderLink = {
  label: string;
  href: string;
};

type HeaderSection = {
  title: string;
  items: HeaderLink[];
};

const GITHUB_REPO_API = "https://api.github.com/repos/edwinvakayil/iconiq";
const GITHUB_STARS_CACHE_KEY = "iconiq:github-stars";
const GITHUB_STARS_CACHE_TTL_MS = 30 * 60 * 1000;

type GitHubStarsCache = {
  count: number;
  fetchedAt: number;
};

const mobileNavSections: HeaderSection[] = SITE_SECTIONS.map((section) => ({
  title: section.label,
  items: section.children.map((item) => ({
    label: item.label,
    href: item.href,
  })),
}));

function formatStarCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
  return n.toLocaleString();
}

function GitHubStarsLink({ starCount }: { starCount: number | null }) {
  return (
    <a
      className="inline-flex h-8 items-center gap-2 rounded-md bg-transparent px-3 font-medium text-sm shadow-none transition-colors hover:bg-accent hover:text-accent-foreground dark:hover:bg-input/20"
      href={LINK.GITHUB}
      onClick={recordGithubClick}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Github className="size-4" />
      <span className="tabular-nums">
        {starCount !== null ? formatStarCount(starCount) : "—"}
      </span>
      <span className="sr-only">Open GitHub</span>
    </a>
  );
}

function BrandHeaderLink() {
  return (
    <>
      <BrandLink className="md:hidden" size="mobile" />
      <BrandLink className="hidden md:inline-flex" size="desktop" />
    </>
  );
}

function MobileNavLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: LinkProps & {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      className={cn(
        "font-medium text-2xl transition-colors",
        isActive ? "text-primary" : "text-foreground",
        className
      )}
      href={href}
      onClick={() => onOpenChange?.(false)}
      {...props}
    >
      {children}
    </Link>
  );
}

function MobileNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    setOpen(false);
  }, [pathname]);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "h-8 touch-manipulation items-center justify-start gap-2.5 p-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent",
            className
          )}
          type="button"
        >
          <div className="relative flex h-8 w-4 items-center justify-center">
            <div className="relative size-4">
              <span
                className={cn(
                  "absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100",
                  open ? "top-[0.45rem] -rotate-45" : "top-1"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100",
                  open ? "top-[0.45rem] rotate-45" : "top-2.5"
                )}
              />
            </div>
            <span className="sr-only">Toggle Menu</span>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        alignOffset={-16}
        className="h-[var(--radix-popover-content-available-height)] w-[var(--radix-popover-content-available-width)] overflow-y-auto rounded-none border-none bg-background/90 p-0 shadow-none backdrop-blur"
        open={open}
        side="bottom"
        sideOffset={14}
      >
        <div className="flex flex-col gap-12 px-4 py-6">
          <div className="flex flex-col gap-8">
            {mobileNavSections.map((section) => (
              <div className="flex flex-col gap-4" key={section.title}>
                <div className="font-medium text-muted-foreground text-sm">
                  {section.title}
                </div>
                <div className="flex flex-col gap-3">
                  {section.items.map((item) => (
                    <MobileNavLink
                      href={item.href}
                      key={`${section.title}-${item.href}`}
                      onOpenChange={setOpen}
                    >
                      {item.label}
                    </MobileNavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function Header() {
  const pathname = usePathname();
  const [starCount, setStarCount] = useState<number | null>(null);
  const isHome = pathname === "/";

  useEffect(() => {
    try {
      const cached = window.sessionStorage.getItem(GITHUB_STARS_CACHE_KEY);

      if (cached) {
        const parsed = JSON.parse(cached) as GitHubStarsCache;

        if (
          typeof parsed.count === "number" &&
          Date.now() - parsed.fetchedAt < GITHUB_STARS_CACHE_TTL_MS
        ) {
          setStarCount(parsed.count);
          return;
        }
      }
    } catch {
      // Ignore invalid cache payloads.
    }

    fetch(GITHUB_REPO_API, {
      headers: { Accept: "application/vnd.github.v3+json" },
    })
      .then((res) => res.json())
      .then((data: { stargazers_count?: number }) => {
        if (typeof data?.stargazers_count !== "number") {
          return;
        }

        setStarCount(data.stargazers_count);

        try {
          window.sessionStorage.setItem(
            GITHUB_STARS_CACHE_KEY,
            JSON.stringify({
              count: data.stargazers_count,
              fetchedAt: Date.now(),
            } satisfies GitHubStarsCache)
          );
        } catch {
          // Ignore quota or privacy mode storage errors.
        }
      })
      .catch(() => undefined);
  }, []);

  if (isSplitDocsPage(pathname)) {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-[150] w-full border-border/50 bg-background",
        isHome && "overflow-visible",
        !isHome && "border-b"
      )}
    >
      <div className="flex h-14 w-full items-center justify-between gap-4 px-4">
        <div className="flex items-center">
          <div className="flex min-w-0 items-center gap-3">
            {isHome ? null : <MobileNav className="md:hidden" />}
            <BrandHeaderLink />
            {isHome ? <HomeHeaderNav className="hidden lg:flex" /> : null}
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <SiteSearch variant="desktop" />
          <GitHubStarsLink starCount={starCount} />
          {isHome ? null : (
            <SiteThemeToggle className="size-8 rounded-md text-neutral-950 hover:bg-accent hover:text-foreground dark:text-white dark:hover:bg-input/20 dark:hover:text-white" />
          )}
        </div>
      </div>
    </header>
  );
}
