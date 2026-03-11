import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { CodeBlockInstall } from "@/components/code-block-install";
import { ComponentActions } from "@/components/component-actions";
import { ComponentPager } from "@/components/component-pager";
import { OnThisPage } from "@/components/on-this-page";
import { SidebarNav } from "@/components/sidebar-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    textColor: "text-white dark:text-black",
    bgColor: "bg-neutral-800 dark:bg-neutral-200",
  },
  {
    value: "projects",
    title: "Projects",
    subtitle: "Organize your work",
    content:
      "Group related tasks, assets, and releases so teams always know what ships together and when.",
    icon: FoldersIcon,
    textColor: "text-white dark:text-black",
    bgColor: "bg-neutral-800 dark:bg-neutral-200",
  },
  {
    value: "security",
    title: "Security",
    subtitle: "Control access and risk",
    content:
      "Configure roles, permissions, and enforcement policies to keep sensitive data safe by default.",
    icon: ShieldCheckIcon,
    textColor: "text-white dark:text-black",
    bgColor: "bg-neutral-800 dark:bg-neutral-200",
  },
  {
    value: "team",
    title: "Team Members",
    subtitle: "Manage users and roles",
    content:
      "Invite collaborators, assign responsibilities, and see who is actively contributing to each area.",
    icon: UsersIcon,
    textColor: "text-white dark:text-black",
    bgColor: "bg-neutral-800 dark:bg-neutral-200",
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

          <h2 className="sr-only" id="preview">
            Preview
          </h2>

          <div className="mt-10 rounded-sm border border-neutral-200 bg-neutral-50/80 p-4 sm:p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/70 dark:shadow-[0_18px_45px_rgba(15,23,42,0.7)]">
            <Tabs
              className="w-full"
              defaultValue="preview"
              aria-label="Accordion (Animated) preview, code, and get the component"
            >
              <TabsList className="border-b border-neutral-200 pb-1 text-sm font-medium text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="get-component">
                  Build with{" "}
                  <span className="inline-flex align-baseline">
                    <svg
                      aria-hidden
                      className="ml-1 inline-block h-[0.95em] w-auto align-[0.1em]"
                      fill="currentColor"
                      viewBox="0 0 40 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z" />
                      <path d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z" />
                    </svg>
                    <span className="sr-only">v0</span>
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent
                className="pt-4 space-y-4 focus-visible:outline-none"
                value="preview"
              >
                <p className="font-sans text-neutral-600 text-sm dark:text-neutral-400">
                  Hover and click the sections to expand and collapse them while
                  the icons animate in response.
                </p>

                <div className="mt-6 flex flex-wrap gap-4">
                  <AccordionAnimated
                    defaultValue={[demoItems[0].value]}
                    items={demoItems}
                  />
                </div>
              </TabsContent>

              <TabsContent
                className="pt-4 space-y-4 focus-visible:outline-none"
                value="code"
              >
                <h2
                  className="sr-only"
                  id="usage"
                >
                  Usage
                </h2>

                <p className="font-sans text-neutral-600 text-sm dark:text-neutral-400">
                  Import{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                    AccordionAnimated
                  </code>{" "}
                  and pass an array of items, each with a label, animated icon,
                  and content. Grab animated icons from the{" "}
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
              </TabsContent>

              <TabsContent
                className="pt-4 space-y-4 focus-visible:outline-none"
                value="get-component"
              >
                <h2
                  className="sr-only"
                  id="get-code"
                >
                  Get the Component
                </h2>

                <p className="font-sans text-neutral-600 text-sm dark:text-neutral-400">
                  Build with{" "}
                  <span className="inline-flex align-baseline">
                    <svg
                      aria-hidden
                      className="mr-0.5 inline-block h-[0.95em] w-auto align-[0.1em]"
                      fill="currentColor"
                      viewBox="0 0 40 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z" />
                      <path d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z" />
                    </svg>
                    <span className="sr-only">v0</span>
                  </span>{" "}
                  to customize and generate variations. This helps you quickly
                  adapt the accordion to your UI and workflow.
                </p>

                <div className="mt-6">
                  <ComponentActions name="accordion-animated" />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <h3 className="sr-only" id="props">
            Props
          </h3>

          <div className="mt-6 border-t border-neutral-200 pt-4 text-sm dark:border-neutral-800">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-neutral-200 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
              <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                accordion-animated
              </span>
              <span>Props</span>
            </div>

            <dl className="mt-3 divide-y divide-neutral-200 border border-neutral-200 text-[13px] dark:divide-neutral-800 dark:border-neutral-800">
              <div className="grid grid-cols-[minmax(0,170px)_minmax(0,1fr)] gap-x-4 px-3 py-2.5">
                <dt className="font-mono text-xs text-neutral-900 dark:text-neutral-100">
                  items
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300">
                  Array of sections to render. Each item includes{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-[11px] dark:bg-neutral-700 dark:text-neutral-200">
                    value
                  </code>
                  ,{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-[11px] dark:bg-neutral-700 dark:text-neutral-200">
                    title
                  </code>
                  , optional{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-[11px] dark:bg-neutral-700 dark:text-neutral-200">
                    subtitle
                  </code>
                  ,{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-[11px] dark:bg-neutral-700 dark:text-neutral-200">
                    content
                  </code>
                  , and an animated{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-[11px] dark:bg-neutral-700 dark:text-neutral-200">
                    icon
                  </code>
                  .
                </dd>
              </div>
              <div className="grid grid-cols-[minmax(0,170px)_minmax(0,1fr)] gap-x-4 px-3 py-2.5">
                <dt className="font-mono text-xs text-neutral-900 dark:text-neutral-100">
                  defaultValue
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300">
                  The initially opened item values (for example{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-[11px] dark:bg-neutral-700 dark:text-neutral-200">
                    ["documents"]
                  </code>
                  ).
                </dd>
              </div>
              <div className="grid grid-cols-[minmax(0,170px)_minmax(0,1fr)] gap-x-4 px-3 py-2.5">
                <dt className="font-mono text-xs text-neutral-900 dark:text-neutral-100">
                  className
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300">
                  Optional classes applied to the accordion root for custom
                  spacing or borders.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>

      <OnThisPage />
    </div>
  );
}
