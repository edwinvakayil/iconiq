"use client";

/**
 * Studio layout shell: toolbar on top, palette left, canvas center,
 * inspector right, export overlay on demand.
 */

import { useEffect, useRef } from "react";

import { useStudioStore } from "@/lib/studio/store";

import { StudioCanvas, useFitToScreen } from "./canvas";
import { StudioExportPanel } from "./export-panel";
import { StudioInspector } from "./inspector";
import { StudioPalette } from "./palette";
import { StudioToolbar } from "./toolbar";
import { useAutosave } from "./use-autosave";
import { useStudioShortcuts } from "./use-studio-shortcuts";

export function StudioShell() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const hydrate = useStudioStore((state) => state.hydrate);
  const mode = useStudioStore((state) => state.mode);
  const fitToScreen = useFitToScreen(viewportRef);

  useStudioShortcuts();
  useAutosave();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Full Tailwind vocabulary on canvas: the browser build of Tailwind
  // generates any utility it finds in the DOM at runtime, so custom classes
  // typed in the inspector render even when the compiled CSS lacks them.
  useEffect(() => {
    import("@tailwindcss/browser").catch(() => {
      // Offline or blocked: canvas falls back to the compiled subset.
    });
  }, []);

  // Start with the whole frame visible.
  useEffect(() => {
    const frame = requestAnimationFrame(fitToScreen);
    return () => cancelAnimationFrame(frame);
  }, [fitToScreen]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <StudioToolbar onFit={fitToScreen} />
      <div className="flex min-h-0 flex-1">
        {mode === "edit" ? <StudioPalette /> : null}
        <StudioCanvas viewportRef={viewportRef} />
        {mode === "edit" ? <StudioInspector /> : null}
      </div>
      <StudioExportPanel />
    </div>
  );
}
