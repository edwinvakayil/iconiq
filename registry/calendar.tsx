import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useMemo, useState } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SPRING_EASE: [number, number, number, number] = [0.34, 1.56, 0.64, 1];
const SMOOTH_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

export interface CalendarProps {
  selected?: Date;
  defaultSelected?: Date;
  onSelect?: (date: Date) => void;
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  disabled?: (date: Date) => boolean;
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
};

export const Calendar = ({
  selected,
  defaultSelected,
  onSelect,
  month,
  defaultMonth,
  onMonthChange,
  disabled,
}: CalendarProps) => {
  const calendarMotionId = useId();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const root = window.document.documentElement;
    const classDark = root.classList.contains("dark");
    const dataTheme = root.getAttribute("data-theme");
    const dataMode = root.getAttribute("data-mode");
    if (classDark || dataTheme === "dark" || dataMode === "dark") return true;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [internalMonth, setInternalMonth] = useState<Date>(
    () => defaultMonth ?? new Date()
  );
  const [internalSelected, setInternalSelected] = useState<Date>(
    () => defaultSelected ?? new Date()
  );
  const [direction, setDirection] = useState(0);
  const currentMonth = month ?? internalMonth;
  const selectedDate = selected ?? internalSelected;
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

  const setMonthValue = (nextMonth: Date) => {
    if (month === undefined) {
      setInternalMonth(nextMonth);
    }
    onMonthChange?.(nextMonth);
  };

  const setSelectedValue = (nextDate: Date) => {
    if (selected === undefined) {
      setInternalSelected(nextDate);
    }
    onSelect?.(nextDate);
  };

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const handlePrev = () => {
    setDirection(-1);
    setMonthValue(subMonths(currentMonth, 1));
  };

  const handleNext = () => {
    setDirection(1);
    setMonthValue(addMonths(currentMonth, 1));
  };

  const monthKey = format(currentMonth, "yyyy-MM");

  return (
    <motion.div
      animate={{ opacity: 1, y: 0, scale: 1 }}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      style={{
        width: "100%",
        maxWidth: 260,
        borderRadius: 16,
        padding: 14,
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
          marginBottom: 12,
        }}
      >
        <div style={{ overflow: "hidden" }}>
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
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  margin: 0,
                  color: palette.titleColor,
                }}
              >
                {format(currentMonth, "MMMM")}
              </h2>
              <p
                style={{
                  fontSize: 10,
                  color: palette.textMuted,
                  fontWeight: 500,
                  lineHeight: 1.1,
                  margin: 0,
                  marginTop: 2,
                }}
              >
                {format(currentMonth, "yyyy")}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          <NavButton
            aria-label="Previous month"
            isDark={isDark}
            onClick={handlePrev}
          >
            <ChevronLeft style={{ height: 12, width: 12 }} />
          </NavButton>
          <NavButton
            aria-label="Next month"
            isDark={isDark}
            onClick={handleNext}
          >
            <ChevronRight style={{ height: 12, width: 12 }} />
          </NavButton>
        </div>
      </div>

      {/* Weekdays */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: 4,
          marginBottom: 8,
        }}
      >
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            style={{
              textAlign: "center",
              fontSize: 10,
              fontWeight: 600,
              color: palette.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "4px 0",
            }}
          >
            {day.slice(0, 1)}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            animate={{ x: 0, opacity: 1 }}
            custom={direction}
            exit={{ x: direction * -40, opacity: 0 }}
            initial={{ x: direction * 40, opacity: 0 }}
            key={monthKey}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
              gap: 4,
            }}
            transition={{ duration: 0.35, ease: SMOOTH_EASE }}
          >
            {days.map((day, idx) => (
              <DayCell
                calendarMotionId={calendarMotionId}
                currentMonth={currentMonth}
                day={day}
                disabled={disabled}
                index={idx}
                key={day.toISOString()}
                onSelectDay={setSelectedValue}
                palette={palette}
                selectedDate={selectedDate}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Selected info */}
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        style={{
          marginTop: 12,
          paddingTop: 12,
          borderTop: palette.footerBorder,
        }}
        transition={{ delay: 0.3 }}
      >
        <p
          style={{
            fontSize: 9,
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
            exit={{ opacity: 0, y: -8 }}
            initial={{ opacity: 0, y: 8 }}
            key={selectedDate.toISOString()}
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: palette.textPrimary,
              margin: 0,
              marginTop: 2,
            }}
            transition={{ duration: 0.25 }}
          >
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

type DayCellProps = {
  day: Date;
  index: number;
  selectedDate: Date;
  currentMonth: Date;
  disabled?: (date: Date) => boolean;
  onSelectDay: (day: Date) => void;
  palette: CalendarPalette;
  calendarMotionId: string;
};

const DayCell = ({
  day,
  index,
  selectedDate,
  currentMonth,
  disabled,
  onSelectDay,
  palette,
  calendarMotionId,
}: DayCellProps) => {
  const isSelected = isSameDay(day, selectedDate);
  const inMonth = isSameMonth(day, currentMonth);
  const today = isToday(day);
  const isDisabled = disabled?.(day) ?? false;
  const isInteractive = inMonth && !isDisabled;

  return (
    <motion.button
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0.8 }}
      onClick={() => isInteractive && onSelectDay(day)}
      style={{
        position: "relative",
        aspectRatio: "1 / 1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: today && !isSelected ? 700 : 500,
        borderRadius: 8,
        border: "none",
        background: "transparent",
        cursor: isInteractive ? "pointer" : "default",
        pointerEvents: isInteractive ? "auto" : "none",
        color: inMonth ? palette.textPrimary : palette.textDim,
        padding: 0,
        fontFamily: "inherit",
      }}
      transition={{
        delay: index * 0.012,
        duration: 0.3,
        ease: SPRING_EASE,
      }}
      whileHover={{
        scale: isInteractive ? 1.04 : 1,
        y: isInteractive ? -1.5 : 0,
        backgroundColor: isInteractive
          ? palette.dayHoverBackground
          : "transparent",
        boxShadow: isInteractive ? palette.dayHoverShadow : "none",
      }}
      whileTap={{ scale: isInteractive ? 0.96 : 1, y: isInteractive ? 0 : 0 }}
    >
      {isSelected && inMonth && (
        <motion.div
          layoutId={`${calendarMotionId}-selected-day`}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 8,
            background: palette.selectedGradient,
            boxShadow: "0 8px 28px -12px rgba(0, 0, 0, 0.34)",
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        />
      )}
      <span
        style={{
          position: "relative",
          zIndex: 10,
          color: isSelected && inMonth ? palette.selectedForeground : undefined,
          fontWeight: isSelected && inMonth ? 600 : undefined,
        }}
      >
        {format(day, "d")}
      </span>
      {today && !isSelected && (
        <motion.span
          layoutId={`${calendarMotionId}-today-dot`}
          style={{
            position: "absolute",
            bottom: 4,
            height: 4,
            width: 4,
            borderRadius: "50%",
            backgroundColor: palette.todayDot,
          }}
        />
      )}
    </motion.button>
  );
};

type NavButtonProps = {
  children: React.ReactNode;
  isDark?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
};

const NavButton = ({ children, isDark, onClick, ...rest }: NavButtonProps) => (
  <motion.button
    onClick={onClick}
    style={{
      height: 28,
      width: 28,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      backgroundColor: "transparent",
      color: isDark ? "#f5f5f5" : "#0a0a0a",
      border: "none",
      cursor: "pointer",
      padding: 0,
    }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.92 }}
    {...rest}
  >
    {children}
  </motion.button>
);
