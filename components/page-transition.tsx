"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

import { supportsViewTransitions } from "@/lib/motion-tier";
import { useMotionTier } from "@/providers/motion-tier";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const tier = useMotionTier();
  const useViewTransition = supportsViewTransitions(tier);
  const isHome = pathname === "/";

  useLayoutEffect(() => {
    const root = document.documentElement;

    if (!useViewTransition) {
      delete root.dataset.pageTransition;
      return;
    }

    root.dataset.pageTransition = isHome ? "home" : "page";

    return () => {
      delete root.dataset.pageTransition;
    };
  }, [isHome, useViewTransition]);

  return (
    <div className="page-transition-shell min-h-0 w-full min-w-0">
      {children}
    </div>
  );
}
