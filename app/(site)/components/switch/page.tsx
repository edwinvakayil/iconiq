"use client";

import { useState } from "react";

import { switchApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { Switch } from "@/registry/switch";

const usageCode = `"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export function MotionSwitch() {
  const [enabled, setEnabled] = useState(true);

  return (
    <Switch
      aria-label="Enable motion"
      checked={enabled}
      label="Enable motion"
      onCheckedChange={setEnabled}
    />
  );
}`;

function SwitchPreview() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex min-h-[280px] items-center justify-center px-4 py-10">
      <Switch
        aria-label="Enable motion"
        checked={enabled}
        label="Enable motion"
        onCheckedChange={setEnabled}
      />
    </div>
  );
}

export default function SwitchPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Switch" },
      ]}
      componentName="switch"
      description="Animated on or off switch with a spring-driven thumb, pressure-like press feedback, and an optional inline label for settings rows."
      details={switchApiDetails}
      preview={<SwitchPreview />}
      title="Switch"
      usageCode={usageCode}
      usageDescription="Use the controlled pattern below when the surrounding interface needs to react immediately to the switch state."
    />
  );
}
