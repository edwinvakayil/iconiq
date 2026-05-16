"use client";

import { motion, type Variants } from "motion/react";
import { type ReactNode, useState } from "react";

import { checkboxGroupApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { cn } from "@/lib/utils";
import {
  CheckboxGroup,
  type CheckboxGroupOption,
} from "@/registry/checkbox-group";

const demoOptions: CheckboxGroupOption[] = [
  {
    group: "Pressing",
    label: "High press",
    value: "press",
    description: "Close the alley when they receive on the turn",
  },
  {
    group: "Pressing",
    label: "Hold the half-spaces",
    value: "halfspaces",
    description: "Narrow tens, full-backs hold the width",
  },
  {
    group: "Pressing",
    label: "Back-three rehearsal",
    value: "backthree",
    description: "Not on the teamsheet for Saturday",
    disabled: true,
    disabledReason: "Available after the squad list is published.",
  },
  {
    group: "Set pieces",
    label: "Near-post corner trap",
    value: "corner-trap",
    description: "Front zone clear, weak-side winger seals the rebound lane",
  },
  {
    group: "Set pieces",
    label: "Late-run overload",
    value: "late-run",
    description: "Delay the extra runner until the second movement starts",
  },
];

const usageCode = `"use client";

import { useState } from "react";
import {
  CheckboxGroup,
  type CheckboxGroupOption,
} from "@/components/ui/checkbox-group";

const options: CheckboxGroupOption[] = [
  {
    group: "Pressing",
    label: "High press",
    value: "press",
    description: "Close the alley when they receive on the turn",
  },
  {
    group: "Pressing",
    label: "Hold the half-spaces",
    value: "halfspaces",
    description: "Narrow tens, full-backs hold the width",
  },
  {
    group: "Pressing",
    label: "Back-three rehearsal",
    value: "backthree",
    description: "Not on the teamsheet for Saturday",
    disabled: true,
    disabledReason: "Available after the squad list is published.",
  },
  {
    group: "Set pieces",
    label: "Near-post corner trap",
    value: "corner-trap",
    description: "Front zone clear, weak-side winger seals the rebound lane",
  },
  {
    group: "Set pieces",
    label: "Late-run overload",
    value: "late-run",
    description: "Delay the extra runner until the second movement starts",
  },
];

export function CheckboxGroupPreview() {
  const [value, setValue] = useState<string[]>(["press"]);

  return (
    <CheckboxGroup
      className="max-w-md"
      maxVisible={4}
      onChange={setValue}
      options={options}
      showMoreLabel="Show remaining plans"
      value={value}
    />
  );
}`;

const componentDetailsItems = checkboxGroupApiDetails;

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

export default function CheckboxGroupPage() {
  const [selected, setSelected] = useState<string[]>(["press"]);
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Checkbox Group" },
      ]}
      componentName="checkbox-group"
      description="Multi-select rows with a bordered empty box when off and a lone animated tick when on. Motion keeps the state change tactile without overloading dense forms."
      details={componentDetailsItems}
      preview={
        <div className="flex min-h-[320px] items-center justify-center">
          <CheckboxGroup
            className="max-w-md"
            maxVisible={4}
            onChange={setSelected}
            options={demoOptions}
            showMoreLabel="Show remaining plans"
            value={selected}
          />
        </div>
      }
      title="Checkbox Group"
      usageCode={usageCode}
      usageDescription="Use the controlled example below as the default pattern, then open the API details for option shape, selection flow, and accessibility notes."
    />
  );
}
