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
    title: "Contributing",
    items: [
      { label: "Introduction", href: "/contributing/introduction" },
      { label: "Contributing Code", href: "/contributing/code" },
    ],
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Main navigation"
      className="hidden w-90 shrink-0 border-neutral-200 border-r bg-background lg:block"
    >
      <nav className="sticky top-0 max-h-[calc(100vh-0px)] overflow-y-auto py-6 pr-4 pl-0">
        <ul className="space-y-6">
          {nav.map((section) => (
            <li key={section.title}>
              <h2 className="mb-2 font-sans font-semibold text-[11px] text-neutral-500 uppercase tracking-wider">
                {section.title}
              </h2>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isExternal = item.href.startsWith("http");
                  const isActive = !isExternal && pathname === item.href;
                  const linkClass =
                    "block py-1 font-sans text-sm underline-offset-4 transition-colors hover:text-neutral-900 focus-visible:outline-1 focus-visible:outline-primary " +
                    (isActive
                      ? "font-medium text-neutral-900 underline"
                      : "text-neutral-700 hover:underline");
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
