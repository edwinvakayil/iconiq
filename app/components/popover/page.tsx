"use client";

import { Bell, BellRing } from "lucide-react";
import { useState } from "react";

import { popoverApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/popover";

const usageCode = `import { Bell, BellRing } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function UpdatesPopover() {
  const [open, setOpen] = useState(false);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <button
          className="inline-flex size-10 items-center justify-center text-foreground transition-colors hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:hover:text-neutral-300"
          type="button"
        >
          <Bell className="size-4.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" open={open}>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex size-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
              <BellRing className="size-4" />
            </span>
            <div className="space-y-1">
              <p className="font-medium">Release reminder</p>
              <p className="text-sm text-muted-foreground">
                Design review starts in 20 minutes. Final pass on motion and copy is still open.
              </p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}`;

function PopoverPreview() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-[280px] w-full flex-col items-center justify-center gap-5 px-4 py-10">
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <button
            aria-label="Open popover"
            className="inline-flex size-12 items-center justify-center text-foreground transition-colors hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:hover:text-neutral-300"
            type="button"
          >
            <Bell className="size-4.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px]" open={open}>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex size-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
                <BellRing className="size-4" />
              </span>
              <div className="space-y-1">
                <p className="font-medium text-[15px] text-foreground">
                  Release reminder
                </p>
                <p className="text-[13px] text-secondary leading-5">
                  Design review · 20 min
                </p>
              </div>
            </div>
            <p className="text-[14px] text-secondary leading-6">
              Final pass on motion, copy, and interaction polish is still open
              before the build moves to sign-off.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <p className="max-w-sm text-center text-[13px] text-secondary leading-6">
        Open the popover to inspect the controlled open state, portal-based
        panel, and origin-aware spring animation.
      </p>
    </div>
  );
}

export default function PopoverPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Popover" },
      ]}
      componentName="popover"
      description="Controlled popover built on Radix with portal-based positioning and a spring-driven content panel."
      details={popoverApiDetails}
      preview={<PopoverPreview />}
      previewDescription="Open the surface to test the controlled root state, anchor positioning, and the animated content wrapper."
      title="Popover"
      usageCode={usageCode}
      usageDescription="Control open state from React and pass the same open boolean into PopoverContent so AnimatePresence can run entry and exit motion."
    />
  );
}
