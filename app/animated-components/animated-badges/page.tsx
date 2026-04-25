import { CodeBlock } from "@/components/code-block";
import { CodeBlockInstall } from "@/components/code-block-install";
import { ComponentActions } from "@/components/component-actions";
import { animatedBadgesApiDetails } from "@/components/docs/component-api";
import {
  DetailAccordion,
  DocsPageShell,
  DocsSection,
} from "@/components/docs/page-shell";
import { StatusBadge } from "@/registry/animated-badges";

export default function AnimatedBadgesPage() {
  return (
    <DocsPageShell
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Animated" },
        { label: "Badges" },
      ]}
      description="Status badges with a shimmer sweep, pulsing dot, and spring enter and exit motion. Useful for live indicators, pending states, or critical alerts."
      eyebrow="Animated Component"
      meta={[
        { label: "States", value: "live, pending, critical" },
        { label: "Install", value: "@iconiq/animated-badges" },
        { label: "Motion", value: "visibility-aware spring transitions" },
      ]}
      title="Badges"
    >
      <DocsSection
        className="lg:col-span-7"
        description="Hover over each badge to read the surface motion and shimmer pass."
        index="01"
        title="Preview"
      >
        <div className="flex min-h-[220px] flex-wrap items-center gap-3">
          <StatusBadge label="Live" variant="live" />
          <StatusBadge label="Pending" variant="pending" />
          <StatusBadge label="Critical" variant="critical" />
        </div>
      </DocsSection>

      <DocsSection
        className="lg:col-span-5"
        description="Install and branch into v0 without leaving the page."
        index="02"
        title="Install"
      >
        <div className="space-y-6">
          <CodeBlockInstall componentName="animated-badges" />
          <ComponentActions name="animated-badges" />
        </div>
      </DocsSection>

      <DocsSection
        className="lg:col-span-12"
        description="Use the exported StatusBadge component with the variant that matches the state you need to surface."
        index="03"
        title="Usage"
      >
        <CodeBlock
          code={`import { StatusBadge } from "@/components/ui/animated-badges";

export function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <StatusBadge label="Live" variant="live" />
      <StatusBadge label="Pending" variant="pending" />
      <StatusBadge label="Critical" variant="critical" />
    </div>
  );
}`}
          language="tsx"
        />
      </DocsSection>

      <DocsSection
        className="lg:col-span-12"
        description="The small API surface is easier to read as expandable notes than as a dense table."
        index="04"
        title="Props"
      >
        <DetailAccordion details={animatedBadgesApiDetails} />
      </DocsSection>
    </DocsPageShell>
  );
}
