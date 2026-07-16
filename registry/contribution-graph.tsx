"use client";

import type { Day as WeekDay } from "date-fns";
import {
  differenceInCalendarDays,
  eachDayOfInterval,
  formatISO,
  getDay,
  getMonth,
  getYear,
  nextDay,
  parseISO,
  subDays,
  subWeeks,
} from "date-fns";
import {
  type CSSProperties,
  createContext,
  type FocusEvent,
  Fragment,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type Activity = {
  date: string;
  count: number;
  level: number;
};

type Week = Array<Activity | undefined>;

export type Labels = {
  months?: string[];
  weekdays?: string[];
  totalCount?: string;
  legend?: {
    less?: string;
    more?: string;
  };
};

type MonthLabel = {
  weekIndex: number;
  label: string;
};

const DEFAULT_MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DEFAULT_LABELS: Labels = {
  months: DEFAULT_MONTH_LABELS,
  weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  totalCount: "{{count}} activities in {{year}}",
  legend: {
    less: "Less",
    more: "More",
  },
};

/** Rolling-window label used when data comes from a GitHub username. */
const ROLLING_TOTAL_LABEL = "{{count}} contributions in the last year";

/** GitHub-style green level ramp, shared by blocks and the legend. */
const LEVEL_CLASSES = cn(
  'data-[level="0"]:fill-muted',
  'data-[level="1"]:fill-emerald-200 dark:data-[level="1"]:fill-emerald-900',
  'data-[level="2"]:fill-emerald-400 dark:data-[level="2"]:fill-emerald-700',
  'data-[level="3"]:fill-emerald-600 dark:data-[level="3"]:fill-emerald-500',
  'data-[level="4"]:fill-emerald-800 dark:data-[level="4"]:fill-emerald-300'
);

/** Entrance timing: the muted grid fades in as a canvas, then colored blocks
 *  light up in rounds by activity level — lightest greens first, darkest
 *  last — so the year reads as charging up. */
const LEVEL_REVEAL_BASE = 220;
const LEVEL_REVEAL_STEP = 170;
const LEVEL_REVEAL_JITTER = 110;

/** Small deterministic per-block offset so each level's round shimmers in
 *  instead of snapping on as one frame. */
const revealJitter = (weekIndex: number, dayIndex: number) =>
  Math.round(
    ((((weekIndex * 7 + dayIndex) * 137) % 97) / 97) * LEVEL_REVEAL_JITTER
  );

const ENTRANCE_KEYFRAMES = `@keyframes iconiq-cg-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes iconiq-cg-pop {
  0% { opacity: 0; transform: scale(0.4); }
  65% { opacity: 1; transform: scale(1.12); }
  100% { opacity: 1; transform: scale(1); }
}`;

const CONTRIBUTIONS_API = "https://github-contributions-api.jogruber.de";

type ContributionApiResponse = {
  total: Record<string, number>;
  contributions: Activity[];
};

type FetchedContributions = {
  contributions: Activity[];
  total: number;
};

/** One in-flight/settled request per username, so remounts replay the
 *  entrance without refetching. */
const contributionsCache = new Map<string, Promise<FetchedContributions>>();

const fetchContributions = (
  username: string
): Promise<FetchedContributions> => {
  const cached = contributionsCache.get(username);

  if (cached) {
    return cached;
  }

  const url = new URL(
    `/v4/${encodeURIComponent(username)}?y=last`,
    CONTRIBUTIONS_API
  );

  const request = fetch(url).then(async (response) => {
    if (!response.ok) {
      throw new Error(
        `GitHub contributions request failed (${response.status}).`
      );
    }

    const data = (await response.json()) as ContributionApiResponse;
    const total =
      data.total.lastYear ??
      data.contributions.reduce((sum, activity) => sum + activity.count, 0);

    return { contributions: data.contributions, total };
  });

  request.catch(() => contributionsCache.delete(username));
  contributionsCache.set(username, request);

  return request;
};

type FetchStatus = "idle" | "loading" | "success" | "error";

type FetchState = FetchedContributions & {
  status: FetchStatus;
};

const IDLE_FETCH_STATE: FetchState = {
  status: "idle",
  contributions: [],
  total: 0,
};

const useGitHubContributions = (username?: string): FetchState => {
  const [state, setState] = useState<FetchState>(IDLE_FETCH_STATE);

  useEffect(() => {
    if (!username) {
      setState(IDLE_FETCH_STATE);
      return;
    }

    let cancelled = false;
    setState({ status: "loading", contributions: [], total: 0 });

    fetchContributions(username)
      .then(({ contributions, total }) => {
        if (!cancelled) {
          setState({ status: "success", contributions, total });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ status: "error", contributions: [], total: 0 });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  return state;
};

/** Level-0 stand-in for the last 52 weeks so the grid keeps its exact
 *  footprint (and shimmers) while a username fetch is in flight. */
const createPlaceholderData = (): Activity[] => {
  const today = new Date();

  return eachDayOfInterval({ start: subDays(today, 7 * 52), end: today }).map(
    (day) => ({
      date: formatISO(day, { representation: "date" }),
      count: 0,
      level: 0,
    })
  );
};

type ContributionGraphContextType = {
  data: Activity[];
  weeks: Week[];
  animated: boolean;
  blockMargin: number;
  blockRadius: number;
  blockSize: number;
  contentKey: string;
  fontSize: number;
  labels: Labels;
  labelHeight: number;
  loading: boolean;
  maxLevel: number;
  totalCount: number;
  weekStart: WeekDay;
  year: number;
  width: number;
  height: number;
};

const ContributionGraphContext =
  createContext<ContributionGraphContextType | null>(null);

const useContributionGraph = () => {
  const context = useContext(ContributionGraphContext);

  if (!context) {
    throw new Error(
      "ContributionGraph components must be used within a ContributionGraph"
    );
  }

  return context;
};

type BlockTooltipPayload = {
  activity: Activity;
  x: number;
  y: number;
  content?: ReactNode;
};

type BlockTooltipApi = {
  show: (payload: BlockTooltipPayload) => void;
  hide: () => void;
};

const BlockTooltipApiContext = createContext<BlockTooltipApi | null>(null);
const BlockTooltipStateContext = createContext<BlockTooltipPayload | null>(
  null
);

const useBlockTooltipApi = () => useContext(BlockTooltipApiContext);

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
};

const formatCommitLabel = (count: number) =>
  `${count} commit${count === 1 ? "" : "s"}`;

const formatActivityDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parseISO(date));

/** One shared floating tooltip for the whole grid. Positioning SVG cells with
 *  per-block Radix roots glitches on fast hover; this tracks the active cell
 *  and slides to it instead. */
const ContributionGraphBlockTooltip = () => {
  const tooltip = useContext(BlockTooltipStateContext);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [exitPayload, setExitPayload] = useState<BlockTooltipPayload | null>(
    null
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (tooltip) {
      setExitPayload(tooltip);
    }
  }, [tooltip]);

  const isOpen = tooltip !== null;

  useEffect(() => {
    if (isOpen) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timeout = window.setTimeout(() => setExitPayload(null), 160);
    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  const payload = tooltip ?? exitPayload;

  if (!(mounted && payload)) {
    return null;
  }

  const scale = prefersReducedMotion || visible ? 1 : 0.96;

  return createPortal(
    <div
      aria-hidden
      className="pointer-events-none fixed z-50"
      style={{
        left: payload.x,
        top: payload.y,
        opacity: visible ? 1 : 0,
        transform: `translate(-50%, calc(-100% - 8px)) scale(${scale})`,
        transitionProperty: prefersReducedMotion
          ? "opacity"
          : "left, top, opacity, transform",
        transitionDuration: prefersReducedMotion
          ? "120ms"
          : "140ms, 140ms, 160ms, 200ms",
        transitionTimingFunction: prefersReducedMotion
          ? "ease"
          : "cubic-bezier(0.22, 1, 0.36, 1), cubic-bezier(0.22, 1, 0.36, 1), ease, cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <div className="relative rounded-lg border border-white/10 bg-zinc-950 px-2.5 py-1 text-white shadow-[0_8px_26px_-8px_rgba(0,0,0,0.55)] dark:border-black/10 dark:bg-zinc-100 dark:text-zinc-950">
        {payload.content ?? (
          <div className="flex items-baseline gap-1.5 whitespace-nowrap text-[11px] leading-none">
            <span className="font-semibold">
              {formatCommitLabel(payload.activity.count)}
            </span>
            <span className="text-zinc-400 dark:text-zinc-600">
              on {formatActivityDate(payload.activity.date)}
            </span>
          </div>
        )}
        <span
          aria-hidden
          className="absolute top-full left-1/2 -mt-px -translate-x-1/2 border-x-[5px] border-x-transparent border-t-[6px] border-t-zinc-950 dark:border-t-zinc-100"
        />
      </div>
    </div>,
    document.body
  );
};

const ContributionGraphTooltipProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [tooltip, setTooltip] = useState<BlockTooltipPayload | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const api = useMemo<BlockTooltipApi>(
    () => ({
      show: (payload) => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }
        setTooltip(payload);
      },
      hide: () => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
        // Brief delay so moving between adjacent cells doesn't flicker.
        hideTimeoutRef.current = setTimeout(() => {
          setTooltip(null);
          hideTimeoutRef.current = null;
        }, 40);
      },
    }),
    []
  );

  useEffect(
    () => () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    },
    []
  );

  // The tooltip is positioned in viewport space from a hover-time measurement,
  // so any scroll (page or the calendar's own horizontal scroller) or resize
  // would leave it stranded. Dismiss it immediately instead of tracking.
  useEffect(() => {
    const dismiss = () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      setTooltip(null);
    };

    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    return () => {
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
    };
  }, []);

  return (
    <BlockTooltipApiContext.Provider value={api}>
      <BlockTooltipStateContext.Provider value={tooltip}>
        {children}
        <ContributionGraphBlockTooltip />
      </BlockTooltipStateContext.Provider>
    </BlockTooltipApiContext.Provider>
  );
};

const fillHoles = (activities: Activity[]): Activity[] => {
  if (activities.length === 0) {
    return [];
  }

  // Sort activities by date to ensure correct date range
  const sortedActivities = [...activities].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const calendar = new Map<string, Activity>(
    activities.map((a) => [a.date, a])
  );

  const firstActivity = sortedActivities[0] as Activity;
  const lastActivity = sortedActivities.at(-1);

  if (!lastActivity) {
    return [];
  }

  return eachDayOfInterval({
    start: parseISO(firstActivity.date),
    end: parseISO(lastActivity.date),
  }).map((day) => {
    const date = formatISO(day, { representation: "date" });

    if (calendar.has(date)) {
      return calendar.get(date) as Activity;
    }

    return {
      date,
      count: 0,
      level: 0,
    };
  });
};

const groupByWeeks = (
  activities: Activity[],
  weekStart: WeekDay = 0
): Week[] => {
  if (activities.length === 0) {
    return [];
  }

  const normalizedActivities = fillHoles(activities);
  const firstActivity = normalizedActivities[0] as Activity;
  const firstDate = parseISO(firstActivity.date);
  const firstCalendarDate =
    getDay(firstDate) === weekStart
      ? firstDate
      : subWeeks(nextDay(firstDate, weekStart), 1);

  const paddedActivities = [
    ...(new Array(differenceInCalendarDays(firstDate, firstCalendarDate)).fill(
      undefined
    ) as Activity[]),
    ...normalizedActivities,
  ];

  const numberOfWeeks = Math.ceil(paddedActivities.length / 7);

  return new Array(numberOfWeeks)
    .fill(undefined)
    .map((_, weekIndex) =>
      paddedActivities.slice(weekIndex * 7, weekIndex * 7 + 7)
    );
};

const getMonthLabels = (
  weeks: Week[],
  monthNames: string[] = DEFAULT_MONTH_LABELS
): MonthLabel[] => {
  return weeks
    .reduce<MonthLabel[]>((labels, week, weekIndex) => {
      const firstActivity = week.find((activity) => activity !== undefined);

      if (!firstActivity) {
        throw new Error(
          `Unexpected error: Week ${weekIndex + 1} is empty: [${week}].`
        );
      }

      const month = monthNames[getMonth(parseISO(firstActivity.date))];

      if (!month) {
        const monthName = new Date(firstActivity.date).toLocaleString("en-US", {
          month: "short",
        });
        throw new Error(
          `Unexpected error: undefined month label for ${monthName}.`
        );
      }

      const prevLabel = labels.at(-1);

      if (weekIndex === 0 || !prevLabel || prevLabel.label !== month) {
        return labels.concat({ weekIndex, label: month });
      }

      return labels;
    }, [])
    .filter(({ weekIndex }, index, labels) => {
      const minWeeks = 3;

      if (index === 0) {
        return labels[1] && labels[1].weekIndex - weekIndex >= minWeeks;
      }

      if (index === labels.length - 1) {
        return weeks.slice(weekIndex).length >= minWeeks;
      }

      return true;
    });
};

export type ContributionGraphProps = HTMLAttributes<HTMLDivElement> & {
  data?: Activity[];
  username?: string;
  animated?: boolean;
  blockMargin?: number;
  blockRadius?: number;
  blockSize?: number;
  fontSize?: number;
  labels?: Labels;
  maxLevel?: number;
  style?: CSSProperties;
  totalCount?: number;
  weekStart?: WeekDay;
  children: ReactNode;
  className?: string;
};

export const ContributionGraph = ({
  data,
  username = undefined,
  animated = true,
  blockMargin = 4,
  blockRadius = 2,
  blockSize = 12,
  fontSize = 14,
  labels: labelsProp = undefined,
  maxLevel: maxLevelProp = 4,
  style = {},
  totalCount: totalCountProp = undefined,
  weekStart = 0,
  className,
  children,
  ...props
}: ContributionGraphProps) => {
  const maxLevel = Math.max(1, maxLevelProp);
  const hasStaticData = Boolean(data && data.length > 0);
  const fetched = useGitHubContributions(hasStaticData ? undefined : username);
  const loading = fetched.status === "loading";

  const resolvedData = useMemo(() => {
    if (hasStaticData) {
      return data as Activity[];
    }

    if (fetched.status === "success") {
      return fetched.contributions;
    }

    if (fetched.status === "loading") {
      return createPlaceholderData();
    }

    return [];
  }, [data, fetched, hasStaticData]);

  const weeks = useMemo(
    () => groupByWeeks(resolvedData, weekStart),
    [resolvedData, weekStart]
  );
  const LABEL_MARGIN = 8;

  const labels = { ...DEFAULT_LABELS, ...labelsProp };

  if (username && !hasStaticData && !labelsProp?.totalCount) {
    labels.totalCount = ROLLING_TOTAL_LABEL;
  }

  const labelHeight = fontSize + LABEL_MARGIN;

  const year =
    resolvedData.length > 0
      ? getYear(parseISO((resolvedData.at(-1) as Activity).date))
      : new Date().getFullYear();

  let totalCount = resolvedData.reduce(
    (sum, activity) => sum + activity.count,
    0
  );

  if (typeof totalCountProp === "number") {
    totalCount = totalCountProp;
  } else if (fetched.status === "success") {
    totalCount = fetched.total;
  }

  const width = weeks.length * (blockSize + blockMargin) - blockMargin;
  const height = labelHeight + (blockSize + blockMargin) * 7 - blockMargin;

  // Remounts the calendar whenever the underlying dataset changes, so the
  // wave entrance replays when a fetch lands or the username swaps.
  const contentKey = `${username ?? "static"}-${fetched.status}`;

  if (fetched.status === "error") {
    return (
      <div
        className={cn(
          "flex w-max max-w-full items-center gap-2 rounded-lg border border-border border-dashed px-4 py-3 text-muted-foreground text-sm",
          className
        )}
        style={{ fontSize, ...style }}
        {...props}
      >
        Unable to load contributions for @{username}.
      </div>
    );
  }

  if (resolvedData.length === 0) {
    return null;
  }

  return (
    <ContributionGraphContext.Provider
      value={{
        data: resolvedData,
        weeks,
        animated,
        blockMargin,
        blockRadius,
        blockSize,
        contentKey,
        fontSize,
        labels,
        labelHeight,
        loading,
        maxLevel,
        totalCount,
        weekStart,
        year,
        width,
        height,
      }}
    >
      <div
        className={cn("flex w-max max-w-full flex-col gap-2", className)}
        style={{ fontSize, ...style }}
        {...props}
      >
        {animated ? <style>{ENTRANCE_KEYFRAMES}</style> : null}
        <ContributionGraphTooltipProvider>
          {children}
        </ContributionGraphTooltipProvider>
      </div>
    </ContributionGraphContext.Provider>
  );
};

export type ContributionGraphBlockProps = HTMLAttributes<SVGRectElement> & {
  activity: Activity;
  dayIndex: number;
  showTooltip?: boolean;
  weekIndex: number;
};

export const ContributionGraphBlock = ({
  activity,
  dayIndex,
  showTooltip = true,
  weekIndex,
  className,
  style,
  children,
  ...props
}: ContributionGraphBlockProps) => {
  const {
    animated,
    blockSize,
    blockMargin,
    blockRadius,
    labelHeight,
    loading,
    maxLevel,
  } = useContributionGraph();
  const tooltipApi = useBlockTooltipApi();

  // If tooltips are turned off (or the cell unmounts) while its bubble is open,
  // there's no pointer-leave to close it — dismiss to be safe.
  useEffect(() => {
    if (showTooltip) {
      return;
    }

    tooltipApi?.hide();
  }, [showTooltip, tooltipApi]);

  if (activity.level < 0 || activity.level > maxLevel) {
    throw new RangeError(
      `Provided activity level ${activity.level} for ${activity.date} is out of range. It must be between 0 and ${maxLevel}.`
    );
  }

  // Level-0 cells fade in together as the canvas; colored cells join in
  // rounds by level, each round offset by a small per-block jitter.
  const entranceDelay =
    activity.level === 0
      ? 0
      : LEVEL_REVEAL_BASE +
        (activity.level - 1) * LEVEL_REVEAL_STEP +
        revealJitter(weekIndex, dayIndex);
  // Negative delays start the shimmer mid-cycle, so loading reads as a
  // scattered flicker instead of every block pulsing in unison.
  const animationDelay = loading
    ? `${-revealJitter(weekIndex, dayIndex) * 10}ms`
    : `${entranceDelay}ms`;
  const showEntrance = animated && !loading;

  const revealTooltip = (
    event: MouseEvent<SVGRectElement> | FocusEvent<SVGRectElement>
  ) => {
    if (!(showTooltip && tooltipApi) || loading) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    tooltipApi.show({
      activity,
      x: rect.left + rect.width / 2,
      y: rect.top,
      content: children,
    });
  };

  return (
    <rect
      aria-label={`${formatCommitLabel(activity.count)} on ${activity.date}`}
      className={cn(
        "origin-center [transform-box:fill-box]",
        LEVEL_CLASSES,
        loading
          ? "animate-pulse"
          : "transition-transform duration-200 ease-out hover:scale-125",
        showEntrance &&
          (activity.level === 0
            ? "animate-[iconiq-cg-fade_0.4s_ease-out_backwards]"
            : "animate-[iconiq-cg-pop_0.45s_cubic-bezier(0.22,1,0.36,1)_backwards]"),
        "motion-reduce:animate-none",
        className
      )}
      data-count={activity.count}
      data-date={activity.date}
      data-level={activity.level}
      height={blockSize}
      onBlur={showTooltip ? () => tooltipApi?.hide() : undefined}
      onFocus={showTooltip ? revealTooltip : undefined}
      onMouseEnter={showTooltip ? revealTooltip : undefined}
      onMouseLeave={showTooltip ? () => tooltipApi?.hide() : undefined}
      rx={blockRadius}
      ry={blockRadius}
      style={{
        ...(showEntrance || loading ? { animationDelay } : {}),
        ...style,
      }}
      width={blockSize}
      x={(blockSize + blockMargin) * weekIndex}
      y={labelHeight + (blockSize + blockMargin) * dayIndex}
      {...props}
    />
  );
};

export type ContributionGraphCalendarProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  hideMonthLabels?: boolean;
  className?: string;
  children: (props: {
    activity: Activity;
    dayIndex: number;
    weekIndex: number;
  }) => ReactNode;
};

export const ContributionGraphCalendar = ({
  hideMonthLabels = false,
  className,
  children,
  ...props
}: ContributionGraphCalendarProps) => {
  const {
    weeks,
    width,
    height,
    blockSize,
    blockMargin,
    contentKey,
    labels,
    loading,
  } = useContributionGraph();

  const monthLabels = useMemo(
    () => getMonthLabels(weeks, labels.months),
    [weeks, labels.months]
  );

  const scrollToLatest = (container: HTMLDivElement | null) => {
    if (!container) {
      return;
    }

    const scrollToEnd = () => {
      container.scrollLeft = container.scrollWidth - container.clientWidth;
    };

    scrollToEnd();
    requestAnimationFrame(scrollToEnd);
  };

  return (
    <div
      className={cn(
        "-m-1 max-w-full overflow-x-auto overflow-y-hidden p-1",
        "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1",
        className
      )}
      // The padding (offset by the negative margin) keeps hover-scaled edge
      // blocks inside the clip boundary instead of being cut off.
      key={contentKey}
      ref={scrollToLatest}
      {...props}
    >
      <svg
        aria-busy={loading}
        aria-label="Contribution graph"
        className="block overflow-visible"
        height={height}
        key={contentKey}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
      >
        {!hideMonthLabels && (
          <g className="fill-current">
            {monthLabels.map(({ label, weekIndex }) => (
              <text
                dominantBaseline="hanging"
                key={weekIndex}
                x={(blockSize + blockMargin) * weekIndex}
              >
                {label}
              </text>
            ))}
          </g>
        )}
        {weeks.map((week, weekIndex) =>
          week.map((activity, dayIndex) => {
            if (!activity) {
              return null;
            }

            return (
              <Fragment key={`${weekIndex}-${dayIndex}`}>
                {children({ activity, dayIndex, weekIndex })}
              </Fragment>
            );
          })
        )}
      </svg>
    </div>
  );
};

export type ContributionGraphFooterProps = HTMLAttributes<HTMLDivElement>;

export const ContributionGraphFooter = ({
  className,
  ...props
}: ContributionGraphFooterProps) => (
  <div
    className={cn(
      "flex flex-wrap gap-1 whitespace-nowrap sm:gap-x-4",
      className
    )}
    {...props}
  />
);

export type ContributionGraphTotalCountProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children?: (props: { totalCount: number; year: number }) => ReactNode;
};

export const ContributionGraphTotalCount = ({
  className,
  children,
  ...props
}: ContributionGraphTotalCountProps) => {
  const { totalCount, year, labels, loading } = useContributionGraph();

  if (loading) {
    return (
      <div
        className={cn("animate-pulse text-muted-foreground", className)}
        {...props}
      >
        Loading contributions…
      </div>
    );
  }

  if (children) {
    return <>{children({ totalCount, year })}</>;
  }

  return (
    <div className={cn("text-muted-foreground", className)} {...props}>
      {labels.totalCount
        ? labels.totalCount
            .replace("{{count}}", String(totalCount))
            .replace("{{year}}", String(year))
        : `${totalCount} activities in ${year}`}
    </div>
  );
};

export type ContributionGraphLegendProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children?: (props: { level: number }) => ReactNode;
};

export const ContributionGraphLegend = ({
  className,
  children,
  ...props
}: ContributionGraphLegendProps) => {
  const { labels, maxLevel, blockSize, blockRadius } = useContributionGraph();

  return (
    <div
      className={cn("ml-auto flex items-center gap-[3px]", className)}
      {...props}
    >
      <span className="mr-1 text-muted-foreground">
        {labels.legend?.less || "Less"}
      </span>
      {new Array(maxLevel + 1).fill(undefined).map((_, level) =>
        children ? (
          <Fragment key={level}>{children({ level })}</Fragment>
        ) : (
          <svg
            aria-label={`${level} contributions`}
            height={blockSize}
            key={level}
            width={blockSize}
          >
            <rect
              className={cn("stroke-[1px] stroke-border", LEVEL_CLASSES)}
              data-level={level}
              height={blockSize}
              rx={blockRadius}
              ry={blockRadius}
              width={blockSize}
            />
          </svg>
        )
      )}
      <span className="ml-1 text-muted-foreground">
        {labels.legend?.more || "More"}
      </span>
    </div>
  );
};
