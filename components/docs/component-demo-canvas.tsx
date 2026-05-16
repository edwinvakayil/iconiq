"use client";

import { RefreshCw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { DocsCodeSnippet } from "@/components/docs/code-snippet";
import { OpenInV0Button } from "@/components/docs/open-in-v0-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getComponentV0Page } from "@/lib/component-v0-pages";
import { cn } from "@/lib/utils";

const demoTabs = [
  { label: "Preview", value: "preview" },
  { label: "Code", value: "code" },
] as const;

type DemoTabValue = (typeof demoTabs)[number]["value"];

export function ComponentDemoCanvas({
  componentName,
  preview,
  previewClassName,
  code,
  v0PageCode,
}: {
  componentName: string;
  preview: React.ReactNode;
  previewClassName?: string;
  code: string;
  v0PageCode?: string;
}) {
  const resolvedV0PageCode =
    v0PageCode || getComponentV0Page(componentName, code);

  const [previewKey, setPreviewKey] = useState(0);
  const [activeTab, setActiveTab] = useState<DemoTabValue>("preview");
  const [indicator, setIndicator] = useState({
    left: 0,
    ready: false,
    width: 0,
  });
  const tabRailRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const updateIndicator = useCallback(() => {
    const rail = tabRailRef.current;

    if (!rail) {
      return;
    }

    const activeTrigger = rail.querySelector<HTMLElement>(
      `[data-demo-tab="${activeTab}"]`
    );

    if (!activeTrigger) {
      setIndicator((current) =>
        current.ready ? { left: 0, ready: false, width: 0 } : current
      );
      return;
    }

    setIndicator((current) => {
      const next = {
        left: activeTrigger.offsetLeft,
        ready: true,
        width: activeTrigger.offsetWidth,
      };

      if (
        current.left === next.left &&
        current.ready === next.ready &&
        current.width === next.width
      ) {
        return current;
      }

      return next;
    });
  }, [activeTab]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  useEffect(() => {
    const rail = tabRailRef.current;

    window.addEventListener("resize", updateIndicator);

    if (!(rail && typeof ResizeObserver !== "undefined")) {
      return () => window.removeEventListener("resize", updateIndicator);
    }

    const observer = new ResizeObserver(() => updateIndicator());

    observer.observe(rail);

    for (const trigger of rail.querySelectorAll<HTMLElement>(
      "[data-demo-tab]"
    )) {
      observer.observe(trigger);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator]);

  return (
    <Tabs
      className="gap-0"
      onValueChange={(value) => setActiveTab(value as DemoTabValue)}
      value={activeTab}
    >
      <div className="not-prose mb-4 flex items-center justify-between gap-3">
        <div
          className="relative w-fit max-w-full border-border/50 border-b"
          ref={tabRailRef}
        >
          <TabsList className="relative isolate h-11 items-stretch gap-0 rounded-none border-0 bg-transparent p-0 shadow-none">
            {demoTabs.map((tab) => (
              <TabsTrigger
                className="relative z-10 h-full cursor-pointer overflow-visible rounded-none px-5 py-2 text-center font-medium text-[15px] text-muted-foreground normal-case tracking-[-0.02em] transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground data-[active]:bg-transparent data-[active]:text-foreground data-[active]:shadow-none dark:text-muted-foreground dark:data-[active]:bg-transparent dark:data-[active]:text-foreground dark:data-[active]:shadow-none"
                data-demo-tab={tab.value}
                key={tab.value}
                value={tab.value}
              >
                <span className="relative z-10">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <motion.div
            animate={{
              left: indicator.left,
              opacity: indicator.ready ? 1 : 0,
              width: indicator.width,
            }}
            aria-hidden
            className="pointer-events-none absolute bottom-0 h-[2px] bg-foreground dark:bg-white"
            initial={false}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 360,
                    damping: 34,
                    mass: 0.7,
                  }
            }
          />
        </div>

        <div className="flex items-center gap-1.5">
          <OpenInV0Button
            name={componentName}
            pageContent={resolvedV0PageCode || undefined}
          />
          <button
            aria-label="Refresh preview"
            className="inline-flex rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={() => setPreviewKey((current) => current + 1)}
            type="button"
          >
            <RefreshCw className="size-4" />
          </button>
        </div>
      </div>

      <TabsContent className="mt-0" value="preview">
        <div
          className={cn(
            "not-prose flex h-full min-h-64 w-full items-center justify-center overflow-hidden rounded-sm border border-border/80 p-6 md:min-h-80 md:p-10",
            "bg-background dark:bg-[#0F0F0F]",
            previewClassName
          )}
        >
          <div
            className="flex h-full w-full items-center justify-center"
            key={previewKey}
          >
            {preview}
          </div>
        </div>
      </TabsContent>

      <TabsContent className="mt-0 [&_pre]:my-0" value="code">
        <DocsCodeSnippet code={code} />
      </TabsContent>
    </Tabs>
  );
}
