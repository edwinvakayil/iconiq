"use client";

import { MoreHorizontalIcon } from "lucide-react";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { buttonGroupApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { Button, ButtonGroup, IconButton } from "@/registry/button-group";

const previewWrapClassName =
  "mx-auto flex max-w-full flex-wrap justify-center gap-2";
const previewStackClassName =
  "mx-auto flex max-w-full flex-col items-center gap-3";
const buttonClassName =
  "border-border bg-background px-3 hover:bg-muted hover:text-foreground";
const iconButtonClassName =
  "border-border bg-background p-0 text-muted-foreground hover:bg-muted hover:text-foreground [&_svg]:size-3.5";

const usageCode = `"use client";

import { MoreHorizontalIcon } from "lucide-react";

import {
  Button,
  ButtonGroup,
  IconButton,
} from "@/components/ui/button-group";

const previewWrapClassName =
  "mx-auto flex max-w-full flex-wrap justify-center gap-2";
const previewStackClassName =
  "mx-auto flex max-w-full flex-col items-center gap-3";
const buttonClassName =
  "border-border bg-background px-3 hover:bg-muted hover:text-foreground";
const iconButtonClassName =
  "border-border bg-background p-0 text-muted-foreground hover:bg-muted hover:text-foreground [&_svg]:size-3.5";

export function ButtonGroupDemo() {
  return (
    <div className={previewStackClassName}>
      <p className="text-center text-muted-foreground text-sm">
        Review the latest project changes before sharing them with your team.
      </p>
      <div className={previewWrapClassName}>
        <ButtonGroup>
          <Button className={buttonClassName} size="sm">
            Edit
          </Button>
          <Button className={buttonClassName} size="sm">
            Preview
          </Button>
          <Button className={buttonClassName} size="sm">
            Publish
          </Button>
          <IconButton
            aria-label="More project actions"
            className={iconButtonClassName}
            size="sm"
          >
            <MoreHorizontalIcon />
          </IconButton>
        </ButtonGroup>
      </div>
    </div>
  );
}`;

function ButtonGroupPreview() {
  return (
    <div className={previewStackClassName}>
      <p className="text-center text-muted-foreground text-sm">
        Review the latest project changes before sharing them with your team.
      </p>
      <div className={previewWrapClassName}>
        <ButtonGroup>
          <Button className={buttonClassName} size="sm">
            Edit
          </Button>
          <Button className={buttonClassName} size="sm">
            Preview
          </Button>
          <Button className={buttonClassName} size="sm">
            Publish
          </Button>
          <IconButton
            aria-label="More project actions"
            className={iconButtonClassName}
            size="sm"
          >
            <MoreHorizontalIcon />
          </IconButton>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default function RadixBaseButtonGroupPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Buttons & Actions" },
        { label: "Button Group" },
      ]}
      componentName="button-group"
      description="Grouped controls for adjacent actions and toolbar layouts."
      details={buttonGroupApiDetails}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/buttons-and-actions/button-group/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/buttons-and-actions/button-group"
      preview={<ButtonGroupPreview />}
      previewClassName="min-h-[8rem] overflow-visible"
      previewDescription="A minimal connected button group rendered directly, without a card or toolbar shell."
      railNotes={[
        "Use the group itself as the visual surface when documenting button rendering.",
        "Keep labels short so the connected control remains compact across viewport sizes.",
      ]}
      title="Button Group"
      usageCode={usageCode}
      usageDescription="Compose ButtonGroup with registry buttons and a compact icon action for a minimal connected action set."
    />
  );
}
