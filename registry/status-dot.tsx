"use client";

import { Fragment } from "react";

export type StatusDotState =
  | "QUEUED"
  | "BUILDING"
  | "ERROR"
  | "READY"
  | "CANCELED";

export interface StatusDotProps {
  label?: string;
  state: StatusDotState;
}

const STYLE_ID = "iconiq-status-dot-styles";

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
  animation: iconiq-status-dot-ripple 2.25s ease-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .iconiq-status-dot-ripple {
    animation: none;
  }
}
`;

const stateConfig = {
  QUEUED: { color: "#d1d5db", label: "Queued" },
  BUILDING: { color: "#f59e0b", label: "Building" },
  ERROR: { color: "#ef4444", label: "Error" },
  READY: { color: "#14b8a6", label: "Ready" },
  CANCELED: { color: "#9ca3af", label: "Canceled" },
} as const;

const DOT_SIZE = 8;
const RIPPLE_DURATION = 2.25;
const RIPPLE_DELAYS = [0, RIPPLE_DURATION / 2] as const;

const rippleStrength = {
  light: { alpha: 0.48, spread: 9 },
  dark: { alpha: 0.58, spread: 10 },
} as const;

type RippleVariant = keyof typeof rippleStrength;

function colorAlpha(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function ensureStatusDotStyles() {
  if (typeof document === "undefined") {
    return;
  }

  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = STATUS_DOT_CSS;
  document.head.appendChild(style);
}

function RippleRing({
  color,
  delay,
  variant,
}: {
  color: string;
  delay: number;
  variant: RippleVariant;
}) {
  const strength = rippleStrength[variant];
  const visibilityClass =
    variant === "light" ? "dark:hidden" : "hidden dark:block";

  return (
    <span
      aria-hidden
      className={`iconiq-status-dot-ripple pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full motion-reduce:hidden ${visibilityClass}`}
      style={{
        width: DOT_SIZE,
        height: DOT_SIZE,
        animationDelay: `${delay}s`,
        ["--status-dot-ripple-mid" as string]: colorAlpha(
          color,
          strength.alpha
        ),
        ["--status-dot-ripple-end" as string]: colorAlpha(color, 0),
        ["--status-dot-ripple-spread" as string]: `${strength.spread}px`,
      }}
    />
  );
}

export function StatusDot({ label, state }: StatusDotProps) {
  ensureStatusDotStyles();

  const config = stateConfig[state];
  const hasCustomLabel = label !== undefined;
  const displayLabel = hasCustomLabel ? label : config.label;
  const accessibleName = displayLabel || config.label;

  return (
    <div className="flex items-center gap-2">
      <div
        aria-hidden
        className="relative shrink-0 overflow-visible"
        style={{ width: 20, height: 20 }}
      >
        {RIPPLE_DELAYS.map((delay) => (
          <Fragment key={delay}>
            <RippleRing
              color={config.color}
              delay={delay}
              key={`${state}-light-${delay}`}
              variant="light"
            />
            <RippleRing
              color={config.color}
              delay={delay}
              key={`${state}-dark-${delay}`}
              variant="dark"
            />
          </Fragment>
        ))}
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: DOT_SIZE,
            height: DOT_SIZE,
            backgroundColor: config.color,
          }}
        />
      </div>
      {displayLabel ? (
        <span className="font-medium text-muted-foreground text-sm">
          {displayLabel}
        </span>
      ) : (
        <span className="sr-only">{accessibleName}</span>
      )}
    </div>
  );
}
