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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

const SPRING_EASE: [number, number, number, number] = [0.34, 1.56, 0.64, 1];
const SMOOTH_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const WEEK_LENGTH = 7;
const YEAR_GRID_SIZE = 12; // 3 cols x 4 rows

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
  dayHoverShadow: string;
  selectedGradient: string;
  selectedForeground: string;
  todayDot: string;
  footerBorder: string;
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
  dayDotBottom: number;
  dayDotSize: number;
  footerLabelFontSize: number;
  footerSpacingTop: number;
  footerValueFontSize: number;
  headerGap: number;
  monthFontSize: number;
  monthTopMargin: number;
  navButtonSize: number;
  navGap: number;
  navIconSize: number;
  tableCellPadding: number;
  tableHeaderFontSize: number;
  tableHeaderPaddingBottom: number;
  yearFontSize: number;
  maxWidth: number;
};

const CALENDAR_DIMENSIONS: Record<CalendarSize, CalendarDimensions> = {
  sm: {
    cardPadding: 12,
    cardRadius: 14,
    dayCellFontSize: 11,
    dayCellMinHeight: 30,
    dayCellRadius: 7,
    dayDotBottom: 3,
    dayDotSize: 3,
    footerLabelFontSize: 8,
    footerSpacingTop: 10,
    footerValueFontSize: 11,
    headerGap: 10,
    maxWidth: 248,
    monthFontSize: 15,
    monthTopMargin: 3,
    navButtonSize: 28,
    navGap: 4,
    navIconSize: 11,
    tableCellPadding: 1,
    tableHeaderFontSize: 9,
    tableHeaderPaddingBottom: 6,
    yearFontSize: 9,
  },
  md: {
    cardPadding: 14,
    cardRadius: 16,
    dayCellFontSize: 12,
    dayCellMinHeight: 34,
    dayCellRadius: 8,
    dayDotBottom: 4,
    dayDotSize: 4,
    footerLabelFontSize: 9,
    footerSpacingTop: 12,
    footerValueFontSize: 12,
    headerGap: 12,
    maxWidth: 280,
    monthFontSize: 16,
    monthTopMargin: 4,
    navButtonSize: 32,
    navGap: 6,
    navIconSize: 12,
    tableCellPadding: 2,
    tableHeaderFontSize: 10,
    tableHeaderPaddingBottom: 8,
    yearFontSize: 10,
  },
  lg: {
    cardPadding: 16,
    cardRadius: 18,
    dayCellFontSize: 14,
    dayCellMinHeight: 42,
    dayCellRadius: 10,
    dayDotBottom: 5,
    dayDotSize: 5,
    footerLabelFontSize: 10,
    footerSpacingTop: 14,
    footerValueFontSize: 13,
    headerGap: 14,
    maxWidth: 336,
    monthFontSize: 18,
    monthTopMargin: 6,
    navButtonSize: 36,
    navGap: 8,
    navIconSize: 14,
    tableCellPadding: 3,
    tableHeaderFontSize: 11,
    tableHeaderPaddingBottom: 10,
    yearFontSize: 11,
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
  size = "md",
  weekStartsOn,
  minYear,
  maxYear,
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
  const dayButtonRefs = useRef(new Map<string, HTMLButtonElement>());
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const currentMonth = startOfMonth(month ?? internalMonth);
  const selectedDate = selected === undefined ? internalSelected : selected;
  const calendarOptions = useMemo(
    () => getCalendarOptions(locale, weekStartsOn),
    [locale, weekStartsOn]
  );
  const dimensions = CALENDAR_DIMENSIONS[size];

  const palette: CalendarPalette = isDark
    ? {
        cardBackground: "linear-gradient(135deg, #000000 0%, #0f0f0f 100%)",
        cardBorder: "1px solid rgba(255, 255, 255, 0.12)",
        cardShadow: "none",
        textPrimary: "#f5f5f5",
        textMuted: "#a3a3a3",
        textDim: "rgba(255, 255, 255, 0.35)",
        titleColor: "#f5f5f5",
        navBackground: "#171717",
        navForeground: "#f5f5f5",
        navHoverBackground: "rgba(255, 255, 255, 0.14)",
        dayHoverBackground: "#1a1a1a",
        dayHoverShadow:
          "0 12px 22px -18px rgba(255, 255, 255, 0.18), inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
        selectedGradient: "linear-gradient(135deg, #f5f5f5, #a3a3a3)",
        selectedForeground: "#000000",
        todayDot: "#f5f5f5",
        footerBorder: "1px solid rgba(255, 255, 255, 0.14)",
        focusRing: "rgba(245, 245, 245, 0.45)",
        popoverBackground: "linear-gradient(135deg, #0a0a0a 0%, #161616 100%)",
        popoverBorder: "1px solid rgba(255, 255, 255, 0.14)",
        popoverShadow: "0 24px 60px -20px rgba(0, 0, 0, 0.65)",
        pickerHoverBackground: "rgba(255, 255, 255, 0.08)",
      }
    : {
        cardBackground: "linear-gradient(135deg, #ffffff 0%, #f4f4f5 100%)",
        cardBorder: "1px solid rgba(0, 0, 0, 0.08)",
        cardShadow: "none",
        textPrimary: "#0a0a0a",
        textMuted: "#737373",
        textDim: "rgba(0, 0, 0, 0.25)",
        titleColor: "#0a0a0a",
        navBackground: "#f4f4f5",
        navForeground: "#0a0a0a",
        navHoverBackground: "rgba(20, 20, 20, 0.1)",
        dayHoverBackground: "#f4f4f5",
        dayHoverShadow:
          "0 12px 22px -18px rgba(15, 23, 42, 0.16), inset 0 0 0 1px rgba(10, 10, 10, 0.05)",
        selectedGradient: "linear-gradient(135deg, #141414, #4a4a4a)",
        selectedForeground: "#ffffff",
        todayDot: "#0a0a0a",
        footerBorder: "1px solid rgba(0, 0, 0, 0.08)",
        focusRing: "rgba(10, 10, 10, 0.2)",
        popoverBackground: "linear-gradient(135deg, #ffffff 0%, #f7f7f8 100%)",
        popoverBorder: "1px solid rgba(0, 0, 0, 0.1)",
        popoverShadow: "0 24px 60px -20px rgba(15, 23, 42, 0.25)",
        pickerHoverBackground: "rgba(10, 10, 10, 0.06)",
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
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPicker("none");
      }
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
        backdropFilter: "blur(20px)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: palette.textPrimary,
        boxSizing: "border-box",
        position: "relative",
      }}
      transition={{ duration: 0.6, ease: SPRING_EASE }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: dimensions.headerGap,
          gap: 8,
        }}
      >
        <div aria-live="polite" style={{ flexShrink: 0, minWidth: 0 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "baseline",
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
              fontWeight={700}
              onClick={() => togglePicker("month")}
              padding="2px 4px 2px 0"
            >
              <span id={headingId}>
                {format(currentMonth, "MMMM", { locale })}
              </span>
            </HeaderPickerButton>
            <HeaderPickerButton
              ariaExpanded={picker === "year"}
              ariaLabel="Choose year"
              color={palette.textMuted}
              focusRing={palette.focusRing}
              fontSize={dimensions.monthFontSize - 2}
              fontWeight={500}
              onClick={() => togglePicker("year")}
              padding="2px 0 2px 4px"
            >
              {format(currentMonth, "yyyy", { locale })}
            </HeaderPickerButton>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: dimensions.navGap,
            alignItems: "center",
          }}
        >
          <NavButton
            aria-label="Previous month"
            dimensions={dimensions}
            onClick={handlePrev}
            palette={palette}
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
        <div key={monthKey}>
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
                      fontWeight: 600,
                      color: palette.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
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
                        padding: dimensions.tableCellPadding,
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
        </div>

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
          marginTop: dimensions.footerSpacingTop,
          paddingTop: dimensions.footerSpacingTop,
          borderTop: palette.footerBorder,
        }}
        transition={{ delay: 0.3 }}
      >
        <p
          style={{
            fontSize: dimensions.footerLabelFontSize,
            color: palette.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 2,
            margin: 0,
          }}
        >
          Selected
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            aria-live="polite"
            exit={{ opacity: 0, y: -8 }}
            initial={{ opacity: 0, y: 8 }}
            key={selectedDate ? getDateKey(selectedDate) : "no-selection"}
            style={{
              fontSize: dimensions.footerValueFontSize,
              fontWeight: selectedDate ? 600 : 500,
              color: selectedDate ? palette.textPrimary : palette.textMuted,
              margin: 0,
              marginTop: 2,
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
      fontSize,
      fontWeight,
      color,
      letterSpacing: "-0.02em",
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
      gap: 6,
      flex: 1,
      alignContent: "center",
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
            padding: "10px 6px",
            borderRadius: dimensions.dayCellRadius,
            border: "none",
            background: active ? palette.selectedGradient : "transparent",
            color: active ? palette.selectedForeground : palette.textPrimary,
            fontWeight: active ? 700 : 500,
            fontSize: dimensions.dayCellFontSize + 1,
            cursor: "pointer",
            fontFamily: "inherit",
            outline: "none",
            letterSpacing: "0.02em",
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
        padding: "7px 4px",
        borderRadius: dimensions.dayCellRadius,
        border: "none",
        background: active ? palette.selectedGradient : "transparent",
        color: active
          ? palette.selectedForeground
          : outOfRange
            ? palette.textDim
            : palette.textPrimary,
        fontWeight: active ? 700 : 500,
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
      style={{ display: "flex", flexDirection: "column", gap: 4 }}
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
          onClick={() => canPrev && onPageChange(pageStart - YEAR_GRID_SIZE)}
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
            fontWeight: 600,
            color: palette.textMuted,
            letterSpacing: "0.06em",
          }}
        >
          {pageStart} – {pageEnd}
        </span>
        <NavButton
          aria-label="Next years"
          dimensions={dimensions}
          onClick={() => canNext && onPageChange(pageStart + YEAR_GRID_SIZE)}
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
    whileHover.scale = 1.04;
    whileHover.y = -1.5;
    whileHover.backgroundColor = palette.dayHoverBackground;
    whileHover.boxShadow = palette.dayHoverShadow;
    whileTap.scale = 0.96;
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
        fontWeight: status.today && !status.isSelected ? 700 : 500,
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
      {status.isSelectedInMonth && (
        <motion.div
          layoutId={`${calendarMotionId}-selected-day`}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: dimensions.dayCellRadius,
            background: palette.selectedGradient,
            boxShadow: "0 8px 28px -12px rgba(0, 0, 0, 0.34)",
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
      {status.showTodayIndicator && (
        <motion.span
          layoutId={`${calendarMotionId}-today-dot`}
          style={{
            position: "absolute",
            bottom: dimensions.dayDotBottom,
            height: dimensions.dayDotSize,
            width: dimensions.dayDotSize,
            borderRadius: "50%",
            backgroundColor: palette.todayDot,
          }}
        />
      )}
    </motion.button>
  );
};

type NavButtonProps = {
  children: ReactNode;
  dimensions: CalendarDimensions;
  onClick?: () => void;
  "aria-label"?: string;
  palette: CalendarPalette;
};

const NavButton = ({
  children,
  dimensions,
  onClick,
  palette,
  ...rest
}: NavButtonProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: dimensions.navButtonSize,
        width: dimensions.navButtonSize,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        backgroundColor: "transparent",
        color: hovered ? palette.textPrimary : palette.textMuted,
        border: "none",
        cursor: "pointer",
        padding: 0,
        outline: "none",
        WebkitTapHighlightColor: "transparent",
        transition: "color 0.15s ease",
      }}
      type="button"
      {...rest}
    >
      {children}
    </button>
  );
};
