"use client";

import * as React from "react";

import { HighlightedCode } from "@/components/docs/code-snippet";
import { DocsCodePanel } from "@/components/docs/split/docs-code-panel";
import { useSmoothCodeHeight } from "@/hooks/use-smooth-code-height";

export const PACKAGE_MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

export const INSTALL_COMMANDS: Record<PackageManager, string> = {
  pnpm: "pnpm dlx shadcn@latest add",
  npm: "npx shadcn@latest add",
  yarn: "yarn dlx shadcn@latest add",
  bun: "bunx --bun shadcn@latest add",
};

interface PackageManagerCommandProps {
  getCommand: (pm: PackageManager) => string;
  defaultPm?: PackageManager;
}

export function PackageManagerCommand({
  getCommand,
  defaultPm = "npm",
}: PackageManagerCommandProps) {
  const [selected, setSelected] = React.useState<PackageManager>(defaultPm);
  const command = getCommand(selected);
  const { contentRef, wrapperProps } = useSmoothCodeHeight(command, selected);

  const tabs = PACKAGE_MANAGERS.map((pm) => ({ id: pm, label: pm }));

  return (
    <DocsCodePanel
      activeTab={selected}
      copyCode={command}
      onTabChange={(id) => setSelected(id as PackageManager)}
      tabListAriaLabel="Package manager"
      tabs={tabs}
    >
      <div {...wrapperProps}>
        <div ref={contentRef}>
          <pre className="no-scrollbar overflow-x-auto whitespace-pre p-4 font-mono text-[13px] leading-relaxed">
            <HighlightedCode code={command} />
          </pre>
        </div>
      </div>
    </DocsCodePanel>
  );
}
