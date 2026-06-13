"use client";

import { Input as InputPrimitive } from "@base-ui/react/input";
import { Check, ChevronRight } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import {
  Fragment,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

const TRANSITION = {
  type: "spring" as const,
  stiffness: 380,
  damping: 34,
};

const COLLAPSED_HEIGHT = 48;
const MIN_EXPANDED_HEIGHT = 113;
const MAX_EXPANDED_HEIGHT = 300;
const FOOTER_HEIGHT = 46;
const MIN_TEXTAREA_PANEL_HEIGHT = MIN_EXPANDED_HEIGHT - FOOTER_HEIGHT;
const MAX_TEXTAREA_PANEL_HEIGHT = MAX_EXPANDED_HEIGHT - FOOTER_HEIGHT;

const promptFieldClassName =
  "w-full border-0 bg-transparent text-sm leading-[17px] text-foreground shadow-none outline-none placeholder:font-medium placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none focus-visible:ring-0";

const promptFieldCollapsedClassName = `absolute inset-x-0 top-0 ${promptFieldClassName}`;

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

export type PromptPlusMenuOption = {
  value: string;
  label: string;
};

export type PromptPlusMenuItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  onSelect?: () => void;
  options?: PromptPlusMenuOption[];
  onOptionSelect?: (value: string) => void;
};

function getDefaultSettings(
  groups: PromptSettingGroup[],
  defaults?: Record<string, string>
) {
  return groups.reduce<Record<string, string>>((settings, group) => {
    const preferred = defaults?.[group.id];
    const hasPreferred = group.options.some(
      (option) => option.value === preferred
    );

    settings[group.id] =
      hasPreferred && preferred ? preferred : (group.options[0]?.value ?? "");

    return settings;
  }, {});
}

function getOptionLabel(group: PromptSettingGroup, value: string) {
  return group.options.find((option) => option.value === value)?.label ?? value;
}

function getSelectedOption(group: PromptSettingGroup, value: string) {
  return group.options.find((option) => option.value === value);
}

const dropdownPanelClassName =
  "fixed z-[400] w-[min(17rem,calc(100vw-1.5rem))] overflow-y-auto overscroll-contain rounded-2xl border border-border/60 bg-card py-1.5 text-sm shadow-[0_10px_28px_-20px_rgba(0,0,0,0.14)] outline-none [-webkit-overflow-scrolling:touch]";

const DROPDOWN_SIDE_OFFSET = 8;
const DROPDOWN_VIEWPORT_MARGIN = 12;
const DROPDOWN_SUBMENU_OFFSET = 4;
const DROPDOWN_PANEL_WIDTH = 272;
const DROPDOWN_ESTIMATED_HEIGHT = 280;
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
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }

  return "medium";
}

function getEffortGroupId(groups: PromptSettingGroup[]) {
  return (
    groups.find((group) => group.id === "effort")?.id ??
    groups.find((group) => group.display === "submenu")?.id
  );
}

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
          transition={TRANSITION}
          width={BAR_WIDTH}
          x={BAR_XS[index]}
        />
      ))}
    </svg>
  );
}

const dropdownSubmenuTriggerClassName =
  "relative flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm outline-none transition-colors focus-visible:outline-none";

function DropdownFeaturedRow({
  description,
  label,
}: {
  description?: string;
  label: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 px-3 py-3">
      <div className="min-w-0">
        <p className="font-medium text-foreground leading-tight">{label}</p>
        {description ? (
          <p className="mt-1 text-muted-foreground text-xs leading-snug">
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
  "relative flex min-h-11 w-full cursor-pointer scroll-m-1 touch-manipulation items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm outline-none transition-colors focus-visible:text-foreground focus-visible:outline-none";

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

function getMainDropdownMotion(side: DropdownSide) {
  const offsetY = side === "bottom" ? -10 : 10;

  return {
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      y: offsetY * 0.65,
    },
    initial: {
      opacity: 0,
      scale: 0.96,
      y: offsetY,
    },
    transition: dropdownPanelSpring,
  };
}

function getMainDropdownInnerMotion(side: DropdownSide) {
  const offsetY = side === "bottom" ? 5 : -5;

  return {
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: offsetY * 0.5 },
    initial: { opacity: 0, y: offsetY },
    transition: {
      duration: 0.22,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  };
}

function getFlyoutSubmenuMotion(origin: SubmenuOrigin) {
  const offsetX = origin === "right" ? -12 : 12;

  return {
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      x: offsetX * 0.55,
    },
    initial: {
      opacity: 0,
      scale: 0.96,
      x: offsetX,
    },
    transition: dropdownPanelSpring,
  };
}

function getInlineSubmenuMotion() {
  return {
    animate: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
    initial: { height: 0, opacity: 0 },
    transition: {
      opacity: { duration: 0.16, ease: "easeOut" as const },
      height: dropdownPanelSpring,
    },
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

    return {
      left,
      maxHeight,
      origin: "below" as const,
      top,
    };
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
          initial={{ opacity: 0, scale: 0.78, y: 1 }}
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
  icon?: React.ReactNode;
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
  const inlineSubmenuMotion = getInlineSubmenuMotion();

  return (
    <AnimatePresence initial={false}>
      {isOpen ? (
        <motion.div
          animate={inlineSubmenuMotion.animate}
          className="overflow-hidden"
          exit={inlineSubmenuMotion.exit}
          initial={inlineSubmenuMotion.initial}
          transition={inlineSubmenuMotion.transition}
        >
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            initial={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-1 pb-1">{submenuOptions}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
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

  const submenuOptions = (
    <div className="space-y-0.5">
      {group.options.map((option) => (
        <DropdownOption
          activeItemId={activeItemId}
          highlightLayoutId={submenuHighlightLayoutId}
          key={option.value}
          label={option.label}
          onSelect={() => onSelect(option.value)}
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

type DropdownSide = "top" | "bottom";

type DropdownPosition = {
  left: number;
  side: DropdownSide;
  top?: number;
  bottom?: number;
  maxHeight: number;
};

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

function SettingsDropdown({
  groups,
  values,
  menuActions = [],
  onOpenChange,
  onValueChange,
}: {
  groups: PromptSettingGroup[];
  values: Record<string, string>;
  menuActions?: PromptMenuAction[];
  onOpenChange: (open: boolean) => void;
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
  const mounted = useIsMounted();

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      onOpenChange(nextOpen);

      if (!nextOpen) {
        setActiveItemId(null);
        setOpenSubmenuId(null);
      }
    },
    [onOpenChange]
  );

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const triggerRect = trigger.getBoundingClientRect();
    const panel = panelRef.current;
    const panelHeight = panel?.offsetHeight ?? DROPDOWN_ESTIMATED_HEIGHT;
    const panelWidth = panel?.offsetWidth ?? DROPDOWN_PANEL_WIDTH;

    setPosition(
      getDropdownPosition({
        panelHeight,
        panelWidth,
        triggerRect,
      })
    );
  }, []);

  useLayoutEffect(() => {
    if (!open) return;

    updatePosition();

    const panel = panelRef.current;
    let observer: ResizeObserver | undefined;

    if (panel) {
      observer = new ResizeObserver(() => {
        updatePosition();
      });
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
  const mainDropdownMotion = getMainDropdownMotion(position.side);
  const mainDropdownInnerMotion = getMainDropdownInnerMotion(position.side);

  return (
    <>
      <button
        aria-expanded={open}
        aria-haspopup="dialog"
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
                              onValueChange(group.id, value);
                              handleOpenChange(false);
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
                              onValueChange(group.id, value);
                              handleOpenChange(false);
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

function PlusMenuDropdown({
  items,
  onOpenChange,
}: {
  items: PromptPlusMenuItem[];
  onOpenChange: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const highlightLayoutId = useId();
  const prefersHover = usePrefersHover();
  const [position, setPosition] = useState<DropdownPosition>({
    left: 0,
    maxHeight: DROPDOWN_ESTIMATED_HEIGHT,
    side: "top",
    top: 0,
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const mounted = useIsMounted();

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      onOpenChange(nextOpen);

      if (!nextOpen) {
        setActiveItemId(null);
        setOpenSubmenuId(null);
      }
    },
    [onOpenChange]
  );

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const triggerRect = trigger.getBoundingClientRect();
    const panel = panelRef.current;
    const panelHeight = panel?.offsetHeight ?? DROPDOWN_ESTIMATED_HEIGHT;
    const panelWidth = panel?.offsetWidth ?? DROPDOWN_PANEL_WIDTH;

    setPosition(
      getDropdownPosition({
        align: "end",
        panelHeight,
        panelWidth,
        triggerRect,
      })
    );
  }, []);

  useLayoutEffect(() => {
    if (!open) return;

    updatePosition();

    const panel = panelRef.current;
    let observer: ResizeObserver | undefined;

    if (panel) {
      observer = new ResizeObserver(updatePosition);
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

  const mainDropdownMotion = getMainDropdownMotion(position.side);
  const mainDropdownInnerMotion = getMainDropdownInnerMotion(position.side);

  return (
    <>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Add attachment"
        className={`mr-9 ml-auto flex items-center justify-center rounded-full py-1 transition-colors ${open ? "text-foreground" : "text-foreground/50 hover:text-foreground"}`}
        onClick={toggleOpen}
        onMouseDown={(event) => event.preventDefault()}
        ref={triggerRef}
        type="button"
      >
        <PlusIcon />
      </button>
      {mounted &&
        createPortal(
          <AnimatePresence initial={false}>
            {open ? (
              <motion.div
                animate={mainDropdownMotion.animate}
                aria-label="Add options"
                className={dropdownPanelClassName}
                data-prompt-dropdown-panel=""
                exit={mainDropdownMotion.exit}
                initial={mainDropdownMotion.initial}
                key="prompt-plus-dropdown"
                ref={panelRef}
                role="menu"
                style={{
                  left: position.left,
                  maxHeight: position.maxHeight,
                  transformOrigin:
                    position.side === "bottom" ? "top right" : "bottom right",
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
                    {items.map((item) => {
                      if (item.options?.length) {
                        const group: PromptSettingGroup = {
                          id: item.id,
                          label: item.label,
                          display: "submenu",
                          options: item.options.map((option) => ({
                            value: option.value,
                            label: option.label,
                          })),
                        };

                        return (
                          <DropdownSubmenu
                            activeItemId={activeItemId}
                            group={group}
                            highlightLayoutId={highlightLayoutId}
                            icon={item.icon}
                            isOpen={openSubmenuId === item.id}
                            key={item.id}
                            onOpenChange={(nextOpen) => {
                              setOpenSubmenuId(nextOpen ? item.id : null);
                            }}
                            onSelect={(value) => {
                              item.onOptionSelect?.(value);
                              handleOpenChange(false);
                            }}
                            selectedValue=""
                            setActiveItemId={setActiveItemId}
                            submenuHighlightLayoutId={`${highlightLayoutId}-${item.id}-sub`}
                            submenuId={item.id}
                            triggerLabel={item.label}
                          />
                        );
                      }

                      return (
                        <DropdownActionItem
                          activeItemId={activeItemId}
                          highlightLayoutId={`${highlightLayoutId}-plus-${item.id}`}
                          icon={item.icon}
                          key={item.id}
                          label={item.label}
                          onSelect={() => {
                            item.onSelect?.();
                            handleOpenChange(false);
                          }}
                          setActiveItemId={setActiveItemId}
                          shortcut={item.shortcut}
                        />
                      );
                    })}
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

function ArrowUpIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="12"
      viewBox="0 0 14 14"
      width="12"
    >
      <path
        d="M7 12V2M7 2L2.5 6.5M7 2L11.5 6.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="13"
      viewBox="0 0 14 14"
      width="13"
    >
      <rect
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        width="4"
        x="5"
        y="1"
      />
      <path
        d="M2.75 6.5V7a4.25 4.25 0 0 0 8.5 0v-.5M7 11.25V13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="14"
      viewBox="0 0 14 14"
      width="14"
    >
      <path
        d="M7 2.5V11.5M2.5 7H11.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export type PromptInputProps = {
  onSubmit?: (value: string) => void;
  placeholder?: string;
  menuActions?: PromptMenuAction[];
  plusMenuItems?: PromptPlusMenuItem[];
  settingGroups?: PromptSettingGroup[];
  settings?: Record<string, string>;
  defaultSettings?: Record<string, string>;
  onSettingsChange?: (settings: Record<string, string>) => void;
};

export function PromptInput({
  onSubmit,
  placeholder,
  menuActions = [],
  plusMenuItems = [],
  settingGroups = [],
  settings: settingsProp,
  defaultSettings,
  onSettingsChange,
}: PromptInputProps) {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState("");
  const valueRef = useRef(value);
  valueRef.current = value;
  const [internalSettings, setInternalSettings] = useState(() =>
    getDefaultSettings(settingGroups, defaultSettings)
  );
  const isSettingsControlled = settingsProp !== undefined;
  const settings = isSettingsControlled ? settingsProp : internalSettings;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);
  const settingsOpenRef = useRef(settingsOpen);
  const plusOpenRef = useRef(plusOpen);
  settingsOpenRef.current = settingsOpen;
  plusOpenRef.current = plusOpen;
  const [expandedHeight, setExpandedHeight] = useState(MIN_EXPANDED_HEIGHT);
  const hasValue = value.trim() !== "";
  const inputRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaPanelHeight = expandedHeight - FOOTER_HEIGHT;
  const isPanelScrollable = textareaPanelHeight >= MAX_TEXTAREA_PANEL_HEIGHT;
  const showSettings = settingGroups.length > 0 || menuActions.length > 0;

  const updateSettings = useCallback(
    (groupId: string, nextValue: string) => {
      const nextSettings = { ...settings, [groupId]: nextValue };

      if (!isSettingsControlled) {
        setInternalSettings(nextSettings);
      }

      onSettingsChange?.(nextSettings);
    },
    [isSettingsControlled, onSettingsChange, settings]
  );

  useEffect(() => {
    if (isSettingsControlled) return;

    setInternalSettings((previous) => {
      const defaults = getDefaultSettings(settingGroups, defaultSettings);
      const next = { ...defaults };

      for (const group of settingGroups) {
        const previousValue = previous[group.id];
        const isValid = group.options.some(
          (option) => option.value === previousValue
        );

        if (isValid && previousValue) {
          next[group.id] = previousValue;
        }
      }

      return next;
    });
  }, [defaultSettings, isSettingsControlled, settingGroups]);

  const syncExpandedHeight = useCallback(() => {
    const element = inputRef.current;
    if (!(element instanceof HTMLTextAreaElement)) return;

    element.style.height = "auto";
    const contentHeight = element.scrollHeight;
    const nextPanelHeight = Math.min(
      MAX_TEXTAREA_PANEL_HEIGHT,
      Math.max(MIN_TEXTAREA_PANEL_HEIGHT, contentHeight)
    );

    setExpandedHeight(nextPanelHeight + FOOTER_HEIGHT);

    if (nextPanelHeight >= MAX_TEXTAREA_PANEL_HEIGHT) {
      element.style.height = "100%";
      return;
    }

    element.style.height = `${contentHeight}px`;
  }, []);

  useLayoutEffect(() => {
    if (!expanded) {
      setExpandedHeight(MIN_EXPANDED_HEIGHT);
      return;
    }

    const frame = requestAnimationFrame(() => {
      syncExpandedHeight();
    });

    return () => cancelAnimationFrame(frame);
  }, [expanded, syncExpandedHeight]);

  const handleValueChange = useCallback(
    (nextValue: string) => {
      setValue(nextValue);

      if (!expanded) return;

      requestAnimationFrame(() => {
        syncExpandedHeight();
      });
    },
    [expanded, syncExpandedHeight]
  );

  const expand = () => {
    setExpanded(true);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const maybeCollapse = useCallback(() => {
    requestAnimationFrame(() => {
      if (settingsOpenRef.current || plusOpenRef.current) return;
      if (valueRef.current.trim() !== "") return;

      const active = document.activeElement;
      if (active instanceof Element) {
        if (isInsideDropdownPanel(active)) return;
        if (containerRef.current?.contains(active)) return;
      }

      setExpanded(false);
    });
  }, []);

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const related = event.relatedTarget as Node | null;

      if (related instanceof Element) {
        if (isInsideDropdownPanel(related)) return;
        if (containerRef.current?.contains(related)) return;
      }

      maybeCollapse();
    },
    [maybeCollapse]
  );

  const handleSubmit = useCallback(() => {
    if (settingsOpenRef.current || plusOpenRef.current) return;
    if (value.trim() === "") return;

    onSubmit?.(value);
    setValue("");
    setExpanded(false);
  }, [onSubmit, value]);

  const handleTextareaKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSubmit();
        return;
      }

      if (event.key === "Escape") {
        if (settingsOpenRef.current || plusOpenRef.current) return;
        if (value.trim() === "") {
          setExpanded(false);
        }
      }
    },
    [handleSubmit, value]
  );

  useEffect(() => {
    if (!expanded) {
      setSettingsOpen(false);
      setPlusOpen(false);
    }
  }, [expanded]);

  return (
    <motion.div
      animate={{
        maxWidth: expanded ? 440 : 320,
        height: expanded ? expandedHeight : COLLAPSED_HEIGHT,
      }}
      className="relative mx-auto w-full overflow-hidden border border-border bg-card"
      data-prompt-input-root=""
      initial={false}
      onBlur={handleBlur}
      ref={containerRef}
      style={{ borderRadius: 24 }}
      transition={TRANSITION}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {expanded ? (
          <motion.div
            className="absolute inset-x-0 top-0"
            key="textarea"
            style={{ height: textareaPanelHeight }}
          >
            <InputPrimitive
              aria-label="Prompt"
              className="relative h-full w-full"
              onValueChange={handleValueChange}
              placeholder={placeholder}
              ref={inputRef}
              render={(props) => (
                <textarea
                  {...props}
                  className={`${props.className ?? ""} ${promptFieldClassName} block h-full min-h-0 w-full resize-none pt-4 pr-14 pl-5 leading-[17px] outline-none ${isPanelScrollable ? "overflow-y-auto overscroll-contain" : "overflow-hidden"}`}
                  onKeyDown={(event) => {
                    props.onKeyDown?.(event);
                    handleTextareaKeyDown(event);
                  }}
                />
              )}
              value={value}
            />
          </motion.div>
        ) : (
          <motion.div className="absolute inset-x-0 top-0" key="placeholder">
            <InputPrimitive
              aria-label="Open prompt input"
              className={`${promptFieldCollapsedClassName} cursor-text px-5 py-[15.5px] font-medium text-muted-foreground`}
              onMouseDown={(event) => {
                event.preventDefault();
                expand();
              }}
              placeholder={placeholder}
              readOnly
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer is pinned at its final position from the top — it never moves
          as the surface grows; the container edge sweeps over and reveals it. */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            animate={{
              opacity: 1,
              transition: { duration: 0.2, delay: 0.08, ease: "easeOut" },
            }}
            className="absolute inset-x-0 flex translate-y-px items-center gap-5 px-5 pt-2"
            exit={{
              opacity: 0,
              transition: { duration: 0.16, ease: "easeIn" },
            }}
            initial={{ opacity: 0 }}
            style={{ top: textareaPanelHeight }}
          >
            {showSettings ? (
              <SettingsDropdown
                groups={settingGroups}
                menuActions={menuActions}
                onOpenChange={(nextOpen) => {
                  setSettingsOpen(nextOpen);
                  if (nextOpen) {
                    setPlusOpen(false);
                    return;
                  }
                  maybeCollapse();
                }}
                onValueChange={updateSettings}
                values={settings}
              />
            ) : null}
            {plusMenuItems.length > 0 ? (
              <PlusMenuDropdown
                items={plusMenuItems}
                onOpenChange={(nextOpen) => {
                  setPlusOpen(nextOpen);
                  if (nextOpen) {
                    setSettingsOpen(false);
                    return;
                  }
                  maybeCollapse();
                }}
              />
            ) : (
              <button
                aria-label="Add attachment"
                className="mr-9 ml-auto flex items-center justify-center rounded-full py-1 text-foreground/50 transition-colors hover:text-foreground"
                type="button"
              >
                <PlusIcon />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Send button — visible only when expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.button
            animate={{ opacity: 1, scale: 1 }}
            aria-label={hasValue ? "Send prompt" : "Use voice input"}
            className="absolute right-2 bottom-2 flex size-8 items-center justify-center bg-accent text-accent-foreground transition-opacity hover:opacity-90"
            exit={{ opacity: 0, scale: 0.85 }}
            initial={{ opacity: 0, scale: 0.85 }}
            key="send"
            onClick={handleSubmit}
            style={{ borderRadius: 9999 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            type="button"
          >
            <AnimatePresence initial={false} mode="popLayout">
              {hasValue ? (
                <motion.span
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center"
                  exit={{ opacity: 0, scale: 0.5 }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  key="arrow"
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  <ArrowUpIcon />
                </motion.span>
              ) : (
                <motion.span
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center"
                  exit={{ opacity: 0, scale: 0.5 }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  key="mic"
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  <MicIcon />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
