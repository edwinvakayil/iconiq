"use client";

import { Github } from "lucide-react";
import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandLink } from "@/components/brand-wordmark";
import { SiteSearch } from "@/components/site-search";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LINK } from "@/constants";
import { BASE_LINKS, SITE_SECTIONS } from "@/lib/site-nav";
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

const mobileNavSections: HeaderSection[] = [
  {
    title: "Getting Started",
    items: BASE_LINKS.filter((item) => item.href !== "/").map((item) => ({
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

  return (
    <header
      className={cn(
        "fixed top-[var(--announcement-height-mobile)] right-0 left-0 z-[150] w-full border-border/50 bg-background lg:top-[var(--announcement-height-desktop)]",
        !isHome && "border-b"
      )}
    >
      <div className="flex h-14 w-full items-center justify-between gap-4 px-4">
        <div className="flex items-center">
          <div className="flex items-center gap-3">
            <MobileNav className="md:hidden" />
            <BrandHeaderLink />
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <SiteSearch variant="desktop" />
          <GitHubStarsLink starCount={starCount} />
          <ThemeToggle className="size-8 rounded-md text-neutral-950 hover:bg-accent hover:text-foreground dark:text-white dark:hover:bg-input/20 dark:hover:text-white" />
        </div>
      </div>
    </header>
  );
}
