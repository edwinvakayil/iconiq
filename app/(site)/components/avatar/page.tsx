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

const previewSentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100";

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
    <div className="flex min-h-[18rem] items-center justify-center p-6">
      <p className={previewSentenceClassName}>
        <span>Assigned to</span>
        <span className="inline-flex translate-y-px align-middle">
          <Avatar size="default" tooltip="online">
            <AvatarImage alt="shadcn/ui" src="/assets/shadcn.jpg" />
            <AvatarFallback>SU</AvatarFallback>
            <AvatarBadge />
          </Avatar>
        </span>
        <span>and reviewed by</span>
        <span className="inline-flex translate-y-px align-middle">
          <AvatarGroup>
            <Avatar size="default">
              <AvatarImage alt="Avatar 1" src="/assets/av1.png" />
              <AvatarFallback>A1</AvatarFallback>
            </Avatar>
            <Avatar size="default">
              <AvatarImage alt="Avatar 3" src="/assets/av3.png" />
              <AvatarFallback>A3</AvatarFallback>
            </Avatar>
            <Avatar size="default">
              <AvatarImage alt="Avatar 2" src="/assets/av2.png" />
              <AvatarFallback>A2</AvatarFallback>
            </Avatar>
          </AvatarGroup>
        </span>
        <span>on this release.</span>
      </p>
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
      previewDescription="See a single avatar with a badge and a stacked group inline in one sentence."
      title="Avatar"
      usageCode={usageCode}
      usageDescription="Use the compound parts to compose an avatar image, fallback initials, and status badge. Add tooltip to Avatar when the whole avatar should reveal a short status hint."
      v0PageCode={usageCode}
    />
  );
}
