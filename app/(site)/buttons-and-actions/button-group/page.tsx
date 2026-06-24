"use client";

import { ButtonGroupPlaygroundProvider } from "@/app/(site)/buttons-and-actions/button-group/_components/button-group-playground";
import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { buttonGroupApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";

const usageCode = `"use client";

import { MoreHorizontalIcon } from "lucide-react";

import {
  Button,
  ButtonGroup,
  IconButton,
} from "@/components/ui/button-group";

export function ButtonGroupDemo() {
  return (
    <ButtonGroup aria-label="Project actions" size="sm">
      <Button>Edit</Button>
      <Button>Preview</Button>
      <Button>Publish</Button>
      <IconButton aria-label="More project actions">
        <MoreHorizontalIcon />
      </IconButton>
    </ButtonGroup>
  );
}`;

export default function RadixBaseButtonGroupPage() {
  return (
    <ButtonGroupPlaygroundProvider>
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Buttons & Actions" },
            { label: "Button Group" },
          ]}
          componentName="button-group"
          description="Grouped controls for adjacent actions, segmented selection, labels, separators, and toolbar layouts."
          details={buttonGroupApiDetails}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/buttons-and-actions/button-group/page.tsx`}
          headerActions={<SharedPrimitiveProviderSwitch />}
          pageUrl="/buttons-and-actions/button-group"
          preview={preview}
          previewClassName="min-h-[8rem] overflow-visible"
          previewDescription="Use the floating sliders control in the bottom-right corner to open settings and tune patterns, size, and interaction options."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Button Group"
          railNotes={[
            "Use the floating sliders button in the bottom-right of the preview to open settings.",
            "Pattern, size, and option changes update the preview and Usage code together.",
            "ButtonGroup size cascades to Button, IconButton, and ButtonGroupText children.",
          ]}
          title="Button Group"
          usageCode={usageCode}
          usageDescription="Compose ButtonGroup with registry buttons for a connected action set. Size, focus, and borders are handled by the group wrapper."
        />
      )}
    </ButtonGroupPlaygroundProvider>
  );
}
