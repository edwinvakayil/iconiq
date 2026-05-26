/** Shared copy and examples for the MCP documentation page. */

export const ICONIQ_REGISTRY_CONFIG = `{
  "registries": {
    "@iconiq": "https://iconiqui.com/r/{name}.json"
  }
}`;

export const MCP_EFFICIENT_PROMPTS = `Add @iconiq/b-dialog to src/components/settings/delete-account-dialog.tsx and wire open state to the existing pattern.
Install @iconiq/alert for the checkout error banner; use shadcn registry install, do not rewrite from scratch.
Use @iconiq/b-* components only for this settings page (Base UI variants).`;

export const MCP_AVOID_PROMPTS = `List every component in the iconiq registry.
Try button, b-button, and r-button until one works.
Install ten Iconiq components without naming specific slugs.`;

export const MCP_SHARED_LIBS = [
  {
    slug: "iconiq-theme",
    path: "lib/registry-theme.ts",
    description: "Tailwind token classes shared across themed components.",
  },
  {
    slug: "iconiq-motion",
    path: "lib/reduced-motion.tsx",
    description: "Reduced-motion helpers for Motion-backed components.",
  },
] as const;

export const MCP_PROVIDER_ROWS = [
  {
    prefix: "b-*",
    library: "Base UI",
    example: "@iconiq/b-select",
    note: "Recommended default for new features.",
  },
  {
    prefix: "r-*",
    library: "Radix UI",
    example: "@iconiq/r-select",
    note: "Use when your app standardizes on Radix primitives.",
  },
  {
    prefix: "(none)",
    library: "Legacy / mixed",
    example: "@iconiq/button",
    note: "Original Iconiq components; prefer b-* or r-* for new work.",
  },
] as const;
