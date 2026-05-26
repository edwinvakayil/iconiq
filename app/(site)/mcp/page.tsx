import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DocsPageRail } from "@/components/docs/component-page-rail";
import { DocsCopyActions } from "@/components/docs/docs-copy-actions";
import { DocsBreadcrumbs } from "@/components/docs/page-shell";
import { McpAgentSkillBlock } from "@/components/mcp-agent-skill-block";
import { McpAutoConfigTabs } from "@/components/mcp-auto-config-tabs";
import { McpManualConfigTabs } from "@/components/mcp-manual-config-tabs";
import {
  PageReveal,
  PageStagger,
  PageStaggerItem,
} from "@/components/page-reveal";
import { ShadcnDevDependencyBlock } from "@/components/shadcn-dev-dependency-block";
import { LINK, SITE } from "@/constants";
import {
  ICONIQ_REGISTRY_CONFIG,
  MCP_AVOID_PROMPTS,
  MCP_EFFICIENT_PROMPTS,
  MCP_PROVIDER_ROWS,
  MCP_SHARED_LIBS,
} from "@/lib/mcp-docs";
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
  { id: "agent-skill", label: "Agent skill" },
  { id: "shared-libs", label: "Shared registry libs" },
  { id: "provider-variants", label: "Provider variants" },
  { id: "efficient-prompts", label: "Efficient prompts" },
  { id: "troubleshooting", label: "Troubleshooting" },
];

const pagerButtonClassName =
  "inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const officialDocsHref = "https://ui.shadcn.com/docs/mcp";

const pageCopyContent = `# MCP

Connect Iconiq to shadcn MCP so AI coding tools can discover the registry and add components directly into your project.

Pair MCP with the iconiq-shadcn agent skill for consistent installs and naming.

## Automatic configuration

pnpm dlx shadcn@latest mcp init --client cursor

## Registry configuration

\`\`\`json
${ICONIQ_REGISTRY_CONFIG}
\`\`\`

## Agent skill

npx skills add https://iconiqui.com --skill iconiq-shadcn -y

## Efficient prompts

${MCP_EFFICIENT_PROMPTS}`;

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
                          Connect {SITE.NAME} to shadcn MCP for fast registry
                          installs, then add the agent skill so assistants
                          follow Iconiq naming, motion, and provider
                          conventions.
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
                          {ICONIQ_REGISTRY_CONFIG}
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
                        registry entries like <code>@iconiq/b-button</code> and{" "}
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
                  <section className="scroll-mt-28 space-y-5" id="agent-skill">
                    <h2 className="text-2xl text-foreground tracking-tight">
                      Agent skill
                    </h2>
                    <p>
                      MCP installs components; the <code>iconiq-shadcn</code>{" "}
                      skill teaches assistants how Iconiq projects are
                      structured—exact slugs, provider prefixes, shared libs,
                      and motion rules. Install it once per machine or project:
                    </p>
                    <McpAgentSkillBlock className="max-w-[720px]" />
                    <ul className="list-disc space-y-2 pl-6 text-foreground/90 marker:text-muted-foreground">
                      <li>
                        Served at{" "}
                        <a
                          className="text-foreground underline underline-offset-4"
                          href={`${SITE.URL}/.well-known/skills/iconiq-shadcn/SKILL.md`}
                        >
                          /.well-known/skills/iconiq-shadcn/SKILL.md
                        </a>
                      </li>
                      <li>
                        Index:{" "}
                        <a
                          className="text-foreground underline underline-offset-4"
                          href={`${SITE.URL}/.well-known/skills/index.json`}
                        >
                          /.well-known/skills/index.json
                        </a>
                      </li>
                    </ul>
                  </section>
                </PageReveal>

                <PageReveal inView>
                  <section className="scroll-mt-28 space-y-5" id="shared-libs">
                    <h2 className="text-2xl text-foreground tracking-tight">
                      Shared registry libs
                    </h2>
                    <p>
                      Theme tokens and reduced-motion helpers ship as separate
                      registry items instead of being duplicated inside every
                      component JSON. MCP installs them automatically when a
                      component declares <code>registryDependencies</code>.
                    </p>
                    <div className="max-w-[720px] overflow-x-auto rounded-md border border-border/80">
                      <table className="w-full min-w-[520px] text-left text-sm">
                        <thead className="border-border/80 border-b bg-muted/30">
                          <tr>
                            <th className="px-4 py-2.5 font-medium">Slug</th>
                            <th className="px-4 py-2.5 font-medium">File</th>
                            <th className="px-4 py-2.5 font-medium">Role</th>
                          </tr>
                        </thead>
                        <tbody>
                          {MCP_SHARED_LIBS.map((lib) => (
                            <tr
                              className="border-border/60 border-b last:border-b-0"
                              key={lib.slug}
                            >
                              <td className="px-4 py-3 font-mono text-foreground">
                                @iconiq/{lib.slug}
                              </td>
                              <td className="px-4 py-3 font-mono text-muted-foreground">
                                {lib.path}
                              </td>
                              <td className="px-4 py-3 text-foreground/90">
                                {lib.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </PageReveal>

                <PageReveal inView>
                  <section
                    className="scroll-mt-28 space-y-5"
                    id="provider-variants"
                  >
                    <h2 className="text-2xl text-foreground tracking-tight">
                      Provider variants
                    </h2>
                    <p>
                      Pick one headless line per feature so MCP does not install
                      multiple variants of the same control.
                    </p>
                    <div className="max-w-[720px] overflow-x-auto rounded-md border border-border/80">
                      <table className="w-full min-w-[560px] text-left text-sm">
                        <thead className="border-border/80 border-b bg-muted/30">
                          <tr>
                            <th className="px-4 py-2.5 font-medium">Prefix</th>
                            <th className="px-4 py-2.5 font-medium">Library</th>
                            <th className="px-4 py-2.5 font-medium">Example</th>
                            <th className="px-4 py-2.5 font-medium">Note</th>
                          </tr>
                        </thead>
                        <tbody>
                          {MCP_PROVIDER_ROWS.map((row) => (
                            <tr
                              className="border-border/60 border-b last:border-b-0"
                              key={row.prefix}
                            >
                              <td className="px-4 py-3 font-mono text-foreground">
                                {row.prefix}
                              </td>
                              <td className="px-4 py-3 text-foreground/90">
                                {row.library}
                              </td>
                              <td className="px-4 py-3 font-mono text-[13px] text-muted-foreground">
                                {row.example}
                              </td>
                              <td className="px-4 py-3 text-foreground/90">
                                {row.note}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </PageReveal>

                <PageReveal inView>
                  <section
                    className="scroll-mt-28 space-y-5"
                    id="efficient-prompts"
                  >
                    <h2 className="text-2xl text-foreground tracking-tight">
                      Efficient prompts
                    </h2>
                    <p>
                      Name exact registry slugs and target files. Browse{" "}
                      <a
                        className="text-foreground underline underline-offset-4"
                        href="/components/accordion"
                      >
                        the docs
                      </a>{" "}
                      for discovery instead of asking MCP to list every item.
                    </p>
                    <div className="max-w-[720px] overflow-hidden rounded-md border border-border/80 bg-background">
                      <div className="border-border/80 border-b bg-muted/30 px-4 py-2.5">
                        <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
                          Do
                        </p>
                      </div>
                      <pre className="overflow-x-auto whitespace-pre-wrap px-4 py-3 dark:bg-[#0F0F0F]">
                        <code className="font-mono text-[#032F62] text-sm dark:text-[#9ECBFF]">
                          {MCP_EFFICIENT_PROMPTS}
                        </code>
                      </pre>
                    </div>
                    <div className="max-w-[720px] overflow-hidden rounded-md border border-border/80 bg-background">
                      <div className="border-border/80 border-b bg-muted/30 px-4 py-2.5">
                        <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
                          Avoid
                        </p>
                      </div>
                      <pre className="overflow-x-auto whitespace-pre-wrap px-4 py-3 dark:bg-[#0F0F0F]">
                        <code className="font-mono text-muted-foreground text-sm">
                          {MCP_AVOID_PROMPTS}
                        </code>
                      </pre>
                    </div>
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
                      <li>
                        If theme or motion helpers are missing after install,
                        add <code>@iconiq/iconiq-theme</code> and{" "}
                        <code>@iconiq/iconiq-motion</code> or reinstall the
                        component so <code>registryDependencies</code> resolve.
                      </li>
                      <li>
                        Install the <code>iconiq-shadcn</code> skill when the
                        assistant keeps guessing component names or rewriting
                        registry source from scratch.
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
