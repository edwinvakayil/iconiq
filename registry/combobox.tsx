"use client";

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const controlCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[11px]";

const controlCornerInheritClassName =
  "rounded-[inherit] supports-[corner-shape:squircle]:[corner-shape:inherit]";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const comboboxListScrollbarClassName =
  "z-10 my-1.5 mr-0.5 w-1 shrink-0 touch-none select-none opacity-0 transition-opacity duration-150 before:absolute before:left-1/2 before:h-full before:w-5 before:-translate-x-1/2 before:content-[''] data-hovering:pointer-events-auto data-hovering:opacity-100 data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0";

const comboboxListThumbClassName =
  "relative rounded-full bg-muted-foreground/50 bg-[color:color-mix(in_oklch,var(--ic-muted-foreground),transparent_35%)]";

export type ComboboxOption = {
  value: string;
  label: string;
  description?: string;
};

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
  clearable?: boolean;
  openOnFocus?: boolean;
}

type SearchParts = {
  normalized: string;
  compact: string;
  tokens: string[];
};

function getSearchParts(value: string): SearchParts {
  const normalized = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    normalized,
    compact: normalized.replace(/\s+/g, ""),
    tokens: normalized.split(" ").filter(Boolean),
  };
}

function matchesSearch(
  candidate: string | undefined,
  { normalized, compact, tokens }: SearchParts
) {
  if (!candidate) return false;

  const candidateParts = getSearchParts(candidate);

  if (candidateParts.normalized.includes(normalized)) return true;
  if (compact && candidateParts.compact.includes(compact)) return true;

  return (
    tokens.length > 0 &&
    tokens.every(
      (token) =>
        candidateParts.normalized.includes(token) ||
        candidateParts.compact.includes(token)
    )
  );
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  emptyMessage = "No results found.",
  className,
  disabled = false,
  clearable = true,
  openOnFocus = false,
}: ComboboxProps) {
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [isEditingQuery, setIsEditingQuery] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);
  const [menuStyle, setMenuStyle] = React.useState<React.CSSProperties>({
    top: 0,
    left: 0,
    width: 0,
  });

  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const listboxId = React.useId();

  const selected = options.find((o) => o.value === value);

  const filtered = React.useMemo(() => {
    const search = getSearchParts(query);
    if (!search.normalized) return options;

    return options.filter(
      (o) =>
        matchesSearch(o.label, search) ||
        matchesSearch(o.value, search) ||
        matchesSearch(o.description, search)
    );
  }, [options, query]);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Reset query when closing
  React.useEffect(() => {
    if (open) {
      const idx = filtered.findIndex((o) => o.value === value);
      setActiveIndex(idx >= 0 ? idx : 0);
    } else {
      setQuery("");
      setIsEditingQuery(false);
    }
  }, [open, filtered, value]);

  React.useEffect(() => {
    if (activeIndex >= filtered.length) setActiveIndex(0);
  }, [filtered.length, activeIndex]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const updateViewportMode = () => setIsSmallScreen(mediaQuery.matches);

    updateViewportMode();
    mediaQuery.addEventListener("change", updateViewportMode);

    return () => mediaQuery.removeEventListener("change", updateViewportMode);
  }, []);

  const updateMenuPosition = React.useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setMenuStyle({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  React.useEffect(() => {
    if (!open) return;
    if (isSmallScreen) return;
    updateMenuPosition();
    const onScrollOrResize = () => updateMenuPosition();
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [open, updateMenuPosition, isSmallScreen]);

  React.useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const selectDisplayedValue = React.useCallback(() => {
    if (!selected?.label || query || isEditingQuery) return;

    requestAnimationFrame(() => {
      const input = inputRef.current;
      if (input && document.activeElement === input) {
        input.select();
      }
    });
  }, [selected?.label, query, isEditingQuery]);

  const select = (opt: ComboboxOption) => {
    onChange?.(opt.value);
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleArrowKey = (key: "ArrowDown" | "ArrowUp") => {
    if (!open) {
      setOpen(true);
      selectDisplayedValue();
      return;
    }
    setActiveIndex((i) => {
      if (!filtered.length) return 0;
      if (key === "ArrowDown") return (i + 1) % filtered.length;
      return (i - 1 + filtered.length) % filtered.length;
    });
  };

  const handleOpenListKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(Math.max(0, filtered.length - 1));
      return;
    }
    if (e.key === "Enter" && filtered[activeIndex]) {
      e.preventDefault();
      select(filtered[activeIndex]);
    }
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    switch (e.key) {
      case "Tab":
        setOpen(false);
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
      case "ArrowDown":
      case "ArrowUp":
        e.preventDefault();
        handleArrowKey(e.key);
        break;
      case "Home":
      case "End":
      case "Enter":
        handleOpenListKey(e);
        break;
      default:
        break;
    }
  };

  const displayValue = open
    ? isEditingQuery
      ? query
      : (selected?.label ?? query)
    : (selected?.label ?? "");

  const menuContent = (
    <AnimatePresence>
      {open && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            componentThemeClassName,
            controlCornerClassName,
            "z-[9999] overflow-hidden border border-neutral-200 bg-white text-neutral-900 shadow-lg dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          )}
          exit={{ opacity: 0, y: -4 }}
          initial={{ opacity: 0, y: -6 }}
          key="popover"
          ref={menuRef}
          role="presentation"
          style={
            isSmallScreen
              ? undefined
              : {
                  position: "fixed",
                  ...menuStyle,
                  transformOrigin: "top center",
                }
          }
          transition={{
            duration: 0.16,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <ScrollAreaPrimitive.Root className="relative max-h-64 overflow-hidden">
            <ScrollAreaPrimitive.Viewport
              className="max-h-64 min-h-0 overscroll-contain p-1 outline-none"
              id={listboxId}
              ref={listRef}
              role="listbox"
            >
              {filtered.length === 0 ? (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="px-3 py-6 text-center text-muted-foreground text-sm"
                  initial={{ opacity: 0 }}
                >
                  {emptyMessage}
                </motion.div>
              ) : (
                filtered.map((opt, index) => {
                  const isSelected = opt.value === value;
                  const isActive = index === activeIndex;
                  return (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      aria-selected={isSelected}
                      className={cn(
                        "relative flex cursor-pointer select-none items-start gap-2 px-2.5 py-2 text-sm transition-colors",
                        controlCornerClassName,
                        isActive ? "text-accent-foreground" : "text-foreground"
                      )}
                      data-index={index}
                      id={`${listboxId}-opt-${opt.value}`}
                      initial={{ opacity: 0, y: 2 }}
                      key={opt.value}
                      onClick={() => select(opt)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                      role="option"
                      transition={{
                        duration: 0.12,
                        ease: "easeOut",
                      }}
                    >
                      {isActive && (
                        <motion.div
                          className={cn(
                            "absolute inset-0 -z-10 bg-accent",
                            controlCornerInheritClassName
                          )}
                          layoutId="combobox-active"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 35,
                          }}
                        />
                      )}
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                        <AnimatePresence initial={false}>
                          {isSelected && (
                            <motion.span
                              animate={{ scale: 1, rotate: 0, opacity: 1 }}
                              className="text-primary"
                              exit={{ scale: 0.95, rotate: 90, opacity: 0 }}
                              initial={{ scale: 0.95, rotate: -90, opacity: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 22,
                              }}
                            >
                              <Check className="h-4 w-4" strokeWidth={3} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      <span className="flex flex-col">
                        <span className="font-medium leading-tight">
                          {opt.label}
                        </span>
                        {opt.description && (
                          <span className="text-muted-foreground text-xs">
                            {opt.description}
                          </span>
                        )}
                      </span>
                    </motion.div>
                  );
                })
              )}
            </ScrollAreaPrimitive.Viewport>
            <ScrollAreaPrimitive.Scrollbar
              className={comboboxListScrollbarClassName}
              orientation="vertical"
            >
              <ScrollAreaPrimitive.Thumb
                className={comboboxListThumbClassName}
              />
            </ScrollAreaPrimitive.Scrollbar>
          </ScrollAreaPrimitive.Root>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div
      className={cn(componentThemeClassName, "relative w-full", className)}
      ref={containerRef}
    >
      <div
        className={cn(
          "group flex h-11 w-full items-center gap-2 border border-input bg-background px-3.5 text-base shadow-sm transition-[border-color,box-shadow] sm:text-sm",
          controlCornerClassName,
          "hover:border-ring/40 hover:shadow",
          "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
          disabled && "cursor-not-allowed opacity-50",
          open && "border-ring ring-2 ring-ring/30"
        )}
        onClick={() => {
          if (!disabled) {
            setOpen(true);
            inputRef.current?.focus();
            selectDisplayedValue();
          }
        }}
        onKeyDown={(e) => {
          if (disabled || e.target !== e.currentTarget) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
            inputRef.current?.focus();
            selectDisplayedValue();
          }
        }}
      >
        <input
          aria-activedescendant={
            open && filtered[activeIndex]
              ? `${listboxId}-opt-${filtered[activeIndex].value}`
              : undefined
          }
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={open}
          className="h-full w-full flex-1 bg-transparent text-[16px] text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed sm:text-sm"
          disabled={disabled}
          onChange={(e) => {
            if (!open) setOpen(true);
            setIsEditingQuery(true);
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onFocus={() => {
            selectDisplayedValue();
            if (openOnFocus) setOpen(true);
          }}
          onKeyDown={onInputKeyDown}
          placeholder={placeholder}
          ref={inputRef}
          role="combobox"
          type="text"
          value={displayValue}
        />

        {clearable && selected && !disabled && (
          <button
            aria-label="Clear selection"
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center text-muted-foreground opacity-70 transition-colors hover:bg-accent/60 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
              controlCornerClassName
            )}
            onClick={(e) => {
              e.stopPropagation();
              onChange?.("");
              setQuery("");
              setIsEditingQuery(open);
              inputRef.current?.focus();
            }}
            type="button"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          className="text-muted-foreground"
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <ChevronsUpDown className="h-4 w-4" />
        </motion.span>
      </div>

      {isSmallScreen ? (
        <div className="absolute inset-x-0 top-full z-[9999] mt-1">
          {menuContent}
        </div>
      ) : mounted ? (
        createPortal(menuContent, document.body)
      ) : null}
    </div>
  );
}

export { Combobox as combobox };
