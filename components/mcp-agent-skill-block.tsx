"use client";

import { useMemo, useState } from "react";

import { InstallCommandTerminal } from "@/components/install-command-terminal";
import { cn } from "@/lib/utils";

type McpAgentSkillBlockProps = {
  className?: string;
};

const SKILL_COMMAND = "npx skills add https://iconiqui.com";

export function McpAgentSkillBlock({ className }: McpAgentSkillBlockProps) {
  const [skill, setSkill] = useState<"consumer" | "contributor">("consumer");

  const commands = useMemo(
    () => ({
      pnpm: `${SKILL_COMMAND} --skill ${skill === "consumer" ? "iconiq-shadcn" : "iconiq"} -y`,
      npm: `${SKILL_COMMAND} --skill ${skill === "consumer" ? "iconiq-shadcn" : "iconiq"} -y`,
      yarn: `${SKILL_COMMAND} --skill ${skill === "consumer" ? "iconiq-shadcn" : "iconiq"} -y`,
      bun: `${SKILL_COMMAND} --skill ${skill === "consumer" ? "iconiq-shadcn" : "iconiq"} -y`,
    }),
    [skill]
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap gap-2">
        <button
          className={cn(
            "rounded-full border px-3 py-1 font-medium text-sm transition-colors",
            skill === "consumer"
              ? "border-foreground/15 bg-foreground text-background"
              : "border-border/80 text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setSkill("consumer")}
          type="button"
        >
          Building with Iconiq
        </button>
        <button
          className={cn(
            "rounded-full border px-3 py-1 font-medium text-sm transition-colors",
            skill === "contributor"
              ? "border-foreground/15 bg-foreground text-background"
              : "border-border/80 text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setSkill("contributor")}
          type="button"
        >
          Contributing to Iconiq
        </button>
      </div>
      <InstallCommandTerminal
        commands={commands}
        eventSlug={`mcp-skill-${skill}`}
      />
      <p className="text-foreground/90 text-sm leading-6">
        {skill === "consumer" ? (
          <>
            Teaches MCP + registry install patterns, provider naming (
            <code>b-*</code> / <code>r-*</code>), and motion conventions in your
            app.
          </>
        ) : (
          <>
            Teaches registry builds, docs pages, and <code>pnpm gen-cli</code>{" "}
            for the iconiqui.com repo.
          </>
        )}
      </p>
    </div>
  );
}
