"use client";

import {
  Check,
  ChevronLeft,
  CodeXml,
  Copy,
  Maximize,
  Minimize,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  AnimatePresence,
  type DragControls,
  motion,
  type PanInfo,
} from "motion/react";
import type { ReactNode } from "react";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { CommandMenu } from "@/components/command-menu";
import { HighlightedCode } from "@/components/docs/code-snippet";
import { ThemeToggle } from "@/components/docs/split/theme-toggle";
import { cn } from "@/lib/utils";

import type { CommandMenuGroupDef } from "@/registry/command-palette";

export interface VariantItem {
  title: string;
  preview?: ReactNode;
  code?: string;
  fullWidth?: boolean;
}

function PreviewToolbarCell({
  children,
  active,
  className,
}: {
  children: ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-2xl bg-zinc-200/65 text-foreground/65 dark:bg-zinc-800/75",
        active &&
          "bg-foreground text-background dark:bg-zinc-100 dark:text-zinc-900",
        className
      )}
    >
      {children}
    </div>
  );
}

const previewToolbarIconClass =
  "flex size-full items-center justify-center rounded-2xl text-current transition-all ease-in-out active:scale-95";

export function DocsPreviewToolbar({
  hasSourceCode,
  isExpanded,
  onReload,
  onSourceToggle,
  onToggleExpanded,
  searchGroups,
  showSource,
}: {
  hasSourceCode: boolean;
  isExpanded: boolean;
  onReload: () => void;
  onSourceToggle: () => void;
  onToggleExpanded: () => void;
  searchGroups: CommandMenuGroupDef[];
  showSource: boolean;
}) {
  return (
    <section
      aria-label="Preview controls"
      className="fixed top-6 right-6 z-[99] flex select-none items-center gap-1 rounded-2xl border border-border/40 bg-white/70 p-1.5 shadow-card backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#121212]/75 dark:shadow-none"
    >
      <PreviewToolbarCell>
        <CommandMenu
          groups={searchGroups}
          placeholder="Search components, pages, actions…"
          trigger={
            <button
              aria-label="Search"
              className={previewToolbarIconClass}
              type="button"
            >
              <Search className="size-4" />
            </button>
          }
        />
      </PreviewToolbarCell>

      {hasSourceCode ? (
        <PreviewToolbarCell active={showSource}>
          <button
            aria-label={showSource ? "Close source code" : "View source"}
            aria-pressed={showSource}
            className={previewToolbarIconClass}
            onClick={onSourceToggle}
            type="button"
          >
            <CodeXml className="size-4" />
          </button>
        </PreviewToolbarCell>
      ) : null}

      <PreviewToolbarCell>
        <button
          aria-label="Reload preview"
          className={previewToolbarIconClass}
          onClick={onReload}
          type="button"
        >
          <RotateCcw className="size-4" />
        </button>
      </PreviewToolbarCell>

      <PreviewToolbarCell active={isExpanded}>
        <button
          aria-label={
            isExpanded ? "Collapse preview pane" : "Expand preview pane"
          }
          className={previewToolbarIconClass}
          onClick={onToggleExpanded}
          type="button"
        >
          {isExpanded ? (
            <Minimize className="size-4" />
          ) : (
            <Maximize className="size-4" />
          )}
        </button>
      </PreviewToolbarCell>

      <PreviewToolbarCell>
        <ThemeToggle
          className={cn(
            previewToolbarIconClass,
            "!size-full !rounded-2xl !border-0 !bg-transparent hover:!bg-transparent shadow-none"
          )}
        />
      </PreviewToolbarCell>
    </section>
  );
}

function PreviewVariantTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      aria-selected={active}
      className={cn(
        "relative shrink-0 rounded-lg px-2.5 py-1 font-medium text-[13px] outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
      onClick={onClick}
      role="tab"
      type="button"
    >
      {active ? (
        <motion.span
          className="absolute inset-0 rounded-lg bg-zinc-200/90 shadow-sm dark:bg-zinc-800/90"
          layoutId="preview-variant-pill"
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
        />
      ) : null}
      <span className="relative">{children}</span>
    </button>
  );
}

export function DocsPreviewVariantBar({
  hideDefaultVariant,
  onSelectVariant,
  resolvedActiveVariant,
  variants,
}: {
  hideDefaultVariant: boolean;
  onSelectVariant: (index: number) => void;
  resolvedActiveVariant: number;
  variants: VariantItem[];
}) {
  if (variants.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute right-0 bottom-0 z-10 p-3 sm:p-4">
      <div
        aria-label="Preview variants"
        className="pointer-events-auto flex max-w-[min(100vw-2rem,36rem)] items-center gap-0.5 overflow-x-auto rounded-2xl border border-border/40 bg-white/75 p-1 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl [-ms-overflow-style:none] [scrollbar-width:none] dark:border-white/[0.06] dark:bg-[#121212]/80 [&::-webkit-scrollbar]:hidden"
        role="tablist"
      >
        {hideDefaultVariant ? null : (
          <PreviewVariantTab
            active={resolvedActiveVariant === -1}
            onClick={() => onSelectVariant(-1)}
          >
            Default
          </PreviewVariantTab>
        )}

        {variants.map((variant, index) => (
          <PreviewVariantTab
            active={resolvedActiveVariant === index}
            key={variant.title}
            onClick={() => onSelectVariant(index)}
          >
            {variant.title}
          </PreviewVariantTab>
        ))}
      </div>
    </div>
  );
}

const SETTINGS_COLLAPSED_SIZE = 44;
const SETTINGS_EXPANDED_WIDTH = 352;
const SETTINGS_MORPH_SPRING = {
  type: "spring" as const,
  stiffness: 400,
  damping: 38,
  mass: 0.92,
};

function getSettingsPanelMaxHeight() {
  if (typeof window === "undefined") {
    return 448;
  }

  return Math.min(448, window.innerHeight * 0.56);
}

function getSettingsPanelWidth() {
  if (typeof window === "undefined") {
    return SETTINGS_EXPANDED_WIDTH;
  }

  return Math.min(SETTINGS_EXPANDED_WIDTH, window.innerWidth - 32);
}

export function DocsPreviewSettingsToggle({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div className="pointer-events-none absolute right-0 bottom-0 z-10 p-3 sm:p-4">
      <button
        aria-label={active ? "Close settings" : "Open settings"}
        aria-pressed={active}
        className={cn(
          "pointer-events-auto flex size-11 items-center justify-center rounded-full border border-border/40 bg-white/80 text-foreground/70 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all ease-in-out hover:text-foreground active:scale-95 dark:border-white/[0.06] dark:bg-[#121212]/80",
          active &&
            "bg-foreground text-background dark:bg-zinc-100 dark:text-zinc-900"
        )}
        onClick={onClick}
        type="button"
      >
        <SlidersHorizontal className="size-4" />
      </button>
    </div>
  );
}

export function DocsPreviewSettingsPanel({
  children,
  show,
  title,
}: {
  children: ReactNode;
  show: boolean;
  title: string;
}) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.aside
          animate={{ opacity: 1, y: 0 }}
          aria-label={`${title} settings`}
          className="pointer-events-auto absolute right-4 bottom-4 z-40 max-h-[min(28rem,56%)] w-[min(calc(100%-2rem),22rem)]"
          exit={{ opacity: 0, y: 20 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        >
          {children}
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

export function DocsPreviewSettingsMorph({
  children,
  onToggle,
  show,
  title,
}: {
  children: ReactNode;
  onToggle: () => void;
  show: boolean;
  title: string;
}) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [expandedHeight, setExpandedHeight] = React.useState(
    SETTINGS_COLLAPSED_SIZE
  );
  const [expandedWidth, setExpandedWidth] = React.useState(
    SETTINGS_EXPANDED_WIDTH
  );

  const measurePanel = React.useCallback(() => {
    setExpandedWidth(getSettingsPanelWidth());

    const node = contentRef.current;

    if (!node) {
      return;
    }

    setExpandedHeight(Math.min(node.scrollHeight, getSettingsPanelMaxHeight()));
  }, []);

  React.useLayoutEffect(() => {
    if (!show) {
      return;
    }

    const node = contentRef.current;

    if (!node) {
      return;
    }

    const previousVisibility = node.style.visibility;
    const previousPointerEvents = node.style.pointerEvents;
    node.style.visibility = "visible";
    node.style.pointerEvents = "none";

    measurePanel();

    node.style.visibility = previousVisibility;
    node.style.pointerEvents = previousPointerEvents;
  }, [measurePanel, show]);

  React.useEffect(() => {
    if (!show) {
      return;
    }

    measurePanel();
    window.addEventListener("resize", measurePanel);

    const node = contentRef.current;
    const resizeObserver =
      typeof ResizeObserver !== "undefined" && node
        ? new ResizeObserver(() => measurePanel())
        : null;

    if (resizeObserver && node) {
      resizeObserver.observe(node);
    }

    return () => {
      window.removeEventListener("resize", measurePanel);
      resizeObserver?.disconnect();
    };
  }, [measurePanel, show]);

  const targetHeight = show ? expandedHeight : SETTINGS_COLLAPSED_SIZE;

  return (
    <div className="pointer-events-none absolute right-4 bottom-4 z-40">
      <motion.div
        animate={{
          borderRadius: show ? 22 : SETTINGS_COLLAPSED_SIZE / 2,
          height: targetHeight,
          width: show ? expandedWidth : SETTINGS_COLLAPSED_SIZE,
        }}
        aria-label={show ? `${title} settings` : undefined}
        className="pointer-events-auto overflow-hidden border border-black/[0.06] bg-[#f5f5f5] shadow-[0_20px_48px_-28px_rgba(0,0,0,0.35)] will-change-[width,height,border-radius] dark:border-white/[0.08] dark:bg-[#0f0f0f] dark:shadow-none"
        role={show ? "dialog" : undefined}
        style={{ transformOrigin: "100% 100%" }}
        transition={SETTINGS_MORPH_SPRING}
      >
        <motion.button
          animate={{
            opacity: show ? 0 : 1,
            scale: show ? 0.86 : 1,
          }}
          aria-label="Open settings"
          className="absolute inset-0 z-10 flex items-center justify-center text-foreground/70"
          onClick={onToggle}
          style={{ pointerEvents: show ? "none" : "auto" }}
          tabIndex={show ? -1 : 0}
          transition={{ duration: 0.14, ease: [0.4, 0, 0.2, 1] }}
          type="button"
        >
          <SlidersHorizontal className="size-4" />
        </motion.button>

        <motion.div
          animate={{
            opacity: show ? 1 : 0,
          }}
          aria-hidden={!show}
          className="absolute inset-x-0 top-0 w-full overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={contentRef}
          style={{
            maxHeight: getSettingsPanelMaxHeight(),
            pointerEvents: show ? "auto" : "none",
            visibility: show ? "visible" : "hidden",
          }}
          transition={{
            delay: show ? 0.09 : 0,
            duration: 0.16,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

export function DocsPreviewPersonalizeDrawer({
  mounted,
  onClose,
  personalizeContent,
  showPersonalize,
}: {
  mounted: boolean;
  onClose: () => void;
  personalizeContent: ReactNode;
  showPersonalize: boolean;
}) {
  if (!mounted) {
    return null;
  }

  return ReactDOM.createPortal(
    <AnimatePresence>
      {showPersonalize ? (
        <motion.div
          animate={{ y: 0 }}
          className="pointer-events-none fixed bottom-0 left-0 z-50 flex h-[80vh] w-full flex-col rounded-t-lg border-border/20 border-t bg-transparent shadow-none outline-none lg:top-0 lg:bottom-0 lg:h-screen lg:max-h-screen lg:w-1/2 lg:rounded-none lg:border-none lg:pt-3 lg:pr-1.5 lg:pb-3 lg:pl-3"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.4 }}
          exit={{ y: "100%" }}
          initial={{ y: "100%" }}
          onDragEnd={(_: unknown, info: PanInfo) => {
            if (info.offset.y > 100 || info.velocity.y > 500) {
              onClose();
            }
          }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="pointer-events-auto relative h-full overflow-hidden rounded-2xl border border-border/20 bg-[#f3f4f6] shadow-2xl dark:bg-[#121212]">
            <div className="pointer-events-none absolute top-0 right-0 left-0 z-20">
              <div className="absolute inset-0 h-32 bg-gradient-to-b from-[#f3f4f6] to-transparent [mask-image:linear-gradient(to_bottom,black_20%,transparent)] dark:from-[#121212]" />
              <div className="pointer-events-auto relative z-10 flex flex-col">
                <div className="flex items-center justify-center pt-2 pb-1">
                  <div className="h-1 w-10 rounded-full bg-zinc-900/[0.08] transition-colors hover:bg-zinc-900/[0.15] dark:bg-white/[0.08] dark:hover:bg-white/[0.15]" />
                </div>
                <div className="flex items-center justify-between px-4 py-1">
                  <button
                    className="inline-flex items-center gap-1.5 text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-none dark:text-zinc-400 dark:hover:text-white"
                    onClick={onClose}
                    type="button"
                  >
                    <ChevronLeft className="size-4" />
                    <span className="font-mono text-xs tracking-wide">
                      Personalize
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="relative h-full min-h-0">
              <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-16 bg-gradient-to-t from-[#f3f4f6] to-transparent [mask-image:linear-gradient(to_top,black_30%,transparent)] dark:from-[#121212]" />
              <div className="h-full">{personalizeContent}</div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

function PreviewSourceCodeBody({
  isSourceLoading,
  sourceCode,
  sourceLoadError,
}: {
  isSourceLoading: boolean;
  sourceCode: string;
  sourceLoadError: string | null;
}) {
  if (isSourceLoading) {
    return (
      <div className="flex h-full items-center justify-center px-4 pt-24 pb-8">
        <span className="font-mono text-muted-foreground/60 text-sm tracking-wide">
          Loading source code...
        </span>
      </div>
    );
  }

  if (sourceLoadError) {
    return (
      <div className="px-4 pt-24 text-muted-foreground text-sm">
        {sourceLoadError}
      </div>
    );
  }

  if (!sourceCode) {
    return null;
  }

  return (
    <pre
      className="overflow-x-auto px-4 pt-24 pb-8 font-mono text-[13px] leading-relaxed"
      data-code-block
      data-line-numbers="false"
    >
      <HighlightedCode code={sourceCode} />
    </pre>
  );
}

export function DocsPreviewSourceDrawer({
  copied,
  dragControls,
  isSourceLoading,
  mounted,
  onClose,
  onCopy,
  showSource,
  sourceCode,
  sourceCodeFilename,
  sourceLoadError,
}: {
  copied: boolean;
  dragControls: DragControls;
  isSourceLoading: boolean;
  mounted: boolean;
  onClose: () => void;
  onCopy: () => void;
  showSource: boolean;
  sourceCode: string;
  sourceCodeFilename?: string;
  sourceLoadError: string | null;
}) {
  if (!mounted) {
    return null;
  }

  return ReactDOM.createPortal(
    <AnimatePresence>
      {showSource ? (
        <motion.div
          animate={{ y: 0 }}
          className="pointer-events-none fixed bottom-0 left-0 z-50 flex h-[80vh] w-full flex-col rounded-t-lg border-border/20 border-t bg-transparent shadow-none outline-none lg:top-0 lg:bottom-0 lg:h-screen lg:max-h-screen lg:w-1/2 lg:rounded-none lg:border-none lg:pt-3 lg:pr-1.5 lg:pb-3 lg:pl-3"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragControls={dragControls}
          dragElastic={{ top: 0, bottom: 0.4 }}
          dragListener={false}
          exit={{ y: "100%" }}
          initial={{ y: "100%" }}
          onDragEnd={(_: unknown, info: PanInfo) => {
            if (info.offset.y > 100 || info.velocity.y > 500) {
              onClose();
            }
          }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="pointer-events-auto relative h-full overflow-hidden rounded-2xl border border-border/20 bg-[#f3f4f6] shadow-2xl dark:bg-[#121212]">
            <div className="pointer-events-none absolute top-0 right-0 left-0 z-20">
              <div className="absolute inset-0 h-32 bg-gradient-to-b from-[#f3f4f6] to-transparent [mask-image:linear-gradient(to_bottom,black_20%,transparent)] dark:from-[#121212]" />
              <div className="pointer-events-auto relative z-10 flex flex-col">
                <div
                  className="flex touch-none items-center justify-center pt-2 pb-1"
                  onPointerDown={(event) => dragControls.start(event)}
                >
                  <div className="h-1 w-10 rounded-full bg-zinc-900/[0.08] transition-colors hover:bg-zinc-900/[0.15] dark:bg-white/[0.08] dark:hover:bg-white/[0.15]" />
                </div>
                <div className="flex items-center justify-between px-4 py-1">
                  <button
                    className="inline-flex items-center gap-1.5 text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-none dark:text-zinc-400 dark:hover:text-white"
                    onClick={onClose}
                    type="button"
                  >
                    <ChevronLeft className="size-4" />
                    <span className="font-mono text-xs tracking-wide">
                      Source Code
                    </span>
                  </button>
                  <div className="flex items-center gap-3">
                    {sourceCodeFilename ? (
                      <div className="flex items-center gap-1.5">
                        <svg
                          className="h-3.5 w-3.5 text-zinc-500"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span className="font-mono text-xs text-zinc-500">
                          {sourceCodeFilename}
                        </span>
                      </div>
                    ) : null}
                    {sourceCode ? (
                      <button
                        aria-label={copied ? "Copied" : "Copy code"}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:hover:text-white"
                        onClick={onCopy}
                        type="button"
                      >
                        {copied ? (
                          <Check className="size-3.5" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-full min-h-0">
              <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-16 bg-gradient-to-t from-[#f3f4f6] to-transparent [mask-image:linear-gradient(to_top,black_30%,transparent)] dark:from-[#121212]" />
              <div
                className="[&_pre]:!px-4 [&_pre]:!pt-24 h-full overflow-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&_.relative.group_>_button]:hidden [&_pre]:min-h-full"
                data-drawer-code
              >
                <div className="h-full w-full">
                  <PreviewSourceCodeBody
                    isSourceLoading={isSourceLoading}
                    sourceCode={sourceCode}
                    sourceLoadError={sourceLoadError}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
