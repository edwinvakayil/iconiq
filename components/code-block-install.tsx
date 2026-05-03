"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { CommandBar } from "@/components/command-bar";
import { PackageManagerSwitcher } from "@/components/package-manager-switcher";
import type { ActionStatus } from "@/components/ui/action-state";
import { getPackageManagerPrefix } from "@/lib/get-package-manager-prefix";
import { cn } from "@/lib/utils";
import { usePackageNameContext } from "@/providers/package-name";

export function CodeBlockInstall({
  componentName = "code-block",
  className,
}: {
  componentName?: string;
  className?: string;
}) {
  const [state, setState] = useState<ActionStatus>("idle");
  const [_, startTransition] = useTransition();
  const { packageName, setPackageName } = usePackageNameContext();

  const cliCommand = `${getPackageManagerPrefix(packageName)} shadcn@latest add @iconiq/${componentName}`;

  const handleCopyToClipboard = () => {
    startTransition(async () => {
      try {
        await navigator.clipboard.writeText(cliCommand);
        setState("done");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setState("idle");
      } catch {
        toast.error("Failed to copy to clipboard", {
          description: "Please check your browser permissions.",
        });
        setState("error");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setState("idle");
      }
    });
  };

  return (
    <div className={cn("relative mt-0 w-full min-w-0 px-0", className)}>
      <PackageManagerSwitcher
        onValueChange={setPackageName}
        value={packageName}
      />
      <CommandBar
        onCopy={handleCopyToClipboard}
        srLabel={`${getPackageManagerPrefix(packageName)} shadcn@latest add @iconiq/${componentName}`}
        status={state}
      >
        <span className="text-muted-foreground">
          {getPackageManagerPrefix(packageName)}
        </span>
        <span className="text-foreground">shadcn@latest add</span>
        <span className="text-foreground">
          @iconiq/<span>{componentName}</span>
        </span>
      </CommandBar>
    </div>
  );
}
