<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Iconiq documentation site. PostHog is initialized via `instrumentation-client.ts` (the recommended Next.js 15.3+ approach) with a reverse proxy through `/ingest` to improve ad-blocker resilience. A `skipTrailingSlashRedirect` flag and three rewrite rules were added to `next.config.ts`. Environment variables are stored in `.env.local`. Ten distinct events are now captured across seven files, covering the most valuable user interactions: copying docs/components, opening components in v0, searching, installing components, switching package managers, and visiting the sponsorship page.

| Event | Description | File |
|-------|-------------|------|
| `copy_page_content` | User copies a docs page to clipboard | `components/docs/docs-copy-actions.tsx` |
| `copy_page_content` | User copies a component page to clipboard | `components/docs/page-copy-actions.tsx` |
| `open_in_v0_clicked` | User opens a component in Vercel's v0 editor | `components/docs/open-in-v0-button.tsx` |
| `search_opened` | User opens the search/command menu | `components/command-menu.tsx` |
| `search_item_selected` | User selects a result from the search menu | `components/command-menu.tsx` |
| `install_command_copied` | User copies an install command (includes `package_manager` property) | `components/install-command-terminal.tsx` |
| `package_manager_changed` | User switches their active package manager | `components/package-manager-switcher.tsx` |
| `sponsorship_page_viewed` | User views the sponsorship page | `app/(site)/sponsorship/page.tsx` |
| `ask_chatgpt_clicked` | User clicks "Ask ChatGPT" from the docs copy actions menu | `components/docs/docs-copy-actions.tsx`, `components/docs/page-copy-actions.tsx` |
| `view_registry_json_clicked` | User clicks "View registry JSON" from the component page menu | `components/docs/page-copy-actions.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1620760)
- [Key Engagement Actions](/insights/FwwMxvKM) — Daily trend of copy, install, v0, and search actions
- [Sponsorship Page Views](/insights/340b8Hdn) — Total views and unique visitors to the sponsorship page
- [Install Commands by Package Manager](/insights/6W79MUPZ) — Bar chart breakdown by `pnpm`, `npm`, `yarn`, `bun`
- [Search → Item Selected Funnel](/insights/GJ2dMT8a) — Conversion rate from opening search to clicking a result
- [AI Engagement Actions](/insights/z4GsR9XW) — Trend of ChatGPT and registry JSON clicks

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
