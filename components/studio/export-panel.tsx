"use client";

/**
 * Export overlay: generated React + Tailwind code, the Iconiq CLI install
 * command for the components in use, and project JSON import/export.
 */

import {
  CheckIcon,
  ClipboardIcon,
  DownloadIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { generateCode } from "@/lib/studio/codegen";
import { parseProject, serializeProject } from "@/lib/studio/persistence";
import { CODEGEN_REGISTRY } from "@/lib/studio/registry";
import { useStudioStore } from "@/lib/studio/store";
import { cn } from "@/lib/utils";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-accent/70 hover:text-foreground"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          toast.error("Couldn't access the clipboard");
        }
      }}
      type="button"
    >
      {copied ? (
        <CheckIcon className="size-3 text-emerald-500" />
      ) : (
        <ClipboardIcon className="size-3" />
      )}
      {copied ? "Copied" : label}
    </button>
  );
}

function downloadFile(name: string, contents: string, type: string) {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function StudioExportPanel() {
  const open = useStudioStore((state) => state.exportOpen);
  const setOpen = useStudioStore((state) => state.setExportOpen);
  const project = useStudioStore((state) => state.project);
  const importProject = useStudioStore((state) => state.importProject);
  const [tab, setTab] = useState<"code" | "json">("code");
  const fileRef = useRef<HTMLInputElement>(null);

  const output = useMemo(
    () => (open ? generateCode(project, CODEGEN_REGISTRY) : null),
    [open, project]
  );
  const json = useMemo(
    () => (open ? serializeProject(project) : ""),
    [open, project]
  );

  const handleImportFile = async (file: File) => {
    const text = await file.text();
    const parsed = parseProject(text);
    if (!parsed) {
      toast.error("That file isn't a valid Studio project");
      return;
    }
    importProject(parsed);
    toast.success("Project imported");
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && output ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-6 backdrop-blur-[2px]"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <motion.div
            animate={{ y: 0, scale: 1, opacity: 1 }}
            className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
            exit={{ y: 12, scale: 0.98, opacity: 0 }}
            initial={{ y: 12, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            <div className="flex items-center gap-2 border-border border-b px-4 py-3">
              <p className="font-medium text-[14px] text-foreground">Export</p>
              <div className="ml-2 flex rounded-md border border-border p-0.5">
                {(["code", "json"] as const).map((value) => (
                  <button
                    className={cn(
                      "cursor-pointer rounded-[5px] px-2.5 py-1 text-[11px] transition-colors",
                      tab === value
                        ? "bg-accent font-medium text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    key={value}
                    onClick={() => setTab(value)}
                    type="button"
                  >
                    {value === "code" ? "React code" : "Project JSON"}
                  </button>
                ))}
              </div>
              <div className="flex-1" />
              <button
                aria-label="Close"
                className="flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/70 hover:text-foreground"
                onClick={() => setOpen(false)}
                type="button"
              >
                <XIcon className="size-4" />
              </button>
            </div>

            {tab === "code" ? (
              <div className="flex min-h-0 flex-col">
                {output.installCommand ? (
                  <div className="flex items-center gap-2 border-border border-b bg-muted/40 px-4 py-2.5">
                    <code className="min-w-0 flex-1 truncate font-mono text-[12px] text-foreground">
                      {output.installCommand}
                    </code>
                    <CopyButton label="Copy" text={output.installCommand} />
                  </div>
                ) : null}
                <div className="relative min-h-0 flex-1 overflow-auto">
                  <div className="sticky top-2 z-10 float-right mr-3">
                    <CopyButton label="Copy code" text={output.code} />
                  </div>
                  <pre className="overflow-x-auto px-4 py-3 font-mono text-[12px] text-foreground leading-relaxed">
                    {output.code}
                  </pre>
                </div>
                <div className="flex items-center justify-between border-border border-t px-4 py-2.5">
                  <p className="text-[11px] text-muted-foreground">
                    {output.usedComponents.length > 0
                      ? `Uses ${output.usedComponents.join(", ")}`
                      : "No Iconiq components yet — layout only"}
                  </p>
                  <button
                    className="flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-accent/70 hover:text-foreground"
                    onClick={() =>
                      downloadFile(
                        "generated-section.tsx",
                        output.code,
                        "text/plain"
                      )
                    }
                    type="button"
                  >
                    <DownloadIcon className="size-3" /> Download .tsx
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex min-h-0 flex-col">
                <div className="relative min-h-0 flex-1 overflow-auto">
                  <pre className="overflow-x-auto px-4 py-3 font-mono text-[12px] text-foreground leading-relaxed">
                    {json}
                  </pre>
                </div>
                <div className="flex items-center gap-2 border-border border-t px-4 py-2.5">
                  <CopyButton label="Copy JSON" text={json} />
                  <button
                    className="flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-accent/70 hover:text-foreground"
                    onClick={() =>
                      downloadFile(
                        `${project.name.toLowerCase().replace(/\s+/g, "-") || "project"}.studio.json`,
                        json,
                        "application/json"
                      )
                    }
                    type="button"
                  >
                    <DownloadIcon className="size-3" /> Download
                  </button>
                  <div className="flex-1" />
                  <button
                    className="flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-accent/70 hover:text-foreground"
                    onClick={() => fileRef.current?.click()}
                    type="button"
                  >
                    <UploadIcon className="size-3" /> Import JSON
                  </button>
                  <input
                    accept="application/json,.json"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        handleImportFile(file);
                      }
                      event.target.value = "";
                    }}
                    ref={fileRef}
                    type="file"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
