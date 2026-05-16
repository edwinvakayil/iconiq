"use client";

import { useEffect, useState } from "react";

import { drawerApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { Drawer } from "@/registry/drawer";

const usageCode = `"use client";

import { useEffect, useState } from "react";
import { Drawer } from "@/components/ui/drawer";

export function DrawerPreview() {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const syncViewport = () => setIsMobile(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => {
      mediaQuery.removeEventListener("change", syncViewport);
    };
  }, []);

  return (
    <>
      <button
        className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4.5 py-2.5 text-sm font-medium text-white shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_4px_18px_rgba(0,0,0,0.16)] transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/30 focus-visible:ring-offset-2 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
        onClick={() => setOpen(true)}
        type="button"
      >
        Open drawer
      </button>

      <Drawer
        description="Review the latest changes before moving this update into sign-off."
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => setOpen(false)}
              type="button"
            >
              Keep editing
            </button>
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-neutral-900 px-4 text-[13px] font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/30 focus-visible:ring-offset-2 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
              type="button"
            >
              Move to sign-off
            </button>
          </div>
        }
        onClose={() => setOpen(false)}
        open={open}
        side={isMobile ? "bottom" : "right"}
        title="Workspace details"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-[15px] font-medium text-foreground">
              Current rollout
            </p>
            <p className="text-[14px] leading-6 text-secondary">
              Motion polish is ready, API notes are synced, and the release
              handoff can move forward once final copy is approved.
            </p>
          </div>

          <div className="space-y-3 border-t border-border/80 pt-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Next
            </p>
            <p className="text-[14px] leading-6 text-secondary">
              Close the drawer by pressing Escape, tapping the overlay, or using
              the built-in close button.
            </p>
          </div>
        </div>
      </Drawer>
    </>
  );
}`;

function DrawerPreview() {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const syncViewport = () => setIsMobile(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => {
      mediaQuery.removeEventListener("change", syncViewport);
    };
  }, []);

  return (
    <div className="flex min-h-[280px] w-full items-center justify-center px-4 py-10">
      <button
        className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-3 font-medium text-[13px] text-white shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_4px_18px_rgba(0,0,0,0.16)] transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/30 focus-visible:ring-offset-2 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
        onClick={() => setOpen(true)}
        type="button"
      >
        Open drawer
      </button>
      <Drawer
        description="Review the latest changes before moving this update into sign-off."
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-4 font-medium text-[13px] text-foreground transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => setOpen(false)}
              type="button"
            >
              Keep editing
            </button>
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-neutral-900 px-4 font-medium text-[13px] text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/30 focus-visible:ring-offset-2 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
              type="button"
            >
              Move to sign-off
            </button>
          </div>
        }
        onClose={() => setOpen(false)}
        open={open}
        side={isMobile ? "bottom" : "right"}
        title="Workspace details"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="font-medium text-[15px] text-foreground">
              Current rollout
            </p>
            <p className="text-[14px] text-secondary leading-6">
              Motion polish is ready, API notes are synced, and the release
              handoff can move forward once final copy is approved.
            </p>
          </div>
          <div className="space-y-3 border-border/80 border-t pt-4">
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
              Next
            </p>
            <p className="text-[14px] text-secondary leading-6">
              Close the drawer by pressing Escape, tapping the overlay, or using
              the built-in close button.
            </p>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default function DrawerPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Drawer" },
      ]}
      componentName="drawer"
      description="Controlled overlay drawer with faster motion, focus-trapped dialog behavior, safe-area-aware mobile ergonomics, and an optional sticky footer."
      details={drawerApiDetails}
      preview={<DrawerPreview />}
      previewDescription="Open the panel to test the controlled API, focus handling, faster open timing, and the optional sticky action footer."
      title="Drawer"
      usageCode={usageCode}
      usageDescription="Control visibility from local state, keep body content scrollable, and optionally pin footer actions into the shared shell."
    />
  );
}
