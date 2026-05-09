"use client";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

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
}: ComboboxProps) {
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
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
  const listboxId = React.useId();

  const selected = options.find((o) => o.value === value);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q) ||
        o.description?.toLowerCase().includes(q)
    );
  }, [options, query]);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Reset query when closing
  React.useEffect(() => {
    if (open) {
      const idx = filtered.findIndex((o) => o.value === value);
      setActiveIndex(idx >= 0 ? idx : 0);
    } else setQuery("");
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

  const select = (opt: ComboboxOption) => {
    onChange?.(opt.value);
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleArrowKey = (key: "ArrowDown" | "ArrowUp") => {
    if (!open) {
      setOpen(true);
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

  // What's shown in the input: live query while open, otherwise selected label
  const displayValue = open ? query : (selected?.label ?? "");

  const menuContent = (
    <AnimatePresence>
      {open && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="z-[9999] overflow-hidden rounded-lg border border-neutral-200 bg-white text-neutral-900 shadow-lg dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          exit={{ opacity: 0, y: -4 }}
          initial={{ opacity: 0, y: -6 }}
          key="popover"
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
          <div
            className="max-h-64 overflow-y-auto p-1"
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
                      "relative flex cursor-pointer select-none items-start gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground"
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
                        className="absolute inset-0 -z-10 rounded-lg bg-accent"
                        layoutId="combobox-active"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    )}
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                      <AnimatePresence>
                        {isSelected && (
                          <motion.span
                            animate={{ scale: 1, rotate: 0 }}
                            className="text-primary"
                            exit={{ scale: 0, rotate: 90 }}
                            initial={{ scale: 0, rotate: -90 }}
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <div
        className={cn(
          "group flex h-11 w-full items-center gap-2 rounded-lg border border-input bg-background px-3.5 text-base shadow-sm transition-all sm:text-sm",
          "hover:border-ring/40 hover:shadow",
          "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
          disabled && "cursor-not-allowed opacity-50",
          open && "border-ring ring-2 ring-ring/30"
        )}
        onClick={() => {
          if (!disabled) {
            setOpen(true);
            inputRef.current?.focus();
          }
        }}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
            inputRef.current?.focus();
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
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
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
            className="rounded-lg p-0.5 text-muted-foreground opacity-70 hover:bg-muted hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onChange?.("");
              setQuery("");
              inputRef.current?.focus();
            }}
            tabIndex={-1}
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
