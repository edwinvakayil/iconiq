"use client";

import {
  type CSSProperties,
  createElement,
  forwardRef,
  type HTMLAttributes,
  useLayoutEffect,
} from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] [--status-dot-neutral:var(--ic-muted-foreground)] [--status-dot-queued:#d1d5db] [--status-dot-canceled:#9ca3af] [--status-dot-active:var(--ic-brand)] [--status-dot-success:#14b8a6] [--status-dot-warning:#f59e0b] [--status-dot-error:var(--ic-destructive)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)] dark:[--status-dot-success:#2dd4bf] dark:[--status-dot-queued:#9ca3af] dark:[--status-dot-canceled:#6b7280]";

const STYLE_ID = "iconiq-status-dot-styles";
const RIPPLE_DURATION = 2.25;
const RIPPLE_DELAYS = [0, RIPPLE_DURATION / 2] as const;

const STATUS_DOT_CSS = `
@keyframes iconiq-status-dot-ripple {
  0% {
    box-shadow: 0 0 0 0 var(--status-dot-ripple-mid);
  }
  72% {
    box-shadow: 0 0 0 var(--status-dot-ripple-spread) var(--status-dot-ripple-end);
  }
  100% {
    box-shadow: 0 0 0 0 var(--status-dot-ripple-end);
  }
}

.iconiq-status-dot-ripple {
  --status-dot-ripple-mid: color-mix(in srgb, var(--status-dot-color) 48%, transparent);
  --status-dot-ripple-end: transparent;
  animation: iconiq-status-dot-ripple 2.25s ease-out infinite;
}

.dark .iconiq-status-dot-ripple {
  --status-dot-ripple-mid: color-mix(in srgb, var(--status-dot-color) 58%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .iconiq-status-dot-ripple {
    animation: none;
  }
}
`;

type StatusDotTone = "neutral" | "active" | "success" | "warning" | "error";

type StatusDotState = "QUEUED" | "BUILDING" | "ERROR" | "READY" | "CANCELED";

type StatusDotSize = "sm" | "md" | "lg";

const statusDotStates = [
  "QUEUED",
  "BUILDING",
  "ERROR",
  "READY",
  "CANCELED",
] as const satisfies readonly StatusDotState[];

const statusDotTones = [
  "neutral",
  "active",
  "success",
  "warning",
  "error",
] as const satisfies readonly StatusDotTone[];

const statusDotToneConfig = {
  neutral: {
    colorVar: "var(--status-dot-neutral)",
    label: "Neutral",
  },
  active: {
    colorVar: "var(--status-dot-active)",
    label: "Active",
  },
  success: {
    colorVar: "var(--status-dot-success)",
    label: "Success",
  },
  warning: {
    colorVar: "var(--status-dot-warning)",
    label: "Warning",
  },
  error: {
    colorVar: "var(--status-dot-error)",
    label: "Error",
  },
} as const satisfies Record<StatusDotTone, { colorVar: string; label: string }>;

const statusDotStateConfig = {
  QUEUED: {
    tone: "neutral",
    label: "Queued",
    animate: false,
    colorVar: "var(--status-dot-queued)",
  },
  BUILDING: { tone: "warning", label: "Building", animate: true },
  ERROR: { tone: "error", label: "Error", animate: false },
  READY: { tone: "success", label: "Ready", animate: false },
  CANCELED: {
    tone: "neutral",
    label: "Canceled",
    animate: false,
    colorVar: "var(--status-dot-canceled)",
  },
} as const satisfies Record<
  StatusDotState,
  {
    tone: StatusDotTone;
    label: string;
    animate: boolean;
    colorVar?: string;
  }
>;

const statusDotSizeConfig = {
  sm: { dot: 6, container: 14, rippleSpread: "7px" },
  md: { dot: 8, container: 20, rippleSpread: "9px" },
  lg: { dot: 10, container: 26, rippleSpread: "11px" },
} as const satisfies Record<
  StatusDotSize,
  { dot: number; container: number; rippleSpread: string }
>;

type StatusDotBaseProps = {
  animate?: boolean;
  inline?: boolean;
  label?: string;
  labelClassName?: string;
  showLabel?: boolean;
  size?: StatusDotSize;
} & HTMLAttributes<HTMLElement>;

type StatusDotProps = StatusDotBaseProps &
  (
    | { state: StatusDotState; tone?: StatusDotTone }
    | { state?: StatusDotState; tone: StatusDotTone }
  );

type ResolvedStatusDotConfig = {
  animate: boolean;
  colorVar: string;
  defaultLabel: string;
  tone: StatusDotTone;
};

function ensureStatusDotStyles() {
  if (typeof document === "undefined") {
    return;
  }

  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;

  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = STATUS_DOT_CSS;
}

function getStatusDotConfig({
  animate,
  state,
  tone,
}: {
  animate?: boolean;
  state?: StatusDotState;
  tone?: StatusDotTone;
}): ResolvedStatusDotConfig {
  if (state) {
    const stateEntry = statusDotStateConfig[state];
    const toneEntry = statusDotToneConfig[stateEntry.tone];

    return {
      animate: animate ?? stateEntry.animate,
      colorVar:
        "colorVar" in stateEntry ? stateEntry.colorVar : toneEntry.colorVar,
      defaultLabel: stateEntry.label,
      tone: stateEntry.tone,
    };
  }

  const resolvedTone = tone ?? "neutral";
  const toneEntry = statusDotToneConfig[resolvedTone];

  return {
    animate: animate ?? resolvedTone === "active",
    colorVar: toneEntry.colorVar,
    defaultLabel: toneEntry.label,
    tone: resolvedTone,
  };
}

function resolveStatusDotAccessibleName(defaultLabel: string, label?: string) {
  return label && label.length > 0 ? label : defaultLabel;
}

function resolveStatusDotLabel({
  defaultLabel,
  label,
  showLabel = false,
}: {
  defaultLabel: string;
  label?: string;
  showLabel?: boolean;
}) {
  const accessibleName = resolveStatusDotAccessibleName(defaultLabel, label);

  if (!showLabel) {
    return {
      accessibleName,
      displayLabel: null,
    };
  }

  return {
    accessibleName,
    displayLabel: accessibleName,
  };
}

function resolveStatusDotA11yProps({
  accessibleName,
  showVisibleLabel,
}: {
  accessibleName: string;
  showVisibleLabel: boolean;
}) {
  if (showVisibleLabel) {
    return {
      "aria-live": "polite" as const,
      role: "status" as const,
    };
  }

  return {
    "aria-label": accessibleName,
    "aria-live": "polite" as const,
    role: "status" as const,
  };
}

function RippleRing({
  delay,
  dotSize,
  rippleSpread,
}: {
  delay: number;
  dotSize: number;
  rippleSpread: string;
}) {
  return (
    <span
      aria-hidden
      className="iconiq-status-dot-ripple pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full motion-reduce:hidden"
      style={{
        width: dotSize,
        height: dotSize,
        animationDelay: `${delay}s`,
        ["--status-dot-ripple-spread" as string]: rippleSpread,
      }}
    />
  );
}

const StatusDot = forwardRef<HTMLElement, StatusDotProps>(function StatusDot(
  {
    animate,
    className,
    inline = true,
    label,
    labelClassName,
    showLabel = false,
    size = "md",
    state,
    style,
    tone,
    ...props
  },
  ref
) {
  const config = getStatusDotConfig({ animate, state, tone });
  const sizeConfig = statusDotSizeConfig[size];
  const { accessibleName, displayLabel } = resolveStatusDotLabel({
    defaultLabel: config.defaultLabel,
    label,
    showLabel,
  });
  const a11yProps = resolveStatusDotA11yProps({
    accessibleName,
    showVisibleLabel: Boolean(displayLabel),
  });
  const shouldAnimate = config.animate;
  const Root = inline ? "span" : "div";

  useLayoutEffect(() => {
    ensureStatusDotStyles();
  }, []);

  const colorStyle = {
    ["--status-dot-color" as string]: config.colorVar,
  } as CSSProperties;

  const rootStyle = {
    ...style,
    ...colorStyle,
  } as CSSProperties;

  return createElement(
    Root,
    {
      className: cn(
        componentThemeClassName,
        inline ? "inline-flex" : "flex",
        "items-center gap-2",
        className
      ),
      ref,
      style: rootStyle,
      ...props,
      ...a11yProps,
    },
    <span
      aria-hidden
      className="relative shrink-0 overflow-visible"
      style={{
        width: sizeConfig.container,
        height: sizeConfig.container,
        ...colorStyle,
      }}
    >
      {shouldAnimate
        ? RIPPLE_DELAYS.map((delay) => (
            <RippleRing
              delay={delay}
              dotSize={sizeConfig.dot}
              key={delay}
              rippleSpread={sizeConfig.rippleSpread}
            />
          ))
        : null}
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: sizeConfig.dot,
          height: sizeConfig.dot,
          backgroundColor: "var(--status-dot-color)",
        }}
      />
    </span>,
    displayLabel ? (
      <span
        className={cn(
          "font-medium text-[color:var(--ic-muted-foreground)] text-sm",
          labelClassName
        )}
      >
        {displayLabel}
      </span>
    ) : null
  );
});

StatusDot.displayName = "StatusDot";

export {
  getStatusDotConfig,
  resolveStatusDotAccessibleName,
  resolveStatusDotA11yProps,
  resolveStatusDotLabel,
  StatusDot,
  statusDotSizeConfig,
  statusDotStateConfig,
  statusDotStates,
  statusDotToneConfig,
  statusDotTones,
};
export default StatusDot;
export type {
  ResolvedStatusDotConfig,
  StatusDotProps,
  StatusDotSize,
  StatusDotState,
  StatusDotTone,
};
