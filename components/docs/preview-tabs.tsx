"use client";

import { motion } from "framer-motion";
import { Code2, ExternalLink, Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function PreviewTabs({
  previewDescription,
  previewChildren,
  codeSample,
  buildWithHref,
}: {
  previewDescription?: string;
  previewChildren: React.ReactNode;
  codeSample: string;
  buildWithHref?: string;
}) {
  const [active, setActive] = useState("PREVIEW");
  const tabs = [
    { label: "PREVIEW", icon: Play },
    { label: "CODE", icon: Code2 },
  ];

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="min-w-0 rounded-2xl border border-border bg-card shadow-sm dark:border-border dark:bg-card"
      initial={{ opacity: 0, y: 8 }}
      transition={{ delay: 0.15, duration: 0.3 }}
    >
      <div className="flex min-w-0 items-center justify-between gap-2 border-border border-b px-3 sm:px-5 dark:border-border">
        <div className="flex min-w-0 gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                className={cn(
                  "-mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-2.5 py-2.5 font-medium text-[11px] transition-all sm:px-3 sm:py-3 sm:text-[12px]",
                  active === t.label
                    ? "border-primary text-foreground dark:border-primary dark:text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground"
                )}
                key={t.label}
                onClick={() => setActive(t.label)}
                type="button"
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
        {buildWithHref && (
          <a
            aria-label="Build with v0"
            className="text-muted-foreground transition-colors hover:text-foreground"
            href={buildWithHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
      <div className="overflow-visible p-4 sm:p-6">
        {active === "PREVIEW" ? (
          <div className="min-h-[100px] overflow-visible sm:min-h-[120px]">
            {previewDescription && (
              <p className="mb-4 text-[12px] text-muted-foreground leading-relaxed sm:mb-5 sm:text-[13px] dark:text-muted-foreground">
                {previewDescription}
              </p>
            )}
            {previewChildren}
          </div>
        ) : (
          <pre className="min-w-0 overflow-x-auto font-mono text-[12px] text-muted-foreground leading-[1.8] [scrollbar-width:thin] sm:text-[13px] dark:text-muted-foreground">
            {codeSample}
          </pre>
        )}
      </div>
    </motion.div>
  );
}
