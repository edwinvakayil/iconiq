"use client";

import { Github, Menu, Twitter, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { LINK, SITE } from "@/constants";

const mobileNavLinks = [
  { label: "Overview", href: "/" },
  { label: "Introduction", href: "/introduction" },
  { label: "Installation", href: "/installation" },
  { label: "Icon Library", href: "/icons" },
  { label: "Contributing", href: `${LINK.GITHUB}#readme`, external: true },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            aria-label="GitHub"
            className="hidden size-9 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-1 focus-visible:outline-primary sm:flex"
            href={LINK.GITHUB}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Github className="size-5" />
          </a>
          <a
            aria-label="X (Twitter)"
            className="hidden size-9 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-1 focus-visible:outline-primary sm:flex"
            href={LINK.TWITTER}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Twitter className="size-5" />
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
            {mobileNavLinks.map((item) =>
              item.external ? (
                <a
                  className="block px-4 py-3 font-sans text-neutral-700 text-sm hover:bg-neutral-100"
                  href={item.href}
                  key={item.label}
                  onClick={() => setMobileMenuOpen(false)}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  className="block px-4 py-3 font-sans text-neutral-700 text-sm hover:bg-neutral-100"
                  href={item.href}
                  key={item.label}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="mt-2 flex gap-2 border-neutral-200 border-t px-4 pt-4">
              <a
                aria-label="GitHub"
                className="flex size-10 items-center justify-center rounded-md border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                href={LINK.GITHUB}
                onClick={() => setMobileMenuOpen(false)}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Github className="size-5" />
              </a>
              <a
                aria-label="X (Twitter)"
                className="flex size-10 items-center justify-center rounded-md border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                href={LINK.TWITTER}
                onClick={() => setMobileMenuOpen(false)}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Twitter className="size-5" />
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
