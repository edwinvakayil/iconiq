"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--background:#ffffff] [--foreground:#111111] [--primary:#111111] [--secondary:#646b75] [--surface-border:#e9edf2] [--border:#e3e7ec] [--card:#ffffff] [--card-foreground:#111111] [--muted:#f5f7fa] [--muted-foreground:#6d7480] [--accent:#f3f5f8] [--accent-foreground:#111111] [--input:#e3e7ec] [--ring:rgba(17,17,17,0.16)] [--destructive:#dc2626] [--paper:#fcfcfd] [--popover-foreground:#111111] [--brand:#0ea5e9] [--brand-soft:#bae6fd] [--shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--chart-1:oklch(0.52_0.19_254)] [--chart-2:oklch(0.74_0.11_232)] [--chart-3:oklch(0.42_0.16_262)] [--chart-4:oklch(0.84_0.07_228)] [--chart-5:oklch(0.62_0.14_240)] [--color-background:var(--background)] [--color-foreground:var(--foreground)] [--color-primary:var(--primary)] [--color-secondary:var(--secondary)] [--color-border:var(--border)] [--color-card:var(--card)] [--color-card-foreground:var(--card-foreground)] [--color-muted:var(--muted)] [--color-muted-foreground:var(--muted-foreground)] [--color-accent:var(--accent)] [--color-accent-foreground:var(--accent-foreground)] [--color-input:var(--input)] [--color-ring:var(--ring)] [--color-destructive:var(--destructive)] [--color-paper:var(--paper)] [--color-popover-foreground:var(--popover-foreground)] [--color-brand:var(--brand)] [--color-brand-soft:var(--brand-soft)] [--color-chart-1:var(--chart-1)] [--color-chart-2:var(--chart-2)] [--color-chart-3:var(--chart-3)] [--color-chart-4:var(--chart-4)] [--color-chart-5:var(--chart-5)] dark:[--background:#111111] dark:[--foreground:#f6f3ec] dark:[--primary:#f6f3ec] dark:[--secondary:#cbc6bb] dark:[--surface-border:#2a2a25] dark:[--border:#2b2a25] dark:[--card:#111111] dark:[--card-foreground:#f6f3ec] dark:[--muted:#171716] dark:[--muted-foreground:#9a958a] dark:[--accent:#1a1a18] dark:[--accent-foreground:#f6f3ec] dark:[--input:#2b2a25] dark:[--ring:rgba(246,243,236,0.18)] dark:[--destructive:#f87171] dark:[--paper:#171716] dark:[--popover-foreground:#f6f3ec] dark:[--brand:#38bdf8] dark:[--brand-soft:#0c4a6e] dark:[--shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--chart-1:oklch(0.68_0.17_250)] dark:[--chart-2:oklch(0.82_0.09_225)] dark:[--chart-3:oklch(0.58_0.15_260)] dark:[--chart-4:oklch(0.75_0.12_235)] dark:[--chart-5:oklch(0.88_0.06_220)]";

export type ComboboxOption = {
  value: string;
  label: string;
  description?: string;
};

export interface ComboboxProps extends ReducedMotionProp {
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

type DivRenderProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
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

function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

function resolvePopupProps(popupProps: DivRenderProps) {
  const {
    children: _popupChildren,
    className: popupClassName,
    onAnimationEnd: _onAnimationEnd,
    onAnimationIteration: _onAnimationIteration,
    onAnimationStart: _onAnimationStart,
    onDrag: _onDrag,
    onDragEnd: _onDragEnd,
    onDragEnter: _onDragEnter,
    onDragExit: _onDragExit,
    onDragLeave: _onDragLeave,
    onDragOver: _onDragOver,
    onDragStart: _onDragStart,
    onDrop: _onDrop,
    ref: popupRef,
    style: popupStyle,
    ...resolvedPopupProps
  } = popupProps;

  return {
    popupClassName,
    popupRef,
    popupStyle,
    resolvedPopupProps,
  };
}

function resolveItemProps(itemProps: DivRenderProps) {
  const {
    children: _itemChildren,
    className: itemClassName,
    onAnimationEnd: _onAnimationEnd,
    onAnimationIteration: _onAnimationIteration,
    onAnimationStart: _onAnimationStart,
    onDrag: _onDrag,
    onDragEnd: _onDragEnd,
    onDragEnter: _onDragEnter,
    onDragExit: _onDragExit,
    onDragLeave: _onDragLeave,
    onDragOver: _onDragOver,
    onDragStart: _onDragStart,
    onDrop: _onDrop,
    ref: itemRef,
    style: itemStyle,
    ...resolvedItemProps
  } = itemProps;

  return {
    itemClassName,
    itemRef,
    itemStyle,
    resolvedItemProps,
  };
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
  reducedMotion,
}: ComboboxProps) {
  const reduceMotion = useResolvedReducedMotion(reducedMotion);
  const actionsRef = React.useRef<ComboboxPrimitive.Root.Actions | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [isEditingQuery, setIsEditingQuery] = React.useState(false);
  const [hoveredValue, setHoveredValue] = React.useState<string | undefined>();

  const selected = React.useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  const filtered = React.useMemo(() => {
    const search = getSearchParts(query);
    if (!search.normalized) return options;

    return options.filter(
      (option) =>
        matchesSearch(option.label, search) ||
        matchesSearch(option.value, search) ||
        matchesSearch(option.description, search)
    );
  }, [options, query]);

  React.useEffect(() => {
    if (open) {
      setHoveredValue(undefined);
      return;
    }

    setQuery("");
    setIsEditingQuery(false);
    setHoveredValue(undefined);
  }, [open]);

  const selectDisplayedValue = React.useCallback(() => {
    if (!selected?.label || query || isEditingQuery) return;

    requestAnimationFrame(() => {
      const input = inputRef.current;
      if (input && document.activeElement === input) {
        input.select();
      }
    });
  }, [isEditingQuery, query, selected?.label]);

  const handleOpenChange = React.useCallback(
    (
      nextOpen: boolean,
      eventDetails: ComboboxPrimitive.Root.ChangeEventDetails
    ) => {
      if (!nextOpen && reduceMotion) {
        requestAnimationFrame(() => {
          actionsRef.current?.unmount();
        });
      }

      if (!eventDetails.isCanceled) {
        setOpen(nextOpen);
      }
    },
    [reduceMotion]
  );

  const handleInputValueChange = React.useCallback(
    (
      nextInputValue: string,
      eventDetails: ComboboxPrimitive.Root.ChangeEventDetails
    ) => {
      if (
        eventDetails.reason === "input-change" ||
        eventDetails.reason === "input-clear"
      ) {
        if (!open) {
          setOpen(true);
        }

        setIsEditingQuery(true);
        setQuery(nextInputValue);
        return;
      }

      if (eventDetails.reason === "clear-press") {
        setQuery("");
        setIsEditingQuery(open);
      }
    },
    [open]
  );

  const displayValue = open
    ? isEditingQuery
      ? query
      : (selected?.label ?? query)
    : (selected?.label ?? "");

  return (
    <ReducedMotionConfig reducedMotion={reducedMotion}>
      <div
        className={cn(componentThemeClassName, "relative w-full", className)}
      >
        <ComboboxPrimitive.Root
          actionsRef={actionsRef}
          autoComplete="none"
          disabled={disabled}
          filter={null}
          filteredItems={filtered}
          highlightItemOnHover
          inputValue={displayValue}
          isItemEqualToValue={(item, nextValue) =>
            item.value === nextValue.value
          }
          items={options}
          itemToStringLabel={(item) => item.label}
          itemToStringValue={(item) => item.value}
          modal={false}
          onInputValueChange={handleInputValueChange}
          onOpenChange={handleOpenChange}
          onValueChange={(nextOption) => {
            onChange?.(nextOption?.value ?? "");
            setOpen(false);
            inputRef.current?.blur();
          }}
          open={open}
          openOnInputClick={false}
          value={selected ?? null}
        >
          <ComboboxPrimitive.InputGroup
            className={cn(
              "group flex h-11 w-full items-center gap-2 rounded-lg border border-input bg-background px-3.5 text-base shadow-sm transition-all sm:text-sm",
              "hover:border-ring/40 hover:shadow",
              "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
              disabled && "cursor-not-allowed opacity-50",
              open && "border-ring ring-2 ring-ring/30"
            )}
            onClick={() => {
              if (disabled) return;

              setOpen(true);
              inputRef.current?.focus();
              selectDisplayedValue();
            }}
          >
            <ComboboxPrimitive.Input
              className="h-full w-full flex-1 bg-transparent text-[16px] text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed sm:text-sm"
              disabled={disabled}
              onFocus={() => {
                selectDisplayedValue();
                if (openOnFocus) {
                  setOpen(true);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Tab") {
                  setOpen(false);
                }
              }}
              placeholder={placeholder}
              ref={inputRef}
            />

            {clearable && selected && !disabled ? (
              <ComboboxPrimitive.Clear
                aria-label="Clear selection"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground opacity-70 transition hover:bg-muted hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                keepMounted={false}
                onClick={() => {
                  setQuery("");
                  setIsEditingQuery(open);
                  requestAnimationFrame(() => {
                    inputRef.current?.focus();
                  });
                }}
              >
                <X className="h-3.5 w-3.5" />
              </ComboboxPrimitive.Clear>
            ) : null}

            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              className="text-muted-foreground"
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <ChevronsUpDown className="h-4 w-4" />
            </motion.span>
          </ComboboxPrimitive.InputGroup>

          <ComboboxPrimitive.Portal keepMounted>
            <ComboboxPrimitive.Positioner
              align="start"
              className="z-[9999] outline-none"
              sideOffset={4}
            >
              <ComboboxPrimitive.Popup
                initialFocus={false}
                render={(popupProps, popupState) => {
                  const {
                    popupClassName,
                    popupRef,
                    popupStyle,
                    resolvedPopupProps,
                  } = resolvePopupProps(popupProps);

                  return (
                    <motion.div
                      {...resolvedPopupProps}
                      animate={
                        popupState.open
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: -4 }
                      }
                      className={cn(
                        componentThemeClassName,
                        "w-[var(--anchor-width)] max-w-[var(--available-width)] overflow-hidden rounded-lg border border-neutral-200 bg-white text-neutral-900 shadow-lg dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100",
                        popupClassName
                      )}
                      initial={
                        popupState.transitionStatus === "starting"
                          ? { opacity: 0, y: -6 }
                          : false
                      }
                      onAnimationComplete={() => {
                        if (!popupState.open) {
                          actionsRef.current?.unmount();
                        }
                      }}
                      ref={(node) => {
                        setRef(popupRef, node);
                      }}
                      role="presentation"
                      style={popupStyle}
                      transition={{
                        duration: 0.16,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <ComboboxPrimitive.List
                        className="max-h-64 overflow-y-auto p-1"
                        onPointerLeave={() => {
                          setHoveredValue(undefined);
                        }}
                      >
                        <ComboboxPrimitive.Empty className="text-center text-muted-foreground text-sm">
                          <motion.span
                            animate={{ opacity: 1 }}
                            className="block px-3 py-6"
                            initial={{ opacity: 0 }}
                          >
                            {emptyMessage}
                          </motion.span>
                        </ComboboxPrimitive.Empty>

                        {filtered.map((option, index) => {
                          return (
                            <ComboboxPrimitive.Item
                              index={index}
                              key={option.value}
                              render={(itemProps, itemState) => {
                                const {
                                  itemClassName,
                                  itemRef,
                                  itemStyle,
                                  resolvedItemProps,
                                } = resolveItemProps(itemProps);
                                const isHovered = hoveredValue === option.value;

                                return (
                                  <motion.div
                                    {...resolvedItemProps}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                      "relative flex cursor-pointer select-none items-start gap-2 rounded-lg px-2.5 py-2 text-foreground text-sm transition-colors",
                                      itemClassName
                                    )}
                                    initial={{ opacity: 0, y: 2 }}
                                    onMouseEnter={() => {
                                      setHoveredValue(option.value);
                                    }}
                                    onPointerMove={() => {
                                      setHoveredValue(option.value);
                                    }}
                                    ref={(node) => {
                                      setRef(itemRef, node);
                                    }}
                                    style={itemStyle}
                                    transition={{
                                      duration: 0.12,
                                      ease: "easeOut",
                                    }}
                                  >
                                    {isHovered ? (
                                      <motion.div
                                        className="absolute inset-0 rounded-lg bg-accent"
                                        layoutId="combobox-active"
                                        transition={{
                                          type: "spring",
                                          stiffness: 600,
                                          damping: 38,
                                        }}
                                      />
                                    ) : null}

                                    <span className="relative z-10 mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                                      <AnimatePresence>
                                        {itemState.selected ? (
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
                                            <Check
                                              className="h-4 w-4"
                                              strokeWidth={3}
                                            />
                                          </motion.span>
                                        ) : null}
                                      </AnimatePresence>
                                    </span>

                                    <span className="relative z-10 flex flex-col">
                                      <span className="font-medium leading-tight">
                                        {option.label}
                                      </span>
                                      {option.description ? (
                                        <span className="text-muted-foreground text-xs">
                                          {option.description}
                                        </span>
                                      ) : null}
                                    </span>
                                  </motion.div>
                                );
                              }}
                              value={option}
                            />
                          );
                        })}
                      </ComboboxPrimitive.List>
                    </motion.div>
                  );
                }}
              />
            </ComboboxPrimitive.Positioner>
          </ComboboxPrimitive.Portal>
        </ComboboxPrimitive.Root>
      </div>
    </ReducedMotionConfig>
  );
}

export { Combobox as combobox };
