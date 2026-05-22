# iconiqui.com

shadcn/ui primitives you own, Subtle motion animations you feel—paste a component, tune the tokens, and ship without the boilerplate hunt.

![hero](public/og.png)

## Documentation

Visit https://iconiqui.com/installation to view the documentation. 

To access MCP server Visit https://iconiqui.com/mcp .

## Agent skill

Give Cursor and other agents Iconiq-specific guidance via the [Agent Skills](https://agentskills.io) CLI. **Run these once per machine** (or when you need to refresh the installed copy)—not as a daily step.

### Install (recommended)

Fetches `SKILL.md` over HTTP from iconiqui.com. No git clone. Writes `skills-lock.json` and copies the skill to `.agents/skills/iconiq/`:

```bash
npx skills add https://iconiqui.com --skill iconiq
```

Shortcut from this repo:

```bash
pnpm skills:install
```

### Working in this repository

If you already cloned iconiq, the source of truth is `skills/iconiq/SKILL.md`. You usually **do not** need an install command for day-to-day development.

To sync the CLI copy into `.agents/skills/iconiq/` from the local file:

```bash
pnpm skills:install:local
```

### Restore from lock file

If `skills-lock.json` already exists (from a previous `skills add`) and `.agents/skills/` was removed, reinstall without fetching again:

```bash
npx skills experimental_install
```

`skills-lock.json` and `.agents/` are gitignored—they stay on your machine only.

### GitHub install (optional)

```bash
npx skills add https://github.com/edwinvakayil/iconiq --skill iconiq
```

This **always clones the repository**. Prefer the iconiqui.com command above. Use the GitHub URL only if you want installs counted toward [skills.sh](https://skills.sh/edwinvakayil/iconiq) stats.

### skills.sh listing

The skill file for the directory is **`skills/iconiq/SKILL.md` only**. Do not commit `.agents/` or `skills-lock.json`—they break indexing and show “No SKILL.md available” on [skills.sh](https://skills.sh/edwinvakayil/iconiq/iconiq).

After pushing fixes, trigger a fresh snapshot:

```bash
npx skills add https://github.com/edwinvakayil/iconiq --skill iconiq -y
```

The skills.sh page can take time to refresh after that install.

## Contributing

Please read the [contributing guide](/CONTRIBUTING.md).

## License

Licensed under the [MIT license](./LICENSE).

[![skills.sh](https://skills.sh/b/edwinvakayil/iconiq)](https://skills.sh/edwinvakayil/iconiq/iconiq)