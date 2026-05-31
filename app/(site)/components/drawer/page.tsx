"use client";

import { useEffect, useState } from "react";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { drawerApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/@v-drawer";
import { Badge } from "@/registry/badge";
import { Checkbox } from "@/registry/checkbox";

const usageCode = `"use client";

import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/@v-drawer";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const reviewTasks = [
  { id: "registry", label: "Build @v-drawer registry payload", defaultChecked: true },
  { id: "preview", label: "Review docs preview state", defaultChecked: true },
  { id: "install", label: "Check shadcn install command", defaultChecked: false },
] as const;

export function DrawerPreview() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const syncViewport = () => setIsMobile(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => {
      mediaQuery.removeEventListener("change", syncViewport);
    };
  }, []);

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <button
          className="inline-flex items-center justify-center rounded-lg bg-foreground px-4.5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          type="button"
        >
          Open drawer
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="pb-7">
          <DrawerTitle>Iconiq registry</DrawerTitle>
          <DrawerDescription>
            Prepare the drawer example for the component docs.
          </DrawerDescription>
        </DrawerHeader>
        <div className="min-h-0 overflow-y-auto px-4 pb-4">
          <div className="flex items-start justify-between gap-4 border-border border-b pb-5">
            <div>
              <h3 className="font-medium text-[20px] text-foreground tracking-[-0.03em]">
                @v-drawer preview
              </h3>
            </div>
            <Badge color="gray" size="sm">
              Iconiq
            </Badge>
          </div>

          <div className="py-5">
            <p className="font-medium text-[14px] text-foreground">
              Registry checklist
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Keep the install payload and docs preview aligned.
            </p>
            <div className="mt-3">
              {reviewTasks.map((task) => (
                <Checkbox
                  className="w-full border-border border-b py-3 last:border-b-0 [&>span:last-child]:text-[13px]"
                  defaultChecked={task.defaultChecked}
                  id={\`drawer-\${task.id}\`}
                  key={task.id}
                  label={task.label}
                />
              ))}
            </div>
          </div>
        </div>
        <DrawerFooter className="border-t border-border">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DrawerClose asChild>
              <button
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                type="button"
              >
                Close
              </button>
            </DrawerClose>
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-foreground bg-foreground px-4 text-[13px] font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              type="button"
            >
              Update docs
            </button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}`;

const reviewTasks = [
  {
    id: "registry",
    label: "Build @v-drawer registry payload",
    defaultChecked: true,
  },
  { id: "preview", label: "Review docs preview state", defaultChecked: true },
  {
    id: "install",
    label: "Check shadcn install command",
    defaultChecked: false,
  },
] as const;

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Components" },
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
        "Dependencies: vaul.",
        "This page documents the Vaul install only. The Base UI and Radix UI provider options are visible for section consistency but disabled because this drawer is not a primitive-specific wrapper.",
        "The generated registry file is /r/@v-drawer.json.",
      ],
      registryPath: "@v-drawer.json",
    };
  });
}

function DrawerPreview() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const syncViewport = () => setIsMobile(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => {
      mediaQuery.removeEventListener("change", syncViewport);
    };
  }, []);

  return (
    <div className="flex min-h-[280px] w-full items-center justify-center px-4 py-10">
      <Drawer direction={isMobile ? "bottom" : "right"}>
        <DrawerTrigger asChild>
          <button
            className="inline-flex items-center justify-center rounded-lg bg-foreground px-5 py-3 font-medium text-[13px] text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            type="button"
          >
            Open drawer
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="pb-7">
            <DrawerTitle>Iconiq registry</DrawerTitle>
            <DrawerDescription>
              Prepare the drawer example for the component docs.
            </DrawerDescription>
          </DrawerHeader>
          <div className="min-h-0 overflow-y-auto px-4 pb-4">
            <div className="flex items-start justify-between gap-4 border-border border-b pb-5">
              <div>
                <h3 className="font-medium text-[20px] text-foreground tracking-[-0.03em]">
                  @v-drawer preview
                </h3>
              </div>
              <Badge color="gray" size="sm">
                Iconiq
              </Badge>
            </div>

            <div className="py-5">
              <p className="font-medium text-[14px] text-foreground">
                Registry checklist
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Keep the install payload and docs preview aligned.
              </p>
              <div className="mt-3">
                {reviewTasks.map((task) => (
                  <Checkbox
                    className="w-full border-border border-b py-3 last:border-b-0 [&>span:last-child]:text-[13px]"
                    defaultChecked={task.defaultChecked}
                    id={`drawer-${task.id}`}
                    key={task.id}
                    label={task.label}
                  />
                ))}
              </div>
            </div>
          </div>
          <DrawerFooter className="border-border border-t">
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <DrawerClose asChild>
                <button
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background px-4 font-medium text-[13px] text-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  type="button"
                >
                  Close
                </button>
              </DrawerClose>
              <button
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-foreground bg-foreground px-4 font-medium text-[13px] text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                type="button"
              >
                Update docs
              </button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default function RadixBaseDrawerPage() {
  const details = getDetails();

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="@v-drawer"
      description="Reveal focused controls or details without leaving the page."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/drawer/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      itemSlug="drawer"
      pageUrl="/components/drawer"
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
      preview={<DrawerPreview />}
      title="Drawer"
      usageCode={usageCode}
      usageDescription="This Vaul install exposes the familiar compound drawer parts, side-aware placement, drag gestures, a soft overlay fade, and a tuned slide curve for fluid open and close motion."
      v0PageCode={usageCode}
    />
  );
}
