"use client";

import { useEffect, useState } from "react";

import { reasoningStepsApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import {
  ReasoningStep,
  ReasoningStepDetails,
  ReasoningStepSource,
  ReasoningStepSources,
  type ReasoningStepStatus,
  ReasoningSteps,
  ReasoningStepsContent,
  ReasoningStepsTrigger,
} from "@/registry/reasoning-steps";

const usageCode = `import {
  ReasoningStep,
  ReasoningStepDetails,
  ReasoningStepSource,
  ReasoningStepSources,
  ReasoningSteps,
  ReasoningStepsContent,
  ReasoningStepsTrigger,
} from "@/components/ui/reasoning-steps";

export function AssistantReply() {
  return (
    <ReasoningSteps>
      <ReasoningStepsTrigger>Reasoning</ReasoningStepsTrigger>
      <ReasoningStepsContent>
        <ReasoningStep
          description="Parsing the question and pulling out the actual constraints."
          label="Reading the request"
          status="done"
        />
        <ReasoningStep
          description="Checking the deploy config mentioned earlier in the thread."
          label="Recalling relevant context"
          status="done"
        />
        <ReasoningStep
          description="A quick rollback versus a targeted env-var fix."
          label="Weighing two approaches"
          status="done"
        >
          <ReasoningStepDetails summary="See the tradeoffs">
            A rollback restores service in under a minute but loses the
            config fix for the next deploy. The env-var patch takes longer
            to verify but fixes it at the source.
          </ReasoningStepDetails>
          <ReasoningStepSources>
            <ReasoningStepSource>vercel.com/docs</ReasoningStepSource>
            <ReasoningStepSource>runbook.md</ReasoningStepSource>
          </ReasoningStepSources>
        </ReasoningStep>
        <ReasoningStep
          description="Writing the fix as a short, ordered checklist."
          label="Drafting the answer"
          status="active"
        />
      </ReasoningStepsContent>
    </ReasoningSteps>
  );
}`;

const PREVIEW_STEPS: { id: string; label: string; description: string }[] = [
  {
    id: "read",
    label: "Reading the request",
    description: "Parsing the question and pulling out the actual constraints.",
  },
  {
    id: "recall",
    label: "Recalling relevant context",
    description: "Checking the deploy config mentioned earlier in the thread.",
  },
  {
    id: "compare",
    label: "Weighing two approaches",
    description: "A quick rollback versus a targeted env-var fix.",
  },
  {
    id: "draft",
    label: "Drafting the answer",
    description: "Writing the fix as a short, ordered checklist.",
  },
];

const CYCLE_INTERVAL_MS = 1700;

function ReasoningStepsPreview() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((current) => (current + 1) % (PREVIEW_STEPS.length + 1));
    }, CYCLE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex w-full max-w-md flex-col gap-6 py-10">
      <div className="self-end rounded-2xl rounded-br-md bg-muted px-4 py-2.5 text-[13px] text-foreground">
        Why did my staging deploy fail?
      </div>
      <ReasoningSteps>
        <ReasoningStepsTrigger>Reasoning</ReasoningStepsTrigger>
        <ReasoningStepsContent>
          {PREVIEW_STEPS.map((step, index) => {
            const status: ReasoningStepStatus =
              index < activeIndex
                ? "done"
                : index === activeIndex
                  ? "active"
                  : "pending";

            return (
              <ReasoningStep
                description={step.description}
                key={step.id}
                label={step.label}
                status={status}
              >
                {status === "done" && step.id === "compare" ? (
                  <>
                    <ReasoningStepDetails summary="See the tradeoffs">
                      A rollback restores service in under a minute but loses
                      the config fix for the next deploy. The env-var patch
                      takes longer to verify but fixes it at the source.
                    </ReasoningStepDetails>
                    <ReasoningStepSources>
                      <ReasoningStepSource>vercel.com/docs</ReasoningStepSource>
                      <ReasoningStepSource>runbook.md</ReasoningStepSource>
                    </ReasoningStepSources>
                  </>
                ) : null}
              </ReasoningStep>
            );
          })}
        </ReasoningStepsContent>
      </ReasoningSteps>
    </div>
  );
}

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Blocks" },
  { label: "Reasoning Steps" },
];

export default function ReasoningStepsPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="reasoning-steps"
      description="AI reasoning trace with a shimmering trigger label, a self-timing readout, and a connected step timeline."
      details={reasoningStepsApiDetails}
      detailsDescription="ReasoningSteps is a compound disclosure for a model's reasoning trace — the kind of 'thought for a few seconds' row that sits above a chat reply. Compose it from ReasoningStepsTrigger and ReasoningStepsContent, then render one ReasoningStep per step with a status of 'active' or 'done' — steps marked 'pending' render nothing at all until they're promoted, so the timeline only ever shows what's actually happened. The trigger carries no status icon: the label itself gets a looping shimmer sweep clipped to the text while any step is active, and settles to plain text once nothing is in flight. Each step in the timeline gets its own small glyph — a plain dot while active that pops into a check icon once done, with no border and no looping animation. The trigger also keeps its own elapsed-seconds clock and, while collapsed, slides and blurs between step labels as the active one changes. Steps can carry a nested ReasoningStepDetails disclosure and ReasoningStepSources/ReasoningStepSource citation pills. Both the main panel and nested details measure their own height with a ResizeObserver instead of animating to Motion's 'auto', which avoids the overshoot that technique gets under a scaled ancestor."
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/blocks/reasoning-steps/page.tsx`}
      itemSlug="reasoning-steps"
      pageUrl="/blocks/reasoning-steps"
      preview={<ReasoningStepsPreview />}
      previewClassName="min-h-[26rem]"
      previewDescription="A simulated reasoning trace cycles through its steps on its own — watch the 'Reasoning' label shimmer while a step is active, and each step's dot pop into a checkmark once it's done. The 'Weighing two approaches' step opens a nested details disclosure and two source pills once it completes. Click the trigger any time to collapse or expand the timeline; the cycle keeps running underneath."
      railNotes={[
        'Steps marked "pending" render nothing — only mount a ReasoningStep once it\'s actually active or done, and the reveal animation plays automatically.',
        "The trigger label has no icon next to it — it shimmers in place while a step is active instead. Each step's own glyph is a plain dot that pops into a check icon once done.",
        "Nest ReasoningStepDetails, ReasoningStepSources, and ReasoningStepSource inside a step for a drill-down disclosure and citation pills.",
        'Leave duration unset to let the trigger time itself for as long as any step is "active"; pass a number to control the readout instead.',
      ]}
      title="Reasoning Steps"
      usageCode={usageCode}
      usageDescription="Compose ReasoningSteps around a ReasoningStepsTrigger and ReasoningStepsContent, then render one ReasoningStep per step as your model reports progress — mark the current one 'active' and flip it to 'done' when the next step starts. Leave future steps out entirely (or mark them 'pending') until they actually begin."
    />
  );
}
