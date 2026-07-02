"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  ArrowDown,
  ArrowUp,
  Command,
  CornerDownLeft,
  Search,
  X,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";

import { cn } from "@/lib/utils";

const QUERY_SPLIT_REGEX = /\s+/;
const RECENT_STORAGE_KEY = "iconiq-command-palette-recent";
const MAC_PLATFORM_REGEX = /mac/i;
const EXTERNAL_HREF_REGEX = /^https?:\/\//i;

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)]";

const commandItemHighlightClassName =
  "absolute inset-0 -z-10 rounded-lg bg-accent/60";

const dialogClassName =
  "fixed inset-x-4 top-[calc(var(--nav-stack-height-mobile,0px)+0.75rem+env(safe-area-inset-top,0px))] z-[401] flex w-auto min-h-[12rem] max-h-[min(560px,calc(100dvh-var(--nav-stack-height-mobile,0px)-1.5rem-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)))] flex-col overflow-hidden rounded-2xl border border-border/80 bg-background shadow-[0_28px_90px_rgba(10,10,10,0.12)] outline-none sm:inset-x-6 lg:inset-x-auto lg:top-[calc(var(--nav-stack-height-desktop,0px)+1rem+env(safe-area-inset-top,0px))] lg:left-1/2 lg:w-[min(680px,calc(100vw-2rem))] lg:max-h-[min(560px,calc(100dvh-var(--nav-stack-height-desktop,0px)-2rem-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)))] lg:-translate-x-1/2";

const resultsClassName = "max-h-[min(420px,50dvh)]";

type StoredRecentItem = {
  description?: string;
  href?: string;
  id?: string;
  keywords?: string[];
  label: string;
  value?: string;
};

type DisplaySection = {
  heading: string;
  items: CommandMenuItemDef[];
};

export type CommandMenuItemDef = {
  action?: () => void;
  description?: string;
  disabled?: boolean;
  external?: boolean;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  id?: string;
  keywords?: string[];
  label: string;
  replace?: boolean;
  shortcut?: string;
  value?: string;
};

export type CommandMenuGroupDef = {
  heading: string;
  items: CommandMenuItemDef[];
};

export interface CommandMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  shortcut?: string;
  showShortcut?: boolean;
}

export interface CommandPaletteProps {
  className?: string;
  closeOnRouteChange?: boolean;
  contentDelay?: number;
  currentPath?: string;
  emptyMessage?: string;
  enableGlobalShortcut?: boolean;
  filter?: (item: CommandMenuItemDef, query: string) => boolean;
  groups?: CommandMenuGroupDef[];
  loadingMessage?: string;
  maxRecentItems?: number;
  noQueryMessage?: string;
  onNavigate?: (href: string, item: CommandMenuItemDef) => void;
  onOpenChange?: (open: boolean) => void;
  onSearch?: (query: string) => Promise<CommandMenuGroupDef[]>;
  onSelect?: (item: CommandMenuItemDef) => void;
  open?: boolean;
  overlayClassName?: string;
  placeholder?: string;
  positionClassName?: string;
  recentItems?: CommandMenuItemDef[];
  searchDebounceMs?: number;
  shortcutKey?: string;
  showFooterHints?: boolean;
  showRecentGroup?: boolean;
  showThemeGroup?: boolean;
  themeGroup?: CommandMenuGroupDef;
  themeGroupHeading?: string;
  themed?: boolean;
  trigger?: React.ReactNode;
  triggerProps?: CommandMenuTriggerProps;
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    if (delayMs <= 0) {
      setDebounced(value);
      return;
    }

    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [delayMs, value]);

  return debounced;
}

function useIsMac() {
  const [isMac, setIsMac] = React.useState(true);

  React.useEffect(() => {
    if (typeof navigator === "undefined") {
      return;
    }

    const navigatorWithUserAgentData = navigator as Navigator & {
      userAgentData?: { platform?: string };
    };
    const platform =
      navigatorWithUserAgentData.userAgentData?.platform ??
      navigator.platform ??
      "";

    setIsMac(MAC_PLATFORM_REGEX.test(platform));
  }, []);

  return isMac;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text: string, query: string) {
  const rawTerms = query.trim().split(QUERY_SPLIT_REGEX).filter(Boolean);

  if (rawTerms.length === 0) {
    return text;
  }

  const parts = text.split(
    new RegExp(`(${rawTerms.map(escapeRegExp).join("|")})`, "gi")
  );

  return parts.map((part, index) => {
    if (rawTerms.some((term) => part.toLowerCase() === term.toLowerCase())) {
      return (
        <mark
          className="rounded-sm bg-amber-200/90 px-0.5 text-foreground dark:bg-amber-400/40"
          key={`${part}-${index}`}
        >
          {part}
        </mark>
      );
    }

    return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
  });
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

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

function getItemKey(item: CommandMenuItemDef) {
  return item.id ?? item.value ?? item.href ?? item.label;
}

function matchesQuery(
  item: CommandMenuItemDef,
  query: string,
  customFilter?: CommandPaletteProps["filter"]
) {
  if (customFilter) {
    return customFilter(item, query);
  }

  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  const haystack = [item.label, item.description, ...(item.keywords ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return normalized
    .split(QUERY_SPLIT_REGEX)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

function filterGroupItems(
  items: CommandMenuItemDef[],
  query: string,
  customFilter?: CommandPaletteProps["filter"]
) {
  return items.filter((item) => matchesQuery(item, query, customFilter));
}

function loadStoredRecentItems(): StoredRecentItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as StoredRecentItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistRecentItem(item: CommandMenuItemDef, maxRecentItems: number) {
  if (typeof window === "undefined") {
    return;
  }

  const nextEntry: StoredRecentItem = {
    description: item.description,
    href: item.href,
    id: item.id,
    keywords: item.keywords,
    label: item.label,
    value: item.value,
  };

  const existing = loadStoredRecentItems().filter(
    (entry) => getItemKey(entry as CommandMenuItemDef) !== getItemKey(item)
  );

  try {
    window.localStorage.setItem(
      RECENT_STORAGE_KEY,
      JSON.stringify([nextEntry, ...existing].slice(0, maxRecentItems))
    );
  } catch {
    // Ignore quota errors.
  }
}

function findNextSelectableIndex(
  items: CommandMenuItemDef[],
  current: number,
  direction: 1 | -1
) {
  if (items.length === 0) {
    return 0;
  }

  let next = current;

  for (const _item of items) {
    next = (next + direction + items.length) % items.length;

    if (!items[next]?.disabled) {
      return next;
    }
  }

  return current;
}

function SearchShortcutBadge({
  className,
  isMac,
  shortcutKey,
}: {
  className?: string;
  isMac: boolean;
  shortcutKey: string;
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
  className,
  label = "Search…",
  onClick,
  shortcut = "K",
  showShortcut = true,
  ...props
}: CommandMenuTriggerProps) {
  const isMac = useIsMac();

  return (
    <button
      className={cn(
        "flex w-full max-w-sm items-center gap-2 rounded-lg border border-border/80 bg-background/60 px-3 py-2 text-left text-muted-foreground text-sm backdrop-blur-sm transition-colors hover:bg-accent/50",
        className
      )}
      data-slot="command-palette-trigger"
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

function createDefaultThemeGroup(
  setTheme: (theme: string) => void,
  heading: string
): CommandMenuGroupDef {
  return {
    heading,
    items: [
      {
        id: "theme-light",
        label: "Light Mode",
        action: () => setTheme("light"),
        keywords: ["light", "bright", "white", "day"],
      },
      {
        id: "theme-dark",
        label: "Dark Mode",
        action: () => setTheme("dark"),
        keywords: ["dark", "night", "black"],
      },
      {
        id: "theme-system",
        label: "System Theme",
        action: () => setTheme("system"),
        keywords: ["system", "auto", "os", "default"],
      },
    ],
  };
}

type CommandPaletteViewProps = CommandPaletteProps & {
  setTheme?: (theme: string) => void;
};

function CommandPaletteView({
  className,
  closeOnRouteChange = true,
  contentDelay = 0,
  currentPath,
  emptyMessage = "No results found.",
  enableGlobalShortcut = true,
  filter: customFilter,
  groups = [],
  loadingMessage = "Searching…",
  maxRecentItems = 5,
  noQueryMessage = "Start typing to search commands.",
  onNavigate,
  onOpenChange,
  onSearch,
  onSelect,
  open: openProp,
  overlayClassName,
  placeholder = "Search components, pages, actions…",
  positionClassName,
  recentItems,
  searchDebounceMs = 200,
  shortcutKey = "k",
  showFooterHints = true,
  showRecentGroup = false,
  showThemeGroup = false,
  themeGroup,
  themeGroupHeading = "Theme",
  themed = false,
  trigger,
  triggerProps,
  setTheme,
}: CommandPaletteViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const resolvedPath = currentPath ?? pathname ?? "";
  const isMac = useIsMac();
  const prefersReducedMotion = useReducedMotion() === true;
  const paletteId = React.useId().replace(/:/g, "");
  const listboxId = `${paletteId}-listbox`;
  const dialogId = `${paletteId}-dialog`;

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const [resultsVisible, setResultsVisible] = React.useState(contentDelay <= 0);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [storedRecentItems, setStoredRecentItems] = React.useState<
    CommandMenuItemDef[]
  >([]);
  const [asyncGroups, setAsyncGroups] = React.useState<CommandMenuGroupDef[]>(
    []
  );
  const [isSearching, setIsSearching] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const previousPathnameRef = React.useRef(pathname);

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;
  const debouncedQuery = useDebouncedValue(
    query,
    onSearch ? searchDebounceMs : 0
  );
  const searchQuery = onSearch ? debouncedQuery : query;

  const setOpen = React.useCallback(
    (nextOpen: boolean | ((current: boolean) => boolean)) => {
      if (isControlled) {
        const resolved =
          typeof nextOpen === "function"
            ? nextOpen(Boolean(openProp))
            : nextOpen;
        onOpenChange?.(resolved);
        return;
      }

      setUncontrolledOpen((current) => {
        const resolved =
          typeof nextOpen === "function" ? nextOpen(current) : nextOpen;
        onOpenChange?.(resolved);
        return resolved;
      });
    },
    [isControlled, onOpenChange, openProp]
  );

  React.useEffect(() => {
    if (!showRecentGroup) {
      return;
    }

    setStoredRecentItems(recentItems ?? loadStoredRecentItems());
  }, [recentItems, showRecentGroup]);

  React.useEffect(() => {
    if (!open) {
      setResultsVisible(false);
      setQuery("");
      setActiveIndex(0);
      setAsyncGroups([]);
      setIsSearching(false);
      return;
    }

    if (contentDelay > 0) {
      const contentId = window.setTimeout(
        () => setResultsVisible(true),
        contentDelay
      );
      const focusId = window.setTimeout(() => inputRef.current?.focus(), 10);

      return () => {
        window.clearTimeout(contentId);
        window.clearTimeout(focusId);
      };
    }

    setResultsVisible(true);
    const focusId = window.setTimeout(() => inputRef.current?.focus(), 10);

    return () => {
      window.clearTimeout(focusId);
    };
  }, [contentDelay, open]);

  React.useEffect(() => {
    if (!(closeOnRouteChange && pathname)) {
      previousPathnameRef.current = pathname;
      return;
    }

    if (previousPathnameRef.current === pathname) {
      return;
    }

    previousPathnameRef.current = pathname;
    setOpen(false);
  }, [closeOnRouteChange, pathname, setOpen]);

  React.useEffect(() => {
    if (!enableGlobalShortcut) {
      return;
    }

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
  }, [enableGlobalShortcut, setOpen, shortcutKey]);

  React.useEffect(() => {
    if (!(open && onSearch)) {
      return;
    }

    let cancelled = false;
    setIsSearching(true);

    onSearch(debouncedQuery)
      .then((nextGroups) => {
        if (!cancelled) {
          setAsyncGroups(nextGroups);
          setIsSearching(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAsyncGroups([]);
          setIsSearching(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, onSearch, open]);

  const themeSection = React.useMemo<CommandMenuGroupDef | null>(() => {
    if (!(showThemeGroup && setTheme)) {
      return null;
    }

    return themeGroup ?? createDefaultThemeGroup(setTheme, themeGroupHeading);
  }, [setTheme, showThemeGroup, themeGroup, themeGroupHeading]);

  const displaySections = React.useMemo<DisplaySection[]>(() => {
    const sections: DisplaySection[] = [];

    if (showRecentGroup) {
      const recent = filterGroupItems(
        storedRecentItems,
        searchQuery,
        customFilter
      );

      if (recent.length > 0) {
        sections.push({ heading: "Recent", items: recent });
      }
    }

    for (const group of [...groups, ...asyncGroups]) {
      const items = filterGroupItems(group.items, searchQuery, customFilter);

      if (items.length > 0) {
        sections.push({ heading: group.heading, items });
      }
    }

    if (themeSection) {
      const items = filterGroupItems(
        themeSection.items,
        searchQuery,
        customFilter
      );

      if (items.length > 0) {
        sections.push({ heading: themeSection.heading, items });
      }
    }

    return sections;
  }, [
    asyncGroups,
    customFilter,
    groups,
    searchQuery,
    showRecentGroup,
    storedRecentItems,
    themeSection,
  ]);

  const flatItems = React.useMemo(
    () => displaySections.flatMap((section) => section.items),
    [displaySections]
  );

  React.useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, flatItems.length);

    if (flatItems.length === 0) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex(findNextSelectableIndex(flatItems, -1, 1));
  }, [flatItems]);

  React.useEffect(() => {
    itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const activeOptionId =
    flatItems.length > 0 ? `${listboxId}-opt-${activeIndex}` : undefined;

  const run = React.useCallback(
    (fn: () => void) => {
      setOpen(false);
      fn();
    },
    [setOpen]
  );

  const rememberRecentItem = React.useCallback(
    (item: CommandMenuItemDef) => {
      if (!showRecentGroup) {
        return;
      }

      persistRecentItem(item, maxRecentItems);
      setStoredRecentItems((current) => {
        const nextEntry: CommandMenuItemDef = {
          description: item.description,
          href: item.href,
          id: item.id,
          keywords: item.keywords,
          label: item.label,
          value: item.value,
        };

        return [
          nextEntry,
          ...current.filter((entry) => getItemKey(entry) !== getItemKey(item)),
        ].slice(0, maxRecentItems);
      });
    },
    [maxRecentItems, showRecentGroup]
  );

  const handleItemSelect = React.useCallback(
    (item: CommandMenuItemDef) => {
      if (item.disabled) {
        return;
      }

      onSelect?.(item);
      rememberRecentItem(item);

      if (item.action) {
        run(item.action);
        return;
      }

      if (!item.href) {
        return;
      }

      const href = item.href;
      const isExternal =
        item.external === true || EXTERNAL_HREF_REGEX.test(href);

      if (isExternal) {
        run(() => {
          window.open(href, "_blank", "noopener,noreferrer");
        });
        return;
      }

      if (onNavigate) {
        run(() => onNavigate(href, item));
        return;
      }

      run(() => {
        if (item.replace) {
          router.replace(href);
          return;
        }

        router.push(href);
      });
    },
    [onNavigate, onSelect, rememberRecentItem, router, run]
  );

  const handleListKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) =>
        flatItems.length === 0
          ? 0
          : findNextSelectableIndex(flatItems, current, 1)
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        flatItems.length === 0
          ? 0
          : findNextSelectableIndex(flatItems, current, -1)
      );
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(findNextSelectableIndex(flatItems, -1, 1));
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(findNextSelectableIndex(flatItems, flatItems.length, -1));
      return;
    }

    if (event.key === "Enter") {
      const activeItem = flatItems[activeIndex];

      if (!activeItem || activeItem.disabled) {
        return;
      }

      event.preventDefault();
      handleItemSelect(activeItem);
    }
  };

  const renderTrigger = () => {
    const triggerAria = {
      "aria-controls": dialogId,
      "aria-expanded": open,
      "aria-haspopup": "dialog" as const,
    };

    if (trigger) {
      if (
        React.isValidElement<{
          onClick?: (event: React.MouseEvent) => void;
        }>(trigger)
      ) {
        return React.cloneElement(trigger, {
          ...triggerAria,
          onClick: (event: React.MouseEvent) => {
            trigger.props.onClick?.(event);
            setOpen(true);
          },
        });
      }

      return (
        <button
          className="cursor-pointer"
          onClick={() => setOpen(true)}
          type="button"
          {...triggerAria}
        >
          {trigger}
        </button>
      );
    }

    const { onClick: triggerOnClick, ...restTriggerProps } = triggerProps ?? {};

    return (
      <CommandMenuTrigger
        shortcut={shortcutKey.toUpperCase()}
        {...restTriggerProps}
        {...triggerAria}
        onClick={(event) => {
          triggerOnClick?.(event);
          setOpen(true);
        }}
      />
    );
  };

  const renderItem = (item: CommandMenuItemDef, index: number, key: string) => {
    const isActive = index === activeIndex;
    const optionId = `${listboxId}-opt-${index}`;
    const ItemIcon = item.icon;
    const isCurrentPage =
      Boolean(item.href) &&
      Boolean(resolvedPath) &&
      (item.href === resolvedPath ||
        (item.href !== "/" && resolvedPath.startsWith(`${item.href}/`)));

    return (
      <button
        aria-selected={isActive}
        className={cn(
          "relative isolate flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left text-foreground text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          item.disabled && "cursor-not-allowed opacity-50"
        )}
        data-slot="command-palette-option"
        disabled={item.disabled}
        id={optionId}
        key={key}
        onClick={() => handleItemSelect(item)}
        onMouseEnter={() => {
          if (!item.disabled) {
            setActiveIndex(index);
          }
        }}
        ref={(node) => {
          itemRefs.current[index] = node;
        }}
        role="option"
        type="button"
      >
        {isActive ? (
          prefersReducedMotion ? (
            <span aria-hidden className={commandItemHighlightClassName} />
          ) : (
            <motion.span
              aria-hidden
              className={commandItemHighlightClassName}
              layoutId={`${paletteId}-active-item`}
              transition={{ type: "spring", stiffness: 600, damping: 38 }}
            />
          )
        ) : null}
        {ItemIcon ? (
          <ItemIcon className="relative z-10 mt-0.5 size-4 shrink-0 text-muted-foreground" />
        ) : null}
        <div className="relative z-10 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="truncate font-medium text-sm">
              {highlightText(item.label, searchQuery)}
            </div>
            {isCurrentPage ? (
              <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 font-medium text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
                Current
              </span>
            ) : null}
          </div>
          {item.description ? (
            <p className="mt-0.5 line-clamp-2 text-muted-foreground text-xs leading-5">
              {highlightText(item.description, searchQuery)}
            </p>
          ) : null}
        </div>
        {item.shortcut ? (
          <Kbd className="relative z-10 mt-0.5 shrink-0">{item.shortcut}</Kbd>
        ) : null}
      </button>
    );
  };

  const indexedSections = React.useMemo(() => {
    let index = 0;

    return displaySections.map((section) => ({
      heading: section.heading,
      items: section.items.map((item) => {
        const currentIndex = index;
        index += 1;

        return { index: currentIndex, item };
      }),
    }));
  }, [displaySections]);

  const hasQuery = searchQuery.trim().length > 0;
  const showEmptyState = !isSearching && flatItems.length === 0;
  const emptyStateMessage = hasQuery ? emptyMessage : noQueryMessage;

  return (
    <>
      {renderTrigger()}

      <DialogPrimitive.Root onOpenChange={setOpen} open={open}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay
            className={cn(
              "fixed inset-0 z-[400] bg-black/40 backdrop-blur-sm dark:bg-black/55",
              overlayClassName
            )}
          />
          <DialogPrimitive.Content
            className={cn(
              dialogClassName,
              themed && componentThemeClassName,
              className,
              positionClassName
            )}
            data-slot="command-palette-content"
            id={dialogId}
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              inputRef.current?.focus();
            }}
          >
            <DialogPrimitive.Title className="sr-only">
              Command palette
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              Search commands and navigate results with the keyboard.
            </DialogPrimitive.Description>

            <div className="flex shrink-0 items-center gap-3 border-border/70 border-b px-4 py-3">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                aria-activedescendant={activeOptionId}
                aria-autocomplete="list"
                aria-controls={listboxId}
                aria-expanded={open}
                autoCapitalize="off"
                autoCorrect="off"
                className="w-full min-w-0 touch-manipulation bg-transparent text-[16px] text-foreground leading-normal outline-none placeholder:text-muted-foreground md:text-sm"
                data-slot="command-palette-input"
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleListKeyDown}
                placeholder={placeholder}
                ref={inputRef}
                role="combobox"
                spellCheck={false}
                type="text"
                value={query}
              />
              <SearchShortcutBadge
                className="hidden md:inline-flex"
                isMac={isMac}
                shortcutKey={shortcutKey}
              />
              <DialogPrimitive.Close asChild>
                <button
                  aria-label="Close command palette"
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  type="button"
                >
                  <X className="size-4" />
                </button>
              </DialogPrimitive.Close>
            </div>

            <div
              className={cn(
                "min-h-0 overflow-hidden transition-[max-height,opacity] duration-200 ease-out",
                resultsVisible
                  ? cn("opacity-100", resultsClassName)
                  : "max-h-0 opacity-0"
              )}
            >
              <div
                aria-busy={isSearching}
                className="h-full max-h-[inherit] overflow-y-auto overscroll-contain p-2 [-webkit-overflow-scrolling:touch]"
                id={listboxId}
                onKeyDown={handleListKeyDown}
                role="listbox"
              >
                {isSearching ? (
                  <div className="px-3 py-10 text-center text-muted-foreground text-sm">
                    {loadingMessage}
                  </div>
                ) : showEmptyState ? (
                  <div className="px-3 py-10 text-center text-muted-foreground text-sm">
                    {emptyStateMessage}
                  </div>
                ) : (
                  indexedSections.map((section, sectionIndex) => (
                    <React.Fragment key={section.heading}>
                      {sectionIndex > 0 ? (
                        <div className="mx-2 my-2 h-px bg-border/60" />
                      ) : null}
                      <div className="px-2 py-1">
                        <div className="px-1 pb-1.5 font-medium text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
                          {section.heading}
                        </div>
                        <div className="space-y-1">
                          {section.items.map(({ index, item }) =>
                            renderItem(
                              item,
                              index,
                              `${section.heading}-${getItemKey(item)}-${index}`
                            )
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  ))
                )}
              </div>
            </div>

            {showFooterHints ? (
              <div
                className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 border-border/70 border-t px-4 py-2 text-[11px] text-muted-foreground"
                data-slot="command-palette-footer"
              >
                <span className="inline-flex items-center gap-1">
                  <Kbd>
                    <ArrowUp className="size-3" />
                  </Kbd>
                  <Kbd>
                    <ArrowDown className="size-3" />
                  </Kbd>
                  Navigate
                </span>
                <span className="inline-flex items-center gap-1">
                  <Kbd>
                    <CornerDownLeft className="size-3" />
                  </Kbd>
                  Select
                </span>
                <span className="inline-flex items-center gap-1">
                  <Kbd className="px-2">esc</Kbd>
                  Close
                </span>
              </div>
            ) : null}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}

function CommandPaletteWithTheme(props: CommandPaletteProps) {
  const { setTheme } = useTheme();

  return <CommandPaletteView {...props} setTheme={setTheme} />;
}

function CommandPalette(props: CommandPaletteProps) {
  if (props.showThemeGroup) {
    return <CommandPaletteWithTheme {...props} />;
  }

  return <CommandPaletteView {...props} />;
}

export {
  CommandMenuTrigger,
  CommandPalette,
  CommandPalette as CommandMenu,
  Kbd,
  KbdGroup,
};
