---
name: iconiq-shadcn
description: Build UIs with Iconiq (@iconiq) via shadcn MCP—install registry components by exact slug, use Base UI (b-*) or Radix (r-*) variants, and follow Iconiq motion and theme conventions in consumer projects.
---

# Iconiq + shadcn MCP

Use this skill in **consumer apps** that install from [iconiqui.com](https://iconiqui.com). For contributing to the Iconiq repo itself, use the `iconiq` skill instead.

## Prerequisites

1. **shadcn MCP** — `pnpm dlx shadcn@latest mcp init --client cursor` (or your editor)
2. **Registry** in `components.json`:

```json
{
  "registries": {
    "@iconiq": "https://iconiqui.com/r/{name}.json"
  }
}
```

3. **Optional but recommended** — install this skill: `npx skills add https://iconiqui.com --skill iconiq-shadcn`

## MCP workflow (efficient)

1. User names an exact slug, e.g. `@iconiq/b-dialog` — never guess alternate names.
2. MCP fetches `https://iconiqui.com/r/<slug>.json` (lean payload; shared libs are separate items).
3. shadcn installs component source into the project (editable files, not npm packages).
4. If the item lists `registryDependencies`, install those first: `iconiq-theme`, `iconiq-motion`.

**Do**

- `Add @iconiq/b-button to components/ui/primary-button.tsx`
- `Install @iconiq/alert for the checkout error state; use registry install, not a rewrite`
- `Use Base UI variants only (@iconiq/b-*) for this feature`

**Don't**

- `List every Iconiq component` (wastes context — browse https://iconiqui.com instead)
- Install `button`, then `b-button`, then `r-button` for the same UI
- Remove `motion/react` or inlined theme helpers after install

## Provider naming

| Prefix | Headless library | Example |
|--------|------------------|---------|
| `b-*` | Base UI | `@iconiq/b-select` |
| `r-*` | Radix UI | `@iconiq/r-select` |
| (none) | Mixed / legacy | `@iconiq/button`, `@iconiq/accordion` |

Pick **one** provider line per feature. Default recommendation for new work: **Base UI (`b-*`)**.

## Shared registry libs

| Slug | Installs | When needed |
|------|----------|-------------|
| `iconiq-theme` | `lib/registry-theme.ts` | Components using `registryTheme` token classes |
| `iconiq-motion` | `lib/reduced-motion.tsx` | Components using `ReducedMotionConfig` / `useResolvedReducedMotion` |

shadcn resolves these via `registryDependencies` on each component — you usually do not install them manually.

## Categories (registry index)

- `components` — UI primitives (filter `base-ui` or `radix-ui` in prompts)
- `texts` — `dia-text`, `shimmer-text`
- `foundation` — `typography`
- `special-one` — `icon-bar`, `origin-button`, `faq-pro`

## After install

- Files land under your `components.json` aliases (typically `components/ui/`).
- Keep `@/lib/utils` (`cn`) — standard shadcn setup.
- Wrap app sections with `ReducedMotionConfig` when docs show `reducedMotion` props.
- Tune `registryTheme` tokens in `lib/registry-theme.ts` once for brand colors.

## Install commands (CLI fallback)

```bash
pnpm dlx shadcn@latest add @iconiq/b-button
pnpm dlx shadcn@latest add @iconiq/iconiq-theme @iconiq/iconiq-motion
```

## Docs

- MCP setup: https://iconiqui.com/mcp
- shadcn MCP: https://ui.shadcn.com/docs/mcp
