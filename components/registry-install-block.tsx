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
      <div className="mb-2 flex flex-wrap gap-1.5">
        {Object.values(PACKAGE_MANAGER).map((pm) => (
          <button
            className={cn(
              "rounded-full px-2.5 py-0.5 font-medium font-mono text-[10px] uppercase tracking-wider transition-colors duration-150",
              packageName === pm
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
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
      <div className="flex items-center gap-2 rounded-xl border border-neutral-200/80 bg-neutral-50 px-3.5 py-2.5 dark:border-neutral-700/50 dark:bg-neutral-900/60">
        <div className="min-w-0 flex-1 overflow-x-auto">
          <span className="sr-only">{getCommand(packageName)}</span>
          <p
            aria-hidden="true"
            className="whitespace-nowrap font-mono text-[12px] leading-none"
          >
            <span className="text-neutral-400 dark:text-neutral-500">
              {getPackageManagerPrefix(packageName)}
            </span>{" "}
            <span className="text-neutral-600 dark:text-neutral-300">
              shadcn@latest add
            </span>{" "}
            <span className="text-neutral-400 dark:text-neutral-500">
              {SITE.URL}/r/
            </span>
            <span className="font-semibold text-neutral-900 dark:text-white">
              {registryPath}
            </span>
          </p>
        </div>
        <button
          aria-disabled={status !== "idle"}
          aria-label="Copy to clipboard"
          className="shrink-0 rounded-lg p-1.5 transition-colors duration-150 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/60"
          onClick={handleCopy}
          tabIndex={0}
          type="button"
        >
          <IconState status={status}>
            <CopyIcon
              aria-hidden="true"
              className="size-3.5 text-neutral-400 dark:text-neutral-500"
            />
          </IconState>
        </button>
      </div>
    </div>
  );
}
