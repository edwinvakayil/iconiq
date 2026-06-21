import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  children: ReactNode;
  id?: string;
  className?: string;
}

export function DocsSection({ title, children, id, className }: SectionProps) {
  const sectionId = id || title.toLowerCase().replace(/\s+/g, "-");

  return (
    <div
      className={cn("scroll-mt-20", className)}
      data-section-title={title}
      id={sectionId}
    >
      <h2 className="mb-6 font-semibold text-2xl text-zinc-900 tracking-tight dark:text-zinc-100">
        {title}
      </h2>

      <div className="space-y-4">{children}</div>
    </div>
  );
}
