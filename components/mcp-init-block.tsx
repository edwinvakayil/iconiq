"use client";

import { useMemo } from "react";

import { InstallCommandTerminal } from "@/components/install-command-terminal";
import { getPackageManagerPrefix } from "@/lib/get-package-manager-prefix";

type McpClient = "claude" | "cursor" | "vscode" | "codex";

export function McpInitBlock({
  className,
  client,
}: {
  className?: string;
  client?: McpClient;
}) {
  const commands = useMemo(
    () => ({
      pnpm: `${getPackageManagerPrefix("pnpm")} shadcn@latest mcp init${
        client ? ` --client ${client}` : ""
      }`,
      npm: `${getPackageManagerPrefix("npm")} shadcn@latest mcp init${
        client ? ` --client ${client}` : ""
      }`,
      yarn: `${getPackageManagerPrefix("yarn")} shadcn@latest mcp init${
        client ? ` --client ${client}` : ""
      }`,
      bun: `${getPackageManagerPrefix("bun")} shadcn@latest mcp init${
        client ? ` --client ${client}` : ""
      }`,
    }),
    [client]
  );

  return <InstallCommandTerminal className={className} commands={commands} />;
}

export type { McpClient };
