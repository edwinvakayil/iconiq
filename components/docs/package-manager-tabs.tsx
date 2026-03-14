"use client";

import { useState } from "react";
import { PACKAGE_MANAGER } from "@/constants";
import { getPackageManagerPrefix } from "@/lib/get-package-manager-prefix";
import { cn } from "@/lib/utils";
import { CodeBlockSimple } from "./code-block-simple";

const LABELS: Record<
  (typeof PACKAGE_MANAGER)[keyof typeof PACKAGE_MANAGER],
  string
> = {
  [PACKAGE_MANAGER.NPM]: "NPM",
  [PACKAGE_MANAGER.PNPM]: "PNPM",
  [PACKAGE_MANAGER.YARN]: "YARN",
  [PACKAGE_MANAGER.BUN]: "BUN",
};

const MANAGERS = [
  PACKAGE_MANAGER.NPM,
  PACKAGE_MANAGER.PNPM,
  PACKAGE_MANAGER.YARN,
  PACKAGE_MANAGER.BUN,
] as const;

export function PackageManagerTabs({
  componentName,
}: {
  componentName: string;
}) {
  const [active, setActive] = useState<(typeof MANAGERS)[number]>(
    PACKAGE_MANAGER.NPM
  );
  const command = `${getPackageManagerPrefix(active)} shadcn add @iconiq/${componentName}`;

  return (
    <div className="min-w-0">
      <div className="mb-3 flex w-full min-w-0 gap-1 overflow-x-auto rounded-xl bg-muted/60 p-1.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:p-1 [&::-webkit-scrollbar]:hidden">
        {MANAGERS.map((key) => (
          <button
            className={cn(
              "shrink-0 rounded-lg px-2.5 py-1.5 font-medium text-[11px] transition-all sm:px-3 sm:text-[12px]",
              active === key
                ? "bg-card text-foreground shadow-sm dark:bg-card dark:text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            key={key}
            onClick={() => setActive(key)}
            type="button"
          >
            {LABELS[key]}
          </button>
        ))}
      </div>
      <CodeBlockSimple code={command} />
    </div>
  );
}
