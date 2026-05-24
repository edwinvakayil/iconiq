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
import { cn } from "@/lib/utils";

type RegistryResponse = {
  files?: RegistryFile[];
};

type RegistryFile = {
  content?: string;
  path?: string;
  target?: string;
  type?: string;
};

const installationTabs = [
  { label: "CLI", value: "cli" },
  { label: "Manual", value: "manual" },
] as const;

type InstallationTabValue = (typeof installationTabs)[number]["value"];

type FileTabTriggerProps = {
  file: RegistryFile;
  index: number;
  activeFileId: string;
  reduceMotion: boolean;
  getFileId: (file: RegistryFile, index: number) => string;
  fileLabel: (file: RegistryFile, index: number) => string;
  onSelect: (id: string) => void;
};

function FileTabTrigger({
  file,
  index,
  activeFileId,
  reduceMotion,
  getFileId,
  fileLabel,
  onSelect,
}: FileTabTriggerProps) {
  const id = getFileId(file, index);
  const isActive = activeFileId === id;
  const springTransition = reduceMotion
    ? { duration: 0 }
    : {
        type: "spring" as const,
        stiffness: 380,
        damping: 30,
        mass: 0.7,
      };
  const labelAnimation = reduceMotion
    ? undefined
    : {
        opacity: isActive ? 1 : 0.74,
        y: isActive ? -0.5 : 0,
      };
  const labelTransition = reduceMotion
    ? { duration: 0 }
    : {
        duration: 0.18,
        ease: [0.22, 1, 0.36, 1] as const,
      };

  return (
    <motion.button
      className={cn(
        "relative shrink-0 cursor-pointer px-3 py-2 font-mono text-xs transition-colors",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
      data-file-tab={id}
      onClick={() => onSelect(id)}
      transition={springTransition}
      type="button"
      whileTap={reduceMotion ? undefined : { y: 1 }}
    >
      <motion.span
        animate={labelAnimation}
        className="relative z-10"
        transition={labelTransition}
      >
        {fileLabel(file, index)}
      </motion.span>
    </motion.button>
  );
}

function RegistrySourceCode({ componentName }: { componentName: string }) {
  const [activeFileId, setActiveFileId] = useState<string>("");
  const [fileIndicator, setFileIndicator] = useState({
    left: 0,
    ready: false,
    width: 0,
  });
  const [files, setFiles] = useState<RegistryFile[]>([]);
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const fileRailRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const getFileId = useCallback(
    (file: RegistryFile, index: number) =>
      file.target ?? file.path ?? `${componentName}-${index}`,
    [componentName]
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch(`/r/${componentName}.json`, {
          cache: "no-store",
        });
        const data = (await response.json()) as RegistryResponse;
        const sourceFiles = (data.files ?? []).filter((file) => file.content);
        const defaultFile =
          sourceFiles.find((file) => file.type === "registry:ui") ??
          sourceFiles[0];

        if (cancelled) {
          return;
        }

        setFiles(sourceFiles);
        setActiveFileId(
          defaultFile
            ? getFileId(defaultFile, sourceFiles.indexOf(defaultFile))
            : ""
        );
        setStatus(sourceFiles.length > 0 ? "done" : "error");
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
  }, [componentName, getFileId]);

  const updateFileIndicator = useCallback(() => {
    const rail = fileRailRef.current;

    if (!(rail && activeFileId)) {
      return;
    }

    const activeTrigger = rail.querySelector<HTMLElement>(
      `[data-file-tab="${activeFileId}"]`
    );

    if (!activeTrigger) {
      setFileIndicator((current) =>
        current.ready ? { left: 0, ready: false, width: 0 } : current
      );
      return;
    }

    setFileIndicator((current) => {
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
  }, [activeFileId]);

  useLayoutEffect(() => {
    updateFileIndicator();
  }, [updateFileIndicator]);

  useEffect(() => {
    const rail = fileRailRef.current;

    window.addEventListener("resize", updateFileIndicator);

    if (!(rail && typeof ResizeObserver !== "undefined")) {
      return () => window.removeEventListener("resize", updateFileIndicator);
    }

    const observer = new ResizeObserver(() => updateFileIndicator());

    observer.observe(rail);

    for (const trigger of rail.querySelectorAll<HTMLElement>(
      "[data-file-tab]"
    )) {
      observer.observe(trigger);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateFileIndicator);
    };
  }, [updateFileIndicator]);

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

  const activeFile =
    files.find((file, index) => getFileId(file, index) === activeFileId) ??
    files[0];
  const fileLabel = (file: RegistryFile, index: number) =>
    file.target ?? file.path ?? `${componentName}-${index + 1}`;

  return (
    <div className="space-y-4">
      {files.length > 1 ? (
        <div className="space-y-2">
          <p className="font-medium text-[13px] text-muted-foreground">
            Browse installed files
          </p>
          <div
            className="relative max-w-full overflow-x-auto border-border/60 border-b"
            ref={fileRailRef}
          >
            <div className="flex min-w-max items-center gap-1">
              {files.map((file, index) => (
                <FileTabTrigger
                  activeFileId={activeFileId}
                  file={file}
                  fileLabel={fileLabel}
                  getFileId={getFileId}
                  index={index}
                  key={getFileId(file, index)}
                  onSelect={setActiveFileId}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>
            <motion.div
              animate={{
                left: fileIndicator.left,
                opacity: fileIndicator.ready ? 1 : 0,
                width: fileIndicator.width,
              }}
              aria-hidden
              className="pointer-events-none absolute bottom-0 h-px bg-foreground"
              initial={false}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      type: "spring",
                      stiffness: 420,
                      damping: 34,
                      mass: 0.75,
                    }
              }
            />
          </div>
        </div>
      ) : null}

      <DocsCodeSnippet code={activeFile?.content ?? ""} />
    </div>
  );
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
  const reduceMotion = useReducedMotion() ?? false;
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
        {activeTab === "manual" ? (
          <RegistrySourceCode componentName={componentName} />
        ) : null}
      </TabsContent>
    </Tabs>
  );
}
