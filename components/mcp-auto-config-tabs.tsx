"use client";

import { type McpClient, McpInitBlock } from "@/components/mcp-init-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AutoClientConfig = {
  id: McpClient;
  label: string;
  description: string;
  note?: string;
};

const AUTO_CLIENTS: AutoClientConfig[] = [
  {
    id: "claude",
    label: "Claude Code",
    description:
      "Scaffold the shadcn MCP server for Claude Code and then restart the client.",
    note: "After setup, run /mcp in Claude Code to confirm the server is connected.",
  },
  {
    id: "cursor",
    label: "Cursor",
    description:
      "Generate the Cursor MCP entry and then enable the shadcn server in Cursor settings.",
    note: "You should see a green dot next to the shadcn server once Cursor enables it.",
  },
  {
    id: "vscode",
    label: "VS Code",
    description:
      "Generate the VS Code MCP entry and then click Start inside the MCP editor panel.",
    note: "VS Code stores MCP servers under the servers key instead of mcpServers.",
  },
  {
    id: "codex",
    label: "Codex",
    description:
      "The shadcn quick-start command is still useful for reference, but Codex needs a manual config update.",
    note: "The shadcn CLI cannot automatically update ~/.codex/config.toml. Use the manual configuration below.",
  },
];

export function McpAutoConfigTabs({ className }: { className?: string }) {
  return (
    <Tabs className={className} defaultValue={AUTO_CLIENTS[0]?.id}>
      <TabsList className="flex flex-wrap items-center gap-1 border-0 bg-transparent p-0">
        {AUTO_CLIENTS.map((client) => (
          <TabsTrigger
            className="px-2 py-1.5 font-mono text-[11px] normal-case tracking-normal"
            key={client.id}
            value={client.id}
          >
            {client.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {AUTO_CLIENTS.map((client) => (
        <TabsContent
          className="m-0 space-y-4"
          key={client.id}
          value={client.id}
        >
          <p>{client.description}</p>
          <McpInitBlock className="max-w-[720px]" client={client.id} />
          {client.note ? (
            <p className="text-muted-foreground text-sm">{client.note}</p>
          ) : null}
        </TabsContent>
      ))}
    </Tabs>
  );
}
