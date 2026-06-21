import type { Metadata } from "next";
import Link from "next/link";

import {
  docsPageListClassName,
  docsPageSectionClassName,
  docsPageSectionTitleClassName,
  guidePageBodyClassName,
} from "@/components/docs/docs-page-layout";
import { GuideDocsPage } from "@/components/docs/page-shell";
import { ShadcnDevDependencyCommand } from "@/components/docs/split/shadcn-dev-dependency-command";
import { McpAutoConfigTabs } from "@/components/mcp-auto-config-tabs";
import { McpManualConfigTabs } from "@/components/mcp-manual-config-tabs";
import { PageReveal } from "@/components/page-reveal";
import { SITE } from "@/constants";
import { createMetadata } from "@/seo/metadata";

const mcpDescription = `Connect ${SITE.NAME} to shadcn MCP so AI tools can add registry components to your codebase.`;

export const metadata: Metadata = createMetadata({
  title: `MCP | ${SITE.NAME}`,
  description: mcpDescription,
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

const registryConfig = `{
  "registries": {
    "@iconiq": "https://iconiqui.com/r/{name}.json"
  }
}`;

const promptExamples = `Add the @iconiq/b-button component to this page.
Install the @iconiq/accordion component and keep the generated files editable.
Show me all available components in the iconiq registry.
Create a feature section using Iconiq components and keep the generated files local.`;

const officialDocsHref = "https://ui.shadcn.com/docs/mcp";

export default function McpPage() {
  return (
    <GuideDocsPage
      breadcrumbs={breadcrumbs}
      description={mcpDescription}
      pageUrl="/mcp"
      title="MCP"
    >
      <div className={guidePageBodyClassName}>
        <PageReveal inView>
          <p>
            If you work with Cursor, Claude Code, or another MCP-compatible
            coding tool, you can let the shadcn MCP flow expose the {SITE.NAME}{" "}
            registry to the assistant. That keeps the experience natural for
            AI-driven edits while still landing real component files inside your
            repository.
          </p>
          <p>
            For the latest shadcn MCP behavior, keep the official docs handy at{" "}
            <a
              className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
              href={officialDocsHref}
              rel="noreferrer"
              target="_blank"
            >
              ui.shadcn.com/docs/mcp
            </a>
            . The setup below adapts that flow for the {SITE.NAME} registry.
          </p>
        </PageReveal>

        <PageReveal inView>
          <section
            className={docsPageSectionClassName}
            id="automatic-configuration"
          >
            <h2 className={docsPageSectionTitleClassName}>
              Automatic configuration
            </h2>
            <p>
              The quickest path is the shadcn MCP init flow. Pick the client you
              use, run the generated command in the same project where you want
              to install {SITE.NAME} components, and let shadcn scaffold the
              editor-side configuration it supports.
            </p>
            <McpAutoConfigTabs />
            <ul className={docsPageListClassName}>
              <li>
                Run the command from the root of the app where your assistant
                should install Iconiq components.
              </li>
              <li>
                Restart or re-enable your MCP client after the config is written
                so the server is reloaded.
              </li>
              <li>
                Even with automatic setup, you still need the Iconiq registry
                entry in <code>components.json</code>.
              </li>
            </ul>
          </section>
        </PageReveal>

        <PageReveal inView>
          <section
            className={docsPageSectionClassName}
            id="manual-configuration"
          >
            <h2 className={docsPageSectionTitleClassName}>
              Manual configuration
            </h2>
            <p>
              If you want full control or your client needs a manual setup path,
              install <code>shadcn</code> as a dev dependency and add the MCP
              server entry yourself.
            </p>
            <ShadcnDevDependencyCommand />
            <McpManualConfigTabs />
          </section>
        </PageReveal>

        <PageReveal inView>
          <section
            className={docsPageSectionClassName}
            id="registry-configuration"
          >
            <h2 className={docsPageSectionTitleClassName}>
              Registry configuration
            </h2>
            <p>
              The standard shadcn/ui registry works without extra registry
              setup, but {SITE.NAME} uses a namespaced registry. Add it to your
              project&apos;s <code>components.json</code> so shadcn and your AI
              tooling know how to resolve Iconiq component names.
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
            <ul className={docsPageListClassName}>
              <li>
                Keep any registries you already use and add <code>@iconiq</code>{" "}
                alongside them.
              </li>
              <li>
                The <code>{"{name}"}</code> token lets shadcn resolve registry
                entries like <code>@iconiq/b-button</code> and{" "}
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
          <section className={docsPageSectionClassName} id="usage-examples">
            <h2 className={docsPageSectionTitleClassName}>Example prompts</h2>
            <p>
              With MCP enabled and the registry configured, you can ask your
              coding assistant to work with {SITE.NAME} in plain language. These
              prompts map well to the registry workflow:
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
              The important part is that the assistant should still use the
              registry install flow rather than inventing a fresh component from
              scratch when an Iconiq version already exists.
            </p>
          </section>
        </PageReveal>

        <PageReveal inView>
          <section className={docsPageSectionClassName} id="troubleshooting">
            <h2 className={docsPageSectionTitleClassName}>Troubleshooting</h2>
            <p>
              If MCP is not responding, the fix is usually one of a few boring
              but important checks.
            </p>
            <ul className={docsPageListClassName}>
              <li>
                Confirm the MCP server is enabled in your editor and restart the
                client after configuration changes.
              </li>
              <li>
                Make sure <code>shadcn</code> is installed and that your project
                has a valid <code>components.json</code>.
              </li>
              <li>
                If you see <code>No tools or prompts</code>, run{" "}
                <code>npx clear-npx-cache</code> and then re-enable the MCP
                server.
              </li>
              <li>
                Verify the Iconiq registry URL is reachable and the{" "}
                <code>@iconiq</code> namespace is spelled correctly in your
                prompt or install request.
              </li>
            </ul>
          </section>
        </PageReveal>
      </div>

      <PageReveal className="mt-12" inView>
        <nav className="flex items-center justify-between border-border/80 border-t pt-12">
          <Link
            className="group flex max-w-40 flex-col gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
            href="/marketplace"
          >
            <span className="text-muted-foreground/75 transition-colors group-hover:text-muted-foreground">
              Previous
            </span>
            <span className="truncate font-medium text-foreground">
              Marketplace
            </span>
          </Link>
          <Link
            className="group flex max-w-40 flex-col items-end gap-1 text-right text-muted-foreground text-sm transition-colors hover:text-foreground"
            href="/navigation/accordion"
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
    </GuideDocsPage>
  );
}
