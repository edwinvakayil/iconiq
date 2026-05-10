"use client";

import { useMemo } from "react";

import { InstallCommandTerminal } from "@/components/install-command-terminal";

export function ShadcnDevDependencyBlock({
  className,
}: {
  className?: string;
}) {
  const commands = useMemo(
    () => ({
      pnpm: "pnpm add -D shadcn@latest",
      npm: "npm install -D shadcn@latest",
      yarn: "yarn add -D shadcn@latest",
      bun: "bun add -D shadcn@latest",
    }),
    []
  );

  return <InstallCommandTerminal className={className} commands={commands} />;
}
