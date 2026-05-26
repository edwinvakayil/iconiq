---
name: iconiq
description: Work on the Iconiq (iconiqui.com) shadcn registry and docs site—registry components, documentation pages, registry build output, and MCP docs. Use when editing this repo, adding or updating @iconiq components, registry files, docs pages, site navigation, or running gen-cli / build-registry.
---

# Iconiq

[iconiqui.com](https://iconiqui.com) — installable shadcn/ui primitives (`npx shadcn@latest add @iconiq/<name>`) plus a Next.js docs site with live previews.

## When to use

- Adding or changing a registry component under `registry/`
- Creating or updating docs pages under `app/(site)/`
- Rebuilding `public/r/` or `registry.json`
- Navigation, search, API tables, or v0 example snippets
- Installation, introduction, MCP, or other site docs

## Project layout

| Area | Path | Role |
|------|------|------|
| Registry source | `registry/*.tsx` | Installable component source (auto-discovered) |
| Docs site | `app/(site)/` | Live previews and usage |
| Component docs | `app/(site)/components/<name>/page.tsx` | Default doc route |
| Text effects | `app/(site)/texts/<name>/page.tsx` | Texts section |
| Featured | `app/(site)/special-one/<name>/page.tsx` | Special One section |
| API definitions | `components/docs/component-api.ts` | Shared props tables |
| Docs shell | `components/docs/page-shell.tsx` | `ComponentDocsPage` layout |
| Navigation | `lib/site-nav.ts` | Sidebar sections and order |
| Search | `lib/search-index.ts` | Page summaries for search |
| v0 snippets | `helpers/get-component-for-v0.ts` | Tooling examples |
| Registry build | `scripts/registry-build.ts` | `REGISTRY_UI_META`, generates payloads |
| Generated output | `public/r/`, `registry.json` | **Do not edit by hand** |
| Shared registry libs | `iconiq-theme`, `iconiq-motion` | Built as `registry:lib`; linked via `registryDependencies` |

Reference pattern: `registry/calendar.tsx`, `app/(site)/components/calendar/page.tsx`, calendar section in `component-api.ts`.

## Commands

```bash
pnpm install && pnpm dev          # local docs at http://localhost:3000
pnpm gen-cli                      # build-registry + lint (after registry changes)
pnpm build-registry               # refresh public/r/ only
pnpm lint:check && pnpm lint      # check / fix (Ultracite)
pnpm exec tsc --noEmit --pretty false
pnpm build
```

Node 20+, pnpm 10+ (`packageManager` in `package.json`).

## Add a new component

Work in order; skip steps only when they do not apply.

1. **`registry/<name>.tsx`** — Clean public API, no demo-only logic. Match existing motion and visual language.
2. **Docs page** — `ComponentDocsPage` from `@/components/docs/page-shell`: preview, installation, usage, API. Mirror `calendar/page.tsx`.
3. **`components/docs/component-api.ts`** — Real props, defaults, and behavior (no placeholders).
4. **`lib/site-nav.ts`** — Correct section: Components, Texts, Foundation, or Special One.
5. **`lib/search-index.ts`** — Short search summary.
6. **`helpers/get-component-for-v0.ts`** — Realistic v0 snippet.
7. **`scripts/registry-build.ts`** — Update `REGISTRY_UI_META` when titles, descriptions, or deps need custom copy.
8. **`pnpm gen-cli`** — Commit generated `public/r/<name>.json`, `public/r/registry.json`, and `registry.json`.
9. **Verify** — Route loads, preview matches API, lint/typecheck/build pass.

## Update an existing component

- Change `registry/<name>.tsx` first.
- Sync docs page, `component-api.ts`, and search copy when behavior or API changes.
- Run `pnpm gen-cli` whenever registry source changes.

## Conventions

- **Scope**: One focused change; avoid unrelated refactors.
- **Motion**: Subtle, intentional animation; respect reduced motion (`lib/reduced-motion.tsx`).
- **Registry theme**: Shared tokens/helpers in `lib/registry-theme.ts` when styling installable files.
- **Generated files**: Never hand-edit `public/r/`; always rebuild.
- **Registry libs**: `registry-build.ts` publishes `iconiq-theme` and `iconiq-motion` as separate items—do not inline them into UI payloads.
- **MCP**: Consumer guidance lives in `skills/iconiq-shadcn/` and `/mcp`.
- **Docs copy**: Document real behavior, not placeholder text.
- **PRs**: Note `pnpm gen-cli` when generated files change; add screenshots for UI.

## Full contributor guide

For edge cases and PR expectations, read [CONTRIBUTING.md](CONTRIBUTING.md).
