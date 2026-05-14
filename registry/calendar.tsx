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
    if (!(disabled?.(candidate) ?? false)) {
      return candidate;
    }
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
  const labelParts = [format(day, "PPPP", { locale })];

  if (today) {
    labelParts.push("Today");
  }
  if (isSelected && inMonth) {
    labelParts.push("Selected");
  }
  if (!inMonth) {
    labelParts.push("Outside current month");
  } else if (isDisabled) {
    labelParts.push("Unavailable");
  }

  return labelParts.join(", ");
};

const SelectedDaySurface = ({
  active,
  calendarMotionId,
  dimensions,
  palette,
}: {
  active: boolean;
  calendarMotionId: string;
  dimensions: CalendarDimensions;
  palette: CalendarPalette;
}) => {
  if (!active) {
    return null;
  }

  return (
    <motion.div
      layoutId={`${calendarMotionId}-selected-day`}
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: dimensions.dayCellRadius,
        background: palette.selectedGradient,
        boxShadow: "0 8px 28px -12px rgba(0, 0, 0, 0.34)",
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
    />
  );
};

const TodayIndicator = ({
  calendarMotionId,
  dimensions,
  palette,
  visible,
}: {
  calendarMotionId: string;
  dimensions: CalendarDimensions;
  palette: CalendarPalette;
  visible: boolean;
}) => {
  if (!visible) {
    return null;
  }

  return (
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
  );
};

type DayCellStatus = {
  inMonth: boolean;
  isDisabled: boolean;
  isInteractive: boolean;
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
  const isInteractive = inMonth && !isDisabled;
  const isSelectedInMonth = inMonth && isSelected;

  return {
    inMonth,
    isDisabled,
    isInteractive,
    isSelected,
    isSelectedInMonth,
    showTodayIndicator: today && !isSelectedInMonth,
    today,
  };
};

const getDayCellPresentation = ({
  day,
  dimensions,
  isFocused,
  locale,
  palette,
  status,
}: {
  day: Date;
  dimensions: CalendarDimensions;
  isFocused: boolean;
  locale?: Locale;
  palette: CalendarPalette;
  status: DayCellStatus;
}) => {
  const whileHover = {
    scale: 1,
    y: 0,
    backgroundColor: "transparent",
    boxShadow: "none",
  };
  const whileTap = { scale: 1, y: 0 };
  let whileFocus: { boxShadow: string } | undefined;

  if (status.isInteractive) {
    whileFocus = { boxShadow: `0 0 0 2px ${palette.focusRing}` };
    whileHover.scale = 1.04;
    whileHover.y = -1.5;
    whileHover.backgroundColor = palette.dayHoverBackground;
    whileHover.boxShadow = palette.dayHoverShadow;
    whileTap.scale = 0.96;
  }

  return {
    ariaCurrent: status.today ? ("date" as const) : undefined,
    ariaLabel: getDayAriaLabel({
      day,
      locale,
      today: status.today,
      isSelected: status.isSelected,
      inMonth: status.inMonth,
      isDisabled: status.isDisabled,
    }),
    buttonColor: status.inMonth ? palette.textPrimary : palette.textDim,
    buttonCursor: status.isInteractive ? "pointer" : "default",
    buttonFontWeight: status.today && !status.isSelected ? 700 : 500,
    buttonOpacity: status.isDisabled && status.inMonth ? 0.45 : 1,
    dayCellFontSize: dimensions.dayCellFontSize,
    dayCellMinHeight: dimensions.dayCellMinHeight,
    dayCellRadius: dimensions.dayCellRadius,
    labelColor: status.isSelectedInMonth
      ? palette.selectedForeground
      : undefined,
    labelFontWeight: status.isSelectedInMonth ? 600 : undefined,
    tabIndex: status.isInteractive ? (isFocused ? 0 : -1) : -1,
    whileFocus,
    whileHover,
    whileTap,
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
    const classDark = root.classList.contains("dark");
    const dataTheme = root.getAttribute("data-theme");
    const dataMode = root.getAttribute("data-mode");
    if (classDark || dataTheme === "dark" || dataMode === "dark") return true;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
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
  const [direction, setDirection] = useState(0);
  const [shouldRestoreFocus, setShouldRestoreFocus] = useState(false);
  const dayButtonRefs = useRef(new Map<string, HTMLButtonElement>());
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
        cardShadow: "0 16px 46px -16px rgba(0, 0, 0, 0.62)",
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
      }
    : {
        cardBackground: "linear-gradient(135deg, #ffffff 0%, #f4f4f5 100%)",
        cardBorder: "1px solid rgba(0, 0, 0, 0.08)",
        cardShadow: "0 16px 44px -18px rgba(0, 0, 0, 0.14)",
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
      };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = (event?: MediaQueryListEvent) => {
      const root = document.documentElement;
      const classDark = root.classList.contains("dark");
      const dataTheme = root.getAttribute("data-theme");
      const dataMode = root.getAttribute("data-mode");
      const attrDark = dataTheme === "dark" || dataMode === "dark";
      const prefersDark = event ? event.matches : media.matches;
      setIsDark(classDark || attrDark || prefersDark);
    };
    updateTheme();
    media.addEventListener("change", updateTheme);
    const observer = new MutationObserver(() => updateTheme());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "data-mode"],
    });
    return () => {
      media.removeEventListener("change", updateTheme);
      observer.disconnect();
    };
  }, []);

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

    const focusIsInteractive =
      isSameMonth(focusedDate, currentMonth) &&
      !(disabled?.(focusedDate) ?? false);

    if (!focusIsInteractive) {
      const nextFocus = resolveFocusableDate(
        currentMonth,
        selectedDate,
        disabled
      );
      if (!isSameDay(nextFocus, focusedDate)) {
        setFocusedDate(nextFocus);
      }
    }
  }, [currentMonth, disabled, focusedDate, selectedDate]);

  useEffect(() => {
    if (!shouldRestoreFocus || typeof window === "undefined") {
      return;
    }

    let frameId = 0;
    const focusKey = getDateKey(focusedDate);

    const focusTarget = () => {
      const nextButton = dayButtonRefs.current.get(focusKey);
      if (nextButton) {
        nextButton.focus();
        setShouldRestoreFocus(false);
        return;
      }

      frameId = window.requestAnimationFrame(focusTarget);
    };

    frameId = window.requestAnimationFrame(focusTarget);
    return () => window.cancelAnimationFrame(frameId);
  }, [focusedDate, shouldRestoreFocus]);

  const setMonthValue = (nextMonth: Date) => {
    const normalizedMonth = startOfMonth(nextMonth);
    if (month === undefined) {
      setInternalMonth(normalizedMonth);
    }
    onMonthChange?.(normalizedMonth);
  };

  const setSelectedValue = (nextDate: Date) => {
    if (selected === undefined) {
      setInternalSelected(nextDate);
    }
    onSelect?.(nextDate);
  };

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), calendarOptions);
    const end = endOfWeek(endOfMonth(currentMonth), calendarOptions);
    return eachDayOfInterval({ start, end });
  }, [calendarOptions, currentMonth]);

  const weeks = useMemo(() => {
    const nextWeeks: Date[][] = [];

    for (let index = 0; index < days.length; index += WEEK_LENGTH) {
      nextWeeks.push(days.slice(index, index + WEEK_LENGTH));
    }

    return nextWeeks;
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

  const moveFocusToDate = (preferredDate: Date, step: 1 | -1) => {
    const nextDate = findInteractiveDate(preferredDate, step, disabled);

    if (!isSameMonth(nextDate, currentMonth)) {
      setDirection(nextDate.getTime() > currentMonth.getTime() ? 1 : -1);
      setMonthValue(nextDate);
    }

    setFocusedDate(nextDate);
    setShouldRestoreFocus(true);
  };

  const handlePrev = () => {
    setDirection(-1);
    setMonthValue(subMonths(currentMonth, 1));
  };

  const handleNext = () => {
    setDirection(1);
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
        }}
      >
        <div aria-live="polite" style={{ overflow: "hidden" }}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              animate={{ y: 0, opacity: 1 }}
              custom={direction}
              exit={{ y: direction * -30, opacity: 0 }}
              initial={{ y: direction * 30, opacity: 0 }}
              key={monthKey}
              transition={{ duration: 0.4, ease: SMOOTH_EASE }}
            >
              <h2
                id={headingId}
                style={{
                  fontSize: dimensions.monthFontSize,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  margin: 0,
                  color: palette.titleColor,
                }}
              >
                {format(currentMonth, "MMMM", { locale })}
              </h2>
              <p
                style={{
                  fontSize: dimensions.yearFontSize,
                  color: palette.textMuted,
                  fontWeight: 500,
                  lineHeight: 1.1,
                  margin: 0,
                  marginTop: 2,
                }}
              >
                {format(currentMonth, "yyyy", { locale })}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div style={{ display: "flex", gap: dimensions.navGap }}>
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
          overflow: "hidden",
          marginTop: dimensions.monthTopMargin,
        }}
      >
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            animate={{ x: 0, opacity: 1 }}
            custom={direction}
            exit={{ x: direction * -40, opacity: 0 }}
            initial={{ x: direction * 40, opacity: 0 }}
            key={monthKey}
            transition={{ duration: 0.35, ease: SMOOTH_EASE }}
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
                          isFocused={
                            isSameMonth(day, currentMonth) &&
                            isSameDay(day, focusedDate)
                          }
                          locale={locale}
                          onDayFocus={setFocusedDate}
                          onDayKeyDown={handleDayKeyDown}
                          onSelectDay={setSelectedValue}
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
  const presentation = getDayCellPresentation({
    day,
    dimensions,
    isFocused,
    locale,
    palette,
    status,
  });
  const handleClick = () => {
    if (!status.isInteractive) {
      return;
    }

    onSelectDay(day);
  };

  return (
    <motion.button
      animate={{ opacity: 1, scale: 1 }}
      aria-current={presentation.ariaCurrent}
      aria-label={presentation.ariaLabel}
      disabled={!status.isInteractive}
      initial={{ opacity: 0, scale: 0.8 }}
      onClick={handleClick}
      onFocus={() => onDayFocus(day)}
      onKeyDown={(event) => onDayKeyDown(event, day)}
      ref={(node) => registerDayButton(day, node, status.isInteractive)}
      style={{
        position: "relative",
        aspectRatio: "1 / 1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: presentation.dayCellMinHeight,
        fontSize: presentation.dayCellFontSize,
        fontWeight: presentation.buttonFontWeight,
        borderRadius: presentation.dayCellRadius,
        border: "none",
        background: "transparent",
        cursor: presentation.buttonCursor,
        color: presentation.buttonColor,
        padding: 0,
        fontFamily: "inherit",
        outline: "none",
        opacity: presentation.buttonOpacity,
      }}
      tabIndex={presentation.tabIndex}
      transition={{
        delay: index * 0.012,
        duration: 0.3,
        ease: SPRING_EASE,
      }}
      type="button"
      whileFocus={presentation.whileFocus}
      whileHover={presentation.whileHover}
      whileTap={presentation.whileTap}
    >
      <SelectedDaySurface
        active={status.isSelectedInMonth}
        calendarMotionId={calendarMotionId}
        dimensions={dimensions}
        palette={palette}
      />
      <span
        style={{
          position: "relative",
          zIndex: 10,
          color: presentation.labelColor,
          fontWeight: presentation.labelFontWeight,
        }}
      >
        {format(day, "d")}
      </span>
      <TodayIndicator
        calendarMotionId={calendarMotionId}
        dimensions={dimensions}
        palette={palette}
        visible={status.showTodayIndicator}
      />
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
}: NavButtonProps) => (
  <motion.button
    onClick={onClick}
    style={{
      height: dimensions.navButtonSize,
      width: dimensions.navButtonSize,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      backgroundColor: palette.navBackground,
      color: palette.navForeground,
      border: "none",
      cursor: "pointer",
      padding: 0,
      outline: "none",
    }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    type="button"
    whileFocus={{ boxShadow: `0 0 0 2px ${palette.focusRing}` }}
    whileHover={{
      scale: 1.08,
      backgroundColor: palette.navHoverBackground,
    }}
    whileTap={{ scale: 0.92 }}
    {...rest}
  >
    {children}
  </motion.button>
);
