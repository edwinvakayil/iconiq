"use client";

import { Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { LINK, SITE } from "@/constants";

const GITHUB_REPO_API = "https://api.github.com/repos/edwinvakayil/iconiq";

function XLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
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

const mobileNavLinks = [
  { label: "Overview", href: "/" },
  { label: "Introduction", href: "/introduction" },
  { label: "Installation", href: "/installation" },
  { label: "Icon Library", href: "/icons" },
  { label: "Button + Icon", href: "/icons/button-svg" },
  { label: "Code Block", href: "/components/code-block" },
  { label: "Animated Tooltip", href: "/components/animated-tooltip" },
];

const mobileNavContributing = [
  { label: "Introduction", href: "/contributing/introduction" },
  { label: "Contributing Code", href: "/contributing/code" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [starCount, setStarCount] = useState<number | null>(null);

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
    <header className="z-[100] w-full shrink-0 border-neutral-200 border-b bg-background">
      <div className="mx-auto flex h-14 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-[80px]">
        <div className="flex min-w-0 flex-1 items-center gap-6">
          <Link
            className="flex items-center gap-2 font-sans font-semibold text-lg text-neutral-900 focus-visible:outline-1 focus-visible:outline-primary"
            href="/"
          >
            {SITE.LOGO}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <a
            aria-label="GitHub repository"
            className="hidden items-center gap-2 px-3 py-1.5 font-sans text-neutral-600 text-sm transition-colors hover:text-neutral-900 focus-visible:outline-1 focus-visible:outline-primary sm:flex"
            href={LINK.GITHUB}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white">
              <Github aria-hidden className="size-3.5" />
            </span>
            <span>{starCount !== null ? formatStarCount(starCount) : "—"}</span>
          </a>
          <span
            aria-hidden
            className="hidden h-5 w-px bg-neutral-200 sm:block"
          />
          <a
            aria-label="X (Twitter)"
            className="hidden size-9 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-1 focus-visible:outline-primary sm:flex"
            href={LINK.TWITTER}
            rel="noopener noreferrer"
            target="_blank"
          >
            <XLogoIcon className="size-5" />
          </a>

          <button
            aria-controls="mobile-menu"
            aria-expanded={mobileMenuOpen}
            aria-label="Open menu"
            className="flex size-9 items-center justify-center rounded-md text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-1 focus-visible:outline-primary sm:hidden"
            onClick={() => setMobileMenuOpen(true)}
            type="button"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay + panel */}
      <div
        aria-hidden={!mobileMenuOpen}
        className="fixed inset-0 z-[100] sm:hidden"
        id="mobile-menu"
        style={{
          pointerEvents: mobileMenuOpen ? "auto" : "none",
          visibility: mobileMenuOpen ? "visible" : "hidden",
        }}
      >
        <button
          aria-label="Close menu"
          className="absolute inset-0 w-full border-0 bg-neutral-900/20 p-0 transition-opacity duration-200 focus:outline-none focus-visible:outline-1 focus-visible:outline-primary"
          onClick={() => setMobileMenuOpen(false)}
          style={{ opacity: mobileMenuOpen ? 1 : 0 }}
          type="button"
        />
        <div
          className="absolute top-0 right-0 z-[101] h-full w-full max-w-[280px] border-neutral-200 border-l bg-background shadow-lg transition-transform duration-200 ease-out"
          style={{
            transform: mobileMenuOpen ? "translateX(0)" : "translateX(100%)",
          }}
        >
          <div className="flex h-14 items-center justify-between border-neutral-200 border-b px-4">
            <span className="font-medium font-sans text-neutral-900 text-sm">
              {SITE.LOGO}
            </span>
            <button
              aria-label="Close menu"
              className="flex size-9 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100 focus-visible:outline-1 focus-visible:outline-primary"
              onClick={() => setMobileMenuOpen(false)}
              type="button"
            >
              <X className="size-5" />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex flex-col gap-0 py-4">
            {mobileNavLinks.map((item) => (
              <Link
                className="block px-4 py-3 font-sans text-neutral-700 text-sm hover:bg-neutral-100"
                href={item.href}
                key={item.label}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 border-neutral-200 border-t pt-2">
              <p className="px-4 pb-1.5 font-sans font-semibold text-[11px] text-neutral-500 uppercase tracking-wider">
                Contributing
              </p>
              <div className="ml-4 border-neutral-200 border-l-2 pl-4">
                {mobileNavContributing.map((item) => (
                  <Link
                    className="block py-2 font-sans text-neutral-700 text-sm hover:bg-neutral-100"
                    href={item.href}
                    key={item.label}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 border-neutral-200 border-t px-4 pt-4">
              <a
                aria-label="GitHub repository"
                className="flex items-center gap-2 rounded-md px-3 py-2 font-sans text-neutral-600 text-sm hover:bg-neutral-100"
                href={LINK.GITHUB}
                onClick={() => setMobileMenuOpen(false)}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <Github aria-hidden className="size-3.5" />
                </span>
                <span>
                  {starCount !== null ? formatStarCount(starCount) : "—"}
                </span>
              </a>
              <span aria-hidden className="h-8 w-px shrink-0 bg-neutral-200" />
              <a
                aria-label="X (Twitter)"
                className="flex size-10 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100"
                href={LINK.TWITTER}
                onClick={() => setMobileMenuOpen(false)}
                rel="noopener noreferrer"
                target="_blank"
              >
                <XLogoIcon className="size-5" />
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
