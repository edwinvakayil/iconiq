"use client";

import { toast } from "sonner";

import { feedbackFormApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { FeedbackForm } from "@/registry/feedback";

const usageCode = `"use client";

import { FeedbackForm } from "@/components/ui/feedback";

export function FeedbackFormPreview() {
  return (
    <FeedbackForm
      label="Iconiq UI"
      placeholder="What's on your mind?"
      onSubmit={async (value) => {
        await fetch("/api/feedback", {
          method: "POST",
          body: JSON.stringify({ value }),
        });
      }}
    />
  );
}`;

function FeedbackFormPreview() {
  return (
    <div className="mx-auto flex w-full max-w-md items-start justify-center px-6 py-16">
      <FeedbackForm
        label="Iconiq UI"
        onSubmit={async (value) => {
          await new Promise((resolve) => setTimeout(resolve, 1200));
          toast.success("Feedback sent", { description: value });
        }}
        placeholder="What's on your mind?"
      />
    </div>
  );
}

export default function FeedbackFormPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Blocks" },
        { label: "Feedback Form" },
      ]}
      componentName="feedback"
      description="Collapsed pill that morphs into an expanded feedback panel with a send button and a textarea."
      details={feedbackFormApiDetails}
      detailsDescription="FeedbackForm morphs with plain CSS transitions instead of a JS animation library. A `data-open` attribute on the root drives everything: width, height, and border-radius transition on the close timing by default, and a `data-[open=true]` rule overrides to a bouncier open timing — so each direction gets its own duration and easing rather than one symmetric transition. The trigger and panel are both always mounted and absolutely positioned; they cross-fade via opacity, a slide, a scale, and a blur toggled through the same `data-open` attribute using Tailwind's `group-data-*` variant."
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/blocks/feedback-form/page.tsx`}
      itemSlug="feedback"
      pageUrl="/blocks/feedback-form"
      preview={<FeedbackFormPreview />}
      previewClassName="min-h-[22rem]"
      previewDescription="Click the pill to morph it into the feedback panel. Type something, then click Send or press Cmd/Ctrl+Enter — the button shows a loading spinner while `onSubmit` resolves before the panel collapses back. Click outside or press Escape to cancel."
      title="Feedback Form"
      usageCode={usageCode}
      usageDescription="Drop `FeedbackForm` anywhere. Customize the collapsed pill's `label` and the textarea's `placeholder`, and handle the trimmed value with `onSubmit` — return a promise to show the button's loading state until it resolves, after which the panel collapses back to the pill automatically."
    />
  );
}
