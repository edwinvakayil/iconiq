"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Command, Monitor, Moon, Search, Sun, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";

import { cn } from "@/lib/utils";

const QUERY_SPLIT_REGEX = /\s+/;

const commandItemHighlightClassName =
  "absolute inset-0 rounded-lg bg-accent/60";

function useDebouncedValue<T>(value: T, delayMs = 150): T {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [delayMs, value]);

  return debounced;
}

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-[6px] border border-border bg-background px-1.5 font-medium font-sans text-[11px] text-muted-foreground",
        className
      )}
      data-slot="kbd"
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      data-slot="kbd-group"
      {...props}
    />
  );
}

type CommandMenuItemDef = {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
  action?: () => void;
  keywords?: string[];
  description?: string;
};

export type CommandMenuGroupDef = {
  heading: string;
  items: CommandMenuItemDef[];
};

interface CommandMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  shortcut?: string;
  showShortcut?: boolean;
}

export interface CommandPaletteProps {
  groups?: CommandMenuGroupDef[];
  showThemeGroup?: boolean;
  placeholder?: string;
  shortcutKey?: string;
  contentDelay?: number;
  trigger?: React.ReactNode;
  triggerProps?: CommandMenuTriggerProps;
  className?: string;
  emptyMessage?: string;
}

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

function matchesQuery(item: CommandMenuItemDef, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  const terms = normalized.split(QUERY_SPLIT_REGEX).filter(Boolean);
  const haystack = [item.label, item.description, ...(item.keywords ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return terms.every((term) => haystack.includes(term));
}

function SearchShortcutBadge({
  shortcutKey,
  isMac,
  className,
}: {
  shortcutKey: string;
  isMac: boolean;
  className?: string;
}) {
  return (
    <KbdGroup className={cn("shrink-0", className)}>
      {isMac ? (
        <>
          <Kbd className="px-1">
            <Command className="size-3" />
          </Kbd>
          <Kbd>{shortcutKey.toUpperCase()}</Kbd>
        </>
      ) : (
        <>
          <Kbd className="px-1.5 normal-case">Ctrl</Kbd>
          <Kbd>{shortcutKey.toUpperCase()}</Kbd>
        </>
      )}
    </KbdGroup>
  );
}

function CommandMenuTrigger({
  label = "Search…",
  shortcut = "K",
  showShortcut = true,
  className,
  onClick,
  ...props
}: CommandMenuTriggerProps) {
  const [isMac, setIsMac] = React.useState(true);

  React.useEffect(() => {
    setIsMac(navigator.platform.toLowerCase().includes("mac"));
  }, []);

  return (
    <button
      className={cn(
        "flex w-full max-w-sm items-center gap-2 rounded-lg border border-border/80 bg-background/60 px-3 py-2 text-left text-muted-foreground text-sm backdrop-blur-sm transition-colors hover:bg-accent/50",
        className
      )}
      onClick={onClick}
      type="button"
      {...props}
    >
      <Search className="size-4 shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {showShortcut ? (
        <SearchShortcutBadge
          className="hidden sm:inline-flex"
          isMac={isMac}
          shortcutKey={shortcut}
        />
      ) : null}
    </button>
  );
}

function CommandPalette({
  groups = [],
  showThemeGroup = true,
  placeholder = "Search components, pages, actions…",
  shortcutKey = "k",
  contentDelay = 150,
  trigger,
  triggerProps,
  className,
  emptyMessage = "No results found.",
}: CommandPaletteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const reduceMotion = useReducedMotion() ?? false;
  const paletteId = React.useId().replace(/:/g, "");

  const [open, setOpen] = React.useState(false);
  const [showContent, setShowContent] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, 120);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isMac, setIsMac] = React.useState(true);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  React.useEffect(() => {
    setIsMac(navigator.platform.toLowerCase().includes("mac"));
  }, []);

  React.useEffect(() => {
    if (open) {
      const contentId = window.setTimeout(
        () => setShowContent(true),
        contentDelay
      );
      const focusId = window.setTimeout(() => inputRef.current?.focus(), 10);

      return () => {
        window.clearTimeout(contentId);
        window.clearTimeout(focusId);
      };
    }

    setShowContent(false);
    setQuery("");
    setActiveIndex(0);
  }, [contentDelay, open]);

  React.useEffect(() => {
    if (!pathname) {
      return;
    }

    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === shortcutKey.toLowerCase() &&
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        !event.shiftKey &&
        !isEditableTarget(event.target)
      ) {
        event.preventDefault();
        event.stopPropagation();
        setOpen((current) => !current);
      }
    };

    document.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [shortcutKey]);

  const run = React.useCallback((fn: () => void) => {
    setOpen(false);
    fn();
  }, []);

  const handleOpen = React.useCallback(() => {
    setOpen(true);
  }, []);

  const themeItems = React.useMemo<CommandMenuItemDef[]>(
    () =>
      showThemeGroup
        ? [
            {
              label: "Light Mode",
              icon: Sun,
              action: () => setTheme("light"),
              keywords: ["light", "bright", "white", "day"],
            },
            {
              label: "Dark Mode",
              icon: Moon,
              action: () => setTheme("dark"),
              keywords: ["dark", "night", "black"],
            },
            {
              label: "System Theme",
              icon: Monitor,
              action: () => setTheme("system"),
              keywords: ["system", "auto", "os", "default"],
            },
          ]
        : [],
    [setTheme, showThemeGroup]
  );

  const filteredGroups = React.useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            matchesQuery(item, debouncedQuery)
          ),
        }))
        .filter((group) => group.items.length > 0),
    [debouncedQuery, groups]
  );

  const filteredThemeItems = React.useMemo(
    () => themeItems.filter((item) => matchesQuery(item, debouncedQuery)),
    [debouncedQuery, themeItems]
  );

  const resolvedItems = React.useMemo<CommandMenuItemDef[]>(() => {
    const groupItems = filteredGroups.flatMap((group) =>
      group.items.map((item) => item)
    );

    const themedItems = filteredThemeItems.map((item) => item);

    return [...groupItems, ...themedItems];
  }, [filteredGroups, filteredThemeItems]);

  React.useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, resolvedItems.length);

    if (resolvedItems.length === 0) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex((current) => Math.min(current, resolvedItems.length - 1));
  }, [resolvedItems.length]);

  React.useEffect(() => {
    const activeItem = itemRefs.current[activeIndex];
    activeItem?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const handleItemSelect = React.useCallback(
    (item: CommandMenuItemDef) => {
      if (item.action) {
        run(item.action);
        return;
      }

      if (item.href) {
        const href = item.href;
        run(() => router.push(href));
      }
    },
    [router, run]
  );

  const handleListKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) =>
        resolvedItems.length === 0 ? 0 : (current + 1) % resolvedItems.length
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        resolvedItems.length === 0
          ? 0
          : (current - 1 + resolvedItems.length) % resolvedItems.length
      );
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(Math.max(resolvedItems.length - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      const activeItem = resolvedItems[activeIndex];

      if (!activeItem) {
        return;
      }

      event.preventDefault();
      handleItemSelect(activeItem);
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  let optionIndex = -1;

  const renderItem = (item: CommandMenuItemDef, key: string) => {
    optionIndex += 1;
    const index = optionIndex;
    const isActive = index === activeIndex;

    return (
      <button
        className={cn(
          "relative isolate flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left text-foreground text-sm transition-colors focus-visible:outline-none"
        )}
        key={key}
        onClick={() => handleItemSelect(item)}
        onMouseEnter={() => setActiveIndex(index)}
        ref={(node) => {
          itemRefs.current[index] = node;
        }}
        type="button"
      >
        {isActive ? (
          <motion.span
            aria-hidden
            className={commandItemHighlightClassName}
            layoutId={`${paletteId}-active-item`}
            transition={
              reduceMotion
                ? { duration: 0.12, ease: "easeOut" }
                : { type: "spring", stiffness: 600, damping: 38 }
            }
          />
        ) : null}
        {item.icon ? (
          <item.icon className="relative z-10 mt-0.5 size-4 shrink-0" />
        ) : (
          <Search className="relative z-10 mt-0.5 size-4 shrink-0 opacity-45" />
        )}
        <div className="relative z-10 min-w-0">
          <div className="truncate font-medium text-sm">{item.label}</div>
          {item.description ? (
            <p className="mt-0.5 line-clamp-2 text-muted-foreground text-xs leading-5">
              {item.description}
            </p>
          ) : null}
        </div>
      </button>
    );
  };

  return (
    <>
      {trigger ? (
        React.isValidElement<{ onClick?: () => void }>(trigger) ? (
          React.cloneElement(trigger, {
            onClick: handleOpen,
          })
        ) : (
          <button className="cursor-pointer" onClick={handleOpen} type="button">
            {trigger}
          </button>
        )
      ) : (
        <CommandMenuTrigger
          shortcut={shortcutKey.toUpperCase()}
          {...triggerProps}
          onClick={handleOpen}
        />
      )}

      <DialogPrimitive.Root onOpenChange={setOpen} open={open}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[220] bg-background/55 backdrop-blur-sm" />
          <DialogPrimitive.Content
            className={cn(
              "fixed inset-x-4 top-[calc(var(--nav-stack-height-mobile)+0.75rem)] z-[221] overflow-hidden rounded-2xl border border-border/80 bg-background shadow-[0_28px_90px_rgba(10,10,10,0.12)] outline-none sm:inset-x-6 lg:top-[calc(var(--nav-stack-height-desktop)+1rem)] lg:left-1/2 lg:w-[min(680px,calc(100vw-2rem))] lg:-translate-x-1/2",
              className
            )}
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              inputRef.current?.focus();
            }}
          >
            <DialogPrimitive.Title className="sr-only">
              Search
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              Search pages and components, or switch the site theme.
            </DialogPrimitive.Description>

            <div className="flex items-center gap-3 border-border/70 border-b px-4 py-3">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                className="w-full bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground"
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleListKeyDown}
                placeholder={placeholder}
                ref={inputRef}
                value={query}
              />
              <SearchShortcutBadge
                className="hidden md:inline-flex"
                isMac={isMac}
                shortcutKey={shortcutKey}
              />
              <DialogPrimitive.Close asChild>
                <button
                  aria-label="Close search"
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  type="button"
                >
                  <X className="size-4" />
                </button>
              </DialogPrimitive.Close>
            </div>

            <div
              className="overflow-hidden transition-all duration-300 ease-out"
              style={{
                maxHeight: showContent ? "420px" : "0px",
                opacity: showContent ? 1 : 0,
              }}
            >
              <div
                className="max-h-[420px] overflow-y-auto p-2"
                onKeyDown={handleListKeyDown}
              >
                {resolvedItems.length === 0 ? (
                  <div className="px-3 py-10 text-center text-muted-foreground text-sm">
                    {emptyMessage}
                  </div>
                ) : (
                  <>
                    {filteredGroups.map((group, groupIndex) => (
                      <React.Fragment key={group.heading}>
                        {groupIndex > 0 ? (
                          <div className="mx-2 my-2 h-px bg-border/60" />
                        ) : null}
                        <div className="px-2 py-1">
                          <div className="px-1 pb-1.5 font-medium text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
                            {group.heading}
                          </div>
                          <div className="space-y-1">
                            {group.items.map((item, itemIndex) =>
                              renderItem(
                                item,
                                `${group.heading}-${item.href ?? item.label}-${itemIndex}`
                              )
                            )}
                          </div>
                        </div>
                      </React.Fragment>
                    ))}

                    {filteredThemeItems.length > 0 ? (
                      <>
                        {filteredGroups.length > 0 ? (
                          <div className="mx-2 my-2 h-px bg-border/60" />
                        ) : null}
                        <div className="px-2 py-1">
                          <div className="px-1 pb-1.5 font-medium text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
                            Theme
                          </div>
                          <div className="space-y-1">
                            {filteredThemeItems.map((item, index) =>
                              renderItem(item, `theme-${item.label}-${index}`)
                            )}
                          </div>
                        </div>
                      </>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}

export { CommandPalette, CommandPalette as CommandMenu };
