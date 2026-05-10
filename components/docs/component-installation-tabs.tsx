"use client";

import { useEffect, useState } from "react";

import { CodeBlockInstall } from "@/components/code-block-install";
import { DocsCodeSnippet } from "@/components/docs/code-snippet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type RegistryResponse = {
  files?: Array<{
    content?: string;
  }>;
};

function RegistrySourceCode({ componentName }: { componentName: string }) {
  const [content, setContent] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch(`/r/${componentName}.json`);
        const data = (await response.json()) as RegistryResponse;
        const source = data.files?.[0]?.content ?? "";

        if (cancelled) {
          return;
        }

        setContent(source);
        setStatus(source ? "done" : "error");
      } catch {
        if (!cancelled) {
          setStatus("error");
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [componentName]);

  if (status === "loading") {
    return (
      <div className="rounded-2xl border border-border/80 px-4 py-6 text-muted-foreground text-sm">
        Loading registry source...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-2xl border border-border/80 px-4 py-6 text-muted-foreground text-sm">
        The registry source could not be loaded for this component.
      </div>
    );
  }

  return <DocsCodeSnippet code={content} />;
}

export function ComponentInstallationTabs({
  componentName,
}: {
  componentName: string;
}) {
  return (
    <Tabs className="gap-0" defaultValue="cli">
      <TabsList className="mb-3 gap-1 border-0 bg-transparent p-0">
        <TabsTrigger
          className="cursor-pointer px-2.5 py-1.5 text-center font-medium text-sm normal-case tracking-normal"
          value="cli"
        >
          CLI
        </TabsTrigger>
        <TabsTrigger
          className="cursor-pointer px-2.5 py-1.5 text-center font-medium text-sm normal-case tracking-normal"
          value="manual"
        >
          Manual
        </TabsTrigger>
      </TabsList>

      <TabsContent className="mt-0" value="cli">
        <CodeBlockInstall componentName={componentName} />
      </TabsContent>

      <TabsContent className="mt-0" value="manual">
        <RegistrySourceCode componentName={componentName} />
      </TabsContent>
    </Tabs>
  );
}
