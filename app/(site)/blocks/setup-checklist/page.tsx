"use client";

import { FileText, Globe, Palette, Rocket } from "lucide-react";

import { setupChecklistApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import {
  SetupChecklist,
  SetupChecklistCard,
  SetupChecklistDescription,
  SetupChecklistHeader,
  SetupChecklistItem,
  SetupChecklistList,
  SetupChecklistProgress,
  SetupChecklistTitle,
} from "@/registry/setup-checklist";

const usageCode = `"use client";

import { FileText, Globe, Palette, Rocket } from "lucide-react";
import {
  SetupChecklist,
  SetupChecklistCard,
  SetupChecklistDescription,
  SetupChecklistHeader,
  SetupChecklistItem,
  SetupChecklistList,
  SetupChecklistProgress,
  SetupChecklistTitle,
} from "@/components/ui/setup-checklist";

export function SetupChecklistPreview() {
  return (
    <SetupChecklist
      defaultCompletedIds={["brand"]}
      onCompletedChange={(completedIds) => console.log(completedIds)}
    >
      <SetupChecklistCard>
        <SetupChecklistHeader>
          <SetupChecklistTitle>Onboarding Checklist</SetupChecklistTitle>
          <SetupChecklistDescription>
            Finish the remaining tasks to fully activate your workspace.
          </SetupChecklistDescription>
        </SetupChecklistHeader>
        <SetupChecklistList>
          <SetupChecklistItem
            description="Upload your logo and color palette so every page stays on-brand."
            icon={<Palette />}
            id="brand"
            title="Add Your Brand Assets"
          />
          <SetupChecklistItem
            description="Draft a landing page or post to start building your online presence."
            icon={<FileText />}
            id="content"
            title="Create Your First Page"
          />
          <SetupChecklistItem
            description="Link your domain name so visitors can find you at your own URL."
            icon={<Globe />}
            id="domain"
            title="Connect a Custom Domain"
          />
          <SetupChecklistItem
            description="Review your setup and make your workspace publicly available."
            icon={<Rocket />}
            id="launch"
            title="Publish and Go Live"
          />
        </SetupChecklistList>
      </SetupChecklistCard>
      <SetupChecklistProgress>Onboarding Progress</SetupChecklistProgress>
    </SetupChecklist>
  );
}`;

function SetupChecklistPreview() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-10">
      <SetupChecklist
        defaultCompletedIds={["brand"]}
        onCompletedChange={(completedIds) => console.log(completedIds)}
      >
        <SetupChecklistCard>
          <SetupChecklistHeader>
            <SetupChecklistTitle>Onboarding Checklist</SetupChecklistTitle>
            <SetupChecklistDescription>
              Finish the remaining tasks to fully activate your workspace.
            </SetupChecklistDescription>
          </SetupChecklistHeader>
          <SetupChecklistList>
            <SetupChecklistItem
              description="Upload your logo and color palette so every page stays on-brand."
              icon={<Palette />}
              id="brand"
              title="Add Your Brand Assets"
            />
            <SetupChecklistItem
              description="Draft a landing page or post to start building your online presence."
              icon={<FileText />}
              id="content"
              title="Create Your First Page"
            />
            <SetupChecklistItem
              description="Link your domain name so visitors can find you at your own URL."
              icon={<Globe />}
              id="domain"
              title="Connect a Custom Domain"
            />
            <SetupChecklistItem
              description="Review your setup and make your workspace publicly available."
              icon={<Rocket />}
              id="launch"
              title="Publish and Go Live"
            />
          </SetupChecklistList>
        </SetupChecklistCard>
        <SetupChecklistProgress>Onboarding Progress</SetupChecklistProgress>
      </SetupChecklist>
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
      detailsDescription="SetupChecklist is a compound component: the root owns completion state and provides it through context, while SetupChecklistCard, SetupChecklistHeader, SetupChecklistTitle, SetupChecklistDescription, SetupChecklistList, SetupChecklistItem, and SetupChecklistProgress compose the card, rows, and progress pill. Completion state can be uncontrolled through defaultCompletedIds or fully controlled through completedIds."
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/blocks/setup-checklist/page.tsx`}
      itemSlug="setup-checklist"
      pageUrl="/blocks/setup-checklist"
      preview={<SetupChecklistPreview />}
      previewClassName="min-h-[34rem]"
      previewDescription="Rows stagger in with a soft rise, tapping a task pops in a drawn checkmark badge, and the progress pie and percentage settle on the same spring."
      title="Setup Checklist"
      usageCode={usageCode}
      usageDescription="Compose `SetupChecklist` from its parts: put `SetupChecklistTitle` and `SetupChecklistDescription` inside the header, add a `SetupChecklistItem` per task inside `SetupChecklistList`, and drop `SetupChecklistProgress` after the card with your own label. Use `defaultCompletedIds` for uncontrolled completion or `completedIds` with `onCompletedChange` to own the state from your app."
    />
  );
}
