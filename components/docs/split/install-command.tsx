"use client";

import * as React from "react";

import {
  INSTALL_COMMANDS,
  type PackageManager,
  PackageManagerCommand,
} from "@/components/docs/split/package-manager-command";

interface InstallCommandProps {
  component: string;
}

export function InstallCommand({ component }: InstallCommandProps) {
  const componentRef = component.startsWith("@")
    ? component
    : `@iconiq/${component}`;

  const getCommand = React.useCallback(
    (pm: PackageManager) => `${INSTALL_COMMANDS[pm]} ${componentRef}`,
    [componentRef]
  );

  return <PackageManagerCommand getCommand={getCommand} />;
}
