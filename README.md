# Iconiq

Open-source React components delivered through the shadcn registry workflow.

Iconiq is a component library and documentation site for teams that want polished UI, motion-aware interactions, and installable source components that can be adapted directly in their own projects.

## Overview

- React 19 components with Tailwind CSS v4 styling
- Motion-driven interactions powered by Motion
- Registry distribution compatible with the shadcn CLI
- Documentation site with live previews, usage examples, and API details
- 27 registry components maintained in this repository

## Links

- Website: [iconiqui.com](https://iconiqui.com)
- Documentation: [iconiqui.com/introduction](https://iconiqui.com/introduction)
- Components: [iconiqui.com/components/button](https://iconiqui.com/components/button)
- Changelog: [iconiqui.com/changelog](https://iconiqui.com/changelog)
- Sponsor: [buymeacoffee.com/edwinvakayil](https://buymeacoffee.com/edwinvakayil)

## Install Components

Add a component from the scoped registry:

```bash
npx shadcn@latest add @iconiq/button
```

You can also install from a registry URL:

```bash
npx shadcn@latest add https://iconiqui.com/r/button.json
```

After installation, use the generated component in your app:

```tsx
import { Button } from "@/components/ui/button";

export function Example() {
  return <Button>Continue</Button>;
}
```

## What This Repository Contains

### `registry/`

Installable component source files published through the Iconiq registry.

### `app/components/`

Documentation pages for each component, including live playgrounds, install commands, usage snippets, and API details.

### `components/`

Shared site UI, documentation primitives, layout building blocks, and reusable interface parts used across the app.

### `scripts/`

Registry build and maintenance scripts used to generate the published payloads.

### `public/r/`

Generated registry JSON files consumed by the shadcn CLI.

## Local Development

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Build the app:

```bash
pnpm build
```

Run the primary checks:

```bash
pnpm lint:check
pnpm exec tsc --noEmit --pretty false
```

## Registry Workflow

Rebuild the published registry payloads after changing files under `registry/`:

```bash
pnpm build-registry
```

This updates the generated files under `public/r/` and refreshes the registry index used by the site and the CLI install flow.

## Adding or Updating a Component

1. Add or update the source file in `registry/`
2. Add or update the matching docs page in `app/components/`
3. Document the actual props and behavior in the API details
4. Rebuild the registry with `pnpm build-registry`

## Contributing

Contributions are welcome.

Useful contributions include:

- new registry-ready components
- API improvements to existing components
- docs corrections and live preview improvements
- tooling improvements for the registry workflow

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the current contribution flow.

## Tech Stack

- Next.js App Router
- React 19
- Tailwind CSS v4
- Motion
- Radix UI primitives
- Lucide icons

