import { CirclePlus, RefreshCcw, Wrench } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DocsPageRail } from "@/components/docs/component-page-rail";
import { DocsBreadcrumbs } from "@/components/docs/page-shell";
import {
  PageReveal,
  PageStagger,
  PageStaggerItem,
} from "@/components/page-reveal";
import { LINK, SITE } from "@/constants";
import { type ChangelogEntry, getChangelogEntries } from "@/lib/changelog";
import { BreadcrumbJsonLdClient } from "@/seo/breadcrumb-json-ld-client";
import { createMetadata } from "@/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: `Changelog | ${SITE.NAME}`,
  description:
    "A running log of Iconiq product updates, component changes, and documentation improvements.",
  canonical: "/changelog",
  ogTitle: `${SITE.NAME} Changelog`,
  keywords: [
    "iconiq changelog",
    "ui library release notes",
    "react component changelog",
  ],
});

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Getting Started" },
  { label: "Changelog" },
];

function getEntryId(version: string) {
  return version.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function getGroupBadgeClass(label: string) {
  const normalized = label.toLowerCase();

  if (normalized === "added") {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
  }

  if (normalized === "updated") {
    return "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300";
  }

  if (normalized === "fixed") {
    return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
  }

  return "bg-muted/[0.2] text-foreground";
}

function getGroupIcon(label: string) {
  const normalized = label.toLowerCase();

  if (normalized === "added") {
    return CirclePlus;
  }

  if (normalized === "updated") {
    return RefreshCcw;
  }

  if (normalized === "fixed") {
    return Wrench;
  }

  return CirclePlus;
}

function ChangelogGroupSection({
  label,
  items,
}: {
  label: string;
  items: string[];
}) {
  const Icon = getGroupIcon(label);

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1 font-medium text-[13px] tracking-[-0.02em] ${getGroupBadgeClass(
            label
          )}`}
        >
          <Icon className="size-3.5" />
          {label}
        </span>
      </div>
      <ul className="list-disc space-y-2 pl-5 text-[15px] text-foreground leading-7 marker:text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function ChangelogEntrySection({ entry }: { entry: ChangelogEntry }) {
  return (
    <section
      className="relative scroll-mt-28 space-y-6 pl-8 sm:pl-10"
      id={getEntryId(entry.version)}
    >
      <div className="absolute top-1 left-2 flex size-4 -translate-x-1/2 items-center justify-center rounded-full bg-background ring-1 ring-border/80">
        <span className="size-2 rounded-full bg-foreground/85" />
      </div>
      <span
        aria-hidden="true"
        className="absolute top-[0.55rem] left-4 h-px w-4 bg-border/70 sm:w-6"
      />

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex rounded-md bg-muted/55 px-2.5 py-1 font-mono text-[12px] text-foreground tracking-[0.04em]">
            {entry.version}
          </span>
          <p className="font-mono text-[12px] text-muted-foreground tracking-[0.08em]">
            {entry.date}
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl text-foreground tracking-tight sm:text-[2rem]">
            {entry.title}
          </h2>
          {entry.summary ? (
            <p className="max-w-3xl text-[15px] text-secondary leading-7">
              {entry.summary}
            </p>
          ) : null}
        </div>
      </div>

      {entry.groups.length > 0 ? (
        <div className="space-y-6">
          {entry.groups.map((group) => (
            <ChangelogGroupSection
              items={group.items}
              key={`${entry.version}-${group.label}`}
              label={group.label}
            />
          ))}
        </div>
      ) : entry.changes ? (
        <div className="whitespace-pre-wrap text-[15px] text-foreground leading-7">
          {entry.changes}
        </div>
      ) : null}
    </section>
  );
}

export default async function ChangelogPage() {
  const entries = await getChangelogEntries();
  const latestEntry = entries[0];
  const sections = entries.map((entry) => ({
    id: getEntryId(entry.version),
    label: entry.version,
  }));

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
                          Changelog
                        </h1>
                        <p className="max-w-3xl text-base text-muted-foreground">
                          A running log of {SITE.NAME} updates, including new
                          components, documentation improvements, interface
                          polish, and fixes across the registry and site.
                        </p>
                      </div>
                    </div>
                  </header>
                </PageStaggerItem>
              </PageStagger>

              <div className="mt-10 space-y-10 text-[15px] text-secondary leading-7">
                <PageReveal inView>
                  <p>
                    Each entry captures what changed in the product and docs,
                    keeping the release history easy to scan without turning it
                    into a dense issue log.
                  </p>
                </PageReveal>

                {latestEntry ? (
                  <PageReveal inView>
                    <p className="text-foreground">
                      Latest release:{" "}
                      <span className="font-medium">{latestEntry.version}</span>{" "}
                      on {latestEntry.date}.
                    </p>
                  </PageReveal>
                ) : null}

                <PageReveal inView>
                  <div className="relative">
                    <div className="absolute top-3 bottom-3 left-2 w-px -translate-x-1/2 bg-border/70" />
                    <div className="space-y-10">
                      {entries.map((entry) => (
                        <ChangelogEntrySection
                          entry={entry}
                          key={`${entry.version}-${entry.date}`}
                        />
                      ))}
                    </div>
                  </div>
                </PageReveal>
              </div>

              <PageReveal className="mt-12" inView>
                <nav className="flex items-center justify-between border-border/80 border-t pt-12">
                  <Link
                    className="group flex max-w-40 flex-col gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    href="/mcp"
                  >
                    <span className="text-muted-foreground/75 transition-colors group-hover:text-muted-foreground">
                      Previous
                    </span>
                    <span className="truncate font-medium text-foreground">
                      MCP
                    </span>
                  </Link>
                  <div />
                </nav>
              </PageReveal>
            </article>
          </div>

          <DocsPageRail
            editHref={`${LINK.GITHUB}/edit/main/content/changelog.txt`}
            sections={sections}
          />
        </div>
      </div>
    </main>
  );
}
