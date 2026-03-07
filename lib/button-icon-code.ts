import { kebabToPascalIcon } from "./icon-name-utils";

const BUTTON_VARIANTS = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
] as const;

type Options = {
  iconName: string;
  cliPrefix: string;
  buttonLabel?: string;
  variant?: (typeof BUTTON_VARIANTS)[number];
};

/**
 * Returns the full code snippet: install commands (comment) + imports + JSX
 * for using the icon inside a shadcn Button.
 */
export function getButtonWithIconCode({
  iconName,
  cliPrefix,
  buttonLabel = "Click me",
  variant = "default",
}: Options): string {
  const componentName = kebabToPascalIcon(iconName);
  const variantProp = variant === "default" ? "" : ` variant="${variant}"`;

  return `// 1. Add the icon (run in your project):
// ${cliPrefix} shadcn add @iconiq/${iconName}

// 2. If you don't have the Button component yet:
// ${cliPrefix} shadcn add button

import { Button } from "@/components/ui/button";
import { ${componentName} } from "@/components/ui/${iconName}";

export function ExampleButton() {
  return (
    <Button${variantProp}>
      <${componentName} className="mr-2 size-4" />
      ${buttonLabel}
    </Button>
  );
}
`;
}

export { BUTTON_VARIANTS };
