"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface TimezoneProps {
  /** City name, alias, or IANA timezone such as `America/Los_Angeles`. */
  zone: string;
  /** 12-hour or 24-hour clock formatting. */
  format?: "12h" | "24h";
  /** Show the short timezone abbreviation, such as PST or PDT. */
  showAbbreviation?: boolean;
  /**
   * How the timezone label is rendered when `showAbbreviation` is true.
   * `abbreviation` shows letter codes like IST or EST.
   * `offset` shows offset labels like GMT+5:30.
   */
  zoneName?: "abbreviation" | "offset";
  /** Update every second instead of every minute. */
  live?: boolean;
  className?: string;
  locale?: string;
}

/** Curated aliases that override auto-generated city matches. */
const MANUAL_ZONE_ALIASES: Record<string, string> = {
  sf: "America/Los_Angeles",
  "san francisco": "America/Los_Angeles",
  "san fransisco": "America/Los_Angeles",
  "san fransico": "America/Los_Angeles",
  "los angeles": "America/Los_Angeles",
  la: "America/Los_Angeles",
  seattle: "America/Los_Angeles",
  portland: "America/Los_Angeles",
  vancouver: "America/Vancouver",
  denver: "America/Denver",
  chicago: "America/Chicago",
  austin: "America/Chicago",
  dallas: "America/Chicago",
  houston: "America/Chicago",
  miami: "America/New_York",
  atlanta: "America/New_York",
  boston: "America/New_York",
  "new york": "America/New_York",
  nyc: "America/New_York",
  toronto: "America/Toronto",
  london: "Europe/London",
  uk: "Europe/London",
  paris: "Europe/Paris",
  berlin: "Europe/Berlin",
  amsterdam: "Europe/Amsterdam",
  madrid: "Europe/Madrid",
  rome: "Europe/Rome",
  dubai: "Asia/Dubai",
  uae: "Asia/Dubai",
  mumbai: "Asia/Kolkata",
  delhi: "Asia/Kolkata",
  bangalore: "Asia/Kolkata",
  india: "Asia/Kolkata",
  singapore: "Asia/Singapore",
  "hong kong": "Asia/Hong_Kong",
  tokyo: "Asia/Tokyo",
  seoul: "Asia/Seoul",
  sydney: "Australia/Sydney",
  melbourne: "Australia/Melbourne",
  auckland: "Pacific/Auckland",
  utc: "UTC",
  gmt: "Etc/GMT",
};

const FALLBACK_TIMEZONES = [
  "UTC",
  "Etc/UTC",
  "Etc/GMT",
  "America/Los_Angeles",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Australia/Sydney",
  "Pacific/Auckland",
] as const;

const DEFAULT_LOCALE = "en-US";
const DIGIT_PATTERN = /\d/;
const COLON_PATTERN = /[:.]/;
const LETTER_ABBREV = /^[A-Z]{2,5}$/;
const GMT_OFFSET_PATTERN = /GMT([+-])(\d{1,2})(?::(\d{2}))?/;

/** [standard, daylight?] */
const ABBREVIATION_FALLBACK: Record<string, readonly [string, string?]> = {
  "America/Anchorage": ["AKST", "AKDT"],
  "America/Chicago": ["CST", "CDT"],
  "America/Denver": ["MST", "MDT"],
  "America/Los_Angeles": ["PST", "PDT"],
  "America/New_York": ["EST", "EDT"],
  "America/Phoenix": ["MST"],
  "America/Toronto": ["EST", "EDT"],
  "America/Vancouver": ["PST", "PDT"],
  "Asia/Dubai": ["GST"],
  "Asia/Hong_Kong": ["HKT"],
  "Asia/Kolkata": ["IST"],
  "Asia/Seoul": ["KST"],
  "Asia/Singapore": ["SGT"],
  "Asia/Tokyo": ["JST"],
  "Australia/Melbourne": ["AEST", "AEDT"],
  "Australia/Sydney": ["AEST", "AEDT"],
  "Etc/GMT": ["GMT"],
  "Etc/UTC": ["UTC"],
  "Europe/Amsterdam": ["CET", "CEST"],
  "Europe/Berlin": ["CET", "CEST"],
  "Europe/London": ["GMT", "BST"],
  "Europe/Madrid": ["CET", "CEST"],
  "Europe/Paris": ["CET", "CEST"],
  "Europe/Rome": ["CET", "CEST"],
  "Pacific/Auckland": ["NZST", "NZDT"],
  "Pacific/Honolulu": ["HST"],
  UTC: ["UTC"],
};

const TIME_MOTION = {
  enterStiffness: 210,
  enterDamping: 16,
  exitStiffness: 220,
  exitDamping: 20,
  enterY: 16,
  enterScale: 0.84,
  exitScale: 0.84,
} as const;

let exitId = 0;

interface ExitItem {
  id: number;
  char: string;
  exitY: number;
}

function normalizeZoneKey(zone: string) {
  return zone
    .trim()
    .toLowerCase()
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ");
}

function getAllTimezones() {
  if (
    typeof Intl !== "undefined" &&
    typeof Intl.supportedValuesOf === "function"
  ) {
    try {
      return Intl.supportedValuesOf("timeZone");
    } catch {
      return [...FALLBACK_TIMEZONES];
    }
  }

  return [...FALLBACK_TIMEZONES];
}

function buildTimezoneLookup(
  zones: readonly string[],
  manualAliases: Record<string, string>
) {
  const lookup: Record<string, string> = { ...manualAliases };
  const cityToZones = new Map<string, string[]>();

  for (const zone of zones) {
    lookup[normalizeZoneKey(zone)] = zone;

    const segments = zone.split("/");
    const citySlug = segments.at(-1) ?? zone;
    const cityKey = normalizeZoneKey(citySlug.replace(/_/g, " "));

    if (cityKey) {
      const matches = cityToZones.get(cityKey) ?? [];
      matches.push(zone);
      cityToZones.set(cityKey, matches);
    }

    if (segments.length >= 2) {
      lookup[
        normalizeZoneKey(`${segments[0]} ${citySlug.replace(/_/g, " ")}`)
      ] = zone;
    }
  }

  for (const [cityKey, matches] of cityToZones) {
    const match = matches[0];
    if (!lookup[cityKey] && match) {
      lookup[cityKey] = match;
    }
  }

  return lookup;
}

type TimezoneIndex = {
  lookup: Record<string, string>;
  zones: readonly string[];
  zoneSet: ReadonlySet<string>;
};

let timezoneIndex: TimezoneIndex | null = null;

function getTimezoneIndex(): TimezoneIndex {
  if (!timezoneIndex) {
    const zones = getAllTimezones();
    timezoneIndex = {
      zones,
      zoneSet: new Set(zones),
      lookup: buildTimezoneLookup(zones, MANUAL_ZONE_ALIASES),
    };
  }

  return timezoneIndex;
}

/** Every IANA timezone available in the current runtime environment. */
export function getWorldTimezones() {
  return [...getTimezoneIndex().zones].sort((left, right) =>
    left.localeCompare(right)
  );
}

function isValidTimeZone(timeZone: string) {
  try {
    Intl.DateTimeFormat(DEFAULT_LOCALE, { timeZone }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

export function resolveTimezone(zone: string) {
  const trimmed = zone.trim();
  if (!trimmed) {
    return null;
  }

  const { lookup, zoneSet } = getTimezoneIndex();

  if (zoneSet.has(trimmed)) {
    return trimmed;
  }

  const normalized = normalizeZoneKey(trimmed);
  const resolved = lookup[normalized];
  if (resolved) {
    return resolved;
  }

  if (trimmed.includes("/") && isValidTimeZone(trimmed)) {
    return trimmed;
  }

  if (isValidTimeZone(trimmed)) {
    return trimmed;
  }

  return null;
}

function useNow(live: boolean) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();

    if (live) {
      const id = window.setInterval(update, 1000);
      return () => window.clearInterval(id);
    }

    const intervalMs = 60_000;
    const msUntilNextMinute = intervalMs - (Date.now() % intervalMs);
    let intervalId: number | undefined;

    const timeoutId = window.setTimeout(() => {
      update();
      intervalId = window.setInterval(update, intervalMs);
    }, msUntilNextMinute);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [live]);

  return now;
}

function parseOffsetMinutes(date: Date, timeZone: string) {
  try {
    const part =
      new Intl.DateTimeFormat("en-US", {
        timeZone,
        timeZoneName: "longOffset",
      })
        .formatToParts(date)
        .find((segment) => segment.type === "timeZoneName")?.value ?? "";

    const match = part.match(GMT_OFFSET_PATTERN);
    if (!match) {
      return 0;
    }

    const sign = match[1] === "-" ? -1 : 1;
    return sign * (Number(match[2]) * 60 + Number(match[3] ?? 0));
  } catch {
    return 0;
  }
}

function isDaylightSaving(date: Date, timeZone: string) {
  const year = date.getUTCFullYear();
  const winter = new Date(Date.UTC(year, 0, 15, 12));
  const summer = new Date(Date.UTC(year, 6, 15, 12));
  const winterOffset = parseOffsetMinutes(winter, timeZone);
  const summerOffset = parseOffsetMinutes(summer, timeZone);

  if (winterOffset === summerOffset) {
    return false;
  }

  return (
    parseOffsetMinutes(date, timeZone) === Math.max(winterOffset, summerOffset)
  );
}

function readTimeZoneNamePart(
  date: Date,
  timeZone: string,
  locale: string,
  timeZoneName: Intl.DateTimeFormatOptions["timeZoneName"]
) {
  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone,
      timeZoneName,
      hour: "numeric",
    })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value;
  } catch {
    return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
      timeZone,
      timeZoneName,
      hour: "numeric",
    })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value;
  }
}

function getTimezoneAbbreviation(date: Date, timeZone: string, locale: string) {
  const intlShort = readTimeZoneNamePart(date, timeZone, locale, "short");
  if (intlShort && LETTER_ABBREV.test(intlShort)) {
    return intlShort;
  }

  const entry = ABBREVIATION_FALLBACK[timeZone];
  if (entry) {
    const [standard, daylight] = entry;
    if (daylight && isDaylightSaving(date, timeZone)) {
      return daylight;
    }
    return standard;
  }

  return intlShort ?? "";
}

function getTimezoneOffsetLabel(date: Date, timeZone: string, locale: string) {
  return readTimeZoneNamePart(date, timeZone, locale, "shortOffset") ?? "";
}

function formatTimezoneTime({
  date,
  locale,
  timeZone,
  format,
  showAbbreviation,
  zoneName,
  live,
}: {
  date: Date;
  locale: string;
  timeZone: string;
  format: "12h" | "24h";
  showAbbreviation: boolean;
  zoneName: "abbreviation" | "offset";
  live: boolean;
}) {
  const options: Intl.DateTimeFormatOptions = {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    second: live ? "2-digit" : undefined,
    hour12: format === "12h",
  };

  let label: string;
  try {
    label = new Intl.DateTimeFormat(locale, options).format(date);
  } catch {
    label = new Intl.DateTimeFormat(DEFAULT_LOCALE, options).format(date);
  }

  if (!showAbbreviation) {
    return label;
  }

  const zoneLabel =
    zoneName === "abbreviation"
      ? getTimezoneAbbreviation(date, timeZone, locale)
      : getTimezoneOffsetLabel(date, timeZone, locale);

  return zoneLabel ? `${label} ${zoneLabel}` : label;
}

function toTimezoneDateTime(date: Date, timeZone: string) {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(date);

    const get = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((part) => part.type === type)?.value ?? "00";

    return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`;
  } catch {
    return date.toISOString();
  }
}

function isDigitChar(char: string) {
  return DIGIT_PATTERN.test(char);
}

function isColonChar(char: string) {
  return COLON_PATTERN.test(char);
}

function RollingDigit({
  char,
  animate,
  className,
}: {
  char: string;
  animate: boolean;
  className?: string;
}) {
  const [exitQueue, setExitQueue] = useState<ExitItem[]>([]);
  const prevCharRef = useRef(char);
  const isFirstRender = useRef(true);

  const springConfig = {
    stiffness: TIME_MOTION.enterStiffness,
    damping: TIME_MOTION.enterDamping,
  };
  const y = useSpring(0, springConfig);
  const opacity = useSpring(1, springConfig);
  const scale = useSpring(1, springConfig);

  useEffect(() => {
    if (!animate) {
      return;
    }

    const prev = prevCharRef.current;
    prevCharRef.current = char;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (char === prev || !isDigitChar(prev)) {
      return;
    }

    const prevDigit = Number(prev);
    const nextDigit = Number(char);
    const up =
      Number.isFinite(prevDigit) &&
      Number.isFinite(nextDigit) &&
      nextDigit > prevDigit;
    const id = exitId++;
    setExitQueue((queue) => {
      const next = [
        ...queue,
        {
          id,
          char: prev,
          exitY: up ? -TIME_MOTION.enterY : TIME_MOTION.enterY,
        },
      ];
      return next.length > 1 ? next.slice(-1) : next;
    });

    y.jump(up ? TIME_MOTION.enterY : -TIME_MOTION.enterY);
    opacity.jump(0);
    scale.jump(TIME_MOTION.enterScale);

    y.set(0);
    opacity.set(1);
    scale.set(1);
  }, [animate, char, opacity, scale, y]);

  if (!animate) {
    return <span className={className}>{char}</span>;
  }

  return (
    <span
      className={cn(
        "relative isolate grid place-items-center overflow-hidden [&>*]:col-start-1 [&>*]:row-start-1",
        className
      )}
    >
      <AnimatePresence>
        {exitQueue.map(({ id, char: exitChar, exitY }) => (
          <motion.span
            animate={{
              opacity: 0,
              scale: TIME_MOTION.exitScale,
              y: exitY,
            }}
            aria-hidden
            className="[backface-visibility:hidden]"
            initial={{ opacity: 1, scale: 1, y: 0 }}
            key={id}
            onAnimationComplete={() =>
              setExitQueue((queue) => queue.filter((item) => item.id !== id))
            }
            transition={{
              type: "spring",
              stiffness: TIME_MOTION.exitStiffness,
              damping: TIME_MOTION.exitDamping,
            }}
          >
            {exitChar}
          </motion.span>
        ))}
      </AnimatePresence>
      <motion.span
        className="[backface-visibility:hidden]"
        style={{ opacity, scale, y }}
      >
        {char}
      </motion.span>
    </span>
  );
}

function FluidColon({
  char,
  className,
}: {
  char: string;
  live: boolean;
  animate: boolean;
  className?: string;
}) {
  return <span className={cn("inline-block", className)}>{char}</span>;
}

function FadingGlyph({
  char,
  animate,
  className,
}: {
  char: string;
  animate: boolean;
  className?: string;
}) {
  if (!animate) {
    return <span className={className}>{char}</span>;
  }

  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span
        animate={{ opacity: 1, y: 0 }}
        className={className}
        exit={{ opacity: 0, y: -4 }}
        initial={{ opacity: 0, y: 4 }}
        key={char}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 24,
        }}
      >
        {char}
      </motion.span>
    </AnimatePresence>
  );
}

function TimeLabel({
  label,
  live,
  animate,
  className,
}: {
  label: string;
  live: boolean;
  animate: boolean;
  className?: string;
}) {
  const chars = label.split("");

  if (!animate) {
    return (
      <span
        className={cn("inline-flex items-baseline text-inherit", className)}
      >
        {label}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-baseline text-inherit", className)}>
      {chars.map((char, index) => {
        if (isDigitChar(char)) {
          return <RollingDigit animate={animate} char={char} key={index} />;
        }

        if (isColonChar(char)) {
          return (
            <FluidColon animate={animate} char={char} key={index} live={live} />
          );
        }

        if (char === " ") {
          return <span key={index}>&nbsp;</span>;
        }

        return <FadingGlyph animate={animate} char={char} key={index} />;
      })}
    </span>
  );
}

export function Timezone({
  zone,
  format = "12h",
  showAbbreviation = true,
  zoneName = "abbreviation",
  live = false,
  className,
  locale = DEFAULT_LOCALE,
}: TimezoneProps) {
  const reduceMotion = useReducedMotion();
  const resolvedZone = useMemo(() => resolveTimezone(zone), [zone]);
  const now = useNow(live);
  const animate = !reduceMotion;

  if (!resolvedZone) {
    return (
      <output
        className={cn(
          "inline-flex text-destructive text-inherit tabular-nums",
          className
        )}
      >
        Unknown timezone
      </output>
    );
  }

  const timeClassName = cn(
    "inline-flex origin-center text-inherit tabular-nums tracking-tight",
    className
  );
  const title = `${zone} (${resolvedZone})`;

  if (!now) {
    return (
      <time
        className={timeClassName}
        dateTime=""
        suppressHydrationWarning
        title={title}
      >
        <span aria-hidden className="inline-block min-w-[8ch] opacity-0">
          00:00:00
        </span>
      </time>
    );
  }

  const label = formatTimezoneTime({
    date: now,
    locale,
    timeZone: resolvedZone,
    format,
    showAbbreviation,
    zoneName,
    live,
  });
  const dateTime = toTimezoneDateTime(now, resolvedZone);
  const clockKey = `${resolvedZone}-${format}-${showAbbreviation ? zoneName : "plain"}-${live ? "live" : "minute"}`;

  if (!animate) {
    return (
      <time
        className={timeClassName}
        dateTime={dateTime}
        suppressHydrationWarning
        title={title}
      >
        <TimeLabel animate={false} label={label} live={live} />
      </time>
    );
  }

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.time
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={timeClassName}
        dateTime={dateTime}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        initial={false}
        key={clockKey}
        suppressHydrationWarning
        title={title}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 26,
        }}
      >
        <TimeLabel animate label={label} live={live} />
      </motion.time>
    </AnimatePresence>
  );
}
