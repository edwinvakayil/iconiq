"use client";

import { motion, type Variants } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

import { avatarApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { cn } from "@/lib/utils";
import { avatar as Avatar } from "@/registry/avatar";

const DEMO_IMAGE_SRC = "https://avatars.githubusercontent.com/u/180170746?v=4";

const PREVIEW_ACCOUNT_HREF =
  "https://avatars.githubusercontent.com/u/180170746?v=4";

const usageCode = `import { avatar as Avatar } from "@/components/ui/avatar";

export function ProfileChip() {
  return (
    <a
      className="inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      href="https://avatars.githubusercontent.com/u/180170746?v=4"
      rel="noopener noreferrer"
      target="_blank"
    >
      <Avatar src="https://avatars.githubusercontent.com/u/180170746?v=4" />
    </a>
  );
}`;

const componentDetailsItems = avatarApiDetails;

function _SectionLabel({
  children,
  accent,
}: {
  children: ReactNode;
  accent?: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      {accent ? (
        <span
          aria-hidden
          className="font-mono text-[10px] text-neutral-300 tabular-nums dark:text-neutral-600"
        >
          {accent}
        </span>
      ) : null}
      <p className="font-medium text-[10px] text-neutral-400 uppercase tracking-[0.18em] dark:text-neutral-500">
        {children}
      </p>
      <span className="h-px min-w-6 flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-700" />
    </div>
  );
}

const bentoShell =
  "flex flex-col rounded-2xl border border-neutral-200/80 bg-white px-3 py-4 sm:px-5 sm:py-5 md:p-6 dark:border-neutral-800 dark:bg-neutral-950";

const _bentoContainer = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.06, staggerChildren: 0.07 },
  },
};

const _bentoItem = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 28 },
  },
};

const _bentoContainerStatic = {
  hidden: {},
  visible: { transition: { delayChildren: 0, staggerChildren: 0 } },
};

const _bentoItemStatic = {
  hidden: { opacity: 1, scale: 1, y: 0 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

function _BentoMotion({
  children,
  className,
  variants,
}: {
  children: ReactNode;
  className?: string;
  variants: Variants;
}) {
  return (
    <motion.div className={cn(bentoShell, className)} variants={variants}>
      {children}
    </motion.div>
  );
}

function AvatarPreview() {
  return (
    <div className="flex flex-col items-center gap-6 px-2 py-4">
      <Link
        className="inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        href={PREVIEW_ACCOUNT_HREF}
        rel="noopener noreferrer"
        target="_blank"
      >
        <Avatar src={DEMO_IMAGE_SRC} />
      </Link>
      <p className="max-w-md text-center font-sans text-[13px] leading-relaxed">
        <span className="text-emerald-600 dark:text-emerald-400">
          Spring in
        </span>
        <span className="text-neutral-400 dark:text-neutral-500"> · </span>
        <span className="text-sky-600 dark:text-sky-400">
          Hover lifts the ring
        </span>
        <span className="text-neutral-400 dark:text-neutral-500"> · </span>
        <span className="text-violet-600 dark:text-violet-400">
          Image fades to fit
        </span>
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
      description="Compact circular avatar with motion on enter, hover, and tap. Shows an image or fallback text at a fixed 42 x 42 size."
      details={componentDetailsItems}
      detailsDescription="Expand each row for prop behavior, motion behavior, and the implementation details that affect usage."
      preview={
        <div className="flex min-h-[320px] items-center justify-center">
          <AvatarPreview />
        </div>
      }
      title="Avatar"
      usageCode={usageCode}
      usageDescription="Alias `avatar` to `Avatar` in JSX so the component reads naturally inside forms, menus, or team lists."
    />
  );
}
