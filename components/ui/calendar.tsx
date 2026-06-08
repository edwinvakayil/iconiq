import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  type Locale,
  setMonth,
  setYear,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-primary-foreground:#ffffff] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-primary-foreground:var(--ic-primary-foreground)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-primary-foreground:#111111] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const SPRING_EASE: [number, number, number, number] = [0.34, 1.56, 0.64, 1];
const SMOOTH_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const CARD_SHADOW = {
  dark: "0 4px 12px -6px rgba(0, 0, 0, 0.28)",
  light: "0 4px 12px -6px rgba(15, 23, 42, 0.12)",
} as const;
const WEEK_LENGTH = 7;
const YEAR_GRID_SIZE = 12; // 3 cols x 4 rows
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

export interface CalendarProps {
  selected?: Date;
  defaultSelected?: Date;
  onSelect?: (date: Date) => void;
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  disabled?: (date: Date) => boolean;
  locale?: Locale;
  size?: CalendarSize;
  weekStartsOn?: WeekStartsOn;
  minYear?: number;
  maxYear?: number;
  className?: string;
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
  selectedGradient: string;
  selectedForeground: string;
  todayBackground: string;
  focusRing: string;
  popoverBackground: string;
  popoverBorder: string;
  popoverShadow: string;
  pickerHoverBackground: string;
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

const CALENDAR_DIMENSIONS: Record<CalendarSize, CalendarDimensions> = {
  sm: {
    cardPadding: 8,
    cardRadius: 12,
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
    cardRadius: 12,
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

const findFirstInteractiveDay = (
  visibleMonth: Date,
  disabled?: (date: Date) => boolean
) =>
  eachDayOfInterval({
    start: startOfMonth(visibleMonth),
    end: endOfMonth(visibleMonth),
  }).find((day) => !(disabled?.(day) ?? false)) ?? startOfMonth(visibleMonth);

const resolveFocusableDate = (
  visibleMonth: Date,
  preferredDate: Date | null | undefined,
  disabled?: (date: Date) => boolean
) => {
  if (
    preferredDate &&
    isSameMonth(preferredDate, visibleMonth) &&
    !(disabled?.(preferredDate) ?? false)
  ) {
    return preferredDate;
  }
  const today = new Date();
  if (isSameMonth(today, visibleMonth) && !(disabled?.(today) ?? false)) {
    return today;
  }
  return findFirstInteractiveDay(visibleMonth, disabled);
};

const findInteractiveDate = (
  preferredDate: Date,
  step: 1 | -1,
  disabled?: (date: Date) => boolean
) => {
  let candidate = preferredDate;
  for (let index = 0; index < 62; index += 1) {
    if (!(disabled?.(candidate) ?? false)) return candidate;
    candidate = addDays(candidate, step);
  }
  return preferredDate;
};

const getDayAriaLabel = ({
  day,
  locale,
  today,
  isSelected,
  inMonth,
  isDisabled,
}: {
  day: Date;
  locale?: Locale;
  today: boolean;
  isSelected: boolean;
  inMonth: boolean;
  isDisabled: boolean;
}) => {
  const parts = [format(day, "PPPP", { locale })];
  if (today) parts.push("Today");
  if (isSelected && inMonth) parts.push("Selected");
  if (!inMonth) parts.push("Outside current month");
  else if (isDisabled) parts.push("Unavailable");
  return parts.join(", ");
};

type DayCellStatus = {
  inMonth: boolean;
  isDisabled: boolean;
  isSelectable: boolean;
  isSelected: boolean;
  isSelectedInMonth: boolean;
  showTodayIndicator: boolean;
  today: boolean;
};

const getDayCellStatus = ({
  currentMonth,
  day,
  disabled,
  selectedDate,
}: {
  currentMonth: Date;
  day: Date;
  disabled?: (date: Date) => boolean;
  selectedDate: Date | null;
}): DayCellStatus => {
  const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
  const inMonth = isSameMonth(day, currentMonth);
  const today = isToday(day);
  const isDisabled = disabled?.(day) ?? false;
  const isSelectable = !isDisabled;
  const isSelectedInMonth = inMonth && isSelected;
  return {
    inMonth,
    isDisabled,
    isSelectable,
    isSelected,
    isSelectedInMonth,
    showTodayIndicator: today && !isSelectedInMonth,
    today,
  };
};

export const Calendar = ({
  selected,
  defaultSelected,
  onSelect,
  month,
  defaultMonth,
  onMonthChange,
  disabled,
  locale,
  size = "sm",
  weekStartsOn,
  minYear,
  maxYear,
  className,
}: CalendarProps) => {
  const calendarMotionId = useId();
  const headingId = `${calendarMotionId}-heading`;
  const selectedInfoId = `${calendarMotionId}-selected`;
  const initialMonth = startOfMonth(
    month ?? defaultMonth ?? selected ?? defaultSelected ?? new Date()
  );

  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const root = window.document.documentElement;
    return (
      root.classList.contains("dark") ||
      root.getAttribute("data-theme") === "dark" ||
      root.getAttribute("data-mode") === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });
  const [internalMonth, setInternalMonth] = useState<Date>(() => initialMonth);
  const [internalSelected, setInternalSelected] = useState<Date | null>(
    () => defaultSelected ?? null
  );
  const [focusedDate, setFocusedDate] = useState<Date>(() =>
    resolveFocusableDate(
      initialMonth,
      selected ?? defaultSelected ?? null,
      disabled
    )
  );
  const [shouldRestoreFocus, setShouldRestoreFocus] = useState(false);
  const [picker, setPicker] = useState<"none" | "month" | "year">("none");
  const [yearPageStart, setYearPageStart] = useState<number>(
    () =>
      Math.floor(initialMonth.getFullYear() / YEAR_GRID_SIZE) * YEAR_GRID_SIZE
  );
  const [monthMotionDirection, setMonthMotionDirection] = useState(0);
  const dayButtonRefs = useRef(new Map<string, HTMLButtonElement>());
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const pickerTriggerRef = useRef<HTMLDivElement | null>(null);

  const currentMonth = startOfMonth(month ?? internalMonth);
  const selectedDate = selected === undefined ? internalSelected : selected;
  const calendarOptions = useMemo(
    () => getCalendarOptions(locale, weekStartsOn),
    [locale, weekStartsOn]
  );
  const dimensions = CALENDAR_DIMENSIONS[size];

  const palette: CalendarPalette = isDark
    ? {
        cardBackground: "var(--ic-card, #111111)",
        cardBorder:
          "1px solid color-mix(in srgb, var(--ic-foreground, #f6f3ec) 4%, transparent)",
        cardShadow: CARD_SHADOW.dark,
        textPrimary: "var(--ic-foreground, #f6f3ec)",
        textMuted: "var(--ic-muted-foreground, #9a958a)",
        textDim:
          "color-mix(in srgb, var(--ic-muted-foreground, #9a958a) 68%, transparent)",
        titleColor: "var(--ic-foreground, #f6f3ec)",
        navBackground: "transparent",
        navForeground: "var(--ic-foreground, #f6f3ec)",
        navHoverBackground: "var(--ic-accent, #1a1a18)",
        dayHoverBackground: "var(--ic-accent, #1a1a18)",
        selectedGradient: "var(--ic-primary, #f6f3ec)",
        selectedForeground: "var(--ic-primary-foreground, #111111)",
        todayBackground: "var(--ic-muted, #171716)",
        focusRing: "var(--ic-ring, rgba(246, 243, 236, 0.18))",
        popoverBackground: "var(--ic-card, #111111)",
        popoverBorder:
          "1px solid color-mix(in srgb, var(--ic-foreground, #f6f3ec) 4%, transparent)",
        popoverShadow: "0 12px 32px -18px rgba(0, 0, 0, 0.6)",
        pickerHoverBackground: "var(--ic-accent, #1a1a18)",
      }
    : {
        cardBackground: "var(--ic-card, #ffffff)",
        cardBorder:
          "1px solid color-mix(in srgb, var(--ic-foreground, #111111) 4%, transparent)",
        cardShadow: CARD_SHADOW.light,
        textPrimary: "var(--ic-foreground, #111111)",
        textMuted: "var(--ic-muted-foreground, #6d7480)",
        textDim:
          "color-mix(in srgb, var(--ic-muted-foreground, #6d7480) 68%, transparent)",
        titleColor: "var(--ic-foreground, #111111)",
        navBackground: "transparent",
        navForeground: "var(--ic-foreground, #111111)",
        navHoverBackground: "var(--ic-accent, #f3f5f8)",
        dayHoverBackground: "var(--ic-accent, #f3f5f8)",
        selectedGradient: "var(--ic-primary, #111111)",
        selectedForeground: "var(--ic-primary-foreground, #ffffff)",
        todayBackground: "var(--ic-muted, #f5f7fa)",
        focusRing: "var(--ic-ring, rgba(17, 17, 17, 0.16))",
        popoverBackground: "var(--ic-card, #ffffff)",
        popoverBorder:
          "1px solid color-mix(in srgb, var(--ic-foreground, #111111) 4%, transparent)",
        popoverShadow: "0 12px 32px -18px rgba(15, 23, 42, 0.28)",
        pickerHoverBackground: "var(--ic-accent, #f3f5f8)",
      };

  // Theme observer
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => {
      const root = document.documentElement;
      setIsDark(
        root.classList.contains("dark") ||
          root.getAttribute("data-theme") === "dark" ||
          root.getAttribute("data-mode") === "dark" ||
          media.matches
      );
    };
    update();
    media.addEventListener("change", update);
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "data-mode"],
    });
    return () => {
      media.removeEventListener("change", update);
      observer.disconnect();
    };
  }, []);

  // Focus management
  useEffect(() => {
    if (
      selectedDate &&
      isSameMonth(selectedDate, currentMonth) &&
      !(disabled?.(selectedDate) ?? false) &&
      !isSameDay(selectedDate, focusedDate)
    ) {
      setFocusedDate(selectedDate);
      return;
    }
    const focusOk =
      isSameMonth(focusedDate, currentMonth) &&
      !(disabled?.(focusedDate) ?? false);
    if (!focusOk) {
      const next = resolveFocusableDate(currentMonth, selectedDate, disabled);
      if (!isSameDay(next, focusedDate)) setFocusedDate(next);
    }
  }, [currentMonth, disabled, focusedDate, selectedDate]);

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

  // Close pickers on outside click / Escape
  useEffect(() => {
    if (picker === "none") return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        pickerRef.current?.contains(target) ||
        pickerTriggerRef.current?.contains(target)
      ) {
        return;
      }
      setPicker("none");
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setPicker("none");
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [picker]);

  const setMonthValue = (nextMonth: Date) => {
    const normalized = startOfMonth(nextMonth);
    const monthOffset =
      (normalized.getFullYear() - currentMonth.getFullYear()) * 12 +
      normalized.getMonth() -
      currentMonth.getMonth();
    setMonthMotionDirection(Math.sign(monthOffset));
    if (month === undefined) setInternalMonth(normalized);
    onMonthChange?.(normalized);
  };

  const setSelectedValue = (nextDate: Date) => {
    if (selected === undefined) setInternalSelected(nextDate);
    onSelect?.(nextDate);
  };

  const handleDaySelect = (day: Date) => {
    if (disabled?.(day)) return;
    if (!isSameMonth(day, currentMonth)) {
      setMonthValue(startOfMonth(day));
    }
    setSelectedValue(day);
  };

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), calendarOptions);
    const end = endOfWeek(endOfMonth(currentMonth), calendarOptions);
    return eachDayOfInterval({ start, end });
  }, [calendarOptions, currentMonth]);

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
    }));
  }, [locale]);

  const moveFocusToDate = (preferredDate: Date, step: 1 | -1) => {
    const next = findInteractiveDate(preferredDate, step, disabled);
    if (!isSameMonth(next, currentMonth)) {
      setMonthValue(next);
    }
    setFocusedDate(next);
    setShouldRestoreFocus(true);
  };

  const handlePrev = () => {
    setMonthValue(subMonths(currentMonth, 1));
  };
  const handleNext = () => {
    setMonthValue(addMonths(currentMonth, 1));
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
      default:
        break;
    }
  };

  const monthKey = format(currentMonth, "yyyy-MM");
  const currentYear = currentMonth.getFullYear();
  const currentMonthIndex = currentMonth.getMonth();

  const togglePicker = (which: "month" | "year") => {
    setPicker((prev) => {
      const next = prev === which ? "none" : which;
      if (next === "year") {
        setYearPageStart(
          Math.floor(currentYear / YEAR_GRID_SIZE) * YEAR_GRID_SIZE
        );
      }
      return next;
    });
  };

  const selectMonth = (idx: number) => {
    const next = setMonth(currentMonth, idx);
    setMonthValue(next);
    setPicker("none");
  };

  const selectYear = (year: number) => {
    if (minYear !== undefined && year < minYear) return;
    if (maxYear !== undefined && year > maxYear) return;
    const next = setYear(currentMonth, year);
    setMonthValue(next);
    setPicker("none");
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0, scale: 1 }}
      aria-describedby={selectedInfoId}
      aria-labelledby={headingId}
      className={cn(componentThemeClassName, className)}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      role="group"
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
      transition={{ duration: 0.6, ease: SPRING_EASE }}
    >
      {/* Header */}
      <div
        style={{
          position: "relative",
          height: dimensions.navButtonSize,
          marginBottom: dimensions.headerGap,
        }}
      >
        <div
          aria-live="polite"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            minWidth: 0,
            paddingLeft: dimensions.navButtonSize,
            paddingRight: dimensions.navButtonSize,
            textAlign: "center",
          }}
        >
          <div
            ref={pickerTriggerRef}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
              width: "fit-content",
            }}
          >
            <HeaderPickerButton
              ariaExpanded={picker === "month"}
              ariaLabel="Choose month"
              color={palette.titleColor}
              focusRing={palette.focusRing}
              fontSize={dimensions.monthFontSize}
              fontWeight={500}
              onClick={() => togglePicker("month")}
              padding="2px 3px"
              showIndicator
            >
              <span id={headingId}>
                {format(currentMonth, "MMM", { locale })}
              </span>
            </HeaderPickerButton>
            <HeaderPickerButton
              ariaExpanded={picker === "year"}
              ariaLabel="Choose year"
              color={palette.textMuted}
              focusRing={palette.focusRing}
              fontSize={dimensions.monthFontSize}
              fontWeight={500}
              onClick={() => togglePicker("year")}
              padding="2px 3px"
              showIndicator
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
            aria-label="Previous month"
            dimensions={dimensions}
            onClick={handlePrev}
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
            aria-label="Next month"
            dimensions={dimensions}
            onClick={handleNext}
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

      {/* Calendar table */}
      <div
        style={{
          position: "relative",
          overflow: picker === "year" ? "visible" : "hidden",
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
            transition={{ duration: 0.22, ease: SMOOTH_EASE }}
            variants={MONTH_GRID_VARIANTS}
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
                    {week.map((day, dayIndex) => (
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
                          disabled={disabled}
                          index={weekIndex * WEEK_LENGTH + dayIndex}
                          isFocused={isSameDay(day, focusedDate)}
                          locale={locale}
                          onDayFocus={setFocusedDate}
                          onDayKeyDown={handleDayKeyDown}
                          onSelectDay={handleDaySelect}
                          palette={palette}
                          registerDayButton={(buttonDay, node, interactive) => {
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
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </AnimatePresence>

        {/* Month / Year picker overlay */}
        <AnimatePresence>
          {picker !== "none" && (
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              ref={pickerRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                ...(picker === "year"
                  ? { bottom: "auto", height: "fit-content" }
                  : { bottom: 0 }),
                boxSizing: "border-box",
                background: palette.popoverBackground,
                border: palette.popoverBorder,
                borderRadius: dimensions.cardRadius - 4,
                boxShadow: palette.popoverShadow,
                padding:
                  picker === "year"
                    ? `${dimensions.cardPadding - 4}px ${dimensions.cardPadding - 2}px ${dimensions.cardPadding - 2}px`
                    : dimensions.cardPadding - 2,
                zIndex: 20,
                display: "flex",
                flexDirection: "column",
              }}
              transition={{ duration: 0.2, ease: SMOOTH_EASE }}
            >
              {picker === "month" ? (
                <MonthPicker
                  currentMonthIndex={currentMonthIndex}
                  dimensions={dimensions}
                  monthLabels={monthLabels}
                  onSelect={selectMonth}
                  palette={palette}
                />
              ) : (
                <YearPicker
                  currentYear={currentYear}
                  dimensions={dimensions}
                  maxYear={maxYear}
                  minYear={minYear}
                  onPageChange={setYearPageStart}
                  onSelect={selectYear}
                  pageStart={yearPageStart}
                  palette={palette}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected info */}
      <motion.div
        animate={{ opacity: 1 }}
        id={selectedInfoId}
        initial={{ opacity: 0 }}
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
        transition={{ delay: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            aria-live="polite"
            exit={{ opacity: 0, y: -8 }}
            initial={{ opacity: 0, y: 8 }}
            key={selectedDate ? getDateKey(selectedDate) : "no-selection"}
            style={{
              margin: 0,
            }}
            transition={{ duration: 0.25 }}
          >
            {selectedDate
              ? format(selectedDate, "PPPP", { locale })
              : "No date selected"}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

/* ---------- Header sub-components ---------- */

const HeaderPickerButton = ({
  children,
  onClick,
  ariaLabel,
  ariaExpanded,
  fontSize,
  fontWeight,
  color,
  focusRing,
  padding = "2px 4px",
  showIndicator = false,
}: {
  children: ReactNode;
  onClick: () => void;
  ariaLabel: string;
  ariaExpanded: boolean;
  fontSize: number;
  fontWeight: number;
  color: string;
  focusRing: string;
  padding?: string;
  showIndicator?: boolean;
}) => (
  <motion.button
    aria-expanded={ariaExpanded}
    aria-haspopup="dialog"
    aria-label={ariaLabel}
    onClick={onClick}
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: showIndicator ? 2 : 0,
      fontSize,
      fontWeight,
      color,
      letterSpacing: 0,
      lineHeight: 1.1,
      border: "none",
      background: "transparent",
      cursor: "pointer",
      padding,
      borderRadius: 6,
      fontFamily: "inherit",
      outline: "none",
      fontVariantNumeric: "tabular-nums",
      WebkitTapHighlightColor: "transparent",
    }}
    transition={{ duration: 0.15 }}
    type="button"
    whileFocus={{ boxShadow: `0 0 0 2px ${focusRing}` }}
    whileTap={{ scale: 0.97 }}
  >
    {children}
    {showIndicator && (
      <motion.span
        animate={{ rotate: ariaExpanded ? 180 : 0 }}
        aria-hidden="true"
        style={{
          display: "inline-flex",
          opacity: 0.55,
        }}
        transition={{ duration: 0.16, ease: SMOOTH_EASE }}
      >
        <ChevronDown style={{ height: 14, width: 14 }} />
      </motion.span>
    )}
  </motion.button>
);

const MonthPicker = ({
  currentMonthIndex,
  monthLabels,
  onSelect,
  palette,
  dimensions,
}: {
  currentMonthIndex: number;
  monthLabels: { index: number; short: string; full: string }[];
  onSelect: (idx: number) => void;
  palette: CalendarPalette;
  dimensions: CalendarDimensions;
}) => (
  <div
    aria-label="Select month"
    role="dialog"
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 4,
      flex: 1,
      alignContent: "space-evenly",
    }}
  >
    {monthLabels.map((m) => {
      const active = m.index === currentMonthIndex;
      return (
        <motion.button
          aria-current={active ? "true" : undefined}
          aria-label={m.full}
          key={m.index}
          onClick={() => onSelect(m.index)}
          style={{
            minHeight: dimensions.dayCellMinHeight,
            padding: "0 6px",
            borderRadius: dimensions.dayCellRadius,
            border: "none",
            background: active ? palette.selectedGradient : "transparent",
            color: active ? palette.selectedForeground : palette.textPrimary,
            fontWeight: 500,
            fontSize: dimensions.dayCellFontSize,
            cursor: "pointer",
            fontFamily: "inherit",
            outline: "none",
            letterSpacing: 0,
          }}
          transition={{ duration: 0.15 }}
          type="button"
          whileFocus={{ boxShadow: `0 0 0 2px ${palette.focusRing}` }}
          whileHover={{
            backgroundColor: active ? undefined : palette.pickerHoverBackground,
            scale: 1.03,
          }}
          whileTap={{ scale: 0.96 }}
        >
          {m.short}
        </motion.button>
      );
    })}
  </div>
);

const isYearOutOfRange = (year: number, minYear?: number, maxYear?: number) =>
  (minYear !== undefined && year < minYear) ||
  (maxYear !== undefined && year > maxYear);

const YearPickerCell = ({
  year,
  currentYear,
  onSelect,
  palette,
  dimensions,
  minYear,
  maxYear,
}: {
  year: number;
  currentYear: number;
  onSelect: (year: number) => void;
  palette: CalendarPalette;
  dimensions: CalendarDimensions;
  minYear?: number;
  maxYear?: number;
}) => {
  const active = year === currentYear;
  const outOfRange = isYearOutOfRange(year, minYear, maxYear);

  return (
    <motion.button
      aria-current={active ? "true" : undefined}
      aria-label={String(year)}
      disabled={outOfRange}
      onClick={() => onSelect(year)}
      style={{
        minHeight: dimensions.dayCellMinHeight,
        padding: "0 4px",
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
        outline: "none",
        opacity: outOfRange ? 0.45 : 1,
      }}
      transition={{ duration: 0.15 }}
      type="button"
      whileFocus={
        outOfRange ? undefined : { boxShadow: `0 0 0 2px ${palette.focusRing}` }
      }
      whileHover={
        outOfRange
          ? undefined
          : {
              backgroundColor: active
                ? undefined
                : palette.pickerHoverBackground,
              scale: 1.03,
            }
      }
      whileTap={outOfRange ? undefined : { scale: 0.96 }}
    >
      {year}
    </motion.button>
  );
};

const YearPicker = ({
  currentYear,
  pageStart,
  onPageChange,
  onSelect,
  palette,
  dimensions,
  minYear,
  maxYear,
}: {
  currentYear: number;
  pageStart: number;
  onPageChange: (n: number) => void;
  onSelect: (year: number) => void;
  palette: CalendarPalette;
  dimensions: CalendarDimensions;
  minYear?: number;
  maxYear?: number;
}) => {
  const pageEnd = pageStart + YEAR_GRID_SIZE - 1;
  const canPrev = minYear === undefined || pageStart > minYear;
  const canNext = maxYear === undefined || pageEnd < maxYear;

  return (
    <div
      aria-label="Select year"
      role="dialog"
      style={{ display: "flex", flexDirection: "column", gap: 6 }}
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
          aria-label="Previous years"
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
          aria-label="Next years"
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
        }}
      >
        {Array.from({ length: YEAR_GRID_SIZE }, (_, i) => pageStart + i).map(
          (year) => (
            <YearPickerCell
              currentYear={currentYear}
              dimensions={dimensions}
              key={year}
              maxYear={maxYear}
              minYear={minYear}
              onSelect={onSelect}
              palette={palette}
              year={year}
            />
          )
        )}
      </div>
    </div>
  );
};

/* ---------- Day cell + Nav button ---------- */

type DayCellProps = {
  calendarMotionId: string;
  day: Date;
  dimensions: CalendarDimensions;
  index: number;
  currentMonth: Date;
  disabled?: (date: Date) => boolean;
  isFocused: boolean;
  onDayFocus: (day: Date) => void;
  onDayKeyDown: (event: KeyboardEvent<HTMLButtonElement>, day: Date) => void;
  onSelectDay: (day: Date) => void;
  palette: CalendarPalette;
  locale?: Locale;
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
  disabled,
  isFocused,
  onDayFocus,
  onDayKeyDown,
  onSelectDay,
  palette,
  locale,
  registerDayButton,
  selectedDate,
}: DayCellProps) => {
  const status = getDayCellStatus({
    currentMonth,
    day,
    disabled,
    selectedDate,
  });
  const whileHover = {
    scale: 1,
    y: 0,
    backgroundColor: "transparent",
    boxShadow: "none",
  };
  const whileTap = { scale: 1, y: 0 };
  let whileFocus: { boxShadow: string } | undefined;
  if (status.isSelectable) {
    whileFocus = { boxShadow: `0 0 0 2px ${palette.focusRing}` };
    whileHover.backgroundColor = palette.dayHoverBackground;
  }

  const handleClick = () => {
    if (!status.isSelectable) return;
    onSelectDay(day);
  };

  return (
    <motion.button
      animate={{ opacity: 1, scale: 1 }}
      aria-current={status.today ? "date" : undefined}
      aria-label={getDayAriaLabel({
        day,
        locale,
        today: status.today,
        isSelected: status.isSelected,
        inMonth: status.inMonth,
        isDisabled: status.isDisabled,
      })}
      disabled={!status.isSelectable}
      initial={{ opacity: 0, scale: 0.8 }}
      onClick={handleClick}
      onFocus={() => onDayFocus(day)}
      onKeyDown={(event) => onDayKeyDown(event, day)}
      ref={(node) => registerDayButton(day, node, status.isSelectable)}
      style={{
        position: "relative",
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
        cursor: status.isSelectable ? "pointer" : "default",
        color: status.inMonth ? palette.textPrimary : palette.textDim,
        padding: 0,
        fontFamily: "inherit",
        outline: "none",
        opacity: status.isDisabled ? 0.45 : 1,
      }}
      tabIndex={status.isSelectable ? (isFocused ? 0 : -1) : -1}
      transition={{ delay: index * 0.012, duration: 0.3, ease: SPRING_EASE }}
      type="button"
      whileFocus={whileFocus}
      whileHover={whileHover}
      whileTap={whileTap}
    >
      {status.showTodayIndicator && (
        <motion.div
          layoutId={`${calendarMotionId}-today-dot`}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: dimensions.dayCellRadius,
            background: palette.todayBackground,
          }}
        />
      )}
      {status.isSelectedInMonth && (
        <motion.div
          layoutId={`${calendarMotionId}-selected-day`}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: dimensions.dayCellRadius,
            background: palette.selectedGradient,
            boxShadow: "none",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span
        style={{
          position: "relative",
          zIndex: 10,
          color: status.isSelectedInMonth
            ? palette.selectedForeground
            : undefined,
          fontWeight: status.isSelectedInMonth ? 600 : undefined,
        }}
      >
        {format(day, "d")}
      </span>
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
        outline: "none",
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
