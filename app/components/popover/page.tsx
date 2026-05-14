"use client";

import { Bell, BellRing } from "lucide-react";
import { useState } from "react";

import { popoverApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/popover";

const usageCode = `"use client";

import { Bell, BellRing } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function PopoverPreview() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-5">
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
        <PopoverContent className="w-[320px]">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex size-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
                <BellRing className="size-4" />
              </span>
              <div className="space-y-1">
                <p className="text-[15px] font-medium text-foreground">
                  Release reminder
                </p>
                <p className="text-[13px] leading-5 text-secondary">
                  Design review · 20 min
                </p>
              </div>
            </div>
            <p className="text-[14px] leading-6 text-secondary">
              Final pass on motion, copy, and interaction polish is still open
              before the build moves to sign-off.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <p className="max-w-sm text-center text-[13px] leading-6 text-secondary">
        Open the popover to inspect the controlled root state, side-aware
        motion, and size-aware content panel.
      </p>
    </div>
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
        <PopoverContent className="w-[320px]">
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
        Open the popover to inspect the controlled root state, side-aware
        motion, and size-aware content panel.
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
      description="Popover built on Radix with portal-based positioning, side-aware motion, and smooth size changes while content updates."
      details={popoverApiDetails}
      preview={<PopoverPreview />}
      previewDescription="Open the surface to test the controlled root state, anchor positioning, and the size-aware animated content wrapper."
      title="Popover"
      usageCode={usageCode}
      usageDescription="Control open state from React when you need it, but let PopoverContent follow the root automatically unless you have a reason to override presence yourself."
    />
  );
}
