import type * as React from "react";

import { cn } from "@/lib/utils";

type SeparatorProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
};

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <div
      aria-hidden={decorative}
      className={cn(
        "shrink-0",
        orientation === "horizontal"
          ? "h-px w-full bg-[length:8px_1px] bg-[linear-gradient(90deg,var(--separator-dash)_0,var(--separator-dash)_58%,transparent_58%,transparent_100%)] bg-repeat-x"
          : "h-full w-px bg-[length:1px_8px] bg-[linear-gradient(180deg,var(--separator-dash)_0,var(--separator-dash)_58%,transparent_58%,transparent_100%)] bg-repeat-y",
        className
      )}
      data-slot="separator"
      role={decorative ? "presentation" : "separator"}
      {...props}
    />
  );
}

export { Separator };
