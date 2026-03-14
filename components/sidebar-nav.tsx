"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  {
    title: "Getting Started",
    items: [
      { label: "Introduction", href: "/introduction" },
      { label: "Installation", href: "/installation" },
    ],
  },
  {
    title: "Icons",
    items: [
      { label: "Icon Library", href: "/icons" },
      { label: "Button + Icon", href: "/icons/button-svg" },
    ],
  },
  {
    title: "Animated Components",
    items: [
      {
        label: "Accordion (Animated)",
        href: "/animated-components/accordion-animated",
      },
      {
        label: "Badges (Animated)",
        href: "/animated-components/animated-badges",
      },
      {
        label: "Hover Flip Card",
        href: "/animated-components/hover-flip-card",
      },
    ],
  },
  {
    title: "Components",
    items: [
      { label: "Input Groups", href: "/components/input-groups" },
      { label: "Breadcrumb", href: "/components/breadcrumbs" },
      { label: "Radio Group", href: "/components/radiogroup" },
      { label: "Alert", href: "/components/alert" },
      { label: "Chart", href: "/components/chart" },
      { label: "Select", href: "/components/select" },
      { label: "Slider", href: "/components/slider" },
      { label: "Smart Tooltip", href: "/components/smart-tooltip" },
      { label: "Access Request Banner", href: "/components/accessrequest" },
      { label: "File Tree", href: "/components/file-tree" },
      { label: "Magic Pen", href: "/components/magic-pen" },
      { label: "Drag Task List", href: "/components/drag-task" },
    ],
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Main navigation"
      className="hidden w-90 shrink-0 border-neutral-300 border-r lg:block dark:border-neutral-800"
    >
      <nav className="sticky top-[74px] max-h-[calc(100vh-74px)] overflow-y-auto py-6 pr-4 pl-0">
        <ul className="space-y-6">
          {nav.map((section) => (
            <li key={section.title}>
              <h2 className="mb-2 font-sans font-semibold text-[11px] text-neutral-500 uppercase tracking-wider dark:text-neutral-400">
                {section.title}
              </h2>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isExternal = item.href.startsWith("http");
                  const isActive = !isExternal && pathname === item.href;
                  const linkClass =
                    "block py-1 font-sans text-sm underline-offset-4 transition-colors hover:text-neutral-900 focus-visible:outline-1 focus-visible:outline-primary dark:hover:text-white " +
                    (isActive
                      ? "font-medium text-neutral-900 underline dark:text-white"
                      : "text-neutral-700 hover:underline dark:text-neutral-300");
                  return (
                    <li key={item.label}>
                      {isExternal ? (
                        <a
                          className={linkClass}
                          href={item.href}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link className={linkClass} href={item.href}>
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
