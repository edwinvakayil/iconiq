"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useThemeKeyboardShortcut } from "@/hooks/use-theme-keyboard-shortcut";
import { isSplitDocsPage } from "@/lib/is-component-doc-page";

export function SplitDocsRouteEffect() {
  const pathname = usePathname();
  const isSplit = isSplitDocsPage(pathname);

  useThemeKeyboardShortcut(isSplit);

  useEffect(() => {
    if (isSplit) {
      document.documentElement.dataset.routeSplitDocs = "";
    } else {
      delete document.documentElement.dataset.routeSplitDocs;
    }

    return () => {
      delete document.documentElement.dataset.routeSplitDocs;
    };
  }, [isSplit]);

  return null;
}
