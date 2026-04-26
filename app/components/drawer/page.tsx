"use client";

import { useEffect, useState } from "react";

import { drawerApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { Drawer } from "@/registry/drawer";

const usageCode = `import { useState } from "react";
import { Drawer } from "@/components/ui/drawer";

export function WorkspaceDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground"
        onClick={() => setOpen(true)}
        type="button"
      >
        Open drawer
      </button>

      <Drawer
        description="Review the latest changes before pushing the next release live."
        onClose={() => setOpen(false)}
        open={open}
        title="Workspace details"
      >
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            This drawer keeps surrounding context visible while you review a narrow task flow.
          </p>
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
    <div className="flex min-h-[280px] w-full flex-col items-center justify-center gap-6 px-4 py-10">
      <button
        className="inline-flex items-center justify-center border border-border/80 px-4 py-2.5 font-medium text-[14px] text-foreground transition-colors hover:bg-muted/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onClick={() => setOpen(true)}
        type="button"
      >
        Open drawer
      </button>
      <p className="max-w-sm text-center text-[13px] text-secondary leading-6">
        Open the drawer to inspect the overlay blur, side-based slide motion,
        and the staggered header and body reveal.
      </p>
      <Drawer
        description="Review the latest changes before moving this update into sign-off."
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
      description="Controlled overlay drawer with side-based slide motion, staggered content reveal, and a built-in close header."
      details={drawerApiDetails}
      preview={<DrawerPreview />}
      previewDescription="Open the panel to test the controlled API, side-based panel movement, and built-in overlay close behavior."
      title="Drawer"
      usageCode={usageCode}
      usageDescription="Control visibility from local state and pass your own title, description, and body content into the same shared shell."
    />
  );
}
