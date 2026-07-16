"use client";

import {
  MotionNavigationMenu,
  MotionNavigationMenuContent,
  MotionNavigationMenuItem,
  MotionNavigationMenuList,
  MotionNavigationMenuNextLink,
  MotionNavigationMenuTopLink,
  MotionNavigationMenuTrigger,
} from "@/components/iconiq-ui/primitives/navigation/motion-navigation-menu";
import { getComponentCategoryLinks, getFirstBlockHref } from "@/lib/site-nav";
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
  const componentCategories = getComponentCategoryLinks();

  return (
    <MotionNavigationMenu className={cn("ml-3 justify-start", className)}>
      <MotionNavigationMenuList className="gap-0.5">
        <MotionNavigationMenuItem value="components">
          <MotionNavigationMenuTrigger>Components</MotionNavigationMenuTrigger>
          <MotionNavigationMenuContent>
            <div className="grid w-[26rem] grid-cols-2 gap-0.5">
              {componentCategories.map((category) => (
                <MotionNavigationMenuNextLink
                  className="flex-col items-start gap-0.5"
                  href={category.href}
                  key={category.label}
                >
                  <span className="font-medium">{category.label}</span>
                  <span className="text-muted-foreground text-xs">
                    {category.count}{" "}
                    {category.count === 1 ? "component" : "components"}
                  </span>
                </MotionNavigationMenuNextLink>
              ))}
            </div>
          </MotionNavigationMenuContent>
        </MotionNavigationMenuItem>
        <NavTopLevelLink href={getFirstBlockHref()}>Blocks</NavTopLevelLink>
        <NavTopLevelLink href="/installation">Docs</NavTopLevelLink>
        <NavTopLevelLink href="/marketplace">Marketplace</NavTopLevelLink>
      </MotionNavigationMenuList>
    </MotionNavigationMenu>
  );
}
