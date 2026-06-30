"use client";

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

type SeparatorOrientation = "horizontal" | "vertical";
type SeparatorVariant = "line" | "dashed" | "dotted";
type SeparatorTone = "default" | "muted" | "brand" | "destructive";
type SeparatorSpacing = "none" | "sm" | "md" | "lg";

type SeparatorStyleOptions = {
  className?: string;
  inset: boolean;
  orientation: SeparatorOrientation;
  spacing: SeparatorSpacing;
  tone: SeparatorTone;
  variant: SeparatorVariant;
};

export interface SeparatorProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SeparatorPrimitive>,
    "className" | "role" | "aria-hidden" | "aria-orientation"
  > {
  className?: string;
  decorative?: boolean;
  inset?: boolean;
  spacing?: SeparatorSpacing;
  tone?: SeparatorTone;
  variant?: SeparatorVariant;
}

export interface SeparatorLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  labelClassName?: string;
  separatorClassName?: string;
  tone?: SeparatorTone;
  variant?: SeparatorVariant;
}

const TONE_CLASS_NAMES: Record<SeparatorTone, string> = {
  default: "[--separator-tone:var(--ic-border)]",
  muted:
    "[--separator-tone:color-mix(in_oklch,var(--ic-muted-foreground)_32%,transparent)]",
  brand: "[--separator-tone:var(--ic-brand)]",
  destructive: "[--separator-tone:var(--ic-destructive)]",
};

const SPACING_CLASS_NAMES: Record<SeparatorSpacing, string> = {
  none: "",
  sm: "data-[orientation=horizontal]:my-2 data-[orientation=vertical]:mx-2",
  md: "data-[orientation=horizontal]:my-4 data-[orientation=vertical]:mx-4",
  lg: "data-[orientation=horizontal]:my-6 data-[orientation=vertical]:mx-6",
};

const INSET_CLASS_NAMES: Record<SeparatorOrientation, string> = {
  horizontal: "-mx-1 my-1",
  vertical: "mx-1 -my-1",
};

const VARIANT_CLASS_NAMES: Record<
  SeparatorOrientation,
  Record<SeparatorVariant, string>
> = {
  horizontal: {
    line: "h-px w-full bg-[var(--separator-tone)]",
    dashed:
      "h-px w-full bg-[length:8px_1px] bg-[linear-gradient(90deg,var(--separator-tone)_0,var(--separator-tone)_58%,transparent_58%,transparent_100%)] bg-repeat-x",
    dotted:
      "box-border h-px w-full border-0 border-[color:var(--separator-tone)] border-t border-dotted bg-transparent",
  },
  vertical: {
    line: "h-auto min-h-4 w-px self-stretch bg-[var(--separator-tone)]",
    dashed:
      "h-auto min-h-4 w-px self-stretch bg-[length:1px_8px] bg-[linear-gradient(180deg,var(--separator-tone)_0,var(--separator-tone)_58%,transparent_58%,transparent_100%)] bg-repeat-y",
    dotted:
      "box-border h-auto min-h-4 w-px self-stretch border-0 border-[color:var(--separator-tone)] border-l border-dotted bg-transparent",
  },
};

function getSeparatorClassName({
  className,
  inset,
  orientation,
  spacing,
  tone,
  variant,
}: SeparatorStyleOptions) {
  return cn(
    componentThemeClassName,
    TONE_CLASS_NAMES[tone],
    SPACING_CLASS_NAMES[spacing],
    inset ? INSET_CLASS_NAMES[orientation] : undefined,
    "shrink-0",
    VARIANT_CLASS_NAMES[orientation][variant],
    className
  );
}

function getDecorativeA11yProps(
  decorative: boolean,
  orientation: SeparatorOrientation
): Pick<
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive>,
  "aria-hidden" | "aria-orientation" | "role"
> {
  if (decorative) {
    return {
      "aria-hidden": true,
      role: "presentation",
    };
  }

  return {
    "aria-orientation": orientation,
    role: "separator",
  };
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      className,
      decorative = true,
      inset = false,
      orientation = "horizontal",
      spacing = "none",
      tone = "default",
      variant = "line",
      ...props
    },
    ref
  ) => (
    <SeparatorPrimitive
      {...props}
      className={getSeparatorClassName({
        className,
        inset,
        orientation,
        spacing,
        tone,
        variant,
      })}
      data-orientation={orientation}
      data-slot="separator"
      orientation={orientation}
      ref={ref}
      {...getDecorativeA11yProps(decorative, orientation)}
    />
  )
);

Separator.displayName = "Separator";

function SeparatorLabel({
  children,
  className,
  labelClassName,
  separatorClassName,
  tone = "default",
  variant = "line",
  ...props
}: SeparatorLabelProps) {
  const flankingClassName = cn("flex-1", separatorClassName);

  return (
    <div
      className={cn("flex items-center gap-3", className)}
      data-slot="separator-label"
      {...props}
    >
      <Separator
        className={flankingClassName}
        decorative
        spacing="none"
        tone={tone}
        variant={variant}
      />
      <span
        className={cn("shrink-0 text-muted-foreground text-xs", labelClassName)}
      >
        {children}
      </span>
      <Separator
        className={flankingClassName}
        decorative
        spacing="none"
        tone={tone}
        variant={variant}
      />
    </div>
  );
}

SeparatorLabel.displayName = "SeparatorLabel";

export { Separator, SeparatorLabel };
export type {
  SeparatorOrientation,
  SeparatorSpacing,
  SeparatorTone,
  SeparatorVariant,
};
