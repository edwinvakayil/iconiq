"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { useState } from "react";

import { dialogApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { usageToV0Page } from "@/lib/component-v0-pages";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/dialog";

const cancelButtonClassName =
  "h-8 min-h-8 [&>span:last-child]:min-h-8 [&>span:last-child]:px-2.5 [&>span:last-child]:text-[11px]";

const usageCode = `"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function DialogPreview() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-3 font-medium text-[13px] text-white shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_4px_18px_rgba(0,0,0,0.16)] transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/30 focus-visible:ring-offset-2 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          type="button"
        >
          Open dialog
        </button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md border-neutral-200 dark:border-neutral-800"
        open={open}
      >
        <DialogHeader>
          <DialogTitle className="text-balance text-neutral-950 dark:text-neutral-50">
            Confirm publish
          </DialogTitle>
          <DialogDescription className="text-pretty text-sky-800 dark:text-sky-300">
            This sends the draft live for everyone on the team. You can still
            roll back from history afterward.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            className="${cancelButtonClassName}"
            onClick={() => setOpen(false)}
            size="sm"
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`;

const componentDetailsItems = dialogApiDetails;

function _SectionLabel({
  children,
  accent,
}: {
  children: ReactNode;
  accent?: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      {accent ? (
        <span
          aria-hidden
          className="font-mono text-[10px] text-neutral-300 tabular-nums dark:text-neutral-600"
        >
          {accent}
        </span>
      ) : null}
      <p className="font-medium text-[10px] text-neutral-400 uppercase tracking-[0.18em] dark:text-neutral-500">
        {children}
      </p>
      <span className="h-px min-w-6 flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-700" />
    </div>
  );
}

const bentoShell =
  "flex flex-col rounded-lg border border-neutral-200/80 bg-white px-3 py-4 sm:px-5 sm:py-5 md:p-6 dark:border-neutral-800 dark:bg-neutral-950";

const _bentoContainer = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.06, staggerChildren: 0.07 },
  },
};

const _bentoItem = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 28 },
  },
};

const _bentoContainerStatic = {
  hidden: {},
  visible: { transition: { delayChildren: 0, staggerChildren: 0 } },
};

const _bentoItemStatic = {
  hidden: { opacity: 1, scale: 1, y: 0 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

function _BentoMotion({
  children,
  className,
  variants,
}: {
  children: ReactNode;
  className?: string;
  variants: Variants;
}) {
  return (
    <motion.div className={cn(bentoShell, className)} variants={variants}>
      {children}
    </motion.div>
  );
}

function DialogPreview() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-[280px] items-center justify-center px-4 py-10 text-center sm:min-h-[320px]">
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger asChild>
          <button
            className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-3 font-medium text-[13px] text-white shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_4px_18px_rgba(0,0,0,0.16)] transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/30 focus-visible:ring-offset-2 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            type="button"
          >
            Open dialog
          </button>
        </DialogTrigger>
        <DialogContent
          className="max-w-md border-neutral-200 dark:border-neutral-800"
          open={open}
        >
          <DialogHeader>
            <DialogTitle className="text-balance text-neutral-950 dark:text-neutral-50">
              Confirm publish
            </DialogTitle>
            <DialogDescription className="text-pretty text-sky-800 dark:text-sky-300">
              This sends the draft live for everyone on the team. You can still
              roll back from history afterward.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              className={cancelButtonClassName}
              onClick={() => setOpen(false)}
              size="sm"
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function DialogDocsPage() {
  return (
    <ComponentDocsPage
      actionDescription="Send the registry bundle to v0 when you want to branch into broader modal flows, confirmations, or multi-step overlays."
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Dialog" },
      ]}
      componentName="dialog"
      description="Modal surface with Motion transitions, Radix-backed accessibility, and composable header and footer slots."
      details={componentDetailsItems}
      preview={<DialogPreview />}
      title="Dialog"
      usageCode={usageCode}
      usageDescription="Control the dialog from local state, then customize labels, actions, and motion through the details below."
      v0PageCode={usageToV0Page(usageCode)}
    />
  );
}
