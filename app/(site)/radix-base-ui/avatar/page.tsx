"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/radix-base-ui/_components/provider-switch";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseAvatar from "@/registry/b-avatar";
import * as RadixAvatar from "@/registry/r-avatar";

type AvatarModule = typeof BaseAvatar;

type ProviderConfig = {
  componentName: "b-avatar" | "r-avatar";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  ui: AvatarModule;
  usageCode: string;
};

type DemoProfile = {
  fallback: string;
  label: string;
  meta: string;
  name: string;
  src?: string;
};

const demoImageSrc = "/assets/shadcn.jpg";

const demoProfiles: DemoProfile[] = [
  {
    fallback: "SU",
    label: "shadcn/ui",
    meta: "Image crossfades in",
    name: "shadcn/ui",
    src: demoImageSrc,
  },
  {
    fallback: "EV",
    label: "Edwin Vakayil",
    meta: "Fallback-only state",
    name: "Edwin Vakayil",
  },
  {
    fallback: "AI",
    label: "Automation",
    meta: "Immediate initials",
    name: "Automation",
  },
];

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Components" },
  { label: "Avatar" },
];

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-avatar": `import { Avatar } from "@/components/ui/b-avatar";

const members = [
  {
    name: "shadcn/ui",
    fallback: "SU",
    src: "/assets/shadcn.jpg",
  },
  {
    name: "Edwin Vakayil",
    fallback: "EV",
  },
  {
    name: "Automation",
    fallback: "AI",
  },
];

export function TeamAvatars() {
  return (
    <div className="flex items-center gap-3">
      {members.map((member) => (
        <Avatar
          alt={member.name}
          fallback={member.fallback}
          key={member.name}
          name={member.name}
          src={member.src}
        />
      ))}
    </div>
  );
}`,
  "r-avatar": `import { Avatar } from "@/components/ui/r-avatar";

const members = [
  {
    name: "shadcn/ui",
    fallback: "SU",
    src: "/assets/shadcn.jpg",
  },
  {
    name: "Edwin Vakayil",
    fallback: "EV",
  },
  {
    name: "Automation",
    fallback: "AI",
  },
];

export function TeamAvatars() {
  return (
    <div className="flex items-center gap-3">
      {members.map((member) => (
        <Avatar
          alt={member.name}
          fallback={member.fallback}
          key={member.name}
          name={member.name}
          src={member.src}
        />
      ))}
    </div>
  );
}`,
};

function AvatarPreview({ ui }: { ui: AvatarModule }) {
  const { Avatar } = ui;

  return (
    <div className="flex min-h-[18rem] items-center justify-center p-6">
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
        {demoProfiles.map((profile, index) => (
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex min-w-[7.5rem] flex-col items-center gap-3 text-center"
            initial={{ opacity: 0, y: 8, scale: 0.985 }}
            key={profile.label}
            transition={{
              delay: index * 0.06,
              duration: 0.22,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Avatar
              alt={profile.label}
              fallback={profile.fallback}
              name={profile.name}
              src={profile.src}
            />
            <div className="space-y-1">
              <p className="font-medium text-[13px] text-foreground leading-none">
                {profile.label}
              </p>
              <p className="text-[12px] text-muted-foreground leading-none">
                {profile.meta}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function RadixBaseAvatarPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-avatar",
        dependencyLabel: "@base-ui/react, motion",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI avatar with the same single Avatar export used by the Radix version.",
          "Base UI handles image loading state under the hood while the visible frame, fallback, and crossfade stay motion-polished.",
          "The generated registry file is /r/b-avatar.json.",
        ],
        ui: BaseAvatar,
        usageCode: usageCodeByProvider["b-avatar"],
      };
    }

    return {
      componentName: "r-avatar",
      dependencyLabel: "@radix-ui/react-avatar, motion",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix avatar with the same single Avatar export used by the Base UI version.",
        "Radix drives the image-loading semantics while Motion handles the mount, fallback, and image reveal transitions.",
        "The generated registry file is /r/r-avatar.json.",
      ],
      ui: RadixAvatar,
      usageCode: usageCodeByProvider["r-avatar"],
    };
  }, [selectedProvider]);

  const details = useMemo<DetailItem[]>(
    () => [
      {
        id: "avatar",
        title: "Avatar",
        summary:
          "Provider-switchable avatar surface with the same single Avatar export on top of Base UI and Radix UI primitives.",
        fields: [
          {
            name: "src",
            type: "string",
            description:
              "Image URL rendered into the underlying avatar image primitive. When it loads successfully, the image eases over the fallback initials.",
          },
          {
            name: "fallback",
            type: "string",
            defaultValue: '"?"',
            description:
              "Optional source text for fallback initials. The component trims and condenses this into a short 1 to 2 character label.",
          },
          {
            name: "name",
            type: "string",
            description:
              "Optional display name used to derive fallback initials and a more descriptive image alt value when alt is not provided.",
          },
          {
            name: "alt",
            type: "string",
            description:
              "Optional image alt text. Pass an empty string for decorative use, or omit it to fall back to the name prop and then a generic Avatar label.",
          },
          {
            name: "loading",
            type: '"eager" | "lazy"',
            defaultValue: '"eager"',
            description:
              "Controls the image loading strategy for the underlying img element.",
          },
          {
            name: "className",
            type: "string",
            description:
              "Merged onto the outer motion wrapper. The default frame targets 44 by 44 pixels, but width and height utilities can override that size.",
          },
          {
            name: "reducedMotion",
            type: "boolean",
            description:
              "Turns the avatar onto its quieter motion path immediately while still respecting system-level reduced motion preferences.",
          },
        ],
        notes: [
          `Current install target: ${provider.libraryLabel}.`,
          `Dependencies declared by this registry entry: ${provider.dependencyLabel}.`,
          ...provider.notes,
        ],
      },
      {
        id: "motion-behavior",
        title: "Image and motion behavior",
        summary:
          "Both provider-backed installs keep the same visible sequence: immediate fallback initials, subtle frame entry, then a quiet image reveal once loading completes.",
        notes: [
          "Fallback initials render right away, so identity is visible while a remote image loads or if it fails.",
          "The image path uses a short opacity and scale reveal rather than a heavy blur or mask animation, which keeps the motion calm for a high-frequency UI primitive.",
          "The visible API stays the same while the underlying headless avatar primitive switches between Radix UI and Base UI.",
        ],
      },
    ],
    [provider]
  );

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName={provider.componentName}
      description="Compare the same avatar API on Radix UI and Base UI."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/radix-base-ui/avatar/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="avatar"
      pageUrl="/radix-base-ui/avatar"
      preview={<AvatarPreview ui={provider.ui} />}
      title="Avatar"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
