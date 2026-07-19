"use client";

import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  type PanInfo,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-primary-foreground:#ffffff] [--ic-shadow-soft:0_1px_2px_-1px_rgba(15,23,42,0.08),0_2px_6px_-2px_rgba(15,23,42,0.08)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-primary-foreground:var(--ic-primary-foreground)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-primary-foreground:#111111] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_1px_2px_-1px_rgba(0,0,0,0.3),0_2px_6px_-2px_rgba(0,0,0,0.3)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const controlCornerClassName =
  "supports-[corner-shape:squircle]:corner-squircle";

const focusVisibleClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ic-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ic-card)]";

const PILL_SPRING = {
  type: "spring",
  stiffness: 480,
  damping: 30,
  mass: 0.8,
} as const;
const ROW_SPRING = { type: "spring", stiffness: 340, damping: 32 } as const;
const DISSOLVE_SPRING = {
  type: "spring",
  stiffness: 280,
  damping: 28,
} as const;
const PRESS_SPRING = {
  type: "spring",
  stiffness: 520,
  damping: 26,
} as const;

const WEEK_LENGTH = 7;
const DAY_ROW_HEIGHT = 48;
const SWIPE_DISTANCE_THRESHOLD = 45;
const SWIPE_VELOCITY_THRESHOLD = 350;
const HANDLE_DRAG_THRESHOLD = 8;
const ROW_STAGGER_SECONDS = 0.045;
const TILT_RANGE_PX = 120;
const TILT_RANGE_DEG = 3.5;
const ROW_DISSOLVE_BLUR_PX = 8;
const LABEL_DISSOLVE_BLUR_PX = 4;

type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type RowCustom = { delay: number; direction: number };

const rowVariants = {
  center: ({ delay, direction }: RowCustom) => ({
    filter: "blur(0px)",
    height: DAY_ROW_HEIGHT,
    opacity: 1,
    scale: 1,
    transition: direction === 0 ? { ...ROW_SPRING, delay } : DISSOLVE_SPRING,
  }),
  enter: ({ direction }: RowCustom) =>
    direction === 0
      ? { filter: "blur(0px)", height: 0, opacity: 0, scale: 1 }
      : {
          filter: `blur(${ROW_DISSOLVE_BLUR_PX}px)`,
          height: DAY_ROW_HEIGHT,
          opacity: 0,
          scale: 0.96,
        },
  exit: ({ direction }: RowCustom) =>
    direction === 0
      ? {
          filter: "blur(0px)",
          height: 0,
          opacity: 0,
          scale: 1,
          transition: ROW_SPRING,
        }
      : {
          filter: `blur(${ROW_DISSOLVE_BLUR_PX}px)`,
          height: DAY_ROW_HEIGHT,
          opacity: 0,
          scale: 0.96,
          transition: DISSOLVE_SPRING,
        },
};

const labelVariants = {
  center: { filter: "blur(0px)", opacity: 1 },
  enter: { filter: `blur(${LABEL_DISSOLVE_BLUR_PX}px)`, opacity: 0 },
  exit: { filter: `blur(${LABEL_DISSOLVE_BLUR_PX}px)`, opacity: 0 },
};

function WeekCalendarDay({
  date,
  isCurrentToday,
  isSelected,
  motionId,
  onSelect,
  reduceMotion,
}: {
  date: Date;
  isCurrentToday: boolean;
  isSelected: boolean;
  motionId: string;
  onSelect: (date: Date) => void;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.button
      aria-current={isCurrentToday ? "date" : undefined}
      aria-label={format(date, "EEEE, MMMM d, yyyy")}
      aria-pressed={isSelected}
      className="group relative flex h-12 cursor-pointer items-center justify-center outline-none"
      onClick={() => onSelect(date)}
      transition={PRESS_SPRING}
      type="button"
      whileHover={reduceMotion ? undefined : { scale: 1.06 }}
      whileTap={reduceMotion ? undefined : { scale: 0.86 }}
    >
      {isCurrentToday && !isSelected ? (
        <motion.span
          className={cn(
            controlCornerClassName,
            "absolute size-9 rounded-full border-[1.5px] border-[var(--ic-primary)]"
          )}
          layoutId={reduceMotion ? undefined : `${motionId}-today`}
          transition={PILL_SPRING}
        />
      ) : null}
      {isSelected ? (
        <motion.span
          className={cn(
            controlCornerClassName,
            "absolute size-9 rounded-full bg-[var(--ic-primary)] shadow-[0_3px_10px_-2px_var(--ic-ring),inset_0_1px_0_0_rgba(255,255,255,0.2)]"
          )}
          layoutId={reduceMotion ? undefined : `${motionId}-selected`}
          transition={PILL_SPRING}
        />
      ) : (
        <span
          className={cn(
            controlCornerClassName,
            "absolute size-9 rounded-full transition-colors duration-150 group-hover:bg-[var(--ic-accent)]"
          )}
        />
      )}
      <span className="relative flex size-9 items-center justify-center">
        <span
          className={cn(
            "font-medium text-[13px] tabular-nums transition-colors duration-150",
            isSelected && "font-semibold text-[var(--ic-primary-foreground)]",
            !isSelected &&
              isCurrentToday &&
              "font-semibold text-[var(--ic-primary)]",
            !(isSelected || isCurrentToday) &&
              "text-[var(--ic-card-foreground)]"
          )}
        >
          {date.getDate()}
        </span>
      </span>
    </motion.button>
  );
}

function getMonthWeeks(monthAnchor: Date, weekStartsOn: WeekStartsOn) {
  const start = startOfWeek(startOfMonth(monthAnchor), { weekStartsOn });
  const end = endOfWeek(endOfMonth(monthAnchor), { weekStartsOn });
  const days = eachDayOfInterval({ start, end });

  const weeks: Date[][] = [];
  for (let index = 0; index < days.length; index += WEEK_LENGTH) {
    weeks.push(days.slice(index, index + WEEK_LENGTH));
  }
  return weeks;
}

export type WeekCalendarProps = Readonly<
  {
    /** Controlled selected date. Pass `null` to clear the highlight. */
    selected?: Date | null;
    /** Initial selected day for uncontrolled usage. Defaults to today. */
    defaultSelected?: Date | null;
    /** Called when the user taps a day, including outside-month days. */
    onSelect?: (date: Date) => void;
    /** Controlled expanded state — collapsed shows a week, expanded shows the month. */
    expanded?: boolean;
    /** Initial expanded state for uncontrolled usage. @default false */
    defaultExpanded?: boolean;
    /** Called whenever the week/month morph toggles, from the grabber-handle drag or Enter/Space. */
    onExpandedChange?: (expanded: boolean) => void;
    /** Overrides the first day of the week. @default 0 (Sunday) */
    weekStartsOn?: WeekStartsOn;
  } & Omit<ComponentPropsWithoutRef<"div">, "onSelect">
>;

// Week strip that morphs into a full month grid, with spring physics,
// swipe-to-change-week, and a draggable grabber handle.
export const WeekCalendar = forwardRef<HTMLDivElement, WeekCalendarProps>(
  (
    {
      className,
      selected: selectedProp,
      defaultSelected,
      onSelect,
      expanded: expandedProp,
      defaultExpanded = false,
      onExpandedChange,
      weekStartsOn = 0,
      ...props
    },
    ref
  ) => {
    const motionId = useId();
    const reduceMotion = useReducedMotion();
    const today = useMemo(() => startOfDay(new Date()), []);

    const [selectedState, setSelectedState] = useState<Date | null>(
      defaultSelected !== undefined ? defaultSelected : today
    );
    const selected = selectedProp !== undefined ? selectedProp : selectedState;

    const [expandedState, setExpandedState] = useState(defaultExpanded);
    const expanded = expandedProp ?? expandedState;

    const [anchor, setAnchor] = useState(() =>
      selected ? startOfDay(selected) : today
    );
    const [direction, setDirection] = useState(0);

    const dragX = useMotionValue(0);
    const dragTilt = useTransform(
      dragX,
      [-TILT_RANGE_PX, TILT_RANGE_PX],
      [-TILT_RANGE_DEG, TILT_RANGE_DEG]
    );

    useEffect(() => {
      if (selectedProp) setAnchor(startOfDay(selectedProp));
    }, [selectedProp]);

    useEffect(() => {
      if (expanded) dragX.set(0);
    }, [expanded, dragX]);

    const weeks = useMemo(
      () => getMonthWeeks(anchor, weekStartsOn),
      [anchor, weekStartsOn]
    );

    const weekdayLabels = useMemo(() => {
      const base = startOfWeek(anchor, { weekStartsOn });
      return Array.from({ length: WEEK_LENGTH }, (_, index) =>
        format(addDays(base, index), "EEEEE")
      );
    }, [anchor, weekStartsOn]);

    const anchorWeekStart = startOfWeek(anchor, { weekStartsOn });
    const anchorWeekIndex = Math.max(
      weeks.findIndex((week) => isSameDay(week[0], anchorWeekStart)),
      0
    );

    const monthLabel = format(anchor, "MMMM yyyy");
    const rangeLabel = expanded
      ? monthLabel
      : `${format(weeks[anchorWeekIndex]?.[0] ?? anchor, "MMM d")} – ${format(
          weeks[anchorWeekIndex]?.[6] ?? anchor,
          "MMM d"
        )}`;

    const isViewingCurrentPeriod = expanded
      ? isSameMonth(anchor, today)
      : (weeks[anchorWeekIndex]?.some((date) => isSameDay(date, today)) ??
        false);

    const setExpanded = (next: boolean) => {
      if (expandedProp === undefined) setExpandedState(next);
      onExpandedChange?.(next);
    };

    const selectDay = (date: Date) => {
      const normalized = startOfDay(date);
      if (selectedProp === undefined) setSelectedState(normalized);
      onSelect?.(normalized);
      setAnchor(normalized);
    };

    const goPrev = () => {
      setDirection(-1);
      setAnchor((prev) => (expanded ? subMonths(prev, 1) : addDays(prev, -7)));
    };

    const goNext = () => {
      setDirection(1);
      setAnchor((prev) => (expanded ? addMonths(prev, 1) : addDays(prev, 7)));
    };

    const jumpToToday = () => {
      setDirection(isBefore(anchor, today) ? 1 : -1);
      setAnchor(today);
    };

    const toggleExpanded = () => {
      setDirection(0);
      setExpanded(!expanded);
    };

    const handleSwipeEnd = (_event: unknown, info: PanInfo) => {
      if (expanded) return;
      if (
        info.offset.x <= -SWIPE_DISTANCE_THRESHOLD ||
        info.velocity.x <= -SWIPE_VELOCITY_THRESHOLD
      ) {
        goNext();
      } else if (
        info.offset.x >= SWIPE_DISTANCE_THRESHOLD ||
        info.velocity.x >= SWIPE_VELOCITY_THRESHOLD
      ) {
        goPrev();
      }
    };

    const handleDragTriggeredRef = useRef(false);

    const handleHandleDragStart = () => {
      handleDragTriggeredRef.current = false;
    };

    const handleHandleDrag = (_event: unknown, info: PanInfo) => {
      if (handleDragTriggeredRef.current) return;
      if (info.offset.y > HANDLE_DRAG_THRESHOLD && !expanded) {
        handleDragTriggeredRef.current = true;
        setExpanded(true);
      } else if (info.offset.y < -HANDLE_DRAG_THRESHOLD && expanded) {
        handleDragTriggeredRef.current = true;
        setExpanded(false);
      }
    };

    return (
      <div
        className={cn(
          componentThemeClassName,
          "w-full max-w-[21rem] select-none rounded-2xl border border-[var(--ic-border)] bg-[var(--ic-card)] px-4 pt-4 pb-2 font-sans text-[var(--ic-card-foreground)] ring-1 ring-black/[0.03] dark:ring-white/[0.06]",
          "shadow-[var(--ic-shadow-soft)]",
          className
        )}
        data-expanded={expanded}
        data-slot="week-calendar"
        ref={ref}
        {...props}
      >
        <span aria-live="polite" className="sr-only">
          {selected
            ? `Selected ${format(selected, "EEEE, MMMM d, yyyy")}`
            : "No date selected"}
        </span>

        <div className="mb-2.5 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="min-w-0 overflow-hidden">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.p
                  animate="center"
                  className="truncate font-semibold text-[16px] tracking-tight"
                  exit="exit"
                  initial={reduceMotion ? false : "enter"}
                  key={rangeLabel}
                  transition={DISSOLVE_SPRING}
                  variants={labelVariants}
                >
                  {rangeLabel}
                </motion.p>
              </AnimatePresence>
            </div>
            <AnimatePresence initial={false}>
              {isViewingCurrentPeriod ? null : (
                <motion.button
                  animate={{ opacity: 1, scale: 1 }}
                  aria-label="Jump to today"
                  className={cn(
                    focusVisibleClassName,
                    "shrink-0 cursor-pointer rounded-full bg-[var(--ic-accent)] px-2.5 py-1 font-semibold text-[11px] text-[var(--ic-card-foreground)] transition-colors duration-150 hover:bg-[var(--ic-border)]"
                  )}
                  exit={{ opacity: 0, scale: 0.8 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  onClick={jumpToToday}
                  transition={PRESS_SPRING}
                  type="button"
                  whileTap={{ scale: 0.9 }}
                >
                  Today
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            <motion.button
              aria-label={expanded ? "Previous month" : "Previous week"}
              className={cn(
                controlCornerClassName,
                focusVisibleClassName,
                "flex size-7 cursor-pointer items-center justify-center rounded-full text-[var(--ic-muted-foreground)] transition-colors duration-150 hover:bg-[var(--ic-accent)] hover:text-[var(--ic-card-foreground)]"
              )}
              onClick={goPrev}
              transition={PRESS_SPRING}
              type="button"
              whileTap={{ scale: 0.82 }}
            >
              <ChevronLeft aria-hidden size={14} strokeWidth={2.25} />
            </motion.button>
            <motion.button
              aria-label={expanded ? "Next month" : "Next week"}
              className={cn(
                controlCornerClassName,
                focusVisibleClassName,
                "flex size-7 cursor-pointer items-center justify-center rounded-full text-[var(--ic-muted-foreground)] transition-colors duration-150 hover:bg-[var(--ic-accent)] hover:text-[var(--ic-card-foreground)]"
              )}
              onClick={goNext}
              transition={PRESS_SPRING}
              type="button"
              whileTap={{ scale: 0.82 }}
            >
              <ChevronRight aria-hidden size={14} strokeWidth={2.25} />
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-7 px-0.5 pb-1">
          {weekdayLabels.map((label, index) => (
            <span
              className="text-center font-semibold text-[10px] text-[var(--ic-muted-foreground)] uppercase tracking-wide"
              key={`${label}-${index}`}
            >
              {label}
            </span>
          ))}
        </div>

        <motion.div
          className="flex touch-pan-y flex-col"
          drag={expanded ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.55}
          onDragEnd={handleSwipeEnd}
          style={{ rotate: reduceMotion ? 0 : dragTilt, x: dragX }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {weeks
              .map((week, index) => ({ index, week }))
              .filter(({ index }) => expanded || index === anchorWeekIndex)
              .map(({ week, index }) => (
                <motion.div
                  animate="center"
                  className="grid grid-cols-7"
                  custom={
                    {
                      delay:
                        expanded && direction === 0
                          ? Math.abs(index - anchorWeekIndex) *
                            ROW_STAGGER_SECONDS
                          : 0,
                      direction,
                    } satisfies RowCustom
                  }
                  exit={reduceMotion ? undefined : "exit"}
                  initial={reduceMotion ? false : "enter"}
                  key={week[0].toISOString()}
                  layout="position"
                  style={{ overflow: "hidden" }}
                  variants={rowVariants}
                >
                  {week.map((date) => (
                    <WeekCalendarDay
                      date={date}
                      isCurrentToday={isSameDay(date, today)}
                      isSelected={selected ? isSameDay(date, selected) : false}
                      key={date.toISOString()}
                      motionId={motionId}
                      onSelect={selectDay}
                      reduceMotion={reduceMotion}
                    />
                  ))}
                </motion.div>
              ))}
          </AnimatePresence>
        </motion.div>

        <div className="flex justify-center pt-1.5 pb-0.5">
          <motion.button
            aria-expanded={expanded}
            aria-label={
              expanded ? "Collapse to week view" : "Expand to month view"
            }
            className={cn(
              focusVisibleClassName,
              "h-[5px] w-9 cursor-grab touch-none rounded-full bg-[var(--ic-border)] outline-none transition-colors duration-150 hover:bg-[var(--ic-muted-foreground)]/40 active:cursor-grabbing"
            )}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0}
            dragMomentum={false}
            onDrag={handleHandleDrag}
            onDragStart={handleHandleDragStart}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleExpanded();
              }
            }}
            transition={PRESS_SPRING}
            type="button"
            whileHover={{ scaleX: 1.15 }}
            whileTap={{ scaleX: 1.3 }}
          />
        </div>
      </div>
    );
  }
);

WeekCalendar.displayName = "WeekCalendar";
