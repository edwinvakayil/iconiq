"use client";

import { Check, Copy, Terminal } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PACKAGE_MANAGER } from "@/constants";
import { useLogDocsCopyEvent } from "@/lib/statsig-docs-copy";
import { cn } from "@/lib/utils";
import { usePackageNameContext } from "@/providers/package-name";

type PackageManager = (typeof PACKAGE_MANAGER)[keyof typeof PACKAGE_MANAGER];

const PACKAGE_MANAGER_ORDER: PackageManager[] = ["pnpm", "npm", "yarn", "bun"];

const PACKAGE_TAB_SPRING = {
  type: "spring" as const,
  stiffness: 520,
  damping: 34,
  mass: 0.72,
};

const PACKAGE_CONTENT_EASE = [0.22, 1, 0.36, 1] as const;

export function InstallCommandTerminal({
  className,
  commands,
  eventSlug,
}: {
  className?: string;
  commands: Record<PackageManager, string>;
  /** Registry component or page slug (e.g. `accordion`, `mcp-init`). */
  eventSlug: string;
}) {
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();
  const { packageName, setPackageName } = usePackageNameContext();
  const reduceMotion = useReducedMotion() ?? false;
  const logDocsCopyEvent = useLogDocsCopyEvent();
  const highlightLayoutId = `install-package-manager-${eventSlug}`;

  const handleCopyToClipboard = () => {
    startTransition(async () => {
      try {
        await navigator.clipboard.writeText(commands[packageName]);
        logDocsCopyEvent(eventSlug, "cli");
        setCopied(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setCopied(false);
      } catch {
        toast.error("Failed to copy to clipboard", {
          description: "Please check your browser permissions.",
        });
        setCopied(false);
      }
    });
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border border-border/80 bg-muted/30",
        className
      )}
    >
      <Tabs
        className="gap-0"
        defaultValue={packageName}
        id={`docs-install-cli-${eventSlug}`}
        onValueChange={(value) => setPackageName(value as PackageManager)}
        value={packageName}
      >
        <div className="relative flex items-center gap-2 border-border/80 border-b bg-background/50 px-4 py-2.5">
          <Terminal
            className="size-3.5 text-muted-foreground"
            strokeWidth={2}
          />
          <TabsList
            className="relative h-auto gap-1 border-0 bg-transparent p-0"
            translate="no"
          >
            {PACKAGE_MANAGER_ORDER.map((packageManager) => {
              const isActive = packageName === packageManager;

              return (
                <TabsTrigger
                  className={cn(
                    "relative z-10 h-auto overflow-visible rounded-sm bg-transparent px-2 py-1 font-mono text-xs normal-case tracking-normal shadow-none transition-colors duration-200",
                    "data-[active]:bg-transparent data-[active]:shadow-none dark:data-[active]:bg-transparent",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  key={packageManager}
                  value={packageManager}
                >
                  {isActive ? (
                    <motion.span
                      className="absolute inset-0 rounded-sm bg-muted dark:bg-neutral-800"
                      layoutId={highlightLayoutId}
                      transition={
                        reduceMotion ? { duration: 0.12 } : PACKAGE_TAB_SPRING
                      }
                    />
                  ) : null}
                  <span className="relative z-10">{packageManager}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
          <Button
            className="absolute right-2 size-7 cursor-pointer opacity-70 shadow-none hover:bg-transparent dark:hover:bg-transparent"
            onClick={handleCopyToClipboard}
            size="icon"
            variant="ghost"
          >
            <span className="sr-only">Copy</span>
            {copied ? (
              <Check className="size-3.5 text-emerald-600" strokeWidth={2} />
            ) : (
              <Copy className="size-3.5" strokeWidth={2} />
            )}
          </Button>
        </div>
        <div className="overflow-hidden bg-background dark:bg-[#0F0F0F]">
          <AnimatePresence initial={false} mode="wait">
            <motion.pre
              animate={{ opacity: 1, x: 0 }}
              className="not-prose m-0 overflow-x-auto px-4 py-3"
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 8 }}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
              key={packageName}
              transition={
                reduceMotion
                  ? { duration: 0.12 }
                  : { duration: 0.22, ease: PACKAGE_CONTENT_EASE }
              }
            >
              <code className="font-mono text-[#032F62] text-sm dark:text-[#9ECBFF]">
                {commands[packageName]}
              </code>
            </motion.pre>
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
}
