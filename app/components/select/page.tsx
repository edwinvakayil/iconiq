import { ComponentDocsLayout } from "@/components/docs/component-docs-layout";
import { SelectPreview } from "./select-preview";

const SELECT_CODE = `"use client";

import { AnimatedSelect } from "@/components/ui/select";
import type { SelectOption } from "@/components/ui/select";

const options: SelectOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
];

export function Example() {
  return (
    <AnimatedSelect
      options={options}
      placeholder="Choose a framework…"
      label="Framework"
    />
  );
}`;

const SELECT_PROPS = [
  {
    name: "options",
    type: "SelectOption[]",
    desc: "Array of { value, label, icon? }.",
  },
  {
    name: "value",
    type: "string",
    desc: "Optional. Controlled selected value.",
  },
  {
    name: "onChange",
    type: "function",
    desc: "(value: string) => void (optional) — Called when selection changes.",
  },
  {
    name: "placeholder",
    type: "string",
    desc: 'Optional. Placeholder when nothing selected (default "Select an option…").',
  },
  { name: "label", type: "string", desc: "Optional. Label above the trigger." },
  {
    name: "className",
    type: "string",
    desc: "Optional. Extra class names for the wrapper.",
  },
];

export default function SelectPage() {
  return (
    <ComponentDocsLayout
      codeSample={SELECT_CODE}
      componentName="select"
      description="An animated dropdown select with spring open/close, staggered option entrance, and optional label. Built with Framer Motion. No Radix dependency."
      previewChildren={<SelectPreview />}
      previewDescription="Click to open the dropdown and pick an option."
      propsRows={SELECT_PROPS}
      propsTag="select"
      title="Select"
    />
  );
}
