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
