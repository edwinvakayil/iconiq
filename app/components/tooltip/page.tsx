import Image from "next/image";
import { ComponentDocsLayout } from "@/components/docs/component-docs-layout";
import AnimatedTooltip from "@/registry/tooltip";

const TOOLTIP_CODE = `import AnimatedTooltip from "@/components/ui/tooltip";
import Image from "next/image";

const avatars = [
  { src: "https://iconiqui.com/assets/avatar-3.webp", name: "Alex" },
  { src: "https://iconiqui.com/assets/avatar-5.webp", name: "Jordan" },
  { src: "https://iconiqui.com/assets/avatar-16.webp", name: "Sam" },
];

export function GroupAvatarDemo() {
  return (
    <div className="flex -space-x-2">
      {avatars.map((avatar) => (
        <AnimatedTooltip key={avatar.name} content={avatar.name} side="top">
          <Image
            src={avatar.src}
            alt={avatar.name}
            width={40}
            height={40}
            className="size-10 rounded-full border-2 border-background object-cover ring-2 ring-background"
          />
        </AnimatedTooltip>
      ))}
    </div>
  );
}`;

const TOOLTIP_PROPS = [
  {
    name: "content",
    type: "React.ReactNode",
    desc: "Content to show inside the tooltip (text or JSX).",
  },
  {
    name: "children",
    type: "React.ReactNode",
    desc: "Trigger element; tooltip shows on hover.",
  },
  {
    name: "side",
    type: '"top" | "bottom" | "left" | "right"',
    desc: 'Placement of the tooltip relative to the trigger. Defaults to "top".',
  },
  {
    name: "delayMs",
    type: "number",
    desc: "Delay in milliseconds before showing the tooltip. Defaults to 200.",
  },
  {
    name: "backgroundColor",
    type: "string",
    desc: 'Background color of the tooltip (e.g. "#0a0a0a", "rgb(0,0,0)"). Defaults to black.',
  },
  {
    name: "textColor",
    type: "string",
    desc: 'Text color (e.g. "#fafafa", "white"). Defaults to light gray/white.',
  },
  {
    name: "borderColor",
    type: "string",
    desc: 'Border color (e.g. "rgba(255,255,255,0.2)"). Optional.',
  },
];

const avatars = [
  { src: "https://iconiqui.com/assets/avatar-3.webp", name: "Alex" },
  { src: "https://iconiqui.com/assets/avatar-5.webp", name: "Jordan" },
  { src: "https://iconiqui.com/assets/avatar-16.webp", name: "Sam" },
];

function TooltipPreview() {
  return (
    <div className="flex -space-x-2">
      {avatars.map((avatar) => (
        <AnimatedTooltip content={avatar.name} key={avatar.name} side="top">
          <Image
            alt={avatar.name}
            className="size-10 rounded-full border-2 border-background object-cover ring-2 ring-background"
            height={40}
            src={avatar.src}
            width={40}
          />
        </AnimatedTooltip>
      ))}
    </div>
  );
}

export default function TooltipPage() {
  return (
    <ComponentDocsLayout
      codeSample={TOOLTIP_CODE}
      componentName="tooltip"
      description="An animated tooltip with spring enter/exit, optional delay, and configurable placement (top, bottom, left, right). Built with Framer Motion. Use for labels, names, or short hints on hover."
      previewChildren={<TooltipPreview />}
      previewDescription="Hover over each avatar to see the tooltip. Group avatars use overlapping circles with a tooltip showing the name."
      propsRows={TOOLTIP_PROPS}
      propsTag="tooltip"
      title="Tooltip"
    />
  );
}
