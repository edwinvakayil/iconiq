"use client";

import { usePathname } from "next/navigation";

import {
  Sidebar001Content,
  Sidebar001Item,
  Sidebar001Section,
} from "@/components/sidebar-001";
import { SITE_SECTIONS } from "@/lib/site-nav";
import { cn } from "@/lib/utils";

type SidebarItem = {
  label: string;
  href: string;
};

type SidebarSection = {
  title: string;
  items: SidebarItem[];
};

const sections: SidebarSection[] = SITE_SECTIONS.map((section) => ({
  title: section.label,
  items: section.children.map((item) => ({
    label: item.label,
    href: item.href,
  })),
}));

export function DocsSidebarNavContent({
  contentClassName,
  onNavigate,
}: {
  contentClassName?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <Sidebar001Content className={cn("py-3", contentClassName)}>
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
              onClick={onNavigate}
            />
          ))}
        </Sidebar001Section>
      ))}
    </Sidebar001Content>
  );
}
