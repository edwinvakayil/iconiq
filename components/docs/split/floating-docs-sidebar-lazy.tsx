"use client";

import dynamic from "next/dynamic";

import {
  DocsSidebarProvider,
  useDocsSidebar,
} from "@/components/docs/split/docs-sidebar-context";
import { DocsSidebarTrigger } from "@/components/docs/split/docs-sidebar-trigger";
import { cn } from "@/lib/utils";

const FloatingDocsSidebarPanel = dynamic(
  () =>
    import("@/components/docs/split/floating-docs-sidebar-panel").then(
      (mod) => mod.FloatingDocsSidebarPanel
    ),
  { ssr: false }
);

export function DocsSidebarDesktopAnchor({
  className,
  hideOnMobile = true,
}: {
  className?: string;
  /** Hide in the breadcrumb row below `lg` when a mobile preview anchor is used. */
  hideOnMobile?: boolean;
}) {
  const { desktopAnchorRef, isOpen } = useDocsSidebar();

  return (
    <div
      className={cn(
        "relative shrink-0",
        hideOnMobile && "max-lg:hidden",
        isOpen && "z-[60]",
        className
      )}
      ref={desktopAnchorRef}
    >
      <DocsSidebarTrigger />
    </div>
  );
}

export function DocsSidebarMobileAnchor({ className }: { className?: string }) {
  const { mobileAnchorRef } = useDocsSidebar();

  return (
    <div
      className={cn(
        "pointer-events-auto absolute top-6 left-6 z-[99] lg:hidden",
        className
      )}
      ref={mobileAnchorRef}
    >
      <DocsSidebarTrigger />
    </div>
  );
}

export function ComponentDocsSidebarShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DocsSidebarProvider>
      {children}
      <FloatingDocsSidebarPanel />
    </DocsSidebarProvider>
  );
}

export function FloatingDocsSidebarLazy() {
  return (
    <DocsSidebarProvider>
      <DocsSidebarDesktopAnchor hideOnMobile={false} />
      <FloatingDocsSidebarPanel />
    </DocsSidebarProvider>
  );
}
