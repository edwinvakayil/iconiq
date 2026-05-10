"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";

import { DocsCodeSnippet } from "@/components/docs/code-snippet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SITE } from "@/constants";
import { cn } from "@/lib/utils";

function V0Icon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="currentColor"
      viewBox="0 0 40 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z" />
      <path d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z" />
    </svg>
  );
}

export function ComponentDemoCanvas({
  componentName,
  preview,
  previewClassName,
  code,
}: {
  componentName: string;
  preview: React.ReactNode;
  previewClassName?: string;
  code: string;
}) {
  const [previewKey, setPreviewKey] = useState(0);

  return (
    <Tabs className="gap-0" defaultValue="preview">
      <div className="not-prose mb-4 flex items-center justify-between gap-3">
        <TabsList className="gap-1 border-0 bg-transparent p-0">
          <TabsTrigger
            className="cursor-pointer px-2.5 py-1.5 text-center font-medium text-sm normal-case tracking-normal"
            value="preview"
          >
            Preview
          </TabsTrigger>
          <TabsTrigger
            className="cursor-pointer px-2.5 py-1.5 text-center font-medium text-sm normal-case tracking-normal"
            value="code"
          >
            Code
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-1.5">
          <a
            className="inline-flex h-8 items-center gap-1 rounded-md bg-neutral-950 px-3 text-white text-xs transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
            href={`https://v0.dev/chat/api/open?url=${SITE.URL}/r/${componentName}.json`}
            rel="noreferrer"
            target="_blank"
          >
            <span>Open in</span>
            <V0Icon className="h-3.5 w-auto" />
          </a>
          <button
            aria-label="Refresh preview"
            className="inline-flex rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={() => setPreviewKey((current) => current + 1)}
            type="button"
          >
            <RefreshCw className="size-4" />
          </button>
        </div>
      </div>

      <TabsContent className="mt-0" value="preview">
        <div
          className={cn(
            "not-prose flex h-full min-h-64 w-full items-center justify-center overflow-hidden rounded-sm border border-border/80 p-6 md:min-h-80 md:p-10",
            "bg-background dark:bg-[#0F0F0F]",
            previewClassName
          )}
        >
          <div
            className="flex h-full w-full items-center justify-center"
            key={previewKey}
          >
            {preview}
          </div>
        </div>
      </TabsContent>

      <TabsContent className="mt-0 [&_pre]:my-0" value="code">
        <DocsCodeSnippet code={code} />
      </TabsContent>
    </Tabs>
  );
}
