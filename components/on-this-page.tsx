"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BASE_LINKS, PAGE_SECTIONS, SITE_SECTIONS } from "@/lib/site-nav";

type OnThisPageProps = {
  /**
   * For the input groups page, indicates which accordion group is open.
   * Used to hide subsection links (Preview, Usage, Props) when their
   * corresponding accordion panel is collapsed.
   */
  inputGroupsOpenGroup?: string;
};

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
  if (pathname.startsWith("/animated-components/")) {
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
  return toc;
}

export function OnThisPage({ inputGroupsOpenGroup }: OnThisPageProps) {
  const pathname = usePathname();
  const toc = getTocForPath(pathname);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount; sections are re-bound on navigation via remount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const sections = PAGE_SECTIONS[pathname] ?? [];

    const updateFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setActiveSectionId(hash);
      }
    };

    updateFromHash();

    let observer: IntersectionObserver | null = null;
    let domObserver: MutationObserver | null = null;
    const observedIds = new Set<string>();

    if (sections.length) {
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort(
              (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
            );

          if (visible.length > 0) {
            setActiveSectionId(visible[0].target.id);
          }
        },
        {
          root: null,
          rootMargin: "-40% 0px -40% 0px",
          threshold: 0.1,
        }
      );

      const observeAvailableSections = () => {
        sections.forEach((section) => {
          if (observedIds.has(section.id)) return;
          const el = document.getElementById(section.id);
          if (!el) return;
          observer?.observe(el);
          observedIds.add(section.id);
        });
      };

      // Initial bind (some sections may not exist yet, e.g. accordion content).
      observeAvailableSections();

      // Re-bind as sections mount/unmount (Radix Accordion unmounts closed panels).
      domObserver = new MutationObserver(() => {
        observeAvailableSections();
      });
      domObserver.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener("hashchange", updateFromHash);

    return () => {
      window.removeEventListener("hashchange", updateFromHash);
      if (domObserver) domObserver.disconnect();
      if (observer) observer.disconnect();
    };
  }, []);

  const linkClass = (href: string, isAnchor = false) =>
    `block py-0.5 font-sans text-[13px] underline-offset-4 transition-colors hover:text-neutral-900 hover:underline focus-visible:outline-1 focus-visible:outline-primary dark:hover:text-white ${
      !isAnchor && pathname === href
        ? "font-medium text-neutral-900 underline dark:text-white"
        : "text-neutral-600 dark:text-neutral-300"
    }`;

  const sectionLinkClass = (id: string) =>
    `block py-0.5 pl-3 font-sans text-[13px] border-l-2 transition-colors ${
      activeSectionId === id
        ? "border-primary dark:border-white font-semibold text-neutral-950 dark:text-white"
        : "border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-300"
    }`;

  const isInputGroups = pathname === "/components/input-groups";
  const isAnimatedComponent = pathname.startsWith("/animated-components/");
  const isPasswordFieldActive =
    activeSectionId === "password-field" ||
    activeSectionId === "preview" ||
    activeSectionId === "usage" ||
    activeSectionId === "props";

  const isInputLabelActive =
    activeSectionId === "input-label" ||
    activeSectionId === "input-label-preview" ||
    activeSectionId === "input-label-usage" ||
    activeSectionId === "input-label-props";

  const parentSectionLinkClass = (isActive: boolean) =>
    `block py-0.5 font-sans text-[13px] transition-colors ${
      isActive
        ? "font-semibold text-neutral-950 dark:text-white"
        : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300"
    }`;

  return (
    <aside
      aria-label="On this page"
      className="hidden w-72 shrink-0 border-neutral-200 xl:block dark:border-neutral-800"
    >
      <nav className="sticky top-[74px] z-10 max-h-[calc(100vh-74px)] overflow-y-auto py-6 pr-6 pl-4">
        <h2 className="mb-3 font-sans font-semibold text-[11px] text-neutral-500 uppercase tracking-wider dark:text-neutral-400">
          On this page
        </h2>
        {pathname.startsWith("/icons") ? (
          <ul className="mt-1 space-y-0.5">
            {SITE_SECTIONS.find((section) => section.label === "Icons")
              ?.children.filter((child) => child.href === pathname)
              .map((child) => (
                <li key={child.href}>
                  <a className={linkClass(child.href)} href={child.href}>
                    {child.label}
                  </a>
                </li>
              ))}
          </ul>
        ) : (pathname.startsWith("/animated-components/") ||
            pathname.startsWith("/components/")) &&
          PAGE_SECTIONS[pathname]?.length ? (
          isInputGroups ? (
            <ul className="mt-1 space-y-1">
              <li>
                <a
                  className={parentSectionLinkClass(isPasswordFieldActive)}
                  href="#password-field"
                >
                  Password field
                </a>
              </li>
              <li>
                <a
                  className={parentSectionLinkClass(isInputLabelActive)}
                  href="#input-label"
                >
                  Input Label
                </a>
              </li>
            </ul>
          ) : (
            <ul className="mt-1 space-y-0.5">
              <li>
                <a
                  className={`block py-0.5 font-sans text-[13px] transition-colors ${
                    activeSectionId === "preview"
                      ? "font-semibold text-neutral-950 dark:text-white"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300"
                  }`}
                  href="#preview"
                >
                  {isAnimatedComponent
                    ? SITE_SECTIONS[1].children.find(
                        (child) => child.href === pathname
                      )?.label ?? "Preview"
                    : "Preview"}
                </a>
              </li>
            </ul>
          )
        ) : (
          <ul className="space-y-1">
            {toc.map((entry) => {
              if (isCategory(entry)) {
                return (
                  <li key={entry.label}>
                    <span className="block py-1 pt-2 font-sans font-semibold text-[11px] text-neutral-500 uppercase tracking-wider dark:text-neutral-400">
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
                                      className={sectionLinkClass(section.id)}
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
        )}
      </nav>
    </aside>
  );
}
