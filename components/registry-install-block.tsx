"use client";

import { CopyIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import type { ActionStatus } from "@/components/ui/action-state";
import { ActionState } from "@/components/ui/action-state";
import { PACKAGE_MANAGER, SITE } from "@/constants";
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
      <div className="mb-3 flex flex-wrap gap-1.5">
        {Object.values(PACKAGE_MANAGER).map((pm) => (
          <button
            className={cn(
              "rounded-md border border-border/75 bg-background px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-150",
              packageName === pm
                ? "border-foreground bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
            )}
            key={pm}
            onClick={() => setPackageName(pm)}
            type="button"
          >
            {pm}
          </button>
        ))}
      </div>

      <div className="flex min-w-0 items-stretch overflow-hidden rounded-lg border border-border/80 bg-background">
        <div className="min-w-0 flex-1 overflow-x-auto px-4 py-3 sm:px-5">
          <span className="sr-only">{getCommand(packageName)}</span>
          <p
            aria-hidden="true"
            className="whitespace-nowrap font-mono text-[13px] leading-none tracking-[-0.04em] sm:text-[14px]"
          >
            <span className="text-muted-foreground">
              {getPackageManagerPrefix(packageName)}
            </span>{" "}
            <span className="text-foreground">shadcn@latest add</span>{" "}
            <span className="text-muted-foreground">{SITE.URL}/r/</span>
            <span className="font-semibold text-foreground">
              {registryPath}
            </span>
          </p>
        </div>
        <button
          aria-disabled={status !== "idle"}
          aria-label="Copy to clipboard"
          className="inline-flex shrink-0 items-center justify-center border-border/80 border-l px-3.5 text-muted-foreground transition-colors duration-150 hover:bg-muted/25 hover:text-foreground sm:px-4"
          onClick={handleCopy}
          tabIndex={0}
          type="button"
        >
          <ActionState status={status}>
            <CopyIcon
              aria-hidden="true"
              className="size-3.5 text-muted-foreground"
            />
          </ActionState>
        </button>
      </div>
    </div>
  );
}
