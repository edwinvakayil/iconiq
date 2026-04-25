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
}: {
  componentName?: string;
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
    <div className="relative mt-0 w-full min-w-0 max-w-[642px] px-0">
      <Tabs
        className="w-full min-w-0"
        onValueChange={setPackageName}
        value={packageName}
      >
        <TabsList
          className="flex w-full min-w-0 flex-wrap items-center justify-start gap-x-2.5 gap-y-2 sm:inline-flex sm:flex-nowrap"
          onClick={(e) => e.stopPropagation()}
        >
          {Object.values(PACKAGE_MANAGER).map((pm) => (
            <TabsTrigger className="shrink-0" key={pm} value={pm}>
              {pm}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.values(PACKAGE_MANAGER).map((pm) => (
          <TabsContent
            className="mt-0 overflow-hidden focus-within:outline-offset-0 focus-visible:outline-1 focus-visible:outline-primary"
            key={pm}
            value={pm}
          >
            <BaseScrollArea.Root className="relative w-full overflow-hidden">
              <BaseScrollArea.Viewport
                className={cn(
                  "overflow-hidden border border-border/85 bg-muted/28 focus-visible:outline-1 focus-visible:outline-primary focus-visible:outline-offset-0",
                  "isolate whitespace-nowrap px-2.5 py-2.5 pr-12 font-mono text-[13px] tracking-[-0.39px] sm:px-4 sm:py-3 sm:pr-20 sm:text-sm",
                  "before:pointer-events-none before:absolute before:top-0 before:left-0 before:z-10 before:block before:h-full before:rounded-bl-[10px]",
                  "before:transition-[width] before:duration-50 before:ease-out before:content-['']",
                  "before:w-[min(40px,var(--scroll-area-overflow-x-start))] before:bg-[linear-gradient(to_right,var(--color-muted),transparent)] before:[--scroll-area-overflow-x-start:inherit]",
                  "after:pointer-events-none after:absolute after:top-0 after:right-0 after:z-10 after:block after:h-full after:rounded-r-[10px]",
                  "after:transition-[width] after:duration-50 after:ease-out after:content-['']",
                  "after:w-[calc(min(40px,var(--scroll-area-overflow-x-end,100px))+56px)] after:bg-[linear-gradient(to_left,var(--color-muted)_0%,var(--color-muted)_30%,transparent)] sm:after:w-[calc(min(40px,var(--scroll-area-overflow-x-end,100px))+100px)] after:[--scroll-area-overflow-x-end:inherit]"
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
              <BaseScrollArea.Scrollbar
                className="pointer-events-none absolute right-2! bottom-1! left-2! flex h-0.5 touch-none rounded bg-border opacity-0 transition-opacity duration-100 data-hovering:pointer-events-auto data-scrolling:pointer-events-auto data-hovering:opacity-100 data-scrolling:opacity-100 data-hovering:delay-0 data-scrolling:duration-0"
                keepMounted={false}
                orientation="horizontal"
              >
                <BaseScrollArea.Thumb className="relative w-full rounded bg-foreground/50" />
              </BaseScrollArea.Scrollbar>
              <button
                aria-disabled={state !== "idle"}
                aria-label="Copy to clipboard"
                className="absolute top-1/2 right-1 z-20 -translate-y-1/2 cursor-pointer border border-transparent p-1.5 transition-[background-color,border-color,color] duration-100 focus-within:outline-offset-1 hover:border-border hover:bg-background focus-visible:outline-1 focus-visible:outline-primary sm:right-1.5 sm:p-2"
                onClick={handleCopyToClipboard}
                tabIndex={0}
                type="button"
              >
                <ActionState status={state}>
                  <CopyIcon aria-hidden="true" className="size-4" />
                </ActionState>
              </button>
            </BaseScrollArea.Root>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
