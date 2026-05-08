"use client";

import { useMemo } from "react";

import { InstallCommandTerminal } from "@/components/install-command-terminal";
import { SITE } from "@/constants";
import { getPackageManagerPrefix } from "@/lib/get-package-manager-prefix";

export function RegistryInstallBlock({
  registryPath,
  className,
}: {
  registryPath: string;
  className?: string;
}) {
  const commands = useMemo(
    () => ({
      pnpm: `${getPackageManagerPrefix("pnpm")} shadcn@latest add ${SITE.URL}/r/${registryPath}`,
      npm: `${getPackageManagerPrefix("npm")} shadcn@latest add ${SITE.URL}/r/${registryPath}`,
      yarn: `${getPackageManagerPrefix("yarn")} shadcn@latest add ${SITE.URL}/r/${registryPath}`,
      bun: `${getPackageManagerPrefix("bun")} shadcn@latest add ${SITE.URL}/r/${registryPath}`,
    }),
    [registryPath]
  );

  return <InstallCommandTerminal className={className} commands={commands} />;
}
