# Contributing

Thanks for contributing to Iconiq.

## Focus

This codebase now centers on motion-powered React components and the docs that support them. Good contributions include:

- New registry-ready components
- Improvements to existing component APIs
- Docs fixes, API corrections, and live preview improvements
- Registry/build tooling updates

## Local workflow

```bash
pnpm install
pnpm dev
```

Run checks before opening a PR:

```bash
pnpm lint:check
pnpm build
```

If you change registry component source files under [`registry`](/Users/edwinvs/Desktop/icons/registry), rebuild the registry payloads:

```bash
pnpm build-registry
```

## Component contributions

- Add or update the source file in [`registry`](/Users/edwinvs/Desktop/icons/registry)
- Add or update the matching docs page under [`app/components`](/Users/edwinvs/Desktop/icons/app/components)
- Document real props and behavior in the docs page
- Keep styles aligned with the existing white-first, minimal docs UI

## Pull requests

- Keep changes scoped
- Include screenshots or a short walkthrough for UI changes when helpful
- Avoid unrelated refactors unless they directly support the feature or fix
