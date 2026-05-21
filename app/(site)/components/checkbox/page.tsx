"use client";

import { useState } from "react";

import { checkboxApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { Checkbox } from "@/registry/checkbox";

const usageCode = `"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export function CheckboxPreview() {
  const [checked, setChecked] = useState(true);

  return (
    <div className="w-full max-w-sm">
      <Checkbox
        checked={checked}
        id="release-updates"
        label="Email me when the next release ships"
        onCheckedChange={setChecked}
      />
    </div>
  );
}`;

const componentDetailsItems = checkboxApiDetails;

export default function CheckboxPage() {
  const [checked, setChecked] = useState(true);

  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Checkbox" },
      ]}
      componentName="checkbox"
      description="Animated checkbox with a spring-pressed box, line-drawn checkmark, and optional inline label. Designed for lightweight preferences, consent rows, and compact task lists."
      details={componentDetailsItems}
      preview={
        <div className="w-full max-w-sm">
          <Checkbox
            checked={checked}
            id="release-updates-preview"
            label="Email me when the next release ships"
            onCheckedChange={setChecked}
          />
        </div>
      }
      title="Checkbox"
      usageCode={usageCode}
      usageDescription="Use the controlled pattern below when the parent needs the current state, or omit `checked` and start with `defaultChecked` when the checkbox can manage itself."
    />
  );
}
