"use client";

import { PACKAGE_MANAGER } from "@/constants";
import { cn } from "@/lib/utils";

type PackageManagerSwitcherProps = {
  value: (typeof PACKAGE_MANAGER)[keyof typeof PACKAGE_MANAGER];
  onValueChange: (
    value: (typeof PACKAGE_MANAGER)[keyof typeof PACKAGE_MANAGER]
  ) => void;
  className?: string;
};

export function PackageManagerSwitcher({
  value,
  onValueChange,
  className,
}: PackageManagerSwitcherProps) {
  return (
    <div className={cn("mb-3 flex flex-wrap gap-1.5", className)}>
      {Object.values(PACKAGE_MANAGER).map((packageManager) => (
        <button
          className={cn(
            "rounded-md border border-border/75 bg-background px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-150",
            value === packageManager
              ? "border-foreground bg-foreground text-background"
              : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
          )}
          key={packageManager}
          onClick={() => onValueChange(packageManager)}
          type="button"
        >
          {packageManager}
        </button>
      ))}
    </div>
  );
}
