"use client";

import { usePathname } from "next/navigation";
import { ViewTransition } from "react";

import { supportsViewTransitions } from "@/lib/motion-tier";
import { useMotionTier } from "@/providers/motion-tier";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const tier = useMotionTier();
  const isHome = pathname === "/";
  const useViewTransition = supportsViewTransitions(tier);

  const shell = (
    <div className="page-transition-shell min-h-0 w-full min-w-0">
      {children}
    </div>
  );

  if (!useViewTransition) {
    return shell;
  }

  return (
    <ViewTransition
      default="none"
      enter={isHome ? "none" : "page-fade"}
      exit="page-fade"
      share="none"
      update="page-fade"
    >
      {shell}
    </ViewTransition>
  );
}
