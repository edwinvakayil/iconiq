"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { CommandBar } from "@/components/command-bar";
import { PackageManagerSwitcher } from "@/components/package-manager-switcher";
import type { ActionStatus } from "@/components/ui/action-state";
import { type PACKAGE_MANAGER, SITE } from "@/constants";
import { getPackageManagerPrefix } from "@/lib/get-package-manager-prefix";
import { cn } from "@/lib/utils";
import { usePackageNameContext } from "@/providers/package-name";

export function RegistryInstallBlock({
  registryPath,
  className,
}: {
  registryPath: string;
  className?: string;
}) {
  const [status, setStatus] = useState<ActionStatus>("idle");
  const [, startTransition] = useTransition();
  const { packageName, setPackageName } = usePackageNameContext();

  const getCommand = (
    pm: (typeof PACKAGE_MANAGER)[keyof typeof PACKAGE_MANAGER]
  ) =>
    `${getPackageManagerPrefix(pm)} shadcn@latest add ${SITE.URL}/r/${registryPath}`;

  const handleCopy = () => {
    startTransition(async () => {
      try {
        await navigator.clipboard.writeText(getCommand(packageName));
        setStatus("done");
        await new Promise((r) => setTimeout(r, 2000));
        setStatus("idle");
      } catch {
        toast.error("Failed to copy to clipboard", {
          description: "Please check your browser permissions.",
        });
        setStatus("error");
        await new Promise((r) => setTimeout(r, 2000));
        setStatus("idle");
      }
    });
  };

  return (
    <div className={cn("mt-0 w-full min-w-0", className)}>
      <PackageManagerSwitcher
        onValueChange={setPackageName}
        value={packageName}
      />

      <CommandBar
        onCopy={handleCopy}
        srLabel={getCommand(packageName)}
        status={status}
      >
        <span className="text-muted-foreground">
          {getPackageManagerPrefix(packageName)}
        </span>
        <span className="text-foreground">shadcn@latest add</span>
        <span className="text-muted-foreground">
          {SITE.URL}/r/
          <span className="font-semibold text-foreground">{registryPath}</span>
        </span>
      </CommandBar>
    </div>
  );
}
