"use client";

import { Star } from "lucide-react";
import { useState } from "react";

import { toggleApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { Toggle } from "@/registry/toggle";

const usageCode = `"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";

export function TogglePreview() {
  const [favorite, setFavorite] = useState(false);

  return (
    <div className="flex items-center justify-center px-2 py-4">
      <Toggle
        aria-label="Toggle favorite"
        className="gap-2 rounded-lg px-4 shadow-sm"
        onPressedChange={setFavorite}
        pressed={favorite}
        variant="outline"
      >
        <Star className="size-5" fill={favorite ? "currentColor" : "none"} />
        Favorite
      </Toggle>
    </div>
  );
}`;

function TogglePreview() {
  const [favorite, setFavorite] = useState(false);

  return (
    <div className="flex items-center justify-center px-2 py-4">
      <Toggle
        aria-label="Toggle favorite"
        className="gap-2 rounded-lg px-4 shadow-sm"
        onPressedChange={setFavorite}
        pressed={favorite}
        variant="outline"
      >
        <Star className="size-5" fill={favorite ? "currentColor" : "none"} />
        Favorite
      </Toggle>
    </div>
  );
}

export default function TogglePage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Toggle" },
      ]}
      componentName="toggle"
      description="Pressed-state toggle built on Radix with ripple feedback, icon motion, and both text and icon-only control patterns."
      details={toggleApiDetails}
      preview={<TogglePreview />}
      railNotes={[
        "Use controlled pressed state when the surrounding interface needs to react immediately to the toggle value.",
        "Outline works well for utility toggles like favorite, save, or follow actions.",
      ]}
      title="Toggle"
      usageCode={usageCode}
      usageDescription="Start with a single controlled utility toggle like the snippet below, then expand into additional variants and sizes as needed."
    />
  );
}
