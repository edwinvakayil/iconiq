"use client";

import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  isWithinInterval,
  type Locale,
  setMonth,
  setYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type CSSProperties,
  forwardRef,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-primary-foreground:#ffffff] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-primary-foreground:var(--ic-primary-foreground)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-primary-foreground:#111111] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const controlCornerClassName =
  "supports-[corner-shape:squircle]:corner-squircle";

const focusVisibleClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ic-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ic-card)]";

const SPRING_EASE: [number, number, number, number] = [0.34, 1.56, 0.64, 1];
const SMOOTH_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const WEEK_LENGTH = 7;
const FIXED_WEEK_COUNT = 6;
const YEAR_GRID_SIZE = 12;
const MONTH_GRID_COLS = 3;
const MAX_DISABLED_SCAN = 366;

const MONTH_GRID_VARIANTS = {
  center: { opacity: 1, scale: 1, x: 0 },
  enter: (direction: number) => ({
    opacity: 0,
    scale: 0.985,
    x: direction === 0 ? 0 : direction * 14,
  }),
  exit: (direction: number) => ({
    opacity: 0,
    scale: 0.985,
    x: direction === 0 ? 0 : direction * -14,
  }),
};

type CalendarSize = "sm" | "md" | "lg";
type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type CalendarMode = "single" | "range";

export type CalendarRange = {
  from?: Date;
  to?: Date;
};

export type CalendarLabels = {
  today: string;
  selected: string;
  outsideMonth: string;
  unavailable: string;
  noDateSelected: string;
  chooseMonth: string;
  chooseYear: string;
  previousMonth: string;
  nextMonth: string;
  previousYears: string;
  nextYears: string;
  selectMonth: string;
  selectYear: string;
  rangeStart: string;
  rangeEnd: string;
  rangeMiddle: string;
};

export const DEFAULT_CALENDAR_LABELS: CalendarLabels = {
  today: "Today",
  selected: "Selected",
  outsideMonth: "Outside current month",
  unavailable: "Unavailable",
  noDateSelected: "No date selected",
  chooseMonth: "Choose month",
  chooseYear: "Choose year",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  previousYears: "Previous years",
  nextYears: "Next years",
  selectMonth: "Select month",
  selectYear: "Select year",
  rangeStart: "Range start",
  rangeEnd: "Range end",
  rangeMiddle: "In selected range",
};

export interface CalendarProps {
  selected?: Date | null;
  defaultSelected?: Date | null;
  onSelect?: (date: Date | null) => void;
  range?: CalendarRange;
  defaultRange?: CalendarRange;
  onRangeSelect?: (range: CalendarRange) => void;
  mode?: CalendarMode;
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  disabled?: (date: Date) => boolean;
  locale?: Locale;
  labels?: Partial<CalendarLabels>;
  size?: CalendarSize;
  weekStartsOn?: WeekStartsOn;
  minYear?: number;
  maxYear?: number;
  minDate?: Date;
  maxDate?: Date;
  showOutsideDays?: boolean;
  fixedWeeks?: boolean;
  modifiers?: Record<string, (date: Date) => boolean>;
  modifierLabels?: Record<string, string>;
  className?: string;
  id?: string;
  name?: string;
}

type CalendarPalette = {
  cardBackground: string;
  cardBorder: string;
  cardShadow: string;
  textPrimary: string;
  textMuted: string;
  textDim: string;
  titleColor: string;
  navBackground: string;
  navForeground: string;
  navHoverBackground: string;
  dayHoverBackground: string;
  dayDisabledForeground: string;
  selectedGradient: string;
  selectedForeground: string;
  rangeBackground: string;
  todayBackground: string;
  focusRing: string;
  popoverBackground: string;
  popoverBorder: string;
  popoverShadow: string;
  pickerHoverBackground: string;
  modifierDot: string;
};

type CalendarDimensions = {
  cardPadding: number;
  cardRadius: number;
  dayCellFontSize: number;
  dayCellMinHeight: number;
  dayCellRadius: number;
  headerGap: number;
  monthFontSize: number;
  monthTopMargin: number;
  navButtonSize: number;
  navGap: number;
  navIconSize: number;
  tableCellPadding: number;
  tableHeaderFontSize: number;
  tableHeaderPaddingBottom: number;
  weekRowGap: number;
  maxWidth: number;
};

const CALENDAR_PALETTE: CalendarPalette = {
  cardBackground: "var(--ic-card)",
  cardBorder:
    "1px solid color-mix(in srgb, var(--ic-foreground) 4%, transparent)",
  cardShadow: "var(--ic-shadow-soft)",
  textPrimary: "var(--ic-foreground)",
  textMuted: "var(--ic-muted-foreground)",
  textDim: "color-mix(in srgb, var(--ic-muted-foreground) 68%, transparent)",
  titleColor: "var(--ic-foreground)",
  navBackground: "transparent",
  navForeground: "var(--ic-foreground)",
  navHoverBackground: "var(--ic-accent)",
  dayHoverBackground: "var(--ic-accent)",
  dayDisabledForeground: "var(--ic-muted-foreground)",
  selectedGradient: "var(--ic-primary)",
  selectedForeground: "var(--ic-primary-foreground)",
  rangeBackground: "color-mix(in srgb, var(--ic-primary) 14%, transparent)",
  todayBackground: "var(--ic-muted)",
  focusRing: "var(--ic-ring)",
  popoverBackground: "var(--ic-card)",
  popoverBorder:
    "1px solid color-mix(in srgb, var(--ic-foreground) 4%, transparent)",
  popoverShadow:
    "0 12px 32px -18px color-mix(in srgb, var(--ic-foreground) 18%, transparent)",
  pickerHoverBackground: "var(--ic-accent)",
  modifierDot: "var(--ic-brand)",
};

const CALENDAR_DIMENSIONS: Record<CalendarSize, CalendarDimensions> = {
  sm: {
    cardPadding: 8,
    cardRadius: 11,
    dayCellFontSize: 14,
    dayCellMinHeight: 28,
    dayCellRadius: 6,
    headerGap: 16,
    maxWidth: 212,
    monthFontSize: 14,
    monthTopMargin: 0,
    navButtonSize: 28,
    navGap: 4,
    navIconSize: 16,
    tableCellPadding: 0,
    tableHeaderFontSize: 12,
    tableHeaderPaddingBottom: 0,
    weekRowGap: 8,
  },
  md: {
    cardPadding: 8,
    cardRadius: 11,
    dayCellFontSize: 15,
    dayCellMinHeight: 32,
    dayCellRadius: 7,
    headerGap: 16,
    maxWidth: 240,
    monthFontSize: 15,
    monthTopMargin: 0,
    navButtonSize: 32,
    navGap: 6,
    navIconSize: 16,
    tableCellPadding: 0,
    tableHeaderFontSize: 13,
    tableHeaderPaddingBottom: 0,
    weekRowGap: 8,
  },
  lg: {
    cardPadding: 10,
    cardRadius: 14,
    dayCellFontSize: 16,
    dayCellMinHeight: 38,
    dayCellRadius: 8,
    headerGap: 16,
    maxWidth: 282,
    monthFontSize: 16,
    monthTopMargin: 0,
    navButtonSize: 38,
    navGap: 8,
    navIconSize: 18,
    tableCellPadding: 0,
    tableHeaderFontSize: 14,
    tableHeaderPaddingBottom: 0,
    weekRowGap: 8,
  },
};

const getDateKey = (date: Date) => format(date, "yyyy-MM-dd");

const getCalendarOptions = (locale?: Locale, weekStartsOn?: WeekStartsOn) =>
  weekStartsOn === undefined ? { locale } : { locale, weekStartsOn };

const createIsDateDisabled = ({
  disabled,
  minDate,
  maxDate,
}: {
  disabled?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
}) => {
  const min = minDate ? startOfDay(minDate) : undefined;
  const max = maxDate ? startOfDay(maxDate) : undefined;

  return (date: Date) => {
    const day = startOfDay(date);
    if (min && isBefore(day, min)) return true;
    if (max && isAfter(day, max)) return true;
    return disabled?.(date) ?? false;
  };
};

const findFirstInteractiveDay = (
  visibleMonth: Date,
  isDateDisabled: (date: Date) => boolean
) =>
  eachDayOfInterval({
    start: startOfMonth(visibleMonth),
    end: endOfMonth(visibleMonth),
  }).find((day) => !isDateDisabled(day)) ?? startOfMonth(visibleMonth);

const resolveFocusableDate = (
  visibleMonth: Date,
  preferredDate: Date | null | undefined,
  isDateDisabled: (date: Date) => boolean
) => {
  if (
    preferredDate &&
    isSameMonth(preferredDate, visibleMonth) &&
    !isDateDisabled(preferredDate)
  ) {
    return preferredDate;
  }
  const today = new Date();
  if (isSameMonth(today, visibleMonth) && !isDateDisabled(today)) {
    return today;
  }
  return findFirstInteractiveDay(visibleMonth, isDateDisabled);
};

const findInteractiveDate = (
  preferredDate: Date,
  step: 1 | -1,
  isDateDisabled: (date: Date) => boolean
) => {
  let candidate = preferredDate;
  for (let index = 0; index < MAX_DISABLED_SCAN; index += 1) {
    if (!isDateDisabled(candidate)) return candidate;
    candidate = addDays(candidate, step);
  }
  return preferredDate;
};

const normalizeRange = (range?: CalendarRange): CalendarRange => {
  const from = range?.from;
  const to = range?.to;
  if (!(from && to)) return { from, to };
  if (isBefore(startOfDay(from), startOfDay(to))) {
    return { from, to };
  }
  return { from: to, to: from };
};

const getRangeBounds = (range?: CalendarRange) => {
  const normalized = normalizeRange(range);
  if (!normalized.from) {
    return null;
  }
  const end = normalized.to ?? normalized.from;
  return {
    start: startOfDay(normalized.from),
    end: startOfDay(end),
  };
};

const getDayAriaLabel = ({
  day,
  locale,
  labels,
  today,
  isSelected,
  inMonth,
  isDisabled,
  rangeRole,
  modifierNames,
}: {
  day: Date;
  locale?: Locale;
  labels: CalendarLabels;
  today: boolean;
  isSelected: boolean;
  inMonth: boolean;
  isDisabled: boolean;
  rangeRole?: "start" | "end" | "middle" | null;
  modifierNames: string[];
}) => {
  const parts = [format(day, "PPPP", { locale })];
  if (today) parts.push(labels.today);
  if (isSelected) parts.push(labels.selected);
  if (rangeRole === "start") parts.push(labels.rangeStart);
  if (rangeRole === "end") parts.push(labels.rangeEnd);
  if (rangeRole === "middle") parts.push(labels.rangeMiddle);
  if (!inMonth) parts.push(labels.outsideMonth);
  else if (isDisabled) parts.push(labels.unavailable);
  if (modifierNames.length > 0) {
    parts.push(modifierNames.join(", "));
  }
  return parts.join(", ");
};

type DayCellStatus = {
  inMonth: boolean;
  isDisabled: boolean;
  isSelectable: boolean;
  isSelected: boolean;
  showTodayIndicator: boolean;
  today: boolean;
  rangeRole: "start" | "end" | "middle" | null;
  inRange: boolean;
};

const getDayCellStatus = ({
  currentMonth,
  day,
  isDateDisabled,
  selectedDate,
  rangeBounds,
  mode,
}: {
  currentMonth: Date;
  day: Date;
  isDateDisabled: (date: Date) => boolean;
  selectedDate: Date | null;
  rangeBounds: ReturnType<typeof getRangeBounds>;
  mode: CalendarMode;
}): DayCellStatus => {
  const inMonth = isSameMonth(day, currentMonth);
  const today = isToday(day);
  const isDisabled = isDateDisabled(day);
  const isSelectable = !isDisabled;

  let isSelected = false;
  let rangeRole: DayCellStatus["rangeRole"] = null;
  let inRange = false;

  if (mode === "range" && rangeBounds) {
    const dayStart = startOfDay(day);
    inRange = isWithinInterval(dayStart, {
      start: rangeBounds.start,
      end: rangeBounds.end,
    });
    if (inRange) {
      isSelected = true;
      if (isSameDay(day, rangeBounds.start)) rangeRole = "start";
      else if (isSameDay(day, rangeBounds.end)) rangeRole = "end";
      else rangeRole = "middle";
    }
  } else if (selectedDate) {
    isSelected = isSameDay(day, selectedDate);
  }

  return {
    inMonth,
    isDisabled,
    isSelectable,
    isSelected,
    showTodayIndicator: today && !isSelected && !isDisabled,
    today,
    rangeRole,
    inRange,
  };
};

const canNavigateToMonth = (
  targetMonth: Date,
  minDate?: Date,
  maxDate?: Date
) => {
  const monthStart = startOfMonth(targetMonth);
  const monthEnd = endOfMonth(targetMonth);
  if (minDate && isBefore(monthEnd, startOfDay(minDate))) return false;
  if (maxDate && isAfter(monthStart, startOfDay(maxDate))) return false;
  return true;
};

const isMonthIndexDisabled = (
  currentMonth: Date,
  monthIndex: number,
  minDate?: Date,
  maxDate?: Date
) => !canNavigateToMonth(setMonth(currentMonth, monthIndex), minDate, maxDate);

const getActiveModifiers = (
  day: Date,
  modifiers?: Record<string, (date: Date) => boolean>
) => {
  if (!modifiers) return [] as string[];
  return Object.entries(modifiers)
    .filter(([, matcher]) => matcher(day))
    .map(([key]) => key);
};

const moveGridIndex = (
  index: number,
  key: string,
  columns: number,
  itemCount: number
) => {
  if (key === "ArrowLeft") return Math.max(0, index - 1);
  if (key === "ArrowRight") return Math.min(itemCount - 1, index + 1);
  if (key === "ArrowUp") return Math.max(0, index - columns);
  if (key === "ArrowDown") return Math.min(itemCount - 1, index + columns);
  if (key === "Home") return 0;
  if (key === "End") return itemCount - 1;
  return index;
};

const getSyncedFocusedDate = ({
  currentMonth,
  focusedDate,
  isDateDisabled,
  mode,
  rangeBounds,
  selectedDate,
}: {
  currentMonth: Date;
  focusedDate: Date;
  isDateDisabled: (date: Date) => boolean;
  mode: CalendarMode;
  rangeBounds: ReturnType<typeof getRangeBounds>;
  selectedDate: Date | null;
}) => {
  if (mode === "single") {
    if (
      selectedDate &&
      isSameMonth(selectedDate, currentMonth) &&
      !isDateDisabled(selectedDate) &&
      !isSameDay(selectedDate, focusedDate)
    ) {
      return selectedDate;
    }
  } else if (rangeBounds) {
    const anchor = rangeBounds.end;
    if (
      isSameMonth(anchor, currentMonth) &&
      !isDateDisabled(anchor) &&
      !isSameDay(anchor, focusedDate)
    ) {
      return anchor;
    }
  }

  const focusOk =
    isSameMonth(focusedDate, currentMonth) && !isDateDisabled(focusedDate);
  if (focusOk) return focusedDate;

  const preferred =
    mode === "single" ? selectedDate : (rangeBounds?.end ?? rangeBounds?.start);
  return resolveFocusableDate(currentMonth, preferred, isDateDisabled);
};

const applyRangeDaySelection = (
  day: Date,
  selectedRange: CalendarRange
): CalendarRange => {
  const current = normalizeRange(selectedRange);
  if (!current.from || (current.from && current.to)) {
    return { from: day, to: undefined };
  }
  if (isSameDay(day, current.from)) {
    return { from: day, to: day };
  }
  if (isBefore(startOfDay(day), startOfDay(current.from))) {
    return { from: day, to: current.from };
  }
  return { from: current.from, to: day };
};

const trapPickerTabKey = (
  event: globalThis.KeyboardEvent,
  pickerEl: HTMLDivElement
) => {
  if (event.key !== "Tab") return;

  const focusable = Array.from(
    pickerEl.querySelectorAll<HTMLButtonElement>("button:not([disabled])")
  );
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable.at(-1);
  if (!(first && last)) return;

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

const DayCellMarkup = ({
  activeModifierKeys,
  calendarMotionId,
  day,
  dimensions,
  palette,
  reduceMotion,
  showEndpointHighlight,
  status,
  useSelectionLayout,
}: {
  activeModifierKeys: string[];
  calendarMotionId: string;
  day: Date;
  dimensions: CalendarDimensions;
  palette: CalendarPalette;
  reduceMotion: boolean | null;
  showEndpointHighlight: boolean;
  status: DayCellStatus;
  useSelectionLayout: boolean;
}) => (
  <>
    {status.inRange && status.rangeRole === "middle" ? (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: palette.rangeBackground,
          zIndex: 0,
        }}
      />
    ) : null}
    {status.showTodayIndicator ? (
      <motion.div
        className={controlCornerClassName}
        layoutId={reduceMotion ? undefined : `${calendarMotionId}-today-dot`}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: dimensions.dayCellRadius,
          background: palette.todayBackground,
        }}
      />
    ) : null}
    {showEndpointHighlight ? (
      <motion.div
        className={controlCornerClassName}
        layoutId={
          useSelectionLayout ? `${calendarMotionId}-selected-day` : undefined
        }
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: dimensions.dayCellRadius,
          background: palette.selectedGradient,
          zIndex: 1,
        }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 400, damping: 30 }
        }
      />
    ) : null}
    <span
      style={{
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        color: showEndpointHighlight ? palette.selectedForeground : undefined,
        fontWeight: showEndpointHighlight ? 600 : undefined,
      }}
    >
      {format(day, "d")}
      {activeModifierKeys.length > 0 ? (
        <span aria-hidden style={{ display: "flex", gap: 2 }}>
          {activeModifierKeys.slice(0, 3).map((key) => (
            <span
              key={key}
              style={{
                width: 4,
                height: 4,
                borderRadius: 999,
                background: palette.modifierDot,
              }}
            />
          ))}
        </span>
      ) : null}
    </span>
  </>
);

const CalendarHeader = ({
  canGoNext,
  canGoPrev,
  currentMonth,
  dimensions,
  headingId,
  labels,
  locale,
  monthPickerId,
  monthTriggerRef,
  onNext,
  onOpenPicker,
  onPrev,
  palette,
  picker,
  yearPickerId,
  yearTriggerRef,
}: {
  canGoNext: boolean;
  canGoPrev: boolean;
  currentMonth: Date;
  dimensions: CalendarDimensions;
  headingId: string;
  labels: CalendarLabels;
  locale?: Locale;
  monthPickerId: string;
  monthTriggerRef: RefObject<HTMLButtonElement | null>;
  onNext: () => void;
  onOpenPicker: (which: "month" | "year") => void;
  onPrev: () => void;
  palette: CalendarPalette;
  picker: "none" | "month" | "year";
  yearPickerId: string;
  yearTriggerRef: RefObject<HTMLButtonElement | null>;
}) => (
  <div
    style={{
      position: "relative",
      minHeight: dimensions.navButtonSize,
      marginBottom: dimensions.headerGap,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: dimensions.navButtonSize,
        minWidth: 0,
        paddingLeft: dimensions.navButtonSize,
        paddingRight: dimensions.navButtonSize,
        textAlign: "center",
        gap: 6,
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 2,
          width: "fit-content",
        }}
      >
        <HeaderPickerButton
          ariaControls={monthPickerId}
          ariaExpanded={picker === "month"}
          ariaLabel={labels.chooseMonth}
          color={palette.titleColor}
          onClick={() => onOpenPicker("month")}
          ref={monthTriggerRef}
          showIndicator
          size={dimensions.monthFontSize}
        >
          <span id={headingId}>{format(currentMonth, "MMM", { locale })}</span>
        </HeaderPickerButton>
        <HeaderPickerButton
          ariaControls={yearPickerId}
          ariaExpanded={picker === "year"}
          ariaLabel={labels.chooseYear}
          color={palette.textMuted}
          onClick={() => onOpenPicker("year")}
          ref={yearTriggerRef}
          showIndicator
          size={dimensions.monthFontSize}
        >
          {format(currentMonth, "yyyy", { locale })}
        </HeaderPickerButton>
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        gap: dimensions.navGap,
        alignItems: "center",
        justifyContent: "space-between",
        pointerEvents: "none",
      }}
    >
      <NavButton
        aria-label={labels.previousMonth}
        dimensions={dimensions}
        disabled={!canGoPrev}
        onClick={onPrev}
        palette={palette}
        style={{ pointerEvents: "auto" }}
      >
        <ChevronLeft
          style={{
            height: dimensions.navIconSize,
            width: dimensions.navIconSize,
          }}
        />
      </NavButton>
      <NavButton
        aria-label={labels.nextMonth}
        dimensions={dimensions}
        disabled={!canGoNext}
        onClick={onNext}
        palette={palette}
        style={{ pointerEvents: "auto" }}
      >
        <ChevronRight
          style={{
            height: dimensions.navIconSize,
            width: dimensions.navIconSize,
          }}
        />
      </NavButton>
    </div>
  </div>
);

const CalendarRoot = forwardRef<HTMLDivElement, CalendarProps>(
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: calendar shell coordinates selection, navigation, overlays, and motion in one place.
  function Calendar(
    {
      selected,
      defaultSelected,
      onSelect,
      range,
      defaultRange,
      onRangeSelect,
      mode = "single",
      month,
      defaultMonth,
      onMonthChange,
      disabled,
      locale,
      labels: labelsProp,
      size = "sm",
      weekStartsOn,
      minYear,
      maxYear,
      minDate,
      maxDate,
      showOutsideDays = true,
      fixedWeeks = false,
      modifiers,
      modifierLabels,
      className,
      id,
      name,
    },
    ref
  ) {
    const labels = useMemo(
      () => ({ ...DEFAULT_CALENDAR_LABELS, ...labelsProp }),
      [labelsProp]
    );
    const reduceMotion = useReducedMotion();
    const calendarMotionId = useId();
    const rootId = id ?? calendarMotionId;
    const headingId = `${rootId}-heading`;
    const selectedInfoId = `${rootId}-selected`;
    const monthPickerId = `${rootId}-month-picker`;
    const yearPickerId = `${rootId}-year-picker`;

    const initialMonth = startOfMonth(
      month ?? defaultMonth ?? selected ?? defaultSelected ?? new Date()
    );

    const isDateDisabled = useMemo(
      () => createIsDateDisabled({ disabled, minDate, maxDate }),
      [disabled, minDate, maxDate]
    );

    const [internalMonth, setInternalMonth] = useState<Date>(
      () => initialMonth
    );
    const [internalSelected, setInternalSelected] = useState<Date | null>(
      () => defaultSelected ?? null
    );
    const [internalRange, setInternalRange] = useState<CalendarRange>(
      () => defaultRange ?? {}
    );
    const [focusedDate, setFocusedDate] = useState<Date>(() =>
      resolveFocusableDate(
        initialMonth,
        selected ?? defaultSelected ?? null,
        isDateDisabled
      )
    );
    const [shouldRestoreFocus, setShouldRestoreFocus] = useState(false);
    const [picker, setPicker] = useState<"none" | "month" | "year">("none");
    const [yearPageStart, setYearPageStart] = useState<number>(
      () =>
        Math.floor(initialMonth.getFullYear() / YEAR_GRID_SIZE) * YEAR_GRID_SIZE
    );
    const [monthMotionDirection, setMonthMotionDirection] = useState(0);
    const [pickerFocusIndex, setPickerFocusIndex] = useState(0);

    const dayButtonRefs = useRef(new Map<string, HTMLButtonElement>());
    const pickerRef = useRef<HTMLDivElement | null>(null);
    const monthTriggerRef = useRef<HTMLButtonElement | null>(null);
    const yearTriggerRef = useRef<HTMLButtonElement | null>(null);
    const currentMonth = startOfMonth(month ?? internalMonth);
    const selectedDate =
      mode === "single"
        ? selected === undefined
          ? internalSelected
          : selected
        : null;
    const selectedRange =
      mode === "range" ? (range === undefined ? internalRange : range) : {};
    const rangeBounds = mode === "range" ? getRangeBounds(selectedRange) : null;
    const calendarOptions = useMemo(
      () => getCalendarOptions(locale, weekStartsOn),
      [locale, weekStartsOn]
    );
    const dimensions = CALENDAR_DIMENSIONS[size];
    const palette = CALENDAR_PALETTE;

    const prevMonth = subMonths(currentMonth, 1);
    const nextMonth = addMonths(currentMonth, 1);
    const canGoPrev = canNavigateToMonth(prevMonth, minDate, maxDate);
    const canGoNext = canNavigateToMonth(nextMonth, minDate, maxDate);

    useEffect(() => {
      const next = getSyncedFocusedDate({
        currentMonth,
        focusedDate,
        isDateDisabled,
        mode,
        rangeBounds,
        selectedDate,
      });
      if (!isSameDay(next, focusedDate)) setFocusedDate(next);
    }, [
      currentMonth,
      focusedDate,
      isDateDisabled,
      mode,
      rangeBounds,
      selectedDate,
    ]);

    const controlledSelectionMonthTime =
      month === undefined &&
      mode === "single" &&
      selected !== undefined &&
      selectedDate
        ? startOfMonth(selectedDate).getTime()
        : null;
    const controlledRangeMonthTime =
      month === undefined &&
      mode === "range" &&
      range !== undefined &&
      rangeBounds
        ? startOfMonth(rangeBounds.end).getTime()
        : null;

    useEffect(() => {
      const targetTime =
        controlledSelectionMonthTime ?? controlledRangeMonthTime;
      if (targetTime === null) return;

      const nextVisibleMonth = startOfMonth(new Date(targetTime));

      setInternalMonth((prev) => {
        if (isSameMonth(nextVisibleMonth, prev)) return prev;
        const monthOffset =
          (nextVisibleMonth.getFullYear() - prev.getFullYear()) * 12 +
          nextVisibleMonth.getMonth() -
          prev.getMonth();
        setMonthMotionDirection(Math.sign(monthOffset));
        onMonthChange?.(nextVisibleMonth);
        return nextVisibleMonth;
      });
    }, [controlledRangeMonthTime, controlledSelectionMonthTime, onMonthChange]);

    useEffect(() => {
      if (!shouldRestoreFocus || typeof window === "undefined") return;
      let frameId = 0;
      const focusKey = getDateKey(focusedDate);
      const focusTarget = () => {
        const next = dayButtonRefs.current.get(focusKey);
        if (next) {
          next.focus();
          setShouldRestoreFocus(false);
          return;
        }
        frameId = window.requestAnimationFrame(focusTarget);
      };
      frameId = window.requestAnimationFrame(focusTarget);
      return () => window.cancelAnimationFrame(frameId);
    }, [focusedDate, shouldRestoreFocus]);

    const closePicker = useCallback(() => {
      setPicker((current) => {
        if (current === "month") {
          monthTriggerRef.current?.focus();
        } else if (current === "year") {
          yearTriggerRef.current?.focus();
        }
        return "none";
      });
    }, []);

    useEffect(() => {
      if (picker === "none") return;

      const pickerEl = pickerRef.current;
      if (!pickerEl) return;

      const focusTarget = pickerEl.querySelector<HTMLButtonElement>(
        `[data-calendar-picker-index="${pickerFocusIndex}"]`
      );
      focusTarget?.focus();

      const onDown = (event: MouseEvent) => {
        const target = event.target as Node;
        if (pickerEl.contains(target)) return;
        if (monthTriggerRef.current?.contains(target)) return;
        if (yearTriggerRef.current?.contains(target)) return;
        closePicker();
      };

      const onKey = (event: globalThis.KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
          closePicker();
          return;
        }
        trapPickerTabKey(event, pickerEl);
      };

      document.addEventListener("mousedown", onDown);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("mousedown", onDown);
        document.removeEventListener("keydown", onKey);
      };
    }, [closePicker, picker, pickerFocusIndex]);

    const setMonthValue = (nextMonth: Date) => {
      const normalized = startOfMonth(nextMonth);
      if (!canNavigateToMonth(normalized, minDate, maxDate)) return;
      const monthOffset =
        (normalized.getFullYear() - currentMonth.getFullYear()) * 12 +
        normalized.getMonth() -
        currentMonth.getMonth();
      setMonthMotionDirection(Math.sign(monthOffset));
      if (month === undefined) setInternalMonth(normalized);
      onMonthChange?.(normalized);
    };

    const setSelectedValue = (nextDate: Date | null) => {
      if (mode !== "single") return;
      if (selected === undefined) setInternalSelected(nextDate);
      onSelect?.(nextDate);
    };

    const setRangeValue = (nextRange: CalendarRange) => {
      if (mode !== "range") return;
      const normalized = normalizeRange(nextRange);
      if (range === undefined) setInternalRange(normalized);
      onRangeSelect?.(normalized);
    };

    const handleDaySelect = (day: Date) => {
      if (isDateDisabled(day)) return;

      if (mode === "range") {
        setRangeValue(applyRangeDaySelection(day, selectedRange));
        return;
      }

      if (!isSameMonth(day, currentMonth)) {
        setMonthValue(startOfMonth(day));
      }
      setSelectedValue(day);
    };

    const shouldFixWeeks = fixedWeeks && showOutsideDays;

    const days = useMemo(() => {
      const start = startOfWeek(startOfMonth(currentMonth), calendarOptions);
      const end = endOfWeek(endOfMonth(currentMonth), calendarOptions);
      const intervalDays = eachDayOfInterval({ start, end });
      if (!shouldFixWeeks) return intervalDays;
      const targetLength = FIXED_WEEK_COUNT * WEEK_LENGTH;
      if (intervalDays.length >= targetLength) return intervalDays;
      const padded = [...intervalDays];
      while (padded.length < targetLength) {
        padded.push(addDays(padded.at(-1) ?? end, 1));
      }
      return padded;
    }, [calendarOptions, currentMonth, shouldFixWeeks]);

    const weeks = useMemo(() => {
      const next: Date[][] = [];
      for (let i = 0; i < days.length; i += WEEK_LENGTH) {
        next.push(days.slice(i, i + WEEK_LENGTH));
      }
      return next;
    }, [days]);

    const weekdayHeaders = useMemo(() => {
      const start = startOfWeek(new Date(), calendarOptions);
      return Array.from({ length: WEEK_LENGTH }, (_, index) => {
        const day = addDays(start, index);
        return {
          key: getDateKey(day),
          shortLabel: format(day, "EEEEEE", { locale }),
          fullLabel: format(day, "EEEE", { locale }),
        };
      });
    }, [calendarOptions, locale]);

    const monthLabels = useMemo(() => {
      const ref = new Date(2000, 0, 1);
      return Array.from({ length: 12 }, (_, i) => ({
        index: i,
        short: format(setMonth(ref, i), "MMM", { locale }),
        full: format(setMonth(ref, i), "MMMM", { locale }),
        disabled: isMonthIndexDisabled(currentMonth, i, minDate, maxDate),
      }));
    }, [currentMonth, locale, minDate, maxDate]);

    const moveFocusToDate = (preferredDate: Date, step: 1 | -1) => {
      const next = findInteractiveDate(preferredDate, step, isDateDisabled);
      if (!isSameMonth(next, currentMonth)) {
        setMonthValue(next);
      }
      setFocusedDate(next);
      setShouldRestoreFocus(true);
    };

    const handlePrev = () => {
      if (!canGoPrev) return;
      setMonthValue(prevMonth);
    };

    const handleNext = () => {
      if (!canGoNext) return;
      setMonthValue(nextMonth);
    };

    const handleDayKeyDown = (
      event: KeyboardEvent<HTMLButtonElement>,
      day: Date
    ) => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          moveFocusToDate(addDays(day, -1), -1);
          break;
        case "ArrowRight":
          event.preventDefault();
          moveFocusToDate(addDays(day, 1), 1);
          break;
        case "ArrowUp":
          event.preventDefault();
          moveFocusToDate(addDays(day, -WEEK_LENGTH), -1);
          break;
        case "ArrowDown":
          event.preventDefault();
          moveFocusToDate(addDays(day, WEEK_LENGTH), 1);
          break;
        case "Home":
          event.preventDefault();
          moveFocusToDate(startOfWeek(day, calendarOptions), -1);
          break;
        case "End":
          event.preventDefault();
          moveFocusToDate(endOfWeek(day, calendarOptions), 1);
          break;
        case "PageUp":
          event.preventDefault();
          moveFocusToDate(subMonths(day, 1), -1);
          break;
        case "PageDown":
          event.preventDefault();
          moveFocusToDate(addMonths(day, 1), 1);
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          handleDaySelect(day);
          break;
        default:
          break;
      }
    };

    const monthKey = format(currentMonth, "yyyy-MM");
    const currentYear = currentMonth.getFullYear();
    const currentMonthIndex = currentMonth.getMonth();

    const openPicker = (which: "month" | "year") => {
      setPicker((prev) => {
        const next = prev === which ? "none" : which;
        if (next === "none") {
          if (which === "month") monthTriggerRef.current?.focus();
          else yearTriggerRef.current?.focus();
        } else if (next === "year") {
          setYearPageStart(
            Math.floor(currentYear / YEAR_GRID_SIZE) * YEAR_GRID_SIZE
          );
          setPickerFocusIndex(0);
        } else {
          setPickerFocusIndex(currentMonthIndex);
        }
        return next;
      });
    };

    const selectMonth = (idx: number) => {
      if (isMonthIndexDisabled(currentMonth, idx, minDate, maxDate)) return;
      const next = setMonth(currentMonth, idx);
      setMonthValue(next);
      closePicker();
    };

    const selectYear = (year: number) => {
      if (minYear !== undefined && year < minYear) return;
      if (maxYear !== undefined && year > maxYear) return;
      const next = setYear(currentMonth, year);
      setMonthValue(next);
      closePicker();
    };

    const handlePickerKeyDown = (
      event: KeyboardEvent<HTMLButtonElement>,
      index: number,
      itemCount: number,
      columns: number,
      onSelectAtIndex: (index: number) => void,
      isDisabledAtIndex: (index: number) => boolean
    ) => {
      if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "Home" ||
        event.key === "End"
      ) {
        event.preventDefault();
        let nextIndex = moveGridIndex(index, event.key, columns, itemCount);
        for (let attempt = 0; attempt < itemCount; attempt += 1) {
          if (!isDisabledAtIndex(nextIndex)) {
            setPickerFocusIndex(nextIndex);
            return;
          }
          nextIndex = moveGridIndex(nextIndex, event.key, columns, itemCount);
        }
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (!isDisabledAtIndex(index)) onSelectAtIndex(index);
      }
    };

    const selectionSummary = useMemo(() => {
      if (mode === "range") {
        const normalized = normalizeRange(selectedRange);
        if (!normalized.from) return labels.noDateSelected;
        if (!normalized.to || isSameDay(normalized.from, normalized.to)) {
          return format(normalized.from, "PPPP", { locale });
        }
        return `${format(normalized.from, "PPP", { locale })} – ${format(normalized.to, "PPP", { locale })}`;
      }
      return selectedDate
        ? format(selectedDate, "PPPP", { locale })
        : labels.noDateSelected;
    }, [labels.noDateSelected, locale, mode, selectedDate, selectedRange]);

    const entranceTransition = reduceMotion
      ? { duration: 0 }
      : { duration: 0.6, ease: SPRING_EASE };

    const monthTransition = reduceMotion
      ? { duration: 0 }
      : { duration: 0.22, ease: SMOOTH_EASE };

    return (
      <motion.div
        animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        aria-describedby={selectedInfoId}
        aria-labelledby={headingId}
        className={cn(
          componentThemeClassName,
          controlCornerClassName,
          className
        )}
        data-slot="calendar"
        id={rootId}
        initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.95 }}
        ref={ref}
        role="application"
        style={{
          width: "100%",
          maxWidth: dimensions.maxWidth,
          borderRadius: dimensions.cardRadius,
          padding: dimensions.cardPadding,
          background: palette.cardBackground,
          border: palette.cardBorder,
          boxShadow: palette.cardShadow,
          fontFamily: "inherit",
          color: palette.textPrimary,
          boxSizing: "border-box",
          position: "relative",
        }}
        transition={entranceTransition}
      >
        {name && mode === "single" ? (
          <input
            name={name}
            type="hidden"
            value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
          />
        ) : null}

        <CalendarHeader
          canGoNext={canGoNext}
          canGoPrev={canGoPrev}
          currentMonth={currentMonth}
          dimensions={dimensions}
          headingId={headingId}
          labels={labels}
          locale={locale}
          monthPickerId={monthPickerId}
          monthTriggerRef={monthTriggerRef}
          onNext={handleNext}
          onOpenPicker={openPicker}
          onPrev={handlePrev}
          palette={palette}
          picker={picker}
          yearPickerId={yearPickerId}
          yearTriggerRef={yearTriggerRef}
        />

        <div
          style={{
            position: "relative",
            overflow: "hidden",
            marginTop: dimensions.monthTopMargin,
          }}
        >
          <AnimatePresence
            custom={monthMotionDirection}
            initial={false}
            mode="popLayout"
          >
            <motion.div
              animate="center"
              custom={monthMotionDirection}
              exit="exit"
              initial="enter"
              key={monthKey}
              style={{ position: "relative" }}
              transition={monthTransition}
              variants={reduceMotion ? undefined : MONTH_GRID_VARIANTS}
            >
              <table
                aria-labelledby={headingId}
                style={{
                  width: "100%",
                  tableLayout: "fixed",
                  borderCollapse: "separate",
                  borderSpacing: 0,
                }}
              >
                <thead>
                  <tr>
                    {weekdayHeaders.map((day) => (
                      <th
                        aria-label={day.fullLabel}
                        key={day.key}
                        scope="col"
                        style={{
                          textAlign: "center",
                          fontSize: dimensions.tableHeaderFontSize,
                          fontWeight: 400,
                          color: palette.textMuted,
                          textTransform: "none",
                          letterSpacing: 0,
                          lineHeight: 1.5,
                          padding: `0 ${dimensions.tableCellPadding}px ${dimensions.tableHeaderPaddingBottom}px`,
                        }}
                      >
                        {day.shortLabel}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weeks.map((week, weekIndex) => (
                    <tr key={`${monthKey}-week-${weekIndex}`}>
                      {week.map((day, dayIndex) => {
                        const inMonth = isSameMonth(day, currentMonth);
                        if (!(showOutsideDays || inMonth)) {
                          return (
                            <td
                              aria-hidden
                              key={getDateKey(day)}
                              style={{
                                padding: `${dimensions.weekRowGap}px ${dimensions.tableCellPadding}px 0`,
                              }}
                            />
                          );
                        }

                        return (
                          <td
                            key={getDateKey(day)}
                            style={{
                              padding: `${dimensions.weekRowGap}px ${dimensions.tableCellPadding}px 0`,
                              verticalAlign: "middle",
                            }}
                          >
                            <DayCell
                              calendarMotionId={calendarMotionId}
                              currentMonth={currentMonth}
                              day={day}
                              dimensions={dimensions}
                              index={weekIndex * WEEK_LENGTH + dayIndex}
                              isDateDisabled={isDateDisabled}
                              isFocused={isSameDay(day, focusedDate)}
                              labels={labels}
                              locale={locale}
                              mode={mode}
                              modifierLabels={modifierLabels}
                              modifiers={modifiers}
                              onDayFocus={setFocusedDate}
                              onDayKeyDown={handleDayKeyDown}
                              onSelectDay={handleDaySelect}
                              palette={palette}
                              rangeBounds={rangeBounds}
                              reduceMotion={reduceMotion}
                              registerDayButton={(
                                buttonDay,
                                node,
                                interactive
                              ) => {
                                const key = getDateKey(buttonDay);
                                if (!(interactive && node)) {
                                  dayButtonRefs.current.delete(key);
                                  return;
                                }
                                dayButtonRefs.current.set(key, node);
                              }}
                              selectedDate={selectedDate}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {picker !== "none" ? (
              <motion.div
                animate={
                  reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }
                }
                className={controlCornerClassName}
                exit={
                  reduceMotion ? undefined : { opacity: 0, y: -6, scale: 0.98 }
                }
                initial={
                  reduceMotion ? false : { opacity: 0, y: -6, scale: 0.98 }
                }
                ref={pickerRef}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  boxSizing: "border-box",
                  background: palette.popoverBackground,
                  border: palette.popoverBorder,
                  borderRadius: dimensions.cardRadius - 4,
                  boxShadow: palette.popoverShadow,
                  padding: dimensions.cardPadding - 2,
                  zIndex: 20,
                  display: "flex",
                  flexDirection: "column",
                }}
                transition={monthTransition}
              >
                {picker === "month" ? (
                  <MonthPicker
                    currentMonthIndex={currentMonthIndex}
                    dimensions={dimensions}
                    id={monthPickerId}
                    labels={labels}
                    monthLabels={monthLabels}
                    onKeyDown={(event, index) =>
                      handlePickerKeyDown(
                        event,
                        index,
                        monthLabels.length,
                        MONTH_GRID_COLS,
                        (targetIndex) => selectMonth(targetIndex),
                        (targetIndex) =>
                          monthLabels[targetIndex]?.disabled ?? false
                      )
                    }
                    onSelect={selectMonth}
                    palette={palette}
                    pickerFocusIndex={pickerFocusIndex}
                  />
                ) : (
                  <YearPicker
                    currentYear={currentYear}
                    dimensions={dimensions}
                    id={yearPickerId}
                    labels={labels}
                    maxYear={maxYear}
                    minYear={minYear}
                    onKeyDown={(event, index, years) =>
                      handlePickerKeyDown(
                        event,
                        index,
                        years.length,
                        MONTH_GRID_COLS,
                        (targetIndex) => selectYear(years[targetIndex]),
                        (targetIndex) =>
                          isYearOutOfRange(years[targetIndex], minYear, maxYear)
                      )
                    }
                    onPageChange={setYearPageStart}
                    onSelect={selectYear}
                    pageStart={yearPageStart}
                    palette={palette}
                    pickerFocusIndex={pickerFocusIndex}
                  />
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div
          aria-live="polite"
          id={selectedInfoId}
          style={{
            border: 0,
            clip: "rect(0 0 0 0)",
            height: 1,
            margin: -1,
            overflow: "hidden",
            padding: 0,
            position: "absolute",
            whiteSpace: "nowrap",
            width: 1,
          }}
        >
          {selectionSummary}
        </div>
      </motion.div>
    );
  }
);

CalendarRoot.displayName = "Calendar";

export const Calendar = CalendarRoot;

const HeaderPickerButton = forwardRef<
  HTMLButtonElement,
  {
    children: ReactNode;
    onClick: () => void;
    ariaLabel: string;
    ariaExpanded: boolean;
    ariaControls: string;
    color: string;
    size: number;
    showIndicator?: boolean;
  }
>(function HeaderPickerButton(
  {
    children,
    onClick,
    ariaLabel,
    ariaExpanded,
    ariaControls,
    color,
    size,
    showIndicator = false,
  },
  ref
) {
  return (
    <button
      aria-controls={ariaExpanded ? ariaControls : undefined}
      aria-expanded={ariaExpanded}
      aria-haspopup="dialog"
      aria-label={ariaLabel}
      className={cn(controlCornerClassName, focusVisibleClassName)}
      onClick={onClick}
      ref={ref}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: showIndicator ? 2 : 0,
        fontSize: size,
        fontWeight: 500,
        color,
        letterSpacing: 0,
        lineHeight: 1.1,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        padding: "2px 3px",
        borderRadius: 6,
        fontFamily: "inherit",
        fontVariantNumeric: "tabular-nums",
        WebkitTapHighlightColor: "transparent",
      }}
      type="button"
    >
      {children}
      {showIndicator ? (
        <span
          aria-hidden
          style={{
            display: "inline-flex",
            opacity: 0.55,
            transform: ariaExpanded ? "rotate(180deg)" : undefined,
            transition: "transform 0.16s ease",
          }}
        >
          <ChevronDown style={{ height: 14, width: 14 }} />
        </span>
      ) : null}
    </button>
  );
});

const MonthPicker = ({
  id,
  currentMonthIndex,
  monthLabels,
  onSelect,
  onKeyDown,
  palette,
  dimensions,
  labels,
  pickerFocusIndex,
}: {
  id: string;
  currentMonthIndex: number;
  monthLabels: {
    index: number;
    short: string;
    full: string;
    disabled: boolean;
  }[];
  onSelect: (idx: number) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void;
  palette: CalendarPalette;
  dimensions: CalendarDimensions;
  labels: CalendarLabels;
  pickerFocusIndex: number;
}) => (
  <div
    aria-label={labels.selectMonth}
    id={id}
    role="dialog"
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 4,
      flex: 1,
      alignContent: "space-evenly",
    }}
  >
    {monthLabels.map((m, index) => {
      const active = m.index === currentMonthIndex;
      return (
        <button
          aria-current={active ? "date" : undefined}
          aria-disabled={m.disabled || undefined}
          aria-label={m.full}
          className={cn(controlCornerClassName, focusVisibleClassName)}
          data-calendar-picker-index={index}
          disabled={m.disabled}
          key={m.index}
          onClick={() => onSelect(m.index)}
          onKeyDown={(event) => onKeyDown(event, index)}
          style={{
            minHeight: dimensions.dayCellMinHeight,
            padding: "0 6px",
            borderRadius: dimensions.dayCellRadius,
            border: "none",
            background: active ? palette.selectedGradient : "transparent",
            color: active ? palette.selectedForeground : palette.textPrimary,
            fontWeight: 500,
            fontSize: dimensions.dayCellFontSize,
            cursor: m.disabled ? "default" : "pointer",
            fontFamily: "inherit",
            opacity: m.disabled ? 0.45 : 1,
          }}
          tabIndex={index === pickerFocusIndex ? 0 : -1}
          type="button"
        >
          {m.short}
        </button>
      );
    })}
  </div>
);

const isYearOutOfRange = (year: number, minYear?: number, maxYear?: number) =>
  (minYear !== undefined && year < minYear) ||
  (maxYear !== undefined && year > maxYear);

const YearPicker = ({
  id,
  currentYear,
  pageStart,
  onPageChange,
  onSelect,
  onKeyDown,
  palette,
  dimensions,
  minYear,
  maxYear,
  labels,
  pickerFocusIndex,
}: {
  id: string;
  currentYear: number;
  pageStart: number;
  onPageChange: (n: number) => void;
  onSelect: (year: number) => void;
  onKeyDown: (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
    years: number[]
  ) => void;
  palette: CalendarPalette;
  dimensions: CalendarDimensions;
  minYear?: number;
  maxYear?: number;
  labels: CalendarLabels;
  pickerFocusIndex: number;
}) => {
  const pageEnd = pageStart + YEAR_GRID_SIZE - 1;
  const years = Array.from(
    { length: YEAR_GRID_SIZE },
    (_, index) => pageStart + index
  );
  const canPrev = minYear === undefined || pageStart > minYear;
  const canNext = maxYear === undefined || pageEnd < maxYear;

  return (
    <div
      aria-label={labels.selectYear}
      id={id}
      role="dialog"
      style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <NavButton
          aria-label={labels.previousYears}
          dimensions={dimensions}
          disabled={!canPrev}
          onClick={() => onPageChange(pageStart - YEAR_GRID_SIZE)}
          palette={palette}
        >
          <ChevronLeft
            style={{
              height: dimensions.navIconSize,
              width: dimensions.navIconSize,
            }}
          />
        </NavButton>
        <span
          style={{
            fontSize: dimensions.tableHeaderFontSize,
            fontWeight: 500,
            color: palette.textMuted,
            letterSpacing: 0,
          }}
        >
          {pageStart} – {pageEnd}
        </span>
        <NavButton
          aria-label={labels.nextYears}
          dimensions={dimensions}
          disabled={!canNext}
          onClick={() => onPageChange(pageStart + YEAR_GRID_SIZE)}
          palette={palette}
        >
          <ChevronRight
            style={{
              height: dimensions.navIconSize,
              width: dimensions.navIconSize,
            }}
          />
        </NavButton>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 4,
          flex: 1,
          alignContent: "space-evenly",
        }}
      >
        {years.map((year, index) => (
          <YearPickerCell
            currentYear={currentYear}
            dimensions={dimensions}
            index={index}
            key={year}
            maxYear={maxYear}
            minYear={minYear}
            onKeyDown={(event) => onKeyDown(event, index, years)}
            onSelect={onSelect}
            palette={palette}
            pickerFocusIndex={pickerFocusIndex}
            year={year}
          />
        ))}
      </div>
    </div>
  );
};

const YearPickerCell = ({
  year,
  currentYear,
  index,
  onSelect,
  onKeyDown,
  palette,
  dimensions,
  minYear,
  maxYear,
  pickerFocusIndex,
}: {
  year: number;
  currentYear: number;
  index: number;
  onSelect: (year: number) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  palette: CalendarPalette;
  dimensions: CalendarDimensions;
  minYear?: number;
  maxYear?: number;
  pickerFocusIndex: number;
}) => {
  const active = year === currentYear;
  const outOfRange = isYearOutOfRange(year, minYear, maxYear);

  return (
    <button
      aria-current={active ? "date" : undefined}
      aria-disabled={outOfRange || undefined}
      aria-label={String(year)}
      className={cn(controlCornerClassName, focusVisibleClassName)}
      data-calendar-picker-index={index}
      disabled={outOfRange}
      onClick={() => onSelect(year)}
      onKeyDown={onKeyDown}
      style={{
        minHeight: dimensions.dayCellMinHeight,
        padding: "0 6px",
        borderRadius: dimensions.dayCellRadius,
        border: "none",
        background: active ? palette.selectedGradient : "transparent",
        color: active
          ? palette.selectedForeground
          : outOfRange
            ? palette.textDim
            : palette.textPrimary,
        fontWeight: 500,
        fontSize: dimensions.dayCellFontSize,
        lineHeight: 1.2,
        cursor: outOfRange ? "default" : "pointer",
        fontFamily: "inherit",
        opacity: outOfRange ? 0.45 : 1,
      }}
      tabIndex={index === pickerFocusIndex ? 0 : -1}
      type="button"
    >
      {year}
    </button>
  );
};

type DayCellProps = {
  calendarMotionId: string;
  day: Date;
  dimensions: CalendarDimensions;
  index: number;
  currentMonth: Date;
  isDateDisabled: (date: Date) => boolean;
  isFocused: boolean;
  labels: CalendarLabels;
  locale?: Locale;
  mode: CalendarMode;
  modifiers?: Record<string, (date: Date) => boolean>;
  modifierLabels?: Record<string, string>;
  onDayFocus: (day: Date) => void;
  onDayKeyDown: (event: KeyboardEvent<HTMLButtonElement>, day: Date) => void;
  onSelectDay: (day: Date) => void;
  palette: CalendarPalette;
  rangeBounds: ReturnType<typeof getRangeBounds>;
  reduceMotion: boolean | null;
  registerDayButton: (
    day: Date,
    node: HTMLButtonElement | null,
    interactive: boolean
  ) => void;
  selectedDate: Date | null;
};

const DayCell = ({
  calendarMotionId,
  day,
  dimensions,
  index,
  currentMonth,
  isDateDisabled,
  isFocused,
  labels,
  locale,
  mode,
  modifiers,
  modifierLabels,
  onDayFocus,
  onDayKeyDown,
  onSelectDay,
  palette,
  rangeBounds,
  reduceMotion,
  registerDayButton,
  selectedDate,
}: DayCellProps) => {
  const status = getDayCellStatus({
    currentMonth,
    day,
    isDateDisabled,
    selectedDate,
    rangeBounds,
    mode,
  });
  const activeModifierKeys = getActiveModifiers(day, modifiers);
  const modifierNames = activeModifierKeys.map(
    (key) => modifierLabels?.[key] ?? key
  );

  const handleClick = () => {
    if (!status.isSelectable) return;
    onSelectDay(day);
  };

  const showEndpointHighlight =
    status.isSelected &&
    (mode === "single" ||
      status.rangeRole === "start" ||
      status.rangeRole === "end" ||
      !status.inRange);
  const useSelectionLayout = mode === "single" && !reduceMotion;

  return (
    <motion.button
      animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
      aria-current={status.today ? "date" : undefined}
      aria-disabled={status.isDisabled || undefined}
      aria-label={getDayAriaLabel({
        day,
        locale,
        labels,
        today: status.today,
        isSelected: status.isSelected,
        inMonth: status.inMonth,
        isDisabled: status.isDisabled,
        rangeRole: status.rangeRole,
        modifierNames,
      })}
      aria-selected={status.isSelected || undefined}
      className={cn(controlCornerClassName, focusVisibleClassName)}
      disabled={!status.isSelectable}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
      onClick={handleClick}
      onFocus={() => onDayFocus(day)}
      onKeyDown={(event) => onDayKeyDown(event, day)}
      ref={(node) => registerDayButton(day, node, status.isSelectable)}
      style={{
        position: "relative",
        isolation: "isolate",
        aspectRatio: "1 / 1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: dimensions.dayCellMinHeight,
        fontSize: dimensions.dayCellFontSize,
        fontWeight: 400,
        borderRadius: dimensions.dayCellRadius,
        border: "none",
        background: "transparent",
        cursor: status.isSelectable ? "pointer" : "not-allowed",
        color: status.isDisabled
          ? palette.dayDisabledForeground
          : status.inMonth
            ? palette.textPrimary
            : palette.textDim,
        padding: 0,
        fontFamily: "inherit",
        opacity: status.isDisabled ? 0.55 : 1,
      }}
      tabIndex={status.isSelectable ? (isFocused ? 0 : -1) : -1}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { delay: index * 0.012, duration: 0.3, ease: SPRING_EASE }
      }
      type="button"
    >
      <DayCellMarkup
        activeModifierKeys={activeModifierKeys}
        calendarMotionId={calendarMotionId}
        day={day}
        dimensions={dimensions}
        palette={palette}
        reduceMotion={reduceMotion}
        showEndpointHighlight={showEndpointHighlight}
        status={status}
        useSelectionLayout={useSelectionLayout}
      />
    </motion.button>
  );
};

type NavButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  dimensions: CalendarDimensions;
  onClick?: () => void;
  "aria-label"?: string;
  palette: CalendarPalette;
  style?: CSSProperties;
};

const NavButton = ({
  children,
  disabled = false,
  dimensions,
  onClick,
  palette,
  style,
  ...rest
}: NavButtonProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className={cn(controlCornerClassName, focusVisibleClassName)}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: dimensions.navButtonSize,
        width: dimensions.navButtonSize,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: dimensions.dayCellRadius,
        backgroundColor:
          hovered && !disabled
            ? palette.navHoverBackground
            : palette.navBackground,
        color: disabled
          ? palette.textDim
          : hovered
            ? palette.navForeground
            : palette.textMuted,
        border: "none",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        padding: 0,
        WebkitTapHighlightColor: "transparent",
        transition: "background-color 0.15s ease, color 0.15s ease",
        ...style,
      }}
      type="button"
      {...rest}
    >
      {children}
    </button>
  );
};
