import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { CodeBlockInstall } from "@/components/code-block-install";
import { OnThisPage } from "@/components/on-this-page";
import { SidebarNav } from "@/components/sidebar-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatedTooltip } from "@/registry/animated-tooltip";
import { CodeBlock } from "@/registry/code-block";

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
          <nav aria-label="Breadcrumb" className="mb-6">
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
                Components
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-4 text-neutral-400" />
              </li>
              <li aria-current="page" className="text-neutral-900">
                Animated Tooltip
              </li>
            </ol>
          </nav>

          <h1 className="font-bold font-sans text-3xl text-neutral-900 tracking-tight sm:text-4xl">
            Animated Tooltip
          </h1>
          <p className="mt-2 font-sans text-lg text-neutral-600">
            A dynamic tooltip that tilts and shifts based on cursor movement,
            enhanced with smooth spring-based enter and exit animations.
          </p>
          <p className="mt-6 font-sans text-neutral-600 text-sm">
            Built with Motion to create a subtle parallax effect using hover
            position for rotation and translation. AnimatePresence manages
            smooth mounting and unmounting transitions. Ideal for avatars,
            buttons, and interactive UI triggers where a responsive, playful
            tooltip enhances the experience.
          </p>

          <p className="mt-6 font-sans text-neutral-600 text-sm">
            Install using the shadcn CLI to add a clean, developer-friendly
            tooltip component to your application.
          </p>

          <div className="mt-10">
            <CodeBlockInstall componentName="animated-tooltip" />
          </div>

          <h2
            className="mt-12 font-sans font-semibold text-lg text-neutral-900"
            id="preview"
          >
            Preview
          </h2>
          <p className="mt-1 font-sans text-neutral-600 text-sm">
            Hover over the trigger and move your cursor to see the tooltip tilt
            and translate in response to pointer movement.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <AnimatedTooltip
              className="bg-emerald-800"
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

          <h2 className="mt-12 font-sans font-semibold text-lg text-neutral-900">
            Usage
          </h2>
          <p className="mt-1 font-sans text-neutral-600 text-sm">
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

          <h3
            className="mt-8 font-sans font-semibold text-base text-neutral-900"
            id="props"
          >
            Props
          </h3>
          <ul className="mt-2 list-inside list-disc font-sans text-neutral-600 text-sm">
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                children
              </code>{" "}
              — trigger element (hover target)
            </li>
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                content
              </code>{" "}
              — tooltip content (ReactNode)
            </li>
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                className
              </code>{" "}
              — optional class for the tooltip popup
            </li>
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                wrapperClassName
              </code>{" "}
              — optional class for the trigger wrapper
            </li>
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                backgroundClassName
              </code>{" "}
              — optional class for the tooltip background (e.g.{" "}
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                bg-blue-600
              </code>
              ). Defaults to{" "}
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                bg-black
              </code>
            </li>
          </ul>
        </div>

        <div className="mx-auto max-w-[720px] px-4 pb-12 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
            <Link
              className="inline-flex items-center gap-1 font-medium font-sans text-neutral-700 text-sm transition-colors hover:text-neutral-900"
              href="/components/code-block"
            >
              <span aria-hidden="true">←</span>
              Code Block
            </Link>
            <Link
              className="inline-flex items-center gap-1 font-medium font-sans text-neutral-700 text-sm transition-colors hover:text-neutral-900"
              href="/icons"
            >
              Icon Library
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
        </div>
      </main>
      <OnThisPage />
    </div>
  );
}
