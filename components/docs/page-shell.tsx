import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { ComponentDemoCanvas } from "@/components/docs/component-demo-canvas";
import { ComponentInstallationTabs } from "@/components/docs/component-installation-tabs";
import { ComponentPageRail } from "@/components/docs/component-page-rail";
import { PageCopyActions } from "@/components/docs/page-copy-actions";
import {
  PageReveal,
  PageStagger,
  PageStaggerItem,
} from "@/components/page-reveal";
import { Separator } from "@/components/ui/separator";
import { nodeToText } from "@/lib/node-to-text";
import { SITE_SECTIONS } from "@/lib/site-nav";
import { cn } from "@/lib/utils";
import { BreadcrumbJsonLdClient } from "@/seo/breadcrumb-json-ld-client";
import { ComponentDocJsonLd } from "@/seo/json-ld";

type BreadcrumbItem = {
  label: string;
  href?: string;
  hideOnDesktop?: boolean;
};

type HeroMetaItem = {
  label: string;
  value: ReactNode;
};

type DetailField = {
  name: ReactNode;
  type?: ReactNode;
  defaultValue?: ReactNode;
  required?: boolean;
  description: ReactNode;
};

type DetailItem = {
  id: string;
  title: string;
  content?: ReactNode;
  summary?: ReactNode;
  fields?: DetailField[];
  notes?: ReactNode[];
  registryPath?: string;
};

type ComponentDocsExtraSection = {
  id: string;
  title: string;
  content: ReactNode;
};

function DocsBreadcrumbs({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  const visibleItems = items;
  const usesEditorialBreadcrumb =
    visibleItems.length >= 2 &&
    ["components", "foundation", "getting started", "texts"].includes(
      visibleItems
        .find((item) => item.label.toLowerCase() !== "docs")
        ?.label.toLowerCase() ?? ""
    );

  if (visibleItems.length === 0) {
    return null;
  }

  if (usesEditorialBreadcrumb) {
    return (
      <nav aria-label="Breadcrumb" className={cn("mb-4", className)}>
        <ol className="flex flex-wrap items-center gap-1.5 break-words text-muted-foreground text-sm sm:gap-2.5">
          {visibleItems.map((item, index) => {
            const isLast = index === visibleItems.length - 1;
            const hasLaterDesktopVisibleItem = visibleItems
              .slice(index + 1)
              .some((candidate) => !candidate.hideOnDesktop);

            return (
              <li
                className={cn(
                  "inline-flex items-center gap-1.5",
                  item.hideOnDesktop && "lg:hidden"
                )}
                key={`${item.label}-${index}`}
              >
                {item.href && !isLast ? (
                  <Link
                    className="text-secondary transition-colors hover:text-foreground"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                ) : isLast ? (
                  <span className="text-foreground">{item.label}</span>
                ) : (
                  <span className="text-secondary">{item.label}</span>
                )}
                {isLast ? null : (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "text-muted-foreground/50",
                      !(item.hideOnDesktop || !hasLaterDesktopVisibleItem) &&
                        "lg:inline",
                      (item.hideOnDesktop || !hasLaterDesktopVisibleItem) &&
                        "lg:hidden"
                    )}
                  >
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("mb-4", className)}>
      <ol className="flex flex-wrap items-center gap-2 font-mono text-[13px] text-muted-foreground tracking-[0.12em]">
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;
          const hasLaterDesktopVisibleItem = visibleItems
            .slice(index + 1)
            .some((candidate) => !candidate.hideOnDesktop);

          return (
            <li
              className={cn(
                "inline-flex items-center gap-2",
                item.hideOnDesktop && "lg:hidden"
              )}
              key={`${item.label}-${index}`}
            >
              {item.href && !isLast ? (
                <Link
                  className="transition-colors hover:text-foreground"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-foreground" : undefined}>
                  {item.label}
                </span>
              )}
              {isLast ? null : (
                <span
                  aria-hidden="true"
                  className={cn(
                    "inline-flex",
                    !(item.hideOnDesktop || !hasLaterDesktopVisibleItem) &&
                      "lg:inline-flex",
                    (item.hideOnDesktop || !hasLaterDesktopVisibleItem) &&
                      "lg:hidden"
                  )}
                >
                  <ChevronRight className="size-3.5 text-muted-foreground/70" />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function DocsHero({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: ReactNode;
  meta?: HeroMetaItem[];
  actions?: ReactNode;
}) {
  return (
    <section className="space-y-6 pt-2">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-4xl space-y-4">
          {eyebrow ? (
            <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.32em]">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-4xl text-foreground tracking-[-0.08em] sm:text-5xl lg:text-[3.6rem]">
            {title}
          </h1>
          <p className="max-w-3xl text-[15px] text-secondary leading-7 sm:text-[17px] sm:leading-8">
            {description}
          </p>
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2 self-start lg:pt-10">
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  );
}

const COMPONENT_NAV_ITEMS =
  SITE_SECTIONS.find((section) => section.label === "Components")?.children ??
  [];

function getComponentNeighbors(componentName: string) {
  const currentHref = `/components/${componentName}`;
  const currentIndex = COMPONENT_NAV_ITEMS.findIndex(
    (item) => item.href === currentHref
  );

  if (currentIndex === -1) {
    return {
      previousItem: null,
      nextItem: null,
    };
  }

  return {
    previousItem:
      currentIndex > 0 ? COMPONENT_NAV_ITEMS[currentIndex - 1] : null,
    nextItem:
      currentIndex < COMPONENT_NAV_ITEMS.length - 1
        ? COMPONENT_NAV_ITEMS[currentIndex + 1]
        : null,
  };
}

function ComponentPager({ componentName }: { componentName: string }) {
  const { previousItem, nextItem } = getComponentNeighbors(componentName);

  const baseButtonClassName =
    "inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <>
      {previousItem ? (
        <Link
          aria-label={`Go to ${previousItem.label}`}
          className={baseButtonClassName}
          href={previousItem.href}
          title={previousItem.label}
        >
          <ChevronLeft className="size-4" />
        </Link>
      ) : null}
      {nextItem ? (
        <Link
          aria-label={`Go to ${nextItem.label}`}
          className={baseButtonClassName}
          href={nextItem.href}
          title={nextItem.label}
        >
          <ChevronRight className="size-4" />
        </Link>
      ) : null}
    </>
  );
}

function ComponentPrevNextNav({ componentName }: { componentName: string }) {
  const { previousItem, nextItem } = getComponentNeighbors(componentName);

  return (
    <nav className="mt-14 flex items-center justify-between border-border/80 border-t pt-8">
      {previousItem ? (
        <Link
          className="group flex max-w-44 flex-col gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
          href={previousItem.href}
        >
          <span className="text-muted-foreground/75 transition-colors group-hover:text-muted-foreground">
            Previous
          </span>
          <span className="truncate font-medium text-foreground">
            {previousItem.label}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {nextItem ? (
        <Link
          className="group flex max-w-44 flex-col items-end gap-1 text-right text-muted-foreground text-sm transition-colors hover:text-foreground"
          href={nextItem.href}
        >
          <span className="text-muted-foreground/75 transition-colors group-hover:text-muted-foreground">
            Next
          </span>
          <span className="truncate font-medium text-foreground">
            {nextItem.label}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}

function DocsSection({
  title,
  description,
  className,
  children,
}: {
  index?: string;
  title: string;
  description?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <PageReveal className={className} inView>
      <section className="relative min-w-0 px-0 py-0">
        <div className="space-y-5">
          <Separator />
          <div className="space-y-2">
            <h2 className="text-foreground text-xl tracking-[-0.04em] sm:text-2xl">
              {title}
            </h2>
            {description ? (
              <p className="max-w-3xl text-[14px] text-secondary leading-6">
                {description}
              </p>
            ) : null}
          </div>
          <div>{children}</div>
        </div>
      </section>
    </PageReveal>
  );
}

function DocsPageShell({
  breadcrumbs,
  eyebrow,
  title,
  description,
  meta,
  heroActions,
  children,
  className,
}: {
  breadcrumbs: BreadcrumbItem[];
  eyebrow: string;
  title: string;
  description: ReactNode;
  meta?: HeroMetaItem[];
  heroActions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className="min-w-0 flex-1">
      <BreadcrumbJsonLdClient items={breadcrumbs} />
      <PageStagger
        className={cn(
          "mx-auto w-full min-w-0 max-w-[1480px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10",
          className
        )}
        delayChildren={0.04}
      >
        <PageStaggerItem>
          <DocsBreadcrumbs items={breadcrumbs} />
        </PageStaggerItem>
        <PageStaggerItem>
          <DocsHero
            actions={heroActions}
            description={description}
            eyebrow={eyebrow}
            meta={meta}
            title={title}
          />
        </PageStaggerItem>
        <PageStaggerItem>
          <div className="mt-10 grid min-w-0 gap-5 lg:grid-cols-12">
            {children}
          </div>
        </PageStaggerItem>
      </PageStagger>
    </main>
  );
}

function ComponentSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="scroll-mt-32" id={id}>
      <h2 className="mt-16 border-border/80 border-b pb-4 font-semibold text-xl tracking-tight first:mt-0">
        {title}
      </h2>
      <div className="pt-6">{children}</div>
    </section>
  );
}

function DetailMetaValue({ value }: { value: ReactNode }) {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return (
      <code className="font-mono text-[11px] text-foreground leading-5">
        {String(value)}
      </code>
    );
  }

  return <div className="text-[11px] text-foreground leading-5">{value}</div>;
}

function DetailFields({ fields }: { fields: DetailField[] }) {
  return (
    <div className="space-y-3">
      {fields.map((field) => (
        <div
          className="grid gap-3 border-border/70 border-t pt-4 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:gap-6"
          key={String(field.name)}
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-medium text-[15px] text-foreground tracking-[-0.02em]">
                {field.name}
              </span>
              {field.type ? <DetailMetaValue value={field.type} /> : null}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              {field.required ? (
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.16em]">
                  Required
                </span>
              ) : null}
              {field.defaultValue !== undefined ? (
                <span className="inline-flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.16em]">
                  <span>Default</span>
                  <DetailMetaValue value={field.defaultValue} />
                </span>
              ) : null}
            </div>
          </div>
          <div className="text-[14px] text-secondary leading-6">
            {field.description}
          </div>
        </div>
      ))}
    </div>
  );
}

function getDetailDescriptor(item: DetailItem) {
  if (item.fields?.length) {
    return `${item.fields.length} ${item.fields.length === 1 ? "prop" : "props"}`;
  }

  return "Expand detail";
}

function DetailNotes({
  itemId,
  notes,
}: {
  itemId: string;
  notes: ReactNode[];
}) {
  return (
    <div className="space-y-3">
      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
        Notes
      </p>
      <div className="space-y-3">
        {notes.map((note, index) => (
          <div
            className="border-border/80 border-l pl-4 text-[14px] text-secondary leading-6"
            key={`${itemId}-note-${index}`}
          >
            {note}
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailBody({ item }: { item: DetailItem }) {
  const detailLead = item.summary ?? item.content;

  return (
    <div className="space-y-5">
      {detailLead ? (
        <div className="text-[14px] text-secondary leading-6">{detailLead}</div>
      ) : null}

      {item.fields?.length ? (
        <>
          {detailLead ? <Separator /> : null}
          <DetailFields fields={item.fields} />
        </>
      ) : null}

      {item.notes?.length ? (
        <>
          {detailLead || item.fields?.length ? <Separator /> : null}
          <DetailNotes itemId={item.id} notes={item.notes} />
        </>
      ) : null}
    </div>
  );
}

function DetailSectionRow({ item }: { item: DetailItem }) {
  const descriptor = getDetailDescriptor(item);

  return (
    <article className="grid gap-5 border-border/80 border-t pt-6 first:border-t-0 first:pt-0 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
      <div className="space-y-2">
        <h3 className="font-medium text-[18px] text-foreground tracking-[-0.03em]">
          {item.title}
        </h3>
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
          {descriptor}
        </p>
      </div>
      <div className="pb-1">
        <DetailBody item={item} />
      </div>
    </article>
  );
}

function DetailLedger({ details }: { details: DetailItem[] }) {
  const documentedDetails = details.filter((item) => item.fields?.length);

  return (
    <div className="space-y-6">
      {documentedDetails.map((item) => (
        <DetailSectionRow item={item} key={item.id} />
      ))}
    </div>
  );
}

function buildComponentPageCopyContent({
  title,
  description,
  componentName,
  usageCode,
  usageDescription,
  details,
}: {
  title: string;
  description: ReactNode;
  componentName: string;
  usageCode: string;
  usageDescription?: ReactNode;
  details: DetailItem[];
}) {
  const lines = [
    `# ${title}`,
    nodeToText(description),
    "",
    "## Installation",
    `npx shadcn@latest add @iconiq/${componentName}`,
    "",
    "## Usage",
    usageDescription ? nodeToText(usageDescription) : "",
    usageCode.trim(),
    "",
    "## Props",
  ];

  for (const item of details) {
    lines.push(`### ${item.title}`);

    const summary = nodeToText(item.summary ?? item.content);
    if (summary) {
      lines.push(summary);
    }

    for (const field of item.fields ?? []) {
      const name = nodeToText(field.name);
      const type = nodeToText(field.type);
      const defaultValue = nodeToText(field.defaultValue);
      const descriptionText = nodeToText(field.description);

      lines.push(
        `- ${name}${type ? ` (${type})` : ""}${field.required ? " [required]" : ""}${defaultValue ? ` [default: ${defaultValue}]` : ""}: ${descriptionText}`
      );
    }

    for (const note of item.notes ?? []) {
      lines.push(`- ${nodeToText(note)}`);
    }

    lines.push("");
  }

  return lines.join("\n").trim();
}

function ComponentDocsPage({
  breadcrumbs,
  eyebrow = "",
  title,
  description,
  componentName,
  preview,
  previewCode,
  usageCode,
  usageDescription,
  details,
  extraSections = [],
  previewClassName,
  v0PageCode,
}: {
  breadcrumbs: BreadcrumbItem[];
  eyebrow?: string;
  title: string;
  description: ReactNode;
  componentName: string;
  preview: ReactNode;
  previewDescription?: ReactNode;
  previewCode?: string;
  usageCode: string;
  v0PageCode?: string;
  usageDescription?: ReactNode;
  details: DetailItem[];
  extraSections?: ComponentDocsExtraSection[];
  detailsDescription?: ReactNode;
  installDescription?: ReactNode;
  actionDescription?: ReactNode;
  railNotes?: string[];
  previewClassName?: string;
}) {
  const pageCopyContent = buildComponentPageCopyContent({
    title,
    description,
    componentName,
    usageCode,
    usageDescription,
    details,
  });

  const sectionLinks = [
    { id: "installation", label: "Installation" },
    ...extraSections.map((section) => ({
      id: section.id,
      label: section.title,
    })),
    { id: "props", label: "Props" },
  ];

  return (
    <>
      <ComponentDocJsonLd
        componentName={componentName}
        description={description}
        details={details}
        title={title}
      />
      <div className="mx-auto w-full min-w-0 max-w-[1600px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        <BreadcrumbJsonLdClient items={breadcrumbs} />
        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_248px] xl:gap-4">
          <main className="min-w-0">
            <article className="min-w-0 max-w-4xl">
              <header className="space-y-6">
                <div className="space-y-3">
                  <DocsBreadcrumbs items={breadcrumbs} />
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl space-y-2">
                      {eyebrow ? (
                        <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.28em]">
                          {eyebrow}
                        </p>
                      ) : null}
                      <h1 className="scroll-m-20 font-semibold text-3xl text-foreground tracking-tighter">
                        {title}
                      </h1>
                      <p className="max-w-3xl text-base text-muted-foreground">
                        {description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start">
                      <PageCopyActions
                        componentName={componentName}
                        pageContent={pageCopyContent}
                        title={title}
                        v0PageCode={v0PageCode}
                      />
                      <ComponentPager componentName={componentName} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <ComponentDemoCanvas
                    code={previewCode ?? usageCode}
                    componentName={componentName}
                    preview={preview}
                    previewClassName={previewClassName}
                    v0PageCode={v0PageCode}
                  />
                </div>
              </header>

              <div className="mt-14 space-y-14">
                <ComponentSection id="installation" title="Installation">
                  <div className="space-y-5">
                    <ComponentInstallationTabs componentName={componentName} />
                  </div>
                </ComponentSection>

                {extraSections.map((section) => (
                  <ComponentSection
                    id={section.id}
                    key={section.id}
                    title={section.title}
                  >
                    {section.content}
                  </ComponentSection>
                ))}

                <ComponentSection id="props" title="Props">
                  <DetailLedger details={details} />
                </ComponentSection>
              </div>

              <ComponentPrevNextNav componentName={componentName} />
            </article>
          </main>

          <ComponentPageRail
            componentName={componentName}
            sections={sectionLinks}
          />
        </div>
      </div>
    </>
  );
}

export {
  DocsBreadcrumbs,
  DocsHero,
  DocsPageShell,
  DocsSection,
  ComponentDocsPage,
  DetailLedger,
};
export type { BreadcrumbItem, DetailField, DetailItem, HeroMetaItem };
