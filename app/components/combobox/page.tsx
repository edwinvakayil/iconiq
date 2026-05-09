"use client";

import { useState } from "react";

import { comboboxApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { Combobox, type ComboboxOption } from "@/registry/combobox";

const demoOptions: ComboboxOption[] = [
  {
    value: "scout",
    label: "Scout pass",
    description: "First scan before the sprint opens up",
  },
  {
    value: "transit",
    label: "Transit window",
    description: "Tighter route through the midfield line",
  },
  {
    value: "deep",
    label: "Deep field",
    description: "Longer view with less traffic around it",
  },
  {
    value: "late-run",
    label: "Late run",
    description: "Arrive second and attack the gap late",
  },
];

const usageCode = `import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { useState } from "react";

const options: ComboboxOption[] = [
  { value: "scout", label: "Scout pass", description: "First scan before the sprint opens up" },
  { value: "transit", label: "Transit window", description: "Tighter route through the midfield line" },
  { value: "deep", label: "Deep field", description: "Longer view with less traffic around it" },
];

export function RoutePicker() {
  const [value, setValue] = useState("transit");

  return (
    <Combobox
      className="w-full"
      emptyMessage="No route matches that query."
      onChange={setValue}
      options={options}
      placeholder="Pick a route..."
      value={value}
    />
  );
}`;

function ComboboxPreview() {
  const [value, setValue] = useState("transit");

  return (
    <div className="w-full max-w-xl">
      <Combobox
        className="w-full"
        emptyMessage="No route matches that query."
        onChange={setValue}
        options={demoOptions}
        placeholder="Pick a route..."
        value={value}
      />
    </div>
  );
}

export default function ComboboxPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Combobox" },
      ]}
      componentName="combobox"
      description="Searchable single-select input with inline filtering, arrow-key navigation, and an animated dropdown that stays visually attached to the field."
      details={comboboxApiDetails}
      preview={<ComboboxPreview />}
      previewDescription="Type to filter the list, move with the arrow keys, and press Enter to commit a selection."
      title="Combobox"
      usageCode={usageCode}
      usageDescription="Use the canonical `Combobox` export, then tune filtering, clearing, disabled state, and keyboard behavior from the API details below."
    />
  );
}
