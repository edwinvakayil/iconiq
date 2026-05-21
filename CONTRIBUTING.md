# Contributing

Thanks for contributing to [Iconiq](https://iconiqui.com).

This repository has two connected parts. The `registry/` directory holds installable component source that users add with `npx shadcn@latest add @iconiq/<name>`. The `app/(site)/` directory is the documentation site with live previews and usage examples.

Good contributions usually improve one of these areas: new registry-ready components, API or behavior fixes for existing components, documentation accuracy and previews, or the registry build output under `public/r/`.

## Before you start

Keep changes scoped and focused. Match the existing visual language and motion quality. Prefer small, understandable updates over broad refactors. Document real behavior in the docs and API sections — not placeholder copy.

## Prerequisites

You need [Node.js](https://nodejs.org/) 20 or newer and [pnpm](https://pnpm.io/) 10 or newer (see `packageManager` in `package.json`).

## Local setup

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to preview the docs site.

## Checks

Run these before opening a pull request:

```bash
pnpm lint:check
pnpm lint
pnpm exec tsc --noEmit --pretty false
pnpm build
```

`pnpm lint:check` reports lint issues without rewriting files. `pnpm lint` applies Ultracite fixes. `pnpm build` runs the Next.js production build (including the prebuild font step).

If you changed anything under `registry/`, rebuild the published registry payloads and lint the updated generated output:

```bash
pnpm gen-cli
```

`pnpm gen-cli` runs `pnpm build-registry` and then `pnpm lint`. You can run `pnpm build-registry` alone if you only need to refresh `public/r/` and `registry.json` without applying lint fixes.

## How to add a component

A complete component contribution usually touches the registry, docs, navigation, API documentation, search, and generated registry files. Work through the steps below in order.

### 1. Add the component source

Create the installable component at `registry/<component-name>.tsx`.

Keep the public API clean and reusable. Export the names downstream users should import. Avoid app-specific demo logic in the registry file. Make sure the installed file runs cleanly after `npx shadcn@latest add @iconiq/<component-name>`.

Registry entries are discovered automatically from `registry/*.tsx` via `scripts/registry-components.ts`.

### 2. Add the documentation page

Create the docs page at `app/(site)/components/<component-name>/page.tsx`.

For Texts or Special One items, use `app/(site)/texts/<component-name>/page.tsx` or `app/(site)/special-one/<component-name>/page.tsx` instead.

Each page should include a live preview, an installation block, a usage snippet, and API details that match the real implementation. Use `ComponentDocsPage` from `@/components/docs/page-shell` so the page matches the rest of the site. See `app/(site)/components/calendar/page.tsx` for the pattern.

### 3. Document the API

Add the component’s API details in `components/docs/component-api.ts`. Include the actual props, required and optional fields, defaults where they exist, and behavior notes that matter to consumers. Do not use placeholder descriptions. The API section should reflect the real implementation in `registry/<component-name>.tsx`.

### 4. Add site navigation

Update `lib/site-nav.ts` and add the component under the correct section: Components, Texts, Foundation, or Special One. This drives the sidebar, search index inputs, and shared component ordering.

### 5. Add search metadata

For component pages, add a short summary in `lib/search-index.ts`. Search is built from `site-nav.ts` plus these summaries.

### 6. Add the v0 example snippet

Update `helpers/get-component-for-v0.ts` with a realistic example snippet for the new component so downstream tooling and examples stay complete.

### 7. Registry metadata (optional)

Titles, descriptions, and explicit dependency lists for generated registry output are maintained in `scripts/registry-build.ts`. Update `REGISTRY_UI_META` when the component needs custom registry copy beyond what the filename provides.

### 8. Rebuild the registry

After changing or adding registry components, run:

```bash
pnpm gen-cli
```

This runs `pnpm build-registry` and `pnpm lint`, refreshing `public/r/<component-name>.json`, `public/r/registry.json`, and `registry.json` while keeping generated output formatted. Commit these generated files when registry source changes. Do not edit files under `public/r/` by hand.

### 9. Verify the full flow

Before opening a PR, confirm the docs page loads at the correct route (for example `/components/<name>`), the live preview behaves as expected, usage snippets match the current API, API details in `component-api.ts` are accurate, `pnpm gen-cli` succeeds when registry files changed, and lint, typecheck, and `pnpm build` pass.

## Updating an existing component

For existing components, apply the same principle. Update the source in `registry/<component-name>.tsx`. Update the docs page if behavior or examples changed. Update `components/docs/component-api.ts` if props or notes changed. Update `lib/search-index.ts` if the search summary should change. Run `pnpm gen-cli` when the registry source changed.

## File map

These are the main places you will usually touch during component work.

`registry/` is the installable component source. `app/(site)/components/` holds component documentation pages. `app/(site)/texts/` and `app/(site)/special-one/` hold text effect and featured component pages. `components/docs/component-api.ts` contains shared API definitions. `components/docs/page-shell.tsx` is the shared docs page layout. `lib/site-nav.ts` defines sidebar navigation and sections. `lib/search-index.ts` holds site search summaries. `helpers/get-component-for-v0.ts` is the source for v0 and tooling example snippets. `scripts/registry-build.ts` maintains registry metadata and runs the build. `scripts/registry-components.ts` discovers registry files. `public/r/` contains generated registry payloads.

## Pull requests

Keep PRs focused on one change or feature. Include screenshots or a short walkthrough for UI changes when that helps reviewers. Mention `pnpm gen-cli` (or `pnpm build-registry`) in the PR description if generated files changed. Avoid unrelated cleanups mixed into component work unless they are required for the change.

## Questions

If you are unsure whether a change belongs in the registry component, the docs page, or shared docs metadata, compare with the existing calendar patterns in `registry/calendar.tsx`, `app/(site)/components/calendar/page.tsx`, and the calendar section in `components/docs/component-api.ts`.

Open an issue on [GitHub](https://github.com/edwinvakayil/iconiq) if something is unclear before starting a large change.
