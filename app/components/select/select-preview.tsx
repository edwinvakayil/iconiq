"use client";

import type { SelectOption } from "@/registry/select";
import { AnimatedSelect } from "@/registry/select";

const OPTIONS: SelectOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
];

export function SelectPreview() {
  return (
    <div className="flex flex-col gap-6">
      <p className="font-sans text-neutral-600 text-sm dark:text-neutral-400">
        Click to open the dropdown and pick an option.
      </p>
      <div className="max-w-xs">
        <AnimatedSelect
          label="Framework"
          options={OPTIONS}
          placeholder="Choose a framework…"
        />
      </div>
    </div>
  );
}
