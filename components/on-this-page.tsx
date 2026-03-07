"use client";

import { usePathname } from "next/navigation";

import { BASE_LINKS, PAGE_SECTIONS, SITE_SECTIONS } from "@/lib/site-nav";

type TocLink = { label: string; href: string };
type TocCategory = { label: string; children: TocLink[] };
type TocEntry = TocLink | TocCategory;

function isCategory(entry: TocEntry): entry is TocCategory {
  return "children" in entry;
}

function getTocForPath(pathname: string): TocEntry[] {
  const base: TocEntry[] = [...BASE_LINKS];

  if (pathname === "/") return [BASE_LINKS[0]];
  if (pathname === "/introduction") return base.slice(0, 2);
  if (pathname === "/installation") return base;

  const toc: TocEntry[] = [...base];

  const hasIcons = () => toc.some((e) => isCategory(e) && e.label === "Icons");

  if (pathname === "/icons" || pathname.startsWith("/icons/")) {
    toc.push({
      label: SITE_SECTIONS[0].label,
      children: [...SITE_SECTIONS[0].children],
    });
  }
  if (pathname.startsWith("/components/")) {
    if (!hasIcons())
      toc.push({
        label: SITE_SECTIONS[0].label,
        children: [...SITE_SECTIONS[0].children],
      });
    toc.push({
      label: SITE_SECTIONS[1].label,
      children: [...SITE_SECTIONS[1].children],
    });
  }
  if (pathname.startsWith("/contributing/") && !hasIcons())
    toc.push({
      label: SITE_SECTIONS[0].label,
      children: [...SITE_SECTIONS[0].children],
    });

  return toc;
}

export function OnThisPage() {
  const pathname = usePathname();
  const toc = getTocForPath(pathname);

  const linkClass = (href: string, isAnchor = false) =>
    `block py-0.5 font-sans text-[13px] underline-offset-4 transition-colors hover:text-neutral-900 hover:underline focus-visible:outline-1 focus-visible:outline-primary ${
      !isAnchor && pathname === href
        ? "font-medium text-neutral-900 underline"
        : "text-neutral-600"
    }`;

  return (
    <aside
      aria-label="On this page"
      className="hidden w-72 shrink-0 border-neutral-200 bg-background xl:block"
    >
      <nav className="sticky top-0 z-10 max-h-[calc(100vh-0px)] overflow-y-auto bg-background py-6 pr-6 pl-4">
        <h2 className="mb-3 font-sans font-semibold text-[11px] text-neutral-500 uppercase tracking-wider">
          On this page
        </h2>
        <ul className="space-y-1">
          {toc.map((entry) => {
            if (isCategory(entry)) {
              return (
                <li key={entry.label}>
                  <span className="block py-1 pt-2 font-sans font-semibold text-[11px] text-neutral-500 uppercase tracking-wider">
                    {entry.label}
                  </span>
                  <ul className="space-y-0.5 pl-4">
                    {entry.children.map((child) => {
                      const pageSections =
                        pathname === child.href
                          ? PAGE_SECTIONS[pathname]
                          : undefined;
                      return (
                        <li key={child.href + child.label}>
                          <a
                            className={linkClass(child.href)}
                            href={child.href}
                          >
                            {child.label}
                          </a>
                          {pageSections?.length ? (
                            <ul className="mt-0.5 space-y-0.5 pl-4">
                              {pageSections.map((section) => (
                                <li key={section.id}>
                                  <a
                                    className={linkClass("#", true)}
                                    href={`#${section.id}`}
                                  >
                                    {section.label}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            }
            return (
              <li key={entry.href + entry.label}>
                <a className={linkClass(entry.href)} href={entry.href}>
                  {entry.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
