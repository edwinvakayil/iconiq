"use client";

import { Terminal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { IconStatus } from "@/components/ui/icon-state";
import { IconState } from "@/components/ui/icon-state";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PACKAGE_MANAGER } from "@/constants";
import { getPackageManagerPrefix } from "@/lib/get-package-manager-prefix";
import { usePackageNameContext } from "@/providers/package-name";

export function CodeBlockInstall() {
  const [cliState, setCliState] = useState<IconStatus>("idle");
  const { packageName, setPackageName } = usePackageNameContext();
  const cliCommand = `${getPackageManagerPrefix(packageName)} shadcn add @iconiq/code-block`;

  const handleCopyCli = async () => {
    if (cliState !== "idle") return;
    try {
      await navigator.clipboard.writeText(cliCommand);
      setCliState("done");
      toast.success("Command copied", {
        description: "Run this in your project to add the component.",
      });
      setTimeout(() => setCliState("idle"), 2000);
    } catch {
      toast.error("Failed to copy");
      setCliState("error");
      setTimeout(() => setCliState("idle"), 2000);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <p className="font-medium font-sans text-[11px] text-neutral-500 uppercase tracking-wider">
          Package manager
        </p>
        <Tabs
          onValueChange={(value) =>
            setPackageName(
              value as (typeof PACKAGE_MANAGER)[keyof typeof PACKAGE_MANAGER]
            )
          }
          value={packageName}
        >
          <TabsList className="w-full max-w-[320px]">
            {Object.values(PACKAGE_MANAGER).map((pm) => (
              <TabsTrigger key={pm} value={pm}>
                {pm}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <p className="font-medium font-sans text-[11px] text-neutral-500 uppercase tracking-wider">
          Install via {packageName} / shadcn CLI
        </p>
        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50/50 px-4 py-3 font-mono text-sm">
          <code className="flex-1 truncate text-neutral-900">{cliCommand}</code>
          <Tooltip>
            <TooltipTrigger
              aria-label="Copy CLI command"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 transition-colors hover:bg-neutral-200 focus-visible:outline-1 focus-visible:outline-primary disabled:opacity-50"
              data-busy={cliState !== "idle" ? "" : undefined}
              disabled={cliState !== "idle"}
              onClick={handleCopyCli}
            >
              <IconState status={cliState}>
                <Terminal className="size-4 text-neutral-800" />
              </IconState>
            </TooltipTrigger>
            <TooltipContent>Copy shadcn CLI command</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
