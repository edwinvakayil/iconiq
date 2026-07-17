"use client";

/**
 * Center canvas: zoomable, pannable viewport around a device-width frame.
 * The frame renders the semantic tree; drag feedback (ghost + insertion
 * indicator) draws in a fixed overlay so it is unaffected by zoom.
 */

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

import { getComponentDef } from "@/lib/studio/registry";
import { useStudioStore } from "@/lib/studio/store";
import { DEVICE_WIDTHS, type DragState } from "@/lib/studio/types";
import { cn } from "@/lib/utils";

import { CanvasNode } from "./canvas-node";

const FIT_MARGIN = 48;

export function useFitToScreen(
  viewportRef: React.RefObject<HTMLDivElement | null>
) {
  const setZoom = useStudioStore((state) => state.setZoom);
  const setPan = useStudioStore((state) => state.setPan);

  return useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }
    const device = useStudioStore.getState().device;
    const frameWidth = DEVICE_WIDTHS[device];
    const available = viewport.clientWidth - FIT_MARGIN * 2;
    const zoom = Math.min(1.5, Math.max(0.25, available / frameWidth));
    setZoom(Math.round(zoom * 100) / 100);
    setPan({ x: 0, y: 0 });
  }, [viewportRef, setZoom, setPan]);
}

const CONTAINER_PRESET_LABELS = {
  grid: "Grid",
  "stack-h": "Horizontal stack",
  "stack-v": "Vertical stack",
} as const;

function dragLabel(source: NonNullable<DragState["source"]>): string {
  if (source.type === "node") {
    const count = source.nodeIds.length;
    return count > 1 ? `${count} items` : "Move";
  }
  const spec = source.spec;
  if (spec.kind === "component") {
    return getComponentDef(spec.type)?.label ?? spec.type;
  }
  if (spec.kind === "container") {
    return CONTAINER_PRESET_LABELS[spec.preset];
  }
  return spec.tag === "p" ? "Paragraph" : "Heading";
}

function DragOverlay() {
  const drag = useStudioStore((state) => state.drag);

  if (!drag) {
    return null;
  }

  const label = dragLabel(drag.source);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <AnimatePresence>
        {drag.target ? (
          <motion.div
            animate={{
              opacity: 1,
              x: drag.target.rect.x,
              y: drag.target.rect.y,
              width: drag.target.rect.width,
              height: drag.target.rect.height,
            }}
            className={cn(
              "absolute top-0 left-0 rounded-full bg-sky-500",
              drag.target.rect.height > 6 &&
                drag.target.rect.width > 6 &&
                "rounded-md bg-sky-500/10 shadow-[inset_0_0_0_2px_theme(colors.sky.500)]"
            )}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="indicator"
            transition={{ type: "spring", stiffness: 700, damping: 45 }}
          />
        ) : null}
      </AnimatePresence>
      <div
        className="absolute select-none rounded-md border border-border bg-background/95 px-2.5 py-1.5 font-medium text-foreground text-xs shadow-lg backdrop-blur"
        style={{
          transform: `translate(${drag.pointer.x + 14}px, ${drag.pointer.y + 14}px)`,
        }}
      >
        {label}
      </div>
    </div>
  );
}

export function StudioCanvas({
  viewportRef,
}: {
  viewportRef: React.RefObject<HTMLDivElement | null>;
}) {
  const root = useStudioStore((state) => state.project.root);
  const zoom = useStudioStore((state) => state.zoom);
  const pan = useStudioStore((state) => state.pan);
  const device = useStudioStore((state) => state.device);
  const canvasTheme = useStudioStore((state) => state.canvasTheme);
  const mode = useStudioStore((state) => state.mode);
  const spacePressed = useRef(false);
  const panSession = useRef<{
    startX: number;
    startY: number;
    panX: number;
    panY: number;
  } | null>(null);

  // Space bar toggles pan mode while held.
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.code === "Space" && !isTypingTarget(event.target)) {
        spacePressed.current = true;
      }
    };
    const up = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        spacePressed.current = false;
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Native listener: React registers wheel as passive, which would block
  // preventDefault for pinch-zoom gestures.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const store = useStudioStore.getState();
      if (event.ctrlKey || event.metaKey) {
        const next = Math.min(
          1.5,
          Math.max(0.25, store.zoom - event.deltaY * 0.002)
        );
        store.setZoom(Math.round(next * 100) / 100);
        return;
      }
      store.setPan({
        x: store.pan.x - (event.shiftKey ? event.deltaY : event.deltaX),
        y: store.pan.y - (event.shiftKey ? 0 : event.deltaY),
      });
    };
    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [viewportRef]);

  const handlePointerDown = (event: React.PointerEvent) => {
    const isPanGesture = event.button === 1 || spacePressed.current;
    if (isPanGesture) {
      event.preventDefault();
      const store = useStudioStore.getState();
      panSession.current = {
        startX: event.clientX,
        startY: event.clientY,
        panX: store.pan.x,
        panY: store.pan.y,
      };
      const move = (moveEvent: PointerEvent) => {
        const session = panSession.current;
        if (!session) {
          return;
        }
        useStudioStore.getState().setPan({
          x: session.panX + (moveEvent.clientX - session.startX),
          y: session.panY + (moveEvent.clientY - session.startY),
        });
      };
      const end = () => {
        panSession.current = null;
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", end);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", end);
      return;
    }
    // Click on empty canvas clears the selection.
    if (event.target === event.currentTarget) {
      useStudioStore.getState().clearSelection();
    }
  };

  return (
    <div
      className={cn(
        "relative h-full min-w-0 flex-1 overflow-hidden bg-neutral-100 dark:bg-neutral-900/60",
        "[background-image:radial-gradient(circle,rgba(120,120,130,0.22)_1px,transparent_1px)] [background-size:20px_20px]"
      )}
      onPointerDown={handlePointerDown}
      ref={viewportRef}
    >
      <div
        className="flex min-h-full justify-center py-10"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "50% 0%",
        }}
      >
        <div
          className={cn(
            canvasTheme === "dark" && "dark",
            "h-fit shrink-0 overflow-clip rounded-xl border border-border bg-background text-foreground shadow-2xl transition-[width] duration-300 ease-out",
            mode === "edit" && "select-none"
          )}
          data-studio-canvas
          style={{ width: DEVICE_WIDTHS[device] }}
        >
          <CanvasNode isRoot node={root} />
        </div>
      </div>
      <DragOverlay />
    </div>
  );
}

export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable
  );
}
