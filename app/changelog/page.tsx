import { CheckCheck, Wrench } from "lucide-react";
import type { Metadata } from "next";

import { DocsPageShell } from "@/components/docs/page-shell";
import { SITE } from "@/constants";
import { type ChangelogEntry, getChangelogEntries } from "@/lib/changelog";
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

function getGroupBadgeClass(label: string) {
  const normalized = label.toLowerCase();

  if (normalized === "added") {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
  }

  if (normalized === "updated") {
    return "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300";
  }

  if (normalized === "fixed") {
    return "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300";
  }

  return "bg-muted/[0.2] text-foreground";
}

function getGroupIcon(label: string) {
  const normalized = label.toLowerCase();

  if (normalized === "added") {
    return CheckCheck;
  }

  if (normalized === "updated") {
    return CheckCheck;
  }

  if (normalized === "fixed") {
    return Wrench;
  }

  return CheckCheck;
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
    <section className="space-y-4 border-border/80 border-t pt-5 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-medium text-[13px] tracking-[-0.02em] ${getGroupBadgeClass(
            label
          )}`}
        >
          <Icon className="size-3.5" />
          {label}
        </span>
      </div>
      <ul className="space-y-2.5 pl-5 text-[15px] text-foreground leading-7 marker:text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function ChangelogTimelineItem({
  entry,
  index,
}: {
  entry: ChangelogEntry;
  index: number;
}) {
  return (
    <article className="grid gap-5 md:grid-cols-[minmax(0,220px)_34px_minmax(0,1fr)] md:gap-7">
      <div className="space-y-1.5 pt-0.5 text-left md:text-right">
        <p className="font-medium text-[15px] text-foreground">{entry.date}</p>
        <p className="font-mono text-[12px] text-muted-foreground tracking-[0.08em]">
          {entry.version}
        </p>
      </div>

      <div className="relative hidden justify-center md:flex">
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 border-border/80 border-l border-dashed" />
        <span
          className="status-blink relative mt-1 size-3 rounded-full bg-foreground ring-4 ring-background dark:ring-neutral-950"
          style={{ animationDelay: `${index * 180}ms` }}
        />
      </div>

      <div className="space-y-6">
        <div className="border border-border/80 bg-background px-5 py-5 shadow-[0_1px_0_rgba(17,17,17,0.03)] sm:px-6 sm:py-6 dark:shadow-none">
          <div className="space-y-5">
            <div className="space-y-3">
              <h2 className="text-[1.9rem] text-foreground tracking-[-0.06em] sm:text-[2.1rem]">
                {entry.title}
              </h2>
              {entry.summary ? (
                <p className="max-w-3xl text-[15px] text-secondary leading-7">
                  {entry.summary}
                </p>
              ) : null}
            </div>

            {entry.groups.length > 0 ? (
              <div className="space-y-5">
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
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function ChangelogPage() {
  const entries = await getChangelogEntries();
  const latestEntry = entries[0];

  return (
    <DocsPageShell
      breadcrumbs={[]}
      description="See what's new added, changed, fixed, improved or updated."
      eyebrow=""
      meta={[
        { label: "Latest", value: latestEntry?.version || "Unavailable" },
        { label: "Entries", value: String(entries.length) },
      ]}
      title="Changelog"
    >
      <div className="lg:col-span-12">
        <div className="space-y-10">
          {entries.map((entry, index) => (
            <ChangelogTimelineItem
              entry={entry}
              index={index}
              key={`${entry.version}-${entry.date}`}
            />
          ))}
        </div>
      </div>
    </DocsPageShell>
  );
}
