# Contributing

Thanks for contributing to Iconiq.

This repository contains two connected parts:

- the installable component source under `registry/`
- the documentation site that explains and previews those components

Good contributions usually improve one of these areas:

- new registry-ready components
- API improvements to existing components
- documentation accuracy, live preview quality, or usage examples
- registry build and publishing workflow

## Before You Start

- Keep changes scoped
- Match the existing visual language and interaction quality
- Prefer small, understandable updates over broad refactors
- Document real behavior, not placeholder API copy

## Local Setup

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

## Checks

Run these before opening a pull request:

```bash
pnpm lint:check
pnpm exec tsc --noEmit --pretty false
pnpm build
```

If you changed any file under `registry/`, rebuild the published registry payloads too:

```bash
pnpm build-registry
```

## How To Add a Component

Adding a component is more than creating one file. A complete component contribution usually touches the registry, docs, navigation, API documentation, and generated registry payloads.

### 1. Add the component source

Create the installable component in:

```text
registry/<component-name>.tsx
```

Guidelines:

- keep the public API clean and reusable
- export the component names you want downstream users to import
- avoid app-specific dummy behavior in the registry file
- prefer framework-agnostic code when possible
- make sure the installed file can run cleanly after `npx shadcn@latest add @iconiq/<component-name>`

### 2. Add the documentation page

Create the matching docs page in:

```text
app/components/<component-name>/page.tsx
```

That page should include:

- a live playground
- an installation block
- a usage snippet
- API details based on the real component behavior

In most cases, use the shared docs shell through `ComponentDocsPage` so the new page matches the rest of the site.

### 3. Add API details

Document the component in:

```text
components/docs/component-api.ts
```

Add:

- the actual props
- required and optional fields
- defaults where they exist
- behavior notes that matter to consumers

Do not use placeholder descriptions. The API section should reflect the real implementation in `registry/<component-name>.tsx`.

### 4. Add the component to site navigation

Update:

```text
lib/site-nav.ts
```

This makes the component appear in the sidebar, search index inputs, and shared component ordering.

### 5. Add the v0 example snippet

Update:

```text
helpers/get-component-for-v0.ts
```

Add a realistic example snippet for the new component so downstream tooling and examples stay complete.

### 6. Check registry metadata

Registry JSON is generated automatically from the files in `registry/`, but the published metadata for title, description, and dependency notes is maintained in:

```text
scripts/registry-build.ts
```

If the component needs a proper title, description, or explicit dependency list in the generated registry output, add or update its entry there.

### 7. Rebuild the registry

After changing or adding registry components, rebuild:

```bash
pnpm build-registry
```

This refreshes:

- `public/r/<component-name>.json`
- `public/r/registry.json`
- `registry.json`

These generated files should stay in sync with the source under `registry/`.

### 8. Verify the full flow

Before opening a PR, verify:

- the docs page loads correctly
- the live preview behaves as expected
- the usage snippet matches the current API
- the API details are accurate
- the registry rebuild succeeds
- typecheck passes

## Updating an Existing Component

For existing components, the same principle applies:

1. update the source in `registry/`
2. update the docs page if behavior or examples changed
3. update `components/docs/component-api.ts` if props or notes changed
4. rebuild the registry if the registry source changed

## File Map

These are the main places you will usually touch during component work:

- `registry/` — installable component source
- `app/components/` — component documentation pages
- `components/docs/component-api.ts` — shared API detail definitions
- `lib/site-nav.ts` — sidebar and ordering
- `helpers/get-component-for-v0.ts` — example snippet source
- `scripts/registry-build.ts` — generated registry metadata
- `public/r/` — generated registry payloads

## Pull Requests

- keep the PR focused
- include screenshots or a short walkthrough for UI changes when useful
- mention any registry rebuild in the PR description if the generated files changed
- avoid mixing unrelated cleanups into component additions unless they are required for the work

## Questions

If you are unsure whether a change belongs in the registry component, the docs page, or shared docs metadata, prefer checking the existing component patterns under:

- `registry/`
- `app/components/`
- `components/docs/component-api.ts`

