"use client";

import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";

import { CodeBlock } from "@/components/code-block";
import { CodeBlockInstall } from "@/components/code-block-install";
import { ComponentActions } from "@/components/component-actions";
import { RegistryInstallBlock } from "@/components/registry-install-block";
import { cn } from "@/lib/utils";
import { switch as Switch } from "@/registry/switch";

const usageCode = `import { switch as Switch } from "@/components/ui/switch";
import { useState } from "react";

export function PressingToggle() {
  const [on, setOn] = useState(true);
  return (
    <div className="flex items-center justify-between gap-4 max-w-xs">
      <span className="text-sm text-muted-foreground">High press</span>
      <Switch size="lg" checked={on} onCheckedChange={setOn} />
    </div>
  );
}`;

type DetailRow = {
  id: string;
  title: string;
  content: string;
  registryPath?: string;
};

const componentDetailsItems: DetailRow[] = [
  {
    id: "checked",
    title: "checked (optional)",
    content:
      "Boolean on/off state. Omit for an uncontrolled switch; pair with onCheckedChange for controlled usage.",
  },
  {
    id: "onCheckedChange",
    title: "onCheckedChange (optional)",
    content:
      "Called with the next boolean when the user toggles. Use with checked for full control.",
  },
  {
    id: "disabled",
    title: "disabled (optional)",
    content:
      "Disables the button, dims the control, and prevents toggling. Native disabled semantics apply.",
  },
  {
    id: "size",
    title: "size (optional)",
    content:
      "Visual scale: sm (42×22 track), md (52×30, default), lg (64×36). Thumb travel and padding scale with each preset.",
  },
  {
    id: "className",
    title: "className (optional)",
    content:
      "Merged onto the root button with cn(). Use for width constraints or alignment in forms.",
  },
  {
    id: "framer-motion",
    title: "framer-motion",
    content:
      "Animates track backgroundColor and thumb x with a spring for the knob and an ease curve for the track.",
  },
  {
    id: "a11y",
    title: "Accessibility",
    content:
      'Root is a native button with role="switch" and aria-checked reflecting checked. Focus ring uses ring tokens.',
  },
  {
    id: "registry",
    title: "shadcn registry",
    content:
      "Registry item lists framer-motion so the CLI installs the peer when you add the file.",
    registryPath: "switch.json",
  },
];

function SectionLabel({
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

const bentoContainer = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.06, staggerChildren: 0.07 },
  },
};

const bentoItem = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 28 },
  },
};

const bentoContainerStatic = {
  hidden: {},
  visible: { transition: { delayChildren: 0, staggerChildren: 0 } },
};

const bentoItemStatic = {
  hidden: { opacity: 1, scale: 1, y: 0 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

function BentoMotion({
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

function SwitchPreview() {
  const [on, setOn] = useState(true);

  return (
    <div className="flex flex-col items-center gap-6 px-2 py-4">
      <Switch checked={on} onCheckedChange={setOn} size="sm" />
      <p className="max-w-md text-center font-sans text-[13px] leading-relaxed">
        <span className="text-emerald-600 dark:text-emerald-400">
          Flip the line
        </span>
        <span className="text-neutral-400 dark:text-neutral-500"> · </span>
        <span className="text-sky-600 dark:text-sky-400">
          Spring carries the thumb
        </span>
        <span className="text-neutral-400 dark:text-neutral-500"> · </span>
        <span className="text-violet-600 dark:text-violet-400">
          Track eases to green
        </span>
      </p>
    </div>
  );
}

export default function SwitchPage() {
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion
    ? bentoContainerStatic
    : bentoContainer;
  const itemVariants = prefersReducedMotion ? bentoItemStatic : bentoItem;

  return (
    <main className="min-w-0 flex-1">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
        <motion.nav
          animate={{ opacity: 1, y: 0 }}
          aria-label="Breadcrumb"
          className="mb-8"
          initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 380, damping: 35 }
          }
        >
          <ol className="flex flex-wrap items-center gap-1.5 font-sans text-neutral-400 text-xs dark:text-neutral-500">
            <li>
              <Link
                className="transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
                href="/"
              >
                Docs
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3 opacity-60" />
            </li>
            <li>
              <Link
                className="transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
                href="/components/switch"
              >
                Components
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3 opacity-60" />
            </li>
            <li
              aria-current="page"
              className="text-neutral-700 dark:text-neutral-300"
            >
              Switch
            </li>
          </ol>
        </motion.nav>

        <motion.header
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 max-w-2xl"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 340, damping: 34, delay: 0.05 }
          }
        >
          <h1 className="font-sans font-semibold text-3xl text-neutral-900 tracking-tight sm:text-[2rem] dark:text-white">
            Switch
          </h1>
          <p className="mt-2 font-sans text-[15px] text-neutral-500 leading-relaxed dark:text-neutral-400">
            Animated on/off control with a spring thumb and smooth track tint.
            Built with Framer Motion and a native switch button.
          </p>
        </motion.header>

        <motion.div
          animate="visible"
          className={cn(
            "grid auto-rows-min grid-cols-1 gap-3 sm:gap-4",
            "lg:grid-cols-12 lg:gap-x-5 lg:gap-y-5"
          )}
          initial="hidden"
          variants={containerVariants}
        >
          <BentoMotion
            className={cn(
              "relative overflow-hidden lg:col-span-8 lg:row-span-2",
              "rounded-3xl border-neutral-200/40 dark:border-neutral-700/30"
            )}
            variants={itemVariants}
          >
            <SectionLabel accent="01">Live preview</SectionLabel>
            <div className="relative mt-1 flex min-h-0 flex-1 flex-col items-center justify-center">
              <SwitchPreview />
            </div>
          </BentoMotion>

          <BentoMotion
            className="justify-between border-neutral-200/40 lg:col-span-4 lg:col-start-9 lg:row-start-1 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="02">Install</SectionLabel>
            <div className="min-w-0 flex-1 [&>div]:mt-0">
              <CodeBlockInstall componentName="switch" />
            </div>
          </BentoMotion>

          <BentoMotion
            className="border-neutral-200/90 border-dashed lg:col-span-4 lg:col-start-9 lg:row-start-2 dark:border-neutral-700/80"
            variants={itemVariants}
          >
            <SectionLabel accent="03">v0</SectionLabel>
            <p className="mb-5 flex-1 font-sans text-neutral-500 text-sm leading-snug dark:text-neutral-400">
              Open in v0 with a ready page and the registry file to tweak motion
              or wiring with prompts.
            </p>
            <ComponentActions name="switch" />
          </BentoMotion>

          <BentoMotion
            className="border-neutral-200/40 lg:col-span-12 lg:col-start-1 lg:row-start-3 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="04">Usage</SectionLabel>
            <p className="mb-4 font-sans text-neutral-500 text-sm dark:text-neutral-400">
              Import as{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                switch
              </code>{" "}
              with an alias — it is a reserved word in JavaScript. See tile{" "}
              <span className="font-mono text-neutral-600 text-xs dark:text-neutral-300">
                05
              </span>{" "}
              for props and dependencies.
            </p>
            <CodeBlock code={usageCode} language="tsx" variant="embedded" />
          </BentoMotion>

          <BentoMotion
            className="border-neutral-200/40 lg:col-span-12 lg:col-start-1 lg:row-start-4 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="05">API &amp; dependencies</SectionLabel>
            <p className="mb-3 font-sans text-neutral-500 text-xs leading-snug dark:text-neutral-400">
              Controlled or uncontrolled boolean toggle; forwards ref to the
              underlying button.
            </p>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {componentDetailsItems.map((row) => (
                <div
                  className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-[200px_1fr] sm:gap-8 sm:py-4"
                  key={row.id}
                >
                  <p className="pt-0.5 font-medium text-neutral-800 text-xs dark:text-neutral-200">
                    {row.title}
                  </p>
                  <div>
                    <p className="font-sans text-[13px] text-neutral-500 leading-relaxed dark:text-neutral-400">
                      {row.content}
                    </p>
                    {row.registryPath ? (
                      <RegistryInstallBlock registryPath={row.registryPath} />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </BentoMotion>
        </motion.div>
      </div>
    </main>
  );
}
