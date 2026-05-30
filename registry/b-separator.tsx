"use client";

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import * as React from "react";

import { registryTheme } from "@/lib/registry-theme";
import { cn } from "@/lib/utils";

type SeparatorVariant = "line" | "dashed" | "dotted";

export interface SeparatorProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SeparatorPrimitive>,
    "className"
  > {
  className?: string;
  decorative?: boolean;
  variant?: SeparatorVariant;
}

const separatorVariants: Record<
  NonNullable<SeparatorProps["orientation"]>,
  Record<SeparatorVariant, string>
> = {
  horizontal: {
    line: "h-px w-full bg-border",
    dashed:
      "h-px w-full bg-[length:8px_1px] bg-[linear-gradient(90deg,var(--border)_0,var(--border)_58%,transparent_58%,transparent_100%)] bg-repeat-x",
    dotted: "h-0 w-full border-border border-t border-dotted bg-transparent",
  },
  vertical: {
    line: "h-full min-h-4 w-px bg-border",
    dashed:
      "h-full min-h-4 w-px bg-[length:1px_8px] bg-[linear-gradient(180deg,var(--border)_0,var(--border)_58%,transparent_58%,transparent_100%)] bg-repeat-y",
    dotted:
      "h-full min-h-4 w-0 border-border border-l border-dotted bg-transparent",
  },
};

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      className,
      decorative = true,
      orientation = "horizontal",
      variant = "line",
      ...props
    },
    ref
  ) => (
    <SeparatorPrimitive
      aria-hidden={decorative || undefined}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        registryTheme,
        "shrink-0",
        separatorVariants[orientation][variant],
        className
      )}
      orientation={orientation}
      ref={ref}
      role={decorative ? "presentation" : "separator"}
      {...props}
    />
  )
);

Separator.displayName = "Separator";

export { Separator };
export type { SeparatorVariant };
