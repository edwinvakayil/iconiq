"use client";

/**
 * Top toolbar: history, zoom, device preview, canvas theme, edit/preview
 * mode, export and reset. Autosave state shows on the right.
 */

import {
  CheckIcon,
  CodeXmlIcon,
  EyeIcon,
  MaximizeIcon,
  MonitorIcon,
  MoonIcon,
  PencilRulerIcon,
  RedoIcon,
  RotateCcwIcon,
  SmartphoneIcon,
  SunIcon,
  TabletIcon,
  UndoIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useStudioStore } from "@/lib/studio/store";
import type { Device } from "@/lib/studio/types";
import { cn } from "@/lib/utils";

const iconButtonClass =
  "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors duration-100 hover:bg-accent/70 hover:text-foreground disabled:pointer-events-none disabled:opacity-35";

function ToolbarButton({
  label,
  onClick,
  disabled,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      className={cn(iconButtonClass, active && "bg-accent text-foreground")}
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-5 w-px shrink-0 bg-border" />;
}

const DEVICE_OPTIONS: Array<{
  value: Device;
  label: string;
  icon: typeof MonitorIcon;
}> = [
  { value: "desktop", label: "Desktop", icon: MonitorIcon },
  { value: "tablet", label: "Tablet", icon: TabletIcon },
  { value: "mobile", label: "Mobile", icon: SmartphoneIcon },
];

function SaveIndicator() {
  const dirty = useStudioStore((state) => state.dirty);
  const savedAt = useStudioStore((state) => state.savedAt);

  if (!(savedAt || dirty)) {
    return null;
  }
  return (
    <span
      className="flex select-none items-center gap-1 text-[11px] text-muted-foreground"
      title={dirty ? "Unsaved changes" : "All changes saved locally"}
    >
      {dirty ? (
        <span className="size-1.5 rounded-full bg-amber-500" />
      ) : (
        <CheckIcon className="size-3 text-emerald-500" />
      )}
      {dirty ? "Saving…" : "Saved"}
    </span>
  );
}

export function StudioToolbar({ onFit }: { onFit: () => void }) {
  const canUndo = useStudioStore((state) => state.past.length > 0);
  const canRedo = useStudioStore((state) => state.future.length > 0);
  const undo = useStudioStore((state) => state.undo);
  const redo = useStudioStore((state) => state.redo);
  const zoom = useStudioStore((state) => state.zoom);
  const stepZoom = useStudioStore((state) => state.stepZoom);
  const device = useStudioStore((state) => state.device);
  const setDevice = useStudioStore((state) => state.setDevice);
  const canvasTheme = useStudioStore((state) => state.canvasTheme);
  const setCanvasTheme = useStudioStore((state) => state.setCanvasTheme);
  const mode = useStudioStore((state) => state.mode);
  const setMode = useStudioStore((state) => state.setMode);
  const setExportOpen = useStudioStore((state) => state.setExportOpen);
  const resetProject = useStudioStore((state) => state.resetProject);
  const projectName = useStudioStore((state) => state.project.name);
  const setProjectName = useStudioStore((state) => state.setProjectName);
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <header className="flex h-12 shrink-0 items-center gap-1 border-border border-b bg-background px-3">
      <Link
        className="mr-1 flex select-none items-baseline gap-1.5 font-semibold text-[14px] text-foreground"
        href="/"
      >
        Iconiq
        <span className="font-normal text-muted-foreground text-xs">
          Studio
        </span>
      </Link>
      <input
        aria-label="Project name"
        className="w-36 rounded-md border border-transparent bg-transparent px-2 py-1 text-[12px] text-muted-foreground outline-none transition-colors hover:border-border focus:border-ring focus:text-foreground"
        onChange={(event) => setProjectName(event.target.value)}
        value={projectName}
      />

      <Divider />
      <ToolbarButton disabled={!canUndo} label="Undo (⌘Z)" onClick={undo}>
        <UndoIcon className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton disabled={!canRedo} label="Redo (⇧⌘Z)" onClick={redo}>
        <RedoIcon className="size-3.5" />
      </ToolbarButton>

      <Divider />
      <ToolbarButton label="Zoom out" onClick={() => stepZoom(-1)}>
        <ZoomOutIcon className="size-3.5" />
      </ToolbarButton>
      <span className="w-10 select-none text-center text-[11px] text-muted-foreground tabular-nums">
        {Math.round(zoom * 100)}%
      </span>
      <ToolbarButton label="Zoom in" onClick={() => stepZoom(1)}>
        <ZoomInIcon className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Fit to screen" onClick={onFit}>
        <MaximizeIcon className="size-3.5" />
      </ToolbarButton>

      <div className="flex-1" />

      <div className="flex rounded-lg border border-border p-0.5">
        {DEVICE_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <button
              aria-label={option.label}
              className={cn(
                "flex h-6 w-8 cursor-pointer items-center justify-center rounded-[6px] transition-colors duration-100",
                device === option.value
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              key={option.value}
              onClick={() => setDevice(option.value)}
              title={option.label}
              type="button"
            >
              <Icon className="size-3.5" />
            </button>
          );
        })}
      </div>
      <ToolbarButton
        label={
          canvasTheme === "light" ? "Preview dark theme" : "Preview light theme"
        }
        onClick={() =>
          setCanvasTheme(canvasTheme === "light" ? "dark" : "light")
        }
      >
        {canvasTheme === "light" ? (
          <MoonIcon className="size-3.5" />
        ) : (
          <SunIcon className="size-3.5" />
        )}
      </ToolbarButton>

      <Divider />
      <ToolbarButton
        active={mode === "preview"}
        label={mode === "preview" ? "Back to editing (Esc)" : "Preview"}
        onClick={() => setMode(mode === "preview" ? "edit" : "preview")}
      >
        {mode === "preview" ? (
          <PencilRulerIcon className="size-3.5" />
        ) : (
          <EyeIcon className="size-3.5" />
        )}
      </ToolbarButton>
      {confirmingReset ? (
        <button
          className="cursor-pointer rounded-md bg-red-500/10 px-2 py-1 font-medium text-[11px] text-red-600 transition-colors hover:bg-red-500/20"
          onBlur={() => setConfirmingReset(false)}
          onClick={() => {
            resetProject();
            setConfirmingReset(false);
          }}
          type="button"
        >
          Confirm reset
        </button>
      ) : (
        <ToolbarButton
          label="Reset canvas"
          onClick={() => setConfirmingReset(true)}
        >
          <RotateCcwIcon className="size-3.5" />
        </ToolbarButton>
      )}

      <Divider />
      <SaveIndicator />
      <button
        className="ml-1 flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 font-medium text-[12px] text-background transition-[filter] hover:brightness-90"
        onClick={() => setExportOpen(true)}
        type="button"
      >
        <CodeXmlIcon className="size-3.5" />
        Export
      </button>
    </header>
  );
}
