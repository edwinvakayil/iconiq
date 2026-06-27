"use client";

import {
  type ComponentType,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import { cn } from "@/lib/utils";
import type {
  RollingDigitsLocale,
  RollingDigitsProps,
} from "@/registry/rolling-digits";

type RollingDigitsModule = {
  RollingDigits: ComponentType<RollingDigitsProps>;
};

type RollingDigitsPattern =
  | "countdown"
  | "currency"
  | "stats"
  | "clock"
  | "manual";

type RollingDigitsPlaygroundState = {
  animationDelay: number;
  ariaLive: boolean;
  coalesceUpdates: boolean;
  direction: NonNullable<RollingDigitsProps["direction"]>;
  localeMode: "none" | "default" | "en-US" | "de-DE";
  pad: number;
  pattern: RollingDigitsPattern;
  startOnView: boolean;
  value: number;
};

const sentenceClassName =
  "flex max-w-xl flex-wrap items-center justify-center gap-x-1.5 gap-y-2 text-balance text-center font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100";

const tickerWrapClassName =
  "inline-flex translate-y-px items-center align-middle";

const DEFAULT_STATE: RollingDigitsPlaygroundState = {
  animationDelay: 80,
  ariaLive: true,
  coalesceUpdates: false,
  direction: "dynamic",
  localeMode: "none",
  pad: 2,
  pattern: "countdown",
  startOnView: false,
  value: 12,
};

const PATTERN_OPTIONS: Array<{
  label: string;
  value: RollingDigitsPattern;
}> = [
  { label: "Countdown", value: "countdown" },
  { label: "Currency", value: "currency" },
  { label: "Stats", value: "stats" },
  { label: "Clock", value: "clock" },
  { label: "Manual", value: "manual" },
];

const VALUE_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "0", value: "0" },
  { label: "12", value: "12" },
  { label: "99", value: "99" },
  { label: "100", value: "100" },
  { label: "1,000", value: "1000" },
  { label: "1,250", value: "1250" },
  { label: "1,000,000", value: "1000000" },
];

const PAD_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "None", value: "0" },
  { label: "2 digits", value: "2" },
  { label: "3 digits", value: "3" },
  { label: "5 digits", value: "5" },
];

const DELAY_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "40ms", value: "40" },
  { label: "80ms", value: "80" },
  { label: "160ms", value: "160" },
  { label: "320ms", value: "320" },
];

const DIRECTION_OPTIONS: Array<{
  label: string;
  value: NonNullable<RollingDigitsProps["direction"]>;
}> = [
  { label: "Dynamic", value: "dynamic" },
  { label: "Up", value: "up" },
  { label: "Down", value: "down" },
];

const LOCALE_OPTIONS: Array<{
  label: string;
  value: RollingDigitsPlaygroundState["localeMode"];
}> = [
  { label: "None", value: "none" },
  { label: "Runtime default", value: "default" },
  { label: "en-US", value: "en-US" },
  { label: "de-DE", value: "de-DE" },
];

const PATTERN_DEFAULTS: Record<
  RollingDigitsPattern,
  Pick<RollingDigitsPlaygroundState, "localeMode" | "pad" | "value">
> = {
  countdown: { localeMode: "none", pad: 2, value: 12 },
  currency: { localeMode: "none", pad: 0, value: 1250 },
  stats: { localeMode: "default", pad: 0, value: 1_000_000 },
  clock: { localeMode: "none", pad: 2, value: 8 },
  manual: { localeMode: "none", pad: 2, value: 12 },
};

const PATTERN_PREVIEW_FRAMES: Record<
  Exclude<RollingDigitsPattern, "manual" | "clock" | "countdown">,
  number[]
> = {
  currency: [1120, 1250, 1380, 1510, 1380, 1250, 1120],
  stats: [985_000, 992_500, 1_000_000, 1_007_500, 1_015_000, 1_022_500],
};

const PREVIEW_TICK_MS = 2000;
const PREVIEW_SWITCH_KICKOFF_MS = 180;

const CURRENCY_FORMATTER = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

function localeFromMode(
  localeMode: RollingDigitsPlaygroundState["localeMode"]
): RollingDigitsLocale | undefined {
  switch (localeMode) {
    case "default":
      return true;
    case "en-US":
      return "en-US";
    case "de-DE":
      return "de-DE";
    default:
      return undefined;
  }
}

function rollingDigitsPropsFromState(
  state: RollingDigitsPlaygroundState
): RollingDigitsProps {
  const props: RollingDigitsProps = {
    direction: state.direction,
    startOnView: state.startOnView,
    value: state.value,
  };

  if (state.pattern === "clock") {
    props.pad = 2;
  } else if (
    (state.pattern === "countdown" || state.pattern === "manual") &&
    state.pad > 0
  ) {
    props.pad = state.pad;
  }

  const locale = localeFromMode(state.localeMode);
  if (locale) {
    props.locale = locale;
  }

  if (state.pattern === "currency") {
    props.format = CURRENCY_FORMATTER;
  }

  if (state.animationDelay !== 80) {
    props.animationDelay = state.animationDelay;
  }

  if (state.coalesceUpdates) {
    props.coalesceUpdates = true;
  }

  if (!state.ariaLive) {
    props.ariaLive = false;
  }

  return props;
}

function generateRollingDigitsCode(
  state: RollingDigitsPlaygroundState,
  importPath: string
) {
  const lines: string[] = [`value={${state.value}}`];

  if (state.pattern === "clock") {
    lines.push("pad={2}");
  } else if (
    (state.pattern === "countdown" || state.pattern === "manual") &&
    state.pad > 0
  ) {
    lines.push(`pad={${state.pad}}`);
  }

  if (state.localeMode === "default") {
    lines.push("locale");
  } else if (state.localeMode !== "none") {
    lines.push(`locale="${state.localeMode}"`);
  }

  if (state.pattern === "currency") {
    lines.push(
      'format={(next) => next.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}'
    );
  }

  if (!state.startOnView) {
    lines.push("startOnView={false}");
  }

  if (state.direction !== "dynamic") {
    lines.push(`direction="${state.direction}"`);
  }

  if (state.animationDelay !== 80) {
    lines.push(`animationDelay={${state.animationDelay}}`);
  }

  if (state.coalesceUpdates) {
    lines.push("coalesceUpdates");
  }

  if (!state.ariaLive) {
    lines.push("ariaLive={false}");
  }

  const propsBlock = `\n        ${lines.join("\n        ")}\n      `;

  return `"use client";

import { RollingDigits } from "${importPath}";

export function RollingDigitsDemo() {
  return (
    <div className="flex max-w-xl flex-wrap items-center justify-center gap-x-1.5 gap-y-2 text-balance text-center font-medium text-lg leading-snug dark:text-neutral-100">
      <span>Early access opens in</span>
      <span className="inline-flex translate-y-px items-center align-middle">
        <RollingDigits${propsBlock}/>
      </span>
      <span>days.</span>
    </div>
  );
}`;
}

function RollingDigitsPlaygroundPreview({
  RollingDigitsComponent,
  state,
}: {
  RollingDigitsComponent: ComponentType<RollingDigitsProps>;
  state: RollingDigitsPlaygroundState;
}) {
  const [tickValue, setTickValue] = useState(
    PATTERN_DEFAULTS[state.pattern].value
  );
  const frameIndexRef = useRef(0);
  const displayValue = state.pattern === "manual" ? state.value : tickValue;
  const tickerProps = useMemo(
    () => rollingDigitsPropsFromState({ ...state, value: displayValue }),
    [displayValue, state]
  );

  useEffect(() => {
    if (state.pattern === "manual") {
      return;
    }

    if (state.pattern === "countdown") {
      const start = PATTERN_DEFAULTS.countdown.value;
      setTickValue(start);

      const kickoff = window.setTimeout(() => {
        setTickValue(start - 1);
      }, PREVIEW_SWITCH_KICKOFF_MS);

      return () => window.clearTimeout(kickoff);
    }

    if (state.pattern === "clock") {
      const start = PATTERN_DEFAULTS.clock.value;
      setTickValue(start);

      const kickoff = window.setTimeout(() => {
        setTickValue(start + 1);
      }, PREVIEW_SWITCH_KICKOFF_MS);

      return () => window.clearTimeout(kickoff);
    }

    const frames = PATTERN_PREVIEW_FRAMES[state.pattern];
    frameIndexRef.current = 0;
    setTickValue(frames[0]);

    const kickoff = window.setTimeout(() => {
      frameIndexRef.current = 2;
      setTickValue(frames[1]);
    }, PREVIEW_SWITCH_KICKOFF_MS);

    return () => window.clearTimeout(kickoff);
  }, [state.pattern]);

  useEffect(() => {
    if (state.pattern === "manual") {
      return;
    }

    if (state.pattern === "countdown") {
      const interval = window.setInterval(() => {
        setTickValue((current) => (current <= 1 ? 12 : current - 1));
      }, PREVIEW_TICK_MS);

      return () => window.clearInterval(interval);
    }

    if (state.pattern === "clock") {
      const interval = window.setInterval(() => {
        setTickValue((current) => (current + 1) % 100);
      }, 1000);

      return () => window.clearInterval(interval);
    }

    const frames = PATTERN_PREVIEW_FRAMES[state.pattern];

    const interval = window.setInterval(() => {
      const index = frameIndexRef.current % frames.length;
      frameIndexRef.current = index + 1;
      setTickValue(frames[index]);
    }, PREVIEW_TICK_MS);

    return () => window.clearInterval(interval);
  }, [state.pattern]);

  const previewCopy = useMemo(() => {
    switch (state.pattern) {
      case "currency":
        return {
          after: "in monthly recurring revenue.",
          before: "You are now at",
        };
      case "stats":
        return {
          after: "active users this week.",
          before: "We crossed",
        };
      case "clock":
        return {
          after: "seconds on the clock.",
          before: "Elapsed",
        };
      case "manual":
        return {
          after: "on the dial.",
          before: "Showing",
        };
      default:
        return {
          after: "days.",
          before: "Early access opens in",
        };
    }
  }, [state.pattern]);

  return (
    <div className="flex min-h-[18rem] w-full items-center justify-center px-4 py-6">
      <div className={cn(sentenceClassName)}>
        <span>{previewCopy.before}</span>
        <span className={tickerWrapClassName}>
          <RollingDigitsComponent key={state.pattern} {...tickerProps} />
        </span>
        <span>{previewCopy.after}</span>
      </div>
    </div>
  );
}

function RollingDigitsPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<RollingDigitsPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: RollingDigitsPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Rolling Digits"
    >
      <DocsPlaygroundSelectField
        label="Pattern"
        onChange={(pattern) =>
          onChange({
            pattern,
            ...PATTERN_DEFAULTS[pattern],
          })
        }
        options={PATTERN_OPTIONS}
        value={state.pattern}
      />
      {state.pattern === "manual" ? (
        <DocsPlaygroundSelectField
          label="Value"
          onChange={(value) => onChange({ value: Number(value) })}
          options={VALUE_OPTIONS}
          value={String(state.value)}
        />
      ) : null}
      {state.pattern !== "clock" ? (
        <DocsPlaygroundSelectField
          label="Pad"
          onChange={(pad) => onChange({ pad: Number(pad) })}
          options={PAD_OPTIONS}
          value={String(state.pad)}
        />
      ) : null}
      {state.pattern !== "currency" ? (
        <DocsPlaygroundSelectField
          label="Locale"
          onChange={(localeMode) => onChange({ localeMode })}
          options={LOCALE_OPTIONS}
          value={state.localeMode}
        />
      ) : null}
      <DocsPlaygroundSelectField
        label="Direction"
        onChange={(direction) => onChange({ direction })}
        options={DIRECTION_OPTIONS}
        value={state.direction}
      />
      <DocsPlaygroundSelectField
        label="Queue delay"
        onChange={(animationDelay) =>
          onChange({ animationDelay: Number(animationDelay) })
        }
        options={DELAY_OPTIONS}
        value={String(state.animationDelay)}
      />
      <DocsPlaygroundToggleField
        checked={state.startOnView}
        label="Start on view"
        onChange={(startOnView) => onChange({ startOnView })}
      />
      <DocsPlaygroundToggleField
        checked={state.coalesceUpdates}
        label="Coalesce updates"
        onChange={(coalesceUpdates) => onChange({ coalesceUpdates })}
      />
      <DocsPlaygroundToggleField
        checked={state.ariaLive}
        label="Aria live"
        onChange={(ariaLive) => onChange({ ariaLive })}
      />
    </DocsPlaygroundPanel>
  );
}

type RollingDigitsPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function RollingDigitsPlaygroundProvider({
  RollingDigitsModule,
  importPath,
  children,
}: {
  RollingDigitsModule: RollingDigitsModule;
  importPath: string;
  children: (props: RollingDigitsPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] =
    useState<RollingDigitsPlaygroundState>(DEFAULT_STATE);
  const { RollingDigits: RollingDigitsComponent } = RollingDigitsModule;

  const updateState = (next: Partial<RollingDigitsPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateRollingDigitsCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <RollingDigitsPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: (
      <RollingDigitsPlaygroundPreview
        RollingDigitsComponent={RollingDigitsComponent}
        state={state}
      />
    ),
    renderSettings,
  });
}
