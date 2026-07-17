"use client";

/**
 * Debounced localStorage autosave. Subscribes outside React's render cycle so
 * fast edits never trigger extra renders.
 */

import { useEffect } from "react";

import { storeProject } from "@/lib/studio/persistence";
import { useStudioStore } from "@/lib/studio/store";

const AUTOSAVE_DELAY_MS = 800;

export function useAutosave() {
  const hydrated = useStudioStore((state) => state.hydrated);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    let timer: ReturnType<typeof setTimeout> | null = null;

    const unsubscribe = useStudioStore.subscribe((state, previous) => {
      if (state.project === previous.project) {
        return;
      }
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        const saved = storeProject(useStudioStore.getState().project);
        if (saved) {
          useStudioStore.getState().markSaved(Date.now());
        }
      }, AUTOSAVE_DELAY_MS);
    });

    return () => {
      unsubscribe();
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [hydrated]);
}
