"use client";

import * as React from "react";

import {
  type PackageManager,
  PackageManagerCommand,
} from "@/components/docs/split/package-manager-command";

const SHADCN_DEV_COMMANDS: Record<PackageManager, string> = {
  pnpm: "pnpm add -D shadcn@latest",
  npm: "npm install -D shadcn@latest",
  yarn: "yarn add -D shadcn@latest",
  bun: "bun add -D shadcn@latest",
};

export function ShadcnDevDependencyCommand() {
  const getCommand = React.useCallback(
    (pm: PackageManager) => SHADCN_DEV_COMMANDS[pm],
    []
  );

  return <PackageManagerCommand getCommand={getCommand} />;
}
