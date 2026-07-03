"use client";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import {
  type DrawerModule,
  DrawerPlaygroundProvider,
  getDrawerDefaultUsageCode,
} from "@/app/(site)/overlay-and-popups/drawer/_components/drawer-playground";
import { drawerApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as DrawerUI from "@/registry/drawer";

const IMPORT_PATH = "@/components/ui/drawer";

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Overlay & Popups" },
  { label: "Drawer" },
];

function getDetails(): DetailItem[] {
  return drawerApiDetails.map((item) => {
    if (item.id !== "registry") {
      return item;
    }

    return {
      ...item,
      notes: [
        "Dependencies: vaul, lucide-react.",
        "This page documents the Vaul install only. The Base UI and Radix UI provider options are visible for section consistency but disabled because this drawer is not a primitive-specific wrapper.",
        "The generated registry file is /r/drawer.json.",
      ],
      registryPath: "drawer.json",
    };
  });
}

export default function DrawerPage() {
  const details = getDetails();
  const usageCode = getDrawerDefaultUsageCode(IMPORT_PATH);

  return (
    <DrawerPlaygroundProvider
      importPath={IMPORT_PATH}
      ui={DrawerUI as DrawerModule}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName="drawer"
          description="Reveal focused controls or details without leaving the page."
          details={details}
          detailsDescription="Compound parts cover direction-aware placement, drag gestures, optional close button, scrollable DrawerBody, styled footer actions, and safe-area-aware panel geometry."
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/overlay-and-popups/drawer/page.tsx`}
          headerActions={<SharedPrimitiveProviderSwitch />}
          itemSlug="drawer"
          pageUrl="/overlay-and-popups/drawer"
          preInstallationSections={[
            {
              id: "credits",
              title: "Credits",
              content: (
                <p className="max-w-3xl text-[14px] text-secondary leading-6">
                  Drawer is built on top of{" "}
                  <a
                    className="font-medium text-foreground underline underline-offset-4"
                    href="https://github.com/emilkowalski/vaul"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Vaul
                  </a>{" "}
                  by{" "}
                  <a
                    className="font-medium text-foreground underline underline-offset-4"
                    href="https://twitter.com/emilkowalski"
                    rel="noreferrer"
                    target="_blank"
                  >
                    emilkowalski
                  </a>
                  .
                </p>
              ),
            },
          ]}
          preview={preview}
          previewClassName="min-h-[18rem]"
          previewDescription="Use the playground to switch direction, action tone, controlled state, dismissible behavior, close button visibility, scrollable body, and async footer actions."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Drawer"
          railNotes={[
            "Use DrawerTrigger asChild when the trigger is already a design-system button or inline control.",
            "Use DrawerBody for long forms so the header and footer stay visible while the middle section scrolls.",
          ]}
          title="Drawer"
          usageCode={usageCode}
          usageContent={
            <div className="max-w-3xl">
              <h3 className="font-medium text-[15px] text-foreground tracking-[-0.02em]">
                Responsive dialog pattern
              </h3>
              <p className="mt-2 text-[14px] text-secondary leading-6">
                For desktop-first flows, pair this drawer with a dialog: render{" "}
                <code className="text-foreground">Dialog</code> from{" "}
                <code className="text-foreground">md:</code> breakpoints upward
                and keep <code className="text-foreground">Drawer</code> for
                mobile. Use the playground direction controls to preview bottom,
                top, left, and right placements before wiring your responsive
                breakpoint switch.
              </p>
            </div>
          }
          usageDescription="This Vaul install exposes compound drawer parts with direction-aware layout, drag gestures, styled footer actions, optional close button, and safe-area-aware panel sizing."
          v0PageCode={usageCode}
        />
      )}
    </DrawerPlaygroundProvider>
  );
}
