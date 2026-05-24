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
import { registryTheme } from "@/lib/registry-theme";
import { cn } from "@/lib/utils";

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
      <div className={cn(registryTheme, "relative w-full", className)}>
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
                        registryTheme,
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
