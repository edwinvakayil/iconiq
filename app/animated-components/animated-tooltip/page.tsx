import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { CodeBlockInstall } from "@/components/code-block-install";
import { ComponentActions } from "@/components/component-actions";
import { ComponentPager } from "@/components/component-pager";
import { OnThisPage } from "@/components/on-this-page";
import { SidebarNav } from "@/components/sidebar-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedTooltip } from "@/registry/animated-tooltip";

const GITHUB_REPO_API = "https://api.github.com/repos/edwinvakayil/iconiq";

async function getRepoOwnerAvatar(): Promise<string | null> {
  try {
    const res = await fetch(GITHUB_REPO_API, {
      headers: { Accept: "application/vnd.github.v3+json" },
      next: { revalidate: 3600 },
    });
    const data = (await res.json()) as { owner?: { avatar_url?: string } };
    return data?.owner?.avatar_url ?? null;
  } catch {
    return null;
  }
}

export default async function AnimatedTooltipPage() {
  const avatarUrl = await getRepoOwnerAvatar();

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

              <li
                aria-current="page"
                className="w-[90px] truncate text-neutral-900 sm:w-auto"
              >
                Animated Components
              </li>

              <li aria-hidden="true">
                <ChevronRight className="size-4 text-neutral-400" />
              </li>

              <li
                aria-current="page"
                className="w-[90px] truncate text-neutral-900 sm:w-auto"
              >
                Animated Tooltip
              </li>
            </ol>
            <ComponentPager />
          </nav>

          <h1 className="font-bold font-sans text-3xl text-neutral-900 tracking-tight sm:text-4xl">
            Animated Tooltip
          </h1>

          <p className="mt-2 font-sans text-lg leading-relaxed text-neutral-600">
            A dynamic tooltip that tilts and shifts based on cursor movement,
            enhanced with smooth spring-based enter and exit animations.
          </p>

          <p className="mt-6 font-sans text-neutral-600 text-sm leading-relaxed">
            Built with Motion to create a subtle parallax effect using hover
            position for rotation and translation. AnimatePresence manages
            smooth mounting and unmounting transitions. Ideal for avatars,
            buttons, and interactive UI triggers where a responsive, playful
            tooltip enhances the experience.
          </p>

          <p className="mt-6 font-sans text-neutral-600 text-sm leading-relaxed">
            Install using the shadcn CLI to add a clean, developer-friendly
            tooltip component to your application.
          </p>

          <div className="mt-10">
            <CodeBlockInstall componentName="animated-tooltip" />
          </div>

          <h2 className="sr-only" id="preview">
            Preview
          </h2>

          <div className="mt-10 rounded-sm border border-neutral-200 bg-neutral-50/80 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-6 dark:border-neutral-800 dark:bg-neutral-900/70 dark:shadow-[0_18px_45px_rgba(15,23,42,0.7)]">
            <Tabs
              aria-label="Animated Tooltip preview, code, and get the component"
              className="w-full"
              defaultValue="preview"
            >
              <TabsList className="border-neutral-200 border-b pb-1 font-medium text-neutral-500 text-sm dark:border-neutral-800 dark:text-neutral-400">
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
                className="space-y-4 pt-4 focus-visible:outline-none"
                value="preview"
              >
                <p className="font-sans text-neutral-600 text-sm">
                  Hover over the trigger and move your cursor to see the tooltip
                  tilt and translate in response to pointer movement.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <AnimatedTooltip
                    className="bg-blue-800"
                    content="Edwin Vakayil, creator of Iconiq"
                  >
                    <Avatar size="md">
                      <AvatarImage
                        alt="Edwin Vakayil, the author of Iconiq"
                        className="select-none"
                        src={avatarUrl ?? undefined}
                      />
                      <AvatarFallback className="bg-neutral-200 font-sans dark:bg-neutral-800">
                        EV
                      </AvatarFallback>
                    </Avatar>
                  </AnimatedTooltip>
                </div>
              </TabsContent>

              <TabsContent
                className="space-y-4 pt-4 focus-visible:outline-none"
                value="code"
              >
                <h2 className="sr-only" id="usage">
                  Usage
                </h2>

                <p className="font-sans text-neutral-600 text-sm">
                  Import from{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                    @/components/ui/animated-tooltip
                  </code>{" "}
                  and wrap any trigger with{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                    content
                  </code>{" "}
                  for the tooltip.
                </p>

                <div className="mt-4">
                  <CodeBlock
                    code={`import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

<AnimatedTooltip content="Your tooltip text">
  <button type="button">Hover me</button>
</AnimatedTooltip>`}
                    language="tsx"
                  />
                </div>
              </TabsContent>

              <TabsContent
                className="space-y-4 pt-4 focus-visible:outline-none"
                value="get-component"
              >
                <h2 className="sr-only" id="get-code">
                  Get the Component
                </h2>

                <p className="font-sans text-neutral-600 text-sm">
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
                  to customize and generate variations. This allows you to
                  quickly integrate the component or experiment with different
                  UI implementations.
                </p>

                <div className="mt-6">
                  <ComponentActions name="animated-tooltip" />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <h3 className="sr-only" id="props">
            Props
          </h3>

          <div className="mt-6 border-neutral-200 border-t pt-4 text-sm dark:border-neutral-800">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-neutral-200 px-2.5 py-0.5 font-mono text-[11px] text-neutral-500 uppercase tracking-[0.16em] dark:border-neutral-800 dark:text-neutral-400">
              <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-semibold text-[10px] text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                animated-tooltip
              </span>
              <span>Props</span>
            </div>

            <dl className="mt-3 divide-y divide-neutral-200 border border-neutral-200 text-[13px] dark:divide-neutral-800 dark:border-neutral-800">
              <div className="grid grid-cols-[minmax(0,140px)_minmax(0,1fr)] gap-x-4 px-3 py-2.5">
                <dt className="font-mono text-neutral-900 text-xs dark:text-neutral-100">
                  children
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300">
                  Trigger element (hover target).
                </dd>
              </div>
              <div className="grid grid-cols-[minmax(0,140px)_minmax(0,1fr)] gap-x-4 px-3 py-2.5">
                <dt className="font-mono text-neutral-900 text-xs dark:text-neutral-100">
                  content
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300">
                  Tooltip content (
                  <code className="rounded bg-neutral-200 px-1 font-mono text-[11px] dark:bg-neutral-700 dark:text-neutral-200">
                    ReactNode
                  </code>
                  ).
                </dd>
              </div>
              <div className="grid grid-cols-[minmax(0,140px)_minmax(0,1fr)] gap-x-4 px-3 py-2.5">
                <dt className="font-mono text-neutral-900 text-xs dark:text-neutral-100">
                  className
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300">
                  Optional class for the tooltip popup.
                </dd>
              </div>
              <div className="grid grid-cols-[minmax(0,140px)_minmax(0,1fr)] gap-x-4 px-3 py-2.5">
                <dt className="font-mono text-neutral-900 text-xs dark:text-neutral-100">
                  wrapperClassName
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300">
                  Optional class for the trigger wrapper.
                </dd>
              </div>
              <div className="grid grid-cols-[minmax(0,140px)_minmax(0,1fr)] gap-x-4 px-3 py-2.5">
                <dt className="font-mono text-neutral-900 text-xs dark:text-neutral-100">
                  backgroundClassName
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300">
                  Optional class for the tooltip background (for example{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-[11px] dark:bg-neutral-700 dark:text-neutral-200">
                    bg-blue-600
                  </code>
                  ). Defaults to{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-[11px] dark:bg-neutral-700 dark:text-neutral-200">
                    bg-black
                  </code>
                  .
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
