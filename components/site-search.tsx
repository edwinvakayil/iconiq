"use client";

import { Search } from "lucide-react";

import {
  CommandMenu,
  type CommandMenuGroupDef,
} from "@/components/command-menu";
import { SEARCH_ITEMS } from "@/lib/search-index";

type SiteSearchProps = {
  variant?: "desktop" | "mobile" | "menu";
};

const mobileSearchButtonClass =
  "flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground dark:hover:bg-white/10 dark:hover:text-white lg:hidden";

const mobileMenuSearchButtonClass =
  "flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-left text-[13px] text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground";

const searchGroups = SEARCH_ITEMS.reduce<CommandMenuGroupDef[]>(
  (groups, item) => {
    const existingGroup = groups.find(
      (group) => group.heading === item.section
    );

    const searchItem = {
      label: item.label,
      href: item.href,
      keywords: [...item.keywords, item.href, item.section, item.summary],
      description: item.summary,
    };

    if (existingGroup) {
      existingGroup.items.push(searchItem);
      return groups;
    }

    groups.push({
      heading: item.section,
      items: [searchItem],
    });

    return groups;
  },
  []
);

export function SiteSearch({ variant = "desktop" }: SiteSearchProps) {
  if (variant === "mobile") {
    return (
      <CommandMenu
        groups={searchGroups}
        placeholder="Search components, pages, actions…"
        trigger={
          <button
            aria-label="Open search"
            className={mobileSearchButtonClass}
            type="button"
          >
            <Search className="size-4.5" />
          </button>
        }
      />
    );
  }

  if (variant === "menu") {
    return (
      <CommandMenu
        groups={searchGroups}
        placeholder="Search components, pages, actions…"
        trigger={
          <button className={mobileMenuSearchButtonClass} type="button">
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span>Search docs...</span>
          </button>
        }
      />
    );
  }

  return (
    <CommandMenu
      className="lg:w-[min(680px,calc(100vw-2rem))]"
      groups={searchGroups}
      placeholder="Search components, pages, actions…"
      triggerProps={{
        className:
          "hidden rounded-xl border-0 bg-muted/90 hover:bg-muted lg:flex lg:w-[19rem] lg:max-w-[19rem] xl:w-[21rem] xl:max-w-[21rem]",
        label: "Search…",
        showShortcut: false,
      }}
    />
  );
}
