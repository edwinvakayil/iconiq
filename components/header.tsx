"use client";

import { Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LINK, SITE } from "@/constants";
import { BASE_LINKS, SITE_SECTIONS } from "@/lib/site-nav";

const GITHUB_REPO_API = "https://api.github.com/repos/edwinvakayil/iconiq";

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
      <header className="sticky top-0 z-[150] w-full border-neutral-200 border-b bg-background/90 backdrop-blur-sm dark:border-neutral-800">
        <div className="mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:h-[59px] lg:px-[80px]">
          {/* Logo */}
          <Link
            className="flex items-center gap-2 font-semibold text-lg"
            href="/"
          >
            {SITE.LOGO}
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <span className="hidden h-5 w-px bg-neutral-200 sm:block dark:bg-neutral-700" />

            {/* GitHub */}
            <a
              className="hidden items-center gap-2 px-3 py-1.5 text-neutral-600 text-sm hover:text-neutral-900 sm:flex dark:text-neutral-400 dark:hover:text-white"
              href={LINK.GITHUB}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-neutral-900 text-white">
                <Github className="size-3.5" />
              </span>
              <span>
                {starCount !== null ? formatStarCount(starCount) : "—"}
              </span>
            </a>

            <span className="hidden h-5 w-px bg-neutral-200 sm:block dark:bg-neutral-700" />

            {/* Twitter */}
            <a
              className="hidden size-9 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 sm:flex"
              href={LINK.TWITTER}
              rel="noopener noreferrer"
              target="_blank"
            >
              <XLogoIcon className="size-5" />
            </a>

            {/* Hamburger */}
            <button
              className="flex size-9 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100 sm:hidden"
              onClick={() => setMobileMenuOpen(true)}
              type="button"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <button
        aria-hidden={!mobileMenuOpen}
        className={`fixed inset-0 z-[200] bg-black/30 transition-opacity sm:hidden ${
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        type="button"
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 z-[201] flex h-full w-[280px] transform flex-col border-neutral-200 border-l bg-background shadow-xl transition-transform duration-300 sm:hidden dark:border-neutral-800 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex h-14 items-center justify-between px-4">
          <span className="font-medium text-sm">{SITE.LOGO}</span>

          <button
            className="flex size-9 items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
            onClick={() => setMobileMenuOpen(false)}
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {BASE_LINKS.map((item) => (
            <Link
              className="block px-4 py-3 text-neutral-700 text-sm hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
              href={item.href}
              key={item.label}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {SITE_SECTIONS.map((section) => (
            <div className="mt-3 pt-2" key={section.label}>
              <p className="px-4 pb-1 font-semibold text-[11px] text-neutral-500 uppercase dark:text-neutral-400">
                {section.label}
              </p>

              <ul className="pl-7">
                {section.children.map((item) => (
                  <li key={item.href}>
                    <Link
                      className="block py-2 text-neutral-700 text-sm hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Footer actions */}
          <div className="mt-4 flex items-center gap-3 px-4 pt-4">
            <ThemeToggle />

            <a
              className="flex items-center gap-2 text-neutral-600 text-sm dark:text-neutral-400"
              href={LINK.GITHUB}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Github className="size-4" />
              {starCount !== null ? formatStarCount(starCount) : "—"}
            </a>

            <a
              className="flex items-center"
              href={LINK.TWITTER}
              rel="noopener noreferrer"
              target="_blank"
            >
              <XLogoIcon className="size-5" />
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
