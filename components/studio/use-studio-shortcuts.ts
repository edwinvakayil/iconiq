"use client";

/**
 * Global keyboard shortcuts. Skipped while typing in form fields so the
 * inspector stays usable.
 */

import { useEffect } from "react";

import type { StudioStore } from "@/lib/studio/store";
import { useStudioStore } from "@/lib/studio/store";

import { isTypingTarget } from "./canvas";

const ARROW_KEYS = ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"];

/** ⌘Z / ⇧⌘Z / ⌘Y — returns true when the event was handled. */
function handleHistoryShortcut(
  event: KeyboardEvent,
  store: StudioStore
): boolean {
  const key = event.key.toLowerCase();
  if (key === "z") {
    if (event.shiftKey) {
      store.redo();
    } else {
      store.undo();
    }
    return true;
  }
  if (key === "y") {
    store.redo();
    return true;
  }
  return false;
}

/**
 * ⌘D / ⌘C / ⌘V / ⌘G / ⌘E — returns true when the browser default should be
 * suppressed. Copy/paste return false so native text copy keeps working
 * (e.g. selecting code in the export panel).
 */
function handleEditShortcut(event: KeyboardEvent, store: StudioStore): boolean {
  switch (event.key.toLowerCase()) {
    case "d":
      store.duplicate(store.selection);
      return true;
    case "c":
      store.copySelection();
      return false;
    case "v":
      store.paste();
      return false;
    case "g":
      store.wrapSelection();
      return true;
    case "e":
      store.setExportOpen(!store.exportOpen);
      return true;
    default:
      return false;
  }
}

function handleEscape(store: StudioStore) {
  if (store.exportOpen) {
    store.setExportOpen(false);
  } else if (store.mode === "preview") {
    store.setMode("edit");
  } else {
    store.clearSelection();
  }
}

/** Delete / Escape / arrow reorder — returns true when handled. */
function handlePlainShortcut(
  event: KeyboardEvent,
  store: StudioStore
): boolean {
  if (event.key === "Delete" || event.key === "Backspace") {
    if (store.selection.length > 0) {
      event.preventDefault();
      store.remove(store.selection);
    }
    return true;
  }

  if (event.key === "Escape") {
    handleEscape(store);
    return true;
  }

  if (store.selection.length === 1 && ARROW_KEYS.includes(event.key)) {
    event.preventDefault();
    const delta = event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1;
    store.shiftSelected(delta);
    return true;
  }

  return false;
}

export function useStudioShortcuts() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const store = useStudioStore.getState();

      if (isTypingTarget(event.target)) {
        return;
      }

      if (event.metaKey || event.ctrlKey) {
        if (handleHistoryShortcut(event, store)) {
          event.preventDefault();
          return;
        }
        if (handleEditShortcut(event, store)) {
          event.preventDefault();
        }
        return;
      }

      handlePlainShortcut(event, store);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
