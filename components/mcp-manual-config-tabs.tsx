"use client";

import { DocsCodeSnippet } from "@/components/docs/code-snippet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ManualClientConfig = {
  id: "claude" | "cursor" | "vscode" | "codex";
  label: string;
  filePath: string;
  code: string;
  note: string;
};

const MANUAL_CLIENTS: ManualClientConfig[] = [
  {
    id: "claude",
    label: "Claude Code",
    filePath: ".mcp.json",
    code: `{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}`,
    note: "Restart Claude Code and run /mcp to verify the shadcn server shows as connected.",
  },
  {
    id: "cursor",
    label: "Cursor",
    filePath: ".cursor/mcp.json",
    code: `{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}`,
    note: "After saving the file, enable the shadcn MCP server in Cursor settings.",
  },
  {
    id: "vscode",
    label: "VS Code",
    filePath: ".vscode/mcp.json",
    code: `{
  "servers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}`,
    note: "Open .vscode/mcp.json and click Start next to the shadcn server after saving.",
  },
  {
    id: "codex",
    label: "Codex",
    filePath: "~/.codex/config.toml",
    code: `[mcp_servers.shadcn]
command = "npx"
args = ["shadcn@latest", "mcp"]`,
    note: "Restart Codex after editing ~/.codex/config.toml so the MCP server is loaded.",
  },
];

export function McpManualConfigTabs({ className }: { className?: string }) {
  return (
    <Tabs className={className} defaultValue={MANUAL_CLIENTS[0]?.id}>
      <TabsList className="flex flex-wrap items-center gap-1 border-0 bg-transparent p-0">
        {MANUAL_CLIENTS.map((client) => (
          <TabsTrigger
            className="px-2 py-1.5 font-mono text-[11px] normal-case tracking-normal"
            key={client.id}
            value={client.id}
          >
            {client.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {MANUAL_CLIENTS.map((client) => (
        <TabsContent
          className="m-0 space-y-4"
          key={client.id}
          value={client.id}
        >
          <div className="space-y-2">
            <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
              {client.filePath}
            </p>
            <DocsCodeSnippet code={client.code} />
          </div>
          <p className="text-muted-foreground text-sm">{client.note}</p>
        </TabsContent>
      ))}
    </Tabs>
  );
}
