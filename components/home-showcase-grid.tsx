import type { ReactNode } from "react";

import { DesignSectionRulers } from "@/components/design/design-section-rulers";
import { GridCornerDots } from "@/components/design/line-grid";
import { cn } from "@/lib/utils";

export function HomeShowcaseGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col overflow-visible border-border border-t border-l",
        className
      )}
    >
      {children}
      <DesignSectionRulers />
    </div>
  );
}

export function HomeShowcaseRow({
  children,
  columnWeights,
  className,
}: {
  children: ReactNode;
  columnWeights: number[];
  className?: string;
}) {
  return (
    <div className={cn("relative w-full overflow-visible", className)}>
      <div className="grid w-full grid-cols-1 overflow-visible md:grid-cols-12">
        {children}
      </div>
      <GridCornerDots
        className="z-3 hidden md:block"
        columns={columnWeights.length}
        columnWeights={columnWeights}
        rows={1}
      />
    </div>
  );
}
