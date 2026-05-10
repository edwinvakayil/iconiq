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
    <div className={cn("mb-3", className)}>
      <div className="inline-flex items-center gap-1 rounded-lg bg-muted/60 p-1">
        {Object.values(PACKAGE_MANAGER).map((packageManager) => {
          const isActive = value === packageManager;

          return (
            <button
              className={cn(
                "inline-flex min-h-9 items-center justify-center rounded-md px-4 py-3 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.24em] outline-none transition-[background-color,color,box-shadow] duration-150 hover:text-foreground sm:px-5",
                "focus-visible:ring-1 focus-visible:ring-foreground/15 dark:focus-visible:ring-foreground/20",
                isActive &&
                  "bg-background text-foreground shadow-[0_0_0_1px_rgba(15,23,42,0.08),0_2px_6px_rgba(15,23,42,0.08)] dark:bg-[#0B0B09] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_18px_rgba(0,0,0,0.18)]"
              )}
              key={packageManager}
              onClick={() => onValueChange(packageManager)}
              type="button"
            >
              {packageManager}
            </button>
          );
        })}
      </div>
    </div>
  );
}
