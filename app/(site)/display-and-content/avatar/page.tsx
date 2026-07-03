"use client";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { AvatarPlaygroundProvider } from "@/app/(site)/display-and-content/avatar/_components/avatar-playground";
import { avatarApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as AvatarModule from "@/registry/avatar";

const usageCode = `import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";

export function AvatarDemo() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <Avatar aria-label="shadcn/ui, online" tooltip="Online now">
        <AvatarImage src="/assets/shadcn.jpg" alt="shadcn/ui" />
        <AvatarFallback>SU</AvatarFallback>
        <AvatarBadge variant="online" />
      </Avatar>

      <AvatarGroup>
        <Avatar size="default">
          <AvatarImage src="/assets/av1.png" alt="Avatar 1" />
          <AvatarFallback>A1</AvatarFallback>
        </Avatar>
        <Avatar size="default">
          <AvatarImage src="/assets/av3.png" alt="Avatar 3" />
          <AvatarFallback>A3</AvatarFallback>
        </Avatar>
        <Avatar size="default">
          <AvatarImage src="/assets/av2.png" alt="Avatar 2" />
          <AvatarFallback>A2</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    </div>
  );
}`;

const avatarExamples: VariantItem[] = [
  {
    title: "Sizes",
    code: `import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export function AvatarSizes() {
  return (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarImage src="/assets/shadcn.jpg" alt="shadcn/ui" />
        <AvatarFallback>SU</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="/assets/shadcn.jpg" alt="shadcn/ui" />
        <AvatarFallback>SU</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="/assets/shadcn.jpg" alt="shadcn/ui" />
        <AvatarFallback>SU</AvatarFallback>
      </Avatar>
    </div>
  );
}`,
  },
  {
    title: "Badge variants",
    code: `import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export function AvatarBadgeVariants() {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="/assets/shadcn.jpg" alt="shadcn/ui" />
        <AvatarFallback>SU</AvatarFallback>
        <AvatarBadge variant="online" />
      </Avatar>
      <Avatar>
        <AvatarImage src="/assets/av1.png" alt="Avatar 1" />
        <AvatarFallback>A1</AvatarFallback>
        <AvatarBadge variant="busy" />
      </Avatar>
      <Avatar>
        <AvatarImage src="/assets/av2.png" alt="Avatar 2" />
        <AvatarFallback>A2</AvatarFallback>
        <AvatarBadge variant="away" />
      </Avatar>
      <Avatar>
        <AvatarImage src="/assets/av3.png" alt="Avatar 3" />
        <AvatarFallback>A3</AvatarFallback>
        <AvatarBadge variant="offline" />
      </Avatar>
    </div>
  );
}`,
  },
  {
    title: "Auto initials",
    code: `import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export function AvatarAutoInitials() {
  return (
    <Avatar name="Jordan Lee">
      <AvatarImage src="/assets/missing.png" alt="Jordan Lee" />
      <AvatarFallback />
    </Avatar>
  );
}`,
  },
  {
    title: "Dropdown trigger",
    code: `"use client";

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/r-dropdown";

export function AvatarDropdown() {
  return (
    <Dropdown variant="action">
      <DropdownTrigger
        aria-label="Open account menu"
        className="h-11 w-11 overflow-hidden rounded-full border-border/80 p-0 shadow-none"
        showChevron={false}
        triggerShape="avatar"
      >
        <img
          alt=""
          className="h-full w-full object-cover"
          src="/assets/shadcn.jpg"
        />
        <span className="sr-only">Open account menu</span>
      </DropdownTrigger>
      <DropdownContent align="end">
        <DropdownItem>Profile</DropdownItem>
        <DropdownItem>Settings</DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}`,
  },
];

export default function AvatarPage() {
  return (
    <AvatarPlaygroundProvider
      AvatarModule={AvatarModule}
      importPath="@/components/ui/avatar"
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Display & Content" },
            { label: "Avatar" },
          ]}
          componentName="avatar"
          description="Avatars with fallbacks, status badges, grouped stacks, and optional tooltips."
          details={avatarApiDetails}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/avatar/page.tsx`}
          examples={avatarExamples}
          headerActions={<SharedPrimitiveProviderSwitch />}
          itemSlug="avatar"
          pageUrl="/display-and-content/avatar"
          preview={preview}
          previewClassName="min-h-[18rem] overflow-visible"
          previewDescription="Use the playground to switch patterns, sizes, badge variants, and tooltip targets."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Avatar"
          railNotes={[
            "Put tooltip on Avatar when the whole avatar should expose the status hint.",
            "Put tooltip on AvatarBadge when only the status dot should be the trigger.",
            "Pass name on Avatar to auto-generate AvatarFallback initials when children are omitted.",
            "Use variant on AvatarBadge for online, offline, busy, and away states.",
          ]}
          title="Avatar"
          usageCode={usageCode}
          usageDescription="Compose AvatarImage, AvatarFallback, and an optional AvatarBadge inside the root. AvatarGroup stacks overlapping avatars and AvatarGroupCount shows overflow."
          v0PageCode={usageCode}
        />
      )}
    </AvatarPlaygroundProvider>
  );
}
