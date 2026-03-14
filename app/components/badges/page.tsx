import { ComponentDocsLayout } from "@/components/docs/component-docs-layout";
import { StatusBadge } from "@/registry/animated-badges";

const BADGES_CODE = `import { StatusBadge } from "@/components/ui/animated-badges"

export default function Demo() {
  return (
    <div className="flex gap-3">
      <StatusBadge label="Live" variant="live" />
      <StatusBadge label="Pending" variant="pending" />
      <StatusBadge label="Critical" variant="critical" />
    </div>
  )
}`;

const BADGES_PROPS = [
  {
    name: "label",
    type: "string",
    desc: 'Optional text shown in the badge. Defaults to "live".',
  },
  {
    name: "variant",
    type: "enum",
    desc: '"live" | "pending" | "critical". Controls colors and animation.',
  },
  {
    name: "visible",
    type: "boolean",
    desc: "When false, the badge animates out and unmounts. Defaults to true.",
  },
  {
    name: "className",
    type: "string",
    desc: "Optional className for custom styling on the container.",
  },
];

function BadgesPreview() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <StatusBadge label="Live" variant="live" />
      <StatusBadge label="Pending" variant="pending" />
      <StatusBadge label="Critical" variant="critical" />
    </div>
  );
}

export default function BadgesPage() {
  return (
    <ComponentDocsLayout
      codeSample={BADGES_CODE}
      componentName="animated-badges"
      description="Status badges with a shimmer sweep, pulsing dot, and spring enter/exit animations. Built with Framer Motion for hover and visibility transitions."
      previewChildren={<BadgesPreview />}
      previewDescription="Hover over each badge to see the scale and shadow effect. All three variants use a shimmer and pulsing dot animation."
      propsRows={BADGES_PROPS}
      propsTag="animated-badges"
      title="Badges"
    />
  );
}
