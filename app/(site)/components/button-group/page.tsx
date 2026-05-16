"use client";

import { Grid2x2, List, MoreHorizontal, Table2 } from "lucide-react";

import { buttonGroupApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { usageToV0Page } from "@/lib/component-v0-pages";
import { ButtonGroupItems, IconButton } from "@/registry/button-group";

const usageCode = `import { Grid2x2, List, MoreHorizontal, Table2 } from "lucide-react";
import { ButtonGroupItems, IconButton } from "@/components/ui/button-group";

export function ButtonGroupPreview() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-2">
      <div className="space-y-3">
        <div className="space-y-1 text-left">
          <p className="font-medium text-foreground text-sm">
            Divided compact row
          </p>
          <p className="text-muted-foreground text-sm">
            Use this when each adjacent action still benefits from a visible
            split.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ButtonGroupItems size="sm">
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

          <IconButton aria-label="More options" size="sm" type="button">
            <MoreHorizontal className="size-4" />
          </IconButton>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1 text-left">
          <p className="font-medium text-foreground text-sm">
            Quiet toolbar row
          </p>
          <p className="text-muted-foreground text-sm">
            Use this when you want a softer grouped control with less visual
            chrome and a smoother traveling hover state.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ButtonGroupItems disableRipple showDividers={false} size="sm">
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

          <IconButton
            aria-label="More options"
            disableRipple
            showBorder={false}
            size="sm"
            type="button"
          >
            <MoreHorizontal className="size-4" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}`;

function ButtonGroupPreview() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-2">
      <div className="space-y-3">
        <div className="space-y-1 text-left">
          <p className="font-medium text-foreground text-sm">
            Divided compact row
          </p>
          <p className="text-muted-foreground text-sm">
            Use this when each adjacent action still benefits from a visible
            split.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ButtonGroupItems size="sm">
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

          <IconButton aria-label="More options" size="sm" type="button">
            <MoreHorizontal className="size-4" />
          </IconButton>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1 text-left">
          <p className="font-medium text-foreground text-sm">
            Quiet toolbar row
          </p>
          <p className="text-muted-foreground text-sm">
            Use this when you want a softer grouped control with less visual
            chrome and a smoother traveling hover state.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ButtonGroupItems disableRipple showDividers={false} size="sm">
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

          <IconButton
            aria-label="More options"
            disableRipple
            showBorder={false}
            size="sm"
            type="button"
          >
            <MoreHorizontal className="size-4" />
          </IconButton>
        </div>
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
      description="Compact button rows for adjacent actions, with size controls, optional dividers, and quieter toolbar variants."
      details={buttonGroupApiDetails}
      preview={<ButtonGroupPreview />}
      previewDescription="Compare a more defined divided row against a quieter toolbar-style variant with a smoother traveling hover treatment."
      railNotes={[
        "Use the default divided row when adjacent actions should still read as separate choices.",
        "Use the quiet variant when you want the group to feel closer to a compact desktop toolbar with a fluid hover sweep.",
      ]}
      title="Button Group"
      usageCode={usageCode}
      usageDescription="Start with the divided row for clearer boundaries, then remove dividers and ripple when you want a softer toolbar treatment with fluid hover motion."
      v0PageCode={usageToV0Page(usageCode)}
    />
  );
}
