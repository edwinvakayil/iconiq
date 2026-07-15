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
  Fragment,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
        {children}
      </div>
    </ContributionGraphContext.Provider>
  );
};

export type ContributionGraphBlockProps = HTMLAttributes<SVGRectElement> & {
  activity: Activity;
  dayIndex: number;
  weekIndex: number;
};

export const ContributionGraphBlock = ({
  activity,
  dayIndex,
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

  return (
    <rect
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
    >
      {children ?? (
        <title>
          {`${activity.count} contribution${activity.count === 1 ? "" : "s"} on ${activity.date}`}
        </title>
      )}
    </rect>
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

  return (
    <div
      // The padding (offset by the negative margin) keeps hover-scaled edge
      // blocks inside the clip boundary instead of being cut off.
      className={cn(
        "-m-1 max-w-full overflow-x-auto overflow-y-hidden p-1",
        "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1",
        className
      )}
      {...props}
    >
      <svg
        aria-busy={loading}
        className="block overflow-visible"
        height={height}
        key={contentKey}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
      >
        <title>Contribution Graph</title>
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
          <svg height={blockSize} key={level} width={blockSize}>
            <title>{`${level} contributions`}</title>
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
