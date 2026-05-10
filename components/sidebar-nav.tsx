"use client";

import { usePathname } from "next/navigation";

import {
  Sidebar001,
  Sidebar001Content,
  Sidebar001Item,
  Sidebar001Section,
} from "@/components/sidebar-001";
import { BASE_LINKS, SITE_SECTIONS } from "@/lib/site-nav";

type SidebarItem = {
  label: string;
  href: string;
};

type SidebarSection = {
  title: string;
  items: SidebarItem[];
};

const sections: SidebarSection[] = [
  {
    title: "Getting Started",
    items: BASE_LINKS.filter(
      (item) => item.href !== "/" && item.href !== "/changelog"
    ).map((item) => ({
      label: item.label,
      href: item.href,
    })),
  },
  ...SITE_SECTIONS.map((section) => ({
    title: section.label,
    items: section.children.map((item) => ({
      label: item.label,
      href: item.href,
    })),
  })),
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar001
      className="sticky top-[var(--nav-stack-height-mobile)] hidden h-[calc(100vh-var(--nav-stack-height-mobile)-1.5rem)] md:flex lg:top-[var(--nav-stack-height-desktop)] lg:h-[calc(100vh-var(--nav-stack-height-desktop)-1.5rem)]"
      defaultWidth={256}
      maxWidth={360}
      minWidth={224}
    >
      <nav
        aria-label="Documentation navigation"
        className="flex min-h-0 flex-1"
      >
        <Sidebar001Content className="py-3">
          {sections.map((section) => (
            <Sidebar001Section
              className="px-2"
              key={section.title}
              label={section.title}
            >
              {section.items.map((item) => (
                <Sidebar001Item
                  className="transition-colors duration-150 hover:text-foreground"
                  href={item.href}
                  isActive={pathname === item.href}
                  key={item.href}
                  label={item.label}
                />
              ))}
            </Sidebar001Section>
          ))}
        </Sidebar001Content>
      </nav>
    </Sidebar001>
  );
}
