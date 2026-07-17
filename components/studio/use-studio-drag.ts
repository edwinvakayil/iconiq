"use client";

/**
 * Pointer-driven drag controller.
 *
 * One shared implementation for both palette inserts and canvas moves. Drags
 * start after a small movement threshold so plain clicks still select. All
 * drop targeting is delegated to the layout-inference engine in lib/studio.
 */

import { useCallback, useEffect, useRef } from "react";

import { computeDropIndicator } from "@/lib/studio/dnd";
import { useStudioStore } from "@/lib/studio/store";
import type { DragSource } from "@/lib/studio/types";

const DRAG_THRESHOLD_PX = 5;

let lastDragEndedAt = 0;

/** True right after a drag gesture ends — lets click handlers ignore drops. */
export function didJustDrag(): boolean {
  return Date.now() - lastDragEndedAt < 200;
}

export function useStudioDrag() {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(
    () => () => {
      cleanupRef.current?.();
    },
    []
  );

  /**
   * Arm a drag from a pointerdown event. The drag begins once the pointer
   * moves past the threshold; releasing before that is treated as a click.
   */
  const beginDrag = useCallback(
    (event: React.PointerEvent, source: DragSource) => {
      if (event.button !== 0) {
        return;
      }
      const startX = event.clientX;
      const startY = event.clientY;
      let dragging = false;

      const store = useStudioStore;

      const handleMove = (move: PointerEvent) => {
        const pointer = { x: move.clientX, y: move.clientY };
        if (!dragging) {
          const distance = Math.hypot(pointer.x - startX, pointer.y - startY);
          if (distance < DRAG_THRESHOLD_PX) {
            return;
          }
          dragging = true;
          store.getState().startDrag(source, pointer);
        }
        const { project } = store.getState();
        const target = computeDropIndicator(project.root, source, pointer);
        store.getState().updateDrag(pointer, target);
      };

      const finish = (commit: boolean) => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        window.removeEventListener("keydown", handleKey);
        cleanupRef.current = null;
        if (dragging) {
          lastDragEndedAt = Date.now();
          store.getState().endDrag(commit);
        }
      };

      const handleUp = () => finish(true);

      const handleKey = (key: KeyboardEvent) => {
        if (key.key === "Escape") {
          finish(false);
        }
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("keydown", handleKey);
      cleanupRef.current = () => finish(false);
    },
    []
  );

  return { beginDrag };
}
