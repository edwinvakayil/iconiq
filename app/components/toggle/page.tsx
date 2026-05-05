"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";

import { toggleApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { Toggle } from "@/registry/toggle";

const usageCode = `"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";

export function BookmarkToggle() {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <Toggle
      aria-label="Toggle bookmark"
      className="gap-2 rounded-lg px-4 shadow-sm"
      onPressedChange={setBookmarked}
      pressed={bookmarked}
      variant="outline"
    >
      <Bookmark
        className="size-5"
        fill={bookmarked ? "currentColor" : "none"}
      />
      Bookmark
    </Toggle>
  );
}`;

function TogglePreview() {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 px-2 py-4">
      <div className="flex items-center justify-center">
        <Toggle
          aria-label="Toggle bookmark"
          className="gap-2 rounded-lg px-4 shadow-sm"
          onPressedChange={setBookmarked}
          pressed={bookmarked}
          variant="outline"
        >
          <Bookmark
            className="size-5"
            fill={bookmarked ? "currentColor" : "none"}
          />
          Bookmark
        </Toggle>
      </div>

      <p className="max-w-xl text-center text-[13px] text-secondary leading-6">
        Toggle the bookmark to inspect the pressed-state motion, ripple burst,
        and the filled icon treatment on the active state.
      </p>
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
      previewDescription="Use the bookmark example to inspect the pressed-state motion, outline surface, and the filled icon change on activation."
      railNotes={[
        "Use controlled pressed state when the surrounding interface needs to react immediately to the toggle value.",
        "Outline works well for utility toggles like save, bookmark, or watch actions.",
      ]}
      title="Toggle"
      usageCode={usageCode}
      usageDescription="Start with a single controlled utility toggle like the snippet below, then expand into additional variants and sizes as needed."
    />
  );
}
