"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import {
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const fillSpring = {
  type: "spring" as const,
  stiffness: 84,
  damping: 18,
  mass: 1.14,
  restDelta: 0.001,
};

const shellSpring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 24,
  mass: 0.78,
};

const indeterminateTransition = {
  duration: 1.55,
  ease: [0.24, 0.04, 0.2, 1] as const,
  repeat: Number.POSITIVE_INFINITY,
};

export type ProgressSize = "sm" | "md" | "lg";
export type ProgressTone = "default" | "brand" | "destructive" | "success";
export type ProgressVariant = "default" | "circular";

const progressTrackSizes: Record<ProgressSize, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

const progressRingContainerSizes: Record<ProgressSize, string> = {
  sm: "size-28",
  md: "size-32",
  lg: "size-40",
};

const progressRingLabelSizes: Record<ProgressSize, string> = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

const progressIndicatorTones: Record<ProgressTone, string> = {
  default: "bg-[var(--color-foreground)] dark:bg-white",
  brand: "bg-[var(--color-brand)]",
  destructive: "bg-[var(--color-destructive)]",
  success: "bg-emerald-500 dark:bg-emerald-400",
};

const progressGaugePrimaryColors: Record<ProgressTone, string> = {
  default: "var(--color-foreground)",
  brand: "var(--color-brand)",
  destructive: "var(--color-destructive)",
  success: "#10b981",
};

const progressGaugeSecondaryColors: Record<ProgressTone, string> = {
  default: "color-mix(in oklab, var(--color-foreground) 14%, transparent)",
  brand: "color-mix(in oklab, var(--color-brand) 18%, transparent)",
  destructive: "color-mix(in oklab, var(--color-destructive) 18%, transparent)",
  success: "color-mix(in oklab, #10b981 18%, transparent)",
};

const circularGaugeRadius = 45;
const circularGaugeCircumference = 2 * Math.PI * circularGaugeRadius;
const circularGaugePercentPx = circularGaugeCircumference / 100;

export interface ProgressProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  ariaLabel?: string;
  formatValue?: (value: number, percent: number) => string;
  getValueLabel?: (value: number, percent: number) => string;
  headerClassName?: string;
  helper?: string;
  indeterminateLabel?: string;
  indicatorClassName?: string;
  label?: string;
  max?: number;
  min?: number;
  showValue?: boolean;
  size?: ProgressSize;
  tone?: ProgressTone;
  trackClassName?: string;
  value?: number | null;
  variant?: ProgressVariant;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function resolveBounds(min: number, max: number) {
  return {
    min: Math.min(min, max),
    max: Math.max(min, max),
  };
}

function toPercent(value: number, min: number, max: number) {
  const range = max - min;
  if (range <= 0) {
    return value >= max ? 100 : 0;
  }

  return clamp(((value - min) / range) * 100, 0, 100);
}

function normalizeNumericValue(
  value: number | null | undefined,
  bounds: { min: number; max: number }
) {
  if (value === null) {
    return null;
  }

  const numeric = value ?? 0;
  if (!Number.isFinite(numeric)) {
    return bounds.min;
  }

  return clamp(numeric, bounds.min, bounds.max);
}

function resolveDisplayValue(
  actualValue: number,
  percent: number,
  formatValue?: (value: number, percent: number) => string
) {
  if (formatValue) {
    return formatValue(actualValue, percent);
  }

  return `${Math.round(percent)}%`;
}

function resolveAriaValueText(
  actualValue: number | null,
  percent: number,
  indeterminateLabel: string,
  getValueLabel?: (value: number, percent: number) => string,
  formatValue?: (value: number, percent: number) => string
) {
  if (actualValue === null) {
    return indeterminateLabel;
  }

  if (getValueLabel) {
    return getValueLabel(actualValue, percent);
  }

  return resolveDisplayValue(actualValue, percent, formatValue);
}

function ProgressHeader({
  displayValue,
  headerClassName,
  helper,
  helperId,
  label,
  labelId,
  showValue,
}: {
  displayValue: string | MotionValue<string>;
  headerClassName?: string;
  helper?: string;
  helperId: string;
  label?: string;
  labelId: string;
  showValue: boolean;
}) {
  if (!(label || helper || showValue)) {
    return null;
  }

  return (
    <div
      className={cn("flex items-end justify-between gap-4", headerClassName)}
    >
      <div className="space-y-1">
        {label ? (
          <span
            className="font-medium text-[12px] text-foreground/90 tracking-[-0.02em] sm:text-[13px]"
            id={labelId}
          >
            {label}
          </span>
        ) : null}
        {helper ? (
          <p
            className="max-w-xl text-[12px] text-muted-foreground leading-5 sm:text-[13px]"
            id={helperId}
          >
            {helper}
          </p>
        ) : null}
      </div>

      {showValue ? (
        <motion.span
          animate={{ opacity: 1, y: 0 }}
          className="shrink-0 font-medium text-[12px] text-muted-foreground tabular-nums tracking-[-0.02em] sm:text-[13px]"
          transition={shellSpring}
        >
          {displayValue}
        </motion.span>
      ) : null}
    </div>
  );
}

function DeterminateFill({
  fillScale,
  indicatorClassName,
  tone,
}: {
  fillScale: MotionValue<number>;
  indicatorClassName?: string;
  tone: ProgressTone;
}) {
  return (
    <ProgressPrimitive.Indicator
      render={(props) => (
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0 h-full w-full origin-left rounded-full will-change-transform",
            progressIndicatorTones[tone],
            indicatorClassName,
            props.className
          )}
          ref={props.ref}
          style={{ ...props.style, width: "100%", scaleX: fillScale }}
        />
      )}
    />
  );
}

function IndeterminateFill({ tone }: { tone: ProgressTone }) {
  const toneClassName =
    tone === "default"
      ? "[--progress-indeterminate-core:color-mix(in_srgb,var(--ic-foreground)_16%,transparent)] [--progress-indeterminate-soft:color-mix(in_srgb,var(--ic-foreground)_8%,transparent)] dark:[--progress-indeterminate-core:color-mix(in_srgb,var(--ic-foreground)_14%,transparent)] dark:[--progress-indeterminate-soft:color-mix(in_srgb,var(--ic-foreground)_7%,transparent)]"
      : tone === "brand"
        ? "[--progress-indeterminate-core:color-mix(in_srgb,var(--ic-brand)_72%,transparent)] [--progress-indeterminate-soft:color-mix(in_srgb,var(--ic-brand)_36%,transparent)]"
        : tone === "destructive"
          ? "[--progress-indeterminate-core:color-mix(in_srgb,var(--ic-destructive)_72%,transparent)] [--progress-indeterminate-soft:color-mix(in_srgb,var(--ic-destructive)_36%,transparent)]"
          : "[--progress-indeterminate-core:color-mix(in_srgb,#10b981_72%,transparent)] [--progress-indeterminate-soft:color-mix(in_srgb,#10b981_36%,transparent)]";

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden rounded-full">
      <motion.div
        animate={{
          opacity: [0, 0.92, 0.92, 0],
          scaleX: [0.94, 1, 0.96],
          x: ["-44%", "238%"],
        }}
        className={cn(
          "absolute inset-y-0 left-0 w-[38%] rounded-full",
          toneClassName
        )}
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent 0%, var(--progress-indeterminate-soft) 16%, var(--progress-indeterminate-core) 50%, var(--progress-indeterminate-soft) 84%, transparent 100%)",
        }}
        transition={{
          ...indeterminateTransition,
          times: [0, 0.14, 0.84, 1],
        }}
      />
    </div>
  );
}

function CircularCenterValue({
  currentPercent,
  displayValue,
  size,
}: {
  currentPercent: number;
  displayValue: string | MotionValue<string>;
  size: ProgressSize;
}) {
  const className = cn(
    "pointer-events-none absolute inset-0 m-auto flex size-fit max-w-[78%] items-center justify-center truncate text-center font-semibold tabular-nums",
    progressRingLabelSizes[size]
  );

  if (typeof displayValue === "string") {
    return (
      <span className={className} data-current-value={currentPercent}>
        {displayValue}
      </span>
    );
  }

  return (
    <motion.span className={className} data-current-value={currentPercent}>
      {displayValue}
    </motion.span>
  );
}

function CircularProgressVisual({
  clampedValue,
  currentPercent,
  displayValue,
  indeterminateLabel,
  indicatorClassName,
  showValue,
  size,
  tone,
  trackClassName,
}: {
  clampedValue: number | null;
  currentPercent: number;
  displayValue: string | MotionValue<string>;
  indeterminateLabel: string;
  indicatorClassName?: string;
  showValue: boolean;
  size: ProgressSize;
  tone: ProgressTone;
  trackClassName?: string;
}) {
  const gaugePrimaryColor = progressGaugePrimaryColors[tone];
  const gaugeSecondaryColor = progressGaugeSecondaryColors[tone];
  const gaugeStyle = {
    "--circle-size": "100px",
    "--circumference": circularGaugeCircumference,
    "--percent-to-px": `${circularGaugePercentPx}px`,
    "--gap-percent": "5",
    "--offset-factor": "0",
    "--transition-length": "1s",
    "--transition-step": "200ms",
    "--delay": "0s",
    "--percent-to-deg": "3.6deg",
    transform: "translateZ(0)",
  } as React.CSSProperties;

  if (clampedValue === null) {
    return (
      <div
        className={cn(
          "relative shrink-0 font-semibold",
          progressRingContainerSizes[size],
          trackClassName
        )}
        style={gaugeStyle}
      >
        <motion.svg
          animate={{ rotate: 360 }}
          aria-hidden
          className="size-full"
          fill="none"
          transition={{
            duration: 1.15,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            fill="none"
            r={circularGaugeRadius}
            stroke={gaugeSecondaryColor}
            strokeWidth="10"
          />
          <circle
            className={indicatorClassName}
            cx="50"
            cy="50"
            fill="none"
            r={circularGaugeRadius}
            stroke={gaugePrimaryColor}
            strokeDasharray={`${circularGaugeCircumference * 0.28} ${circularGaugeCircumference * 0.72}`}
            strokeLinecap="round"
            strokeWidth="10"
          />
        </motion.svg>
        {showValue ? (
          <CircularCenterValue
            currentPercent={0}
            displayValue={indeterminateLabel}
            size={size}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative shrink-0 font-semibold",
        progressRingContainerSizes[size],
        trackClassName
      )}
      style={gaugeStyle}
    >
      <svg
        aria-hidden
        className="size-full"
        fill="none"
        strokeWidth="2"
        viewBox="0 0 100 100"
      >
        {currentPercent <= 90 && currentPercent >= 0 ? (
          <circle
            className="opacity-100"
            cx="50"
            cy="50"
            fill="none"
            r={circularGaugeRadius}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="10"
            style={
              {
                stroke: gaugeSecondaryColor,
                "--stroke-percent": 90 - currentPercent,
                "--offset-factor-secondary": "calc(1 - var(--offset-factor))",
                strokeDasharray:
                  "calc(var(--stroke-percent) * var(--percent-to-px)) var(--circumference)",
                transform:
                  "rotate(calc(1turn - 90deg - (var(--gap-percent) * var(--percent-to-deg) * var(--offset-factor-secondary)))) scaleY(-1)",
                transition: "all var(--transition-length) ease var(--delay)",
                transformOrigin:
                  "calc(var(--circle-size) / 2) calc(var(--circle-size) / 2)",
              } as React.CSSProperties
            }
          />
        ) : null}
        <circle
          className={cn("opacity-100", indicatorClassName)}
          cx="50"
          cy="50"
          fill="none"
          r={circularGaugeRadius}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="10"
          style={
            {
              stroke: gaugePrimaryColor,
              "--stroke-percent": currentPercent,
              strokeDasharray:
                "calc(var(--stroke-percent) * var(--percent-to-px)) var(--circumference)",
              transition:
                "var(--transition-length) ease var(--delay),stroke var(--transition-length) ease var(--delay)",
              transitionProperty: "stroke-dasharray,transform",
              transform:
                "rotate(calc(-90deg + var(--gap-percent) * var(--offset-factor) * var(--percent-to-deg)))",
              transformOrigin:
                "calc(var(--circle-size) / 2) calc(var(--circle-size) / 2)",
            } as React.CSSProperties
          }
        />
      </svg>
      {showValue ? (
        <CircularCenterValue
          currentPercent={currentPercent}
          displayValue={displayValue}
          size={size}
        />
      ) : null}
    </div>
  );
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  function Progress(
    {
      ariaLabel,
      className,
      formatValue,
      getValueLabel,
      headerClassName,
      helper,
      id,
      indeterminateLabel = "In progress",
      indicatorClassName,
      label,
      max = 100,
      min = 0,
      showValue = true,
      size = "md",
      tone = "default",
      trackClassName,
      value = 0,
      variant = "default",
      ...props
    },
    ref
  ) {
    const labelId = React.useId();
    const helperId = React.useId();
    const isCircular = variant === "circular";
    const bounds = resolveBounds(min, max);
    const clampedValue = normalizeNumericValue(value, bounds);
    const progress =
      clampedValue === null
        ? 0
        : toPercent(clampedValue, bounds.min, bounds.max);
    const progressTargetMV = useMotionValue(progress);
    const smoothProgressMV = useSpring(progressTargetMV, fillSpring);
    const formatValueRef = React.useRef(formatValue);
    formatValueRef.current = formatValue;
    const fillScale = useTransform(smoothProgressMV, (currentProgress) => {
      return currentProgress / 100;
    });
    const displayValue = useTransform(smoothProgressMV, (currentProgress) => {
      const actualValue =
        bounds.min + ((bounds.max - bounds.min) * currentProgress) / 100;

      return resolveDisplayValue(
        actualValue,
        currentProgress,
        formatValueRef.current
      );
    });
    const hasInitializedMotion = React.useRef(false);

    React.useEffect(() => {
      if (clampedValue === null) {
        progressTargetMV.jump(progress);
        smoothProgressMV.jump(progress);
        hasInitializedMotion.current = true;
        return;
      }

      if (!hasInitializedMotion.current) {
        progressTargetMV.jump(progress);
        smoothProgressMV.jump(progress);
        hasInitializedMotion.current = true;
        return;
      }

      progressTargetMV.set(progress);
    }, [clampedValue, progress, progressTargetMV, smoothProgressMV]);

    const renderedValue =
      clampedValue === null ? indeterminateLabel : displayValue;
    const currentPercent = clamp(Math.round(progress), 0, 100);
    const circularCenterValue =
      clampedValue === null
        ? indeterminateLabel
        : formatValue
          ? renderedValue
          : String(currentPercent);

    return (
      <div
        className={cn(
          componentThemeClassName,
          isCircular
            ? "inline-flex w-auto flex-col items-center gap-3"
            : "w-full space-y-3",
          className
        )}
        id={id}
        ref={ref}
        {...props}
      >
        <ProgressHeader
          displayValue={renderedValue}
          headerClassName={cn(isCircular && "w-full min-w-0", headerClassName)}
          helper={helper}
          helperId={helperId}
          label={label}
          labelId={labelId}
          showValue={showValue && !isCircular}
        />

        <ProgressPrimitive.Root
          aria-describedby={helper ? helperId : undefined}
          aria-label={ariaLabel ?? (label ? undefined : "Progress")}
          aria-labelledby={label ? labelId : undefined}
          className={cn(isCircular && "inline-flex shrink-0")}
          getAriaValueText={(_, actualValue) => {
            const currentPercentValue =
              actualValue === null
                ? 0
                : clamp(
                    Math.round(toPercent(actualValue, bounds.min, bounds.max)),
                    0,
                    100
                  );
            return resolveAriaValueText(
              actualValue,
              currentPercentValue,
              indeterminateLabel,
              getValueLabel,
              formatValue
            );
          }}
          max={bounds.max}
          min={bounds.min}
          value={clampedValue}
        >
          {isCircular ? (
            <CircularProgressVisual
              clampedValue={clampedValue}
              currentPercent={currentPercent}
              displayValue={circularCenterValue}
              indeterminateLabel={indeterminateLabel}
              indicatorClassName={indicatorClassName}
              showValue={showValue}
              size={size}
              tone={tone}
              trackClassName={trackClassName}
            />
          ) : (
            <ProgressPrimitive.Track
              className={cn(
                "relative overflow-hidden rounded-full bg-foreground/8 dark:bg-white/[0.08]",
                progressTrackSizes[size],
                trackClassName
              )}
            >
              {clampedValue === null ? (
                <IndeterminateFill tone={tone} />
              ) : (
                <DeterminateFill
                  fillScale={fillScale}
                  indicatorClassName={indicatorClassName}
                  tone={tone}
                />
              )}
            </ProgressPrimitive.Track>
          )}
        </ProgressPrimitive.Root>
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress as progress };
