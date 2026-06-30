import type * as React from "react";

import { cn } from "@/lib/utils";

type SeparatorVariant = "line" | "dashed" | "dotted";
type SeparatorTone = "default" | "muted" | "brand" | "destructive";
type SeparatorSpacing = "none" | "sm" | "md" | "lg";

type SeparatorProps = React.HTMLAttributes<HTMLDivElement> & {
  decorative?: boolean;
  inset?: boolean;
  orientation?: "horizontal" | "vertical";
  spacing?: SeparatorSpacing;
  tone?: SeparatorTone;
  variant?: SeparatorVariant;
};

type SeparatorLabelProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  labelClassName?: string;
  separatorClassName?: string;
  tone?: SeparatorTone;
  variant?: SeparatorVariant;
};

const toneClassNames: Record<SeparatorTone, string> = {
  default: "[--separator-tone:var(--border)]",
  muted:
    "[--separator-tone:color-mix(in_oklch,var(--muted-foreground)_32%,transparent)]",
  brand: "[--separator-tone:var(--brand)]",
  destructive: "[--separator-tone:var(--destructive)]",
};

const spacingClassNames: Record<SeparatorSpacing, string> = {
  none: "",
  sm: "data-[orientation=horizontal]:my-2 data-[orientation=vertical]:mx-2",
  md: "data-[orientation=horizontal]:my-4 data-[orientation=vertical]:mx-4",
  lg: "data-[orientation=horizontal]:my-6 data-[orientation=vertical]:mx-6",
};

const separatorVariants: Record<
  NonNullable<SeparatorProps["orientation"]>,
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
      "box-border h-auto min-h-4 w-0 self-stretch border-0 border-[color:var(--separator-tone)] border-l border-dotted bg-transparent",
  },
};

function getInsetClassName(
  inset: boolean,
  orientation: NonNullable<SeparatorProps["orientation"]>
) {
  if (!inset) {
    return "";
  }

  return orientation === "horizontal" ? "-mx-1 my-1" : "mx-1 -my-1";
}

function Separator({
  className,
  decorative = true,
  inset = false,
  orientation = "horizontal",
  spacing = "none",
  tone = "default",
  variant = "line",
  ...props
}: SeparatorProps) {
  return (
    <div
      aria-hidden={decorative ? true : undefined}
      className={cn(
        toneClassNames[tone],
        spacingClassNames[spacing],
        getInsetClassName(inset, orientation),
        "shrink-0",
        separatorVariants[orientation][variant],
        className
      )}
      data-orientation={orientation}
      data-slot="separator"
      role={decorative ? "presentation" : "separator"}
      {...(decorative ? {} : { "aria-orientation": orientation })}
      {...props}
    />
  );
}

function SeparatorLabel({
  children,
  className,
  labelClassName,
  separatorClassName,
  tone = "default",
  variant = "line",
  ...props
}: SeparatorLabelProps) {
  return (
    <div
      className={cn("flex items-center gap-3", className)}
      data-slot="separator-label"
      {...props}
    >
      <Separator className={separatorClassName} tone={tone} variant={variant} />
      <span
        className={cn("shrink-0 text-muted-foreground text-xs", labelClassName)}
      >
        {children}
      </span>
      <Separator className={separatorClassName} tone={tone} variant={variant} />
    </div>
  );
}

export { Separator, SeparatorLabel };
export type {
  SeparatorLabelProps,
  SeparatorProps,
  SeparatorSpacing,
  SeparatorTone,
  SeparatorVariant,
};
