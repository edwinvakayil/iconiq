"use client";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { avatarApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/registry/avatar";

const usageCode = `import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";

export function AvatarDemo() {
  return (
    <div className="flex items-center gap-10">
      <Avatar size="lg" tooltip="online">
        <AvatarImage src="/assets/shadcn.jpg" alt="shadcn/ui" />
        <AvatarFallback>SU</AvatarFallback>
        <AvatarBadge />
      </Avatar>

      <AvatarGroup>
        <Avatar size="lg">
          <AvatarImage src="/assets/av1.png" alt="Avatar 1" />
          <AvatarFallback>A1</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage src="/assets/av3.png" alt="Avatar 3" />
          <AvatarFallback>A3</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage src="/assets/av2.png" alt="Avatar 2" />
          <AvatarFallback>A2</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    </div>
  );
}`;

function AvatarPreview() {
  return (
    <div className="flex min-h-[18rem] items-center justify-center gap-10 p-6">
      <Avatar size="lg" tooltip="online">
        <AvatarImage alt="shadcn/ui" src="/assets/shadcn.jpg" />
        <AvatarFallback>SU</AvatarFallback>
        <AvatarBadge />
      </Avatar>

      <AvatarGroup>
        <Avatar size="lg">
          <AvatarImage alt="Avatar 1" src="/assets/av1.png" />
          <AvatarFallback>A1</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage alt="Avatar 3" src="/assets/av3.png" />
          <AvatarFallback>A3</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage alt="Avatar 2" src="/assets/av2.png" />
          <AvatarFallback>A2</AvatarFallback>
        </Avatar>
      </AvatarGroup>
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
      description="Avatars with fallbacks, status badges, and grouped stacks."
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
