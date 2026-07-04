"use client";

import { FileText, Globe, Palette, Rocket } from "lucide-react";

import { setupChecklistApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import {
  SetupChecklist,
  type SetupChecklistItem,
} from "@/registry/setup-checklist";

const previewItems: SetupChecklistItem[] = [
  {
    id: "brand",
    title: "Add Your Brand Assets",
    description:
      "Upload your logo and color palette so every page stays on-brand.",
    icon: <Palette />,
  },
  {
    id: "content",
    title: "Create Your First Page",
    description:
      "Draft a landing page or post to start building your online presence.",
    icon: <FileText />,
  },
  {
    id: "domain",
    title: "Connect a Custom Domain",
    description:
      "Link your domain name so visitors can find you at your own URL.",
    icon: <Globe />,
  },
  {
    id: "launch",
    title: "Publish and Go Live",
    description:
      "Review your setup and make your workspace publicly available.",
    icon: <Rocket />,
  },
];

const usageCode = `"use client";

import { FileText, Globe, Palette, Rocket } from "lucide-react";
import {
  SetupChecklist,
  type SetupChecklistItem,
} from "@/components/ui/setup-checklist";

const items: SetupChecklistItem[] = [
  {
    id: "brand",
    title: "Add Your Brand Assets",
    description:
      "Upload your logo and color palette so every page stays on-brand.",
    icon: <Palette />,
  },
  {
    id: "content",
    title: "Create Your First Page",
    description:
      "Draft a landing page or post to start building your online presence.",
    icon: <FileText />,
  },
  {
    id: "domain",
    title: "Connect a Custom Domain",
    description:
      "Link your domain name so visitors can find you at your own URL.",
    icon: <Globe />,
  },
  {
    id: "launch",
    title: "Publish and Go Live",
    description:
      "Review your setup and make your workspace publicly available.",
    icon: <Rocket />,
  },
];

export function SetupChecklistPreview() {
  return (
    <SetupChecklist
      defaultCompletedIds={["brand"]}
      items={items}
      onCompletedChange={(completedIds) => console.log(completedIds)}
    />
  );
}`;

function SetupChecklistPreview() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-10">
      <SetupChecklist
        defaultCompletedIds={["brand"]}
        items={previewItems}
        onCompletedChange={(completedIds) => console.log(completedIds)}
      />
    </div>
  );
}

const details = setupChecklistApiDetails.map((item) => {
  if (item.id !== "registry") {
    return item;
  }

  return {
    ...item,
    notes: [
      ...(item.notes ?? []),
      <span key="credits">
        Credits: Design inspired by{" "}
        <a
          className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-foreground/80"
          href="https://x.com/AdityaSur11"
          rel="noreferrer"
          target="_blank"
        >
          Aditya
        </a>
        .
      </span>,
    ],
  };
});

export default function SetupChecklistPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Blocks" },
        { label: "Setup Checklist" },
      ]}
      componentName="setup-checklist"
      description="Animated onboarding checklist with task rows, completion badges, and a live progress pill."
      details={details}
      detailsDescription="SetupChecklist renders a card of toggleable task rows and an optional floating progress pill. Completion state can be uncontrolled through defaultCompletedIds or fully controlled through completedIds when the parent owns onboarding state."
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/blocks/setup-checklist/page.tsx`}
      itemSlug="setup-checklist"
      pageUrl="/blocks/setup-checklist"
      preview={<SetupChecklistPreview />}
      previewClassName="min-h-[34rem]"
      previewDescription="Rows stagger in with a soft rise, tapping a task pops in a drawn checkmark badge, and the progress pie and percentage settle on the same spring."
      title="Setup Checklist"
      usageCode={usageCode}
      usageDescription="Render `SetupChecklist` with an `items` array of tasks. Use `defaultCompletedIds` for uncontrolled completion or `completedIds` with `onCompletedChange` to own the state from your app."
    />
  );
}
