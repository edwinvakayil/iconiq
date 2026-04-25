"use client";

import { CopyIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import type { IconStatus } from "@/components/ui/icon-state";
import { IconState } from "@/components/ui/icon-state";
import { PACKAGE_MANAGER, SITE } from "@/constants";
import { getPackageManagerPrefix } from "@/lib/get-package-manager-prefix";
import { cn } from "@/lib/utils";
import { usePackageNameContext } from "@/providers/package-name";

export function RegistryInstallBlock({
  registryPath,
}: {
  registryPath: string;
}) {
  const [status, setStatus] = useState<IconStatus>("idle");
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
    <div className="mt-3 w-full min-w-0">
      {/* Package manager pill switcher */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {Object.values(PACKAGE_MANAGER).map((pm) => (
          <button
            className={cn(
              "border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-150",
              packageName === pm
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-transparent text-muted-foreground hover:text-foreground"
            )}
            key={pm}
            onClick={() => setPackageName(pm)}
            type="button"
          >
            {pm}
          </button>
        ))}
      </div>

      {/* Command display */}
      <div className="flex items-center gap-2 border border-border/85 bg-muted/28 px-3.5 py-2.5">
        <div className="min-w-0 flex-1 overflow-x-auto">
          <span className="sr-only">{getCommand(packageName)}</span>
          <p
            aria-hidden="true"
            className="whitespace-nowrap font-mono text-[12px] leading-none"
          >
            <span className="text-muted-foreground">
              {getPackageManagerPrefix(packageName)}
            </span>{" "}
            <span className="text-secondary">shadcn@latest add</span>{" "}
            <span className="text-muted-foreground">{SITE.URL}/r/</span>
            <span className="font-semibold text-foreground">
              {registryPath}
            </span>
          </p>
        </div>
        <button
          aria-disabled={status !== "idle"}
          aria-label="Copy to clipboard"
          className="shrink-0 border border-transparent p-1.5 transition-colors duration-150 hover:border-border hover:bg-background"
          onClick={handleCopy}
          tabIndex={0}
          type="button"
        >
          <IconState status={status}>
            <CopyIcon
              aria-hidden="true"
              className="size-3.5 text-muted-foreground"
            />
          </IconState>
        </button>
      </div>
    </div>
  );
}
