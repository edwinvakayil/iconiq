"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  forwardRef,
  type ReactNode,
  type Ref,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

export interface TimezoneProps {
  /** City name, alias, or IANA timezone such as `America/Los_Angeles`. */
  zone: string;
  /** 12-hour or 24-hour clock formatting. */
  format?: "12h" | "24h";
  /**
   * Show a timezone label after the clock.
   * @deprecated Use `showZoneLabel` instead.
   */
  showAbbreviation?: boolean;
  /** Show a timezone label after the clock. */
  showZoneLabel?: boolean;
  /**
   * How the timezone label is rendered when `showZoneLabel` is true.
   * `abbreviation` shows letter codes like IST or EST.
   * `offset` shows offset labels like GMT+5:30.
   */
  zoneName?: "abbreviation" | "offset";
  /** Update every second instead of every minute. */
  live?: boolean;
  className?: string;
  locale?: string;
  /** Custom content when `zone` cannot be resolved. */
  fallback?: ReactNode;
  /** Called when `zone` cannot be resolved. */
  onError?: (zone: string) => void;
  /**
   * When false, disables digit and separator motion even if reduced motion is off.
   * @default true
   */
  animate?: boolean;
  /**
   * Adds `aria-live` to a screen-reader-only layer. `true` maps to `"polite"`.
   * Defaults to `"polite"` when `live` is false and off when `live` is true.
   */
  ariaLive?: boolean | "polite" | "assertive" | "off";
}

type TimezoneClockProps = Omit<TimezoneProps, "fallback" | "onError"> & {
  resolvedZone: string;
};

type TimezoneErrorProps = Pick<
  TimezoneProps,
  "zone" | "fallback" | "onError" | "className"
>;

/**
 * Curated aliases that override auto-generated city matches.
 * Some aliases are intentionally regional, such as `portland` (Oregon) and `la` (Los Angeles).
 */
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
  gmt: "UTC",
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
const LATIN_NUMBERING_SYSTEM = "latn" as const;
const DIGIT_PATTERN = /\d/;
const COLON_PATTERN = /[:.]/;
const LETTER_ABBREV = /^[A-Z]{2,5}$/;
const GMT_OFFSET_PATTERN = /GMT([+-])(\d{1,2})(?::(\d{2}))?/;

/** [standard, daylight?] */
const ABBREVIATION_FALLBACK: Record<string, readonly [string, string?]> = {
  "Africa/Cairo": ["EET"],
  "America/Anchorage": ["AKST", "AKDT"],
  "America/Argentina/Buenos_Aires": ["ART"],
  "America/Bogota": ["COT"],
  "America/Chicago": ["CST", "CDT"],
  "America/Denver": ["MST", "MDT"],
  "America/Detroit": ["EST", "EDT"],
  "America/Edmonton": ["MST", "MDT"],
  "America/Halifax": ["AST", "ADT"],
  "America/Lima": ["PET"],
  "America/Los_Angeles": ["PST", "PDT"],
  "America/Mexico_City": ["CST", "CDT"],
  "America/New_York": ["EST", "EDT"],
  "America/Phoenix": ["MST"],
  "America/Santiago": ["CLT", "CLST"],
  "America/Sao_Paulo": ["BRT", "BRST"],
  "America/St_Johns": ["NST", "NDT"],
  "America/Toronto": ["EST", "EDT"],
  "America/Vancouver": ["PST", "PDT"],
  "America/Winnipeg": ["CST", "CDT"],
  "Asia/Bangkok": ["ICT"],
  "Asia/Dhaka": ["BST"],
  "Asia/Dubai": ["GST"],
  "Asia/Hong_Kong": ["HKT"],
  "Asia/Jakarta": ["WIB"],
  "Asia/Karachi": ["PKT"],
  "Asia/Kolkata": ["IST"],
  "Asia/Manila": ["PST"],
  "Asia/Seoul": ["KST"],
  "Asia/Shanghai": ["CST"],
  "Asia/Singapore": ["SGT"],
  "Asia/Taipei": ["CST"],
  "Asia/Tokyo": ["JST"],
  "Atlantic/Reykjavik": ["GMT"],
  "Australia/Brisbane": ["AEST"],
  "Australia/Melbourne": ["AEST", "AEDT"],
  "Australia/Perth": ["AWST"],
  "Australia/Sydney": ["AEST", "AEDT"],
  "Etc/GMT": ["GMT"],
  "Etc/UTC": ["UTC"],
  "Europe/Amsterdam": ["CET", "CEST"],
  "Europe/Berlin": ["CET", "CEST"],
  "Europe/Istanbul": ["TRT"],
  "Europe/London": ["GMT", "BST"],
  "Europe/Madrid": ["CET", "CEST"],
  "Europe/Moscow": ["MSK"],
  "Europe/Paris": ["CET", "CEST"],
  "Europe/Rome": ["CET", "CEST"],
  "Europe/Warsaw": ["CET", "CEST"],
  "Europe/Zurich": ["CET", "CEST"],
  "Pacific/Auckland": ["NZST", "NZDT"],
  "Pacific/Fiji": ["FJT", "FJST"],
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

const MotionTime = motion.create("time");

let exitId = 0;

interface ExitItem {
  id: number;
  char: string;
  exitY: number;
}

export interface TimeLabelCell {
  char: string;
  key: string;
  kind: "digit" | "colon" | "space" | "glyph";
}

type ClockSubscriber = (now: Date) => void;

interface ClockChannel {
  intervalId?: number;
  subscribers: Set<ClockSubscriber>;
  timeoutId?: number;
}

const minuteChannel: ClockChannel = { subscribers: new Set() };
const liveChannel: ClockChannel = { subscribers: new Set() };
let documentHidden = false;
let visibilityListenerAttached = false;

function createDateTimeFormatOptions(
  options: Intl.DateTimeFormatOptions
): Intl.DateTimeFormatOptions {
  return {
    numberingSystem: LATIN_NUMBERING_SYSTEM,
    ...options,
  };
}

function isDigitChar(char: string) {
  return DIGIT_PATTERN.test(char);
}

function isColonChar(char: string) {
  return COLON_PATTERN.test(char);
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
    const zoneKey = normalizeZoneKey(zone);
    if (!lookup[zoneKey]) {
      lookup[zoneKey] = zone;
    }

    const segments = zone.split("/");
    const citySlug = segments.at(-1) ?? zone;
    const cityKey = normalizeZoneKey(citySlug.replace(/_/g, " "));

    if (cityKey) {
      const matches = cityToZones.get(cityKey) ?? [];
      matches.push(zone);
      cityToZones.set(cityKey, matches);
    }

    if (segments.length >= 2) {
      const regionCityKey = normalizeZoneKey(
        `${segments[0]} ${citySlug.replace(/_/g, " ")}`
      );
      if (!lookup[regionCityKey]) {
        lookup[regionCityKey] = zone;
      }
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

/** Clears the cached timezone index. Intended for tests. */
export function resetTimezoneIndexForTests() {
  timezoneIndex = null;
}

/** Every IANA timezone available in the current runtime environment. */
export function getWorldTimezones() {
  return [...getTimezoneIndex().zones].sort((left, right) =>
    left.localeCompare(right)
  );
}

function isValidTimeZone(timeZone: string) {
  try {
    Intl.DateTimeFormat(DEFAULT_LOCALE, {
      timeZone,
      numberingSystem: LATIN_NUMBERING_SYSTEM,
    }).format(new Date());
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

export function shouldDigitRollUp(previous: string, next: string) {
  const previousDigit = Number(previous);
  const nextDigit = Number(next);

  if (!(Number.isFinite(previousDigit) && Number.isFinite(nextDigit))) {
    return true;
  }

  if (nextDigit > previousDigit) {
    return true;
  }

  if (nextDigit < previousDigit) {
    return previousDigit === 9 && nextDigit === 0;
  }

  return true;
}

export function resolveTimezoneAriaLive(
  ariaLive: TimezoneProps["ariaLive"],
  live: boolean
): "polite" | "assertive" | undefined {
  if (ariaLive === false || ariaLive === "off") {
    return undefined;
  }

  if (ariaLive === "assertive") {
    return "assertive";
  }

  if (ariaLive === true || ariaLive === "polite") {
    return "polite";
  }

  return live ? undefined : "polite";
}

export function buildTimeLabelCells(label: string): TimeLabelCell[] {
  const chars = label.split("");
  const digitIndexFromRight = new Map<number, number>();
  const colonIndexFromLeft = new Map<number, number>();
  let digitCount = 0;

  for (let index = chars.length - 1; index >= 0; index -= 1) {
    if (isDigitChar(chars[index])) {
      digitIndexFromRight.set(index, digitCount);
      digitCount += 1;
    }
  }

  let colonCount = 0;
  for (let index = 0; index < chars.length; index += 1) {
    if (isColonChar(chars[index])) {
      colonIndexFromLeft.set(index, colonCount);
      colonCount += 1;
    }
  }

  return chars.map((char, index) => {
    if (isDigitChar(char)) {
      return {
        char,
        key: `digit-${digitIndexFromRight.get(index) ?? index}`,
        kind: "digit" as const,
      };
    }

    if (isColonChar(char)) {
      return {
        char,
        key: `colon-${colonIndexFromLeft.get(index) ?? index}`,
        kind: "colon" as const,
      };
    }

    if (char === " ") {
      return {
        char,
        key: `space-${index}`,
        kind: "space" as const,
      };
    }

    return {
      char,
      key: `glyph-${index}`,
      kind: "glyph" as const,
    };
  });
}

function notifyChannel(channel: ClockChannel) {
  const now = new Date();
  for (const subscriber of channel.subscribers) {
    subscriber(now);
  }
}

function stopChannel(channel: ClockChannel) {
  if (typeof window === "undefined") {
    return;
  }

  if (channel.timeoutId !== undefined) {
    window.clearTimeout(channel.timeoutId);
    channel.timeoutId = undefined;
  }

  if (channel.intervalId !== undefined) {
    window.clearInterval(channel.intervalId);
    channel.intervalId = undefined;
  }
}

function startChannel(channel: ClockChannel, live: boolean) {
  if (
    typeof window === "undefined" ||
    documentHidden ||
    channel.subscribers.size === 0
  ) {
    return;
  }

  if (channel.intervalId !== undefined || channel.timeoutId !== undefined) {
    return;
  }

  const intervalMs = live ? 1000 : 60_000;
  const startInterval = () => {
    channel.intervalId = window.setInterval(
      () => notifyChannel(channel),
      intervalMs
    );
  };

  if (live) {
    startInterval();
    return;
  }

  const msUntilNextMinute = intervalMs - (Date.now() % intervalMs);
  channel.timeoutId = window.setTimeout(() => {
    channel.timeoutId = undefined;
    notifyChannel(channel);
    startInterval();
  }, msUntilNextMinute);
}

function restartClockChannels() {
  stopClockChannels();
  ensureClockChannels();
}

function ensureClockChannels() {
  startChannel(liveChannel, true);
  startChannel(minuteChannel, false);
}

function stopClockChannels() {
  stopChannel(liveChannel);
  stopChannel(minuteChannel);
}

function attachVisibilityListener() {
  if (visibilityListenerAttached || typeof document === "undefined") {
    return;
  }

  visibilityListenerAttached = true;
  documentHidden = document.hidden;

  document.addEventListener("visibilitychange", () => {
    documentHidden = document.hidden;

    if (documentHidden) {
      stopClockChannels();
      return;
    }

    notifyChannel(minuteChannel);
    notifyChannel(liveChannel);
    restartClockChannels();
  });
}

function subscribeClock(live: boolean, subscriber: ClockSubscriber) {
  attachVisibilityListener();

  const channel = live ? liveChannel : minuteChannel;
  channel.subscribers.add(subscriber);
  subscriber(new Date());
  ensureClockChannels();

  return () => {
    channel.subscribers.delete(subscriber);

    if (channel.subscribers.size === 0) {
      stopChannel(channel);
    }
  };
}

function useNow(live: boolean) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => subscribeClock(live, setNow), [live]);

  return now;
}

function parseOffsetMinutes(date: Date, timeZone: string) {
  try {
    const part =
      new Intl.DateTimeFormat(
        "en-US",
        createDateTimeFormatOptions({
          timeZone,
          timeZoneName: "longOffset",
        })
      )
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
    return new Intl.DateTimeFormat(
      locale,
      createDateTimeFormatOptions({
        timeZone,
        timeZoneName,
        hour: "numeric",
      })
    )
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value;
  } catch {
    return new Intl.DateTimeFormat(
      DEFAULT_LOCALE,
      createDateTimeFormatOptions({
        timeZone,
        timeZoneName,
        hour: "numeric",
      })
    )
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value;
  }
}

export function getTimezoneAbbreviation(
  date: Date,
  timeZone: string,
  locale: string
) {
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

  if (intlShort) {
    return intlShort;
  }

  return readTimeZoneNamePart(date, timeZone, locale, "shortOffset") ?? "";
}

function getTimezoneOffsetLabel(date: Date, timeZone: string, locale: string) {
  return readTimeZoneNamePart(date, timeZone, locale, "shortOffset") ?? "";
}

export function formatTimezoneTime({
  date,
  locale,
  timeZone,
  format,
  showZoneLabel,
  zoneName,
  live,
}: {
  date: Date;
  locale: string;
  timeZone: string;
  format: "12h" | "24h";
  showZoneLabel: boolean;
  zoneName: "abbreviation" | "offset";
  live: boolean;
}) {
  const options = createDateTimeFormatOptions({
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    second: live ? "2-digit" : undefined,
    hour12: format === "12h",
  });

  let label: string;
  try {
    label = new Intl.DateTimeFormat(locale, options).format(date);
  } catch {
    label = new Intl.DateTimeFormat(DEFAULT_LOCALE, options).format(date);
  }

  if (!showZoneLabel) {
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
    const parts = new Intl.DateTimeFormat(
      "en-CA",
      createDateTimeFormatOptions({
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    ).formatToParts(date);

    const get = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((part) => part.type === type)?.value ?? "00";

    return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`;
  } catch {
    return date.toISOString();
  }
}

function resolveShowZoneLabel({
  showZoneLabel,
  showAbbreviation,
}: Pick<TimezoneProps, "showZoneLabel" | "showAbbreviation">) {
  return showZoneLabel ?? showAbbreviation ?? true;
}

function getPlaceholderWidth({
  format,
  live,
  showZoneLabel,
}: {
  format: "12h" | "24h";
  live: boolean;
  showZoneLabel: boolean;
}) {
  if (format === "24h") {
    if (live) {
      return showZoneLabel ? "14ch" : "8ch";
    }
    return showZoneLabel ? "12ch" : "5ch";
  }

  if (live) {
    return showZoneLabel ? "16ch" : "11ch";
  }

  return showZoneLabel ? "14ch" : "8ch";
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

    const up = shouldDigitRollUp(prev, char);
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
        "relative isolate grid min-h-[1em] min-w-[1ch] place-items-center overflow-hidden [&>*]:col-start-1 [&>*]:row-start-1",
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
        aria-hidden
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
  live,
  animate,
}: {
  char: string;
  live: boolean;
  animate: boolean;
  className?: string;
}) {
  if (!animate) {
    return (
      <span aria-hidden className={cn("inline-block", className)}>
        {char}
      </span>
    );
  }

  return (
    <motion.span
      animate={live ? { opacity: [1, 0.35, 1] } : { opacity: 1 }}
      aria-hidden
      className={cn("inline-block", className)}
      transition={
        live
          ? {
              duration: 1,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
            }
          : undefined
      }
    >
      {char}
    </motion.span>
  );
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
        aria-hidden
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
  visuallyHidden,
}: {
  label: string;
  live: boolean;
  animate: boolean;
  className?: string;
  visuallyHidden?: boolean;
}) {
  const cells = useMemo(() => buildTimeLabelCells(label), [label]);

  if (!animate) {
    return (
      <span
        aria-hidden={visuallyHidden || undefined}
        className={cn("inline-flex items-baseline text-inherit", className)}
      >
        {label}
      </span>
    );
  }

  return (
    <span
      aria-hidden={visuallyHidden || undefined}
      className={cn("inline-flex items-baseline text-inherit", className)}
    >
      {cells.map(({ char, key, kind }) => {
        if (kind === "digit") {
          return <RollingDigit animate={animate} char={char} key={key} />;
        }

        if (kind === "colon") {
          return (
            <FluidColon animate={animate} char={char} key={key} live={live} />
          );
        }

        if (kind === "space") {
          return <span key={key}>&nbsp;</span>;
        }

        return <FadingGlyph animate={animate} char={char} key={key} />;
      })}
    </span>
  );
}

const TimezoneClock = forwardRef<HTMLElement, TimezoneClockProps>(
  function TimezoneClock(
    {
      zone,
      resolvedZone,
      format = "12h",
      showAbbreviation,
      showZoneLabel,
      zoneName = "abbreviation",
      live = false,
      className,
      locale = DEFAULT_LOCALE,
      animate: animateProp = true,
      ariaLive,
    },
    ref
  ) {
    const reduceMotion = useReducedMotion();
    const normalizedLocale = locale.trim() || DEFAULT_LOCALE;
    const resolvedShowZoneLabel = resolveShowZoneLabel({
      showZoneLabel,
      showAbbreviation,
    });
    const now = useNow(live);
    const animate = animateProp && !reduceMotion;
    const resolvedAriaLive = resolveTimezoneAriaLive(ariaLive, live);

    const timeClassName = cn(
      "inline-flex origin-center text-inherit tabular-nums tracking-tight",
      className
    );
    const title = `${zone} (${resolvedZone})`;
    const placeholderWidth = getPlaceholderWidth({
      format,
      live,
      showZoneLabel: resolvedShowZoneLabel,
    });

    if (!now) {
      return (
        <time
          className={timeClassName}
          dateTime=""
          ref={ref as Ref<HTMLTimeElement>}
          suppressHydrationWarning
          title={title}
        >
          <span
            aria-hidden
            className="inline-block opacity-0"
            style={{ minWidth: placeholderWidth }}
          >
            00:00:00
          </span>
        </time>
      );
    }

    const label = formatTimezoneTime({
      date: now,
      locale: normalizedLocale,
      timeZone: resolvedZone,
      format,
      showZoneLabel: resolvedShowZoneLabel,
      zoneName,
      live,
    });
    const dateTime = toTimezoneDateTime(now, resolvedZone);
    const clockKey = `${resolvedZone}-${format}-${resolvedShowZoneLabel ? zoneName : "plain"}-${live ? "live" : "minute"}`;
    const timeContent = (
      <>
        {resolvedAriaLive ? (
          <span aria-live={resolvedAriaLive} className="sr-only">
            {label}
          </span>
        ) : null}
        <TimeLabel
          animate={animate}
          label={label}
          live={live}
          visuallyHidden={Boolean(resolvedAriaLive)}
        />
      </>
    );

    if (!animate) {
      return (
        <time
          className={timeClassName}
          dateTime={dateTime}
          ref={ref as Ref<HTMLTimeElement>}
          suppressHydrationWarning
          title={title}
        >
          {timeContent}
        </time>
      );
    }

    return (
      <AnimatePresence initial={false} mode="wait">
        <MotionTime
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className={timeClassName}
          dateTime={dateTime}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          initial={false}
          key={clockKey}
          ref={ref as Ref<HTMLTimeElement>}
          suppressHydrationWarning
          title={title}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 26,
          }}
        >
          {timeContent}
        </MotionTime>
      </AnimatePresence>
    );
  }
);

TimezoneClock.displayName = "TimezoneClock";

const TimezoneError = forwardRef<HTMLElement, TimezoneErrorProps>(
  function TimezoneError({ zone, fallback, className, onError }, ref) {
    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;

    useEffect(() => {
      onErrorRef.current?.(zone);
    }, [zone]);

    return (
      <output
        className={cn(
          "inline-flex text-destructive text-inherit tabular-nums",
          className
        )}
        ref={ref as Ref<HTMLOutputElement>}
        title={zone}
      >
        {fallback ?? `Unknown timezone: ${zone}`}
      </output>
    );
  }
);

TimezoneError.displayName = "TimezoneError";

const Timezone = forwardRef<HTMLElement, TimezoneProps>(function Timezone(
  { zone, fallback, onError, className, ...clockProps },
  ref
) {
  const resolvedZone = useMemo(() => resolveTimezone(zone), [zone]);

  if (!resolvedZone) {
    return (
      <TimezoneError
        className={className}
        fallback={fallback}
        onError={onError}
        ref={ref}
        zone={zone}
      />
    );
  }

  return (
    <TimezoneClock
      {...clockProps}
      className={className}
      ref={ref}
      resolvedZone={resolvedZone}
      zone={zone}
    />
  );
});

Timezone.displayName = "Timezone";

export default Timezone;
export { Timezone };
