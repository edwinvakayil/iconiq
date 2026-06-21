import type { Metadata } from "next";
import Link from "next/link";
import {
  docsPageListClassName,
  docsPageSectionClassName,
  docsPageSectionTitleClassName,
  guidePageBodyClassName,
} from "@/components/docs/docs-page-layout";
import { GuideDocsPage } from "@/components/docs/page-shell";
import { InstallCommand } from "@/components/docs/split/install-command";
import { RegistryUrlInstallCommand } from "@/components/docs/split/registry-url-install-command";
import { PageReveal } from "@/components/page-reveal";
import { SITE } from "@/constants";
import { createMetadata } from "@/seo/metadata";

const installationTagline =
  "Install editable, fluid motion-powered UI directly into your app.";

export const metadata: Metadata = createMetadata({
  title: `Installation | ${SITE.NAME}`,
  description:
    "Install Iconiq with the shadcn registry workflow, keep the generated files in your project, and work with editable, motion-refined UI directly in your codebase.",
  canonical: "/installation",
  ogTitle: `Install ${SITE.NAME} Components`,
  keywords: [
    "install shadcn registry components",
    "editable ui components",
    "iconiq installation guide",
  ],
});

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Getting Started" },
  { label: "Installation" },
];

export default function InstallationPage() {
  return (
    <GuideDocsPage
      breadcrumbs={breadcrumbs}
      description={installationTagline}
      pageUrl="/installation"
      title="Installation"
    >
      <div className={guidePageBodyClassName}>
        <PageReveal inView>
          <p>
            The installation flow is intentionally simple: pick a component, run
            the command, and keep the generated source files inside your own
            app. That gives your team immediate ownership over fluid motion,
            styling, structure, and accessibility decisions.
          </p>
        </PageReveal>

        <PageReveal inView>
          <section className={docsPageSectionClassName} id="registry-workflow">
            <h2 className={docsPageSectionTitleClassName}>Registry workflow</h2>
            <p>
              The default path mirrors the way shadcn-style registries are meant
              to be used. Install a single component first, confirm the
              generated files look right in your project, and then repeat the
              same flow as your interface grows.
            </p>
            <InstallCommand component="b-button" />
            <ul className={docsPageListClassName}>
              <li>Run one command for the component you want to add.</li>
              <li>
                Let the registry place the implementation and any required
                helper files directly in your codebase.
              </li>
              <li>
                Review the files locally and adjust them to match your product
                conventions.
              </li>
            </ul>
          </section>
        </PageReveal>

        <PageReveal inView>
          <section className={docsPageSectionClassName} id="registry-url">
            <h2 className={docsPageSectionTitleClassName}>Registry URL</h2>
            <p>
              If you want to reference a specific registry file directly, you
              can install from the hosted JSON path instead of the scoped
              package name. This is useful when you want the exact source URL in
              front of you during review or automation.
            </p>
            <RegistryUrlInstallCommand registryPath="button.json" />
            <ul className={docsPageListClassName}>
              <li>
                The direct URL follows the same shadcn add flow as the scoped
                component command.
              </li>
              <li>
                Most entries install as a single self-contained component file
                through the same registry flow.
              </li>
              <li>
                It works well when you want to point teammates or tooling at a
                specific registry entry.
              </li>
            </ul>
          </section>
        </PageReveal>
      </div>

      <PageReveal className="mt-12" inView>
        <nav className="flex items-center justify-between border-border/80 border-t pt-12">
          <Link
            className="group flex max-w-40 flex-col gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
            href="/introduction"
          >
            <span className="text-muted-foreground/75 transition-colors group-hover:text-muted-foreground">
              Previous
            </span>
            <span className="truncate font-medium text-foreground">
              Introduction
            </span>
          </Link>
          <Link
            className="group flex max-w-40 flex-col items-end gap-1 text-right text-muted-foreground text-sm transition-colors hover:text-foreground"
            href="/marketplace"
          >
            <span className="text-muted-foreground/75 transition-colors group-hover:text-muted-foreground">
              Next
            </span>
            <span className="truncate font-medium text-foreground">
              Marketplace
            </span>
          </Link>
        </nav>
      </PageReveal>
    </GuideDocsPage>
  );
}
