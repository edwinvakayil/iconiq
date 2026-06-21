"use client";

import { useDragControls } from "motion/react";
import * as React from "react";

import {
  DocsPreviewPersonalizeDrawer,
  DocsPreviewSourceDrawer,
  DocsPreviewToolbar,
  DocsPreviewVariantBar,
} from "@/components/docs/split/docs-preview-parts";

export type { VariantItem } from "@/components/docs/split/docs-preview-parts";

import type { VariantItem } from "@/components/docs/split/docs-preview-parts";
import {
  createPreviewRect,
  type PreviewRect,
  usePreviewShellExpand,
} from "@/components/docs/split/use-preview-shell-expand";
import { useDocStore } from "@/hooks/use-doc-store";
import { fetchRegistrySource } from "@/lib/registry-source";
import { SEARCH_ITEMS } from "@/lib/search-index";
import { cn } from "@/lib/utils";

import type { CommandMenuGroupDef } from "@/registry/command-palette";

interface DocsPreviewWrapperProps {
  children: React.ReactNode;
  fullWidthPreview?: boolean;
  personalizeContent?: React.ReactNode;
  sourceCodeFilename?: string;
  sourceCodeKey?: string;
  variants?: VariantItem[];
  hideDefaultVariant?: boolean;
  previewClassName?: string;
}

const searchGroups = SEARCH_ITEMS.reduce<CommandMenuGroupDef[]>(
  (groups, item) => {
    const existingGroup = groups.find(
      (group) => group.heading === item.section
    );

    const searchItem = {
      label: item.label,
      href: item.href,
      keywords: [...item.keywords, item.href, item.section, item.summary],
      description: item.summary,
    };

    if (existingGroup) {
      existingGroup.items.push(searchItem);
      return groups;
    }

    groups.push({
      heading: item.section,
      items: [searchItem],
    });

    return groups;
  },
  []
);

export function DocsPreviewWrapper({
  children,
  fullWidthPreview,
  personalizeContent,
  sourceCodeFilename,
  sourceCodeKey,
  variants = [],
  hideDefaultVariant = false,
  previewClassName,
}: DocsPreviewWrapperProps) {
  const [key, setKey] = React.useState(0);
  const [showPersonalize, setShowPersonalize] = React.useState(false);
  const [showSource, setShowSource] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [sourceCode, setSourceCode] = React.useState("");
  const [isSourceLoading, setIsSourceLoading] = React.useState(false);
  const [sourceLoadError, setSourceLoadError] = React.useState<string | null>(
    null
  );
  const [activeVariant, setActiveVariant] = React.useState(
    hideDefaultVariant && variants.length > 0 ? 0 : -1
  );
  const sourceDragControls = useDragControls();

  const resolvedActiveVariant =
    hideDefaultVariant && activeVariant === -1 ? 0 : activeVariant;

  const { setActiveVariantIndex } = useDocStore();

  React.useEffect(() => {
    setActiveVariantIndex(resolvedActiveVariant);
  }, [resolvedActiveVariant, setActiveVariantIndex]);

  const previewRef = React.useRef<HTMLDivElement>(null);
  const splitPreviewRectRef = React.useRef<PreviewRect | null>(null);
  const hasSourceCode = Boolean(sourceCodeKey);

  const cacheSplitPreviewRect = React.useCallback(() => {
    const layout = previewRef.current?.closest("[data-docs-layout]");
    const previewShell = layout?.querySelector<HTMLElement>(
      "[data-docs-preview-shell]"
    );
    if (!previewShell || previewShell.style.position === "fixed") {
      return;
    }
    splitPreviewRectRef.current = createPreviewRect(
      previewShell.getBoundingClientRect()
    );
  }, []);

  const handleSourceToggle = React.useCallback(async () => {
    if (showSource) {
      setShowSource(false);
      return;
    }

    setShowPersonalize(false);
    if (isExpanded) {
      setIsExpanded(false);
    }
    setShowSource(true);

    if (!sourceCodeKey || isSourceLoading || sourceCode) {
      return;
    }

    try {
      setIsSourceLoading(true);
      setSourceLoadError(null);
      const code = await fetchRegistrySource(sourceCodeKey);

      if (!code) {
        throw new Error("Failed to load source code");
      }

      setSourceCode(code);
    } catch {
      setSourceLoadError("Unable to load source code right now.");
    } finally {
      setIsSourceLoading(false);
    }
  }, [isExpanded, isSourceLoading, showSource, sourceCode, sourceCodeKey]);

  const handleToggleExpanded = React.useCallback(() => {
    setIsExpanded((prev) => {
      const next = !prev;
      if (next) {
        setShowSource(false);
        setShowPersonalize(false);
      }
      return next;
    });
  }, []);

  const handleOpenPersonalize = React.useCallback(() => {
    if (isExpanded) {
      setIsExpanded(false);
    }
    setShowPersonalize(true);
    setShowSource(false);
  }, [isExpanded]);

  const handleCopySource = React.useCallback(async () => {
    await navigator.clipboard.writeText(sourceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [sourceCode]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    cacheSplitPreviewRect();
    if (!isExpanded) {
      return;
    }
    const onResize = () => cacheSplitPreviewRect();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [cacheSplitPreviewRect, isExpanded]);

  usePreviewShellExpand({
    cacheSplitPreviewRect,
    isExpanded,
    previewRef,
    splitPreviewRectRef,
  });

  const activePreview =
    resolvedActiveVariant === -1
      ? children
      : variants[resolvedActiveVariant]?.preview;

  const isFullWidth =
    fullWidthPreview ||
    (resolvedActiveVariant >= 0 &&
      Boolean(variants[resolvedActiveVariant]?.fullWidth));

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden bg-[#f3f4f6] dark:bg-[#080808]"
      )}
      ref={previewRef}
    >
      <DocsPreviewToolbar
        hasSourceCode={hasSourceCode}
        isExpanded={isExpanded}
        onOpenPersonalize={handleOpenPersonalize}
        onReload={() => setKey((current) => current + 1)}
        onSourceToggle={handleSourceToggle}
        onToggleExpanded={handleToggleExpanded}
        personalizeContent={personalizeContent}
        searchGroups={searchGroups}
        showPersonalize={showPersonalize}
        showSource={showSource}
      />

      <div
        className={cn(
          "flex h-full w-full overflow-auto bg-[#f3f4f6] [-ms-overflow-style:none] [scrollbar-width:none] dark:bg-[#080808] [&::-webkit-scrollbar]:hidden",
          !fullWidthPreview && "items-center justify-center"
        )}
      >
        <div
          className={cn(
            "w-full",
            isFullWidth ? "h-full" : "flex items-center justify-center p-10"
          )}
        >
          <div
            className={cn(
              "h-full w-full",
              !fullWidthPreview && "flex items-center justify-center",
              previewClassName
            )}
            key={key}
          >
            {activePreview}
          </div>
        </div>
      </div>

      <DocsPreviewVariantBar
        hideDefaultVariant={hideDefaultVariant}
        onSelectVariant={setActiveVariant}
        resolvedActiveVariant={resolvedActiveVariant}
        variants={variants}
      />

      {personalizeContent ? (
        <DocsPreviewPersonalizeDrawer
          mounted={mounted}
          onClose={() => setShowPersonalize(false)}
          personalizeContent={personalizeContent}
          showPersonalize={showPersonalize}
        />
      ) : null}

      <DocsPreviewSourceDrawer
        copied={copied}
        dragControls={sourceDragControls}
        isSourceLoading={isSourceLoading}
        mounted={mounted}
        onClose={() => setShowSource(false)}
        onCopy={handleCopySource}
        showSource={showSource}
        sourceCode={sourceCode}
        sourceCodeFilename={sourceCodeFilename}
        sourceLoadError={sourceLoadError}
      />
    </div>
  );
}
