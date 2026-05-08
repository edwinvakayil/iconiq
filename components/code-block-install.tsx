"use client";

import { useMemo } from "react";

import { InstallCommandTerminal } from "@/components/install-command-terminal";
import { getPackageManagerPrefix } from "@/lib/get-package-manager-prefix";

export function CodeBlockInstall({
  componentName = "code-block",
  className,
}: {
  componentName?: string;
  className?: string;
}) {
  const commands = useMemo(
    () => ({
      pnpm: `${getPackageManagerPrefix("pnpm")} shadcn@latest add @iconiq/${componentName}`,
      npm: `${getPackageManagerPrefix("npm")} shadcn@latest add @iconiq/${componentName}`,
      yarn: `${getPackageManagerPrefix("yarn")} shadcn@latest add @iconiq/${componentName}`,
      bun: `${getPackageManagerPrefix("bun")} shadcn@latest add @iconiq/${componentName}`,
    }),
    [componentName]
  );

  return <InstallCommandTerminal className={className} commands={commands} />;
}
