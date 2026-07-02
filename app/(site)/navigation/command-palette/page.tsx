"use client";

import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import {
  CommandPalettePlaygroundProvider,
  getCommandPaletteDefaultUsageCode,
} from "@/app/(site)/navigation/command-palette/_components/command-palette-playground";
import { commandPaletteApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";

const IMPORT_PATH = "@/components/ui/command-palette";

function handleProviderSelect() {
  return undefined;
}

export default function CommandPalettePage() {
  return (
    <CommandPalettePlaygroundProvider>
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Navigation" },
            { label: "Command Palette" },
          ]}
          componentName="command-palette"
          description="Keyboard-first command menu for pages, actions, and theme switching."
          details={commandPaletteApiDetails}
          detailsDescription="CommandPalette groups searchable items, supports custom triggers, ranked substring search, recent commands, async callbacks, and optional theme actions through Radix Dialog."
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/navigation/command-palette/page.tsx`}
          headerActions={
            <ProviderSwitch
              disabledProviders={["base"]}
              onSelect={handleProviderSelect}
              selectedProvider="radix"
            />
          }
          itemSlug="command-palette"
          pageUrl="/navigation/command-palette"
          preview={preview}
          previewClassName="min-h-[280px]"
          previewDescription="Use the playground to try theme and recent groups, action items, async search, footer hints, custom triggers, and the global shortcut."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Command Palette"
          railNotes={[
            "Pass grouped items with label, href or action, keywords, shortcut, and disabled state.",
            "Use onNavigate when you need custom routing instead of the built-in Next.js router.",
            "Set showThemeGroup={false} when theme switching is not needed to avoid requiring next-themes.",
          ]}
          title="Command Palette"
          usageCode={getCommandPaletteDefaultUsageCode(IMPORT_PATH)}
          usageDescription="Pass grouped items with labels, optional href or action, and any optional fields you need (icon, keywords, shortcut, description). Opt into showThemeGroup or showRecentGroup when needed. Use trigger or triggerProps for the open control."
          v0PageCode={getCommandPaletteDefaultUsageCode(IMPORT_PATH)}
        />
      )}
    </CommandPalettePlaygroundProvider>
  );
}
