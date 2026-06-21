"use client";

import { useDocsSidebar } from "@/components/docs/split/docs-sidebar-context";
import { SidebarToggleIcon } from "@/components/docs/split/sidebar-toggle-icon";
import { cn } from "@/lib/utils";

export function DocsSidebarTrigger() {
  const { isOpen, setIsOpen } = useDocsSidebar();

  return (
    <button
      aria-expanded={isOpen}
      aria-label={isOpen ? "Close navigation" : "Open navigation"}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded text-zinc-500 transition-colors duration-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      )}
      onClick={(event) => {
        event.stopPropagation();
        setIsOpen((open) => !open);
      }}
      type="button"
    >
      <SidebarToggleIcon isOpen={isOpen} />
    </button>
  );
}
