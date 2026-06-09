"use client";

import { LINK } from "@/constants";
import { cn } from "@/lib/utils";
import { RadialButton } from "@/registry/radial-button";

export function BuyMeACoffeeEmbed({ className }: { className?: string }) {
  return (
    <RadialButton
      className={cn(className)}
      onClick={() => {
        window.open(LINK.BUYMEACOFFEE, "_blank", "noopener,noreferrer");
      }}
    >
      Buy Me a Coffee
    </RadialButton>
  );
}
