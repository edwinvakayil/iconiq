"use client";

import {
  BookOpen,
  type LucideIcon,
  Plug2,
  Store,
  Terminal,
  Type,
} from "lucide-react";

import {
  MotionNavigationMenu,
  MotionNavigationMenuContent,
  MotionNavigationMenuItem,
  MotionNavigationMenuList,
  MotionNavigationMenuNextLink,
  MotionNavigationMenuTopLink,
  MotionNavigationMenuTrigger,
} from "@/components/iconiq-ui/primitives/navigation/motion-navigation-menu";
import { cn } from "@/lib/utils";

type NavEntry = {
  description: string;
  href: string;
  icon: LucideIcon;
  label: string;
};

const navGridLinkClassName =
  "min-h-0 h-auto flex-col items-start gap-0 rounded-lg px-2 py-2 text-left hover:text-foreground focus:text-foreground";

const gettingStartedEntries: NavEntry[] = [
  {
    icon: BookOpen,
    label: "Introduction",
    description: "Start here and understand the Iconiq workflow.",
    href: "/introduction",
  },
  {
    icon: Terminal,
    label: "Installation",
    description: "Install the registry and wire components into your app.",
    href: "/installation",
  },
  {
    icon: Store,
    label: "Marketplace",
    description: "Browse and install components from the VS Code extension.",
    href: "/marketplace",
  },
  {
    icon: Plug2,
    label: "MCP",
    description: "Connect Iconiq to AI tools directly inside your editor.",
    href: "/mcp",
  },
  {
    icon: Type,
    label: "Typography",
    description: "Type scale and text styles for your product UI.",
    href: "/foundation/typography",
  },
];

function NavTopLevelLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <MotionNavigationMenuItem>
      <MotionNavigationMenuTopLink href={href}>
        {children}
      </MotionNavigationMenuTopLink>
    </MotionNavigationMenuItem>
  );
}

function NavGettingStartedGrid({ entries }: { entries: NavEntry[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-5 gap-y-3 p-2.5">
      {entries.map((entry) => {
        const Icon = entry.icon;

        return (
          <li key={entry.href}>
            <MotionNavigationMenuNextLink
              className={navGridLinkClassName}
              href={entry.href}
            >
              <span className="flex items-start gap-2.5">
                <Icon
                  aria-hidden
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  strokeWidth={1.75}
                />
                <span className="min-w-0">
                  <span className="block font-semibold text-foreground text-sm leading-none">
                    {entry.label}
                  </span>
                  <span className="mt-1 block text-muted-foreground text-xs leading-4">
                    {entry.description}
                  </span>
                </span>
              </span>
            </MotionNavigationMenuNextLink>
          </li>
        );
      })}
    </ul>
  );
}

export function HomeHeaderNav({ className }: { className?: string }) {
  return (
    <MotionNavigationMenu
      className={cn("ml-3 justify-start", className)}
      viewportClassName="bg-white dark:bg-black"
    >
      <MotionNavigationMenuList className="gap-0.5">
        <MotionNavigationMenuItem value="getting-started">
          <MotionNavigationMenuTrigger>
            Getting Started
          </MotionNavigationMenuTrigger>
          <MotionNavigationMenuContent
            className="w-[min(100vw-2rem,40rem)]"
            highlightClassName="bg-black/[0.035] dark:bg-white/[0.08]"
            innerClassName="p-0"
          >
            <NavGettingStartedGrid entries={gettingStartedEntries} />
          </MotionNavigationMenuContent>
        </MotionNavigationMenuItem>

        <NavTopLevelLink href="/navigation/accordion">
          Components
        </NavTopLevelLink>

        <NavTopLevelLink href="/buttons-and-actions/icon-bar">
          Special One
        </NavTopLevelLink>
      </MotionNavigationMenuList>
    </MotionNavigationMenu>
  );
}
