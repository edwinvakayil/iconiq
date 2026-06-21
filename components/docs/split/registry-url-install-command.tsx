"use client";

import * as React from "react";

import {
  INSTALL_COMMANDS,
  type PackageManager,
  PackageManagerCommand,
} from "@/components/docs/split/package-manager-command";
import { SITE } from "@/constants";

export function RegistryUrlInstallCommand({
  registryPath,
}: {
  registryPath: string;
}) {
  const getCommand = React.useCallback(
    (pm: PackageManager) =>
      `${INSTALL_COMMANDS[pm]} ${SITE.URL}/r/${registryPath}`,
    [registryPath]
  );

  return <PackageManagerCommand getCommand={getCommand} />;
}
