"use client";

import { Bell, Grid2x2, List, Table2 } from "lucide-react";

import { buttonGroupApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { ButtonGroupItems, IconButton } from "@/registry/button-group";

const usageCode = `import { Bell, Grid2x2, List, Table2 } from "lucide-react";
import { ButtonGroupItems, IconButton } from "@/components/ui/button-group";

export function ButtonGroupPreview() {
  return (
    <div className="flex w-full max-w-2xl flex-wrap items-center justify-center gap-3 px-2">
      <ButtonGroupItems>
        <button type="button">
          <List className="size-4" />
          List
        </button>
        <button type="button">
          <Grid2x2 className="size-4" />
          Board
        </button>
        <button type="button">
          <Table2 className="size-4" />
          Table
        </button>
      </ButtonGroupItems>

      <IconButton aria-label="Notifications" type="button">
        <Bell className="size-4" />
      </IconButton>
    </div>
  );
}`;

function ButtonGroupPreview() {
  return (
    <div className="flex w-full max-w-2xl flex-wrap items-center justify-center gap-3 px-2">
      <div className="text-center">
        <ButtonGroupItems>
          <button type="button">
            <List className="size-4" />
            List
          </button>
          <button type="button">
            <Grid2x2 className="size-4" />
            Board
          </button>
          <button type="button">
            <Table2 className="size-4" />
            Table
          </button>
        </ButtonGroupItems>
      </div>

      <div className="text-center">
        <IconButton aria-label="Notifications" type="button">
          <Bell className="size-4" />
        </IconButton>
      </div>
    </div>
  );
}

export default function ButtonGroupPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Button Group" },
      ]}
      componentName="button-group"
      description="Segmented button rows and compact icon actions with a smoother shared motion treatment."
      details={buttonGroupApiDetails}
      preview={<ButtonGroupPreview />}
      previewDescription="Inspect the segmented row and the compact icon action you pointed at, with the updated hover motion and softer settling behavior."
      railNotes={[
        "ButtonGroupItems is best when you want a single bordered shell shared across several adjacent actions.",
        "IconButton uses the same surface language in a smaller square control for compact toolbar actions.",
      ]}
      title="Button Group"
      usageCode={usageCode}
      usageDescription="Use the segmented row for adjacent view switches, then pair it with icon-only actions when you need a smaller utility control."
    />
  );
}
