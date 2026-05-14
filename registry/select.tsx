"use client";

import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type CSSProperties,
  type Dispatch,
  type KeyboardEvent,
  type MutableRefObject,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

const MAX_MENU_HEIGHT = 320;
const MENU_OFFSET = 8;
const TYPEAHEAD_RESET_MS = 500;
const VIEWPORT_MARGIN = 12;
const SOFT_EASE = [0.22, 1, 0.36, 1] as const;
const EXIT_EASE = [0.55, 0.06, 0.68, 0.19] as const;
const ACTIVE_SPRING = {
  type: "spring",
  stiffness: 460,
  damping: 34,
  mass: 0.58,
} as const;
const CHECK_SPRING = {
  type: "spring",
  stiffness: 520,
  damping: 28,
  mass: 0.55,
} as const;
const PRESS_SPRING = {
  type: "spring",
  stiffness: 560,
  damping: 32,
  mass: 0.48,
} as const;

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
  group?: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

type SelectSection = {
  items: Array<{
    index: number;
    option: SelectOption;
  }>;
  key: string;
  label?: string;
};

type MenuPosition = {
  left: number;
  maxHeight: number;
  top: number;
  transformOrigin: string;
  width: number;
};

type SelectOptionRowProps = {
  activeHighlightId: string;
  index: number;
  isActive: boolean;
  isSelected: boolean;
  itemVariants: ReturnType<typeof getItemVariants>;
  listboxId: string;
  onSelect: (index: number) => void;
  option: SelectOption;
  reduceMotion: boolean;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  setOptionRef: (index: number, node: HTMLDivElement | null) => void;
};

type SelectMenuSectionProps = {
  activeHighlightId: string;
  activeIndex: number;
  itemVariants: ReturnType<typeof getItemVariants>;
  listboxId: string;
  optionRefs: MutableRefObject<Array<HTMLDivElement | null>>;
  reduceMotion: boolean;
  section: SelectSection;
  sectionIndex: number;
  selectOption: (index: number, restoreFocus?: boolean) => void;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  value?: string;
};

type SelectMenuContentProps = {
  activeIndex: number;
  closeMenu: (restoreFocus?: boolean) => void;
  itemVariants: ReturnType<typeof getItemVariants>;
  listboxId: string;
  listboxRef: MutableRefObject<HTMLDivElement | null>;
  menuPanelRef: MutableRefObject<HTMLDivElement | null>;
  menuPosition: MenuPosition | null;
  options: SelectOption[];
  optionRefs: MutableRefObject<Array<HTMLDivElement | null>>;
  panelTransition: {
    duration: number;
    ease: "easeOut" | typeof SOFT_EASE;
  };
  reduceMotion: boolean;
  runTypeahead: (key: string) => void;
  sections: SelectSection[];
  selectOption: (index: number, restoreFocus?: boolean) => void;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  triggerId: string;
  value?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function isPrintableKey(
  event: Pick<
    KeyboardEvent<HTMLElement>,
    "altKey" | "ctrlKey" | "metaKey" | "key"
  >
) {
  return (
    !(event.altKey || event.ctrlKey || event.metaKey) && event.key.length === 1
  );
}

function getSelectSections(options: SelectOption[]) {
  const nextSections: SelectSection[] = [];

  options.forEach((option, index) => {
    const groupLabel = option.group?.trim();
    const previousSection = nextSections.at(-1);

    if (groupLabel) {
      if (previousSection?.label === groupLabel) {
        previousSection.items.push({ index, option });
        return;
      }

      nextSections.push({
        items: [{ index, option }],
        key: `${groupLabel}-${nextSections.length}`,
        label: groupLabel,
      });
      return;
    }

    nextSections.push({
      items: [{ index, option }],
      key: `ungrouped-${index}`,
    });
  });

  return nextSections;
}

function normalizeTypeaheadValue(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function findTypeaheadMatch(
  options: SelectOption[],
  query: string,
  startIndex: number
) {
  const normalizedQuery = normalizeTypeaheadValue(query);

  if (!normalizedQuery) {
    return -1;
  }

  for (let offset = 1; offset <= options.length; offset += 1) {
    const index = (startIndex + offset) % options.length;
    const candidate = normalizeTypeaheadValue(options[index]?.label ?? "");

    if (candidate.startsWith(normalizedQuery)) {
      return index;
    }
  }

  return -1;
}

function getNextIndex(
  currentIndex: number,
  optionCount: number,
  direction: 1 | -1
) {
  if (optionCount === 0) {
    return 0;
  }

  return (currentIndex + direction + optionCount) % optionCount;
}

function scrollOptionIntoView(
  container: HTMLDivElement | null,
  option: HTMLDivElement | null
) {
  if (!(container && option)) {
    return;
  }

  const containerRect = container.getBoundingClientRect();
  const optionRect = option.getBoundingClientRect();

  if (optionRect.top < containerRect.top) {
    container.scrollTop -= containerRect.top - optionRect.top;
    return;
  }

  if (optionRect.bottom > containerRect.bottom) {
    container.scrollTop += optionRect.bottom - containerRect.bottom;
  }
}

function getItemVariants(reduceMotion: boolean) {
  return {
    exit: (index: number) => ({
      opacity: 0,
      y: reduceMotion ? 0 : -2,
      transition: {
        delay: reduceMotion ? 0 : Math.min(index, 4) * 0.01,
        duration: reduceMotion ? 0.1 : 0.12,
        ease: reduceMotion ? ("easeOut" as const) : EXIT_EASE,
      },
    }),
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : -4,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: reduceMotion ? 0 : Math.min(index, 4) * 0.02,
        duration: reduceMotion ? 0.12 : 0.18,
        ease: reduceMotion ? ("easeOut" as const) : SOFT_EASE,
      },
    }),
  };
}

function getMenuPosition({
  optionCount,
  panel,
  triggerRect,
  viewportHeight,
  viewportWidth,
}: {
  optionCount: number;
  panel: HTMLDivElement | null;
  triggerRect: DOMRect;
  viewportHeight: number;
  viewportWidth: number;
}) {
  const width = triggerRect.width;
  const availableBelow = Math.max(
    viewportHeight - triggerRect.bottom - MENU_OFFSET - VIEWPORT_MARGIN,
    0
  );
  const availableAbove = Math.max(
    triggerRect.top - MENU_OFFSET - VIEWPORT_MARGIN,
    0
  );
  const measuredHeight = Math.max(
    panel?.scrollHeight ?? 0,
    panel?.getBoundingClientRect().height ?? 0,
    Math.min(optionCount * 52, MAX_MENU_HEIGHT)
  );
  const preferredHeight = Math.min(
    measuredHeight || MAX_MENU_HEIGHT,
    MAX_MENU_HEIGHT
  );
  const shouldPlaceAbove =
    availableBelow < preferredHeight && availableAbove > availableBelow;
  const maxHeight = Math.max(
    Math.min(
      MAX_MENU_HEIGHT,
      shouldPlaceAbove ? availableAbove : availableBelow
    ),
    0
  );
  const left = clamp(
    triggerRect.left,
    VIEWPORT_MARGIN,
    Math.max(VIEWPORT_MARGIN, viewportWidth - width - VIEWPORT_MARGIN)
  );
  const resolvedHeight = Math.min(
    preferredHeight,
    maxHeight || preferredHeight
  );
  const top = shouldPlaceAbove
    ? Math.max(VIEWPORT_MARGIN, triggerRect.top - MENU_OFFSET - resolvedHeight)
    : triggerRect.bottom + MENU_OFFSET;
  const horizontalOrigin =
    left <= VIEWPORT_MARGIN + 0.5
      ? "left"
      : left >= viewportWidth - width - VIEWPORT_MARGIN - 0.5
        ? "right"
        : "left";

  return {
    left,
    maxHeight,
    top,
    transformOrigin: `${horizontalOrigin} ${
      shouldPlaceAbove ? "bottom" : "top"
    }`,
    width,
  };
}

function handleSelectTriggerKeyDown({
  closeMenu,
  event,
  open,
  openMenu,
  optionsLength,
  pendingTypeaheadRef,
  selectedIndex,
}: {
  closeMenu: (restoreFocus?: boolean) => void;
  event: KeyboardEvent<HTMLButtonElement>;
  open: boolean;
  openMenu: (nextActiveIndex?: number) => void;
  optionsLength: number;
  pendingTypeaheadRef: MutableRefObject<string | null>;
  selectedIndex: number;
}) {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      openMenu(selectedIndex >= 0 ? selectedIndex : 0);
      return;
    case "ArrowUp":
      event.preventDefault();
      openMenu(selectedIndex >= 0 ? selectedIndex : optionsLength - 1);
      return;
    case "Home":
      event.preventDefault();
      openMenu(0);
      return;
    case "End":
      event.preventDefault();
      openMenu(optionsLength - 1);
      return;
    case "Enter":
    case " ":
      event.preventDefault();

      if (open) {
        closeMenu(false);
        return;
      }

      openMenu(selectedIndex >= 0 ? selectedIndex : 0);
      return;
    default:
      if (!isPrintableKey(event)) {
        return;
      }

      event.preventDefault();
      pendingTypeaheadRef.current = event.key;
      openMenu(selectedIndex >= 0 ? selectedIndex : 0);
  }
}

function handleSelectListboxKeyDown({
  activeIndex,
  closeMenu,
  event,
  optionCount,
  runTypeahead,
  selectOption,
  setActiveIndex,
}: {
  activeIndex: number;
  closeMenu: (restoreFocus?: boolean) => void;
  event: KeyboardEvent<HTMLDivElement>;
  optionCount: number;
  runTypeahead: (key: string) => void;
  selectOption: (index: number, restoreFocus?: boolean) => void;
  setActiveIndex: Dispatch<SetStateAction<number>>;
}) {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      setActiveIndex((current) => getNextIndex(current, optionCount, 1));
      return;
    case "ArrowUp":
      event.preventDefault();
      setActiveIndex((current) => getNextIndex(current, optionCount, -1));
      return;
    case "Home":
      event.preventDefault();
      setActiveIndex(0);
      return;
    case "End":
      event.preventDefault();
      setActiveIndex(Math.max(optionCount - 1, 0));
      return;
    case "Enter":
    case " ":
      event.preventDefault();
      selectOption(activeIndex);
      return;
    case "Escape":
      event.preventDefault();
      closeMenu(true);
      return;
    case "Tab":
      closeMenu(false);
      return;
    default:
      if (!isPrintableKey(event)) {
        return;
      }

      event.preventDefault();
      runTypeahead(event.key);
  }
}

function SelectOptionRow({
  activeHighlightId,
  index,
  isActive,
  isSelected,
  itemVariants,
  listboxId,
  onSelect,
  option,
  reduceMotion,
  setActiveIndex,
  setOptionRef,
}: SelectOptionRowProps) {
  const pressTransition = reduceMotion
    ? { duration: 0.12, ease: "easeOut" as const }
    : PRESS_SPRING;
  const activeTransition = reduceMotion
    ? { duration: 0.12, ease: "easeOut" as const }
    : ACTIVE_SPRING;
  const checkTransition = reduceMotion
    ? { duration: 0.12, ease: "easeOut" as const }
    : CHECK_SPRING;

  return (
    <motion.div
      animate="visible"
      aria-selected={isSelected}
      className={cn(
        "group relative isolate flex min-h-11 cursor-pointer touch-manipulation select-none items-center gap-3 rounded-lg px-3 py-2.5 text-foreground text-sm outline-none transition-colors",
        !isActive && "hover:bg-accent/60"
      )}
      custom={index}
      exit="exit"
      id={`${listboxId}-option-${index}`}
      initial="hidden"
      onClick={() => onSelect(index)}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      onMouseEnter={() => setActiveIndex(index)}
      ref={(node) => {
        setOptionRef(index, node);
      }}
      role="option"
      title={option.label}
      transition={pressTransition}
      variants={itemVariants}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
    >
      {isActive ? (
        <motion.span
          className="absolute inset-0 -z-10 rounded-lg bg-accent/70"
          layoutId={activeHighlightId}
          transition={activeTransition}
        />
      ) : null}
      {option.icon ? (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground">
          {option.icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1 truncate text-left">{option.label}</span>
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
        <AnimatePresence>
          {isSelected ? (
            <motion.span
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="text-primary"
              exit={{ opacity: 0, scale: 0.8, y: 1 }}
              initial={{ opacity: 0, scale: 0.8, y: 1 }}
              transition={checkTransition}
            >
              <Check className="h-4 w-4" />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </span>
    </motion.div>
  );
}

function SelectMenuSection({
  activeHighlightId,
  activeIndex,
  itemVariants,
  listboxId,
  optionRefs,
  reduceMotion,
  section,
  sectionIndex,
  selectOption,
  setActiveIndex,
  value,
}: SelectMenuSectionProps) {
  const groupLabelId = `${listboxId}-group-${sectionIndex}`;
  const sectionItems = section.items.map(({ index, option }) => (
    <SelectOptionRow
      activeHighlightId={activeHighlightId}
      index={index}
      isActive={index === activeIndex}
      isSelected={option.value === value}
      itemVariants={itemVariants}
      key={option.value}
      listboxId={listboxId}
      onSelect={selectOption}
      option={option}
      reduceMotion={reduceMotion}
      setActiveIndex={setActiveIndex}
      setOptionRef={(nextIndex, node) => {
        optionRefs.current[nextIndex] = node;
      }}
    />
  ));

  if (!section.label) {
    return <div className="space-y-1">{sectionItems}</div>;
  }

  return (
    <div className="pt-2 first:pt-0">
      <div
        className="px-3 pb-1.5 font-medium text-[10px] text-muted-foreground uppercase tracking-[0.16em]"
        id={groupLabelId}
      >
        {section.label}
      </div>
      <div className="space-y-1">{sectionItems}</div>
    </div>
  );
}

function SelectMenuContent({
  activeIndex,
  closeMenu,
  itemVariants,
  listboxId,
  listboxRef,
  menuPanelRef,
  menuPosition,
  options,
  optionRefs,
  panelTransition,
  reduceMotion,
  runTypeahead,
  sections,
  selectOption,
  setActiveIndex,
  triggerId,
  value,
}: SelectMenuContentProps) {
  const panelStyle: CSSProperties | undefined = menuPosition
    ? {
        left: menuPosition.left,
        position: "fixed",
        top: menuPosition.top,
        transformOrigin: menuPosition.transformOrigin,
        width: menuPosition.width,
      }
    : undefined;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="z-[300] overflow-hidden rounded-lg border border-border bg-card shadow-lg"
      exit={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
      initial={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
      key="select-dropdown"
      ref={menuPanelRef}
      style={panelStyle}
      transition={panelTransition}
    >
      <div
        aria-activedescendant={
          options[activeIndex]
            ? `${listboxId}-option-${activeIndex}`
            : undefined
        }
        aria-labelledby={triggerId}
        aria-orientation="vertical"
        className="overflow-y-auto overscroll-contain p-1.5 outline-none"
        id={listboxId}
        onKeyDown={(event) => {
          handleSelectListboxKeyDown({
            activeIndex,
            closeMenu,
            event,
            optionCount: options.length,
            runTypeahead,
            selectOption,
            setActiveIndex,
          });
        }}
        ref={listboxRef}
        role="listbox"
        style={{
          maxHeight: menuPosition?.maxHeight ?? MAX_MENU_HEIGHT,
        }}
        tabIndex={-1}
      >
        {options.length === 0 ? (
          <div className="px-3 py-3 text-muted-foreground text-sm">
            No options available.
          </div>
        ) : (
          sections.map((section, sectionIndex) => (
            <SelectMenuSection
              activeHighlightId={`${listboxId}-active-option`}
              activeIndex={activeIndex}
              itemVariants={itemVariants}
              key={section.key}
              listboxId={listboxId}
              optionRefs={optionRefs}
              reduceMotion={reduceMotion}
              section={section}
              sectionIndex={sectionIndex}
              selectOption={selectOption}
              setActiveIndex={setActiveIndex}
              value={value}
            />
          ))
        )}
      </div>
    </motion.div>
  );
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option…",
  className,
}: SelectProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const generatedId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const openInteractionRef = useRef<"keyboard" | "pointer">("pointer");
  const optionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pendingTypeaheadRef = useRef<string | null>(null);
  const typeaheadRef = useRef("");
  const typeaheadTimeoutRef = useRef<number | null>(null);
  const listboxId = `${generatedId}-listbox`;
  const triggerId = `${generatedId}-trigger`;
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const itemVariants = useMemo(
    () => getItemVariants(reduceMotion),
    [reduceMotion]
  );
  const buttonTransition = reduceMotion
    ? { duration: 0.1, ease: "easeOut" as const }
    : PRESS_SPRING;
  const panelTransition = reduceMotion
    ? { duration: 0.14, ease: "easeOut" as const }
    : { duration: 0.22, ease: SOFT_EASE };
  const chevronTransition = reduceMotion
    ? { duration: 0.12, ease: "easeOut" as const }
    : { duration: 0.2, ease: SOFT_EASE };
  const sections = useMemo(() => getSelectSections(options), [options]);

  const clearTypeahead = useCallback(() => {
    if (typeaheadTimeoutRef.current !== null) {
      window.clearTimeout(typeaheadTimeoutRef.current);
      typeaheadTimeoutRef.current = null;
    }

    typeaheadRef.current = "";
  }, []);

  const focusTrigger = useCallback(() => {
    window.requestAnimationFrame(() => {
      triggerRef.current?.focus({ preventScroll: true });
    });
  }, []);

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;

    if (!(trigger && typeof window !== "undefined")) {
      return;
    }

    const nextPosition = getMenuPosition({
      optionCount: options.length,
      panel: menuPanelRef.current,
      triggerRect: trigger.getBoundingClientRect(),
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
    });

    setMenuPosition((previous) => {
      if (
        previous &&
        previous.left === nextPosition.left &&
        previous.maxHeight === nextPosition.maxHeight &&
        previous.top === nextPosition.top &&
        previous.transformOrigin === nextPosition.transformOrigin &&
        previous.width === nextPosition.width
      ) {
        return previous;
      }

      return nextPosition;
    });
  }, [options.length]);

  const openMenu = useCallback(
    (nextActiveIndex = selectedIndex >= 0 ? selectedIndex : 0) => {
      setActiveIndex(
        clamp(nextActiveIndex, 0, Math.max(options.length - 1, 0))
      );
      setOpen(true);
    },
    [options.length, selectedIndex]
  );

  const closeMenu = useCallback(
    (restoreFocus = false) => {
      setOpen(false);
      clearTypeahead();
      pendingTypeaheadRef.current = null;

      if (restoreFocus) {
        focusTrigger();
      }
    },
    [clearTypeahead, focusTrigger]
  );

  const selectOption = useCallback(
    (index: number, restoreFocus = true) => {
      const option = options[index];

      if (!option) {
        return;
      }

      onChange?.(option.value);
      setActiveIndex(index);
      closeMenu(restoreFocus);
    },
    [closeMenu, onChange, options]
  );

  const runTypeahead = useCallback(
    (key: string) => {
      if (options.length === 0) {
        return;
      }

      const normalizedKey = normalizeTypeaheadValue(key);

      if (!normalizedKey) {
        return;
      }

      const bufferedQuery = `${typeaheadRef.current}${normalizedKey}`;
      const bufferedMatch = findTypeaheadMatch(
        options,
        bufferedQuery,
        activeIndex
      );
      const singleKeyMatch =
        bufferedMatch === -1
          ? findTypeaheadMatch(options, normalizedKey, activeIndex)
          : bufferedMatch;
      const nextIndex = bufferedMatch !== -1 ? bufferedMatch : singleKeyMatch;

      typeaheadRef.current =
        bufferedMatch !== -1 ? bufferedQuery : normalizedKey;

      if (typeaheadTimeoutRef.current !== null) {
        window.clearTimeout(typeaheadTimeoutRef.current);
      }

      typeaheadTimeoutRef.current = window.setTimeout(() => {
        typeaheadRef.current = "";
        typeaheadTimeoutRef.current = null;
      }, TYPEAHEAD_RESET_MS);

      if (nextIndex >= 0) {
        setActiveIndex(nextIndex);
      }
    },
    [activeIndex, options]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => clearTypeahead();
  }, [clearTypeahead]);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    updateMenuPosition();
  }, [open, updateMenuPosition]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setActiveIndex((current) => {
      if (selectedIndex >= 0) {
        return selectedIndex;
      }

      return clamp(current, 0, Math.max(options.length - 1, 0));
    });
  }, [open, options.length, selectedIndex]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleLayoutChange = () => updateMenuPosition();
    window.addEventListener("resize", handleLayoutChange);
    window.addEventListener("scroll", handleLayoutChange, true);

    if (typeof ResizeObserver === "undefined") {
      return () => {
        window.removeEventListener("resize", handleLayoutChange);
        window.removeEventListener("scroll", handleLayoutChange, true);
      };
    }

    const observer = new ResizeObserver(handleLayoutChange);
    const observedNodes = [triggerRef.current, menuPanelRef.current].filter(
      Boolean
    );

    observedNodes.forEach((node) => {
      observer.observe(node as Element);
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleLayoutChange);
      window.removeEventListener("scroll", handleLayoutChange, true);
    };
  }, [open, updateMenuPosition]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (openInteractionRef.current !== "keyboard") {
      return;
    }

    const focusFrame = window.requestAnimationFrame(() => {
      listboxRef.current?.focus({ preventScroll: true });

      if (pendingTypeaheadRef.current) {
        runTypeahead(pendingTypeaheadRef.current);
        pendingTypeaheadRef.current = null;
      }
    });

    return () => window.cancelAnimationFrame(focusFrame);
  }, [open, runTypeahead]);

  useEffect(() => {
    if (!open) {
      return;
    }

    scrollOptionIntoView(
      listboxRef.current,
      optionRefs.current[activeIndex] ?? null
    );
  }, [activeIndex, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (triggerRef.current?.contains(target)) {
        return;
      }

      if (menuPanelRef.current?.contains(target)) {
        return;
      }

      closeMenu(false);
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", handlePointerDown, true);
  }, [closeMenu, open]);

  return (
    <div className={cn("relative w-72 max-w-full", className)}>
      <motion.button
        aria-controls={open ? listboxId : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex min-h-11 w-full touch-manipulation items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-3 text-left font-medium text-foreground text-sm transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        data-state={open ? "open" : "closed"}
        id={triggerId}
        onClick={() => {
          if (open) {
            closeMenu(false);
            return;
          }

          openInteractionRef.current = "pointer";
          openMenu(selectedIndex >= 0 ? selectedIndex : 0);
        }}
        onKeyDown={(event) => {
          openInteractionRef.current = "keyboard";
          handleSelectTriggerKeyDown({
            closeMenu,
            event,
            open,
            openMenu,
            optionsLength: options.length,
            pendingTypeaheadRef,
            selectedIndex,
          });
        }}
        ref={triggerRef}
        transition={buttonTransition}
        type="button"
        whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      >
        <span
          className={cn(
            "min-w-0 flex-1 truncate",
            selected ? "text-foreground" : "text-muted-foreground"
          )}
          title={selected ? selected.label : placeholder}
        >
          {selected ? selected.label : placeholder}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          className="shrink-0"
          transition={chevronTransition}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.span>
      </motion.button>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <SelectMenuContent
                  activeIndex={activeIndex}
                  closeMenu={closeMenu}
                  itemVariants={itemVariants}
                  listboxId={listboxId}
                  listboxRef={listboxRef}
                  menuPanelRef={menuPanelRef}
                  menuPosition={menuPosition}
                  optionRefs={optionRefs}
                  options={options}
                  panelTransition={panelTransition}
                  reduceMotion={reduceMotion}
                  runTypeahead={runTypeahead}
                  sections={sections}
                  selectOption={selectOption}
                  setActiveIndex={setActiveIndex}
                  triggerId={triggerId}
                  value={value}
                />
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </div>
  );
}

export { Select as select };
