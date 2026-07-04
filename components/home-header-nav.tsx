"use client";

import {
  MotionNavigationMenu,
  MotionNavigationMenuItem,
  MotionNavigationMenuList,
  MotionNavigationMenuTopLink,
} from "@/components/iconiq-ui/primitives/navigation/motion-navigation-menu";
import { getHomeNavSectionLinks } from "@/lib/site-nav";
import { cn } from "@/lib/utils";

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

export function HomeHeaderNav({ className }: { className?: string }) {
  const homeNavLinks = getHomeNavSectionLinks();

  return (
    <MotionNavigationMenu className={cn("ml-3 justify-start", className)}>
      <MotionNavigationMenuList className="gap-0.5">
        {homeNavLinks.map((link) => (
          <NavTopLevelLink href={link.href} key={link.label}>
            {link.label}
          </NavTopLevelLink>
        ))}
      </MotionNavigationMenuList>
    </MotionNavigationMenu>
  );
}
