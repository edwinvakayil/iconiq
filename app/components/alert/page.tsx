import { ComponentDocsLayout } from "@/components/docs/component-docs-layout";
import { AlertPreview } from "./alert-preview";

const ALERT_CODE = `"use client";

import { useState } from "react";
import { SystemAlert } from "@/components/ui/alert";

export function Example() {
  const [visible, setVisible] = useState(true);

  return (
    <SystemAlert
      id="one"
      variant="success"
      title="Success"
      description="Your changes have been saved."
      isVisible={visible}
      onClose={() => setVisible(false)}
      autoDismiss={5}
    />
  );
}`;

const ALERT_PROPS = [
  {
    name: "id",
    type: "string",
    desc: "Unique id for the alert (used by onClose).",
  },
  {
    name: "variant",
    type: "enum",
    desc: '"success" | "error" | "warning" | "info" — Visual style and icon.',
  },
  { name: "title", type: "string", desc: "Alert heading." },
  {
    name: "description",
    type: "string",
    desc: "Optional. Secondary text below the title.",
  },
  {
    name: "isVisible",
    type: "boolean",
    desc: "When false, the alert is removed (animated out).",
  },
  {
    name: "onClose",
    type: "function",
    desc: "(id: string) => void — Called when the user closes the alert or auto-dismiss ends.",
  },
  {
    name: "autoDismiss",
    type: "number",
    desc: "Optional. Seconds until the progress bar completes (default 5).",
  },
];

export default function AlertPage() {
  return (
    <ComponentDocsLayout
      codeSample={ALERT_CODE}
      componentName="alert"
      description="Dismissible system alerts with success, error, warning, and info variants. Built with Framer Motion for enter/exit animations and an optional auto-dismiss progress bar."
      previewChildren={<AlertPreview />}
      previewDescription='Dismiss alerts with the close button or wait for auto-dismiss. Use "Show again" to reset.'
      propsRows={ALERT_PROPS}
      propsTag="alert"
      title="Alert"
    />
  );
}
