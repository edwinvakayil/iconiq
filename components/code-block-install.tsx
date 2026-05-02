"use client";

import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import { CopyIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { ActionStatus } from "@/components/ui/action-state";
import { ActionState } from "@/components/ui/action-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PACKAGE_MANAGER } from "@/constants";
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
      <Tabs
        className="w-full min-w-0"
        onValueChange={setPackageName}
        value={packageName}
      >
        <TabsList
          className="mb-3 flex w-full min-w-0 flex-wrap items-center justify-start gap-x-2.5 gap-y-2 sm:inline-flex sm:flex-nowrap"
          onClick={(e) => e.stopPropagation()}
        >
          {Object.values(PACKAGE_MANAGER).map((pm) => (
            <TabsTrigger className="shrink-0" key={pm} value={pm}>
              {pm}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.values(PACKAGE_MANAGER).map((pm) => (
          <TabsContent className="mt-0" key={pm} value={pm}>
            <BaseScrollArea.Root className="w-full overflow-hidden rounded-lg border border-border/80 bg-background">
              <div className="flex min-w-0 items-stretch">
                <BaseScrollArea.Viewport
                  className={cn(
                    "min-w-0 flex-1 overflow-x-auto whitespace-nowrap px-4 py-3 font-mono text-[14px] tracking-[-0.04em] sm:px-5 sm:text-[15px]"
                  )}
                >
                  <span className="sr-only">
                    {getPackageManagerPrefix(pm)} shadcn@latest add @iconiq/
                    {componentName}
                  </span>
                  <span aria-hidden="true" className="text-muted-foreground">
                    {getPackageManagerPrefix(pm)}
                  </span>{" "}
                  <span aria-hidden="true" className="text-foreground">
                    shadcn@latest add @iconiq/
                  </span>
                  <span className="shrink-0 text-foreground">
                    {componentName}
                  </span>
                </BaseScrollArea.Viewport>
                <button
                  aria-disabled={state !== "idle"}
                  aria-label="Copy to clipboard"
                  className="inline-flex shrink-0 items-center justify-center border-border/80 border-l px-3.5 text-muted-foreground transition-colors duration-100 hover:bg-muted/25 hover:text-foreground focus-visible:outline-1 focus-visible:outline-primary sm:px-4"
                  onClick={handleCopyToClipboard}
                  tabIndex={0}
                  type="button"
                >
                  <ActionState status={state}>
                    <CopyIcon aria-hidden="true" className="size-4" />
                  </ActionState>
                </button>
              </div>
              <BaseScrollArea.Scrollbar
                className="pointer-events-none absolute right-2! bottom-1! left-2! flex h-0.5 touch-none rounded bg-border opacity-0 transition-opacity duration-100 data-hovering:pointer-events-auto data-scrolling:pointer-events-auto data-hovering:opacity-100 data-scrolling:opacity-100 data-hovering:delay-0 data-scrolling:duration-0"
                keepMounted={false}
                orientation="horizontal"
              >
                <BaseScrollArea.Thumb className="relative w-full rounded bg-foreground/50" />
              </BaseScrollArea.Scrollbar>
            </BaseScrollArea.Root>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
