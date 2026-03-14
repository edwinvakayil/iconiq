"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ComponentPager } from "@/components/component-pager";
import { OnThisPage } from "@/components/on-this-page";
import { SidebarNav } from "@/components/sidebar-nav";
import { PackageManagerTabs } from "./package-manager-tabs";
import { PreviewTabs } from "./preview-tabs";
import { PropsTable, type PropsTableRow } from "./props-table";

export interface ComponentDocsLayoutProps {
  title: string;
  description: string;
  /** Registry component name for install command (e.g. "animated-badges", "chart") */
  componentName: string;
  /** Optional short description above the preview area */
  previewDescription?: string;
  /** Content for the Preview tab */
  previewChildren: React.ReactNode;
  /** Code string for the Code tab */
  codeSample: string;
  /** Tag shown in props table (e.g. "animated-badges") */
  propsTag: string;
  propsRows: PropsTableRow[];
  /** Optional link for "Build with v0" icon in preview tabs */
  buildWithHref?: string;
}

export function ComponentDocsLayout({
  title,
  description,
  componentName,
  previewDescription,
  previewChildren,
  codeSample,
  propsTag,
  propsRows,
  buildWithHref,
}: ComponentDocsLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-0px)] w-full min-w-0">
      <SidebarNav />

      <motion.main
        animate={{ opacity: 1 }}
        className="min-w-0 flex-1 overflow-x-hidden"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mx-auto w-full min-w-0 max-w-[760px] px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
          {/* Breadcrumb + pager */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-wrap items-center justify-between gap-3 sm:mb-10"
            initial={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground sm:text-[12px]">
              <Link
                className="transition-colors hover:text-foreground"
                href="/"
              >
                Docs
              </Link>
              <span className="text-muted-foreground/40">/</span>
              <Link
                className="transition-colors hover:text-foreground"
                href="/components/badges"
              >
                Components
              </Link>
              <span className="text-muted-foreground/40">/</span>
              <span className="font-medium text-foreground">{title}</span>
            </div>
            <div className="shrink-0">
              <ComponentPager />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 12 }}
            transition={{ delay: 0.05, duration: 0.35 }}
          >
            <h1 className="mb-3 font-bold text-2xl text-foreground leading-tight tracking-tight sm:mb-5 sm:text-3xl md:text-[3rem] md:leading-[1.05]">
              {title}
            </h1>
            <p className="max-w-[580px] text-muted-foreground text-sm leading-relaxed sm:text-base sm:leading-[1.75]">
              {description}
            </p>
          </motion.div>

          {/* Divider */}
          <div className="mb-8 h-px bg-border sm:mb-10" />

          {/* Installation */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 sm:mb-12"
            id="installation"
            initial={{ opacity: 0, y: 8 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <h2 className="mb-3 font-semibold text-[12px] text-muted-foreground uppercase tracking-widest sm:mb-4 sm:text-[13px]">
              Installation
            </h2>
            <PackageManagerTabs componentName={componentName} />
          </motion.div>

          {/* Demo */}
          <div className="mb-10 sm:mb-12" id="preview">
            <h2 className="mb-3 font-semibold text-[12px] text-muted-foreground uppercase tracking-widest sm:mb-4 sm:text-[13px]">
              Demo
            </h2>
            <PreviewTabs
              buildWithHref={buildWithHref}
              codeSample={codeSample}
              previewChildren={previewChildren}
              previewDescription={previewDescription}
            />
          </div>

          {/* API Reference */}
          <div className="mb-10 sm:mb-12" id="props">
            <h2 className="mb-3 font-semibold text-[12px] text-muted-foreground uppercase tracking-widest sm:mb-4 sm:text-[13px]">
              API Reference
            </h2>
            <PropsTable componentTag={propsTag} props={propsRows} />
          </div>
        </div>
      </motion.main>

      <OnThisPage />
    </div>
  );
}
