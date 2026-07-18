"use client";

import { Input as InputPrimitive } from "@base-ui/react/input";
import {
  ArrowUp,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Mic,
  Plus,
} from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  type ComponentType,
  Fragment,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal, flushSync } from "react-dom";

import { Switch } from "@/components/ui/b-switch";

const WAVE_DURATION_MS = 1000;
const MAX_TEXTAREA_HEIGHT = 132;

/** Spring used by the shared hover highlight that glides between plus-menu rows. */
const HOVER_SPRING = {
  type: "spring",
  stiffness: 460,
  damping: 34,
  mass: 0.58,
} as const;

/** Apple Intelligence-style spectrum used by the send wave. */
const WAVE_WASH_GRADIENT =
  "linear-gradient(180deg, transparent, rgba(34,211,238,0.07), rgba(59,130,246,0.09), rgba(217,70,239,0.1), rgba(244,63,94,0.09), rgba(249,115,22,0.08), transparent)";

export type AIInputOption = {
  value: string;
  label: string;
};

export type AIInputMessage = {
  id: number;
  text: string;
};

// ─── Settings dropdown types ────────────────────────────────────────────────

export type PromptSettingOption = {
  value: string;
  label: string;
  description?: string;
};

export type PromptSettingGroup = {
  id: string;
  label: string;
  options: PromptSettingOption[];
  /** Show the selected option as a featured row with description and checkmark. */
  display?: "featured" | "submenu";
  /** Optional submenu row label for picking other options (e.g. "More models"). */
  moreMenuLabel?: string;
};

export type PromptMenuAction = {
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
};

// ─── Settings dropdown helpers ───────────────────────────────────────────────

function getDefaultSettings(
  groups: PromptSettingGroup[],
  defaults?: Record<string, string>
) {
  return groups.reduce<Record<string, string>>((acc, group) => {
    const preferred = defaults?.[group.id];
    const hasPreferred = group.options.some((opt) => opt.value === preferred);
    acc[group.id] =
      hasPreferred && preferred ? preferred : (group.options[0]?.value ?? "");
    return acc;
  }, {});
}

function getOptionLabel(group: PromptSettingGroup, value: string) {
  return group.options.find((option) => option.value === value)?.label ?? value;
}

function getSelectedOption(group: PromptSettingGroup, value: string) {
  return group.options.find((option) => option.value === value);
}

const dropdownPanelClassName =
  "fixed z-[400] w-[min(14.5rem,calc(100vw-1.5rem))] overflow-y-auto overscroll-contain rounded-xl border border-border/60 bg-card py-1 text-sm shadow-[0_10px_28px_-20px_rgba(0,0,0,0.14)] outline-none [-webkit-overflow-scrolling:touch]";

const DROPDOWN_SIDE_OFFSET = 8;
const DROPDOWN_VIEWPORT_MARGIN = 12;
const DROPDOWN_SUBMENU_OFFSET = 4;
const DROPDOWN_PANEL_WIDTH = 232;
const DROPDOWN_ESTIMATED_HEIGHT = 240;
const COMPACT_VIEWPORT_WIDTH = 640;
const DROPDOWN_MIN_PANEL_HEIGHT = 160;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function isCompactViewport() {
  return window.innerWidth < COMPACT_VIEWPORT_WIDTH;
}

function getPanelWidth(viewportWidth: number) {
  return Math.min(
    DROPDOWN_PANEL_WIDTH,
    viewportWidth - DROPDOWN_VIEWPORT_MARGIN * 2
  );
}

function useCompactViewport() {
  const [isCompact, setIsCompact] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${COMPACT_VIEWPORT_WIDTH - 1}px)`)
      .matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${COMPACT_VIEWPORT_WIDTH - 1}px)`
    );
    const update = () => setIsCompact(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isCompact;
}

function usePrefersHover() {
  const [prefersHover, setPrefersHover] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setPrefersHover(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return prefersHover;
}

function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

function isInsideDropdownPanel(node: Node | null) {
  return (
    node instanceof Element &&
    Boolean(node.closest("[data-prompt-dropdown-panel]"))
  );
}

function useDropdownDismiss({
  open,
  onClose,
  onEscape,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  onEscape?: () => boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (isInsideDropdownPanel(target)) return;
      onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      if (onEscape?.()) return;
      onClose();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onEscape, open, triggerRef]);
}

function preventFocusSteal(event: React.MouseEvent) {
  event.preventDefault();
}

function activateOnEnterOrSpace(
  event: React.KeyboardEvent,
  action: () => void
) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    action();
  }
}

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="10"
      viewBox="0 0 14 14"
      width="10"
    >
      <path
        d="M3.5 5.25L7 8.75L10.5 5.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const BAR_XS = [1.5, 5.75, 10] as const;
const BAR_WIDTH = 2.5;
const BAR_BOTTOM = 12.5;

type EffortLevel = "low" | "medium" | "high";

const BAR_HEIGHTS = [4.5, 7.5, 10.5] as const;

const EFFORT_BAR_LEVELS: Record<
  EffortLevel,
  Array<{ height: number; visible: boolean }>
> = {
  low: [
    { height: 3.25, visible: true },
    { height: 4.75, visible: true },
    { height: 0, visible: false },
  ],
  medium: [
    { height: BAR_HEIGHTS[0], visible: true },
    { height: BAR_HEIGHTS[1], visible: true },
    { height: 0, visible: false },
  ],
  high: [
    { height: BAR_HEIGHTS[0], visible: true },
    { height: BAR_HEIGHTS[1], visible: true },
    { height: BAR_HEIGHTS[2], visible: true },
  ],
};

function normalizeEffortLevel(value: string): EffortLevel {
  if (value === "low" || value === "medium" || value === "high") return value;
  return "medium";
}

function getEffortGroupId(groups: PromptSettingGroup[]) {
  return (
    groups.find((group) => group.id === "effort")?.id ??
    groups.find((group) => group.display === "submenu")?.id
  );
}

const SETTINGS_TRANSITION = {
  type: "spring" as const,
  stiffness: 380,
  damping: 34,
};

function EffortBarsIcon({ level }: { level: EffortLevel }) {
  const bars = EFFORT_BAR_LEVELS[level];

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="14"
      viewBox="0 0 14 14"
      width="14"
    >
      {bars.map((bar, index) => (
        <motion.rect
          animate={{
            height: bar.visible ? bar.height : 0,
            opacity: bar.visible ? 1 : 0,
            y: bar.visible ? BAR_BOTTOM - bar.height : BAR_BOTTOM,
          }}
          fill="currentColor"
          initial={false}
          key={BAR_XS[index]}
          rx={1}
          transition={SETTINGS_TRANSITION}
          width={BAR_WIDTH}
          x={BAR_XS[index]}
        />
      ))}
    </svg>
  );
}

const dropdownSubmenuTriggerClassName =
  "relative flex min-h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm outline-none transition-colors focus-visible:outline-none";

function DropdownFeaturedRow({
  description,
  label,
}: {
  description?: string;
  label: string;
}) {
  return (
    <div className="flex items-start justify-between gap-2.5 px-2.5 py-2">
      <div className="min-w-0">
        <p className="font-medium text-foreground leading-tight">{label}</p>
        {description ? (
          <p className="mt-0.5 text-muted-foreground text-xs leading-snug">
            {description}
          </p>
        ) : null}
      </div>
      <Check
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 text-brand"
        strokeWidth={2.25}
      />
    </div>
  );
}

const dropdownOptionClassName =
  "relative flex min-h-9 w-full cursor-pointer scroll-m-1 touch-manipulation items-center justify-between gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm outline-none transition-colors focus-visible:text-foreground focus-visible:outline-none";

const dropdownOptionHighlightClassName =
  "absolute inset-x-1 inset-y-0.5 rounded-lg bg-accent/65";

const dropdownHighlightSpring = {
  type: "spring" as const,
  stiffness: 600,
  damping: 38,
};

const dropdownLabelSpring = {
  type: "spring" as const,
  stiffness: 360,
  damping: 28,
  mass: 0.55,
};

const dropdownCheckSpring = {
  type: "spring" as const,
  stiffness: 460,
  damping: 24,
  mass: 0.5,
};

const dropdownPanelSpring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 34,
  mass: 0.72,
};

type SubmenuOrigin = "left" | "right" | "below";

type SubmenuPosition = {
  left: number;
  top: number;
  maxHeight: number;
  origin: SubmenuOrigin;
};

type DropdownSide = "top" | "bottom";

type DropdownPosition = {
  left: number;
  side: DropdownSide;
  top?: number;
  bottom?: number;
  maxHeight: number;
};

function getMainDropdownMotion(side: DropdownSide, instantClose = false) {
  const offsetY = side === "bottom" ? -10 : 10;

  return {
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: {
      opacity: 0,
      scale: instantClose ? 1 : 0.98,
      y: instantClose ? 0 : offsetY * 0.65,
    },
    initial: { opacity: 0, scale: 0.96, y: offsetY },
    transition: instantClose ? { duration: 0 } : dropdownPanelSpring,
  };
}

function getMainDropdownInnerMotion(side: DropdownSide, instantClose = false) {
  const offsetY = side === "bottom" ? 5 : -5;

  return {
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: instantClose ? 0 : offsetY * 0.5 },
    initial: { opacity: 0, y: offsetY },
    transition: instantClose
      ? { duration: 0 }
      : { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
  };
}

function getFlyoutSubmenuMotion(origin: SubmenuOrigin, instantClose = false) {
  const offsetX = origin === "right" ? -12 : 12;

  return {
    animate: { opacity: 1, scale: 1, x: 0 },
    exit: {
      opacity: 0,
      scale: instantClose ? 1 : 0.98,
      x: instantClose ? 0 : offsetX * 0.55,
    },
    initial: { opacity: 0, scale: 0.96, x: offsetX },
    transition: instantClose ? { duration: 0 } : dropdownPanelSpring,
  };
}

function getSubmenuPosition(
  triggerRect: DOMRect,
  panelHeight: number,
  panelWidth: number
) {
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const effectiveWidth = Math.min(panelWidth, getPanelWidth(viewportWidth));

  if (isCompactViewport()) {
    const left = clamp(
      triggerRect.left,
      DROPDOWN_VIEWPORT_MARGIN,
      viewportWidth - effectiveWidth - DROPDOWN_VIEWPORT_MARGIN
    );
    const top = triggerRect.bottom + DROPDOWN_SIDE_OFFSET;
    const maxHeight = Math.max(
      DROPDOWN_MIN_PANEL_HEIGHT,
      viewportHeight - top - DROPDOWN_VIEWPORT_MARGIN
    );

    return { left, maxHeight, origin: "below" as const, top };
  }

  const spaceRight =
    viewportWidth -
    triggerRect.right -
    DROPDOWN_SUBMENU_OFFSET -
    DROPDOWN_VIEWPORT_MARGIN;
  const openRight = spaceRight >= effectiveWidth;

  const left = openRight
    ? triggerRect.right + DROPDOWN_SUBMENU_OFFSET
    : triggerRect.left - effectiveWidth - DROPDOWN_SUBMENU_OFFSET;

  const clampedLeft = clamp(
    left,
    DROPDOWN_VIEWPORT_MARGIN,
    viewportWidth - effectiveWidth - DROPDOWN_VIEWPORT_MARGIN
  );

  const maxTop = Math.max(
    DROPDOWN_VIEWPORT_MARGIN,
    viewportHeight - panelHeight - DROPDOWN_VIEWPORT_MARGIN
  );
  const top = clamp(triggerRect.top, DROPDOWN_VIEWPORT_MARGIN, maxTop);
  const maxHeight = Math.max(
    DROPDOWN_MIN_PANEL_HEIGHT,
    viewportHeight - top - DROPDOWN_VIEWPORT_MARGIN
  );

  return {
    left: clampedLeft,
    maxHeight,
    origin: openRight ? ("right" as const) : ("left" as const),
    top,
  };
}

function getDropdownPosition({
  align = "start",
  panelHeight,
  panelWidth,
  triggerRect,
}: {
  align?: "end" | "start";
  panelHeight: number;
  panelWidth: number;
  triggerRect: DOMRect;
}): DropdownPosition {
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const effectiveWidth = Math.min(panelWidth, getPanelWidth(viewportWidth));

  const spaceBelow =
    viewportHeight -
    triggerRect.bottom -
    DROPDOWN_SIDE_OFFSET -
    DROPDOWN_VIEWPORT_MARGIN;
  const spaceAbove =
    triggerRect.top - DROPDOWN_SIDE_OFFSET - DROPDOWN_VIEWPORT_MARGIN;

  const openBelow =
    spaceBelow >= panelHeight
      ? true
      : spaceAbove >= panelHeight
        ? false
        : spaceBelow >= spaceAbove;

  const desiredLeft =
    align === "end" ? triggerRect.right - effectiveWidth : triggerRect.left;

  const left = clamp(
    desiredLeft,
    DROPDOWN_VIEWPORT_MARGIN,
    viewportWidth - effectiveWidth - DROPDOWN_VIEWPORT_MARGIN
  );

  const maxHeight = Math.max(
    DROPDOWN_MIN_PANEL_HEIGHT,
    openBelow ? spaceBelow : spaceAbove
  );

  if (openBelow) {
    return {
      left,
      maxHeight,
      side: "bottom",
      top: triggerRect.bottom + DROPDOWN_SIDE_OFFSET,
    };
  }

  return {
    left,
    maxHeight,
    side: "top",
    bottom: viewportHeight - triggerRect.top + DROPDOWN_SIDE_OFFSET,
  };
}

function DropdownMenuDivider() {
  return <hr className="mx-2 h-px border-0 bg-border" />;
}

function DropdownOption({
  label,
  selected,
  onSelect,
  activeItemId,
  highlightLayoutId,
  setActiveItemId,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  activeItemId: string | null;
  highlightLayoutId: string;
  setActiveItemId: (itemId: string | null) => void;
}) {
  const itemId = useId();
  const isActive = activeItemId === itemId;

  return (
    <button
      aria-checked={selected}
      className={`${dropdownOptionClassName} ${selected ? "text-foreground" : "text-muted-foreground"}`}
      onClick={onSelect}
      onKeyDown={(event) => activateOnEnterOrSpace(event, onSelect)}
      onMouseDown={preventFocusSteal}
      onMouseEnter={() => setActiveItemId(itemId)}
      onPointerMove={() => setActiveItemId(itemId)}
      role="menuitemradio"
      tabIndex={-1}
      type="button"
    >
      {isActive ? (
        <motion.span
          className={dropdownOptionHighlightClassName}
          layoutId={highlightLayoutId}
          transition={dropdownHighlightSpring}
        />
      ) : null}
      <motion.span
        className="relative z-10 flex min-w-0 flex-1 items-center gap-2 truncate"
        transition={dropdownLabelSpring}
      >
        {label}
      </motion.span>
      {selected ? (
        <motion.span
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative z-10 flex size-5 shrink-0 items-center justify-center text-foreground"
          initial={{ opacity: 0, scale: 0.96, y: 1 }}
          transition={dropdownCheckSpring}
        >
          <Check className="h-4 w-4" />
        </motion.span>
      ) : null}
    </button>
  );
}

function DropdownActionItem({
  label,
  icon,
  shortcut,
  onSelect,
  activeItemId,
  highlightLayoutId,
  setActiveItemId,
}: {
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  onSelect: () => void;
  activeItemId: string | null;
  highlightLayoutId: string;
  setActiveItemId: (itemId: string | null) => void;
}) {
  const itemId = useId();
  const isActive = activeItemId === itemId;

  return (
    <button
      className={`${dropdownOptionClassName} text-foreground`}
      onClick={onSelect}
      onKeyDown={(event) => activateOnEnterOrSpace(event, onSelect)}
      onMouseDown={preventFocusSteal}
      onMouseEnter={() => setActiveItemId(itemId)}
      onPointerMove={() => setActiveItemId(itemId)}
      role="menuitem"
      tabIndex={-1}
      type="button"
    >
      {isActive ? (
        <motion.span
          className={dropdownOptionHighlightClassName}
          layoutId={highlightLayoutId}
          transition={dropdownHighlightSpring}
        />
      ) : null}
      <motion.span
        className="relative z-10 flex min-w-0 flex-1 items-center gap-2.5 truncate"
        transition={dropdownLabelSpring}
      >
        {icon ? (
          <span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground">
            {icon}
          </span>
        ) : null}
        <span className="truncate">{label}</span>
      </motion.span>
      {shortcut ? (
        <span className="relative z-10 shrink-0 text-muted-foreground text-xs tabular-nums">
          {shortcut}
        </span>
      ) : null}
    </button>
  );
}

function useSubmenuPosition({
  isCompact,
  isOpen,
  submenuRef,
  triggerRef,
}: {
  isCompact: boolean;
  isOpen: boolean;
  submenuRef: React.RefObject<HTMLDivElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [submenuPosition, setSubmenuPosition] = useState<SubmenuPosition>({
    left: 0,
    maxHeight: DROPDOWN_ESTIMATED_HEIGHT,
    origin: "right",
    top: 0,
  });

  const updateSubmenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    const submenu = submenuRef.current;
    if (!trigger) return;

    const panelHeight = submenu?.offsetHeight ?? DROPDOWN_ESTIMATED_HEIGHT;
    const panelWidth = submenu?.offsetWidth ?? DROPDOWN_PANEL_WIDTH;

    setSubmenuPosition(
      getSubmenuPosition(
        trigger.getBoundingClientRect(),
        panelHeight,
        panelWidth
      )
    );
  }, [submenuRef, triggerRef]);

  useLayoutEffect(() => {
    if (!isOpen || isCompact) return;

    updateSubmenuPosition();

    const submenu = submenuRef.current;
    let observer: ResizeObserver | undefined;

    if (submenu) {
      observer = new ResizeObserver(updateSubmenuPosition);
      observer.observe(submenu);
    }

    window.addEventListener("resize", updateSubmenuPosition);
    window.addEventListener("scroll", updateSubmenuPosition, true);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateSubmenuPosition);
      window.removeEventListener("scroll", updateSubmenuPosition, true);
    };
  }, [isCompact, isOpen, submenuRef, updateSubmenuPosition]);

  return { submenuPosition, updateSubmenuPosition };
}

function SubmenuInlinePanel({
  isOpen,
  submenuOptions,
}: {
  isOpen: boolean;
  submenuOptions: ReactNode;
}) {
  if (!isOpen) return null;
  return <div className="px-1 pb-1">{submenuOptions}</div>;
}

function SubmenuFlyoutPanel({
  flyoutSubmenuMotion,
  groupLabel,
  isOpen,
  itemId,
  onOpenChange,
  prefersHover,
  setActiveItemId,
  submenuHighlightLayoutId,
  submenuId,
  submenuOptions,
  submenuPosition,
  submenuRef,
  triggerRef,
}: {
  flyoutSubmenuMotion: ReturnType<typeof getFlyoutSubmenuMotion>;
  groupLabel: string;
  isOpen: boolean;
  itemId: string;
  onOpenChange: (open: boolean) => void;
  prefersHover: boolean;
  setActiveItemId: (itemId: string | null) => void;
  submenuHighlightLayoutId: string;
  submenuId: string;
  submenuOptions: ReactNode;
  submenuPosition: SubmenuPosition;
  submenuRef: React.RefObject<HTMLDivElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <AnimatePresence initial={false}>
      {isOpen ? (
        <motion.div
          animate={flyoutSubmenuMotion.animate}
          aria-label={groupLabel}
          className={dropdownPanelClassName}
          data-prompt-dropdown-panel=""
          exit={flyoutSubmenuMotion.exit}
          initial={flyoutSubmenuMotion.initial}
          key={submenuId}
          onMouseEnter={() => setActiveItemId(itemId)}
          onMouseLeave={
            prefersHover
              ? (event) => {
                  const related = event.relatedTarget as Node | null;
                  if (triggerRef.current?.contains(related)) return;
                  if (isInsideDropdownPanel(related)) return;
                  onOpenChange(false);
                }
              : undefined
          }
          ref={submenuRef}
          role="menu"
          style={{
            left: submenuPosition.left,
            maxHeight: submenuPosition.maxHeight,
            top: submenuPosition.top,
            transformOrigin:
              submenuPosition.origin === "right" ? "left top" : "right top",
            zIndex: 401,
          }}
          transition={flyoutSubmenuMotion.transition}
        >
          <LayoutGroup id={`${submenuHighlightLayoutId}-group`}>
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: flyoutSubmenuMotion.initial.x > 0 ? 3 : -3,
              }}
              initial={{
                opacity: 0,
                y: flyoutSubmenuMotion.initial.x > 0 ? -3 : 3,
              }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              {submenuOptions}
            </motion.div>
          </LayoutGroup>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function DropdownSubmenu({
  group,
  selectedValue,
  triggerLabel,
  valueLabel,
  icon,
  submenuId,
  isOpen,
  onOpenChange,
  onSelect,
  activeItemId,
  highlightLayoutId,
  submenuHighlightLayoutId,
  setActiveItemId,
}: {
  group: PromptSettingGroup;
  selectedValue: string;
  triggerLabel: string;
  valueLabel?: string;
  icon?: ReactNode;
  submenuId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (value: string) => void;
  activeItemId: string | null;
  highlightLayoutId: string;
  submenuHighlightLayoutId: string;
  setActiveItemId: (itemId: string | null) => void;
}) {
  const itemId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const isCompact = useCompactViewport();
  const prefersHover = usePrefersHover();
  const mounted = useIsMounted();
  const { submenuPosition, updateSubmenuPosition } = useSubmenuPosition({
    isCompact,
    isOpen,
    submenuRef,
    triggerRef,
  });
  const isActive = activeItemId === itemId || isOpen;
  const flyoutSubmenuMotion = getFlyoutSubmenuMotion(submenuPosition.origin);
  const wasCompactRef = useRef<boolean | null>(null);

  useEffect(() => {
    const previousCompact = wasCompactRef.current;
    wasCompactRef.current = isCompact;
    if (previousCompact === false && isCompact && isOpen) {
      onOpenChange(false);
    }
  }, [isCompact, isOpen, onOpenChange]);

  const openSubmenu = useCallback(() => {
    if (isCompact) return;
    updateSubmenuPosition();
    onOpenChange(true);
  }, [isCompact, onOpenChange, updateSubmenuPosition]);

  const toggleSubmenu = useCallback(() => {
    setActiveItemId(itemId);
    onOpenChange(!isOpen);
  }, [isOpen, itemId, onOpenChange, setActiveItemId]);

  const handleTriggerMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const related = event.relatedTarget as Node | null;
      if (submenuRef.current?.contains(related)) return;
      if (isInsideDropdownPanel(related)) return;
      if (isOpen) onOpenChange(false);
    },
    [isOpen, onOpenChange]
  );

  const handleOptionSelect = useCallback(
    (value: string) => {
      flushSync(() => {
        onOpenChange(false);
      });
      onSelect(value);
    },
    [onOpenChange, onSelect]
  );

  const submenuOptions = (
    <div className="space-y-0.5">
      {group.options.map((option) => (
        <DropdownOption
          activeItemId={activeItemId}
          highlightLayoutId={submenuHighlightLayoutId}
          key={option.value}
          label={option.label}
          onSelect={() => handleOptionSelect(option.value)}
          selected={selectedValue === option.value}
          setActiveItemId={setActiveItemId}
        />
      ))}
    </div>
  );

  return (
    <>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`${dropdownSubmenuTriggerClassName} touch-manipulation text-foreground`}
        onClick={toggleSubmenu}
        onKeyDown={(event) => activateOnEnterOrSpace(event, toggleSubmenu)}
        onMouseDown={preventFocusSteal}
        onMouseEnter={
          prefersHover
            ? () => {
                setActiveItemId(itemId);
                openSubmenu();
              }
            : undefined
        }
        onMouseLeave={prefersHover ? handleTriggerMouseLeave : undefined}
        onPointerMove={prefersHover ? () => setActiveItemId(itemId) : undefined}
        ref={triggerRef}
        tabIndex={-1}
        type="button"
      >
        {isActive ? (
          <motion.span
            className={dropdownOptionHighlightClassName}
            layoutId={highlightLayoutId}
            transition={dropdownHighlightSpring}
          />
        ) : null}
        <motion.span
          className="relative z-10 flex min-w-0 flex-1 items-center gap-2.5 truncate"
          transition={dropdownLabelSpring}
        >
          {icon ? (
            <span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground">
              {icon}
            </span>
          ) : null}
          <span className="truncate">{triggerLabel}</span>
        </motion.span>
        <span className="relative z-10 flex shrink-0 items-center gap-1.5">
          {valueLabel ? (
            <span className="max-w-[5.5rem] truncate text-muted-foreground sm:max-w-none">
              {valueLabel}
            </span>
          ) : null}
          <ChevronRight
            aria-hidden="true"
            className={`size-4 text-muted-foreground transition-transform ${isCompact && isOpen ? "rotate-90" : ""}`}
          />
        </span>
      </button>
      {isCompact ? (
        <SubmenuInlinePanel isOpen={isOpen} submenuOptions={submenuOptions} />
      ) : null}
      {!isCompact && mounted
        ? createPortal(
            <SubmenuFlyoutPanel
              flyoutSubmenuMotion={flyoutSubmenuMotion}
              groupLabel={group.label}
              isOpen={isOpen}
              itemId={itemId}
              onOpenChange={onOpenChange}
              prefersHover={prefersHover}
              setActiveItemId={setActiveItemId}
              submenuHighlightLayoutId={submenuHighlightLayoutId}
              submenuId={submenuId}
              submenuOptions={submenuOptions}
              submenuPosition={submenuPosition}
              submenuRef={submenuRef}
              triggerRef={triggerRef}
            />,
            document.body
          )
        : null}
    </>
  );
}

export function SettingsDropdown({
  groups,
  values,
  menuActions = [],
  onOpenChange,
  onValueChange,
}: {
  groups: PromptSettingGroup[];
  values: Record<string, string>;
  menuActions?: PromptMenuAction[];
  onOpenChange?: (open: boolean) => void;
  onValueChange: (groupId: string, value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const highlightLayoutId = useId();
  const [position, setPosition] = useState<DropdownPosition>({
    left: 0,
    maxHeight: DROPDOWN_ESTIMATED_HEIGHT,
    side: "bottom",
    top: 0,
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const prefersHover = usePrefersHover();
  const isCompact = useCompactViewport();
  const mounted = useIsMounted();
  const [instantDismiss, setInstantDismiss] = useState(false);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      onOpenChange?.(nextOpen);
      if (!nextOpen) {
        setActiveItemId(null);
        setOpenSubmenuId(null);
      }
    },
    [onOpenChange]
  );

  const dismissDropdown = useCallback(
    (instant = false) => {
      if (instant) setInstantDismiss(true);
      handleOpenChange(false);
    },
    [handleOpenChange]
  );

  useEffect(() => {
    if (open) setInstantDismiss(false);
  }, [open]);

  const handleSubmenuSelect = useCallback(
    (groupId: string, value: string) => {
      onValueChange(groupId, value);
      setOpenSubmenuId(null);
      if (!isCompact) dismissDropdown(true);
    },
    [dismissDropdown, isCompact, onValueChange]
  );

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const triggerRect = trigger.getBoundingClientRect();
    const panel = panelRef.current;
    const panelHeight = panel?.offsetHeight ?? DROPDOWN_ESTIMATED_HEIGHT;
    const panelWidth = panel?.offsetWidth ?? DROPDOWN_PANEL_WIDTH;

    setPosition(getDropdownPosition({ panelHeight, panelWidth, triggerRect }));
  }, []);

  useLayoutEffect(() => {
    if (!open) return;

    updatePosition();

    const panel = panelRef.current;
    let observer: ResizeObserver | undefined;

    if (panel) {
      observer = new ResizeObserver(() => updatePosition());
      observer.observe(panel);
    }

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  const handleEscape = useCallback(() => {
    if (openSubmenuId) {
      setOpenSubmenuId(null);
      return true;
    }
    return false;
  }, [openSubmenuId]);

  useDropdownDismiss({
    onClose: () => handleOpenChange(false),
    onEscape: handleEscape,
    open,
    triggerRef,
  });

  const toggleOpen = useCallback(() => {
    if (open) {
      handleOpenChange(false);
      return;
    }
    updatePosition();
    handleOpenChange(true);
  }, [handleOpenChange, open, updatePosition]);

  const selectedLabels = groups.map((group) =>
    getOptionLabel(group, values[group.id] ?? "")
  );
  const triggerLabel = selectedLabels.join(", ");
  const effortGroupId = getEffortGroupId(groups);
  const effortLevel = normalizeEffortLevel(
    effortGroupId ? (values[effortGroupId] ?? "medium") : "medium"
  );
  const mainDropdownMotion = getMainDropdownMotion(
    position.side,
    instantDismiss
  );
  const mainDropdownInnerMotion = getMainDropdownInnerMotion(
    position.side,
    instantDismiss
  );

  return (
    <>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Select settings: ${triggerLabel}`}
        className="flex min-w-0 max-w-[calc(100%-3rem)] items-center gap-1.5 rounded-full py-1 text-sm transition-colors hover:text-foreground"
        onClick={toggleOpen}
        onMouseDown={(event) => event.preventDefault()}
        ref={triggerRef}
        type="button"
      >
        <span className="shrink-0 text-muted-foreground">
          <EffortBarsIcon level={effortLevel} />
        </span>
        {groups.map((group, index) => {
          const label = getOptionLabel(group, values[group.id] ?? "");

          return (
            <span
              className={`truncate font-medium ${index === 0 ? "text-foreground" : "text-muted-foreground"}`}
              key={group.id}
            >
              {label}
            </span>
          );
        })}
        <span
          className={`text-muted-foreground transition-transform ${open ? "rotate-180 text-foreground" : ""}`}
        >
          <ChevronDownIcon />
        </span>
      </button>
      {mounted &&
        createPortal(
          <AnimatePresence initial={false}>
            {open ? (
              <motion.div
                animate={mainDropdownMotion.animate}
                aria-label="Prompt settings"
                className={dropdownPanelClassName}
                data-prompt-dropdown-panel=""
                exit={mainDropdownMotion.exit}
                initial={mainDropdownMotion.initial}
                key="prompt-settings-dropdown"
                ref={panelRef}
                role="menu"
                style={{
                  left: position.left,
                  maxHeight: position.maxHeight,
                  transformOrigin:
                    position.side === "bottom" ? "top left" : "bottom left",
                  ...(position.side === "bottom"
                    ? { top: position.top }
                    : { bottom: position.bottom }),
                }}
                transition={mainDropdownMotion.transition}
              >
                <LayoutGroup>
                  <motion.div
                    animate={mainDropdownInnerMotion.animate}
                    className="space-y-0.5"
                    exit={mainDropdownInnerMotion.exit}
                    initial={mainDropdownInnerMotion.initial}
                    onMouseLeave={
                      prefersHover
                        ? (event) => {
                            const related = event.relatedTarget as Node | null;
                            if (
                              related instanceof Element &&
                              related.closest("[data-prompt-dropdown-panel]")
                            ) {
                              return;
                            }
                            setActiveItemId(null);
                            setOpenSubmenuId(null);
                          }
                        : undefined
                    }
                    transition={mainDropdownInnerMotion.transition}
                  >
                    {menuActions.map((action, index) => (
                      <DropdownActionItem
                        activeItemId={activeItemId}
                        highlightLayoutId={`${highlightLayoutId}-action-${index}`}
                        icon={action.icon}
                        key={`${action.label}-${index}`}
                        label={action.label}
                        onSelect={() => {
                          action.onSelect();
                          handleOpenChange(false);
                        }}
                        setActiveItemId={setActiveItemId}
                      />
                    ))}
                    {menuActions.length > 0 && groups.length > 0 ? (
                      <DropdownMenuDivider />
                    ) : null}
                    {groups
                      .filter((group) => group.display === "featured")
                      .map((group) => {
                        const selected = getSelectedOption(
                          group,
                          values[group.id] ?? ""
                        );
                        if (!selected) return null;

                        return (
                          <DropdownFeaturedRow
                            description={selected.description}
                            key={`${group.id}-featured`}
                            label={selected.label}
                          />
                        );
                      })}
                    {groups
                      .filter((group) => group.display === "submenu")
                      .map((group) => (
                        <Fragment key={group.id}>
                          <DropdownMenuDivider />
                          <DropdownSubmenu
                            activeItemId={activeItemId}
                            group={group}
                            highlightLayoutId={highlightLayoutId}
                            isOpen={openSubmenuId === group.id}
                            onOpenChange={(nextOpen) => {
                              setOpenSubmenuId(nextOpen ? group.id : null);
                            }}
                            onSelect={(value) => {
                              handleSubmenuSelect(group.id, value);
                            }}
                            selectedValue={values[group.id] ?? ""}
                            setActiveItemId={setActiveItemId}
                            submenuHighlightLayoutId={`${highlightLayoutId}-${group.id}-sub`}
                            submenuId={group.id}
                            triggerLabel={group.label}
                            valueLabel={getOptionLabel(
                              group,
                              values[group.id] ?? ""
                            )}
                          />
                        </Fragment>
                      ))}
                    {groups
                      .filter((group) => group.moreMenuLabel)
                      .map((group) => (
                        <Fragment key={`${group.id}-more`}>
                          <DropdownMenuDivider />
                          <DropdownSubmenu
                            activeItemId={activeItemId}
                            group={group}
                            highlightLayoutId={highlightLayoutId}
                            isOpen={openSubmenuId === `${group.id}-more`}
                            onOpenChange={(nextOpen) => {
                              setOpenSubmenuId(
                                nextOpen ? `${group.id}-more` : null
                              );
                            }}
                            onSelect={(value) => {
                              handleSubmenuSelect(group.id, value);
                            }}
                            selectedValue={values[group.id] ?? ""}
                            setActiveItemId={setActiveItemId}
                            submenuHighlightLayoutId={`${highlightLayoutId}-${group.id}-more-sub`}
                            submenuId={`${group.id}-more`}
                            triggerLabel={group.moreMenuLabel ?? group.label}
                          />
                        </Fragment>
                      ))}
                  </motion.div>
                </LayoutGroup>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

// ─── Plus menu ───────────────────────────────────────────────────────────────

export type AIInputMenuItem = {
  value: string;
  /** Not needed for separators. */
  label?: string;
  icon?: ComponentType<{ className?: string }>;
  /** "action" (default) fires onMenuSelect, "toggle" renders a switch, "separator" draws a divider. */
  type?: "action" | "toggle" | "separator";
  /** Initial state for toggle items. */
  defaultChecked?: boolean;
  /** Keyboard shortcut shown on the right of action items (e.g. "⌘U"). */
  shortcut?: string;
  /** Called when this action item is clicked, in addition to onMenuSelect. */
  onClick?: () => void;
  /** Called when this toggle item changes, in addition to onMenuToggle. */
  onCheckedChange?: (checked: boolean) => void;
  /** Nested items turn an action into a submenu (one level deep). */
  items?: AIInputMenuItem[];
};

function OptionMenu({
  align = "start",
  ariaLabel,
  chipClassName,
  onChange,
  options,
  value,
}: {
  align?: "start" | "end";
  ariaLabel: string;
  chipClassName: string;
  onChange: (value: string) => void;
  options: AIInputOption[];
  value: string;
}) {
  const [open, setOpen] = useState(false);
  const [upward, setUpward] = useState(false);
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const hoverLayoutId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const selected =
    options.find((option) => option.value === value) ?? options[0];

  return (
    <div className="relative min-w-0" ref={containerRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={ariaLabel}
        className={chipClassName}
        onClick={() => {
          if (!open && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setUpward(window.innerHeight - rect.bottom < 160);
          }
          setHoveredValue(null);
          setOpen((previous) => !previous);
        }}
        type="button"
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown
          aria-hidden="true"
          className={`size-3.5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-label={ariaLabel}
            className={`absolute z-50 w-max min-w-52 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card p-1 shadow-[0_10px_28px_-18px_rgba(0,0,0,0.25)] ${align === "end" ? "right-0" : "left-0"} ${upward ? `bottom-full mb-2 ${align === "end" ? "origin-bottom-right" : "origin-bottom-left"}` : `top-full mt-2 ${align === "end" ? "origin-top-right" : "origin-top-left"}`}`}
            exit={{ opacity: 0, scale: 0.97, y: upward ? 4 : -4 }}
            initial={{ opacity: 0, scale: 0.96, y: upward ? 6 : -6 }}
            onMouseLeave={() => setHoveredValue(null)}
            role="menu"
            transition={{ duration: 0.16, ease: "easeOut" }}
          >
            {options.map((option) => (
              <button
                aria-checked={option.value === selected?.value}
                className="relative isolate flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm"
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                onMouseEnter={() => setHoveredValue(option.value)}
                role="menuitemradio"
                type="button"
              >
                {hoveredValue === option.value ? (
                  <motion.span
                    className="absolute inset-0 -z-10 rounded-[inherit] bg-accent/70"
                    layoutId={hoverLayoutId}
                    transition={HOVER_SPRING}
                  />
                ) : null}
                <span className="truncate">{option.label}</span>
                {option.value === selected?.value ? (
                  <Check
                    aria-hidden="true"
                    className="size-4 shrink-0 text-foreground"
                  />
                ) : null}
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function SendWave({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[inherit]"
      exit={{ opacity: 0 }}
      initial={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <motion.div
        animate={reducedMotion ? { y: "-17%" } : { y: "-105%" }}
        className="absolute inset-x-0 top-0 h-[150%] blur-xl"
        initial={{ y: "55%" }}
        style={{ background: WAVE_WASH_GRADIENT }}
        transition={
          reducedMotion ? { duration: 0 } : { duration: 0.7, ease: "easeOut" }
        }
      />
    </motion.div>
  );
}

const PLUS_PANEL_HEIGHT = 260;

const plusSlideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 10 }),
  visible: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -10 }),
};

function collectToggleDefaults(items: AIInputMenuItem[]) {
  const defaults: Record<string, boolean> = {};

  for (const item of items) {
    if (item.type === "toggle") {
      defaults[item.value] = item.defaultChecked ?? false;
    }
    for (const child of item.items ?? []) {
      if (child.type === "toggle") {
        defaults[child.value] = child.defaultChecked ?? false;
      }
    }
  }

  return defaults;
}

function PlusMenuIcon({
  icon: Icon,
}: {
  icon?: ComponentType<{ className?: string }>;
}) {
  if (!Icon) return null;
  return (
    <span aria-hidden="true">
      <Icon className="size-[15px] shrink-0 text-foreground/60" />
    </span>
  );
}

function PlusMenu({
  items,
  onSelect,
  onToggle,
}: {
  items: AIInputMenuItem[];
  onSelect?: (value: string) => void;
  onToggle?: (value: string, checked: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [upward, setUpward] = useState(false);
  const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
    collectToggleDefaults(items)
  );
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [slideDir, setSlideDir] = useState(1);
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const hoverLayoutId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleOpen = () => {
    if (!open) {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setUpward(window.innerHeight - rect.bottom < PLUS_PANEL_HEIGHT);
      }
      setActiveSubmenu(null);
      setSlideDir(1);
      setHoveredValue(null);
    }
    setOpen((previous) => !previous);
  };

  const handleToggle = (item: AIInputMenuItem, checked: boolean) => {
    setToggles((previous) => ({ ...previous, [item.value]: checked }));
    item.onCheckedChange?.(checked);
    onToggle?.(item.value, checked);
  };

  const handleAction = (item: AIInputMenuItem) => {
    item.onClick?.();
    onSelect?.(item.value);
    setOpen(false);
  };

  const openSub = (value: string) => {
    setSlideDir(1);
    setActiveSubmenu(value);
    setHoveredValue(null);
  };

  const closeSub = () => {
    setSlideDir(-1);
    setActiveSubmenu(null);
    setHoveredValue(null);
  };

  const hoverHighlight = (key: string) =>
    hoveredValue === key ? (
      <motion.span
        className="absolute inset-0 -z-10 rounded-[inherit] bg-accent/70"
        layoutId={hoverLayoutId}
        transition={HOVER_SPRING}
      />
    ) : null;

  const renderItem = (item: AIInputMenuItem, inSubmenu: boolean) => {
    if (item.type === "separator") {
      return <div className="mx-1 my-0.5 h-px bg-border" key={item.value} />;
    }

    if (item.type === "toggle") {
      return (
        <div
          className="relative isolate flex items-center justify-between gap-3 rounded-xl px-3 py-1.5"
          key={item.value}
          onMouseEnter={() => setHoveredValue(item.value)}
        >
          {hoverHighlight(item.value)}
          <div className="flex items-center gap-3">
            <PlusMenuIcon icon={item.icon} />
            <span className="text-sm">{item.label}</span>
          </div>
          <Switch
            checked={toggles[item.value] ?? false}
            onCheckedChange={(checked) => handleToggle(item, checked)}
            size="sm"
          />
        </div>
      );
    }

    if (!inSubmenu && item.items && item.items.length > 0) {
      return (
        <button
          className="relative isolate flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm"
          key={item.value}
          onClick={() => openSub(item.value)}
          onMouseEnter={() => setHoveredValue(item.value)}
          type="button"
        >
          {hoverHighlight(item.value)}
          <div className="flex items-center gap-3">
            <PlusMenuIcon icon={item.icon} />
            {item.label}
          </div>
          <ChevronRight
            aria-hidden="true"
            className="size-3.5 text-foreground/40"
          />
        </button>
      );
    }

    return (
      <button
        className="relative isolate flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm"
        key={item.value}
        onClick={() => handleAction(item)}
        onMouseEnter={() => setHoveredValue(item.value)}
        type="button"
      >
        {hoverHighlight(item.value)}
        <div className="flex items-center gap-3">
          <PlusMenuIcon icon={item.icon} />
          {item.label}
        </div>
        {item.shortcut ? (
          <span className="shrink-0 text-muted-foreground text-xs">
            {item.shortcut}
          </span>
        ) : null}
      </button>
    );
  };

  const activeParent = activeSubmenu
    ? items.find((item) => item.value === activeSubmenu)
    : undefined;

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="More options"
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-foreground/70 transition-colors hover:text-foreground sm:size-9"
        onClick={handleOpen}
        type="button"
      >
        <Plus aria-hidden="true" className="size-4" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-label="More options"
            className={`absolute left-0 z-50 w-max min-w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border bg-card p-1 shadow-[0_10px_28px_-18px_rgba(0,0,0,0.25)] ${upward ? "bottom-full mb-2 origin-bottom-left" : "top-full mt-2 origin-top-left"}`}
            exit={{ opacity: 0, scale: 0.97, y: upward ? 4 : -4 }}
            initial={{ opacity: 0, scale: 0.96, y: upward ? 6 : -6 }}
            onMouseLeave={() => setHoveredValue(null)}
            role="menu"
            transition={{ duration: 0.16, ease: "easeOut" }}
          >
            <AnimatePresence custom={slideDir} initial={false} mode="wait">
              {activeParent ? (
                <motion.div
                  animate="visible"
                  custom={slideDir}
                  exit="exit"
                  initial="enter"
                  key={activeParent.value}
                  transition={{ duration: 0.13, ease: "easeOut" }}
                  variants={plusSlideVariants}
                >
                  <button
                    className="relative isolate flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-medium text-sm"
                    onClick={closeSub}
                    onMouseEnter={() => setHoveredValue("__back")}
                    type="button"
                  >
                    {hoverHighlight("__back")}
                    <ChevronLeft
                      aria-hidden="true"
                      className="size-4 shrink-0 text-muted-foreground"
                    />
                    {activeParent.label}
                  </button>
                  <div className="mx-1 my-0.5 h-px bg-border" />
                  {(activeParent.items ?? []).map((item) =>
                    renderItem(item, true)
                  )}
                </motion.div>
              ) : (
                <motion.div
                  animate="visible"
                  custom={slideDir}
                  exit="exit"
                  initial="enter"
                  key="main"
                  transition={{ duration: 0.13, ease: "easeOut" }}
                  variants={plusSlideVariants}
                >
                  {items.map((item) => renderItem(item, false))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// ─── Public component ────────────────────────────────────────────────────────

export type AIInputProps = {
  /** Options for the agent chip on the left. */
  agents?: AIInputOption[];
  defaultAgent?: string;
  /** Setting groups for the settings dropdown (model, effort, etc.). */
  settingGroups?: PromptSettingGroup[];
  defaultSettings?: Record<string, string>;
  /** Action items shown at the top of the settings dropdown. */
  menuActions?: PromptMenuAction[];
  /** Items for the plus menu: actions, toggles, separators, and one-level submenus. */
  menuItems?: AIInputMenuItem[];
  placeholder?: string;
  /** Render sent messages as chat bubbles above the composer. */
  showMessages?: boolean;
  onSend?: (
    message: string,
    meta: { agent: string; settings: Record<string, string> }
  ) => void;
  onMicClick?: () => void;
  /** Fired when the plus button is clicked and no menuItems are provided. */
  onPlusClick?: () => void;
  /** Fired when an action item (or submenu item) is selected in the plus menu. */
  onMenuSelect?: (value: string) => void;
  /** Fired when a toggle item in the plus menu changes. */
  onMenuToggle?: (value: string, checked: boolean) => void;
  /** Fired when the agent chip selection changes. */
  onAgentChange?: (value: string) => void;
  /** Fired when any setting in the settings dropdown changes. */
  onSettingsChange?: (settings: Record<string, string>) => void;
  className?: string;
};

export function AIInput({
  agents = [],
  defaultAgent,
  settingGroups = [],
  defaultSettings,
  menuActions = [],
  menuItems = [],
  placeholder = "Ask for follow-up changes",
  showMessages = true,
  onSend,
  onMicClick,
  onPlusClick,
  onMenuSelect,
  onMenuToggle,
  onAgentChange,
  onSettingsChange,
  className,
}: AIInputProps) {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<AIInputMessage[]>([]);
  const [waveRun, setWaveRun] = useState(0);
  const [agent, setAgent] = useState(
    () => defaultAgent ?? agents[0]?.value ?? ""
  );
  const [internalSettings, setInternalSettings] = useState(() =>
    getDefaultSettings(settingGroups, defaultSettings)
  );
  const nextMessageIdRef = useRef(0);
  const waveTimeoutRef = useRef<number | undefined>(undefined);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const hasValue = value.trim() !== "";

  useEffect(() => () => window.clearTimeout(waveTimeoutRef.current), []);

  const syncHeight = useCallback(() => {
    const element = textareaRef.current;
    if (!element) return;

    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed === "") return;

    nextMessageIdRef.current += 1;
    setMessages((previous) => [
      ...previous,
      { id: nextMessageIdRef.current, text: trimmed },
    ]);
    onSend?.(trimmed, { agent, settings: internalSettings });
    setValue("");

    requestAnimationFrame(() => {
      const element = textareaRef.current;
      if (element) element.style.height = "auto";

      messagesRef.current?.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    });

    setWaveRun((run) => run + 1);
    window.clearTimeout(waveTimeoutRef.current);
    waveTimeoutRef.current = window.setTimeout(() => {
      setWaveRun(0);
    }, WAVE_DURATION_MS);
  }, [agent, internalSettings, onSend, reducedMotion, value]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className={`w-full ${className ?? ""}`}>
      {showMessages && messages.length > 0 ? (
        <div
          className="mb-4 flex max-h-72 flex-col gap-2 overflow-y-auto overscroll-contain px-1 py-1"
          ref={messagesRef}
        >
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="max-w-[85%] self-end whitespace-pre-wrap break-words rounded-3xl rounded-br-lg bg-muted px-4 py-2.5 text-[15px] text-foreground leading-relaxed sm:text-sm"
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                key={message.id}
                layout="position"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              >
                {message.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : null}

      <div className="@container relative rounded-[28px] border border-border bg-card shadow-[0_10px_26px_-22px_rgba(0,0,0,0.14)]">
        <AnimatePresence>
          {waveRun > 0 ? (
            <SendWave
              key={`send-wave-${waveRun}`}
              reducedMotion={reducedMotion}
            />
          ) : null}
        </AnimatePresence>

        <InputPrimitive
          aria-label="Message"
          className="block max-h-[132px] w-full resize-none bg-transparent px-4 pt-4 pb-1 text-base text-foreground leading-6 outline-none placeholder:text-muted-foreground sm:px-5 sm:text-sm"
          onValueChange={(next) => {
            setValue(next);
            syncHeight();
          }}
          placeholder={placeholder}
          render={
            <textarea onKeyDown={handleKeyDown} ref={textareaRef} rows={1} />
          }
          value={value}
        />

        <div className="flex items-center gap-1.5 px-2.5 pt-1 pb-2.5 sm:gap-2 sm:px-3 sm:pb-3">
          {menuItems.length > 0 ? (
            <PlusMenu
              items={menuItems}
              onSelect={onMenuSelect}
              onToggle={onMenuToggle}
            />
          ) : (
            <button
              aria-label="Add attachment"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-foreground/70 transition-colors hover:text-foreground sm:size-9"
              onClick={onPlusClick}
              type="button"
            >
              <Plus aria-hidden="true" className="size-4" />
            </button>
          )}

          {agents.length > 0 ? (
            <OptionMenu
              ariaLabel="Select agent"
              chipClassName="flex w-full min-w-14 items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 font-medium text-foreground text-sm transition-colors hover:bg-accent sm:px-3.5 sm:py-2"
              onChange={(next) => {
                setAgent(next);
                onAgentChange?.(next);
              }}
              options={agents}
              value={agent}
            />
          ) : null}

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5">
            {settingGroups.length > 0 || menuActions.length > 0 ? (
              <SettingsDropdown
                groups={settingGroups}
                menuActions={menuActions}
                onValueChange={(groupId, val) => {
                  const next = { ...internalSettings, [groupId]: val };
                  setInternalSettings(next);
                  onSettingsChange?.(next);
                }}
                values={internalSettings}
              />
            ) : null}

            <button
              aria-label="Use voice input"
              className="@[21rem]:flex hidden size-8 shrink-0 items-center justify-center rounded-full text-foreground/60 transition-colors hover:text-foreground sm:size-9"
              onClick={onMicClick}
              type="button"
            >
              <Mic aria-hidden="true" className="size-[18px]" />
            </button>

            <button
              aria-label="Send message"
              className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-[background-color,opacity,transform] sm:size-9 ${hasValue ? "bg-foreground text-background hover:opacity-90" : "cursor-default bg-muted-foreground/50 text-background"}`}
              disabled={!hasValue}
              onClick={handleSend}
              type="button"
            >
              <ArrowUp
                aria-hidden="true"
                className="size-4"
                strokeWidth={2.25}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
