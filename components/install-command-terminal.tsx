"use client";

import { Check, Copy, Terminal } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PACKAGE_MANAGER } from "@/constants";
import { cn } from "@/lib/utils";
import { usePackageNameContext } from "@/providers/package-name";

type PackageManager = (typeof PACKAGE_MANAGER)[keyof typeof PACKAGE_MANAGER];

const PACKAGE_MANAGER_ORDER: PackageManager[] = ["pnpm", "npm", "yarn", "bun"];

export function InstallCommandTerminal({
  className,
  commands,
}: {
  className?: string;
  commands: Record<PackageManager, string>;
}) {
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();
  const { packageName, setPackageName } = usePackageNameContext();

  const handleCopyToClipboard = () => {
    startTransition(async () => {
      try {
        await navigator.clipboard.writeText(commands[packageName]);
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
        onValueChange={(value) => setPackageName(value as PackageManager)}
        value={packageName}
      >
        <div className="relative flex items-center gap-2 border-border/80 border-b bg-background/50 px-4 py-2.5">
          <Terminal
            className="size-3.5 text-muted-foreground"
            strokeWidth={2}
          />
          <TabsList
            className="h-auto gap-1 border-0 bg-transparent p-0"
            translate="no"
          >
            {PACKAGE_MANAGER_ORDER.map((packageManager) => (
              <TabsTrigger
                className="h-auto rounded-sm px-2 py-1 font-mono text-xs normal-case tracking-normal"
                key={packageManager}
                value={packageManager}
              >
                {packageManager}
              </TabsTrigger>
            ))}
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
        <div className="bg-background">
          {PACKAGE_MANAGER_ORDER.map((packageManager) => (
            <TabsContent
              className="m-0"
              key={packageManager}
              value={packageManager}
            >
              <pre className="not-prose overflow-x-auto px-4 py-3 dark:bg-[#0F0F0F]">
                <code className="font-mono text-[#032F62] text-sm dark:text-[#9ECBFF]">
                  {commands[packageManager]}
                </code>
              </pre>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
