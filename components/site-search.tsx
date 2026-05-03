"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import Fuse from "fuse.js";
import { Command, CornerDownLeft, Search, X } from "lucide-react";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { SEARCH_ITEMS, type SearchItem } from "@/lib/search-index";
import { cn } from "@/lib/utils";

const desktopSearchButtonClass =
  "hidden h-8 w-[216px] items-center justify-between gap-2.5 rounded-md border border-neutral-200/80 bg-white/95 px-2.5 text-left text-neutral-950 transition-colors hover:border-neutral-300 hover:bg-neutral-50 focus-visible:outline-1 focus-visible:outline-primary dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:hover:border-neutral-700 dark:hover:bg-neutral-900 lg:inline-flex xl:w-[228px]";
const mobileSearchButtonClass =
  "flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground dark:hover:bg-white/10 dark:hover:text-white lg:hidden";
const mobileMenuSearchButtonClass =
  "flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-left text-[13px] text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground";

type SiteSearchProps = {
  variant?: "desktop" | "mobile" | "menu";
};

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

function isSearchShortcut(event: globalThis.KeyboardEvent) {
  return (
    event.key.toLowerCase() === "k" &&
    (event.metaKey || event.ctrlKey) &&
    !event.altKey &&
    !event.shiftKey
  );
}

function canToggleSearchFromShortcut(
  event: globalThis.KeyboardEvent,
  usesDesktopShortcut: boolean,
  isDesktop: boolean
) {
  if (!(usesDesktopShortcut && isDesktop)) {
    return false;
  }

  if (!isSearchShortcut(event)) {
    return false;
  }

  return !isEditableTarget(event.target);
}

function SearchShortcut({ isMac }: { isMac: boolean }) {
  return (
    <KbdGroup className="shrink-0">
      {isMac ? (
        <>
          <Kbd className="px-1">
            <Command className="size-3" />
          </Kbd>
          <Kbd>K</Kbd>
        </>
      ) : (
        <>
          <Kbd className="px-1.5 normal-case">Ctrl</Kbd>
          <Kbd>K</Kbd>
        </>
      )}
    </KbdGroup>
  );
}

function getSearchItemMeta(item: SearchItem) {
  if (item.type === "component") {
    return `@iconiq/${item.href.split("/").pop() ?? item.label.toLowerCase()}`;
  }

  return item.href === "/" ? "overview" : item.href.replace("/", "");
}

export function SiteSearch({ variant = "desktop" }: SiteSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const inputId = useId();
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const usesDesktopShortcut = variant === "desktop";

  const fuse = useMemo(
    () =>
      new Fuse(SEARCH_ITEMS, {
        includeScore: true,
        keys: [
          { name: "label", weight: 0.45 },
          { name: "keywords", weight: 0.35 },
          { name: "summary", weight: 0.2 },
        ],
        threshold: 0.34,
      }),
    []
  );

  const results = useMemo(() => {
    const normalized = query.trim();

    if (!normalized) {
      return SEARCH_ITEMS;
    }

    return fuse.search(normalized).map((entry) => entry.item);
  }, [fuse, query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return;
    }

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 10);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isOpen]);

  useEffect(() => {
    resultRefs.current = resultRefs.current.slice(0, results.length);
  }, [results.length]);

  useEffect(() => {
    if (!isOpen) return;
    const activeResult = resultRefs.current[activeIndex];
    activeResult?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, isOpen]);

  useEffect(() => {
    if (!pathname) return;
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateDesktopState = () => {
      setIsDesktop(mediaQuery.matches);
      if (variant === "desktop" && !mediaQuery.matches) {
        setIsOpen(false);
      }
    };

    updateDesktopState();
    mediaQuery.addEventListener("change", updateDesktopState);

    return () => {
      mediaQuery.removeEventListener("change", updateDesktopState);
    };
  }, [variant]);

  useEffect(() => {
    const platform = navigator.platform.toLowerCase();
    setIsMac(platform.includes("mac"));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (canToggleSearchFromShortcut(event, usesDesktopShortcut, isDesktop)) {
        event.preventDefault();
        setIsOpen((current) => !current);
        return;
      }

      if (!isOpen) return;

      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDesktop, isOpen, usesDesktopShortcut]);

  const handlePick = (item: SearchItem) => {
    setIsOpen(false);
    router.push(item.href);
  };

  const moveActiveIndex = (direction: "down" | "up") => {
    setActiveIndex((current) => {
      if (results.length === 0) {
        return 0;
      }

      if (direction === "down") {
        return (current + 1) % results.length;
      }

      return (current - 1 + results.length) % results.length;
    });
  };

  const handleResultNavigation = (
    event: ReactKeyboardEvent<HTMLInputElement | HTMLDivElement>
  ) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActiveIndex("down");
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActiveIndex("up");
      return;
    }

    if (event.key === "Home") {
      if (results.length === 0) return;
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === "End") {
      if (results.length === 0) return;
      event.preventDefault();
      setActiveIndex(results.length - 1);
      return;
    }

    if (event.key === "Enter") {
      const activeItem = results[activeIndex];
      if (!activeItem) return;
      event.preventDefault();
      handlePick(activeItem);
    }
  };

  if (variant === "desktop" && !isDesktop) {
    return null;
  }

  return (
    <>
      {variant === "desktop" ? (
        <button
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          className={desktopSearchButtonClass}
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <Search className="size-4 shrink-0 text-neutral-400 dark:text-neutral-500" />
            <p className="truncate text-[13px] text-neutral-400 tracking-[-0.02em] dark:text-neutral-500">
              Search docs or components
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <SearchShortcut isMac={isMac} />
          </div>
        </button>
      ) : null}

      {variant === "mobile" ? (
        <button
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label="Open search"
          className={mobileSearchButtonClass}
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <Search className="size-4.5" />
        </button>
      ) : null}

      {variant === "menu" ? (
        <button
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          className={mobileMenuSearchButtonClass}
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span>Search docs...</span>
        </button>
      ) : null}

      <DialogPrimitive.Root onOpenChange={setIsOpen} open={isOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[220] bg-white/55 backdrop-blur-sm dark:bg-black/45" />
          <DialogPrimitive.Content className="fixed inset-x-3 top-[calc(var(--nav-stack-height-mobile)+0.75rem)] bottom-3 z-[221] flex flex-col overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-[0_28px_90px_rgba(10,10,10,0.12)] outline-none sm:inset-x-4 sm:bottom-4 lg:top-[calc(var(--nav-stack-height-desktop)+1rem)] lg:right-auto lg:bottom-auto lg:left-1/2 lg:w-[min(700px,calc(100vw-2rem))] lg:-translate-x-1/2 dark:border-neutral-800 dark:bg-neutral-950">
            <DialogPrimitive.Title className="sr-only">
              Search documentation
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              Search for components and documentation pages across the Iconiq
              website.
            </DialogPrimitive.Description>

            <div className="space-y-4 px-4 pt-4 pb-3">
              <div className="flex items-center justify-between px-1">
                <div className="space-y-1">
                  <p className="font-medium text-[15px] text-foreground tracking-[-0.03em]">
                    Search
                  </p>
                  <p className="text-[12px] text-neutral-500 dark:text-neutral-400">
                    Jump to docs and every documented component
                  </p>
                </div>
                <DialogPrimitive.Close asChild>
                  <button
                    aria-label="Close search"
                    className="flex size-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
                    type="button"
                  >
                    <X className="size-4" />
                  </button>
                </DialogPrimitive.Close>
              </div>

              <label
                className="flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/85 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/65"
                htmlFor={inputId}
              >
                <Search className="size-4 shrink-0 text-neutral-500 dark:text-neutral-400" />
                <input
                  aria-activedescendant={
                    results[activeIndex]
                      ? `${listboxId}-item-${activeIndex}`
                      : undefined
                  }
                  aria-autocomplete="list"
                  aria-controls={listboxId}
                  aria-expanded={isOpen}
                  className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-neutral-400 lg:text-[15px] dark:placeholder:text-neutral-500"
                  id={inputId}
                  onChange={(event) => {
                    setActiveIndex(0);
                    setQuery(event.target.value);
                  }}
                  onKeyDown={handleResultNavigation}
                  placeholder="Search components and docs..."
                  ref={inputRef}
                  role="combobox"
                  value={query}
                />
                {isDesktop ? <SearchShortcut isMac={isMac} /> : null}
              </label>
            </div>

            <div
              className="min-h-0 flex-1 overflow-y-auto border-neutral-200/80 border-t bg-neutral-50/[0.4] p-3 lg:max-h-[420px] lg:flex-none dark:border-neutral-800 dark:bg-neutral-950"
              onKeyDown={handleResultNavigation}
            >
              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                  <Search className="size-5 text-neutral-400 dark:text-neutral-500" />
                  <div className="space-y-1">
                    <p className="font-medium text-[15px] text-foreground">
                      No results found
                    </p>
                    <p className="text-[13px] text-neutral-500 dark:text-neutral-400">
                      Try searching by component name, category, or doc page.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1" id={listboxId} role="listbox">
                  {results.map((item, index) => {
                    const isActive = index === activeIndex;
                    const isCurrent = pathname === item.href;

                    return (
                      <motion.button
                        animate={{ opacity: 1, x: 0 }}
                        aria-selected={isActive}
                        className={cn(
                          "relative flex w-full items-start justify-between gap-4 rounded-xl px-4 py-3.5 text-left transition-colors",
                          "hover:bg-accent dark:hover:bg-white/[0.06]"
                        )}
                        id={`${listboxId}-item-${index}`}
                        initial={{ opacity: 0, x: -4 }}
                        key={`${item.href}-${item.label}`}
                        onClick={() => handlePick(item)}
                        onMouseEnter={() => setActiveIndex(index)}
                        ref={(node) => {
                          resultRefs.current[index] = node;
                        }}
                        role="option"
                        tabIndex={-1}
                        transition={{
                          delay: 0.016 * index,
                          duration: 0.18,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        type="button"
                      >
                        {isActive ? (
                          <motion.div
                            className="absolute inset-0 rounded-xl bg-accent dark:bg-neutral-900"
                            layoutId="site-search-active"
                            transition={{
                              type: "spring",
                              stiffness: 600,
                              damping: 38,
                            }}
                          />
                        ) : null}
                        <div className="min-w-0 space-y-1">
                          <div className="relative z-10 flex items-center gap-2 text-[11px] text-neutral-500 uppercase tracking-[0.18em] dark:text-neutral-400">
                            <span>{item.section}</span>
                            {isCurrent ? (
                              <span className="text-neutral-400 dark:text-neutral-500">
                                current
                              </span>
                            ) : null}
                          </div>
                          <p className="relative z-10 text-[16px] text-foreground tracking-[-0.03em]">
                            {item.label}
                          </p>
                          <p className="relative z-10 line-clamp-2 text-[13px] text-neutral-500 leading-5 dark:text-neutral-400">
                            {item.summary}
                          </p>
                          <p className="relative z-10 font-mono text-[10px] text-neutral-400 uppercase tracking-[0.18em] dark:text-neutral-500">
                            {getSearchItemMeta(item)}
                          </p>
                        </div>

                        <div className="relative z-10 mt-1 flex shrink-0 items-center gap-2 text-neutral-400 dark:text-neutral-500">
                          {isActive ? (
                            <CornerDownLeft className="size-4" />
                          ) : null}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="hidden items-center justify-end border-neutral-200/80 border-t px-5 py-3 text-[11px] text-neutral-500 uppercase tracking-[0.16em] lg:flex dark:border-neutral-800 dark:text-neutral-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <KbdGroup>
                    <Kbd>↑</Kbd>
                    <Kbd>↓</Kbd>
                  </KbdGroup>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-2">
                  <Kbd className="min-w-0 px-1.5">↵</Kbd>
                  <span>Open</span>
                </span>
                <span className="flex items-center gap-2">
                  <Kbd className="min-w-0 px-1.5 normal-case">Esc</Kbd>
                  <span>Close</span>
                </span>
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
