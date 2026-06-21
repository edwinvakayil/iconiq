import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { DocsFileStructure } from "@/components/docs/split/docs-file-structure";
import { DocsHomeButton } from "@/components/docs/split/docs-home-button";
import { DocsLeftColumn } from "@/components/docs/split/docs-left-column";
import {
  DocsPreviewWrapper,
  type VariantItem,
} from "@/components/docs/split/docs-preview-wrapper";
import { DocsPropsTable } from "@/components/docs/split/docs-props-table";
import { DocsSection } from "@/components/docs/split/docs-section";
import {
  ComponentDocsSidebarShell,
  DocsSidebarDesktopAnchor,
  DocsSidebarMobileAnchor,
  FloatingDocsSidebarLazy,
} from "@/components/docs/split/floating-docs-sidebar-lazy";
import { InstallCommand } from "@/components/docs/split/install-command";
import { PageContextMenu } from "@/components/docs/split/page-context-menu";
import { SplitUsageCode } from "@/components/docs/split/split-usage-code";
import { nodeToText } from "@/lib/node-to-text";
import { SECTION_PATH_PREFIX } from "@/lib/section-paths";
import { SITE_SECTIONS } from "@/lib/site-nav";
import { cn } from "@/lib/utils";
import { BreadcrumbJsonLd } from "@/seo/breadcrumb-json-ld";
import { ComponentDocJsonLd } from "@/seo/json-ld";

type BreadcrumbItem = {
  label: string;
  href?: string;
  hideOnDesktop?: boolean;
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

function inferDocsPageUrl(sectionLabel: string, itemSlug: string) {
  const navItem = SITE_SECTIONS.find(
    (section) => section.label.toLowerCase() === sectionLabel.toLowerCase()
  )?.children.find((item) => item.href.split("/").pop() === itemSlug);

  if (navItem) {
    return navItem.href;
  }

  const sectionPrefix =
    SECTION_PATH_PREFIX[sectionLabel as keyof typeof SECTION_PATH_PREFIX];

  if (sectionPrefix) {
    return `${sectionPrefix}/${itemSlug}`;
  }

  return `/${itemSlug}`;
}

function appendDetailCopyLines(lines: string[], item: DetailItem) {
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
    [
      "components",
      "foundation",
      "getting started",
      "blocks",
      "buttons & actions",
      "inputs & forms",
      "overlay & popups",
      "navigation",
      "display & content",
      "feedback & alerts",
      "layout & toolbars",
      "radix ui + base ui",
      "texts",
      "special one",
    ].includes(
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
        <ol className="flex flex-wrap items-center gap-1.5 break-words text-base text-muted-foreground sm:gap-2.5">
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
      <ol className="flex flex-wrap items-center gap-2 font-mono text-[15px] text-muted-foreground tracking-[0.12em]">
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

function getSectionNavItems(sectionLabel: string) {
  return (
    SITE_SECTIONS.find(
      (section) => section.label.toLowerCase() === sectionLabel.toLowerCase()
    )?.children ?? []
  );
}

function getSectionNeighbors(sectionLabel: string, itemSlug: string) {
  const navItems = getSectionNavItems(sectionLabel);
  const currentIndex = navItems.findIndex(
    (item) => item.href.split("/").pop() === itemSlug
  );

  if (currentIndex === -1) {
    return {
      previousItem: null,
      nextItem: null,
    };
  }

  return {
    previousItem: currentIndex > 0 ? navItems[currentIndex - 1] : null,
    nextItem:
      currentIndex < navItems.length - 1 ? navItems[currentIndex + 1] : null,
  };
}

function SectionPager({
  sectionLabel,
  itemSlug,
}: {
  sectionLabel: string;
  itemSlug: string;
}) {
  const { previousItem, nextItem } = getSectionNeighbors(
    sectionLabel,
    itemSlug
  );

  const activeButtonClassName =
    "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
  const disabledButtonClassName =
    "inline-flex size-8 cursor-default items-center justify-center rounded-md text-muted-foreground/35";

  return (
    <>
      {previousItem ? (
        <Link
          aria-label={`Go to ${previousItem.label}`}
          className={activeButtonClassName}
          href={previousItem.href}
          title={previousItem.label}
        >
          <ArrowLeft className="size-4" />
        </Link>
      ) : (
        <button
          aria-label="No previous page"
          className={disabledButtonClassName}
          disabled
          title="No previous page"
          type="button"
        >
          <ArrowLeft className="size-4" />
        </button>
      )}
      {nextItem ? (
        <Link
          aria-label={`Go to ${nextItem.label}`}
          className={activeButtonClassName}
          href={nextItem.href}
          title={nextItem.label}
        >
          <ArrowRight className="size-4" />
        </Link>
      ) : (
        <button
          aria-label="No next page"
          className={disabledButtonClassName}
          disabled
          title="No next page"
          type="button"
        >
          <ArrowRight className="size-4" />
        </button>
      )}
    </>
  );
}

function SectionPrevNextNav({
  sectionLabel,
  itemSlug,
}: {
  sectionLabel: string;
  itemSlug: string;
}) {
  const { previousItem, nextItem } = getSectionNeighbors(
    sectionLabel,
    itemSlug
  );

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
      <code className="font-mono text-[12px] text-muted-foreground leading-5">
        {String(value)}
      </code>
    );
  }

  return (
    <span className="font-mono text-[12px] text-muted-foreground leading-5">
      {value}
    </span>
  );
}

function DetailFields({
  fields,
  itemId,
}: {
  fields: DetailField[];
  itemId: string;
}) {
  return (
    <div className="divide-y divide-border/50 border-border/50 border-t">
      {fields.map((field, index) => (
        <div
          className="grid gap-4 py-5 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] md:gap-10"
          key={`${itemId}-${String(field.name)}-${index}`}
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <code className="font-mono text-[14px] text-foreground">
                {field.name}
              </code>
              {field.type ? <DetailMetaValue value={field.type} /> : null}
            </div>
            {field.required || field.defaultValue !== undefined ? (
              <p className="font-mono text-[11px] text-muted-foreground leading-5">
                {field.required ? "Required" : null}
                {field.required && field.defaultValue !== undefined
                  ? " · "
                  : null}
                {field.defaultValue !== undefined ? (
                  <>
                    Default <DetailMetaValue value={field.defaultValue} />
                  </>
                ) : null}
              </p>
            ) : null}
          </div>
          <div className="text-[15px] text-secondary leading-6">
            {field.description}
          </div>
        </div>
      ))}
    </div>
  );
}

function DetailNotes({
  itemId,
  notes,
  showDivider = true,
}: {
  itemId: string;
  notes: ReactNode[];
  showDivider?: boolean;
}) {
  return (
    <div
      className={cn(
        "space-y-2.5",
        showDivider && "border-border/50 border-t border-dotted pt-5"
      )}
    >
      {notes.map((note, index) => (
        <p
          className="text-[14px] text-muted-foreground leading-6"
          key={`${itemId}-note-${index}`}
        >
          {note}
        </p>
      ))}
    </div>
  );
}

function DetailSection({ item }: { item: DetailItem }) {
  const lead = item.summary ?? item.content;
  const fields = item.fields ?? [];
  const notes = item.notes ?? [];

  if (!lead && fields.length === 0 && notes.length === 0) {
    return null;
  }

  return (
    <section>
      <h3 className="mb-5 font-medium text-[17px] text-foreground tracking-[-0.02em]">
        {item.title}
      </h3>
      <div className="space-y-6">
        {lead ? (
          <p className="text-[15px] text-secondary leading-6">{lead}</p>
        ) : null}
        {fields.length > 0 ? (
          <DetailFields fields={fields} itemId={item.id} />
        ) : null}
        {notes.length > 0 ? (
          <DetailNotes
            itemId={item.id}
            notes={notes}
            showDivider={Boolean(lead || fields.length)}
          />
        ) : null}
      </div>
    </section>
  );
}

function DetailLedger({ details }: { details: DetailItem[] }) {
  const sections = details
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => {
      const lead = item.summary ?? item.content;
      return (
        Boolean(lead) ||
        Boolean(item.fields?.length) ||
        Boolean(item.notes?.length)
      );
    });

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {sections.map(({ item, index }) => (
        <DetailSection item={item} key={`${item.id}-${index}`} />
      ))}
    </div>
  );
}

function detailItemsToProps(details: DetailItem[]) {
  const props: {
    id: string;
    name: string;
    type: string;
    default?: string;
    description: string;
  }[] = [];

  for (const item of details) {
    for (const field of item.fields ?? []) {
      const name = nodeToText(field.name);
      props.push({
        id: `${item.id}-${name}`,
        name,
        type: nodeToText(field.type) || "—",
        default:
          field.defaultValue !== undefined
            ? nodeToText(field.defaultValue)
            : undefined,
        description: nodeToText(field.description),
      });
    }
  }

  return props;
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
    appendDetailCopyLines(lines, item);
  }

  return lines.join("\n").trim();
}

function GuideDocsPage({
  breadcrumbs,
  title,
  description,
  pageUrl,
  children,
  headerActions,
}: {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description: ReactNode;
  pageUrl: string;
  children: ReactNode;
  headerActions?: ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd currentPath={pageUrl} items={breadcrumbs} />
      <div
        className="flex h-full min-h-screen w-full flex-col text-foreground lg:h-screen"
        data-docs-layout
      >
        <DocsLeftColumn fullWidth>
          <div className="w-full px-5 pt-8 pb-40 lg:pt-10 lg:pr-10 lg:pl-8">
            <header className="pb-6">
              <div className="flex w-full items-center gap-2.5">
                <FloatingDocsSidebarLazy />
                <nav
                  aria-label="Breadcrumb"
                  className="flex min-w-0 flex-1 items-center gap-1.5 font-normal text-[15px] text-zinc-500 tracking-[-0.01em] dark:text-zinc-400"
                >
                  <Link
                    className="shrink-0 transition-colors hover:text-zinc-800 dark:hover:text-zinc-200"
                    href="/introduction"
                  >
                    Getting Started
                  </Link>
                  <ChevronRight
                    aria-hidden
                    className="size-3.5 shrink-0 opacity-50"
                  />
                  <span className="truncate font-medium text-zinc-900 dark:text-zinc-100">
                    {title}
                  </span>
                </nav>
                <DocsHomeButton />
              </div>

              <div className="max-w-3xl">
                <div className="mt-10 flex flex-wrap items-end gap-x-4 gap-y-3">
                  <h1 className="font-bold text-[2.5rem] text-zinc-900 leading-[1.08] tracking-[-0.03em] dark:text-zinc-50">
                    {title}
                  </h1>
                  {headerActions ? (
                    <div className="shrink-0">{headerActions}</div>
                  ) : null}
                </div>

                <p className="mt-3 max-w-2xl text-[15px] text-zinc-600 leading-relaxed dark:text-zinc-400">
                  {description}
                </p>
              </div>
            </header>

            <div className="max-w-3xl">{children}</div>
          </div>
        </DocsLeftColumn>
      </div>
    </>
  );
}

function ComponentDocsPage({
  breadcrumbs,
  title,
  description,
  componentName,
  itemSlug,
  pageUrl,
  preview,
  usageCode,
  usageDescription,
  details,
  preInstallationSections = [],
  extraSections = [],
  installationContent,
  headerActions,
  previewClassName,
  examples = [],
  fullWidthPreview = false,
  hideDefaultPreviewVariant = false,
  installDescription,
  installPath,
  releasedAt,
  showPageActions = false,
}: {
  breadcrumbs: BreadcrumbItem[];
  eyebrow?: string;
  title: string;
  description: ReactNode;
  componentName: string;
  itemSlug?: string;
  pageUrl?: string;
  preview: ReactNode;
  previewDescription?: ReactNode;
  previewCode?: string;
  usageCode: string;
  v0PageCode?: string;
  usageDescription?: ReactNode;
  details: DetailItem[];
  preInstallationSections?: ComponentDocsExtraSection[];
  extraSections?: ComponentDocsExtraSection[];
  installationContent?: ReactNode;
  detailsDescription?: ReactNode;
  installDescription?: ReactNode;
  actionDescription?: ReactNode;
  railNotes?: string[];
  previewClassName?: string;
  headerActions?: ReactNode;
  editHref?: string;
  examples?: VariantItem[];
  fullWidthPreview?: boolean;
  hideDefaultPreviewVariant?: boolean;
  installPath?: string;
  releasedAt?: string;
  showPageActions?: boolean;
}) {
  const navSectionLabel = breadcrumbs[1]?.label ?? "Components";
  const resolvedItemSlug = itemSlug ?? componentName;
  const pageCopyContent = buildComponentPageCopyContent({
    title,
    description,
    componentName,
    usageCode,
    usageDescription,
    details,
  });

  const resolvedPageUrl =
    pageUrl ??
    breadcrumbs.at(-1)?.href ??
    inferDocsPageUrl(navSectionLabel, resolvedItemSlug);

  const propsTable = detailItemsToProps(details);
  const variantCodes = examples.map((example) => example.code || "");
  const variantTitles = examples.map((example) => example.title);
  const sectionCrumb = breadcrumbs.at(-2);
  const sectionLabel =
    sectionCrumb?.label ?? breadcrumbs[1]?.label ?? "Components";

  return (
    <>
      <ComponentDocJsonLd
        componentName={componentName}
        description={description}
        details={details}
        pageUrl={resolvedPageUrl}
        title={title}
      />
      <BreadcrumbJsonLd currentPath={resolvedPageUrl} items={breadcrumbs} />
      <ComponentDocsSidebarShell>
        <div
          className="flex h-full min-h-screen w-full flex-col text-foreground lg:h-screen lg:flex-row"
          data-docs-layout
        >
          <DocsLeftColumn>
            <div className="w-full px-5 pt-8 pb-40 lg:pt-10 lg:pr-10 lg:pl-8">
              <header className="pb-14 lg:pb-16">
                <div className="flex w-full items-center gap-2.5">
                  <DocsSidebarDesktopAnchor />
                  <nav
                    aria-label="Breadcrumb"
                    className="flex min-w-0 flex-1 items-center gap-1.5 font-normal text-[15px] text-zinc-500 tracking-[-0.01em] dark:text-zinc-400"
                  >
                    {sectionCrumb?.href ? (
                      <Link
                        className="shrink-0 transition-colors hover:text-zinc-800 dark:hover:text-zinc-200"
                        href={sectionCrumb.href}
                      >
                        {sectionLabel}
                      </Link>
                    ) : (
                      <span className="shrink-0">{sectionLabel}</span>
                    )}
                    <ChevronRight
                      aria-hidden
                      className="size-3.5 shrink-0 opacity-50"
                    />
                    <span className="truncate font-medium text-zinc-900 dark:text-zinc-100">
                      {title}
                    </span>
                  </nav>
                  <DocsHomeButton />
                </div>

                <div className="max-w-3xl">
                  <div className="mt-10 flex flex-wrap items-end gap-x-4 gap-y-3">
                    <h1 className="font-bold text-[2.5rem] text-zinc-900 leading-[1.08] tracking-[-0.03em] dark:text-zinc-50">
                      {title}
                    </h1>
                    {headerActions ? (
                      <div className="shrink-0">{headerActions}</div>
                    ) : null}
                  </div>

                  <p className="mt-3 max-w-2xl text-[15px] text-zinc-600 leading-relaxed dark:text-zinc-400">
                    {description}
                  </p>

                  {releasedAt ? (
                    <p className="mt-4 text-[13px] text-zinc-400 leading-5 dark:text-zinc-500">
                      Released {releasedAt}
                    </p>
                  ) : null}

                  {showPageActions ? (
                    <div className="mt-5">
                      <PageContextMenu
                        content={pageCopyContent}
                        pageUrl={resolvedPageUrl}
                      />
                    </div>
                  ) : null}
                </div>
              </header>

              <div className="max-w-3xl space-y-14 lg:space-y-16">
                {preInstallationSections.map((section) => (
                  <DocsSection
                    id={section.id}
                    key={section.id}
                    title={section.title}
                  >
                    {section.content}
                  </DocsSection>
                ))}

                <DocsSection id="installation" title="Installation">
                  {installDescription ? (
                    <div className="text-[14px] text-zinc-600 leading-6 dark:text-zinc-400">
                      {installDescription}
                    </div>
                  ) : null}
                  <InstallCommand
                    component={componentName}
                    key={componentName}
                  />
                  {installationContent}
                </DocsSection>

                <DocsSection id="file-structure" title="File Structure">
                  <DocsFileStructure
                    componentName={componentName}
                    installPath={installPath}
                    key={componentName}
                  />
                </DocsSection>

                <DocsSection id="usage" title="Usage">
                  <SplitUsageCode
                    hideDefaultTab={hideDefaultPreviewVariant}
                    key={componentName}
                    usageCode={usageCode}
                    variantCodes={variantCodes}
                    variantTitles={variantTitles}
                  />
                </DocsSection>

                {extraSections.map((section) => (
                  <DocsSection
                    id={section.id}
                    key={section.id}
                    title={section.title}
                  >
                    {section.content}
                  </DocsSection>
                ))}

                {propsTable.length > 0 ? (
                  <DocsSection id="api-reference" title="Props">
                    <DocsPropsTable key={componentName} props={propsTable} />
                  </DocsSection>
                ) : (
                  <DocsSection id="api-reference" title="API Reference">
                    <DetailLedger details={details} key={componentName} />
                  </DocsSection>
                )}
              </div>

              <div className="h-12" />
            </div>
          </DocsLeftColumn>

          <div
            className="z-20 order-first flex flex-1 flex-col bg-[#f3f4f6] lg:sticky lg:top-0 lg:order-last lg:h-full lg:max-w-1/2 lg:basis-1/2 dark:bg-[#080808]"
            data-docs-right-column
          >
            <div
              className="relative h-[55vh] w-full overflow-hidden p-4 lg:h-full lg:pt-3 lg:pr-3 lg:pb-3 lg:pl-1.5"
              data-docs-preview-shell
            >
              <DocsSidebarMobileAnchor />
              <DocsPreviewWrapper
                fullWidthPreview={fullWidthPreview}
                hideDefaultVariant={hideDefaultPreviewVariant}
                key={componentName}
                previewClassName={previewClassName}
                sourceCodeFilename={`${componentName}.tsx`}
                sourceCodeKey={componentName}
                variants={examples}
              >
                {preview}
              </DocsPreviewWrapper>
            </div>
          </div>
        </div>
      </ComponentDocsSidebarShell>
    </>
  );
}

export {
  DocsBreadcrumbs,
  ComponentDocsPage,
  GuideDocsPage,
  ComponentSection as DocsSection,
  DetailLedger,
  SectionPager,
  SectionPrevNextNav,
};
export type { BreadcrumbItem, DetailField, DetailItem };
export type { VariantItem } from "@/components/docs/split/docs-preview-wrapper";
