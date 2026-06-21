"use client";

import * as React from "react";

import {
  type PackageManager,
  PackageManagerCommand,
} from "@/components/docs/split/package-manager-command";
import { getPackageManagerPrefix } from "@/lib/get-package-manager-prefix";

export type McpClient = "claude" | "cursor" | "vscode" | "codex";

export function McpInitCommand({ client }: { client?: McpClient }) {
  const getCommand = React.useCallback(
    (pm: PackageManager) => {
      const suffix = client ? ` --client ${client}` : "";
      return `${getPackageManagerPrefix(pm)} shadcn@latest mcp init${suffix}`;
    },
    [client]
  );

  return <PackageManagerCommand getCommand={getCommand} />;
}
