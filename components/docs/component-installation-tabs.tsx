"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { CodeBlockInstall } from "@/components/code-block-install";
import { DocsCodeSnippet } from "@/components/docs/code-snippet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type RegistryResponse = {
  files?: Array<{
    content?: string;
  }>;
};

const installationTabs = [
  { label: "CLI", value: "cli" },
  { label: "Manual", value: "manual" },
] as const;

type InstallationTabValue = (typeof installationTabs)[number]["value"];

function RegistrySourceCode({ componentName }: { componentName: string }) {
  const [content, setContent] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch(`/r/${componentName}.json`);
        const data = (await response.json()) as RegistryResponse;
        const source = data.files?.[0]?.content ?? "";

        if (cancelled) {
          return;
        }

        setContent(source);
        setStatus(source ? "done" : "error");
      } catch {
        if (!cancelled) {
          setStatus("error");
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [componentName]);

  if (status === "loading") {
    return (
      <div className="rounded-2xl border border-border/80 px-4 py-6 text-muted-foreground text-sm">
        Loading registry source...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-2xl border border-border/80 px-4 py-6 text-muted-foreground text-sm">
        The registry source could not be loaded for this component.
      </div>
    );
  }

  return <DocsCodeSnippet code={content} />;
}

export function ComponentInstallationTabs({
  componentName,
}: {
  componentName: string;
}) {
  const [activeTab, setActiveTab] = useState<InstallationTabValue>("cli");
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
      `[data-install-tab="${activeTab}"]`
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
      "[data-install-tab]"
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
      onValueChange={(value) => setActiveTab(value as InstallationTabValue)}
      value={activeTab}
    >
      <div
        className="relative mb-3 w-fit max-w-full border-border/50 border-b"
        ref={tabRailRef}
      >
        <TabsList className="relative isolate h-11 items-stretch gap-0 rounded-none border-0 bg-transparent p-0 shadow-none">
          {installationTabs.map((tab) => (
            <TabsTrigger
              className="relative z-10 h-full cursor-pointer overflow-visible rounded-none px-5 py-2 text-center font-medium text-[15px] text-muted-foreground normal-case tracking-[-0.02em] transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground data-[active]:bg-transparent data-[active]:text-foreground data-[active]:shadow-none dark:text-muted-foreground dark:data-[active]:bg-transparent dark:data-[active]:text-foreground dark:data-[active]:shadow-none"
              data-install-tab={tab.value}
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

      <TabsContent className="mt-0" value="cli">
        <CodeBlockInstall componentName={componentName} />
      </TabsContent>

      <TabsContent className="mt-0" value="manual">
        <RegistrySourceCode componentName={componentName} />
      </TabsContent>
    </Tabs>
  );
}
