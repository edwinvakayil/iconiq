"use client";

import { DynamicCodeBlock } from "@/components/docs/split/dynamic-code-block";

interface SplitUsageCodeProps {
  usageCode: string;
  variantCodes?: string[];
  variantTitles?: string[];
  hideDefaultTab?: boolean;
  hideVariantTabs?: boolean;
}

export function SplitUsageCode({
  usageCode,
  variantCodes = [],
  variantTitles = [],
  hideDefaultTab = false,
  hideVariantTabs = false,
}: SplitUsageCodeProps) {
  const trimmedUsageCode = usageCode.trim();

  if (!trimmedUsageCode) {
    return null;
  }

  return (
    <div className="usage-code-scrollbar-none">
      <DynamicCodeBlock
        hideDefaultTab={hideDefaultTab}
        hideVariantTabs={hideVariantTabs}
        originalCode={trimmedUsageCode}
        variantCodes={variantCodes}
        variantTitles={variantTitles}
      />
    </div>
  );
}
