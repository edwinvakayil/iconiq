import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { CodeBlock } from "@/components/code-block";
import { CodeBlockInstall } from "@/components/code-block-install";
import { ComponentActions } from "@/components/component-actions";
import { Separator } from "@/components/ui/separator";
import { SITE_SECTIONS } from "@/lib/site-nav";
import { cn } from "@/lib/utils";
import { BreadcrumbJsonLdClient } from "@/seo/breadcrumb-json-ld-client";
import { ComponentDocJsonLd } from "@/seo/json-ld";

type BreadcrumbItem = {
  label: string;
  href?: string;
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

function DocsBreadcrumbs({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  const visibleItems = items.filter(
    (item) => item.label.toLowerCase() !== "docs"
  );
  const usesEditorialBreadcrumb =
    visibleItems.length >= 2 &&
    ["components", "getting started"].includes(
      visibleItems[0]?.label.toLowerCase() ?? ""
    );

  if (visibleItems.length === 0) {
    return null;
  }

  if (usesEditorialBreadcrumb) {
    return (
      <nav aria-label="Breadcrumb" className={cn("mb-4", className)}>
        <ol className="flex flex-wrap items-center gap-2.5 text-[13px] tracking-[-0.01em]">
          {visibleItems.map((item, index) => {
            const isLast = index === visibleItems.length - 1;

            return (
              <li
                className="inline-flex items-center gap-2.5"
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
                  <span className="font-medium text-foreground">
                    {item.label}
                  </span>
                ) : (
                  <span className="text-secondary">{item.label}</span>
                )}
                {isLast ? null : (
                  <span aria-hidden="true" className="text-muted-foreground/50">
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
          return (
            <li
              className="inline-flex items-center gap-2"
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
                <span aria-hidden="true" className="inline-flex">
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

const COMPONENT_NAV_ITEMS = SITE_SECTIONS.flatMap(
  (section) => section.children
);

function ComponentPager({ componentName }: { componentName: string }) {
  const currentHref = `/components/${componentName}`;
  const currentIndex = COMPONENT_NAV_ITEMS.findIndex(
    (item) => item.href === currentHref
  );

  if (currentIndex === -1) {
    return null;
  }

  const previousItem =
    currentIndex > 0 ? COMPONENT_NAV_ITEMS[currentIndex - 1] : null;
  const nextItem =
    currentIndex < COMPONENT_NAV_ITEMS.length - 1
      ? COMPONENT_NAV_ITEMS[currentIndex + 1]
      : null;

  const baseButtonClassName =
    "inline-flex size-11 items-center justify-center text-muted-foreground transition-colors hover:bg-muted/35 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

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
    <section className={cn("relative min-w-0 px-0 py-0", className)}>
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
      <div
        className={cn(
          "mx-auto w-full min-w-0 max-w-[1480px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10",
          className
        )}
      >
        <DocsBreadcrumbs items={breadcrumbs} />
        <DocsHero
          actions={heroActions}
          description={description}
          eyebrow={eyebrow}
          meta={meta}
          title={title}
        />
        <div className="mt-10 grid min-w-0 gap-5 lg:grid-cols-12">
          {children}
        </div>
      </div>
    </main>
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

function ComponentDocsPage({
  breadcrumbs,
  eyebrow = "",
  title,
  description,
  componentName,
  preview,
  previewDescription,
  usageCode,
  usageDescription,
  details,
  detailsDescription,
  meta,
  installDescription,
  actionDescription,
  railNotes,
  previewClassName,
}: {
  breadcrumbs: BreadcrumbItem[];
  eyebrow?: string;
  title: string;
  description: ReactNode;
  componentName: string;
  preview: ReactNode;
  previewDescription?: ReactNode;
  usageCode: string;
  usageDescription?: ReactNode;
  details: DetailItem[];
  detailsDescription?: ReactNode;
  meta?: HeroMetaItem[];
  installDescription?: ReactNode;
  actionDescription?: ReactNode;
  railNotes?: string[];
  previewClassName?: string;
}) {
  return (
    <>
      <ComponentDocJsonLd
        componentName={componentName}
        description={description}
        details={details}
        title={title}
      />
      <DocsPageShell
        breadcrumbs={breadcrumbs}
        description={description}
        eyebrow={eyebrow}
        heroActions={<ComponentPager componentName={componentName} />}
        meta={
          meta ?? [
            { label: "Package", value: `@iconiq/${componentName}` },
            { label: "Format", value: "Copy-paste registry file" },
            { label: "Theme", value: "White-first and dark ready" },
          ]
        }
        title={title}
      >
        <DocsSection
          className={cn("min-w-0 lg:col-span-8", previewClassName)}
          description={
            previewDescription ??
            "Preview the component in a quiet layout with room to inspect motion, spacing, and state changes."
          }
          index="01"
          title="Live Playground"
        >
          <div className="flex min-h-[320px] w-full items-center justify-center">
            {preview}
          </div>
        </DocsSection>

        <DocsSection
          className="min-w-0 lg:col-span-4"
          description={
            installDescription ??
            "Install the component directly into your codebase, then branch into v0 if you want to iterate on variations."
          }
          index="02"
          title="Install And Iterate"
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                Install
              </p>
              <div className="[&>div]:mt-0">
                <CodeBlockInstall componentName={componentName} />
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                Build with v0
              </p>
              <p className="text-[14px] text-secondary leading-6">
                {actionDescription ??
                  "Send the registry bundle into v0 when you want to explore new colorways, copy, or layout directions quickly."}
              </p>
              <ComponentActions name={componentName} />
            </div>
            {railNotes?.length ? (
              <>
                <Separator />
                <div className="space-y-3">
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                    Notes
                  </p>
                  <ul className="space-y-3">
                    {railNotes.map((note) => (
                      <li
                        className="relative pl-4 text-[14px] text-secondary leading-6 before:absolute before:top-[0.72rem] before:left-0 before:size-1 before:-translate-y-1/2 before:rounded-full before:bg-foreground/70 before:content-['']"
                        key={note}
                      >
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : null}
          </div>
        </DocsSection>

        <DocsSection
          className="min-w-0 lg:col-span-12"
          description={
            usageDescription ??
            "Drop the component into a local surface exactly as shown, then adjust props and class names to fit your app."
          }
          index="03"
          title="Usage"
        >
          <CodeBlock
            code={usageCode}
            heightClassName="h-[420px]"
            language="tsx"
            scrollable
            variant="embedded"
          />
        </DocsSection>

        <DocsSection
          className="min-w-0 lg:col-span-12"
          description={
            detailsDescription ??
            "Each item below covers the documented props and the behavior that matters during implementation."
          }
          index="04"
          title="API Details"
        >
          <DetailLedger details={details} />
        </DocsSection>
      </DocsPageShell>
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
