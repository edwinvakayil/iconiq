"use client";

import { useState } from "react";
import { SystemAlert } from "@/registry/alert";

const ALERTS = [
  {
    id: "success",
    variant: "success" as const,
    title: "Success",
    description:
      "Your changes have been saved. You can continue editing or close this alert.",
  },
  {
    id: "error",
    variant: "error" as const,
    title: "Error",
    description: "Something went wrong. Please try again or contact support.",
  },
  {
    id: "warning",
    variant: "warning" as const,
    title: "Warning",
    description: "This action cannot be undone. Make sure you want to proceed.",
  },
  {
    id: "info",
    variant: "info" as const,
    title: "Info",
    description:
      "New features are available. Check the release notes for details.",
  },
];

export function AlertPreview() {
  const [visible, setVisible] = useState<Record<string, boolean>>({
    success: true,
    error: true,
    warning: true,
    info: true,
  });

  const handleClose = (id: string) => {
    setVisible((prev) => ({ ...prev, [id]: false }));
  };

  const showAgain = () => {
    setVisible({ success: true, error: true, warning: true, info: true });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        {ALERTS.map((alert) => (
          <SystemAlert
            autoDismiss={6}
            description={alert.description}
            id={alert.id}
            isVisible={visible[alert.id]}
            key={alert.id}
            onClose={handleClose}
            title={alert.title}
            variant={alert.variant}
          />
        ))}
      </div>
      <button
        className="rounded-md px-3 py-1.5 font-medium text-neutral-700 text-sm transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
        onClick={showAgain}
        type="button"
      >
        Show again
      </button>
    </div>
  );
}
