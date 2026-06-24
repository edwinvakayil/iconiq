"use client";

import { Code2 } from "lucide-react";
import * as React from "react";

import { CodePanelBody } from "@/components/docs/split/code-panel-body";
import { DocsCodePanel } from "@/components/docs/split/docs-code-panel";
import { useDocStore } from "@/hooks/use-doc-store";
import { useSmoothCodeHeight } from "@/hooks/use-smooth-code-height";
import { cn } from "@/lib/utils";

interface DynamicCodeBlockProps {
  originalCode: string;
  defaultHtml?: string;
  className?: string;
  variantCodes?: string[];
  variantTitles?: string[];
  hideDefaultTab?: boolean;
  hideVariantTabs?: boolean;
}

export function DynamicCodeBlock({
  originalCode,
  className,
  variantCodes = [],
  variantTitles = [],
  hideDefaultTab = false,
  hideVariantTabs = false,
}: DynamicCodeBlockProps) {
  const { activeVariantIndex, playgroundCode, setActiveVariantIndex } =
    useDocStore();

  const tabs = React.useMemo(() => {
    const items: { id: string; label: string }[] = [];
    if (!hideDefaultTab) {
      items.push({ id: "default", label: "Default" });
    }
    variantTitles.forEach((title, i) => {
      items.push({ id: String(i), label: title });
    });
    return items;
  }, [hideDefaultTab, variantTitles]);

  const activeTab = React.useMemo(() => {
    if (activeVariantIndex === -1) {
      return hideDefaultTab ? (tabs[0]?.id ?? "default") : "default";
    }
    return String(activeVariantIndex);
  }, [activeVariantIndex, hideDefaultTab, tabs]);

  const rawCodeToUse =
    playgroundCode ??
    (activeVariantIndex === -1
      ? originalCode
      : variantCodes[activeVariantIndex] || originalCode);

  const { contentRef, contentHeight, wrapperProps } = useSmoothCodeHeight(
    rawCodeToUse,
    activeVariantIndex
  );
  const hasUnboundedHeight = className?.includes("max-h-none");
  const resolvedWrapperStyle = hasUnboundedHeight
    ? wrapperProps.style
    : {
        ...wrapperProps.style,
        height:
          contentHeight !== undefined && contentHeight > 0
            ? Math.min(contentHeight, 500)
            : "auto",
      };

  React.useEffect(() => {
    if (
      hideDefaultTab &&
      activeVariantIndex === -1 &&
      variantTitles.length > 0
    ) {
      setActiveVariantIndex(0);
    }
  }, [
    hideDefaultTab,
    activeVariantIndex,
    variantTitles.length,
    setActiveVariantIndex,
  ]);

  const handleTabChange = (id: string) => {
    if (id === "default") {
      setActiveVariantIndex(-1);
      return;
    }
    setActiveVariantIndex(Number(id));
  };

  const showVariantTabs = !hideVariantTabs && tabs.length > 1;

  return (
    <DocsCodePanel
      activeTab={activeTab}
      className={className}
      copyCode={rawCodeToUse.trim()}
      icon={Code2}
      onTabChange={showVariantTabs ? handleTabChange : undefined}
      tabListAriaLabel="Example variant"
      tabs={showVariantTabs ? tabs : undefined}
    >
      <div
        {...wrapperProps}
        className={cn(
          wrapperProps.className,
          className?.includes("h-full") && "h-full"
        )}
        style={resolvedWrapperStyle}
      >
        <div
          className={cn(
            hasUnboundedHeight ? "h-full" : "max-h-[500px] overflow-auto"
          )}
          ref={contentRef}
        >
          <CodePanelBody code={rawCodeToUse.trim()} />
        </div>
      </div>
    </DocsCodePanel>
  );
}
