import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DocsPageRail } from "@/components/docs/component-page-rail";
import { DocsCopyActions } from "@/components/docs/docs-copy-actions";
import { DocsBreadcrumbs } from "@/components/docs/page-shell";
import { McpAutoConfigTabs } from "@/components/mcp-auto-config-tabs";
import { McpManualConfigTabs } from "@/components/mcp-manual-config-tabs";
import {
  PageReveal,
  PageStagger,
  PageStaggerItem,
} from "@/components/page-reveal";
import { ShadcnDevDependencyBlock } from "@/components/shadcn-dev-dependency-block";
import { LINK, SITE } from "@/constants";
import { BreadcrumbJsonLdClient } from "@/seo/breadcrumb-json-ld-client";
import { createMetadata } from "@/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: `MCP | ${SITE.NAME}`,
  description:
    "Set up shadcn MCP for Iconiq so AI-powered coding tools can discover the registry, add components by name, and keep the generated files inside your project.",
  canonical: "/mcp",
  ogTitle: `${SITE.NAME} MCP Setup`,
  keywords: [
    "iconiq mcp setup",
    "shadcn mcp registry",
    "model context protocol ui components",
  ],
});

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Getting Started" },
  { label: "MCP" },
];

const sections = [
  { id: "automatic-configuration", label: "Automatic configuration" },
  { id: "manual-configuration", label: "Manual configuration" },
  { id: "registry-configuration", label: "Registry configuration" },
  { id: "usage-examples", label: "Example prompts" },
  { id: "troubleshooting", label: "Troubleshooting" },
];

const pagerButtonClassName =
  "inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const registryConfig = `{
  "registries": {
    "@iconiq": "https://iconiqui.com/r/{name}.json"
  }
}`;

const promptExamples = `Add the @iconiq/button component to this page.
Install the @iconiq/accordion component and keep the generated files editable.
Show me all available components in the iconiq registry.
Create a feature section using Iconiq components and keep the generated files local.`;

const officialDocsHref = "https://ui.shadcn.com/docs/mcp";

const pageCopyContent = `# MCP

Connect Iconiq to shadcn MCP so AI coding tools can discover the registry and add components directly into your project.

## Automatic configuration

Run the shadcn MCP init command for your client, such as:

pnpm dlx shadcn@latest mcp init --client claude

## Manual configuration

Install shadcn as a dev dependency:

pnpm add -D shadcn@latest

Then configure your editor:

- Claude Code: .mcp.json
- Cursor: .cursor/mcp.json
- VS Code: .vscode/mcp.json
- Codex: ~/.codex/config.toml

## Registry configuration

Add this to components.json:

\`\`\`json
${registryConfig}
\`\`\`

## Example prompts

- Add the @iconiq/button component to this page.
- Install the @iconiq/accordion component and keep the generated files editable.
- Show me all available components in the iconiq registry.
- Create a feature section using Iconiq components and keep the generated files local.`;

export default function McpPage() {
  return (
    <main className="min-w-0 flex-1">
      <div className="mx-auto w-full min-w-0 max-w-[1600px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        <BreadcrumbJsonLdClient items={breadcrumbs} />
        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_248px] xl:gap-4">
          <div className="min-w-0">
            <article className="min-w-0 max-w-4xl">
              <PageStagger delayChildren={0.04}>
                <PageStaggerItem>
                  <header className="space-y-3">
                    <DocsBreadcrumbs items={breadcrumbs} />

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-3xl space-y-2">
                        <h1 className="scroll-m-20 font-semibold text-3xl text-foreground tracking-tighter">
                          MCP
                        </h1>
                        <p className="max-w-3xl text-base text-muted-foreground">
                          Connect {SITE.NAME} to shadcn MCP so AI coding tools
                          can discover the registry, add components by name, and
                          keep everything editable in your own codebase.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start">
                        <DocsCopyActions
                          pageContent={pageCopyContent}
                          pageUrl="/mcp"
                          sourceHref={`${LINK.GITHUB}/blob/main/app/mcp/page.tsx`}
                          title="MCP"
                        />
                        <Link
                          aria-label="Go to Installation"
                          className={pagerButtonClassName}
                          href="/installation"
                          title="Installation"
                        >
                          <ChevronLeft className="size-4" />
                        </Link>
                        <Link
                          aria-label="Go to Components"
                          className={pagerButtonClassName}
                          href="/components/accordion"
                          title="Components"
                        >
                          <ChevronRight className="size-4" />
                        </Link>
                      </div>
                    </div>
                  </header>
                </PageStaggerItem>
              </PageStagger>

              <div className="mt-10 space-y-8 text-[15px] text-secondary leading-7">
                <PageReveal inView>
                  <p>
                    If you work with Cursor, Claude Code, or another
                    MCP-compatible coding tool, you can let the shadcn MCP flow
                    expose the {SITE.NAME} registry to the assistant. That keeps
                    the experience natural for AI-driven edits while still
                    landing real component files inside your repository.
                  </p>
                  <p>
                    For the latest shadcn MCP behavior, keep the official docs
                    handy at{" "}
                    <a
                      className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
                      href={officialDocsHref}
                      rel="noreferrer"
                      target="_blank"
                    >
                      ui.shadcn.com/docs/mcp
                    </a>
                    . The setup below adapts that flow for the {SITE.NAME}{" "}
                    registry.
                  </p>
                </PageReveal>

                <PageReveal inView>
                  <section
                    className="scroll-mt-28 space-y-5"
                    id="automatic-configuration"
                  >
                    <h2 className="text-2xl text-foreground tracking-tight">
                      Automatic configuration
                    </h2>
                    <p>
                      The quickest path is the shadcn MCP init flow. Pick the
                      client you use, run the generated command in the same
                      project where you want to install {SITE.NAME} components,
                      and let shadcn scaffold the editor-side configuration it
                      supports.
                    </p>
                    <McpAutoConfigTabs />
                    <ul className="list-disc space-y-2 pl-6 text-foreground/90 marker:text-muted-foreground">
                      <li>
                        Run the command from the root of the app where your
                        assistant should install Iconiq components.
                      </li>
                      <li>
                        Restart or re-enable your MCP client after the config is
                        written so the server is reloaded.
                      </li>
                      <li>
                        Even with automatic setup, you still need the Iconiq
                        registry entry in <code>components.json</code>.
                      </li>
                    </ul>
                  </section>
                </PageReveal>

                <PageReveal inView>
                  <section
                    className="scroll-mt-28 space-y-5"
                    id="manual-configuration"
                  >
                    <h2 className="text-2xl text-foreground tracking-tight">
                      Manual configuration
                    </h2>
                    <p>
                      If you want full control or your client needs a manual
                      setup path, install <code>shadcn</code> as a dev
                      dependency and add the MCP server entry yourself.
                    </p>
                    <ShadcnDevDependencyBlock className="max-w-[720px]" />
                    <McpManualConfigTabs />
                  </section>
                </PageReveal>

                <PageReveal inView>
                  <section
                    className="scroll-mt-28 space-y-5"
                    id="registry-configuration"
                  >
                    <h2 className="text-2xl text-foreground tracking-tight">
                      Registry configuration
                    </h2>
                    <p>
                      The standard shadcn/ui registry works without extra
                      registry setup, but {SITE.NAME} uses a namespaced
                      registry. Add it to your project&apos;s{" "}
                      <code>components.json</code> so shadcn and your AI tooling
                      know how to resolve Iconiq component names.
                    </p>
                    <div className="max-w-[720px] overflow-hidden rounded-md border border-border/80 bg-background">
                      <div className="border-border/80 border-b bg-muted/30 px-4 py-2.5">
                        <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
                          components.json
                        </p>
                      </div>
                      <pre className="overflow-x-auto px-4 py-3 dark:bg-[#0F0F0F]">
                        <code className="font-mono text-[#032F62] text-sm dark:text-[#9ECBFF]">
                          {registryConfig}
                        </code>
                      </pre>
                    </div>
                    <ul className="list-disc space-y-2 pl-6 text-foreground/90 marker:text-muted-foreground">
                      <li>
                        Keep any registries you already use and add{" "}
                        <code>@iconiq</code> alongside them.
                      </li>
                      <li>
                        The <code>{"{name}"}</code> token lets shadcn resolve
                        registry entries like <code>@iconiq/button</code> and{" "}
                        <code>@iconiq/accordion</code>.
                      </li>
                      <li>
                        Once this is in place, your assistant can install Iconiq
                        components without pasting full registry URLs.
                      </li>
                    </ul>
                  </section>
                </PageReveal>

                <PageReveal inView>
                  <section
                    className="scroll-mt-28 space-y-5"
                    id="usage-examples"
                  >
                    <h2 className="text-2xl text-foreground tracking-tight">
                      Example prompts
                    </h2>
                    <p>
                      With MCP enabled and the registry configured, you can ask
                      your coding assistant to work with {SITE.NAME} in plain
                      language. These prompts map well to the registry workflow:
                    </p>
                    <div className="max-w-[720px] overflow-hidden rounded-md border border-border/80 bg-background">
                      <div className="border-border/80 border-b bg-muted/30 px-4 py-2.5">
                        <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
                          Prompt examples
                        </p>
                      </div>
                      <pre className="overflow-x-auto whitespace-pre-wrap px-4 py-3 dark:bg-[#0F0F0F]">
                        <code className="font-mono text-[#032F62] text-sm dark:text-[#9ECBFF]">
                          {promptExamples}
                        </code>
                      </pre>
                    </div>
                    <p>
                      The important part is that the assistant should still use
                      the registry install flow rather than inventing a fresh
                      component from scratch when an Iconiq version already
                      exists.
                    </p>
                  </section>
                </PageReveal>

                <PageReveal inView>
                  <section
                    className="scroll-mt-28 space-y-5"
                    id="troubleshooting"
                  >
                    <h2 className="text-2xl text-foreground tracking-tight">
                      Troubleshooting
                    </h2>
                    <p>
                      If MCP is not responding, the fix is usually one of a few
                      boring but important checks.
                    </p>
                    <ul className="list-disc space-y-2 pl-6 text-foreground/90 marker:text-muted-foreground">
                      <li>
                        Confirm the MCP server is enabled in your editor and
                        restart the client after configuration changes.
                      </li>
                      <li>
                        Make sure <code>shadcn</code> is installed and that your
                        project has a valid <code>components.json</code>.
                      </li>
                      <li>
                        If you see <code>No tools or prompts</code>, run{" "}
                        <code>npx clear-npx-cache</code> and then re-enable the
                        MCP server.
                      </li>
                      <li>
                        Verify the Iconiq registry URL is reachable and the{" "}
                        <code>@iconiq</code> namespace is spelled correctly in
                        your prompt or install request.
                      </li>
                    </ul>
                  </section>
                </PageReveal>
              </div>

              <PageReveal className="mt-12" inView>
                <nav className="flex items-center justify-between border-border/80 border-t pt-12">
                  <Link
                    className="group flex max-w-40 flex-col gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    href="/installation"
                  >
                    <span className="text-muted-foreground/75 transition-colors group-hover:text-muted-foreground">
                      Previous
                    </span>
                    <span className="truncate font-medium text-foreground">
                      Installation
                    </span>
                  </Link>
                  <Link
                    className="group flex max-w-40 flex-col items-end gap-1 text-right text-muted-foreground text-sm transition-colors hover:text-foreground"
                    href="/components/accordion"
                  >
                    <span className="text-muted-foreground/75 transition-colors group-hover:text-muted-foreground">
                      Next
                    </span>
                    <span className="truncate font-medium text-foreground">
                      Components
                    </span>
                  </Link>
                </nav>
              </PageReveal>
            </article>
          </div>

          <DocsPageRail
            editHref={`${LINK.GITHUB}/edit/main/app/mcp/page.tsx`}
            sections={sections}
          />
        </div>
      </div>
    </main>
  );
}
