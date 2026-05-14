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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SITE } from "@/constants";
import { cn } from "@/lib/utils";

const demoTabs = [
  { label: "Preview", value: "preview" },
  { label: "Code", value: "code" },
] as const;

type DemoTabValue = (typeof demoTabs)[number]["value"];

function V0Icon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="currentColor"
      viewBox="0 0 40 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z" />
      <path d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z" />
    </svg>
  );
}

export function ComponentDemoCanvas({
  componentName,
  preview,
  previewClassName,
  code,
}: {
  componentName: string;
  preview: React.ReactNode;
  previewClassName?: string;
  code: string;
}) {
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
          <a
            className="dark:hover:!text-neutral-950 dark:focus-visible:!text-neutral-950 inline-flex h-8 items-center gap-1 rounded-md bg-neutral-950 px-3 text-white text-xs transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
            href={`https://v0.dev/chat/api/open?url=${SITE.URL}/r/${componentName}.json`}
            rel="noreferrer"
            target="_blank"
          >
            <span>Open in</span>
            <V0Icon className="h-3.5 w-auto" />
          </a>
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
