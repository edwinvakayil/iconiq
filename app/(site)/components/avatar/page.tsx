"use client";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { avatarApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/registry/avatar";

const usageCode = `import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export function AvatarDemo() {
  return (
    <Avatar size="lg" tooltip="online">
      <AvatarImage src="/assets/shadcn.jpg" alt="shadcn/ui" />
      <AvatarFallback>SU</AvatarFallback>
      <AvatarBadge />
    </Avatar>
  );
}`;

function AvatarPreview() {
  return (
    <div className="flex min-h-[18rem] items-center justify-center p-6">
      <Avatar size="lg" tooltip="online">
        <AvatarImage alt="shadcn/ui" src="/assets/shadcn.jpg" />
        <AvatarFallback>SU</AvatarFallback>
        <AvatarBadge />
      </Avatar>
    </div>
  );
}

export default function AvatarPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Avatar" },
      ]}
      componentName="avatar"
      description="Composable profile images with fallbacks, tooltip-ready status badges, and grouped stacks."
      details={avatarApiDetails}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/avatar/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/components/avatar"
      preview={<AvatarPreview />}
      title="Avatar"
      usageCode={usageCode}
      usageDescription="Use the compound parts to compose an avatar image, fallback initials, and status badge. Add tooltip to Avatar when the whole avatar should reveal a short status hint."
      v0PageCode={usageCode}
    />
  );
}
