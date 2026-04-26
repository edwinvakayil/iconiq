"use client";

import { fileUploadApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { FileUpload } from "@/registry/file-upload";

const usageCode = `"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";

export function AssetUploader() {
  const [queuedFiles, setQueuedFiles] = useState<File[]>([]);
  const [readyFiles, setReadyFiles] = useState<File[]>([]);

  return (
    <div className="w-full max-w-xl space-y-4">
      <FileUpload
        accept="image/*,.pdf"
        maxFiles={4}
        name="assets"
        onFilesChange={setQueuedFiles}
        onUploadComplete={setReadyFiles}
      />

      <div className="space-y-1 text-sm text-muted-foreground">
        <p>{queuedFiles.length} file(s) in the queue</p>
        <p>{readyFiles.length} file(s) ready to submit</p>
      </div>
    </div>
  );
}`;

function FileUploadPreview() {
  return (
    <div className="w-full">
      <FileUpload />
    </div>
  );
}

export default function FileUploadPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "File Upload" },
      ]}
      componentName="file-upload"
      description="Drag-and-drop file uploader with click-to-browse fallback, queued file rows, image previews, and animated removal."
      details={fileUploadApiDetails}
      preview={<FileUploadPreview />}
      previewDescription="Drop files onto the surface, click to browse, then remove queued items to inspect the built-in preview and list behavior."
      title="File Upload"
      usageCode={usageCode}
      usageDescription="Use the uploader as-is for the built-in queue UI, then hook into the provided callbacks when you need to track selected files, limit uploads, or hand completed files to your own form or API flow."
    />
  );
}
