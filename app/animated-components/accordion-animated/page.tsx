import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { CodeBlockInstall } from "@/components/code-block-install";
import { ComponentActions } from "@/components/component-actions";
import { ComponentPager } from "@/components/component-pager";
import { OnThisPage } from "@/components/on-this-page";
import { SidebarNav } from "@/components/sidebar-nav";
import { FoldersIcon } from "@/icons/folders";
import { GaugeIcon } from "@/icons/gauge";
import { ShieldCheckIcon } from "@/icons/shield-check";
import { UsersIcon } from "@/icons/users";
import { AccordionAnimated } from "@/registry/accordion-animated";

const demoItems = [
  {
    value: "performance",
    title: "Performance",
    subtitle: "Track usage and load",
    content:
      "Monitor response times, traffic spikes, and throughput to keep your product fast under real-world workloads.",
    icon: GaugeIcon,
    textColor: "text-sky-500",
    bgColor: "bg-sky-500/10",
  },
  {
    value: "projects",
    title: "Projects",
    subtitle: "Organize your work",
    content:
      "Group related tasks, assets, and releases so teams always know what ships together and when.",
    icon: FoldersIcon,
    textColor: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    value: "security",
    title: "Security",
    subtitle: "Control access and risk",
    content:
      "Configure roles, permissions, and enforcement policies to keep sensitive data safe by default.",
    icon: ShieldCheckIcon,
    textColor: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    value: "team",
    title: "Team Members",
    subtitle: "Manage users and roles",
    content:
      "Invite collaborators, assign responsibilities, and see who is actively contributing to each area.",
    icon: UsersIcon,
    textColor: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
] as const;

export default function AccordionAnimatedPage() {
  return (
    <div className="flex min-h-[calc(100vh-0px)] w-full min-w-0">
      <SidebarNav />

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[720px] px-4 py-10 sm:px-6 sm:py-12">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center justify-between gap-3"
          >
            <ol className="flex items-center gap-1.5 font-sans text-neutral-500 text-sm">
              <li>
                <Link
                  className="transition-colors hover:text-neutral-900"
                  href="/"
                >
                  Docs
                </Link>
              </li>

              <li aria-hidden="true">
                <ChevronRight className="size-4 text-neutral-400" />
              </li>

              <li aria-current="page" className="text-neutral-900">
                Animated Components
              </li>

              <li aria-hidden="true">
                <ChevronRight className="size-4 text-neutral-400" />
              </li>

              <li aria-current="page" className="text-neutral-900">
                Accordion (Animated)
              </li>
            </ol>
            <ComponentPager />
          </nav>

          <h1 className="font-bold font-sans text-3xl text-neutral-900 tracking-tight sm:text-4xl dark:text-white">
            Accordion (Animated)
          </h1>

          <p className="mt-2 font-sans text-lg text-neutral-600 dark:text-neutral-400">
            An animated accordion that uses motion-powered icons from the Iconiq
            library to bring each section to life.
          </p>

          <p className="mt-6 font-sans text-neutral-600 text-sm dark:text-neutral-400">
            Use it to group related content into collapsible sections, each with
            its own animated icon that responds to user interaction.
          </p>

          <p className="mt-6 font-sans text-neutral-600 text-sm dark:text-neutral-400">
            Install using the shadcn CLI to add the accordion component to your
            application, then replace the icons with any animated icons from the
            Iconiq library.
          </p>

          <div className="mt-10">
            <CodeBlockInstall componentName="accordion-animated" />
          </div>

          <h2
            className="mt-12 font-sans font-semibold text-lg text-neutral-900 dark:text-white"
            id="preview"
          >
            Preview
          </h2>

          <p className="mt-1 font-sans text-neutral-600 text-sm dark:text-neutral-400">
            Hover and click the sections to expand and collapse them while the
            icons animate in response.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <AccordionAnimated
              defaultValue={[demoItems[0].value]}
              items={demoItems}
            />
          </div>

          <h2
            className="mt-12 font-sans font-semibold text-lg text-neutral-900 dark:text-white"
            id="usage"
          >
            Usage
          </h2>

          <p className="mt-1 font-sans text-neutral-600 text-sm dark:text-neutral-400">
            Import{" "}
            <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
              AccordionAnimated
            </code>{" "}
            and pass an array of items, each with a label, animated icon, and
            content. Grab animated icons from the{" "}
            <Link
              className="underline underline-offset-4 hover:text-neutral-900 dark:hover:text-white"
              href="/icons"
            >
              Icon Library
            </Link>{" "}
            page, then plug them into your accordion items. Use{" "}
            <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
              defaultValue
            </code>{" "}
            to control which sections start open.
          </p>

          <div className="mt-4">
            <CodeBlock
              code={`import { AccordionAnimated } from "@/components/ui/accordion-animated";
import { FileTextIcon } from "@/icons/file-text";
import { FoldersIcon } from "@/icons/folders";
import { SettingsIcon } from "@/icons/settings";
import { UsersIcon } from "@/icons/users";

const items = [
  {
    value: "documents",
    title: "Documents",
    subtitle: "Manage your files",
    content: "View, upload, and organize all your documents in one place.",
    icon: FileTextIcon,
    textColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  // add more items...
] as const;

export function AccordionAnimatedExample() {
  return (
    <AccordionAnimated
      defaultValue={["documents"]}
      items={items}
    />
  );
}
`}
              language="tsx"
            />
          </div>

          <h2
            className="mt-12 font-sans font-semibold text-lg text-neutral-900 dark:text-white"
            id="get-code"
          >
            Get the Component
          </h2>

          <p className="mt-1 font-sans text-neutral-600 text-sm dark:text-neutral-400">
            Copy the Accordion (Animated) component directly into your project
            or open it in v0 to customize and generate variations. This helps
            you quickly adapt the accordion to your UI and workflow.
          </p>

          <div className="mt-6">
            <ComponentActions name="accordion-animated" />
          </div>

          <h3
            className="mt-8 font-sans font-semibold text-base text-neutral-900 dark:text-white"
            id="props"
          >
            Props
          </h3>

          <ul className="mt-2 list-inside list-disc font-sans text-neutral-600 text-sm dark:text-neutral-400">
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                items
              </code>{" "}
              — array of sections to render. Each item includes{" "}
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                value
              </code>
              ,{" "}
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                title
              </code>
              , optional{" "}
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                subtitle
              </code>
              ,{" "}
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                content
              </code>
              , and an animated{" "}
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                icon
              </code>
              .
            </li>
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                defaultValue
              </code>{" "}
              — the initially opened item values (for example{" "}
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                ["documents"]
              </code>
              ).
            </li>
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                className
              </code>{" "}
              — optional classes applied to the accordion root for custom
              spacing or borders.
            </li>
          </ul>
        </div>
      </main>

      <OnThisPage />
    </div>
  );
}
