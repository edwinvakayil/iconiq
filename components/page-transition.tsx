"use client";

import { ViewTransition } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      default="none"
      enter="page-blur-fade"
      exit="page-blur-fade"
      share="none"
      update="page-blur-fade"
    >
      <div className="page-transition-shell min-h-0 w-full min-w-0">
        {children}
      </div>
    </ViewTransition>
  );
}
